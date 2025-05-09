
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { QuranSurah } from "@/types";

const QuranDigital = () => {
  const [surahs, setSurahs] = useState<QuranSurah[]>([]);
  const [filteredSurahs, setFilteredSurahs] = useState<QuranSurah[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchSurahs = async () => {
      try {
        const response = await fetch("https://equran.id/api/v2/surat");
        const data = await response.json();
        
        if (data.code === 200 && data.data) {
          setSurahs(data.data);
          setFilteredSurahs(data.data);
        } else {
          throw new Error("Failed to fetch surahs");
        }
      } catch (error) {
        console.error("Error fetching surahs:", error);
        // Use mock data as fallback
        const mockSurahs: QuranSurah[] = [
          {
            nomor: 1,
            nama: "الفاتحة",
            nama_latin: "Al-Fatihah",
            jumlah_ayat: 7,
            tempat_turun: "mekah",
            arti: "Pembukaan",
            deskripsi: "Surat Al-Fatihah (Pembukaan) yang diturunkan di Mekah dan terdiri dari 7 ayat adalah surat yang pertama-tama diturunkan dengan lengkap diantara surat-surat yang ada dalam Al-Quran dan termasuk golongan surat Makkiyyah.",
            audio: "https://equran.id/audio/1.mp3"
          },
          {
            nomor: 2,
            nama: "البقرة",
            nama_latin: "Al-Baqarah",
            jumlah_ayat: 286,
            tempat_turun: "madinah",
            arti: "Sapi Betina",
            deskripsi: "Surat Al-Baqarah yang 286 ayat itu turun di Madinah yang sebagian besar diturunkan pada permulaan tahun Hijrah, kecuali ayat 281 diturunkan di Mina pada Hajji Wadaa' (hajji Nabi Muhammad s.a.w. yang terakhir).",
            audio: "https://equran.id/audio/2.mp3"
          },
          {
            nomor: 3,
            nama: "آل عمران",
            nama_latin: "Ali 'Imran",
            jumlah_ayat: 200,
            tempat_turun: "madinah",
            arti: "Keluarga Imran",
            deskripsi: "Surat Ali 'Imran yang terdiri dari 200 ayat ini adalah surat Madaniyyah. Dinamakan Ali 'Imran karena memuat kisah keluarga 'Imran yang di dalam kisah itu disebutkan kelahiran Nabi Isa a.s., persamaan kejadiannya dengan Nabi Adam a.s.",
            audio: "https://equran.id/audio/3.mp3"
          },
          {
            nomor: 4,
            nama: "النساء",
            nama_latin: "An-Nisa'",
            jumlah_ayat: 176,
            tempat_turun: "madinah",
            arti: "Wanita",
            deskripsi: "Surat An-Nisaa' yang terdiri dari 176 ayat itu, adalah surat Madaniyyah yang terpanjang sesudah surat Al-Baqarah. Dinamakan An-Nisaa' karena dalam surat ini banyak dibicarakan hal-hal yang berhubungan dengan wanita.",
            audio: "https://equran.id/audio/4.mp3"
          },
          {
            nomor: 5,
            nama: "المائدة",
            nama_latin: "Al-Ma'idah",
            jumlah_ayat: 120,
            tempat_turun: "madinah",
            arti: "Hidangan",
            deskripsi: "Surat Al-Maa'idah terdiri dari 120 ayat, termasuk golongan surat Madaniyyah. Sekalipun ada ayatnya yang turun di Mekah, namun ayat ini diturunkan sesudah Nabi Muhammad s.a.w. hijrah ke Madinah.",
            audio: "https://equran.id/audio/5.mp3"
          },
        ];
        setSurahs(mockSurahs);
        setFilteredSurahs(mockSurahs);
        toast({
          title: "Perhatian",
          description: "Menggunakan data offline karena tidak dapat terhubung ke API",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchSurahs();
  }, [toast]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredSurahs(surahs);
    } else {
      const filtered = surahs.filter((surah) => 
        surah.nama_latin.toLowerCase().includes(searchQuery.toLowerCase()) ||
        surah.arti.toLowerCase().includes(searchQuery.toLowerCase()) ||
        surah.nomor.toString().includes(searchQuery)
      );
      setFilteredSurahs(filtered);
    }
  }, [searchQuery, surahs]);

  const handleSurahClick = (surah: QuranSurah) => {
    navigate(`/quran/${surah.nomor}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Al-Quran Digital</h1>
        <p className="text-muted-foreground mt-1">
          Baca Al-Quran dan terjemahannya
        </p>
      </div>
      
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Cari surat..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {loading ? (
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
          <p className="mt-2 text-muted-foreground">Memuat data...</p>
        </div>
      ) : filteredSurahs.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">Tidak ditemukan surat</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredSurahs.map((surah) => (
            <Button
              key={surah.nomor}
              variant="outline"
              className="h-auto p-0 overflow-hidden islamic-pattern-border hover:scale-[1.02] transition-transform"
              onClick={() => handleSurahClick(surah)}
            >
              <Card className="w-full border-0 shadow-none">
                <CardContent className="p-4 text-left">
                  <div className="flex items-start justify-between">
                    <div className="islamic-bubble w-8 h-8 text-xs flex-shrink-0">
                      {surah.nomor}
                    </div>
                    <div className="flex-1 mx-3">
                      <h3 className="font-medium">{surah.nama_latin}</h3>
                      <p className="text-xs text-muted-foreground">{surah.arti}</p>
                      <div className="flex items-center mt-1">
                        <span className="text-xs bg-muted text-muted-foreground rounded-full px-2 py-0.5">
                          {surah.jumlah_ayat} Ayat
                        </span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-lg font-arabic">{surah.nama}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuranDigital;
