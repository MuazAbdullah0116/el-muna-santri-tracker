const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxmfHkRgN33NmRtqLMxuzX3dkt7jHtYKsvVIK4w0vERRFcJbW2Fw5T9m1mLqf7K329-/exec'; // Ganti dengan URL Web App baru

class GoogleSheetsService {
  private async makeRequest(action: string, params: Record<string, any> = {}) {
    const url = new URL(APPS_SCRIPT_URL);
    url.searchParams.append('action', action);
    
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
    });

    try {
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Google Sheets API error:', error);
      throw error;
    }
  }

  // Santri methods
  async getAllSantri(searchQuery?: string) {
    if (searchQuery) {
      return this.makeRequest('searchSantri', { query: searchQuery });
    }
    return this.makeRequest('getAllSantri');
  }

  async getSantriById(id: string) {
    return this.makeRequest('getSantriById', { id });
  }

  async getSantriByClass(kelas: number) {
    return this.makeRequest('getSantriByClass', { kelas });
  }

  async createSantri(santriData: any) {
    return this.makeRequest('createSantri', { data: santriData });
  }

  async deleteSantri(id: string) {
    return this.makeRequest('deleteSantri', { id });
  }

  // Setoran methods
  async getAllSetoran() {
    return this.makeRequest('getAllSetoran');
  }

  async getSetoranBySantri(santriId: string) {
    return this.makeRequest('getSetoranBySantri', { santriId });
  }

  async createSetoran(setoranData: any) {
    return this.makeRequest('createSetoran', { data: setoranData });
  }

  async deleteSetoran(id: string) {
    return this.makeRequest('deleteSetoran', { id });
  }
}

export const googleSheetsService = new GoogleSheetsService();
