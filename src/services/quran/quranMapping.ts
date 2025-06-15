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
  { juz: 7, surah: 5, ayah: 83 },   // Al-Ma'idah 83
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

// Mapping of surah numbers to their names and total ayat count
export const surahData = [
  { number: 1, name: "Al-Fatihah", count: 7 },
  { number: 2, name: "Al-Baqarah", count: 286 },
  { number: 3, name: "Ali 'Imran", count: 200 },
  { number: 4, name: "An-Nisa", count: 176 },
  { number: 5, name: "Al-Ma'idah", count: 120 },
  { number: 6, name: "Al-An'am", count: 165 },
  { number: 7, name: "Al-A'raf", count: 206 },
  { number: 8, name: "Al-Anfal", count: 75 },
  { number: 9, name: "At-Tawbah", count: 129 },
  { number: 10, name: "Yunus", count: 109 },
  { number: 11, name: "Hud", count: 123 },
  { number: 12, name: "Yusuf", count: 111 },
  { number: 13, name: "Ar-Ra'd", count: 43 },
  { number: 14, name: "Ibrahim", count: 52 },
  { number: 15, name: "Al-Hijr", count: 99 },
  { number: 16, name: "An-Nahl", count: 128 },
  { number: 17, name: "Al-Isra", count: 111 },
  { number: 18, name: "Al-Kahf", count: 110 },
  { number: 19, name: "Maryam", count: 98 },
  { number: 20, name: "Ta-Ha", count: 135 },
  { number: 21, name: "Al-Anbya", count: 112 },
  { number: 22, name: "Al-Hajj", count: 78 },
  { number: 23, name: "Al-Mu'minun", count: 118 },
  { number: 24, name: "An-Nur", count: 64 },
  { number: 25, name: "Al-Furqan", count: 77 },
  { number: 26, name: "Ash-Shu'ara", count: 227 },
  { number: 27, name: "An-Naml", count: 93 },
  { number: 28, name: "Al-Qasas", count: 88 },
  { number: 29, name: "Al-'Ankabut", count: 69 },
  { number: 30, name: "Ar-Rum", count: 60 },
  { number: 31, name: "Luqman", count: 34 },
  { number: 32, name: "As-Sajdah", count: 30 },
  { number: 33, name: "Al-Ahzab", count: 73 },
  { number: 34, name: "Saba", count: 54 },
  { number: 35, name: "Fatir", count: 45 },
  { number: 36, name: "Ya-Sin", count: 83 },
  { number: 37, name: "As-Saffat", count: 182 },
  { number: 38, name: "Sad", count: 88 },
  { number: 39, name: "Az-Zumar", count: 75 },
  { number: 40, name: "Ghafir", count: 85 },
  { number: 41, name: "Fussilat", count: 54 },
  { number: 42, name: "Ash-Shuraa", count: 53 },
  { number: 43, name: "Az-Zukhruf", count: 89 },
  { number: 44, name: "Ad-Dukhan", count: 59 },
  { number: 45, name: "Al-Jathiyah", count: 37 },
  { number: 46, name: "Al-Ahqaf", count: 35 },
  { number: 47, name: "Muhammad", count: 38 },
  { number: 48, name: "Al-Fath", count: 29 },
  { number: 49, name: "Al-Hujurat", count: 18 },
  { number: 50, name: "Qaf", count: 45 },
  { number: 51, name: "Adh-Dhariyat", count: 60 },
  { number: 52, name: "At-Tur", count: 49 },
  { number: 53, name: "An-Najm", count: 62 },
  { number: 54, name: "Al-Qamar", count: 55 },
  { number: 55, name: "Ar-Rahman", count: 78 },
  { number: 56, name: "Al-Waqi'ah", count: 96 },
  { number: 57, name: "Al-Hadid", count: 29 },
  { number: 58, name: "Al-Mujadilah", count: 22 },
  { number: 59, name: "Al-Hashr", count: 24 },
  { number: 60, name: "Al-Mumtahanah", count: 13 },
  { number: 61, name: "As-Saff", count: 14 },
  { number: 62, name: "Al-Jumu'ah", count: 11 },
  { number: 63, name: "Al-Munafiqun", count: 11 },
  { number: 64, name: "At-Taghabun", count: 18 },
  { number: 65, name: "At-Talaq", count: 12 },
  { number: 66, name: "At-Tahrim", count: 12 },
  { number: 67, name: "Al-Mulk", count: 30 },
  { number: 68, name: "Al-Qalam", count: 52 },
  { number: 69, name: "Al-Haqqah", count: 52 },
  { number: 70, name: "Al-Ma'arij", count: 44 },
  { number: 71, name: "Nuh", count: 28 },
  { number: 72, name: "Al-Jinn", count: 28 },
  { number: 73, name: "Al-Muzzammil", count: 20 },
  { number: 74, name: "Al-Muddaththir", count: 56 },
  { number: 75, name: "Al-Qiyamah", count: 40 },
  { number: 76, name: "Al-Insan", count: 31 },
  { number: 77, name: "Al-Mursalat", count: 50 },
  { number: 78, name: "An-Naba", count: 40 },
  { number: 79, name: "An-Nazi'at", count: 46 },
  { number: 80, name: "'Abasa", count: 42 },
  { number: 81, name: "At-Takwir", count: 29 },
  { number: 82, name: "Al-Infitar", count: 19 },
  { number: 83, name: "Al-Mutaffifin", count: 36 },
  { number: 84, name: "Al-Inshiqaq", count: 25 },
  { number: 85, name: "Al-Buruj", count: 22 },
  { number: 86, name: "At-Tariq", count: 17 },
  { number: 87, name: "Al-A'la", count: 19 },
  { number: 88, name: "Al-Ghashiyah", count: 26 },
  { number: 89, name: "Al-Fajr", count: 30 },
  { number: 90, name: "Al-Balad", count: 20 },
  { number: 91, name: "Ash-Shams", count: 15 },
  { number: 92, name: "Al-Layl", count: 21 },
  { number: 93, name: "Ad-Duha", count: 11 },
  { number: 94, name: "Ash-Sharh", count: 8 },
  { number: 95, name: "At-Tin", count: 8 },
  { number: 96, name: "Al-'Alaq", count: 19 },
  { number: 97, name: "Al-Qadr", count: 5 },
  { number: 98, name: "Al-Bayyinah", count: 8 },
  { number: 99, name: "Az-Zalzalah", count: 8 },
  { number: 100, name: "Al-'Adiyat", count: 11 },
  { number: 101, name: "Al-Qari'ah", count: 11 },
  { number: 102, name: "At-Takathur", count: 8 },
  { number: 103, name: "Al-'Asr", count: 3 },
  { number: 104, name: "Al-Humazah", count: 9 },
  { number: 105, name: "Al-Fil", count: 5 },
  { number: 106, name: "Quraysh", count: 4 },
  { number: 107, name: "Al-Ma'un", count: 7 },
  { number: 108, name: "Al-Kawthar", count: 3 },
  { number: 109, name: "Al-Kafirun", count: 6 },
  { number: 110, name: "An-Nasr", count: 3 },
  { number: 111, name: "Al-Masad", count: 5 },
  { number: 112, name: "Al-Ikhlas", count: 4 },
  { number: 113, name: "Al-Falaq", count: 5 },
  { number: 114, name: "An-Nas", count: 6 },
];

