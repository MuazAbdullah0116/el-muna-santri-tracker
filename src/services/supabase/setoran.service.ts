
import { supabase } from "./client";
import { fetchArchivedSetoran } from "./archive.service";

export interface Setoran {
  id: string;
  santri_id: string;
  tanggal: string;
  surat: string;
  juz: number;
  awal_ayat: number;
  akhir_ayat: number;
  kelancaran: number;
  tajwid: number;
  tahsin: number;
  diuji_oleh: string;
  catatan?: string;
  created_at?: string;
  santri?: {
    nama: string;
  };
}

/**
 * Fetch all setoran including archived data from Google Sheets
 */
export async function fetchAllSetoran(): Promise<Setoran[]> {
  try {
    // Fetch current data from database
    const { data: currentData, error: currentError } = await supabase
      .from('setoran')
      .select(`
        *,
        santri:santri_id (nama)
      `)
      .is('archived_at', null)
      .order('tanggal', { ascending: false });

    if (currentError) {
      console.error('Error fetching current setoran:', currentError);
      throw currentError;
    }

    // Fetch archived data from all Google Sheets
    const { data: archives, error: archiveError } = await supabase
      .from('setoran_archives')
      .select('*')
      .order('created_at', { ascending: false });

    if (archiveError) {
      console.error('Error fetching archives:', archiveError);
      // Continue with current data only if archive fetch fails
      return currentData || [];
    }

    let archivedData: any[] = [];
    if (archives && archives.length > 0) {
      // Fetch data from the latest archive (most recent Google Sheet)
      try {
        const latestArchive = archives[0];
        archivedData = await fetchArchivedSetoran(latestArchive.id);
        
        // Transform archived data to match current data structure
        archivedData = archivedData.map(item => ({
          id: item.ID || item.id,
          santri_id: item['Santri ID'] || item.santri_id,
          tanggal: item.Tanggal || item.tanggal,
          surat: item.Surat || item.surat,
          juz: parseInt(item.Juz || item.juz) || 0,
          awal_ayat: parseInt(item['Awal Ayat'] || item.awal_ayat) || 0,
          akhir_ayat: parseInt(item['Akhir Ayat'] || item.akhir_ayat) || 0,
          kelancaran: parseInt(item.Kelancaran || item.kelancaran) || 0,
          tajwid: parseInt(item.Tajwid || item.tajwid) || 0,
          tahsin: parseInt(item.Tahsin || item.tahsin) || 0,
          diuji_oleh: item['Diuji Oleh'] || item.diuji_oleh || '',
          catatan: item.Catatan || item.catatan || null,
          created_at: item['Created At'] || item.created_at,
          santri: {
            nama: item['Nama Santri'] || item.nama || 'Unknown'
          }
        }));
      } catch (archiveError) {
        console.error('Error fetching archived data:', archiveError);
        // Continue with current data only
      }
    }

    // Combine current and archived data
    const allData = [...(currentData || []), ...archivedData];
    
    // Sort by date (newest first)
    return allData.sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());

  } catch (error) {
    console.error('Error in fetchAllSetoran:', error);
    throw error;
  }
}

/**
 * Fetch setoran by santri ID including archived data
 */
export async function fetchSetoranBySantri(santriId: string): Promise<Setoran[]> {
  try {
    // Get all setoran data first
    const allSetoran = await fetchAllSetoran();
    
    // Filter by santri ID
    return allSetoran.filter(setoran => setoran.santri_id === santriId);
  } catch (error) {
    console.error('Error in fetchSetoranBySantri:', error);
    throw error;
  }
}

/**
 * Create new setoran
 */
export async function createSetoran(setoranData: Omit<Setoran, 'id' | 'created_at' | 'santri'>): Promise<Setoran> {
  try {
    const { data, error } = await supabase
      .from('setoran')
      .insert(setoranData)
      .select(`
        *,
        santri:santri_id (nama)
      `)
      .single();

    if (error) {
      console.error('Error creating setoran:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in createSetoran:', error);
    throw error;
  }
}

/**
 * Delete setoran
 */
export async function deleteSetoran(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('setoran')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting setoran:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in deleteSetoran:', error);
    throw error;
  }
}

/**
 * Get setoran statistics including archived data
 */
export async function getSetoranStats() {
  try {
    const allSetoran = await fetchAllSetoran();
    
    const totalSetoran = allSetoran.length;
    const avgKelancaran = totalSetoran > 0 
      ? allSetoran.reduce((sum, s) => sum + s.kelancaran, 0) / totalSetoran 
      : 0;
    const avgTajwid = totalSetoran > 0 
      ? allSetoran.reduce((sum, s) => sum + s.tajwid, 0) / totalSetoran 
      : 0;
    const avgTahsin = totalSetoran > 0 
      ? allSetoran.reduce((sum, s) => sum + s.tahsin, 0) / totalSetoran 
      : 0;

    return {
      totalSetoran,
      avgKelancaran: parseFloat(avgKelancaran.toFixed(1)),
      avgTajwid: parseFloat(avgTajwid.toFixed(1)),
      avgTahsin: parseFloat(avgTahsin.toFixed(1))
    };
  } catch (error) {
    console.error('Error in getSetoranStats:', error);
    return {
      totalSetoran: 0,
      avgKelancaran: 0,
      avgTajwid: 0,
      avgTahsin: 0
    };
  }
}
