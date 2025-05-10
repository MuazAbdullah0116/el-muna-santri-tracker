
import { Setoran } from "@/types";
import { supabase } from "./client";

/**
 * Fetches all setoran records
 */
export const fetchSetoran = async (): Promise<Setoran[]> => {
  console.log("Fetching all setoran records");
  try {
    const { data, error } = await supabase
      .from('setoran')
      .select('*')
      .order('tanggal', { ascending: false });

    if (error) {
      console.error("Error fetching setoran:", error);
      throw error;
    }

    console.log("Setoran data retrieved:", data?.length || 0, "records");
    return data || [];
  } catch (err) {
    console.error("Exception in fetchSetoran:", err);
    throw err;
  }
};

/**
 * Fetches setoran records for a specific santri
 */
export const fetchSetoranBySantri = async (santriId: string): Promise<Setoran[]> => {
  console.log("Fetching setoran records for santri:", santriId);
  try {
    const { data, error } = await supabase
      .from('setoran')
      .select('*')
      .eq('santri_id', santriId)
      .order('tanggal', { ascending: false });

    if (error) {
      console.error("Error fetching setoran by santri:", error);
      throw error;
    }

    console.log("Setoran data for santri retrieved:", data?.length || 0, "records");
    return data || [];
  } catch (err) {
    console.error("Exception in fetchSetoranBySantri:", err);
    throw err;
  }
};

/**
 * Creates a new setoran record
 */
export const createSetoran = async (setoran: Omit<Setoran, 'id' | 'created_at'>): Promise<Setoran> => {
  console.log("Creating setoran:", setoran);
  try {
    const { data, error } = await supabase
      .from('setoran')
      .insert([setoran])
      .select()
      .single();

    if (error) {
      console.error("Error creating setoran:", error);
      throw error;
    }

    console.log("Setoran created:", data);
    
    // Update the total hafalan count for this santri
    await updateTotalHafalan(setoran.santri_id);
    
    return data;
  } catch (err) {
    console.error("Exception in createSetoran:", err);
    throw err;
  }
};

/**
 * Deletes a setoran record by ID
 */
export const deleteSetoran = async (id: string): Promise<void> => {
  console.log("Deleting setoran:", id);
  try {
    // First get the setoran to find the santri_id
    const { data: setoranData, error: setoranError } = await supabase
      .from('setoran')
      .select('santri_id')
      .eq('id', id)
      .single();
      
    if (setoranError) {
      console.error("Error getting setoran before delete:", setoranError);
      throw setoranError;
    }
    
    const santriId = setoranData.santri_id;
    
    // Now delete the setoran
    const { error } = await supabase
      .from('setoran')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Error deleting setoran:", error);
      throw error;
    }
    
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
  console.log("Updating total hafalan for santri:", santriId);
  try {
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
    
    console.log("Calculated total hafalan:", totalAyat);

    // Update santri record
    const { error: updateError } = await supabase
      .from('santri')
      .update({ total_hafalan: totalAyat })
      .eq('id', santriId);

    if (updateError) {
      console.error("Error updating total hafalan:", updateError);
      throw updateError;
    }
    
    console.log("Total hafalan updated successfully");
  } catch (err) {
    console.error("Exception in updateTotalHafalan:", err);
    throw err;
  }
};
