import React, { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Download, AlertTriangle, CheckCircle } from 'lucide-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { exportToCSV, completeMigration, getMigrationStatus } from '@/services/supabase/archive.service';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function MigrationNotification() {
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  const [archiveName, setArchiveName] = useState('');
  const [sheetUrl, setSheetUrl] = useState('');

  const { data: migrationStatus } = useQuery({
    queryKey: ['migration-status'],
    queryFn: getMigrationStatus,
    refetchInterval: 5 * 60 * 1000, // Check every 5 minutes
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
        setShowCompleteDialog(true);
      } else {
        toast.error(data.error || 'Gagal mengekspor data');
      }
    },
    onError: (error) => {
      console.error('Export error:', error);
      toast.error('Gagal mengekspor data ke CSV');
    },
  });

  const completeMutation = useMutation({
    mutationFn: () => completeMigration(archiveName, sheetUrl),
    onSuccess: (data) => {
      if (data.success) {
        toast.success('Migrasi berhasil diselesaikan');
        setShowCompleteDialog(false);
        setArchiveName('');
        setSheetUrl('');
      } else {
        toast.error(data.error || 'Gagal menyelesaikan migrasi');
      }
    },
    onError: (error) => {
      console.error('Complete migration error:', error);
      toast.error('Gagal menyelesaikan migrasi');
    },
  });

  if (!migrationStatus?.needsMigration) {
    return null;
  }

  return (
    <>
      <Alert className="mb-4 border-orange-200 bg-orange-50">
        <AlertTriangle className="h-4 w-4 text-orange-600" />
        <AlertDescription className="text-orange-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Migrasi Data Diperlukan</p>
              <p className="text-sm">
                Data setoran perlu dipindahkan ke arsip. Sudah {migrationStatus.daysSinceLastMigration} hari 
                sejak migrasi terakhir. {migrationStatus.pendingRecordsCount} record menunggu migrasi.
              </p>
            </div>
            <Button 
              onClick={() => exportMutation.mutate()}
              disabled={exportMutation.isPending}
              className="ml-4"
            >
              <Download className="w-4 h-4 mr-2" />
              {exportMutation.isPending ? 'Mengekspor...' : 'Download CSV'}
            </Button>
          </div>
        </AlertDescription>
      </Alert>

      <Dialog open={showCompleteDialog} onOpenChange={setShowCompleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Selesaikan Migrasi</DialogTitle>
            <DialogDescription>
              Setelah Anda memindahkan data CSV ke Google Sheets, lengkapi informasi berikut untuk menyelesaikan proses migrasi.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="archive-name">Nama Arsip</Label>
              <Input
                id="archive-name"
                value={archiveName}
                onChange={(e) => setArchiveName(e.target.value)}
                placeholder="Contoh: Arsip Setoran Januari 2024"
              />
            </div>
            
            <div>
              <Label htmlFor="sheet-url">URL Google Sheets</Label>
              <Input
                id="sheet-url"
                value={sheetUrl}
                onChange={(e) => setSheetUrl(e.target.value)}
                placeholder="https://docs.google.com/spreadsheets/d/..."
              />
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={() => completeMutation.mutate()}
                disabled={!archiveName || !sheetUrl || completeMutation.isPending}
                className="flex-1"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                {completeMutation.isPending ? 'Menyelesaikan...' : 'Selesaikan Migrasi'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowCompleteDialog(false)}
                disabled={completeMutation.isPending}
              >
                Batal
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}