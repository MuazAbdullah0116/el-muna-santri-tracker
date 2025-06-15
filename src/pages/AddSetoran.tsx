
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Santri } from "@/types";
import { fetchSantriById } from "@/services/sheetdb/santri.service";
import { createSetoran } from "@/services/sheetdb/setoran.service";
import { useToast } from "@/hooks/use-toast";
import AddSetoranDatePicker from "@/components/add-setoran/AddSetoranDatePicker";
import AddSetoranAyatRange from "@/components/add-setoran/AddSetoranAyatRange";
import AddSetoranExaminerInput from "@/components/add-setoran/AddSetoranExaminerInput";
import ScoreSelectGroup from "@/components/add-setoran/ScoreSelectGroup";
import { getSurahsInJuz, getMaxAyatInJuz } from "@/services/quran/quranMapping";

const AddSetoran = () => {
  const { santriId } = useParams<{ santriId: string }>();
  const [santri, setSantri] = useState<Santri | null>(null);
  const [tanggal, setTanggal] = useState<Date | undefined>(undefined);
  const [juz, setJuz] = useState<number>(1);
  const [surat, setSurat] = useState<string>("");
  const [awalAyat, setAwalAyat] = useState<number>(1);
  const [akhirAyat, setAkhirAyat] = useState<number>(1);
  const [kelancaran, setKelancaran] = useState<number>(5);
  const [tajwid, setTajwid] = useState<number>(5);
  const [tahsin, setTahsin] = useState<number>(5);
  const [catatan, setCatatan] = useState<string>("");
  const [diujiOleh, setDiujiOleh] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [availableSurahs, setAvailableSurahs] = useState<any[]>([]);
  const [maxAyat, setMaxAyat] = useState<number>(1);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchSantriSupabase = async () => {
      if (santriId) {
        try {
          const santriData = await fetchSantriById(santriId);
          setSantri(santriData);
        } catch (error) {
          console.error("Error fetching santri:", error);
          toast({
            title: "Error",
            description: "Gagal memuat data santri",
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      }
    };

    fetchSantriSupabase();
  }, [santriId, toast]);

  // Update available surahs when juz changes
  useEffect(() => {
    const surahs = getSurahsInJuz(juz);
    setAvailableSurahs(surahs);
    
    // Reset surat selection when juz changes
    setSurat("");
    setAwalAyat(1);
    setAkhirAyat(1);
    setMaxAyat(1);
  }, [juz]);

  // Update max ayat when surat changes
  useEffect(() => {
    if (surat) {
      const maxAyatInJuz = getMaxAyatInJuz(juz, surat);
      setMaxAyat(maxAyatInJuz);
      
      // Reset ayat values if they exceed the new maximum
      if (awalAyat > maxAyatInJuz) {
        setAwalAyat(1);
      }
      if (akhirAyat > maxAyatInJuz) {
        setAkhirAyat(maxAyatInJuz);
      }
    }
  }, [surat, juz, awalAyat, akhirAyat]);

  const handleGoBack = () => {
    navigate("/dashboard");
  };

  const handleTanggalChange = (date: Date | undefined) => {
    setTanggal(date);
  };

  const handleKelancaranChange = (value: number) => {
    setKelancaran(value);
  };

  const handleTajwidChange = (value: number) => {
    setTajwid(value);
  };

  const handleTahsinChange = (value: number) => {
    setTahsin(value);
  };

  const handleJuzChange = (value: string) => {
    setJuz(Number(value));
  };

  const handleSuratChange = (value: string) => {
    setSurat(value);
  };

  const handleAwalAyatChange = (value: number) => {
    if (value <= maxAyat && value >= 1) {
      setAwalAyat(value);
      // Ensure akhir ayat is not less than awal ayat
      if (akhirAyat < value) {
        setAkhirAyat(value);
      }
    }
  };

  const handleAkhirAyatChange = (value: number) => {
    if (value <= maxAyat && value >= awalAyat) {
      setAkhirAyat(value);
    }
  };

  const handleAddSetoran = async () => {
    if (!tanggal || !surat || !diujiOleh.trim()) {
      toast({
        title: "Error",
        description: "Mohon lengkapi semua field yang wajib diisi",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const tanggalFormatted = tanggal ? tanggal.toISOString().split('T')[0] : '';
      const setoran = {
        santri_id: santriId,
        tanggal: tanggalFormatted,
        juz: juz,
        surat: surat,
        awal_ayat: awalAyat,
        akhir_ayat: akhirAyat,
        kelancaran: kelancaran,
        tajwid: tajwid,
        tahsin: tahsin,
        catatan: catatan,
        diuji_oleh: diujiOleh,
      };

      await createSetoran(setoran);
      toast({
        title: "Setoran berhasil disimpan",
        description: "Data setoran baru telah ditambahkan.",
      });

      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Gagal",
        description: "Gagal menyimpan data setoran.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (!santri) {
    return <div className="text-center">Santri tidak ditemukan.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-islamic-primary to-islamic-secondary shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <h1 className="text-2xl font-bold text-gray-900 text-center">
            Tambah Setoran untuk {santri.nama}
          </h1>
          <div className="mt-6">
            <AddSetoranDatePicker tanggal={tanggal} onTanggalChange={handleTanggalChange} />
            
            {/* Juz Selection */}
            <div className="mb-4">
              <Label htmlFor="juz" className="block text-gray-700 text-sm font-bold mb-2">
                Juz *
              </Label>
              <Select value={juz.toString()} onValueChange={handleJuzChange}>
                <SelectTrigger className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                  <SelectValue placeholder="Pilih Juz" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 30 }, (_, i) => i + 1).map((juzNumber) => (
                    <SelectItem key={juzNumber} value={juzNumber.toString()}>
                      Juz {juzNumber}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Surat Selection */}
            <div className="mb-4">
              <Label htmlFor="surat" className="block text-gray-700 text-sm font-bold mb-2">
                Surat *
              </Label>
              <Select value={surat} onValueChange={handleSuratChange} disabled={!juz}>
                <SelectTrigger className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                  <SelectValue placeholder="Pilih Surat" />
                </SelectTrigger>
                <SelectContent>
                  {availableSurahs.map((surahInfo) => (
                    <SelectItem key={surahInfo.name} value={surahInfo.name}>
                      {surahInfo.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {juz && availableSurahs.length > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  Surat yang tersedia untuk Juz {juz}
                </p>
              )}
            </div>

            {/* Ayat Range with validation */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="awalAyat" className="block text-gray-700 text-sm font-bold mb-2">
                  Awal Ayat *
                </Label>
                <Input
                  type="number"
                  id="awalAyat"
                  placeholder="Awal"
                  value={awalAyat}
                  min={1}
                  max={maxAyat}
                  onChange={(e) => handleAwalAyatChange(Number(e.target.value))}
                  disabled={!surat}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div>
                <Label htmlFor="akhirAyat" className="block text-gray-700 text-sm font-bold mb-2">
                  Akhir Ayat *
                </Label>
                <Input
                  type="number"
                  id="akhirAyat"
                  placeholder="Akhir"
                  value={akhirAyat}
                  min={awalAyat}
                  max={maxAyat}
                  onChange={(e) => handleAkhirAyatChange(Number(e.target.value))}
                  disabled={!surat}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
            </div>
            {surat && (
              <p className="text-xs text-gray-500 mb-4">
                Maksimal ayat untuk {surat} dalam Juz {juz}: {maxAyat}
              </p>
            )}

            <div className="mb-4">
              <ScoreSelectGroup
                kelancaran={kelancaran}
                tajwid={tajwid}
                tahsin={tahsin}
                onKelancaranChange={handleKelancaranChange}
                onTajwidChange={handleTajwidChange}
                onTahsinChange={handleTahsinChange}
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="catatan" className="block text-gray-700 text-sm font-bold mb-2">
                Catatan
              </Label>
              <Textarea
                id="catatan"
                placeholder="Masukkan catatan"
                value={catatan}
                onChange={(e) => setCatatan(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <AddSetoranExaminerInput
              diujiOleh={diujiOleh}
              onDiujiOlehChange={setDiujiOleh}
            />
            <div className="flex items-center justify-between">
              <Button onClick={handleGoBack} variant="ghost">
                Batal
              </Button>
              <Button 
                onClick={handleAddSetoran} 
                className="bg-gradient-to-r from-islamic-primary to-islamic-secondary text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                disabled={loading || !tanggal || !surat || !diujiOleh.trim()}
              >
                {loading ? "Menyimpan..." : "Simpan"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddSetoran;
