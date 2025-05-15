
/**
 * Quran mapping data according to Rasm Utsmani mushaf standard
 */

// Juz to surat and ayat mapping (beginning of each juz)
export const juzMapping = [
  { juz: 1, surah: 1, ayah: 1 },    // Al-Fatihah 1
  { juz: 2, surah: 2, ayah: 142 },  // Al-Baqarah 142
  { juz: 3, surah: 2, ayah: 253 },  // Al-Baqarah 253
  { juz: 4, surah: 3, ayah: 93 },   // Ali 'Imran 93
  { juz: 5, surah: 4, ayah: 24 },   // An-Nisa 24
  { juz: 6, surah: 4, ayah: 148 },  // An-Nisa 148
  { juz: 7, surah: 5, ayah: 82 },   // Al-Ma'idah 82
  { juz: 8, surah: 6, ayah: 111 },  // Al-An'am 111
  { juz: 9, surah: 7, ayah: 88 },   // Al-A'raf 88
  { juz: 10, surah: 8, ayah: 41 },  // Al-Anfal 41
  { juz: 11, surah: 9, ayah: 93 },  // At-Tawbah 93
  { juz: 12, surah: 11, ayah: 6 },  // Hud 6
  { juz: 13, surah: 12, ayah: 53 }, // Yusuf 53
  { juz: 14, surah: 15, ayah: 1 },  // Al-Hijr 1
  { juz: 15, surah: 17, ayah: 1 },  // Al-Isra 1
  { juz: 16, surah: 18, ayah: 75 }, // Al-Kahf 75
  { juz: 17, surah: 21, ayah: 1 },  // Al-Anbya 1
  { juz: 18, surah: 23, ayah: 1 },  // Al-Mu'minun 1
  { juz: 19, surah: 25, ayah: 21 }, // Al-Furqan 21
  { juz: 20, surah: 27, ayah: 56 }, // An-Naml 56
  { juz: 21, surah: 29, ayah: 46 }, // Al-'Ankabut 46
  { juz: 22, surah: 33, ayah: 31 }, // Al-Ahzab 31
  { juz: 23, surah: 36, ayah: 28 }, // Ya-Sin 28
  { juz: 24, surah: 39, ayah: 32 }, // Az-Zumar 32
  { juz: 25, surah: 41, ayah: 47 }, // Fussilat 47
  { juz: 26, surah: 46, ayah: 1 },  // Al-Ahqaf 1
  { juz: 27, surah: 51, ayah: 31 }, // Adh-Dhariyat 31
  { juz: 28, surah: 58, ayah: 1 },  // Al-Mujadila 1
  { juz: 29, surah: 67, ayah: 1 },  // Al-Mulk 1
  { juz: 30, surah: 78, ayah: 1 },  // An-Naba 1
];

