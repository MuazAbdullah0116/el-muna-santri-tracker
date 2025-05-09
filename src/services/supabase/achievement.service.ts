
import { supabase } from "./client";

/**
 * Fetches top santri by hafalan amount, optionally filtered by gender
 */
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

  // Cast the jenis_kelamin to ensure type safety for each row
  return (data || []).map(item => ({
    ...item,
    jenis_kelamin: item.jenis_kelamin as "Ikhwan" | "Akhwat"
  }));
};

/**
 * Fetches top performers based on average scores, optionally filtered by gender
 */
export const fetchTopPerformers = async (gender?: "Ikhwan" | "Akhwat"): Promise<any[]> => {
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
      // Cast the jenis_kelamin for the santri
      const santri = {
        ...item.santri,
        jenis_kelamin: item.santri.jenis_kelamin as "Ikhwan" | "Akhwat"
      };
      
      scoreMap.set(santriId, {
        santri,
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
