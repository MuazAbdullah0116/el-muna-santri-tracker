import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sheetUrl } = await req.json();
    
    if (!sheetUrl) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'URL Google Sheets diperlukan'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('🔍 Verifying sheet access:', sheetUrl);

    // Extract sheet ID from URL
    const sheetIdMatch = sheetUrl.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    if (!sheetIdMatch) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Format URL Google Sheets tidak valid'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const sheetId = sheetIdMatch[1];
    
    // Try to access the sheet as CSV export (public access)
    const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;
    
    try {
      const response = await fetch(csvUrl);
      
      if (response.status === 200) {
        const csvContent = await response.text();
        
        // Check if we got actual CSV content (not an error page)
        if (csvContent.includes('ID,Nama Santri,Tanggal') || csvContent.includes('setoran')) {
          console.log('✅ Sheet access verified successfully');
          return new Response(
            JSON.stringify({ 
              success: true,
              message: 'Google Sheets dapat diakses'
            }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        } else {
          console.log('❌ Sheet content format invalid');
          return new Response(
            JSON.stringify({ 
              success: false,
              error: 'Google Sheets tidak memiliki format data yang benar atau kosong'
            }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }
      } else {
        console.log('❌ Sheet access failed:', response.status);
        return new Response(
          JSON.stringify({ 
            success: false,
            error: 'Google Sheets tidak dapat diakses. Pastikan sheet dapat diakses publik dengan link.'
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
    } catch (fetchError) {
      console.error('❌ Error accessing sheet:', fetchError);
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Gagal mengakses Google Sheets. Periksa koneksi internet dan izin akses sheet.'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

  } catch (error) {
    console.error('❌ Verification error:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || 'Terjadi kesalahan saat memverifikasi akses'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});