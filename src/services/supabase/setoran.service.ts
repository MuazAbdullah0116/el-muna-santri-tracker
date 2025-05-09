
import { Setoran } from "@/types";
import { supabase } from "./client";

/**
 * Fetches all setoran records
 */
export const fetchSetoran = async (): Promise<Setoran[]> => {
  const { data, error } = await supabase
    .from('setoran')
    .select('*')
    .order('tanggal', { ascending: false });

  if (error) {
    console.error("Error fetching setoran:", error);
    throw error;
  }

  return data || [];
};

/**
 * Fetches setoran records for a specific santri
 */
export const fetchSetoranBySantri = async (santriId: string): Promise<Setoran[]> => {
  const { data, error } = await supabase
    .from('setoran')
    .select('*')
    .eq('santri_id', santriId)
    .order('tanggal', { ascending: false });

  if (error) {
    console.error("Error fetching setoran by santri:", error);
    throw error;
  }

  return data || [];
};

/**
 * Creates a new setoran record
 */
export const createSetoran = async (setoran: Omit<Setoran, 'id' | 'created_at'>): Promise<Setoran> => {
  const { data, error } = await supabase
    .from('setoran')
    .insert([setoran])
    .select()
    .single();

  if (error) {
    console.error("Error creating setoran:", error);
    throw error;
  }

  return data;
};

/**
 * Deletes a setoran record by ID
 */
export const deleteSetoran = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('setoran')
    .delete()
    .eq('id', id);

  if (error) {
    console.error("Error deleting setoran:", error);
    throw error;
  }
};

/**
 * Updates the total hafalan count for a santri based on their setoran records
 */
export const updateTotalHafalan = async (santriId: string): Promise<void> => {
  // Get all setoran for this santri
  const { data: setoran, error: setoranError } = await supabase
    .from('setoran')
    .select('awal_ayat, akhir_ayat')
    .eq('santri_id', santriId);

  if (setoranError) {
    console.error("Error fetching setoran for total hafalan:", setoranError);
    throw setoranError;
  }

  // Calculate total ayat
  const totalAyat = setoran?.reduce((sum, item) => {
    const count = (item.akhir_ayat - item.awal_ayat) + 1;
    return sum + count;
  }, 0) || 0;

  // Update santri record
  const { error: updateError } = await supabase
    .from('santri')
    .update({ total_hafalan: totalAyat })
    .eq('id', santriId);

  if (updateError) {
    console.error("Error updating total hafalan:", updateError);
    throw updateError;
  }
};
