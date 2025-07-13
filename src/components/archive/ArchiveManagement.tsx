
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Archive, 
  RefreshCw, 
  Database, 
  ExternalLink,
  AlertTriangle
} from 'lucide-react';
import {
  getMigrationStatus,
  fetchSetoranArchives,
  SetoranArchive,
  MigrationStatus
} from '@/services/supabase/archive.service';
import MigrationNotification from './MigrationNotification';

export default function ArchiveManagement() {
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
      {/* Migration Notification */}
      <MigrationNotification />

      {/* Status Migrasi */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Sistem Migrasi Berdasarkan Kapasitas
          </CardTitle>
          <CardDescription>
            Migrasi otomatis saat database mencapai 7000 record untuk menjaga performa
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {migrationStatus && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Database className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Total Record</span>
                  </div>
                  <div className="text-2xl font-bold">
                    {migrationStatus.totalRowsCount || migrationStatus.pendingRecordsCount}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    dari maksimal 7000
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Archive className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Status Sistem</span>
                  </div>
                  <div className="text-sm">
                    {migrationStatus.needsMigration ? 
                      'Migrasi Diperlukan' : 
                      migrationStatus.hasExportedData ?
                      'Menunggu Konfirmasi' :
                      'Normal'
                    }
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {migrationStatus.needsMigration ? 
                      'Database telah penuh' :
                      migrationStatus.hasExportedData ?
                      'Data telah diekspor' :
                      'Kapasitas masih tersedia'
                    }
                  </div>
                </div>
              </div>

              {migrationStatus.needsMigration && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Database telah mencapai kapasitas maksimal 7000 record. 
                    Migrasi diperlukan untuk menjaga performa aplikasi.
                  </AlertDescription>
                </Alert>
              )}
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
              <h5 className="font-semibold mb-2">📊 Sistem Berbasis Kapasitas</h5>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Migrasi otomatis saat 7000 record</li>
                <li>• Data diekspor ke file CSV</li>
                <li>• Manual copy ke Google Sheets yang sama</li>
                <li>• Data lama dihapus setelah migrasi</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-2">⚡ Keuntungan</h5>
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
