
import { createClient } from "@supabase/supabase-js";
import { Santri, Setoran } from "@/types";

// Import the Supabase client from our integration
import { supabase } from "@/integrations/supabase/client";

// Santri functions
export const fetchSantri = async (): Promise<Santri[]> => {
  const { data, error } = await supabase
    .from('santri')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching santri:", error);
    throw error;
  }

  return data || [];
};

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

  return data || [];
};

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

  return data;
};

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

  return data;
};

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

// Setoran functions
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

// Achievement functions
export const fetchTopHafalan = async (gender?: "Ikhwan" | "Akhwat"): Promise<any[]> => {
  let query = supabase
    .from('santri')
    .select('id, nama, kelas, jenis_kelamin, total_hafalan')
    .order('total_hafalan', { ascending: false })
    .limit(10);
  
  if (gender) {
    query = query.eq('jenis_kelamin', gender);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching top hafalan:", error);
    throw error;
  }

  return data || [];
};

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

export const fetchTopPerformers = async (gender?: "Ikhwan" | "Akhwat"): Promise<any[]> => {
  // This requires a more complex query with Supabase - for simplicity, 
  // we'll implement a basic version here
  let query = supabase
    .from('setoran')
    .select(`
      santri_id,
      santri:santri_id (nama, kelas, jenis_kelamin),
      kelancaran,
      tajwid,
      tahsin
    `);
  
  if (gender) {
    query = query.eq('santri.jenis_kelamin', gender);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching top performers:", error);
    throw error;
  }

  // Process data to get average scores
  const scoreMap = new Map();
  
  data?.forEach(item => {
    const santriId = item.santri_id;
    const avgScore = (item.kelancaran + item.tajwid + item.tahsin) / 3;
    
    if (scoreMap.has(santriId)) {
      const current = scoreMap.get(santriId);
      scoreMap.set(santriId, {
        ...current,
        totalScore: current.totalScore + avgScore,
        count: current.count + 1
      });
    } else {
      scoreMap.set(santriId, {
        santri: item.santri,
        totalScore: avgScore,
        count: 1
      });
    }
  });
  
  // Calculate averages and sort
  const result = Array.from(scoreMap.entries()).map(([id, data]: [string, any]) => ({
    id,
    nama: data.santri.nama,
    kelas: data.santri.kelas,
    jenis_kelamin: data.santri.jenis_kelamin,
    nilai_rata: data.totalScore / data.count
  })).sort((a, b) => b.nilai_rata - a.nilai_rata).slice(0, 10);

  return result;
};

export default {
  fetchSantri,
  fetchSantriByClass,
  fetchSantriById,
  createSantri,
  deleteSantri,
  fetchSetoran,
  fetchSetoranBySantri,
  createSetoran,
  deleteSetoran,
  fetchTopHafalan,
  updateTotalHafalan,
  fetchTopPerformers
};
