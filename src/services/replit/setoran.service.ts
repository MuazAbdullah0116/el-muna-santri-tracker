
import { Setoran } from "@/types";

const API_BASE_URL = "https://d0edd15f-b9c9-48e8-aae9-01525773bde5-00-1l404kgs7qvf9.pike.replit.dev/api/data";

/**
 * Fetches all setoran records from Replit API
 */
export const fetchSetoran = async (): Promise<Setoran[]> => {
  console.log("Fetching all setoran records from Replit API");
  try {
    const response = await fetch(API_BASE_URL);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("Setoran data retrieved:", data?.length || 0, "records");
    return data || [];
  } catch (error) {
    console.error("Error fetching setoran from Replit API:", error);
    throw error;
  }
};

/**
 * Fetches setoran records for a specific santri from Replit API
 */
export const fetchSetoranBySantri = async (santriId: string): Promise<Setoran[]> => {
  console.log("Fetching setoran records for santri:", santriId);
  try {
    const allSetoran = await fetchSetoran();
    const santriSetoran = allSetoran.filter(setoran => setoran.santri_id === santriId);
    console.log("Setoran data for santri retrieved:", santriSetoran.length, "records");
    return santriSetoran;
  } catch (error) {
    console.error("Error fetching setoran by santri from Replit API:", error);
    throw error;
  }
};

/**
 * Creates a new setoran record via Replit API
 */
export const createSetoran = async (setoran: Omit<Setoran, 'id' | 'created_at'>): Promise<Setoran> => {
  console.log("Creating setoran via Replit API:", setoran);
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...setoran,
        id: crypto.randomUUID(), // Generate ID on client side
        created_at: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Setoran created via Replit API:", data);
    return data;
  } catch (error) {
    console.error("Error creating setoran via Replit API:", error);
    throw error;
  }
};

/**
 * Deletes a setoran record by ID via Replit API
 */
export const deleteSetoran = async (id: string): Promise<void> => {
  console.log("Deleting setoran via Replit API:", id);
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    console.log("Setoran deleted successfully via Replit API");
  } catch (error) {
    console.error("Error deleting setoran via Replit API:", error);
    throw error;
  }
};

/**
 * Updates the total hafalan count for a santri based on their setoran records
 */
export const updateTotalHafalan = async (santriId: string): Promise<void> => {
  console.log("Updating total hafalan for santri:", santriId);
  try {
    const setoran = await fetchSetoranBySantri(santriId);
    
    // Calculate total ayat
    const totalAyat = setoran.reduce((sum, item) => {
      const count = (item.akhir_ayat - item.awal_ayat) + 1;
      return sum + count;
    }, 0);
    
    console.log("Calculated total hafalan ayat count:", totalAyat);
    // Note: This would need to be implemented if we also switch santri API
    // For now, we just log the calculation
  } catch (error) {
    console.error("Exception in updateTotalHafalan:", error);
    throw error;
  }
};

/**
 * Gets the formatted hafalan progress (juz, pages, lines) for a santri
 */
export const getFormattedHafalanProgress = (totalAyat: number): string => {
  // Simple formatting - this could be enhanced based on your needs
  const juz = Math.floor(totalAyat / 200); // Rough estimate
  const pages = Math.floor((totalAyat % 200) / 10);
  const lines = (totalAyat % 200) % 10;
  
  return `${juz} Juz, ${pages} Halaman, ${lines} Baris`;
};
