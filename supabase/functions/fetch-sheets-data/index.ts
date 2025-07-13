import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function parseCSV(csvText: string) {
  const lines = csvText.split('\n');
  const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
  const records = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const values = line.split(',').map(v => v.replace(/"/g, '').trim());
    const record: any = {};
    
    headers.forEach((header, index) => {
      record[header] = values[index] || '';
    });
    
    records.push(record);
  }
  
  return records;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { spreadsheetId, sheetUrl } = await req.json();
    
    if (!spreadsheetId && !sheetUrl) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'ID atau URL Google Sheets diperlukan'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    let sheetId = spreadsheetId;
    
    // Extract sheet ID from URL if provided
    if (sheetUrl && !sheetId) {
      const sheetIdMatch = sheetUrl.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
      if (sheetIdMatch) {
        sheetId = sheetIdMatch[1];
      }
    }

    if (!sheetId) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'ID Google Sheets tidak valid'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('📥 Fetching data from Google Sheets:', sheetId);

    // Access the sheet as CSV export (public access)
    const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;
    
    try {
      const response = await fetch(csvUrl);
      
      if (response.status !== 200) {
        console.log('❌ Failed to fetch sheet data:', response.status);
        return new Response(
          JSON.stringify({ 
            success: false,
            error: 'Google Sheets tidak dapat diakses. Pastikan sheet dapat diakses publik.'
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      const csvContent = await response.text();
      
      if (!csvContent || csvContent.trim().length === 0) {
        console.log('❌ Sheet is empty');
        return new Response(
          JSON.stringify({ 
            success: true,
            records: []
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      // Parse CSV content
      const records = parseCSV(csvContent);
      
      console.log(`✅ Successfully fetched ${records.length} records from Google Sheets`);
      
      return new Response(
        JSON.stringify({ 
          success: true,
          records: records
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );

    } catch (fetchError) {
      console.error('❌ Error fetching sheet data:', fetchError);
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Gagal mengambil data dari Google Sheets. Periksa koneksi internet dan izin akses sheet.'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

  } catch (error) {
    console.error('❌ Fetch sheets data error:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || 'Terjadi kesalahan saat mengambil data'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});