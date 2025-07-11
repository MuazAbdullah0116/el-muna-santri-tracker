import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { 
  Archive, 
  Calendar, 
  Download, 
  RefreshCw, 
  Database, 
  ExternalLink,
  AlertTriangle,
  Clock
} from 'lucide-react';
import {
  getMigrationStatus,
  startMigration,
  fetchSetoranArchives,
  SetoranArchive,
  MigrationStatus
} from '@/services/supabase/archive.service';

export default function ArchiveManagement() {
  const [isManualMigration, setIsManualMigration] = useState(false);
  const queryClient = useQueryClient();

  // Query status migrasi
  const { data: migrationStatus, isLoading: statusLoading } = useQuery<MigrationStatus>({
    queryKey: ['migration-status'],
    queryFn: getMigrationStatus,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Query daftar arsip
  const { data: archives, isLoading: archivesLoading } = useQuery<SetoranArchive[]>({
    queryKey: ['setoran-archives'],
    queryFn: fetchSetoranArchives,
  });

  // Mutation untuk memulai migrasi
  const migrationMutation = useMutation({
    mutationFn: startMigration,
    onSuccess: (result) => {
      if (result.success) {
        toast.success(
          `✅ Migrasi berhasil! ${result.recordsProcessed} record dipindahkan ke Google Sheets`,
          {
            description: `Arsip: ${result.archiveName}`,
            action: result.sheetUrl ? {
              label: 'Buka Sheet',
              onClick: () => window.open(result.sheetUrl, '_blank')
            } : undefined
          }
        );
        queryClient.invalidateQueries({ queryKey: ['migration-status'] });
        queryClient.invalidateQueries({ queryKey: ['setoran-archives'] });
      } else {
        toast.error(`❌ Migrasi gagal: ${result.error}`);
      }
      setIsManualMigration(false);
    },
    onError: (error) => {
      toast.error(`❌ Error: ${error.message}`);
      setIsManualMigration(false);
    },
  });

  const handleStartMigration = () => {
    setIsManualMigration(true);
    migrationMutation.mutate(false);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getNextMigrationDate = () => {
    const now = new Date();
    const nextMigration = new Date(now.getFullYear(), now.getMonth() + (now.getMonth() % 2 === 0 ? 2 : 1), 1);
    return nextMigration;
  };

  if (statusLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-6 w-6 animate-spin mr-2" />
        <span>Memuat status migrasi...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Status Migrasi */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Status Sistem Migrasi Otomatis
          </CardTitle>
          <CardDescription>
            Sistem migrasi data setoran ke Google Sheets setiap 2 bulan
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {migrationStatus && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Data Pending</span>
                  </div>
                  <div className="text-2xl font-bold">
                    {migrationStatus.pendingMigrationCount}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    record &gt; 2 bulan
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Cutoff Date</span>
                  </div>
                  <div className="text-lg font-semibold">
                    {formatDate(migrationStatus.cutoffDate)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    batas data aktif
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Archive className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Migrasi Terakhir</span>
                  </div>
                  <div className="text-sm">
                    {migrationStatus.latestArchive ? 
                      formatDateTime(migrationStatus.latestArchive.created_at) : 
                      'Belum pernah'
                    }
                  </div>
                  {migrationStatus.latestArchive && (
                    <div className="text-xs text-muted-foreground">
                      {migrationStatus.latestArchive.total_records} record
                    </div>
                  )}
                </div>
              </div>

              {migrationStatus.pendingMigrationCount > 0 && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Ada {migrationStatus.pendingMigrationCount} record yang siap dimigrasi. 
                    Data yang lebih dari 2 bulan akan dipindahkan ke Google Sheets.
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex items-center gap-2">
                <Button 
                  onClick={handleStartMigration}
                  disabled={migrationMutation.isPending || isManualMigration}
                  size="sm"
                >
                  {(migrationMutation.isPending || isManualMigration) ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Migrasi Berjalan...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Mulai Migrasi Manual
                    </>
                  )}
                </Button>
                
                <div className="text-sm text-muted-foreground">
                  Migrasi otomatis berikutnya: {formatDate(getNextMigrationDate().toISOString())}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Daftar Arsip */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Archive className="h-5 w-5" />
            Riwayat Arsip Data
          </CardTitle>
          <CardDescription>
            Daftar semua arsip data setoran yang telah dipindahkan ke Google Sheets
          </CardDescription>
        </CardHeader>
        <CardContent>
          {archivesLoading ? (
            <div className="flex items-center justify-center p-4">
              <RefreshCw className="h-4 w-4 animate-spin mr-2" />
              <span>Memuat arsip...</span>
            </div>
          ) : archives && archives.length > 0 ? (
            <div className="space-y-4">
              {archives.map((archive) => (
                <div key={archive.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{archive.archive_name}</h4>
                        <Badge variant="secondary">{archive.total_records} record</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <div>Periode: {formatDate(archive.period_start)} - {formatDate(archive.period_end)}</div>
                        <div>Dibuat: {formatDateTime(archive.created_at)}</div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(archive.google_sheet_url, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Buka Sheet
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Archive className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Belum ada arsip data</p>
              <p className="text-sm">Arsip akan muncul setelah migrasi pertama dilakukan</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info Sistem */}
      <Card>
        <CardHeader>
          <CardTitle>Cara Kerja Sistem Migrasi</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h5 className="font-semibold mb-2">🔄 Proses Otomatis</h5>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Berjalan setiap 2 bulan sekali</li>
                <li>• Data &gt; 2 bulan dipindahkan ke Google Sheets</li>
                <li>• Total hafalan santri tetap tersimpan</li>
                <li>• Data tetap bisa diakses melalui arsip</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-2">📊 Keuntungan</h5>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Database tetap ringan dan cepat</li>
                <li>• Riwayat data tidak hilang</li>
                <li>• Dapat diakses kapan saja via Google Sheets</li>
                <li>• Backup otomatis di cloud</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}