// Mapping of surah numbers to their total ayat count
export const surahAyatCount = [
  { surah: 1, count: 7 },     // Al-Fatihah
  { surah: 2, count: 286 },   // Al-Baqarah
  { surah: 3, count: 200 },   // Ali 'Imran
  { surah: 4, count: 176 },   // An-Nisa
  { surah: 5, count: 120 },   // Al-Ma'idah
  { surah: 6, count: 165 },   // Al-An'am
  { surah: 7, count: 206 },   // Al-A'raf
  { surah: 8, count: 75 },    // Al-Anfal
  { surah: 9, count: 129 },   // At-Tawbah
  { surah: 10, count: 109 },  // Yunus
  { surah: 11, count: 123 },  // Hud
  { surah: 12, count: 111 },  // Yusuf
  { surah: 13, count: 43 },   // Ar-Ra'd
  { surah: 14, count: 52 },   // Ibrahim
  { surah: 15, count: 99 },   // Al-Hijr
  { surah: 16, count: 128 },  // An-Nahl
  { surah: 17, count: 111 },  // Al-Isra
  { surah: 18, count: 110 },  // Al-Kahf
  { surah: 19, count: 98 },   // Maryam
  { surah: 20, count: 135 },  // Ta-Ha
  { surah: 21, count: 112 },  // Al-Anbya
  { surah: 22, count: 78 },   // Al-Hajj
  { surah: 23, count: 118 },  // Al-Mu'minun
  { surah: 24, count: 64 },   // An-Nur
  { surah: 25, count: 77 },   // Al-Furqan
  { surah: 26, count: 227 },  // Ash-Shu'ara
  { surah: 27, count: 93 },   // An-Naml
  { surah: 28, count: 88 },   // Al-Qasas
  { surah: 29, count: 69 },   // Al-'Ankabut
  { surah: 30, count: 60 },   // Ar-Rum
  { surah: 31, count: 34 },   // Luqman
  { surah: 32, count: 30 },   // As-Sajdah
  { surah: 33, count: 73 },   // Al-Ahzab
  { surah: 34, count: 54 },   // Saba
  { surah: 35, count: 45 },   // Fatir
  { surah: 36, count: 83 },   // Ya-Sin
  { surah: 37, count: 182 },  // As-Saffat
  { surah: 38, count: 88 },   // Sad
  { surah: 39, count: 75 },   // Az-Zumar
  { surah: 40, count: 85 },   // Ghafir
  { surah: 41, count: 54 },   // Fussilat
  { surah: 42, count: 53 },   // Ash-Shuraa
  { surah: 43, count: 89 },   // Az-Zukhruf
  { surah: 44, count: 59 },   // Ad-Dukhan
  { surah: 45, count: 37 },   // Al-Jathiyah
  { surah: 46, count: 35 },   // Al-Ahqaf
  { surah: 47, count: 38 },   // Muhammad
  { surah: 48, count: 29 },   // Al-Fath
  { surah: 49, count: 18 },   // Al-Hujurat
  { surah: 50, count: 45 },   // Qaf
  { surah: 51, count: 60 },   // Adh-Dhariyat
  { surah: 52, count: 49 },   // At-Tur
  { surah: 53, count: 62 },   // An-Najm
  { surah: 54, count: 55 },   // Al-Qamar
  { surah: 55, count: 78 },   // Ar-Rahman
  { surah: 56, count: 96 },   // Al-Waqi'ah
  { surah: 57, count: 29 },   // Al-Hadid
  { surah: 58, count: 22 },   // Al-Mujadilah
  { surah: 59, count: 24 },   // Al-Hashr
  { surah: 60, count: 13 },   // Al-Mumtahanah
  { surah: 61, count: 14 },   // As-Saff
  { surah: 62, count: 11 },   // Al-Jumu'ah
  { surah: 63, count: 11 },   // Al-Munafiqun
  { surah: 64, count: 18 },   // At-Taghabun
  { surah: 65, count: 12 },   // At-Talaq
  { surah: 66, count: 12 },   // At-Tahrim
  { surah: 67, count: 30 },   // Al-Mulk
  { surah: 68, count: 52 },   // Al-Qalam
  { surah: 69, count: 52 },   // Al-Haqqah
  { surah: 70, count: 44 },   // Al-Ma'arij
  { surah: 71, count: 28 },   // Nuh
  { surah: 72, count: 28 },   // Al-Jinn
  { surah: 73, count: 20 },   // Al-Muzzammil
  { surah: 74, count: 56 },   // Al-Muddaththir
  { surah: 75, count: 40 },   // Al-Qiyamah
  { surah: 76, count: 31 },   // Al-Insan
  { surah: 77, count: 50 },   // Al-Mursalat
  { surah: 78, count: 40 },   // An-Naba
  { surah: 79, count: 46 },   // An-Nazi'at
  { surah: 80, count: 42 },   // 'Abasa
  { surah: 81, count: 29 },   // At-Takwir
  { surah: 82, count: 19 },   // Al-Infitar
  { surah: 83, count: 36 },   // Al-Mutaffifin
  { surah: 84, count: 25 },   // Al-Inshiqaq
  { surah: 85, count: 22 },   // Al-Buruj
  { surah: 86, count: 17 },   // At-Tariq
  { surah: 87, count: 19 },   // Al-A'la
  { surah: 88, count: 26 },   // Al-Ghashiyah
  { surah: 89, count: 30 },   // Al-Fajr
  { surah: 90, count: 20 },   // Al-Balad
  { surah: 91, count: 15 },   // Ash-Shams
  { surah: 92, count: 21 },   // Al-Layl
  { surah: 93, count: 11 },   // Ad-Duha
  { surah: 94, count: 8 },    // Ash-Sharh
  { surah: 95, count: 8 },    // At-Tin
  { surah: 96, count: 19 },   // Al-'Alaq
  { surah: 97, count: 5 },    // Al-Qadr
  { surah: 98, count: 8 },    // Al-Bayyinah
  { surah: 99, count: 8 },    // Az-Zalzalah
  { surah: 100, count: 11 },  // Al-'Adiyat
  { surah: 101, count: 11 },  // Al-Qari'ah
  { surah: 102, count: 8 },   // At-Takathur
  { surah: 103, count: 3 },   // Al-'Asr
  { surah: 104, count: 9 },   // Al-Humazah
  { surah: 105, count: 5 },   // Al-Fil
  { surah: 106, count: 4 },   // Quraysh
  { surah: 107, count: 7 },   // Al-Ma'un
  { surah: 108, count: 3 },   // Al-Kawthar
  { surah: 109, count: 6 },   // Al-Kafirun
  { surah: 110, count: 3 },   // An-Nasr
  { surah: 111, count: 5 },   // Al-Masad
  { surah: 112, count: 4 },   // Al-Ikhlas
  { surah: 113, count: 5 },   // Al-Falaq
  { surah: 114, count: 6 },   // An-Nas
];

