
import { Setoran } from "@/types";

const SHEETY_API_BASE = "https://api.sheety.co/35f6e5ef5228a828061be2646f234786/setoran/sheet1";

/**
 * Fetches all setoran records from Sheety
 */
export const fetchSetoran = async (): Promise<Setoran[]> => {
  console.log("Fetching all setoran records from Sheety");
  try {
    const response = await fetch(SHEETY_API_BASE);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("Setoran data retrieved from Sheety:", data?.sheet1?.length || 0, "records");
    
    // Transform Sheety data to match our Setoran interface
    const setorans = data.sheet1?.map((item: any) => ({
      id: item.id.toString(),
      santri_id: item.santriId,
      tanggal: item.tanggal,
      juz: parseInt(item.juz),
      surat: item.surat,
      awal_ayat: parseInt(item.awalAyat),
      akhir_ayat: parseInt(item.akhirAyat),
      kelancaran: parseInt(item.kelancaran),
      tajwid: parseInt(item.tajwid),
      tahsin: parseInt(item.tahsin),
      catatan: item.catatan || "",
      diuji_oleh: item.diujiOleh,
      created_at: item.createdAt
    })) || [];
    
    return setorans;
  } catch (err) {
    console.error("Exception in fetchSetoran:", err);
    throw err;
  }
};

/**
 * Fetches setoran records for a specific santri from Sheety
 */
export const fetchSetoranBySantri = async (santriId: string): Promise<Setoran[]> => {
  console.log("Fetching setoran records for santri from Sheety:", santriId);
  try {
    const allSetoran = await fetchSetoran();
    const santriSetoran = allSetoran.filter(setoran => setoran.santri_id === santriId);
    
    console.log("Setoran data for santri retrieved from Sheety:", santriSetoran.length, "records");
    return santriSetoran.sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());
  } catch (err) {
    console.error("Exception in fetchSetoranBySantri:", err);
    throw err;
  }
};

/**
 * Creates a new setoran record in Sheety
 */
export const createSetoran = async (setoran: Omit<Setoran, 'id' | 'created_at'>): Promise<Setoran> => {
  console.log("Creating setoran in Sheety:", setoran);
  try {
    const body = {
      sheet1: {
        santriId: setoran.santri_id,
        tanggal: setoran.tanggal,
        juz: setoran.juz,
        surat: setoran.surat,
        awalAyat: setoran.awal_ayat,
        akhirAyat: setoran.akhir_ayat,
        kelancaran: setoran.kelancaran,
        tajwid: setoran.tajwid,
        tahsin: setoran.tahsin,
        catatan: setoran.catatan,
        diujiOleh: setoran.diuji_oleh,
        createdAt: new Date().toISOString()
      }
    };

    const response = await fetch(SHEETY_API_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Setoran created in Sheety:", data);

    // Transform response back to our format
    const createdSetoran: Setoran = {
      id: data.sheet1.id.toString(),
      santri_id: data.sheet1.santriId,
      tanggal: data.sheet1.tanggal,
      juz: parseInt(data.sheet1.juz),
      surat: data.sheet1.surat,
      awal_ayat: parseInt(data.sheet1.awalAyat),
      akhir_ayat: parseInt(data.sheet1.akhirAyat),
      kelancaran: parseInt(data.sheet1.kelancaran),
      tajwid: parseInt(data.sheet1.tajwid),
      tahsin: parseInt(data.sheet1.tahsin),
      catatan: data.sheet1.catatan || "",
      diuji_oleh: data.sheet1.diujiOleh,
      created_at: data.sheet1.createdAt
    };

    return createdSetoran;
  } catch (err) {
    console.error("Exception in createSetoran:", err);
    throw err;
  }
};

/**
 * Deletes a setoran record by ID from Sheety
 */
export const deleteSetoran = async (id: string): Promise<void> => {
  console.log("Deleting setoran from Sheety:", id);
  try {
    const response = await fetch(`${SHEETY_API_BASE}/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    console.log("Setoran deleted successfully from Sheety");
  } catch (err) {
    console.error("Exception in deleteSetoran:", err);
    throw err;
  }
};

/**
 * Updates a setoran record in Sheety
 */
export const updateSetoran = async (id: string, setoran: Partial<Omit<Setoran, 'id' | 'created_at'>>): Promise<Setoran> => {
  console.log("Updating setoran in Sheety:", id, setoran);
  try {
    const body = {
      sheet1: {
        ...(setoran.santri_id && { santriId: setoran.santri_id }),
        ...(setoran.tanggal && { tanggal: setoran.tanggal }),
        ...(setoran.juz && { juz: setoran.juz }),
        ...(setoran.surat && { surat: setoran.surat }),
        ...(setoran.awal_ayat && { awalAyat: setoran.awal_ayat }),
        ...(setoran.akhir_ayat && { akhirAyat: setoran.akhir_ayat }),
        ...(setoran.kelancaran && { kelancaran: setoran.kelancaran }),
        ...(setoran.tajwid && { tajwid: setoran.tajwid }),
        ...(setoran.tahsin && { tahsin: setoran.tahsin }),
        ...(setoran.catatan !== undefined && { catatan: setoran.catatan }),
        ...(setoran.diuji_oleh && { diujiOleh: setoran.diuji_oleh })
      }
    };

    const response = await fetch(`${SHEETY_API_BASE}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Setoran updated in Sheety:", data);

    // Transform response back to our format
    const updatedSetoran: Setoran = {
      id: data.sheet1.id.toString(),
      santri_id: data.sheet1.santriId,
      tanggal: data.sheet1.tanggal,
      juz: parseInt(data.sheet1.juz),
      surat: data.sheet1.surat,
      awal_ayat: parseInt(data.sheet1.awalAyat),
      akhir_ayat: parseInt(data.sheet1.akhirAyat),
      kelancaran: parseInt(data.sheet1.kelancaran),
      tajwid: parseInt(data.sheet1.tajwid),
      tahsin: parseInt(data.sheet1.tahsin),
      catatan: data.sheet1.catatan || "",
      diuji_oleh: data.sheet1.diujiOleh,
      created_at: data.sheet1.createdAt
    };

    return updatedSetoran;
  } catch (err) {
    console.error("Exception in updateSetoran:", err);
    throw err;
  }
};
