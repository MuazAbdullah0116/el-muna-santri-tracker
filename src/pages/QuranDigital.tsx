
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, BookOpen } from "lucide-react";
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
    <div className="space-y-6">
      <h1 className="text-xl md:text-2xl font-bold text-center my-4">Al-Qur'an Digital</h1>

      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Cari surat..."
          className="pl-8 text-sm md:text-base"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
          {filteredSurahs.map((surah) => (
            <Link key={surah.nomor} to={`/quran/${surah.nomor}`}>
              <Card className="islamic-card h-full transition-all hover:scale-105 hover:shadow-md hover:border-primary/40">
                <div className="p-3 md:p-4 flex flex-col h-full">
                  <div className="flex items-start justify-between mb-1 md:mb-2">
                    <Badge variant="outline" className="text-xs md:text-sm bg-islamic-primary text-primary-foreground">
                      {surah.nomor}
                    </Badge>
                    <Badge variant="outline" className="text-[10px] md:text-xs">
                      {surah.tempat_turun === "mekah" ? "Makkiyah" : "Madaniyyah"}
                    </Badge>
                  </div>
                  <h3 className="font-medium text-sm md:text-base mb-1">{surah.nama_latin}</h3>
                  <p className="text-muted-foreground text-xs md:text-sm">{surah.arti}</p>
                  <div className="mt-auto pt-2 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{surah.jumlah_ayat} Ayat</span>
                    <span className="font-arabic text-sm md:text-base">{surah.nama}</span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {filteredSurahs.length === 0 && !loading && (
        <div className="text-center py-8">
          <BookOpen className="mx-auto h-12 w-12 text-muted" />
          <h2 className="mt-4 text-xl font-medium">Tidak ditemukan</h2>
          <p className="text-muted-foreground mt-2">
            Coba dengan kata kunci lain
          </p>
          <Button
            className="mt-4"
            variant="outline"
            onClick={() => setSearchQuery("")}
          >
            Tampilkan Semua Surat
          </Button>
        </div>
      )}
    </div>
  );
};

export default QuranDigital;
