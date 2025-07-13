
import React, { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Download, AlertTriangle, CheckCircle } from 'lucide-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { exportToCSV, completeMigration, getMigrationStatus, verifySheetAccess } from '@/services/supabase/archive.service';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function MigrationNotification() {
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  const [archiveName, setArchiveName] = useState('');
  const sheetUrl = 'https://docs.google.com/spreadsheets/d/1VqZv8EtcB3AWMOANiDNw4xFqD4AyonJemPgBRJ8Moys/edit?usp=sharing';

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

  const verifyMutation = useMutation({
    mutationFn: () => verifySheetAccess(sheetUrl),
    onSuccess: (data) => {
      if (data.success) {
        completeMutation.mutate();
      } else {
        toast.error(data.error || 'Tidak dapat mengakses Google Sheets. Pastikan link dapat diakses publik.');
      }
    },
    onError: (error) => {
      console.error('Verify sheet access error:', error);
      toast.error('Gagal memverifikasi akses Google Sheets');
    },
  });

  const completeMutation = useMutation({
    mutationFn: () => completeMigration(archiveName, sheetUrl),
    onSuccess: (data) => {
      if (data.success) {
        toast.success('Migrasi berhasil diselesaikan dan data asli telah dihapus');
        setShowCompleteDialog(false);
        setArchiveName('');
      } else {
        toast.error(data.error || 'Gagal menyelesaikan migrasi');
      }
    },
    onError: (error) => {
      console.error('Complete migration error:', error);
      toast.error('Gagal menyelesaikan migrasi');
    },
  });

  // Show notification if migration is needed or data has been exported but not migrated
  if (!migrationStatus?.needsMigration && !migrationStatus?.hasExportedData) {
    return null;
  }

  return (
    <>
      {migrationStatus?.hasExportedData && !migrationStatus?.needsMigration ? (
        <Alert className="mb-4 border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20">
          <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
          <AlertDescription className="text-yellow-800 dark:text-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Data Sudah Diekspor - Menunggu Konfirmasi Migrasi</p>
                <p className="text-sm">
                  Data telah diekspor pada {new Date(migrationStatus.lastExportDate).toLocaleDateString('id-ID')}. 
                  {migrationStatus.exportedRecordsCount} record menunggu konfirmasi migrasi ke Google Sheets.
                </p>
              </div>
              <Button 
                onClick={() => setShowCompleteDialog(true)}
                className="ml-4"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Konfirmasi Migrasi
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      ) : (
        <Alert className="mb-4 border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-900/20">
          <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
          <AlertDescription className="text-orange-800 dark:text-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Migrasi Data Diperlukan</p>
                <p className="text-sm">
                  Database telah mencapai {migrationStatus.totalRowsCount || migrationStatus.pendingRecordsCount} record (batas: 7000). 
                  Data perlu dimigrasikan untuk menjaga performa aplikasi.
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
      )}

      <Dialog open={showCompleteDialog} onOpenChange={setShowCompleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Selesaikan Migrasi</DialogTitle>
            <DialogDescription>
              Setelah Anda memindahkan data CSV ke Google Sheets yang sama, masukkan nama arsip untuk menyelesaikan proses migrasi.
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
              <Label>Google Sheets URL (Tetap)</Label>
              <Input
                value={sheetUrl}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Data akan dipindahkan ke Google Sheets yang sama setiap migrasi
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={() => verifyMutation.mutate()}
                disabled={!archiveName || verifyMutation.isPending || completeMutation.isPending}
                className="flex-1"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                {verifyMutation.isPending ? 'Memverifikasi...' : completeMutation.isPending ? 'Menyelesaikan...' : 'Selesaikan Migrasi'}
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