// Ayat count per juz based on the provided data
export const ayatCountPerJuz = [
  { juz: 1, count: 148 },  // Juz 1: 148 ayat
  { juz: 2, count: 111 },  // Juz 2: 111 ayat
  { juz: 3, count: 126 },  // Juz 3: 126 ayat
  { juz: 4, count: 131 },  // Juz 4: 131 ayat
  { juz: 5, count: 124 },  // Juz 5: 124 ayat
  { juz: 6, count: 110 },  // Juz 6: 110 ayat
  { juz: 7, count: 149 },  // Juz 7: 149 ayat
  { juz: 8, count: 142 },  // Juz 8: 142 ayat
  { juz: 9, count: 159 },  // Juz 9: 159 ayat
  { juz: 10, count: 127 }, // Juz 10: 127 ayat
  { juz: 11, count: 151 }, // Juz 11: 151 ayat
  { juz: 12, count: 170 }, // Juz 12: 170 ayat
  { juz: 13, count: 154 }, // Juz 13: 154 ayat
  { juz: 14, count: 227 }, // Juz 14: 227 ayat
  { juz: 15, count: 185 }, // Juz 15: 185 ayat
  { juz: 16, count: 269 }, // Juz 16: 269 ayat
  { juz: 17, count: 190 }, // Juz 17: 190 ayat
  { juz: 18, count: 202 }, // Juz 18: 202 ayat
  { juz: 19, count: 339 }, // Juz 19: 339 ayat
  { juz: 20, count: 171 }, // Juz 20: 171 ayat
  { juz: 21, count: 178 }, // Juz 21: 178 ayat
  { juz: 22, count: 169 }, // Juz 22: 169 ayat
  { juz: 23, count: 357 }, // Juz 23: 357 ayat
  { juz: 24, count: 175 }, // Juz 24: 175 ayat
  { juz: 25, count: 246 }, // Juz 25: 246 ayat
  { juz: 26, count: 195 }, // Juz 26: 195 ayat
  { juz: 27, count: 399 }, // Juz 27: 399 ayat
  { juz: 28, count: 137 }, // Juz 28: 137 ayat
  { juz: 29, count: 431 }, // Juz 29: 431 ayat
  { juz: 30, count: 564 }, // Juz 30: 564 ayat
];

