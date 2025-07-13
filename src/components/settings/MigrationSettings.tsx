
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Database } from 'lucide-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { exportToCSV, getMigrationStatus } from '@/services/supabase/archive.service';
import { toast } from 'sonner';
import { useAuth } from '@/context/auth-context';

export default function MigrationSettings() {
  const { user } = useAuth();
  
  // Only show for authenticated users
  if (!user || user === "Wali") {
    return null;
  }
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
          Sistem migrasi otomatis saat database mencapai 7000 record
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">Total Record Saat Ini</p>
            <p className="text-sm text-muted-foreground">
              {migrationStatus?.totalRowsCount || 0} record dari batas 7000
            </p>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm font-medium">Status</p>
            <p className="text-sm text-muted-foreground">
              {migrationStatus?.needsMigration 
                ? 'Migrasi diperlukan - database penuh'
                : migrationStatus?.hasExportedData 
                ? 'Menunggu konfirmasi migrasi'
                : 'Normal - tidak perlu migrasi'
              }
            </p>
          </div>
        </div>

        {(migrationStatus?.needsMigration || migrationStatus?.hasExportedData) && (
          <div className="pt-4 border-t">
            <Button
              onClick={() => exportMutation.mutate()}
              disabled={exportMutation.isPending || migrationStatus?.hasExportedData}
              className="w-full"
            >
              <Download className="w-4 h-4 mr-2" />
              {exportMutation.isPending ? 'Mengekspor...' : 'Download Data untuk Migrasi'}
            </Button>
            
            <p className="text-xs text-muted-foreground mt-2">
              Sistem akan meminta migrasi otomatis saat database mencapai 7000 record.
              Data akan didownload sebagai CSV untuk dipindahkan ke Google Sheets.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
