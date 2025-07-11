import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ArchiveRecord {
  id: string;
  santri_id: string;
  tanggal: string;
  surat: string;
  juz: number;
  awal_ayat: number;
  akhir_ayat: number;
  kelancaran: number;
  tajwid: number;
  tahsin: number;
  diuji_oleh: string;
  catatan: string | null;
  created_at: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = "https://uszycbjecrbinezzecda.supabase.co";
    const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzenljYmplY3JiaW5lenplY2RhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY4MDMzNjUsImV4cCI6MjA2MjM3OTM2NX0.RlUVPTEuuu6oDQJYGLi0KH4Sci2iJTqNGB6TxFec1tg";
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    if (req.method === 'POST') {
      const { force = false } = await req.json().catch(() => ({}));
      
      console.log('🚀 Starting setoran migration process...');
      
      // Hitung tanggal cutoff (2 bulan yang lalu)
      const cutoffDate = new Date();
      cutoffDate.setMonth(cutoffDate.getMonth() - 2);
      const cutoffDateStr = cutoffDate.toISOString().split('T')[0];
      
      console.log(`📅 Cutoff date: ${cutoffDateStr}`);

      // Ambil data setoran yang lebih dari 2 bulan
      const { data: oldSetoran, error: fetchError } = await supabase
        .from('setoran')
        .select('*')
        .lt('tanggal', cutoffDateStr)
        .is('archived_at', null);

      if (fetchError) {
        console.error('❌ Error fetching old setoran:', fetchError);
        throw fetchError;
      }

      if (!oldSetoran || oldSetoran.length === 0) {
        console.log('✅ No data to archive');
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: 'No data to archive',
            recordsProcessed: 0 
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      console.log(`📦 Found ${oldSetoran.length} records to archive`);

      // Buat nama arsip berdasarkan periode
      const periods = oldSetoran.map(s => new Date(s.tanggal));
      const earliestDate = new Date(Math.min(...periods.map(d => d.getTime())));
      const latestDate = new Date(Math.max(...periods.map(d => d.getTime())));
      
      const archiveName = `setoran_${earliestDate.getFullYear()}_${String(earliestDate.getMonth() + 1).padStart(2, '0')}_to_${latestDate.getFullYear()}_${String(latestDate.getMonth() + 1).padStart(2, '0')}`;
      
      console.log(`📋 Archive name: ${archiveName}`);

      // Buat Google Sheet baru
      const sheetResult = await createGoogleSheet(archiveName, oldSetoran);
      
      if (!sheetResult.success) {
        throw new Error(`Failed to create Google Sheet: ${sheetResult.error}`);
      }

      console.log(`📊 Created Google Sheet: ${sheetResult.sheetUrl}`);

      // Simpan info arsip ke database
      const { data: archiveData, error: archiveError } = await supabase
        .from('setoran_archives')
        .insert({
          archive_name: archiveName,
          google_sheet_id: sheetResult.sheetId!,
          google_sheet_url: sheetResult.sheetUrl!,
          period_start: earliestDate.toISOString().split('T')[0],
          period_end: latestDate.toISOString().split('T')[0],
          total_records: oldSetoran.length
        })
        .select()
        .single();

      if (archiveError) {
        console.error('❌ Error saving archive info:', archiveError);
        throw archiveError;
      }

      // Mark data as archived
      const setoranIds = oldSetoran.map(s => s.id);
      const { error: updateError } = await supabase
        .from('setoran')
        .update({ archived_at: new Date().toISOString() })
        .in('id', setoranIds);

      if (updateError) {
        console.error('❌ Error marking data as archived:', updateError);
        throw updateError;
      }

      console.log('✅ Migration completed successfully');

      return new Response(
        JSON.stringify({ 
          success: true,
          message: 'Migration completed successfully',
          recordsProcessed: oldSetoran.length,
          archiveName,
          sheetUrl: sheetResult.sheetUrl,
          archiveId: archiveData.id
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );

    } else if (req.method === 'GET') {
      // Endpoint untuk cek status migrasi terakhir
      const { data: latestArchive } = await supabase
        .from('setoran_archives')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      // Hitung data yang perlu dimigrasi
      const cutoffDate = new Date();
      cutoffDate.setMonth(cutoffDate.getMonth() - 2);
      const cutoffDateStr = cutoffDate.toISOString().split('T')[0];

      const { count } = await supabase
        .from('setoran')
        .select('*', { count: 'exact', head: true })
        .lt('tanggal', cutoffDateStr)
        .is('archived_at', null);

      return new Response(
        JSON.stringify({
          success: true,
          latestArchive,
          pendingMigrationCount: count || 0,
          cutoffDate: cutoffDateStr
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('❌ Migration error:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || 'Unknown error occurred'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

async function createGoogleSheet(sheetName: string, data: ArchiveRecord[]) {
  try {
    const serviceAccountEmail = Deno.env.get('GOOGLE_SERVICE_ACCOUNT_EMAIL');
    const privateKey = Deno.env.get('GOOGLE_PRIVATE_KEY')?.replace(/\\n/g, '\n');
    
    if (!serviceAccountEmail || !privateKey) {
      return {
        success: false,
        error: 'Google credentials not configured'
      };
    }

    // Buat JWT token untuk autentikasi
    const header = btoa(JSON.stringify({
      alg: 'RS256',
      typ: 'JWT'
    }));

    const now = Math.floor(Date.now() / 1000);
    const payload = btoa(JSON.stringify({
      iss: serviceAccountEmail,
      scope: 'https://www.googleapis.com/auth/spreadsheets',
      aud: 'https://oauth2.googleapis.com/token',
      exp: now + 3600,
      iat: now
    }));

    // Import crypto untuk signing
    const encoder = new TextEncoder();
    const keyData = encoder.encode(privateKey);
    
    const cryptoKey = await crypto.subtle.importKey(
      'pkcs8',
      keyData,
      {
        name: 'RSASSA-PKCS1-v1_5',
        hash: 'SHA-256'
      },
      false,
      ['sign']
    );

    const signatureData = encoder.encode(`${header}.${payload}`);
    const signature = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', cryptoKey, signatureData);
    const signatureB64 = btoa(String.fromCharCode(...new Uint8Array(signature)));

    const jwt = `${header}.${payload}.${signatureB64}`;

    // Dapatkan access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`
    });

    if (!tokenResponse.ok) {
      return {
        success: false,
        error: 'Failed to get access token'
      };
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Buat spreadsheet baru
    const createResponse = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        properties: {
          title: sheetName
        },
        sheets: [{
          properties: {
            title: 'Data Setoran'
          }
        }]
      })
    });

    if (!createResponse.ok) {
      return {
        success: false,
        error: 'Failed to create spreadsheet'
      };
    }

    const sheetData = await createResponse.json();
    const sheetId = sheetData.spreadsheetId;

    // Siapkan data untuk dimasukkan
    const headers = [
      'ID', 'Santri ID', 'Tanggal', 'Surat', 'Juz', 'Awal Ayat', 
      'Akhir Ayat', 'Kelancaran', 'Tajwid', 'Tahsin', 'Diuji Oleh', 'Catatan', 'Created At'
    ];

    const rows = data.map(row => [
      row.id,
      row.santri_id,
      row.tanggal,
      row.surat,
      row.juz,
      row.awal_ayat,
      row.akhir_ayat,
      row.kelancaran,
      row.tajwid,
      row.tahsin,
      row.diuji_oleh,
      row.catatan || '',
      row.created_at
    ]);

    // Masukkan data ke spreadsheet
    const updateResponse = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/A1:append?valueInputOption=RAW`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values: [headers, ...rows]
        })
      }
    );

    if (!updateResponse.ok) {
      return {
        success: false,
        error: 'Failed to add data to spreadsheet'
      };
    }

    return {
      success: true,
      sheetId,
      sheetUrl: `https://docs.google.com/spreadsheets/d/${sheetId}/edit`
    };

  } catch (error) {
    console.error('Google Sheets error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}