// Simplified mapping of pages in standard Rasm Utsmani mushaf (604 pages)
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

// Special case for first pages
export const LINES_PER_FIRST_PAGES = 6; // First 2 pages have 6 lines

// Total number of ayat in the Quran (sum of ayatCountPerJuz)
export const TOTAL_AYAT_IN_QURAN = 6236;

// Average number of ayat per line (approximate)
export const AVG_AYAT_PER_LINE = 2.5;

// Calculate total pages in the Quran (604 as per Rasm Utsmani)
export const TOTAL_PAGES_IN_QURAN = Object.values(pagesPerJuz).reduce((sum, pages) => sum + pages, 0);

/**
 * Get surahs that are part of a specific juz
 */
export function getSurahsInJuz(juzNumber: number): Array<{name: string, startAyat: number, endAyat: number}> {
  if (juzNumber < 1 || juzNumber > 30) return [];
  
  const currentJuz = juzMapping.find(j => j.juz === juzNumber);
  const nextJuz = juzMapping.find(j => j.juz === juzNumber + 1);
  
  if (!currentJuz) return [];
  
  const surahs: Array<{name: string, startAyat: number, endAyat: number}> = [];
  
  // Start from current juz's surah
  let currentSurahNumber = currentJuz.surah;
  let currentAyat = currentJuz.ayah;
  
  // Continue until we reach the next juz (or end of Quran for juz 30)
  while (true) {
    const surahInfo = surahData.find(s => s.number === currentSurahNumber);
    if (!surahInfo) break;
    
    let endAyat = surahInfo.count;
    
    // If there's a next juz and it starts in this surah, limit to that ayat
    if (nextJuz && nextJuz.surah === currentSurahNumber) {
      endAyat = nextJuz.ayah - 1;
    }
    
    surahs.push({
      name: surahInfo.name,
      startAyat: currentAyat,
      endAyat: endAyat
    });
    
    // Check if we've reached the next juz
    if (nextJuz && nextJuz.surah === currentSurahNumber) {
      break;
    }
    
    // Move to next surah
    currentSurahNumber++;
    currentAyat = 1;
    
    // Break if we've gone past the last surah or reached the next juz
    if (currentSurahNumber > 114 || (nextJuz && currentSurahNumber > nextJuz.surah)) {
      break;
    }
  }
  
  return surahs;
}

/**
 * Get minimum and maximum ayat for a specific surah within a juz
 * This considers if the surah spans across multiple juz
 */
