
import { Santri } from "@/types";
import { supabase } from "./client";

/**
 * Fetches all santri records, optionally filtered by search query
 */
export const fetchSantri = async (searchQuery?: string): Promise<Santri[]> => {
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

  // Cast the jenis_kelamin to ensure type safety
  return (data || []).map(item => ({
    ...item,
    jenis_kelamin: item.jenis_kelamin as "Ikhwan" | "Akhwat"
  }));
};

/**
 * Fetches santri records filtered by class
 */
export const fetchSantriByClass = async (kelas: number): Promise<Santri[]> => {
  const { data, error } = await supabase
    .from('santri')
    .select('*')
    .eq('kelas', kelas)
    .order('nama', { ascending: true });

  if (error) {
    console.error("Error fetching santri by class:", error);
    throw error;
  }

  // Cast the jenis_kelamin to ensure type safety
  return (data || []).map(item => ({
    ...item,
    jenis_kelamin: item.jenis_kelamin as "Ikhwan" | "Akhwat"
  }));
};

/**
 * Fetches a single santri by ID
 */
export const fetchSantriById = async (id: string): Promise<Santri | null> => {
  const { data, error } = await supabase
    .from('santri')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error("Error fetching santri by id:", error);
    throw error;
  }

  if (!data) return null;

  // Cast the jenis_kelamin to ensure type safety
  return {
    ...data,
    jenis_kelamin: data.jenis_kelamin as "Ikhwan" | "Akhwat"
  };
};

/**
 * Creates a new santri record
 */
export const createSantri = async (santri: Omit<Santri, 'id' | 'created_at' | 'total_hafalan'>): Promise<Santri> => {
  const { data, error } = await supabase
    .from('santri')
    .insert([santri])
    .select()
    .single();

  if (error) {
    console.error("Error creating santri:", error);
    throw error;
  }

  // Cast the jenis_kelamin to ensure type safety
  return {
    ...data,
    jenis_kelamin: data.jenis_kelamin as "Ikhwan" | "Akhwat"
  };
};

/**
 * Deletes a santri record by ID
 */
export const deleteSantri = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('santri')
    .delete()
    .eq('id', id);

  if (error) {
    console.error("Error deleting santri:", error);
    throw error;
  }
};
