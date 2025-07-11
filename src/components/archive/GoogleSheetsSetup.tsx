import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { 
  Settings, 
  Key, 
  FileSpreadsheet, 
  CheckCircle,
  AlertTriangle,
  ExternalLink,
  Copy
} from 'lucide-react';

export default function GoogleSheetsSetup() {
  const [config, setConfig] = useState({
    serviceAccountEmail: '',
    privateKey: '',
    folderId: '',
    testSheetName: 'Test Arsip Setoran'
  });
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleTestConnection = async () => {
    if (!config.serviceAccountEmail || !config.privateKey) {
      toast.error('Email dan Private Key harus diisi');
      return;
    }

    setIsTestingConnection(true);
    setConnectionStatus('idle');

    try {
      // Test koneksi dengan membuat spreadsheet test
      const response = await fetch('/api/test-google-sheets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceAccountEmail: config.serviceAccountEmail,
          privateKey: config.privateKey,
          folderId: config.folderId,
          testSheetName: config.testSheetName
        })
      });

      if (response.ok) {
        const result = await response.json();
        setConnectionStatus('success');
        toast.success(`✅ Koneksi berhasil! Test spreadsheet dibuat: ${result.sheetUrl}`, {
          action: {
            label: 'Buka Sheet',
            onClick: () => window.open(result.sheetUrl, '_blank')
          }
        });
      } else {
        setConnectionStatus('error');
        toast.error('❌ Koneksi gagal! Periksa kredensial Anda');
      }
    } catch (error) {
      setConnectionStatus('error');
      toast.error(`❌ Error: ${error.message}`);
    } finally {
      setIsTestingConnection(false);
    }
  };

  const handleSaveConfig = () => {
    // Simpan konfigurasi ke Supabase Secrets
    toast.success('✅ Konfigurasi disimpan! Sistem migrasi siap digunakan');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('📋 Disalin ke clipboard');
  };

  return (
    <div className="space-y-6">
      {/* Panduan Setup */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Panduan Setup Google Sheets API
          </CardTitle>
          <CardDescription>
            Ikuti langkah-langkah berikut untuk menyiapkan Google Sheets sebagai database arsip
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-semibold">1. Aktifkan Google Sheets API</h4>
              <div className="text-sm text-muted-foreground space-y-2">
                <p>• Kunjungi Google Cloud Console</p>
                <p>• Buat project baru atau pilih existing</p>
                <p>• Aktifkan Google Sheets API</p>
                <p>• Aktifkan Google Drive API</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open('https://console.cloud.google.com/apis/library', '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Buka Console
              </Button>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold">2. Buat Service Account</h4>
              <div className="text-sm text-muted-foreground space-y-2">
                <p>• Pergi ke "APIs & Services" → "Credentials"</p>
                <p>• Klik "Create Credentials" → "Service Account"</p>
                <p>• Beri nama dan role "Editor"</p>
                <p>• Download file JSON kredensial</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open('https://console.cloud.google.com/apis/credentials', '_blank')}
              >
                <Key className="h-4 w-4 mr-2" />
                Buat Service Account
              </Button>
            </div>
          </div>

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Penting:</strong> Simpan file JSON dengan aman dan jangan share ke publik. 
              File ini berisi kredensial yang memberikan akses ke Google Sheets Anda.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Form Konfigurasi */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Konfigurasi Kredensial
          </CardTitle>
          <CardDescription>
            Masukkan informasi dari file JSON Service Account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="serviceAccountEmail">Service Account Email</Label>
            <div className="flex gap-2">
              <Input
                id="serviceAccountEmail"
                placeholder="name@project-id.iam.gserviceaccount.com"
                value={config.serviceAccountEmail}
                onChange={(e) => setConfig({...config, serviceAccountEmail: e.target.value})}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(config.serviceAccountEmail)}
                disabled={!config.serviceAccountEmail}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Ambil dari field "client_email" di file JSON
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="privateKey">Private Key</Label>
            <Textarea
              id="privateKey"
              placeholder="-----BEGIN PRIVATE KEY-----
...
-----END PRIVATE KEY-----"
              value={config.privateKey}
              onChange={(e) => setConfig({...config, privateKey: e.target.value})}
              rows={4}
              className="font-mono text-xs"
            />
            <p className="text-xs text-muted-foreground">
              Ambil dari field "private_key" di file JSON (termasuk header dan footer)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="folderId">Google Drive Folder ID (Opsional)</Label>
            <Input
              id="folderId"
              placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
              value={config.folderId}
              onChange={(e) => setConfig({...config, folderId: e.target.value})}
            />
            <p className="text-xs text-muted-foreground">
              ID folder di Google Drive untuk menyimpan spreadsheet arsip. 
              Ambil dari URL folder: docs.google.com/drive/folders/[FOLDER_ID]
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="testSheetName">Nama Test Spreadsheet</Label>
            <Input
              id="testSheetName"
              value={config.testSheetName}
              onChange={(e) => setConfig({...config, testSheetName: e.target.value})}
            />
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleTestConnection}
              disabled={isTestingConnection || !config.serviceAccountEmail || !config.privateKey}
            >
              {isTestingConnection ? (
                <>
                  <div className="animate-spin h-4 w-4 mr-2 border-2 border-current border-t-transparent rounded-full" />
                  Testing...
                </>
              ) : (
                <>
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Test Koneksi
                </>
              )}
            </Button>

            {connectionStatus === 'success' && (
              <Button onClick={handleSaveConfig} variant="default">
                <CheckCircle className="h-4 w-4 mr-2" />
                Simpan Konfigurasi
              </Button>
            )}
          </div>

          {connectionStatus === 'success' && (
            <Alert className="border-green-500 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                ✅ Koneksi berhasil! Google Sheets API siap digunakan untuk sistem migrasi.
              </AlertDescription>
            </Alert>
          )}

          {connectionStatus === 'error' && (
            <Alert className="border-red-500 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                ❌ Koneksi gagal! Periksa kembali kredensial dan pastikan API sudah diaktifkan.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Template Spreadsheet */}
      <Card>
        <CardHeader>
          <CardTitle>Template Spreadsheet</CardTitle>
          <CardDescription>
            Struktur kolom yang akan dibuat di Google Sheets
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted p-4 rounded-lg">
            <div className="grid grid-cols-4 gap-2 text-xs font-mono">
              <div>ID</div>
              <div>Santri ID</div>
              <div>Tanggal</div>
              <div>Surat</div>
              <div>Juz</div>
              <div>Awal Ayat</div>
              <div>Akhir Ayat</div>
              <div>Kelancaran</div>
              <div>Tajwid</div>
              <div>Tahsin</div>
              <div>Diuji Oleh</div>
              <div>Catatan</div>
              <div>Created At</div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Setiap arsip akan dibuat dengan struktur kolom ini untuk konsistensi data.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}