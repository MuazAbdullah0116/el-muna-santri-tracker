# Setup Google Sheets sebagai Database Arsip

## Langkah 1: Buat Google Service Account

1. **Kunjungi Google Cloud Console:**
   - Buka https://console.cloud.google.com/
   - Buat project baru atau pilih project yang ada

2. **Aktifkan Google Sheets API:**
   - Ke "APIs & Services" > "Library"
   - Cari "Google Sheets API" dan aktifkan
   - Cari "Google Drive API" dan aktifkan juga

3. **Buat Service Account:**
   - Ke "APIs & Services" > "Credentials"
   - Klik "Create Credentials" > "Service Account"
   - Beri nama: `santri-archive-service`
   - Role: `Editor` atau `Project > Editor`

4. **Download Kredensial:**
   - Klik pada service account yang dibuat
   - Tab "Keys" > "Add Key" > "JSON"
   - Download file JSON dan simpan kredensialnya

## Langkah 2: Setup Spreadsheet Template

Buat spreadsheet template dengan struktur:
- Sheet Name: "Data Setoran"
- Kolom: ID, Santri ID, Tanggal, Surat, Juz, Awal Ayat, Akhir Ayat, Kelancaran, Tajwid, Tahsin, Diuji Oleh, Catatan, Created At

## Langkah 3: Konfigurasi di Supabase

Masukkan kredensial ke Supabase Secrets:
- GOOGLE_SERVICE_ACCOUNT_EMAIL: email service account
- GOOGLE_PRIVATE_KEY: private key dari JSON file
- GOOGLE_SHEETS_API_KEY: API key (opsional)

## Langkah 4: Test Migrasi

Setelah setup, test melalui halaman Archive Management.