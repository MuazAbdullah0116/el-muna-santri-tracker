
import { Santri } from "@/types";
import { googleSheetsService } from "./sheets.service";

export const fetchSantri = async (searchQuery?: string): Promise<Santri[]> => {
  console.log("Fetching santri with search:", searchQuery);
  try {
    const data = await googleSheetsService.getAllSantri(searchQuery);
    console.log("Santri data retrieved:", data?.length || 0, "records");
    
    return (data || []).map((item: any) => ({
      ...item,
      jenis_kelamin: item.jenis_kelamin as "Ikhwan" | "Akhwat"
    }));
  } catch (err) {
    console.error("Exception in fetchSantri:", err);
    throw err;
  }
};

export const fetchSantriByClass = async (kelas: number): Promise<Santri[]> => {
  console.log("Fetching santri by class:", kelas);
  try {
    const data = await googleSheetsService.getSantriByClass(kelas);
    console.log("Santri data by class retrieved:", data?.length || 0, "records");
    
    return (data || []).map((item: any) => ({
      ...item,
      jenis_kelamin: item.jenis_kelamin as "Ikhwan" | "Akhwat"
    }));
  } catch (err) {
    console.error("Exception in fetchSantriByClass:", err);
    throw err;
  }
};

export const fetchSantriById = async (id: string): Promise<Santri | null> => {
  console.log("Fetching santri by id:", id);
  try {
    const data = await googleSheetsService.getSantriById(id);
    
    if (!data) return null;
    
    console.log("Santri retrieved:", data);
    return {
      ...data,
      jenis_kelamin: data.jenis_kelamin as "Ikhwan" | "Akhwat"
    };
  } catch (err) {
    console.error("Exception in fetchSantriById:", err);
    throw err;
  }
};

export const createSantri = async (santri: Omit<Santri, 'id' | 'created_at' | 'total_hafalan'>): Promise<Santri> => {
  console.log("Creating santri:", santri);
  try {
    const data = await googleSheetsService.createSantri(santri);
    console.log("Santri created:", data);
    
    return {
      ...data,
      jenis_kelamin: data.jenis_kelamin as "Ikhwan" | "Akhwat"
    };
  } catch (err) {
    console.error("Exception in createSantri:", err);
    throw err;
  }
};

export const deleteSantri = async (id: string): Promise<void> => {
  console.log("Deleting santri:", id);
  try {
    await googleSheetsService.deleteSantri(id);
    console.log("Santri deleted successfully");
  } catch (err) {
    console.error("Exception in deleteSantri:", err);
    throw err;
  }
};
