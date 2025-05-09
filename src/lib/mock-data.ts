
import { Santri, Setoran } from "@/types";

// Mock Santri data
export const mockSantris: Santri[] = [
  {
    id: "1",
    nama: "Ahmad Zaki",
    kelas: 7,
    jenis_kelamin: "Ikhwan",
    total_hafalan: 3,
  },
  {
    id: "2",
    nama: "Fatima Azzahra",
    kelas: 8,
    jenis_kelamin: "Akhwat",
    total_hafalan: 5,
  },
  {
    id: "3",
    nama: "Muhammad Farhan",
    kelas: 9,
    jenis_kelamin: "Ikhwan",
    total_hafalan: 2,
  },
  {
    id: "4",
    nama: "Nur Aisyah",
    kelas: 10,
    jenis_kelamin: "Akhwat",
    total_hafalan: 7,
  },
  {
    id: "5",
    nama: "Ibrahim Hakam",
    kelas: 11,
    jenis_kelamin: "Ikhwan",
    total_hafalan: 4,
  },
  {
    id: "6",
    nama: "Khadija Nur",
    kelas: 12,
    jenis_kelamin: "Akhwat",
    total_hafalan: 8,
  },
];

// Mock Setoran data
export const mockSetorans: Setoran[] = [
  {
    id: "1",
    santri_id: "1",
    tanggal: "2025-05-01",
    juz: 1,
    surat: "Al-Baqarah",
    awal_ayat: 1,
    akhir_ayat: 10,
    kelancaran: 8,
    tajwid: 7,
    tahsin: 9,
    catatan: "Perlu perbaikan pada mad wajib muttasil",
    diuji_oleh: "Ustadz Ahmad",
  },
  {
    id: "2",
    santri_id: "2",
    tanggal: "2025-05-02",
    juz: 2,
    surat: "Al-Baqarah",
    awal_ayat: 142,
    akhir_ayat: 152,
    kelancaran: 9,
    tajwid: 8,
    tahsin: 8,
    catatan: "Sangat baik, perlu sedikit perbaikan pada makharijul huruf",
    diuji_oleh: "Ustadzah Fatima",
  },
  {
    id: "3",
    santri_id: "1",
    tanggal: "2025-05-05",
    juz: 1,
    surat: "Al-Baqarah",
    awal_ayat: 11,
    akhir_ayat: 20,
    kelancaran: 7,
    tajwid: 8,
    tahsin: 7,
    catatan: "Cukup lancar",
    diuji_oleh: "Ustadz Ahmad",
  },
  {
    id: "4",
    santri_id: "3",
    tanggal: "2025-05-03",
    juz: 30,
    surat: "An-Naba",
    awal_ayat: 1,
    akhir_ayat: 15,
    kelancaran: 6,
    tajwid: 6,
    tahsin: 7,
    catatan: "Perlu lebih banyak latihan",
    diuji_oleh: "Ustadz Ibrahim",
  },
  {
    id: "5",
    santri_id: "4",
    tanggal: "2025-05-04",
    juz: 29,
    surat: "Al-Mulk",
    awal_ayat: 1,
    akhir_ayat: 10,
    kelancaran: 9,
    tajwid: 9,
    tahsin: 8,
    catatan: "Sangat baik",
    diuji_oleh: "Ustadzah Aisyah",
  },
];

export const getAllSantris = (): Promise<Santri[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockSantris);
    }, 300);
  });
};

export const getSantrisByClass = (kelas: number): Promise<Santri[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filteredSantris = mockSantris.filter(santri => santri.kelas === kelas);
      resolve(filteredSantris);
    }, 300);
  });
};

export const getSantriById = (id: string): Promise<Santri | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const santri = mockSantris.find(santri => santri.id === id);
      resolve(santri);
    }, 300);
  });
};

export const addSantri = (santri: Omit<Santri, 'id' | 'total_hafalan'>): Promise<Santri> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newSantri: Santri = {
        ...santri,
        id: `${mockSantris.length + 1}`,
        total_hafalan: 0,
      };
      mockSantris.push(newSantri);
      resolve(newSantri);
    }, 300);
  });
};

export const deleteSantri = (id: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockSantris.findIndex(santri => santri.id === id);
      if (index !== -1) {
        mockSantris.splice(index, 1);
        resolve(true);
      } else {
        resolve(false);
      }
    }, 300);
  });
};

export const getSetoransBySantriId = (santriId: string): Promise<Setoran[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const setoran = mockSetorans.filter(s => s.santri_id === santriId);
      resolve(setoran);
    }, 300);
  });
};

export const addSetoran = (setoran: Omit<Setoran, 'id'>): Promise<Setoran> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newSetoran: Setoran = {
        ...setoran,
        id: `${mockSetorans.length + 1}`,
      };
      mockSetorans.push(newSetoran);
      
      // Update total_hafalan for the santri
      const santri = mockSantris.find(s => s.id === setoran.santri_id);
      if (santri && santri.total_hafalan !== undefined) {
        santri.total_hafalan += 1;
      }
      
      resolve(newSetoran);
    }, 300);
  });
};

export const searchSantris = (query: string): Promise<Santri[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filteredSantris = mockSantris.filter(santri => 
        santri.nama.toLowerCase().includes(query.toLowerCase())
      );
      resolve(filteredSantris);
    }, 300);
  });
};
