
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, BookOpen, Volume2, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { QuranSurah } from "@/types";

const QuranDigital = () => {
  const [surahs, setSurahs] = useState<QuranSurah[]>([]);
  const [filteredSurahs, setFilteredSurahs] = useState<QuranSurah[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSurahs = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://equran.id/api/v2/surat");
        if (!response.ok) {
          throw new Error("Failed to fetch Quran data");
        }

        const data = await response.json();
        if (data.code === 200 && data.data) {
          const surahList: QuranSurah[] = data.data.map((surah: any) => ({
            nomor: surah.nomor,
            nama: surah.nama,
            nama_latin: surah.namaLatin,
            jumlah_ayat: surah.jumlahAyat,
            tempat_turun: surah.tempatTurun,
            arti: surah.arti,
            deskripsi: surah.deskripsi,
            audio: surah.audioFull?.["01"] || "",
          }));
          setSurahs(surahList);
          setFilteredSurahs(surahList);
        } else {
          throw new Error("No data available");
        }
      } catch (error) {
        console.error("Error fetching Quran data:", error);
        toast({
          title: "Error",
          description: "Gagal memuat data Al-Quran",
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
      return;
    }

    const filtered = surahs.filter((surah) => {
      const query = searchQuery.toLowerCase();
      return (
        surah.nama_latin.toLowerCase().includes(query) ||
        surah.arti.toLowerCase().includes(query) ||
        surah.nomor.toString() === query
      );
    });

    setFilteredSurahs(filtered);
  }, [searchQuery, surahs]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-islamic-accent/5 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="text-center space-y-4 py-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-islamic-primary to-islamic-secondary flex items-center justify-center shadow-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-islamic-primary to-islamic-secondary bg-clip-text text-transparent">
              Al-Qur'an Digital
            </h1>
          </div>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
            Jelajahi dan baca Al-Qur'an dengan mudah. Temukan surat yang Anda cari dengan fitur pencarian yang tersedia.
          </p>
        </div>

        {/* Search Section */}
        <div className="bg-card rounded-2xl p-6 shadow-lg border border-border">
          <div className="relative max-w-md mx-auto">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <Search className="h-5 w-5 text-muted-foreground" />
            </div>
            <Input
              type="search"
              placeholder="Cari nama surat, arti, atau nomor..."
              className="pl-12 pr-4 py-3 text-sm md:text-base border-2 border-border rounded-xl focus:border-islamic-primary focus:ring-islamic-primary/20 bg-background text-foreground shadow-sm transition-all duration-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-islamic-primary border-t-transparent shadow-lg"></div>
            <p className="text-sm text-muted-foreground">Memuat data Al-Qur'an...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {filteredSurahs.map((surah) => (
              <Link key={surah.nomor} to={`/quran/${surah.nomor}`} className="group">
                <Card className="h-full transition-all duration-300 hover:scale-[1.02] hover:shadow-xl bg-gradient-to-br from-card via-card to-islamic-light/20 dark:to-islamic-dark/20 border border-border hover:border-islamic-primary/40 overflow-hidden">
                  <div className="p-5 md:p-6 flex flex-col h-full relative">
                    {/* Header with badges */}
                    <div className="flex items-start justify-between mb-4">
                      <Badge variant="outline" className="text-xs font-medium bg-islamic-primary text-white border-islamic-primary">
                        {surah.nomor}
                      </Badge>
                      <Badge variant="outline" className="text-xs bg-islamic-secondary/10 text-islamic-secondary border-islamic-secondary/20">
                        <MapPin className="w-3 h-3 mr-1" />
                        {surah.tempat_turun === "mekah" ? "Makkiyah" : "Madaniyyah"}
                      </Badge>
                    </div>
                    
                    {/* Arabic name */}
                    <div className="text-center mb-4">
                      <p className="font-arabic text-2xl md:text-3xl text-islamic-primary group-hover:text-islamic-secondary transition-colors duration-300">
                        {surah.nama}
                      </p>
                    </div>
                    
                    {/* Latin name and meaning */}
                    <div className="text-center space-y-2 mb-4">
                      <h3 className="font-semibold text-lg md:text-xl text-foreground group-hover:text-islamic-primary transition-colors duration-300">
                        {surah.nama_latin}
                      </h3>
                      <p className="text-sm text-muted-foreground italic">
                        "{surah.arti}"
                      </p>
                    </div>
                    
                    {/* Footer info */}
                    <div className="mt-auto pt-4 border-t border-border/50">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-3 h-3" />
                          {surah.jumlah_ayat} Ayat
                        </span>
                        {surah.audio && (
                          <span className="flex items-center gap-1 text-islamic-primary">
                            <Volume2 className="w-3 h-3" />
                            Audio
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Hover effect overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-islamic-primary/5 to-islamic-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* Empty state */}
        {filteredSurahs.length === 0 && !loading && (
          <div className="text-center py-16 space-y-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-islamic-primary/20 to-islamic-secondary/20 flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-islamic-primary" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl md:text-2xl font-semibold text-foreground">
                Tidak ditemukan
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Maaf, tidak ada surat yang cocok dengan pencarian Anda. Coba dengan kata kunci lain.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => setSearchQuery("")}
              className="mt-6 border-islamic-primary text-islamic-primary hover:bg-islamic-primary hover:text-white"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Tampilkan Semua Surat
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuranDigital;
