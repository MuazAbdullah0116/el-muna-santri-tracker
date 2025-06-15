
import { Setoran } from "@/types";
import { sheetdbFetch, SHEETDB_CONFIG } from "./client";

/**
 * Fetches all setoran records
 */
export const fetchSetoran = async (): Promise<Setoran[]> => {
  console.log("Fetching all setoran records from SheetDB");
  try {
    const data = await sheetdbFetch(SHEETDB_CONFIG.SETORAN_API_URL);

    console.log("Setoran data retrieved:", data?.length || 0, "records");
    return (data || []).map((item: any) => ({
      id: item.id || item.ID || Math.random().toString(),
      santri_id: item.santri_id || item['Santri ID'] || '',
      tanggal: item.tanggal || item.Tanggal || '',
      juz: parseInt(item.juz || item.Juz || '1'),
      surat: item.surat || item.Surat || '',
      awal_ayat: parseInt(item.awal_ayat || item['Awal Ayat'] || '1'),
      akhir_ayat: parseInt(item.akhir_ayat || item['Akhir Ayat'] || '1'),
      kelancaran: parseInt(item.kelancaran || item.Kelancaran || '5'),
      tajwid: parseInt(item.tajwid || item.Tajwid || '5'),
      tahsin: parseInt(item.tahsin || item.Tahsin || '5'),
      catatan: item.catatan || item.Catatan || '',
      diuji_oleh: item.diuji_oleh || item['Diuji Oleh'] || '',
      created_at: item.created_at || item['Created At'] || new Date().toISOString()
    }));
  } catch (err) {
    console.error("Exception in fetchSetoran:", err);
    throw err;
  }
};

/**
 * Fetches setoran records for a specific santri
 */
export const fetchSetoranBySantri = async (santriId: string): Promise<Setoran[]> => {
  console.log("Fetching setoran records for santri from SheetDB:", santriId);
  try {
    const data = await sheetdbFetch(`${SHEETDB_CONFIG.SETORAN_API_URL}/search?santri_id=${santriId}`);

    console.log("Setoran data for santri retrieved:", data?.length || 0, "records");
    return (data || []).map((item: any) => ({
      id: item.id || item.ID || Math.random().toString(),
      santri_id: item.santri_id || item['Santri ID'] || santriId,
      tanggal: item.tanggal || item.Tanggal || '',
      juz: parseInt(item.juz || item.Juz || '1'),
      surat: item.surat || item.Surat || '',
      awal_ayat: parseInt(item.awal_ayat || item['Awal Ayat'] || '1'),
      akhir_ayat: parseInt(item.akhir_ayat || item['Akhir Ayat'] || '1'),
      kelancaran: parseInt(item.kelancaran || item.Kelancaran || '5'),
      tajwid: parseInt(item.tajwid || item.Tajwid || '5'),
      tahsin: parseInt(item.tahsin || item.Tahsin || '5'),
      catatan: item.catatan || item.Catatan || '',
      diuji_oleh: item.diuji_oleh || item['Diuji Oleh'] || '',
      created_at: item.created_at || item['Created At'] || new Date().toISOString()
    }));
  } catch (err) {
    console.error("Exception in fetchSetoranBySantri:", err);
    throw err;
  }
};

/**
 * Creates a new setoran record
 */
export const createSetoran = async (setoran: Omit<Setoran, 'id' | 'created_at'>): Promise<Setoran> => {
  console.log("Creating setoran in SheetDB:", setoran);
  try {
    const newSetoran = {
      id: Math.random().toString(36).substring(2, 15),
      santri_id: setoran.santri_id,
      tanggal: setoran.tanggal,
      juz: setoran.juz,
      surat: setoran.surat,
      awal_ayat: setoran.awal_ayat,
      akhir_ayat: setoran.akhir_ayat,
      kelancaran: setoran.kelancaran,
      tajwid: setoran.tajwid,
      tahsin: setoran.tahsin,
      catatan: setoran.catatan,
      diuji_oleh: setoran.diuji_oleh,
      created_at: new Date().toISOString()
    };

    await sheetdbFetch(SHEETDB_CONFIG.SETORAN_API_URL, {
      method: 'POST',
      body: JSON.stringify({
        data: [newSetoran]
      }),
    });

    console.log("Setoran created:", newSetoran);
    
    // Update the total hafalan count for this santri
    await updateTotalHafalan(setoran.santri_id);
    
    return newSetoran;
  } catch (err) {
    console.error("Exception in createSetoran:", err);
    throw err;
  }
};

/**
 * Deletes a setoran record by ID
 */
export const deleteSetoran = async (id: string): Promise<void> => {
  console.log("Deleting setoran from SheetDB:", id);
  try {
    // First get the setoran to find the santri_id
    const data = await sheetdbFetch(`${SHEETDB_CONFIG.SETORAN_API_URL}/search?id=${id}`);
    
    if (!data || data.length === 0) {
      throw new Error("Setoran not found");
    }
    
    const santriId = data[0].santri_id || data[0]['Santri ID'];
    
    // Now delete the setoran
    await sheetdbFetch(`${SHEETDB_CONFIG.SETORAN_API_URL}/id/${id}`, {
      method: 'DELETE',
    });
    
    console.log("Setoran deleted successfully");
    
    // Update the total hafalan count for this santri
    await updateTotalHafalan(santriId);
  } catch (err) {
    console.error("Exception in deleteSetoran:", err);
    throw err;
  }
};

/**
 * Updates the total hafalan count for a santri based on their setoran records
 */
export const updateTotalHafalan = async (santriId: string): Promise<void> => {
  console.log("Updating total hafalan for santri in SheetDB:", santriId);
  try {
    // Get all setoran for this santri
    const setoran = await fetchSetoranBySantri(santriId);

    // Calculate total ayat
    const totalAyat = setoran.reduce((sum, item) => {
      const count = (item.akhir_ayat - item.awal_ayat) + 1;
      return sum + count;
    }, 0);
    
    console.log("Calculated total hafalan ayat count:", totalAyat);

    // Update santri record
    await sheetdbFetch(`${SHEETDB_CONFIG.SANTRI_API_URL}/id/${santriId}`, {
      method: 'PATCH',
      body: JSON.stringify({
        data: {
          total_hafalan: totalAyat
        }
      }),
    });
    
    console.log("Total hafalan updated successfully");
  } catch (err) {
    console.error("Exception in updateTotalHafalan:", err);
    throw err;
  }
};

/**
 * Gets the formatted hafalan progress (juz, pages, lines) for a santri
 */
export const getFormattedHafalanProgress = (totalAyat: number): string => {
  // Simple calculation for demo - you can enhance this based on actual Quran data
  const juz = Math.floor(totalAyat / 200); // Rough estimate
  const pages = Math.floor(totalAyat / 15); // Rough estimate
  return `${juz} Juz, ${pages} Halaman (${totalAyat} Ayat)`;
};
