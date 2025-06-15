export interface Santri {
  id: string;
  nama: string;
  kelas: number;
  jenis_kelamin: "Ikhwan" | "Akhwat";
  created_at?: string;
  total_hafalan?: number;
  rankingDiff?: number;
}

export interface Setoran {
  id: string;
  santri_id: string;
  tanggal: string;
  juz: number;
  surat: string;
  awal_ayat: number;
  akhir_ayat: number;
  kelancaran: number;
  tajwid: number;
  tahsin: number;
  catatan: string;
  diuji_oleh: string;
  created_at?: string;
}

export interface QuranSurah {
  nomor: number;
  nama: string;
  nama_latin: string;
  jumlah_ayat: number;
  tempat_turun: string;
  arti: string;
  deskripsi: string;
  audio: string;
}

export interface QuranAyat {
  id: number;
  surah: number;
  nomor: number;
  ar: string;
  tr: string;
  idn: string;
}

export interface SetoranWithSantri extends Setoran {
  santri: Santri;
}

export interface SantriWithAchievement extends Santri {
  achievement: "hafalan" | "nilai" | "teratur";
  value: number;
  hafalanFormatted?: string;
  hafalanJuz?: number;
  hafalanPages?: number;
  hafalanLines?: number;
  hafalanScore?: number;
  nilai_rata?: number;
  rankingDiff?: number;
}
