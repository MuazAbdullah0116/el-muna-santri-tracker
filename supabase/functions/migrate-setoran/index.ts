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

    if (req.method === 'GET') {
      // Get migration status (based on row count - 7000 rows)
      const { data: totalData, error: totalError } = await supabase
        .from('setoran')
        .select('id', { count: 'exact' })
        .is('archived_at', null);

      if (totalError) throw totalError;

      const totalRows = totalData?.length || 0;
      const needsMigration = totalRows >= 7000;

      const { data: latestArchive, error: archiveError } = await supabase
        .from('setoran_archives')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (archiveError) throw archiveError;

      // Check for exported but not migrated data
      const { data: exportedData, error: exportedError } = await supabase
        .from('setoran')
        .select('id, created_at')
        .not('exported_at', 'is', null)
        .is('archived_at', null);

      if (exportedError) throw exportedError;

      const lastMigrationDate = latestArchive?.created_at;
      const daysSinceLastMigration = lastMigrationDate 
        ? Math.floor((Date.now() - new Date(lastMigrationDate).getTime()) / (1000 * 60 * 60 * 24))
        : null;

      const lastExportDate = exportedData && exportedData.length > 0 
        ? exportedData[0].created_at 
        : null;

      return new Response(
        JSON.stringify({
          needsMigration: needsMigration || (exportedData?.length || 0) > 0,
          lastMigrationDate: lastMigrationDate || null,
          pendingRecordsCount: totalRows,
          cutoffDate: null,
          daysSinceLastMigration: daysSinceLastMigration || 0,
          hasExportedData: (exportedData?.length || 0) > 0,
          lastExportDate: lastExportDate,
          exportedRecordsCount: exportedData?.length || 0,
          totalRowsCount: totalRows
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    if (req.method === 'POST') {
      const body = await req.json().catch(() => ({}));
      const { action } = body;

      if (action === 'export_csv') {
        console.log('📥 Starting CSV export process...');
        
        // Get all non-archived data for export when 7000+ rows reached
        const { data: setoranData, error: fetchError } = await supabase
          .from('setoran')
          .select(`
            *,
            santri:santri_id (nama)
          `)
          .is('archived_at', null);

        if (fetchError) throw fetchError;

        if (!setoranData || setoranData.length === 0) {
          return new Response(
            JSON.stringify({ 
              success: false,
              error: 'Tidak ada data untuk diekspor'
            }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }

        // Generate CSV content
        const headers = [
          'ID', 'Nama Santri', 'Tanggal', 'Surat', 'Juz', 'Awal Ayat', 
          'Akhir Ayat', 'Kelancaran', 'Tajwid', 'Tahsin', 'Diuji Oleh', 'Catatan'
        ];

        const csvRows = setoranData.map(row => [
          row.id,
          row.santri?.nama || '',
          row.tanggal,
          row.surat,
          row.juz,
          row.awal_ayat,
          row.akhir_ayat,
          row.kelancaran,
          row.tajwid,
          row.tahsin,
          row.diuji_oleh,
          row.catatan || ''
        ]);

        const csvContent = [
          headers.join(','),
          ...csvRows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');

        const now = new Date();
        const filename = `setoran_backup_${now.getFullYear()}_${String(now.getMonth() + 1).padStart(2, '0')}_${String(now.getDate()).padStart(2, '0')}.csv`;

        console.log(`✅ CSV generated with ${setoranData.length} records`);

        // Mark data as exported but not migrated yet
        const setoranIds = setoranData.map(s => s.id);
        const { error: updateError } = await supabase
          .from('setoran')
          .update({ exported_at: new Date().toISOString() })
          .in('id', setoranIds);

        if (updateError) {
          console.error('❌ Error marking data as exported:', updateError);
          throw updateError;
        }

        return new Response(
          JSON.stringify({ 
            success: true,
            csvData: csvContent,
            filename,
            recordCount: setoranData.length
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      if (action === 'complete_migration') {
        const { archiveName } = body;
        const sheetUrl = 'https://docs.google.com/spreadsheets/d/1VqZv8EtcB3AWMOANiDNw4xFqD4AyonJemPgBRJ8Moys/edit?usp=sharing';
        
        if (!archiveName) {
          return new Response(
            JSON.stringify({ 
              success: false,
              error: 'Nama arsip diperlukan'
            }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }

        console.log('🔄 Completing migration process...');
        
        // Get exported data to be migrated
        const { data: setoranData, error: fetchError } = await supabase
          .from('setoran')
          .select('*')
          .not('exported_at', 'is', null)
          .is('archived_at', null);

        if (fetchError) throw fetchError;

        if (!setoranData || setoranData.length === 0) {
          return new Response(
            JSON.stringify({ 
              success: false,
              error: 'Tidak ada data yang sudah diekspor untuk diarsipkan'
            }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }

        // Verify sheet access first using full URL
        const supabaseUrl = "https://uszycbjecrbinezzecda.supabase.co";
        const verifyResponse = await fetch(`${supabaseUrl}/functions/v1/verify-sheet-access`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseKey}`
          },
          body: JSON.stringify({ sheetUrl })
        });

        const verifyResult = await verifyResponse.json();
        if (!verifyResult.success) {
          return new Response(
            JSON.stringify({ 
              success: false,
              error: verifyResult.error || 'Gagal memverifikasi akses Google Sheets'
            }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }

        // Get period dates
        const periods = setoranData.map(s => new Date(s.tanggal));
        const earliestDate = new Date(Math.min(...periods.map(d => d.getTime())));
        const latestDate = new Date(Math.max(...periods.map(d => d.getTime())));
        
        // Extract sheet ID from URL
        const sheetIdMatch = sheetUrl.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
        const sheetId = sheetIdMatch ? sheetIdMatch[1] : '';

        // Save archive info
        const { data: archiveData, error: archiveError } = await supabase
          .from('setoran_archives')
          .insert({
            archive_name: archiveName,
            google_sheet_id: sheetId,
            google_sheet_url: sheetUrl,
            period_start: earliestDate.toISOString().split('T')[0],
            period_end: latestDate.toISOString().split('T')[0],
            total_records: setoranData.length
          })
          .select()
          .single();

        if (archiveError) throw archiveError;

        // Delete the archived data
        const setoranIds = setoranData.map(s => s.id);
        const { error: deleteError } = await supabase
          .from('setoran')
          .delete()
          .in('id', setoranIds);

        if (deleteError) throw deleteError;

        console.log(`✅ Migration completed. ${setoranData.length} records archived and deleted.`);

        return new Response(
          JSON.stringify({ 
            success: true,
            message: 'Migrasi berhasil diselesaikan',
            recordsProcessed: setoranData.length,
            archiveName,
            archiveId: archiveData.id
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
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