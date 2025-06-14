import { Setoran } from "@/types";
import { googleSheetsService } from "./sheets.service";

export const fetchSetoran = async (): Promise<Setoran[]> => {
  console.log("Fetching all setoran records");
  try {
    const data = await googleSheetsService.getAllSetoran();
    console.log("Setoran data retrieved:", data?.length || 0, "records");
    return data || [];
  } catch (err) {
    console.error("Exception in fetchSetoran:", err);
    throw err;
  }
};

export const fetchSetoranBySantri = async (santriId: string): Promise<Setoran[]> => {
  console.log("Fetching setoran records for santri:", santriId);
  try {
    const data = await googleSheetsService.getSetoranBySantri(santriId);
    console.log("Setoran data for santri retrieved:", data?.length || 0, "records");
    return data || [];
  } catch (err) {
    console.error("Exception in fetchSetoranBySantri:", err);
    throw err;
  }
};

export const createSetoran = async (setoran: Omit<Setoran, 'id' | 'created_at'>): Promise<Setoran> => {
  console.log("Creating setoran:", setoran);
  try {
    const data = await googleSheetsService.createSetoran(setoran);
    console.log("Setoran created:", data);
    return data;
  } catch (err) {
    console.error("Exception in createSetoran:", err);
    throw err;
  }
};

export const deleteSetoran = async (id: string): Promise<void> => {
  console.log("Deleting setoran:", id);
  try {
    await googleSheetsService.deleteSetoran(id);
    console.log("Setoran deleted successfully");
  } catch (err) {
    console.error("Exception in deleteSetoran:", err);
    throw err;
  }
};

export const updateTotalHafalan = async (santriId: string): Promise<void> => {
  // This is handled automatically by the Apps Script
  console.log("Total hafalan updated automatically by Apps Script for santri:", santriId);
};

export const getFormattedHafalanProgress = (totalAyat: number): string => {
  if (totalAyat === 0) return "0 Ayat";
  
  const juz = Math.floor(totalAyat / 600);
  const remainingAyat = totalAyat % 600;
  const pages = Math.floor(remainingAyat / 15);
  const lines = remainingAyat % 15;
  
  let result = "";
  if (juz > 0) result += `${juz} Juz `;
  if (pages > 0) result += `${pages} Halaman `;
  if (lines > 0) result += `${lines} Baris `;
  
  return result.trim() || `${totalAyat} Ayat`;
};