// Simplified mapping of pages in standard Rasm Utsmani mushaf (604 pages)
// This is an approximation - each page has about 15 lines except first few pages
export const pagesPerJuz = {
  1: 21,   // Juz 1: ~21 pages
  2: 20,   // Juz 2: ~20 pages
  3: 20,   // and so on...
  4: 20,
  5: 20,
  6: 20,
  7: 20,
  8: 20,
  9: 20,
  10: 20,
  11: 20,
  12: 20,
  13: 20,
  14: 20,
  15: 20,
  16: 20,
  17: 20,
  18: 20,
  19: 20,
  20: 20,
  21: 20,
  22: 20,
  23: 20,
  24: 20,
  25: 20,
  26: 20,
  27: 20,
  28: 20,
  29: 20,
  30: 23,  // Juz 30: ~23 pages (slightly more due to shorter surahs)
};

// Standard number of lines per page in Rasm Utsmani
export const LINES_PER_PAGE = 15;

// Total number of ayat in the Quran
export const TOTAL_AYAT_IN_QURAN = 6236;

// Average number of ayat per line (approximate)
export const AVG_AYAT_PER_LINE = 2.5;

// Calculate total pages in the Quran
export const TOTAL_PAGES_IN_QURAN = Object.values(pagesPerJuz).reduce((sum, pages) => sum + pages, 0);

/**
 * Calculate the hafalan progress based on ayat count
 * Returns an object with juz, pages, and lines
 */
export function calculateHafalanProgress(ayatCount: number): { 
  juz: number; 
  remainingPages: number; 
  remainingLines: number;
  totalPages: number;
  formattedProgress: string;
} {
  if (ayatCount <= 0) {
    return { 
      juz: 0, 
      remainingPages: 0, 
      remainingLines: 0,
      totalPages: 0,
      formattedProgress: "0 ayat" 
    };
  }

  // Calculate juz based on average number of ayat per juz
  const avgAyatPerJuz = TOTAL_AYAT_IN_QURAN / 30;
  const completedJuz = Math.floor(ayatCount / avgAyatPerJuz);
  
  // Calculate remaining ayat after counting completed juz
  const remainingAyat = ayatCount - (completedJuz * avgAyatPerJuz);
  
  // Calculate pages from remaining ayat
  const avgAyatPerPage = avgAyatPerJuz / 20; // Approximate 20 pages per juz
  const completedPages = Math.floor(remainingAyat / avgAyatPerPage);
  
  // Calculate lines from remaining ayat after counting completed pages
  const remainingAyatAfterPages = remainingAyat - (completedPages * avgAyatPerPage);
  const completedLines = Math.ceil(remainingAyatAfterPages / AVG_AYAT_PER_LINE);
  
  // Total pages (juz * ~20 pages + completed pages)
  const totalPages = (completedJuz * 20) + completedPages;

  // Format the progress string
  let formattedProgress = "";
  if (completedJuz > 0) {
    formattedProgress = `${completedJuz} juz`;
    
    if (completedPages > 0) {
      formattedProgress += ` ${completedPages} halaman`;
    }
    
    if (completedLines > 0 && completedLines <= LINES_PER_PAGE) {
      formattedProgress += ` ${completedLines} baris`;
    }
  } else if (completedPages > 0) {
    formattedProgress = `${completedPages} halaman`;
    
    if (completedLines > 0 && completedLines <= LINES_PER_PAGE) {
      formattedProgress += ` ${completedLines} baris`;
    }
  } else if (completedLines > 0) {
    formattedProgress = `${completedLines} baris`;
  } else {
    formattedProgress = `${ayatCount} ayat`;
  }
  
  return { 
    juz: completedJuz, 
    remainingPages: completedPages, 
    remainingLines: completedLines <= LINES_PER_PAGE ? completedLines : 0,
    totalPages: totalPages,
    formattedProgress 
  };
}

/**
 * Get the detailed hafalan score for ranking
 * Returns a numeric value that can be used for sorting
 */
export function getHafalanScore(ayatCount: number): {
  score: number;
  juz: number;
  pages: number; 
  lines: number;
} {
  const progress = calculateHafalanProgress(ayatCount);
  
  // Create a sortable score where juz is the most significant, then pages, then lines
  const score = (progress.juz * 1000000) + (progress.remainingPages * 1000) + progress.remainingLines;
  
  return {
    score,
    juz: progress.juz,
    pages: progress.remainingPages,
    lines: progress.remainingLines
  };
}
