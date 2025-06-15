
import { supabase } from "./client";
import { getHafalanScore } from "../quran/quranMapping";

/**
 * Fetches top santri by hafalan amount, optionally filtered by gender
 * Now uses improved ranking based on juz, pages, and lines
 */
export const fetchTopHafalan = async (gender?: "Ikhwan" | "Akhwat"): Promise<any[]> => {
  console.log("Fetching top hafalan", gender ? `for ${gender}` : "for all");
  try {
    let query = supabase
      .from('santri')
      .select('id, nama, kelas, jenis_kelamin, total_hafalan');
    
    // Apply gender filter if specified
    if (gender) {
      query = query.eq('jenis_kelamin', gender);
    }
    
    // Get all records to sort by our improved logic
    const { data, error } = await query;

    if (error) {
      console.error("Error fetching top hafalan:", error);
      throw error;
    }

    console.log("Top hafalan data retrieved:", data?.length || 0);
    
    if (!data || data.length === 0) {
      return [];
    }
    
    // Process the data to calculate juz, pages, and lines for each santri
    const enhancedData = data.map(santri => {
      const hafalanScore = getHafalanScore(santri.total_hafalan || 0);
      return {
        ...santri,
        jenis_kelamin: santri.jenis_kelamin as "Ikhwan" | "Akhwat",
        hafalanJuz: hafalanScore.juz,
        hafalanPages: hafalanScore.pages,
        hafalanLines: hafalanScore.lines,
        hafalanScore: hafalanScore.score
      };
    });
    
    // Sort by our custom score for more accurate ranking
    const sortedData = enhancedData
      .sort((a, b) => b.hafalanScore - a.hafalanScore)
      .slice(0, 10);
    
    return sortedData;
  } catch (err) {
    console.error("Exception in fetchTopHafalan:", err);
    return []; // Return empty array instead of throwing
  }
};

/**
 * Fetches top performers based on average scores, optionally filtered by gender
 */
export const fetchTopPerformers = async (gender?: "Ikhwan" | "Akhwat"): Promise<any[]> => {
  console.log("Fetching top performers", gender ? `for ${gender}` : "for all");
  try {
    // First, get all setoran records with santri data
    let setoranQuery = supabase
      .from('setoran')
      .select(`
        santri_id,
        kelancaran,
        tajwid,
        tahsin,
        santri:santri_id (
          id,
          nama,
          kelas,
          jenis_kelamin,
          total_hafalan
        )
      `);

    const { data: setoranData, error: setoranError } = await setoranQuery;
    
    if (setoranError) {
      console.error("Error fetching setoran for top performers:", setoranError);
      return [];
    }

    if (!setoranData || setoranData.length === 0) {
      console.log("No setoran data found for top performers");
      return [];
    }

    // Filter by gender if specified and group by santri
    const scoreMap = new Map();
    
    setoranData.forEach(item => {
      const santri = item.santri;
      
      // Skip if no santri data or doesn't match gender filter
      if (!santri || (gender && santri.jenis_kelamin !== gender)) {
        return;
      }

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
          santri: {
            ...santri,
            jenis_kelamin: santri.jenis_kelamin as "Ikhwan" | "Akhwat"
          },
          totalScore: avgScore,
          count: 1
        });
      }
    });
    
    console.log("Calculated performer scores for", scoreMap.size, "santri");
    
    // Calculate averages and sort
    const result = Array.from(scoreMap.entries())
      .map(([id, data]: [string, any]) => ({
        id,
        nama: data.santri.nama,
        kelas: data.santri.kelas,
        jenis_kelamin: data.santri.jenis_kelamin,
        nilai_rata: data.totalScore / data.count,
        total_hafalan: data.santri.total_hafalan || 0
      }))
      .sort((a, b) => b.nilai_rata - a.nilai_rata)
      .slice(0, 10);

    return result;
  } catch (err) {
    console.error("Exception in fetchTopPerformers:", err);
    return []; // Return empty array instead of throwing
  }
};

/**
 * Fetches top santri by regularity (consistent setoran patterns)
 * This is currently a placeholder using total_hafalan as a metric
 * In the future, it can be enhanced to analyze setoran patterns
 */
export const fetchTopRegularity = async (gender?: "Ikhwan" | "Akhwat"): Promise<any[]> => {
  console.log("Fetching top regularity", gender ? `for ${gender}` : "for all");
  try {
    let query = supabase
      .from('santri')
      .select('id, nama, kelas, jenis_kelamin, total_hafalan');
    
    // Apply gender filter if specified
    if (gender) {
      query = query.eq('jenis_kelamin', gender);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error("Error fetching top regularity:", error);
      return [];
    }
    
    if (!data || data.length === 0) {
      return [];
    }
    
    // Process data for regularity metrics
    // For now, just using total_hafalan as a placeholder
    const processedData = data.map(santri => {
      const hafalanScore = getHafalanScore(santri.total_hafalan || 0);
      return {
        ...santri,
        jenis_kelamin: santri.jenis_kelamin as "Ikhwan" | "Akhwat",
        hafalanJuz: hafalanScore.juz,
        hafalanPages: hafalanScore.pages,
        hafalanLines: hafalanScore.lines,
        hafalanScore: hafalanScore.score
      };
    });
    
    // Sort by total_hafalan for now
    // In the future, implement a more sophisticated regularity algorithm
    const sortedData = processedData
      .sort((a, b) => b.hafalanScore - a.hafalanScore)
      .slice(0, 10);
    
    return sortedData;
  } catch (err) {
    console.error("Exception in fetchTopRegularity:", err);
    return []; // Return empty array instead of throwing
  }
};
