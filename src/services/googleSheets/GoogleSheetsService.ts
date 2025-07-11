// Google Sheets Service untuk frontend

export interface GoogleSheetsConfig {
  serviceAccountEmail: string;
  privateKey: string;
  folderId?: string; // Folder Drive untuk menyimpan spreadsheet
}

export interface SpreadsheetInfo {
  id: string;
  name: string;
  url: string;
  sheetId: number;
}

/**
 * Service untuk mengelola Google Sheets sebagai database arsip
 */
export class GoogleSheetsService {
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  constructor(private config: GoogleSheetsConfig) {}

  /**
   * Dapatkan access token untuk Google Sheets API
   */
  private async getAccessToken(): Promise<string> {
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      // Buat JWT untuk autentikasi
      const header = btoa(JSON.stringify({
        alg: 'RS256',
        typ: 'JWT'
      }));

      const now = Math.floor(Date.now() / 1000);
      const payload = btoa(JSON.stringify({
        iss: this.config.serviceAccountEmail,
        scope: 'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.file',
        aud: 'https://oauth2.googleapis.com/token',
        exp: now + 3600,
        iat: now
      }));

      // Sign dengan private key
      const encoder = new TextEncoder();
      const keyData = encoder.encode(this.config.privateKey.replace(/\\n/g, '\n'));
      
      const cryptoKey = await crypto.subtle.importKey(
        'pkcs8',
        keyData,
        { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
        false,
        ['sign']
      );

      const signatureData = encoder.encode(`${header}.${payload}`);
      const signature = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', cryptoKey, signatureData);
      const signatureB64 = btoa(String.fromCharCode(...new Uint8Array(signature)));

      const jwt = `${header}.${payload}.${signatureB64}`;

      // Request access token
      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`
      });

      if (!response.ok) {
        throw new Error(`Auth failed: ${response.statusText}`);
      }

      const data = await response.json();
      this.accessToken = data.access_token;
      this.tokenExpiry = Date.now() + (data.expires_in * 1000) - 60000; // 1 menit buffer

      return this.accessToken;
    } catch (error) {
      console.error('Error getting access token:', error);
      throw error;
    }
  }

  /**
   * Buat spreadsheet baru
   */
  async createSpreadsheet(name: string): Promise<SpreadsheetInfo> {
    const token = await this.getAccessToken();

    const response = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        properties: { title: name },
        sheets: [{
          properties: {
            title: 'Data Setoran',
            gridProperties: { rowCount: 1000, columnCount: 20 }
          }
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to create spreadsheet: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Pindahkan ke folder jika ditentukan
    if (this.config.folderId) {
      await this.moveToFolder(data.spreadsheetId, this.config.folderId);
    }

    return {
      id: data.spreadsheetId,
      name: data.properties.title,
      url: data.spreadsheetUrl,
      sheetId: data.sheets[0].properties.sheetId
    };
  }

  /**
   * Pindahkan file ke folder tertentu
   */
  private async moveToFolder(fileId: string, folderId: string): Promise<void> {
    const token = await this.getAccessToken();

    await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?addParents=${folderId}`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${token}` }
    });
  }

  /**
   * Tambahkan header ke spreadsheet
   */
  async addHeaders(spreadsheetId: string, headers: string[]): Promise<void> {
    const token = await this.getAccessToken();

    await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/A1:append?valueInputOption=RAW`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ values: [headers] })
      }
    );
  }

  /**
   * Tambahkan data ke spreadsheet
   */
  async appendData(spreadsheetId: string, data: any[][]): Promise<void> {
    const token = await this.getAccessToken();

    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/A:A/append?valueInputOption=RAW`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ values: data })
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to append data: ${response.statusText}`);
    }
  }

  /**
   * Baca data dari spreadsheet
   */
  async readData(spreadsheetId: string, range: string = 'A:M'): Promise<any[][]> {
    const token = await this.getAccessToken();

    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}`,
      {
        headers: { 'Authorization': `Bearer ${token}` }
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to read data: ${response.statusText}`);
    }

    const data = await response.json();
    return data.values || [];
  }

  /**
   * Format data setoran untuk Google Sheets
   */
  formatSetoranData(setoranList: any[]): any[][] {
    return setoranList.map(setoran => [
      setoran.id,
      setoran.santri_id,
      setoran.tanggal,
      setoran.surat,
      setoran.juz,
      setoran.awal_ayat,
      setoran.akhir_ayat,
      setoran.kelancaran,
      setoran.tajwid,
      setoran.tahsin,
      setoran.diuji_oleh,
      setoran.catatan || '',
      setoran.created_at
    ]);
  }

  /**
   * Parse data dari Google Sheets kembali ke format setoran
   */
  parseSetoranData(rows: any[][]): any[] {
    if (!rows || rows.length < 2) return []; // Skip header

    return rows.slice(1).map(row => ({
      id: row[0],
      santri_id: row[1],
      tanggal: row[2],
      surat: row[3],
      juz: parseInt(row[4]) || 0,
      awal_ayat: parseInt(row[5]) || 0,
      akhir_ayat: parseInt(row[6]) || 0,
      kelancaran: parseInt(row[7]) || 0,
      tajwid: parseInt(row[8]) || 0,
      tahsin: parseInt(row[9]) || 0,
      diuji_oleh: row[10] || '',
      catatan: row[11] || null,
      created_at: row[12]
    }));
  }
}

/**
 * Factory function untuk membuat instance Google Sheets Service
 * Note: Ini akan digunakan di Edge Function, bukan di frontend
 */
export async function createGoogleSheetsService(config: GoogleSheetsConfig): Promise<GoogleSheetsService> {
  return new GoogleSheetsService(config);
}