export function getSurahMinMaxAyatInJuz(juzNumber: number, surahName: string): { 
  minAyat: number; 
  maxAyat: number;
} {
  if (juzNumber < 1 || juzNumber > 30) {
    return { minAyat: 1, maxAyat: 1 };
  }
  
  const currentJuz = juzMapping.find(j => j.juz === juzNumber);
  const nextJuz = juzMapping.find(j => j.juz === juzNumber + 1);
  
  if (!currentJuz) {
    return { minAyat: 1, maxAyat: 1 };
  }
  
  // Find the surah data
  const surahData_found = surahData.find(s => s.name === surahName);
  if (!surahData_found) {
    return { minAyat: 1, maxAyat: 1 };
  }
  
  // Check if this surah is the starting surah of current juz
  const isStartingSurah = surahData_found.number === currentJuz.surah;
  
  // Check if this surah is where the next juz starts
  const isEndingSurah = nextJuz && surahData_found.number === nextJuz.surah;
  
  let minAyat = 1;
  let maxAyat = surahData_found.count;
  
  // If this is the starting surah of the juz, minimum ayat is from juz start
  if (isStartingSurah) {
    minAyat = currentJuz.ayah;
  }
  
  // If this is where next juz starts, maximum ayat is limited by next juz start
  if (isEndingSurah && nextJuz) {
    maxAyat = nextJuz.ayah - 1;
  }
  
  return { minAyat, maxAyat };
}

/**
 * Get maximum ayat number for a specific surah within a juz
 */
export function getMaxAyatInJuz(juzNumber: number, surahName: string): number {
  const surahs = getSurahsInJuz(juzNumber);
  const surahInfo = surahs.find(s => s.name === surahName);
  return surahInfo ? surahInfo.endAyat : 1;
}

/**
 * Calculate the hafalan progress based on ayat count
 * Returns an object with juz, pages, and lines based on accurate Rasm Utsmani calculation
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

  // Calculate juz based on actual ayat count per juz
  let completedJuz = 0;
  let remainingAyat = ayatCount;
  
  // Count complete juz
  for (const juzData of ayatCountPerJuz) {
    if (remainingAyat >= juzData.count) {
      completedJuz++;
      remainingAyat -= juzData.count;
    } else {
      break;
    }
  }
  
  // Calculate pages from remaining ayat
  // More accurate calculation based on mushaf structure
  const avgAyatPerPage = remainingAyat > 0 && completedJuz < 30 
    ? ayatCountPerJuz[completedJuz]?.count / (pagesPerJuz[(completedJuz + 1) as keyof typeof pagesPerJuz] || 20)
    : TOTAL_AYAT_IN_QURAN / TOTAL_PAGES_IN_QURAN;
  
  // Complete pages after juz
  const completedPages = Math.floor(remainingAyat / avgAyatPerPage);
  
  // Calculate lines from remaining ayat after counting completed pages
  const remainingAyatAfterPages = remainingAyat - (completedPages * avgAyatPerPage);
  const completedLines = Math.ceil(remainingAyatAfterPages / AVG_AYAT_PER_LINE);
  
  // Total pages (juz * pages per juz + completed pages)
  let totalPages = completedPages;
  for (let j = 1; j <= completedJuz; j++) {
    totalPages += pagesPerJuz[j as keyof typeof pagesPerJuz] || 20;
  }

  // Format the progress string with more accurate representation
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
 * Get the detailed hafalan score for ranking based on juz, pages, and lines
 * This provides more accurate sorting for achievements
 */
export function getHafalanScore(ayatCount: number): {
  score: number;
  juz: number;
  pages: number; 
  lines: number;
} {
  const progress = calculateHafalanProgress(ayatCount);
  
  // Create a sortable score where juz is the most significant, then pages, then lines
  // Scale: juz * 1,000,000 + pages * 1,000 + lines
  const score = (progress.juz * 1000000) + (progress.remainingPages * 1000) + progress.remainingLines;
  
  return {
    score,
    juz: progress.juz,
    pages: progress.remainingPages,
    lines: progress.remainingLines
  };
}
