
import { supabase } from "./client";
import { getHafalanScore } from "../quran/quranMapping";
import { fetchAllSetoran } from "./setoran.service";

/**
 * Fetches top santri by hafalan amount, optionally filtered by gender
 * Now includes data from Google Sheets archives
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
    
    const { data, error } = await query;

    if (error) {
      console.error("Error fetching top hafalan:", error);
      throw error;
    }

    console.log("Top hafalan data retrieved:", data?.length || 0);
    
    if (!data || data.length === 0) {
      return [];
    }
    
    // Get all setoran data (including archived) to calculate accurate totals
    const allSetoran = await fetchAllSetoran();
    
    // Calculate actual hafalan for each santri based on all setoran data
    const enhancedData = data.map(santri => {
      const santriSetoran = allSetoran.filter(s => s.santri_id === santri.id);
      const actualHafalan = santriSetoran.reduce((total, setoran) => {
        return total + (setoran.akhir_ayat - setoran.awal_ayat + 1);
      }, 0);
      
      const hafalanScore = getHafalanScore(actualHafalan);
      return {
        ...santri,
        jenis_kelamin: santri.jenis_kelamin as "Ikhwan" | "Akhwat",
        total_hafalan: actualHafalan, // Use calculated value
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
    return [];
  }
};

/**
 * Fetches top performers based on average scores, optionally filtered by gender
 * Now includes data from Google Sheets archives
 */
export const fetchTopPerformers = async (gender?: "Ikhwan" | "Akhwat"): Promise<any[]> => {
  console.log("Fetching top performers", gender ? `for ${gender}` : "for all");
  try {
    // Get all santri data
    const { data: santriData, error: santriError } = await supabase
      .from('santri')
      .select('id, nama, kelas, jenis_kelamin, total_hafalan');
    
    if (santriError) {
      console.error("Error fetching santri for top performers:", santriError);
      return [];
    }

    if (!santriData || santriData.length === 0) {
      return [];
    }

    // Get all setoran data (including archived)
    const allSetoran = await fetchAllSetoran();
    
    if (!allSetoran || allSetoran.length === 0) {
      console.log("No setoran data found for top performers");
      return [];
    }

    // Filter by gender and calculate scores
    const scoreMap = new Map();
    
    santriData.forEach(santri => {
      // Skip if doesn't match gender filter
      if (gender && santri.jenis_kelamin !== gender) {
        return;
      }

      const santriSetoran = allSetoran.filter(s => s.santri_id === santri.id);
      
      if (santriSetoran.length === 0) return;

      const totalScore = santriSetoran.reduce((sum, setoran) => {
        return sum + (setoran.kelancaran + setoran.tajwid + setoran.tahsin) / 3;
      }, 0);

      const actualHafalan = santriSetoran.reduce((total, setoran) => {
        return total + (setoran.akhir_ayat - setoran.awal_ayat + 1);
      }, 0);

      scoreMap.set(santri.id, {
        santri: {
          ...santri,
          jenis_kelamin: santri.jenis_kelamin as "Ikhwan" | "Akhwat",
          total_hafalan: actualHafalan
        },
        totalScore,
        count: santriSetoran.length
      });
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
        total_hafalan: data.santri.total_hafalan
      }))
      .sort((a, b) => b.nilai_rata - a.nilai_rata)
      .slice(0, 10);

    return result;
  } catch (err) {
    console.error("Exception in fetchTopPerformers:", err);
    return [];
  }
};

/**
 * Fetches top santri by regularity (consistent setoran patterns)
 * Now includes data from Google Sheets archives
 */
export const fetchTopRegularity = async (gender?: "Ikhwan" | "Akhwat"): Promise<any[]> => {
  console.log("Fetching top regularity", gender ? `for ${gender}` : "for all");
  try {
    // Get all santri data
    const { data: santriData, error: santriError } = await supabase
      .from('santri')
      .select('id, nama, kelas, jenis_kelamin, total_hafalan');
    
    if (santriError) {
      console.error("Error fetching santri for top regularity:", santriError);
      return [];
    }
    
    if (!santriData || santriData.length === 0) {
      return [];
    }
    
    // Get all setoran data (including archived)
    const allSetoran = await fetchAllSetoran();
    
    // Calculate regularity metrics for each santri
    const processedData = santriData.map(santri => {
      // Skip if doesn't match gender filter
      if (gender && santri.jenis_kelamin !== gender) {
        return null;
      }

      const santriSetoran = allSetoran.filter(s => s.santri_id === santri.id);
      const actualHafalan = santriSetoran.reduce((total, setoran) => {
        return total + (setoran.akhir_ayat - setoran.awal_ayat + 1);
      }, 0);
      
      const hafalanScore = getHafalanScore(actualHafalan);
      return {
        ...santri,
        jenis_kelamin: santri.jenis_kelamin as "Ikhwan" | "Akhwat",
        total_hafalan: actualHafalan,
        hafalanJuz: hafalanScore.juz,
        hafalanPages: hafalanScore.pages,
        hafalanLines: hafalanScore.lines,
        hafalanScore: hafalanScore.score,
        totalSetoran: santriSetoran.length
      };
    }).filter(Boolean);
    
    // Sort by combination of total setoran and hafalan score
    const sortedData = processedData
      .sort((a, b) => {
        // Primary sort: total setoran (regularity)
        const setoranDiff = b.totalSetoran - a.totalSetoran;
        if (setoranDiff !== 0) return setoranDiff;
        
        // Secondary sort: hafalan score
        return b.hafalanScore - a.hafalanScore;
      })
      .slice(0, 10);
    
    return sortedData;
  } catch (err) {
    console.error("Exception in fetchTopRegularity:", err);
    return [];
  }
};
