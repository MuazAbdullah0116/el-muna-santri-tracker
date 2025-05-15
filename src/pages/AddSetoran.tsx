
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Santri } from "@/types";
import { fetchSantriById, createSetoran, updateTotalHafalan } from "@/services/supabase";
import { getSurahsForJuz, getMaxAyatForSurahInJuz, getMinAyatForSurahInJuz } from "@/services/supabase/client";

const AddSetoran = () => {
  const { santriId } = useParams<{ santriId: string }>();
  const [santri, setSantri] = useState<Santri | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [juz, setJuz] = useState("1");
  const [surah, setSurah] = useState("");
  const [startAyat, setStartAyat] = useState("");
  const [endAyat, setEndAyat] = useState("");
  const [kelancaran, setKelancaran] = useState([7]);
  const [tajwid, setTajwid] = useState([7]);
  const [tahsin, setTahsin] = useState([7]);
  const [notes, setNotes] = useState("");
  const [examiner, setExaminer] = useState("");
  
  // Available surah options based on selected juz
  const [surahOptions, setSurahOptions] = useState<{ value: string; label: string }[]>([]);
  const [minAyat, setMinAyat] = useState<number>(1);
  const [maxAyat, setMaxAyat] = useState<number>(0);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  // Load santri data
  useEffect(() => {
    const fetchSantri = async () => {
      if (!santriId) return;
      
      try {
        const data = await fetchSantriById(santriId);
        if (data) {
          setSantri(data);
        } else {
          toast({
            title: "Error",
            description: "Santri tidak ditemukan",
            variant: "destructive",
          });
          navigate("/dashboard");
        }
      } catch (error) {
        console.error("Error fetching santri:", error);
        toast({
          title: "Error",
          description: "Gagal memuat data santri",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSantri();
  }, [santriId, navigate, toast]);

  // Update surahs when juz changes
  useEffect(() => {
    const availableSurahs = getSurahsForJuz(juz);
    setSurahOptions(availableSurahs);
    
    // Reset surah and ayat values when juz changes
    setSurah("");
    setStartAyat("");
    setEndAyat("");
    setMaxAyat(0);
    setMinAyat(1);
  }, [juz]);

  // Update ayat limits when surah changes
  useEffect(() => {
    if (juz && surah) {
      const min = getMinAyatForSurahInJuz(juz, surah);
      const max = getMaxAyatForSurahInJuz(juz, surah);
      setMinAyat(min);
      setMaxAyat(max);
      setStartAyat(min.toString());
      setEndAyat("");
    }
  }, [juz, surah]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!santriId || !surah || !startAyat || !endAyat || !examiner) {
      toast({
        title: "Data tidak lengkap",
        description: "Mohon lengkapi semua field",
        variant: "destructive",
      });
      return;
    }
    
    // Validate ayat range
    const startAyatNum = parseInt(startAyat);
    const endAyatNum = parseInt(endAyat);
    
    if (startAyatNum < minAyat) {
      toast({
        title: "Error",
        description: `Ayat awal minimal ${minAyat} untuk surat ini di juz ${juz}`,
        variant: "destructive",
      });
      return;
    }
    
    if (endAyatNum > maxAyat) {
      toast({
        title: "Error",
        description: `Ayat akhir maksimal ${maxAyat} untuk surat ini di juz ${juz}`,
        variant: "destructive",
      });
      return;
    }
    
    if (endAyatNum < startAyatNum) {
      toast({
        title: "Error",
        description: "Ayat akhir tidak boleh lebih kecil dari ayat awal",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await createSetoran({
        santri_id: santriId,
        tanggal: format(selectedDate, 'yyyy-MM-dd'),
        juz: parseInt(juz),
        surat: surah,
        awal_ayat: startAyatNum,
        akhir_ayat: endAyatNum,
        kelancaran: kelancaran[0],
        tajwid: tajwid[0],
        tahsin: tahsin[0],
        catatan: notes,
        diuji_oleh: examiner,
      });
      
      // Update total hafalan count for the santri
      await updateTotalHafalan(santriId);
      
      toast({
        title: "Berhasil",
        description: "Data setoran berhasil ditambahkan",
      });
      
      navigate("/dashboard");
    } catch (error) {
      console.error("Error adding setoran:", error);
      toast({
        title: "Error",
        description: "Gagal menambahkan data setoran",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <Card className="islamic-card">
        <CardHeader>
          <CardTitle>Tambah Setoran</CardTitle>
          <CardDescription>
            {santri ? `Tambah setoran untuk ${santri.nama}` : "Tambah data setoran baru"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="date">Tanggal</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                    id="date"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(selectedDate, "dd MMMM yyyy")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="juz">Juz</Label>
                <Select
                  value={juz}
                  onValueChange={setJuz}
                  required
                >
                  <SelectTrigger id="juz">
                    <SelectValue placeholder="Pilih juz" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 30 }, (_, i) => i + 1).map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        Juz {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="surah">Surat</Label>
                <Select
                  value={surah}
                  onValueChange={setSurah}
                  required
                  disabled={!juz}
                >
                  <SelectTrigger id="surah">
                    <SelectValue placeholder="Pilih surat" />
                  </SelectTrigger>
                  <SelectContent>
                    {surahOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startAyat">Awal Ayat</Label>
                <Input
                  id="startAyat"
                  type="number"
                  min={minAyat}
                  max={maxAyat}
                  placeholder="Awal ayat"
                  value={startAyat}
                  onChange={(e) => setStartAyat(e.target.value)}
                  disabled={!surah}
                  required
                />
                {minAyat > 1 && (
                  <p className="text-xs text-muted-foreground">
                    Min: {minAyat}
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="endAyat">Akhir Ayat</Label>
                <Input
                  id="endAyat"
                  type="number"
                  min={minAyat}
                  max={maxAyat}
                  placeholder="Akhir ayat"
                  value={endAyat}
                  onChange={(e) => setEndAyat(e.target.value)}
                  disabled={!startAyat}
                  required
                />
                {maxAyat > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Max: {maxAyat}
                  </p>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="kelancaran">Nilai Kelancaran</Label>
                <span className="text-sm font-medium">{kelancaran[0]}/10</span>
              </div>
              <Slider
                id="kelancaran"
                min={1}
                max={10}
                step={1}
                value={kelancaran}
                onValueChange={setKelancaran}
                className="py-2"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="tajwid">Nilai Tajwid</Label>
                <span className="text-sm font-medium">{tajwid[0]}/10</span>
              </div>
              <Slider
                id="tajwid"
                min={1}
                max={10}
                step={1}
                value={tajwid}
                onValueChange={setTajwid}
                className="py-2"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="tahsin">Nilai Tahsin</Label>
                <span className="text-sm font-medium">{tahsin[0]}/10</span>
              </div>
              <Slider
                id="tahsin"
                min={1}
                max={10}
                step={1}
                value={tahsin}
                onValueChange={setTahsin}
                className="py-2"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Catatan</Label>
              <Textarea
                id="notes"
                placeholder="Tambahkan catatan (opsional)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-[80px]"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="examiner">Diuji Oleh</Label>
              <Input
                id="examiner"
                placeholder="Nama penguji"
                value={examiner}
                onChange={(e) => setExaminer(e.target.value)}
                required
              />
            </div>
            
            <div className="flex gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/dashboard")}
                className="flex-1"
              >
                Batal
              </Button>
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? "Menyimpan..." : "Simpan"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddSetoran;
