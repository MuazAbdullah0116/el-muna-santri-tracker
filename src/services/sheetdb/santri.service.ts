
import { Santri } from "@/types";
import { sheetdbFetch, SHEETDB_CONFIG } from "./client";

/**
 * Fetches all santri records, optionally filtered by search query
 */
export const fetchSantri = async (searchQuery?: string): Promise<Santri[]> => {
  console.log("Fetching santri from SheetDB with search:", searchQuery);
  try {
    const data = await sheetdbFetch(SHEETDB_CONFIG.SANTRI_API_URL);
    
    let santris = data || [];
    
    // Apply search filter if query is provided
    if (searchQuery) {
      santris = santris.filter((santri: any) => 
        santri.nama?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    console.log("Santri data retrieved:", santris.length, "records");
    // Ensure proper type casting and add missing fields
    return santris.map((item: any) => ({
      id: item.id || item.ID || Math.random().toString(),
      nama: item.nama || item.Nama || '',
      kelas: parseInt(item.kelas || item.Kelas || '7'),
      jenis_kelamin: (item.jenis_kelamin || item['Jenis Kelamin'] || 'Ikhwan') as "Ikhwan" | "Akhwat",
      total_hafalan: parseInt(item.total_hafalan || item['Total Hafalan'] || '0'),
      created_at: item.created_at || item['Created At'] || new Date().toISOString()
    }));
  } catch (err) {
    console.error("Exception in fetchSantri:", err);
    throw err;
  }
};

/**
 * Fetches santri records filtered by class
 */
export const fetchSantriByClass = async (kelas: number): Promise<Santri[]> => {
  console.log("Fetching santri by class from SheetDB:", kelas);
  try {
    const data = await sheetdbFetch(`${SHEETDB_CONFIG.SANTRI_API_URL}/search?kelas=${kelas}`);
    
    console.log("Santri data by class retrieved:", data?.length || 0, "records");
    return (data || []).map((item: any) => ({
      id: item.id || item.ID || Math.random().toString(),
      nama: item.nama || item.Nama || '',
      kelas: parseInt(item.kelas || item.Kelas || '7'),
      jenis_kelamin: (item.jenis_kelamin || item['Jenis Kelamin'] || 'Ikhwan') as "Ikhwan" | "Akhwat",
      total_hafalan: parseInt(item.total_hafalan || item['Total Hafalan'] || '0'),
      created_at: item.created_at || item['Created At'] || new Date().toISOString()
    }));
  } catch (err) {
    console.error("Exception in fetchSantriByClass:", err);
    throw err;
  }
};

/**
 * Fetches a single santri by ID
 */
export const fetchSantriById = async (id: string): Promise<Santri | null> => {
  console.log("Fetching santri by id from SheetDB:", id);
  try {
    const data = await sheetdbFetch(`${SHEETDB_CONFIG.SANTRI_API_URL}/search?id=${id}`);
    
    if (!data || data.length === 0) return null;
    
    const item = data[0];
    console.log("Santri retrieved:", item);
    return {
      id: item.id || item.ID || id,
      nama: item.nama || item.Nama || '',
      kelas: parseInt(item.kelas || item.Kelas || '7'),
      jenis_kelamin: (item.jenis_kelamin || item['Jenis Kelamin'] || 'Ikhwan') as "Ikhwan" | "Akhwat",
      total_hafalan: parseInt(item.total_hafalan || item['Total Hafalan'] || '0'),
      created_at: item.created_at || item['Created At'] || new Date().toISOString()
    };
  } catch (err) {
    console.error("Exception in fetchSantriById:", err);
    throw err;
  }
};

/**
 * Creates a new santri record
 */
export const createSantri = async (santri: Omit<Santri, 'id' | 'created_at' | 'total_hafalan'>): Promise<Santri> => {
  console.log("Creating santri in SheetDB:", santri);
  try {
    const newSantri = {
      id: Math.random().toString(36).substring(2, 15),
      nama: santri.nama,
      kelas: santri.kelas,
      jenis_kelamin: santri.jenis_kelamin,
      total_hafalan: 0,
      created_at: new Date().toISOString()
    };

    await sheetdbFetch(SHEETDB_CONFIG.SANTRI_API_URL, {
      method: 'POST',
      body: JSON.stringify({
        data: [newSantri]
      }),
    });

    console.log("Santri created:", newSantri);
    return newSantri;
  } catch (err) {
    console.error("Exception in createSantri:", err);
    throw err;
  }
};

/**
 * Deletes a santri record by ID
 */
export const deleteSantri = async (id: string): Promise<void> => {
  console.log("Deleting santri from SheetDB:", id);
  try {
    await sheetdbFetch(`${SHEETDB_CONFIG.SANTRI_API_URL}/id/${id}`, {
      method: 'DELETE',
    });
    
    console.log("Santri deleted successfully");
  } catch (err) {
    console.error("Exception in deleteSantri:", err);
    throw err;
  }
};
