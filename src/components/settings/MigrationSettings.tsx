import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Database } from 'lucide-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { exportToCSV, getMigrationStatus } from '@/services/supabase/archive.service';
import { toast } from 'sonner';

export default function MigrationSettings() {
  const { data: migrationStatus } = useQuery({
    queryKey: ['migration-status'],
    queryFn: getMigrationStatus,
  });

  const exportMutation = useMutation({
    mutationFn: exportToCSV,
    onSuccess: (data) => {
      if (data.success && data.csvData && data.filename) {
        // Create and download CSV file
        const blob = new Blob([data.csvData], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = data.filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        toast.success('File CSV berhasil didownload');
      } else {
        toast.error(data.error || 'Gagal mengekspor data');
      }
    },
    onError: (error) => {
      console.error('Export error:', error);
      toast.error('Gagal mengekspor data ke CSV');
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Migrasi Data
        </CardTitle>
        <CardDescription>
          Kelola migrasi data setoran ke Google Sheets
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">Status Migrasi</p>
            <p className="text-sm text-muted-foreground">
              {migrationStatus?.needsMigration 
                ? `${migrationStatus.pendingRecordsCount} record perlu migrasi`
                : migrationStatus?.hasExportedData 
                ? `${migrationStatus.exportedRecordsCount} record menunggu konfirmasi`
                : 'Tidak ada data yang perlu migrasi'
              }
            </p>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm font-medium">Migrasi Terakhir</p>
            <p className="text-sm text-muted-foreground">
              {migrationStatus?.lastMigrationDate 
                ? new Date(migrationStatus.lastMigrationDate).toLocaleDateString('id-ID')
                : 'Belum pernah migrasi'
              }
            </p>
          </div>
        </div>

        <div className="pt-4 border-t">
          <Button
            onClick={() => exportMutation.mutate()}
            disabled={exportMutation.isPending || (!migrationStatus?.needsMigration && !migrationStatus?.hasExportedData)}
            className="w-full"
          >
            <Download className="w-4 h-4 mr-2" />
            {exportMutation.isPending ? 'Mengekspor...' : 'Download Data untuk Migrasi'}
          </Button>
          
          <p className="text-xs text-muted-foreground mt-2">
            Data yang didownload berupa file CSV yang dapat diimpor ke Google Sheets.
            Setelah mengimpor ke Google Sheets, gunakan notifikasi migrasi untuk menyelesaikan proses.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}