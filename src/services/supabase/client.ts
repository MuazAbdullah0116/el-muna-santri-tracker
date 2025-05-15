
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
    { surah: "Al-Ma'idah", startAyat: 1, endAyat: 82 }
  ],
  7: [
    { surah: "Al-Ma'idah", startAyat: 83, endAyat: 120 },
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
  11: [
    { surah: "At-Taubah", startAyat: 93, endAyat: 129 },
    { surah: "Yunus", startAyat: 1, endAyat: 109 },
    { surah: "Hud", startAyat: 1, endAyat: 5 }
  ],
  12: [
    { surah: "Hud", startAyat: 6, endAyat: 123 },
    { surah: "Yusuf", startAyat: 1, endAyat: 52 }
  ],
  13: [
    { surah: "Yusuf", startAyat: 53, endAyat: 111 },
    { surah: "Ar-Ra'd", startAyat: 1, endAyat: 43 },
    { surah: "Ibrahim", startAyat: 1, endAyat: 52 }
  ],
  14: [
    { surah: "Al-Hijr", startAyat: 1, endAyat: 99 },
    { surah: "An-Nahl", startAyat: 1, endAyat: 128 }
  ],
  15: [
    { surah: "Al-Isra", startAyat: 1, endAyat: 111 },
    { surah: "Al-Kahf", startAyat: 1, endAyat: 74 }
  ],
  16: [
    { surah: "Al-Kahf", startAyat: 75, endAyat: 110 },
    { surah: "Maryam", startAyat: 1, endAyat: 98 },
    { surah: "Ta-Ha", startAyat: 1, endAyat: 135 }
  ],
  17: [
    { surah: "Al-Anbya", startAyat: 1, endAyat: 112 },
    { surah: "Al-Hajj", startAyat: 1, endAyat: 78 }
  ],
  18: [
    { surah: "Al-Mu'minun", startAyat: 1, endAyat: 118 },
    { surah: "An-Nur", startAyat: 1, endAyat: 64 },
    { surah: "Al-Furqan", startAyat: 1, endAyat: 20 }
  ],
  19: [
    { surah: "Al-Furqan", startAyat: 21, endAyat: 77 },
    { surah: "Ash-Shu'ara", startAyat: 1, endAyat: 227 },
    { surah: "An-Naml", startAyat: 1, endAyat: 55 }
  ],
  20: [
    { surah: "An-Naml", startAyat: 56, endAyat: 93 },
    { surah: "Al-Qasas", startAyat: 1, endAyat: 88 },
    { surah: "Al-'Ankabut", startAyat: 1, endAyat: 45 }
  ],
  21: [
    { surah: "Al-'Ankabut", startAyat: 46, endAyat: 69 },
    { surah: "Ar-Rum", startAyat: 1, endAyat: 60 },
    { surah: "Luqman", startAyat: 1, endAyat: 34 },
    { surah: "As-Sajdah", startAyat: 1, endAyat: 30 },
    { surah: "Al-Ahzab", startAyat: 1, endAyat: 30 }
  ],
  22: [
    { surah: "Al-Ahzab", startAyat: 31, endAyat: 73 },
    { surah: "Saba", startAyat: 1, endAyat: 54 },
    { surah: "Fatir", startAyat: 1, endAyat: 45 },
    { surah: "Ya-Sin", startAyat: 1, endAyat: 27 }
  ],
  23: [
    { surah: "Ya-Sin", startAyat: 28, endAyat: 83 },
    { surah: "As-Saffat", startAyat: 1, endAyat: 182 },
    { surah: "Sad", startAyat: 1, endAyat: 88 },
    { surah: "Az-Zumar", startAyat: 1, endAyat: 31 }
  ],
  24: [
    { surah: "Az-Zumar", startAyat: 32, endAyat: 75 },
    { surah: "Ghafir", startAyat: 1, endAyat: 85 },
    { surah: "Fussilat", startAyat: 1, endAyat: 46 }
  ],
  25: [
    { surah: "Fussilat", startAyat: 47, endAyat: 54 },
    { surah: "Ash-Shuraa", startAyat: 1, endAyat: 53 },
    { surah: "Az-Zukhruf", startAyat: 1, endAyat: 89 },
    { surah: "Ad-Dukhan", startAyat: 1, endAyat: 59 },
    { surah: "Al-Jathiyah", startAyat: 1, endAyat: 37 }
  ],
  26: [
    { surah: "Al-Ahqaf", startAyat: 1, endAyat: 35 },
    { surah: "Muhammad", startAyat: 1, endAyat: 38 },
    { surah: "Al-Fath", startAyat: 1, endAyat: 29 },
    { surah: "Al-Hujurat", startAyat: 1, endAyat: 18 },
    { surah: "Qaf", startAyat: 1, endAyat: 45 },
    { surah: "Adh-Dhariyat", startAyat: 1, endAyat: 30 }
  ],
  27: [
    { surah: "Adh-Dhariyat", startAyat: 31, endAyat: 60 },
    { surah: "At-Tur", startAyat: 1, endAyat: 49 },
    { surah: "An-Najm", startAyat: 1, endAyat: 62 },
    { surah: "Al-Qamar", startAyat: 1, endAyat: 55 },
    { surah: "Ar-Rahman", startAyat: 1, endAyat: 78 },
    { surah: "Al-Waqi'ah", startAyat: 1, endAyat: 96 },
    { surah: "Al-Hadid", startAyat: 1, endAyat: 29 }
  ],
  28: [
    { surah: "Al-Mujadilah", startAyat: 1, endAyat: 22 },
    { surah: "Al-Hashr", startAyat: 1, endAyat: 24 },
    { surah: "Al-Mumtahanah", startAyat: 1, endAyat: 13 },
    { surah: "As-Saff", startAyat: 1, endAyat: 14 },
    { surah: "Al-Jumu'ah", startAyat: 1, endAyat: 11 },
    { surah: "Al-Munafiqun", startAyat: 1, endAyat: 11 },
    { surah: "At-Taghabun", startAyat: 1, endAyat: 18 },
    { surah: "At-Talaq", startAyat: 1, endAyat: 12 },
    { surah: "At-Tahrim", startAyat: 1, endAyat: 12 }
  ],
  29: [
    { surah: "Al-Mulk", startAyat: 1, endAyat: 30 },
    { surah: "Al-Qalam", startAyat: 1, endAyat: 52 },
    { surah: "Al-Haqqah", startAyat: 1, endAyat: 52 },
    { surah: "Al-Ma'arij", startAyat: 1, endAyat: 44 },
    { surah: "Nuh", startAyat: 1, endAyat: 28 },
    { surah: "Al-Jinn", startAyat: 1, endAyat: 28 },
    { surah: "Al-Muzzammil", startAyat: 1, endAyat: 20 },
    { surah: "Al-Muddaththir", startAyat: 1, endAyat: 56 },
    { surah: "Al-Qiyamah", startAyat: 1, endAyat: 40 },
    { surah: "Al-Insan", startAyat: 1, endAyat: 31 },
    { surah: "Al-Mursalat", startAyat: 1, endAyat: 50 }
  ],
  30: [
    { surah: "An-Naba", startAyat: 1, endAyat: 40 },
    { surah: "An-Nazi'at", startAyat: 1, endAyat: 46 },
    { surah: "'Abasa", startAyat: 1, endAyat: 42 },
    { surah: "At-Takwir", startAyat: 1, endAyat: 29 },
    { surah: "Al-Infitar", startAyat: 1, endAyat: 19 },
    { surah: "Al-Mutaffifin", startAyat: 1, endAyat: 36 },
    { surah: "Al-Inshiqaq", startAyat: 1, endAyat: 25 },
    { surah: "Al-Buruj", startAyat: 1, endAyat: 22 },
    { surah: "At-Tariq", startAyat: 1, endAyat: 17 },
    { surah: "Al-A'la", startAyat: 1, endAyat: 19 },
    { surah: "Al-Ghashiyah", startAyat: 1, endAyat: 26 },
    { surah: "Al-Fajr", startAyat: 1, endAyat: 30 },
    { surah: "Al-Balad", startAyat: 1, endAyat: 20 },
    { surah: "Ash-Shams", startAyat: 1, endAyat: 15 },
    { surah: "Al-Layl", startAyat: 1, endAyat: 21 },
    { surah: "Ad-Duha", startAyat: 1, endAyat: 11 },
    { surah: "Ash-Sharh", startAyat: 1, endAyat: 8 },
    { surah: "At-Tin", startAyat: 1, endAyat: 8 },
    { surah: "Al-'Alaq", startAyat: 1, endAyat: 19 },
    { surah: "Al-Qadr", startAyat: 1, endAyat: 5 },
    { surah: "Al-Bayyinah", startAyat: 1, endAyat: 8 },
    { surah: "Az-Zalzalah", startAyat: 1, endAyat: 8 },
    { surah: "Al-'Adiyat", startAyat: 1, endAyat: 11 },
    { surah: "Al-Qari'ah", startAyat: 1, endAyat: 11 },
    { surah: "At-Takathur", startAyat: 1, endAyat: 8 },
    { surah: "Al-'Asr", startAyat: 1, endAyat: 3 },
    { surah: "Al-Humazah", startAyat: 1, endAyat: 9 },
    { surah: "Al-Fil", startAyat: 1, endAyat: 5 },
    { surah: "Quraysh", startAyat: 1, endAyat: 4 },
    { surah: "Al-Ma'un", startAyat: 1, endAyat: 7 },
    { surah: "Al-Kawthar", startAyat: 1, endAyat: 3 },
    { surah: "Al-Kafirun", startAyat: 1, endAyat: 6 },
    { surah: "An-Nasr", startAyat: 1, endAyat: 3 },
    { surah: "Al-Masad", startAyat: 1, endAyat: 5 },
    { surah: "Al-Ikhlas", startAyat: 1, endAyat: 4 },
    { surah: "Al-Falaq", startAyat: 1, endAyat: 5 },
    { surah: "An-Nas", startAyat: 1, endAyat: 6 }
  ]
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
