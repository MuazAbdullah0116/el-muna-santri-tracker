import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, PlayCircle, Pause, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { QuranSurah, QuranAyat } from "@/types";
import QuranAudioPlayer from "@/components/QuranAudioPlayer";

const SurahDetail = () => {
  const { surahNumber } = useParams<{ surahNumber: string }>();
  const [surah, setSurah] = useState<QuranSurah | null>(null);
  const [ayat, setAyat] = useState<QuranAyat[]>([]);
  const [loading, setLoading] = useState(true);
  const [goToAyat, setGoToAyat] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
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
          
          // Initialize audio if available
          if (surahData.audio) {
            const audioElement = new Audio(surahData.audio);
            setAudio(audioElement);
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
    
    // Cleanup audio on unmount
    return () => {
      if (audio) {
        audio.pause();
        setAudio(null);
      }
    };
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
    if (!audio) return;
    
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleCloseAudio = () => {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    setIsPlaying(false);
  };

  useEffect(() => {
    if (audio) {
      audio.addEventListener("ended", () => setIsPlaying(false));
      return () => {
        audio.removeEventListener("ended", () => setIsPlaying(false));
      };
    }
  }, [audio]);

  // Update global audio state when local audio state changes
  useEffect(() => {
    if (surah && surah.audio) {
      // Use the global audio state setter if available
      if (window.setQuranAudio) {
        window.setQuranAudio(surah.audio, surah.nama_latin, isPlaying);
      }
    }
    
    return () => {
      // Clean up global audio state on unmount
      if (window.setQuranAudio) {
        window.setQuranAudio(null, '', false);
      }
    };
  }, [surah, isPlaying]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!surah) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">Surat tidak ditemukan</p>
        <Button variant="link" onClick={() => navigate("/quran")}>
          Kembali ke Daftar Surat
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <Button variant="ghost" size="sm" onClick={() => navigate("/quran")}>
          <ChevronLeft className="h-4 w-4 mr-1" /> Kembali
        </Button>
      </div>
      
      <Card className="p-4 md:p-6 islamic-card">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold flex flex-wrap items-center gap-2">
              {surah.nama_latin}
              <Badge variant="outline" className="ml-1 text-xs">
                {surah.tempat_turun === "mekah" ? "Makkiyah" : "Madaniyyah"}
              </Badge>
            </h1>
            <p className="text-sm text-muted-foreground">{surah.arti}</p>
            <p className="mt-1 text-xs md:text-sm">{surah.jumlah_ayat} Ayat</p>
          </div>
          <div className="text-right mt-2 md:mt-0">
            <p className="text-xl md:text-2xl font-arabic">{surah.nama}</p>
            {audio && (
              <Button
                variant="outline"
                size="sm"
                className="mt-2 text-xs"
                onClick={toggleAudio}
              >
                {isPlaying ? (
                  <>
                    <Pause className="h-3 w-3 mr-1" /> Pause
                  </>
                ) : (
                  <>
                    <PlayCircle className="h-3 w-3 mr-1" /> Play
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </Card>
      
      <div className="flex flex-col xs:flex-row gap-2">
        <div className="flex gap-2">
          <Input
            placeholder="Menuju ayat..."
            value={goToAyat}
            onChange={(e) => setGoToAyat(e.target.value)}
            className="w-24 md:w-32 text-sm"
            type="number"
            min={1}
            max={surah.jumlah_ayat}
          />
          <Button onClick={handleGoToAyat} size="sm" className="text-xs md:text-sm">
            Pergi
          </Button>
        </div>
      </div>
      
      <div className="space-y-4">
        {ayat.length === 0 ? (
          <Card className="p-4 md:p-6 text-center">
            <p className="text-sm">Ayat tidak tersedia. Silakan kunjungi sumber resmi untuk membaca Al-Quran.</p>
          </Card>
        ) : (
          ayat.map((ayat) => (
            <Card
              key={ayat.nomor}
              id={`ayat-${ayat.nomor}`}
              className="p-3 md:p-4 islamic-card transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" className="bg-islamic-primary text-primary-foreground text-xs">
                  {ayat.nomor}
                </Badge>
              </div>
              
              <p className="text-right text-lg md:text-xl leading-loose font-arabic mb-3 md:mb-4">
                {ayat.ar}
              </p>
              
              <p className="text-xs md:text-sm italic text-muted-foreground mb-2">
                {ayat.tr}
              </p>
              
              <p className="text-xs md:text-sm">
                {ayat.idn}
              </p>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default SurahDetail;
