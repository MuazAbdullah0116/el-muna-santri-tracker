
// Re-export supabase from the integrations folder
import { supabase } from "@/integrations/supabase/client";

export { supabase };

// Quran data mapping
// Maps each juz to the surahs it contains and their ayat ranges
export const quranJuzData = {
  1: [
    { surah: "Al-Fatihah", startAyat: 1, endAyat: 7 },
    { surah: "Al-Baqarah", startAyat: 1, endAyat: 141 }
  ],
  2: [{ surah: "Al-Baqarah", startAyat: 142, endAyat: 252 }],
  3: [
    { surah: "Al-Baqarah", startAyat: 253, endAyat: 286 },
    { surah: "Ali 'Imran", startAyat: 1, endAyat: 92 }
  ],
  4: [
    { surah: "Ali 'Imran", startAyat: 93, endAyat: 200 },
    { surah: "An-Nisa", startAyat: 1, endAyat: 23 }
  ],
  5: [{ surah: "An-Nisa", startAyat: 24, endAyat: 147 }],
  6: [
    { surah: "An-Nisa", startAyat: 148, endAyat: 176 },
    { surah: "Al-Ma'idah", startAyat: 1, endAyat: 81 }
  ],
  7: [
    { surah: "Al-Ma'idah", startAyat: 82, endAyat: 120 },
    { surah: "Al-An'am", startAyat: 1, endAyat: 110 }
  ],
  8: [
    { surah: "Al-An'am", startAyat: 111, endAyat: 165 },
    { surah: "Al-A'raf", startAyat: 1, endAyat: 87 }
  ],
  9: [
    { surah: "Al-A'raf", startAyat: 88, endAyat: 206 },
    { surah: "Al-Anfal", startAyat: 1, endAyat: 40 }
  ],
  10: [
    { surah: "Al-Anfal", startAyat: 41, endAyat: 75 },
    { surah: "At-Taubah", startAyat: 1, endAyat: 92 }
  ],
  // Just include the first 10 juz for now as per the available surahs in the mock data
};

// Helper function to get available surahs for a specific juz
export const getSurahsForJuz = (juz: string) => {
  const juzNumber = parseInt(juz);
  const juzData = quranJuzData[juzNumber as keyof typeof quranJuzData] || [];
  return juzData.map(item => ({
    value: item.surah,
    label: `${item.surah}`
  }));
};

// Helper function to get the maximum ayat number for a surah in a specific juz
export const getMaxAyatForSurahInJuz = (juz: string, surah: string) => {
  const juzNumber = parseInt(juz);
  const juzData = quranJuzData[juzNumber as keyof typeof quranJuzData] || [];
  const surahData = juzData.find(item => item.surah === surah);
  return surahData ? surahData.endAyat : 0;
};

// Helper function to get the minimum ayat number for a surah in a specific juz
export const getMinAyatForSurahInJuz = (juz: string, surah: string) => {
  const juzNumber = parseInt(juz);
  const juzData = quranJuzData[juzNumber as keyof typeof quranJuzData] || [];
  const surahData = juzData.find(item => item.surah === surah);
  return surahData ? surahData.startAyat : 1;
};
