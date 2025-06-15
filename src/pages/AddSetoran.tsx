import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Santri } from "@/types";
import { fetchSantriById } from "@/services/googleSheets/santri.service";
import { createSetoran } from "@/services/googleSheets/setoran.service";
import { useToast } from "@/hooks/use-toast";

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
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchSantri = async () => {
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

    fetchSantri();
  }, [santriId, toast]);

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

  const handleAddSetoran = async (setoranData: any) => {
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

      const TARGET_HAFALAN = 30;
      if (
        setoranData &&
        setoranData.total_hafalan &&
        setoranData.total_hafalan >= TARGET_HAFALAN
      ) {
        toast({
          title: "Selamat!",
          description: `Santri telah mencapai target hafalan ${TARGET_HAFALAN} juz!`,
        });
      }
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
            <div className="mb-4">
              <Label htmlFor="tanggal" className="block text-gray-700 text-sm font-bold mb-2">
                Tanggal
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !tanggal && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {tanggal ? tanggal.toLocaleDateString() : <span>Pilih tanggal</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={tanggal}
                    onSelect={handleTanggalChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("2021-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="mb-4">
              <Label htmlFor="juz" className="block text-gray-700 text-sm font-bold mb-2">
                Juz
              </Label>
              <Input
                type="number"
                id="juz"
                placeholder="Masukkan juz"
                value={juz}
                onChange={(e) => setJuz(Number(e.target.value))}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="surat" className="block text-gray-700 text-sm font-bold mb-2">
                Surat
              </Label>
              <Input
                type="text"
                id="surat"
                placeholder="Masukkan nama surat"
                value={surat}
                onChange={(e) => setSurat(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="awalAyat" className="block text-gray-700 text-sm font-bold mb-2">
                  Awal Ayat
                </Label>
                <Input
                  type="number"
                  id="awalAyat"
                  placeholder="Awal"
                  value={awalAyat}
                  onChange={(e) => setAwalAyat(Number(e.target.value))}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div>
                <Label htmlFor="akhirAyat" className="block text-gray-700 text-sm font-bold mb-2">
                  Akhir Ayat
                </Label>
                <Input
                  type="number"
                  id="akhirAyat"
                  placeholder="Akhir"
                  value={akhirAyat}
                  onChange={(e) => setAkhirAyat(Number(e.target.value))}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
            </div>
            <div className="mb-4">
              <Label className="block text-gray-700 text-sm font-bold mb-2">
                Penilaian
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="kelancaran" className="block text-gray-700 text-xs font-bold mb-1">
                    Kelancaran
                  </Label>
                  <Select onValueChange={(value) => handleKelancaranChange(Number(value))}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilih Nilai" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((value) => (
                        <SelectItem key={value} value={String(value)}>
                          {value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="tajwid" className="block text-gray-700 text-xs font-bold mb-1">
                    Tajwid
                  </Label>
                  <Select onValueChange={(value) => handleTajwidChange(Number(value))}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilih Nilai" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((value) => (
                        <SelectItem key={value} value={String(value)}>
                          {value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="tahsin" className="block text-gray-700 text-xs font-bold mb-1">
                    Tahsin
                  </Label>
                  <Select onValueChange={(value) => handleTahsinChange(Number(value))}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilih Nilai" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((value) => (
                        <SelectItem key={value} value={String(value)}>
                          {value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
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
            <div className="mb-6">
              <Label htmlFor="diujiOleh" className="block text-gray-700 text-sm font-bold mb-2">
                Diuji Oleh
              </Label>
              <Input
                type="text"
                id="diujiOleh"
                placeholder="Masukkan nama penguji"
                value={diujiOleh}
                onChange={(e) => setDiujiOleh(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="flex items-center justify-between">
              <Button onClick={handleGoBack} variant="ghost">
                Batal
              </Button>
              <Button onClick={() => handleAddSetoran({ total_hafalan: 30 })} className="bg-gradient-to-r from-islamic-primary to-islamic-secondary text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Simpan
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddSetoran;
