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
import AddSetoranExaminerInput from "@/components/add-setoran/AddSetoranExaminerInput";
import ScoreSelectGroup from "@/components/add-setoran/ScoreSelectGroup";
import { getSurahsInJuz, getSurahMinMaxAyatInJuz } from "@/services/quran/quranMapping";

const AddSetoran = () => {
  const { santriId } = useParams<{ santriId: string }>();
  const [santri, setSantri] = useState<Santri | null>(null);
  const [tanggal, setTanggal] = useState<Date | undefined>(new Date()); // Auto-populate with today's date
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
  const [minAyat, setMinAyat] = useState<number>(1);
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
    setMinAyat(1);
    setMaxAyat(1);
  }, [juz]);

  // Update min/max ayat when surat changes
  useEffect(() => {
    if (surat) {
      const ayatRange = getSurahMinMaxAyatInJuz(juz, surat);
      setMinAyat(ayatRange.minAyat);
      setMaxAyat(ayatRange.maxAyat);
      
      // Reset ayat values to valid range
      setAwalAyat(ayatRange.minAyat);
      setAkhirAyat(ayatRange.minAyat);
    }
  }, [surat, juz]);

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
    if (value <= maxAyat && value >= minAyat) {
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
    <div className="min-h-screen bg-background py-2 px-2 sm:py-6 sm:px-4 flex flex-col justify-center">
      <div className="relative w-full max-w-2xl mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-islamic-primary to-islamic-secondary shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 rounded-2xl sm:rounded-3xl"></div>
        <div className="relative px-3 py-6 sm:px-6 sm:py-10 bg-card shadow-lg rounded-2xl sm:rounded-3xl border border-border">
          <h1 className="text-lg sm:text-2xl font-bold text-foreground text-center mb-4 sm:mb-6">
            Tambah Setoran untuk {santri?.nama || "..."}
          </h1>
          
          <div className="space-y-4 sm:space-y-6">
            <AddSetoranDatePicker tanggal={tanggal} onTanggalChange={handleTanggalChange} />
            
            {/* Juz Selection */}
            <div>
              <Label htmlFor="juz" className="block text-foreground text-sm font-bold mb-2">
                Juz *
              </Label>
              <Select value={juz.toString()} onValueChange={handleJuzChange}>
                <SelectTrigger className="w-full h-10 sm:h-11 text-sm sm:text-base bg-background border-border text-foreground">
                  <SelectValue placeholder="Pilih Juz" />
                </SelectTrigger>
                <SelectContent className="max-h-60 bg-popover border-border">
                  {Array.from({ length: 30 }, (_, i) => i + 1).map((juzNumber) => (
                    <SelectItem key={juzNumber} value={juzNumber.toString()} className="text-popover-foreground hover:bg-accent hover:text-accent-foreground">
                      Juz {juzNumber}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Surat Selection */}
            <div>
              <Label htmlFor="surat" className="block text-foreground text-sm font-bold mb-2">
                Surat *
              </Label>
              <Select value={surat} onValueChange={handleSuratChange} disabled={!juz}>
                <SelectTrigger className="w-full h-10 sm:h-11 text-sm sm:text-base bg-background border-border text-foreground">
                  <SelectValue placeholder="Pilih Surat" />
                </SelectTrigger>
                <SelectContent className="max-h-60 bg-popover border-border">
                  {availableSurahs.map((surahInfo) => (
                    <SelectItem key={surahInfo.name} value={surahInfo.name} className="text-popover-foreground hover:bg-accent hover:text-accent-foreground">
                      {surahInfo.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {juz && availableSurahs.length > 0 && (
                <p className="text-xs text-muted-foreground mt-1">
                  Surat yang tersedia untuk Juz {juz}
                </p>
              )}
            </div>

            {/* Ayat Range with validation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <Label htmlFor="awalAyat" className="block text-foreground text-sm font-bold mb-2">
                  Awal Ayat *
                </Label>
                <Input
                  type="number"
                  id="awalAyat"
                  placeholder="Awal"
                  value={awalAyat}
                  min={minAyat}
                  max={maxAyat}
                  onChange={(e) => handleAwalAyatChange(Number(e.target.value))}
                  disabled={!surat}
                  className="w-full h-10 text-sm sm:text-base bg-background border-border text-foreground"
                />
              </div>
              <div>
                <Label htmlFor="akhirAyat" className="block text-foreground text-sm font-bold mb-2">
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
                  className="w-full h-10 text-sm sm:text-base bg-background border-border text-foreground"
                />
              </div>
            </div>
            {surat && (
              <p className="text-xs text-muted-foreground">
                Range ayat untuk {surat} dalam Juz {juz}: {minAyat} - {maxAyat}
              </p>
            )}

            {/* Score Selection */}
            <div>
              <ScoreSelectGroup
                kelancaran={kelancaran}
                tajwid={tajwid}
                tahsin={tahsin}
                onKelancaranChange={handleKelancaranChange}
                onTajwidChange={handleTajwidChange}
                onTahsinChange={handleTahsinChange}
              />
            </div>

            {/* Notes */}
            <div>
              <Label htmlFor="catatan" className="block text-foreground text-sm font-bold mb-2">
                Catatan
              </Label>
              <Textarea
                id="catatan"
                placeholder="Masukkan catatan"
                value={catatan}
                onChange={(e) => setCatatan(e.target.value)}
                className="w-full min-h-20 text-sm sm:text-base resize-none bg-background border-border text-foreground"
                rows={3}
              />
            </div>

            {/* Examiner Input */}
            <AddSetoranExaminerInput
              diujiOleh={diujiOleh}
              onDiujiOlehChange={setDiujiOleh}
            />

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
              <Button 
                onClick={handleGoBack} 
                variant="outline"
                className="w-full sm:w-auto order-2 sm:order-1 border-border text-foreground hover:bg-accent hover:text-accent-foreground"
              >
                Batal
              </Button>
              <Button 
                onClick={handleAddSetoran} 
                className="w-full sm:w-auto bg-gradient-to-r from-islamic-primary to-islamic-secondary text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline order-1 sm:order-2 hover:opacity-90"
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
