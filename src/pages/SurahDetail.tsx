import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Pause, PlayCircle, BookOpen, MapPin, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { QuranSurah, QuranAyat } from "@/types";

const SurahDetail = () => {
  const { surahNumber } = useParams<{ surahNumber: string }>();
  const [surah, setSurah] = useState<QuranSurah | null>(null);
  const [ayat, setAyat] = useState<QuranAyat[]>([]);
  const [loading, setLoading] = useState(true);
  const [goToAyat, setGoToAyat] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentReciter, setCurrentReciter] = useState<string>("01"); // Default reciter
  
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchSurahDetails = async () => {
      if (!surahNumber) return;
      
      setLoading(true);
      try {
        // Using the equran.id API v2
        const response = await fetch(`https://equran.id/api/v2/surat/${surahNumber}`);
        if (!response.ok) {
          throw new Error("Failed to fetch surah details");
        }
        
        const data = await response.json();
        
        if (data.code === 200 && data.data) {
          // Map the API response to our QuranSurah type
          const surahData: QuranSurah = {
            nomor: data.data.nomor,
            nama: data.data.nama,
            nama_latin: data.data.namaLatin,
            jumlah_ayat: data.data.jumlahAyat,
            tempat_turun: data.data.tempatTurun,
            arti: data.data.arti,
            deskripsi: data.data.deskripsi,
            audio: data.data.audioFull?.[currentReciter] || "",
          };
          
          setSurah(surahData);
          
          // Map the ayat data to our QuranAyat type
          if (data.data.ayat && data.data.ayat.length > 0) {
            const ayatData: QuranAyat[] = data.data.ayat.map((ayat: any) => ({
              id: ayat.nomorAyat,
              surah: data.data.nomor,
              nomor: ayat.nomorAyat,
              ar: ayat.teksArab,
              tr: ayat.teksLatin,
              idn: ayat.teksIndonesia,
            }));
            
            setAyat(ayatData);
          }
        } else {
          throw new Error("Failed to fetch surah details");
        }
      } catch (error) {
        console.error("Error fetching surah details:", error);
        toast({
          title: "Error",
          description: "Gagal memuat detail surat",
          variant: "destructive",
        });
        navigate("/quran");
      } finally {
        setLoading(false);
      }
    };
    
    fetchSurahDetails();
  }, [surahNumber, navigate, toast, currentReciter]);

  const handleGoToAyat = () => {
    const ayatNum = parseInt(goToAyat);
    if (!isNaN(ayatNum) && ayatNum > 0 && surah && ayatNum <= surah.jumlah_ayat) {
      const ayatElement = document.getElementById(`ayat-${ayatNum}`);
      if (ayatElement) {
        ayatElement.scrollIntoView({ behavior: "smooth" });
        ayatElement.classList.add("bg-accent");
        setTimeout(() => {
          ayatElement.classList.remove("bg-accent");
        }, 2000);
      }
    } else {
      toast({
        title: "Nomor ayat tidak valid",
        description: surah ? `Masukkan nomor ayat 1-${surah.jumlah_ayat}` : "Nomor ayat tidak valid",
        variant: "destructive",
      });
    }
  };

  const toggleAudio = () => {
    if (!surah || !surah.audio) {
      toast({
        title: "Audio tidak tersedia",
        description: "Audio untuk surat ini tidak tersedia",
        variant: "destructive",
      });
      return;
    }
    
    const newPlayingState = !isPlaying;
    setIsPlaying(newPlayingState);
    
    // Update global audio state
    if (window.setQuranAudio) {
      window.setQuranAudio(surah.audio, surah.nama_latin, newPlayingState);
    }
  };

  // Cleanup when component unmounts
  useEffect(() => {
    return () => {
      // Stop audio when leaving the page
      if (window.setQuranAudio) {
        window.setQuranAudio(null, '', false);
      }
      setIsPlaying(false);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-islamic-accent/5 flex flex-col items-center justify-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-islamic-primary border-t-transparent shadow-lg mb-4"></div>
        <p className="text-sm text-muted-foreground">Memuat detail surat...</p>
      </div>
    );
  }

  if (!surah) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-islamic-accent/5 flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-destructive/20 to-destructive/10 flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">Surat tidak ditemukan</h2>
          <p className="text-muted-foreground">Maaf, surat yang Anda cari tidak dapat ditemukan.</p>
          <Button variant="outline" onClick={() => navigate("/quran")} className="mt-4">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Kembali ke Daftar Surat
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-islamic-accent/5 p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header with navigation */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate("/quran")} className="hover:bg-islamic-primary/10">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Kembali
          </Button>
          
          {surah.audio && (
            <Button
              variant="outline"
              size="sm"
              onClick={toggleAudio}
              className="flex items-center gap-2 border-islamic-primary text-islamic-primary hover:bg-islamic-primary hover:text-white"
            >
              {isPlaying ? (
                <>
                  <Pause className="h-4 w-4" />
                  Pause Audio
                </>
              ) : (
                <>
                  <PlayCircle className="h-4 w-4" />
                  Play Audio
                </>
              )}
            </Button>
          )}
        </div>
        
        {/* Surah header card */}
        <Card className="bg-gradient-to-br from-card via-card to-islamic-light/20 dark:to-islamic-dark/20 border border-border shadow-xl">
          <div className="p-6 md:p-8">
            <div className="text-center space-y-4">
              {/* Arabic name */}
              <h1 className="font-arabic text-4xl md:text-5xl text-islamic-primary">
                {surah.nama}
              </h1>
              
              {/* Latin name and details */}
              <div className="space-y-2">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                  {surah.nama_latin}
                </h2>
                <p className="text-lg text-muted-foreground italic">
                  "{surah.arti}"
                </p>
              </div>
              
              {/* Badges */}
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <Badge variant="outline" className="bg-islamic-primary text-white border-islamic-primary">
                  Surat ke-{surah.nomor}
                </Badge>
                <Badge variant="outline" className="bg-islamic-secondary/10 text-islamic-secondary border-islamic-secondary/20">
                  <MapPin className="w-3 h-3 mr-1" />
                  {surah.tempat_turun === "mekah" ? "Makkiyah" : "Madaniyyah"}
                </Badge>
                <Badge variant="outline" className="bg-islamic-accent/10 text-islamic-accent border-islamic-accent/20">
                  <BookOpen className="w-3 h-3 mr-1" />
                  {surah.jumlah_ayat} Ayat
                </Badge>
                {surah.audio && (
                  <Badge variant="outline" className="bg-islamic-gold/10 text-islamic-gold border-islamic-gold/20">
                    <Volume2 className="w-3 h-3 mr-1" />
                    Audio tersedia
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </Card>
        
        {/* Navigation to specific ayat */}
        <Card className="bg-card border border-border shadow-lg">
          <div className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <label className="text-sm font-medium text-foreground whitespace-nowrap">
                Menuju ayat:
              </label>
              <div className="flex gap-2 w-full sm:w-auto">
                <Input
                  placeholder={`1-${surah.jumlah_ayat}`}
                  value={goToAyat}
                  onChange={(e) => setGoToAyat(e.target.value)}
                  className="w-32 text-sm border-border focus:border-islamic-primary"
                  type="number"
                  min={1}
                  max={surah.jumlah_ayat}
                />
                <Button 
                  onClick={handleGoToAyat} 
                  size="sm" 
                  className="bg-islamic-primary hover:bg-islamic-primary/90 text-white"
                >
                  Pergi
                </Button>
              </div>
            </div>
          </div>
        </Card>
        
        {/* Ayat list */}
        <div className="space-y-4">
          {ayat.length === 0 ? (
            <Card className="bg-card border border-border shadow-lg">
              <div className="p-8 text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-muted/50 to-muted/30 flex items-center justify-center">
                  <BookOpen className="w-8 h-8 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-foreground">Ayat tidak tersedia</h3>
                  <p className="text-sm text-muted-foreground">
                    Maaf, ayat untuk surat ini sedang tidak tersedia. Silakan kunjungi sumber resmi untuk membaca Al-Quran.
                  </p>
                </div>
              </div>
            </Card>
          ) : (
            ayat.map((ayat) => (
              <Card
                key={ayat.nomor}
                id={`ayat-${ayat.nomor}`}
                className="bg-gradient-to-br from-card via-card to-islamic-light/10 dark:to-islamic-dark/10 border border-border shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="p-6 md:p-8 space-y-6">
                  {/* Ayat number */}
                  <div className="flex justify-center">
                    <Badge variant="outline" className="bg-islamic-primary text-white border-islamic-primary text-sm font-medium">
                      آية {ayat.nomor}
                    </Badge>
                  </div>
                  
                  {/* Arabic text */}
                  <div className="text-center">
                    <p className="font-arabic text-2xl md:text-3xl leading-loose text-foreground">
                      {ayat.ar}
                    </p>
                  </div>
                  
                  {/* Transliteration */}
                  <div className="bg-muted/30 rounded-xl p-4">
                    <p className="text-sm md:text-base italic text-muted-foreground leading-relaxed">
                      {ayat.tr}
                    </p>
                  </div>
                  
                  {/* Indonesian translation */}
                  <div className="bg-islamic-light/20 dark:bg-islamic-dark/20 rounded-xl p-4 border border-islamic-primary/10">
                    <p className="text-sm md:text-base text-foreground leading-relaxed">
                      {ayat.idn}
                    </p>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SurahDetail;
