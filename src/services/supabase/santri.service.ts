
import { Santri } from "@/types";
import { supabase } from "./client";

/**
 * Fetches all santri records, optionally filtered by search query
 */
export const fetchSantri = async (searchQuery?: string): Promise<Santri[]> => {
  console.log("Fetching santri with search:", searchQuery);
  try {
    let query = supabase
      .from('santri')
      .select('*')
      .order('created_at', { ascending: false });
    
    // Apply search filter if query is provided
    if (searchQuery) {
      query = query.ilike('nama', `%${searchQuery}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching santri:", error);
      throw error;
    }

    console.log("Santri data retrieved:", data);
    // Cast the jenis_kelamin to ensure type safety
    return (data || []).map(item => ({
      ...item,
      jenis_kelamin: item.jenis_kelamin as "Ikhwan" | "Akhwat"
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
  console.log("Fetching santri by class:", kelas);
  try {
    const { data, error } = await supabase
      .from('santri')
      .select('*')
      .eq('kelas', kelas)
      .order('nama', { ascending: true });

    if (error) {
      console.error("Error fetching santri by class:", error);
      throw error;
    }

    console.log("Santri data by class retrieved:", data);
    // Cast the jenis_kelamin to ensure type safety
    return (data || []).map(item => ({
      ...item,
      jenis_kelamin: item.jenis_kelamin as "Ikhwan" | "Akhwat"
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
  console.log("Fetching santri by id:", id);
  try {
    const { data, error } = await supabase
      .from('santri')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error("Error fetching santri by id:", error);
      throw error;
    }

    if (!data) return null;
    
    console.log("Santri retrieved:", data);
    // Cast the jenis_kelamin to ensure type safety
    return {
      ...data,
      jenis_kelamin: data.jenis_kelamin as "Ikhwan" | "Akhwat"
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
  console.log("Creating santri:", santri);
  try {
    const { data, error } = await supabase
      .from('santri')
      .insert([
        {
          ...santri,
          total_hafalan: 0 // Ensure total_hafalan is set to default 0
        }
      ])
      .select()
      .single();

    if (error) {
      console.error("Error creating santri:", error);
      throw error;
    }

    console.log("Santri created:", data);
    // Cast the jenis_kelamin to ensure type safety
    return {
      ...data,
      jenis_kelamin: data.jenis_kelamin as "Ikhwan" | "Akhwat"
    };
  } catch (err) {
    console.error("Exception in createSantri:", err);
    throw err;
  }
};

/**
 * Deletes a santri record by ID
 */
export const deleteSantri = async (id: string): Promise<void> => {
  console.log("Deleting santri:", id);
  try {
    const { error } = await supabase
      .from('santri')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Error deleting santri:", error);
      throw error;
    }
    
    console.log("Santri deleted successfully");
  } catch (err) {
    console.error("Exception in deleteSantri:", err);
    throw err;
  }
};
