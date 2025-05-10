import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Santri, SantriWithAchievement } from "@/types";
import { mockSantris, mockSetorans } from "@/lib/mock-data";
import { fetchSantriById } from "@/services/supabase/santri.service";
import { fetchSetoranBySantri } from "@/services/supabase/setoran.service";

const Achievements = () => {
  const [filter, setFilter] = useState<"all" | "ikhwan" | "akhwat">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [topHafalan, setTopHafalan] = useState<SantriWithAchievement[]>([]);
  const [topNilai, setTopNilai] = useState<SantriWithAchievement[]>([]);
  const [topTeratur, setTopTeratur] = useState<SantriWithAchievement[]>([]);
  const [filteredHafalan, setFilteredHafalan] = useState<SantriWithAchievement[]>([]);
  const [filteredNilai, setFilteredNilai] = useState<SantriWithAchievement[]>([]);
  const [filteredTeratur, setFilteredTeratur] = useState<SantriWithAchievement[]>([]);
  const [selectedSantri, setSelectedSantri] = useState<Santri | null>(null);
  const [studentSetoran, setStudentSetoran] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Calculate achievements
  useEffect(() => {
    // Group setoran by santri_id
    const setoranBySantri: Record<string, any[]> = {};
    mockSetorans.forEach(setoran => {
      if (!setoranBySantri[setoran.santri_id]) {
        setoranBySantri[setoran.santri_id] = [];
      }
      setoranBySantri[setoran.santri_id].push(setoran);
    });
    
    // Calculate achievements for each santri
    const hafalanList: SantriWithAchievement[] = [];
    const nilaiList: SantriWithAchievement[] = [];
    const teraturList: SantriWithAchievement[] = [];
    
    mockSantris.forEach(santri => {
      const santriSetorans = setoranBySantri[santri.id] || [];
      
      // Total Hafalan (based on total setorans)
      hafalanList.push({
        ...santri,
        achievement: "hafalan",
        value: santriSetorans.length,
      });
      
      // Average Score
      if (santriSetorans.length > 0) {
        const totalScore = santriSetorans.reduce((sum, setoran) => {
          return sum + (setoran.kelancaran + setoran.tajwid + setoran.tahsin) / 3;
        }, 0);
        const avgScore = totalScore / santriSetorans.length;
        
        nilaiList.push({
          ...santri,
          achievement: "nilai",
          value: parseFloat(avgScore.toFixed(1)),
        });
      } else {
        nilaiList.push({
          ...santri,
          achievement: "nilai",
          value: 0,
        });
      }
      
      // Regularity (based on frequency of submissions)
      teraturList.push({
        ...santri,
        achievement: "teratur",
        value: santriSetorans.length,
      });
    });
    
    // Sort achievements
    setTopHafalan(hafalanList.sort((a, b) => b.value - a.value));
    setTopNilai(nilaiList.sort((a, b) => b.value - a.value));
    setTopTeratur(teraturList.sort((a, b) => b.value - a.value));
  }, []);
  
  // Apply filters
  useEffect(() => {
    const filterSantris = (santris: SantriWithAchievement[]) => {
      return santris.filter(santri => {
        // Gender filter
        const genderMatch =
          filter === "all" || 
          (filter === "ikhwan" && santri.jenis_kelamin === "Ikhwan") ||
          (filter === "akhwat" && santri.jenis_kelamin === "Akhwat");
        
        // Search filter
        const searchMatch = 
          !searchQuery ||
          santri.nama.toLowerCase().includes(searchQuery.toLowerCase());
        
        return genderMatch && searchMatch;
      });
    };
    
    setFilteredHafalan(filterSantris(topHafalan));
    setFilteredNilai(filterSantris(topNilai));
    setFilteredTeratur(filterSantris(topTeratur));
  }, [filter, searchQuery, topHafalan, topNilai, topTeratur]);

  const handleSelectSantri = async (santri: SantriWithAchievement) => {
    try {
      // Get complete santri data first 
      const santriDetails = await fetchSantriById(santri.id);
      if (santriDetails) {
        setSelectedSantri(santriDetails);
        
        // Fetch setoran data
        const setoran = await fetchSetoranBySantri(santri.id);
        setStudentSetoran(setoran);
        
        // Open dialog
        setIsDialogOpen(true);
      }
    } catch (error) {
      console.error("Error fetching santri details:", error);
    }
  };

  const renderAchievementCard = (title: string, santris: SantriWithAchievement[], valueLabel: string) => {
    return (
      <Card className="islamic-card">
        <CardHeader className="pb-2">
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          {santris.length === 0 ? (
            <p className="text-center text-muted-foreground">Tidak ada data</p>
          ) : (
            <div className="space-y-3">
              {santris.slice(0, 10).map((santri, index) => (
                <div
                  key={santri.id}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    index < 3 ? "bg-accent/50" : "bg-background/50"
                  } hover:bg-accent/30 cursor-pointer transition-colors`}
                  onClick={() => handleSelectSantri(santri)}
                >
                  <div className="flex items-center">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium mr-3 ${
                      index === 0
                        ? "bg-islamic-gold text-black"
                        : index === 1
                        ? "bg-gray-300 text-gray-800"
                        : index === 2
                        ? "bg-amber-700 text-white"
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{santri.nama}</p>
                      <div className="flex text-xs text-muted-foreground mt-0.5">
                        <span>Kelas {santri.kelas}</span>
                        <span className="mx-1">•</span>
                        <span>{santri.jenis_kelamin}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-semibold text-islamic-primary">
                      {santri.value}
                    </span>
                    <span className="text-xs text-muted-foreground ml-1">
                      {valueLabel}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Prestasi Santri</h1>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari santri..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div>
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
            className="mr-2"
          >
            Semua
          </Button>
          <Button
            variant={filter === "ikhwan" ? "default" : "outline"}
            onClick={() => setFilter("ikhwan")}
            className="mr-2"
          >
            Ikhwan
          </Button>
          <Button
            variant={filter === "akhwat" ? "default" : "outline"}
            onClick={() => setFilter("akhwat")}
          >
            Akhwat
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="hafalan">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="hafalan">Hafalan Terbanyak</TabsTrigger>
          <TabsTrigger value="nilai">Nilai Terbaik</TabsTrigger>
          <TabsTrigger value="teratur">Hafalan Teratur</TabsTrigger>
        </TabsList>
        <TabsContent value="hafalan" className="pt-4">
          {renderAchievementCard(
            "Hafalan Terbanyak",
            filteredHafalan,
            "setoran"
          )}
        </TabsContent>
        <TabsContent value="nilai" className="pt-4">
          {renderAchievementCard(
            "Nilai Terbaik",
            filteredNilai,
            "rerata"
          )}
        </TabsContent>
        <TabsContent value="teratur" className="pt-4">
          {renderAchievementCard(
            "Hafalan Teratur",
            filteredTeratur,
            "setoran"
          )}
        </TabsContent>
      </Tabs>

      {/* Santri Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Detail Santri</DialogTitle>
            <DialogDescription>
              Informasi dan riwayat setoran santri
            </DialogDescription>
          </DialogHeader>
          
          {selectedSantri && (
            <>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-medium">{selectedSantri.nama}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm bg-muted text-muted-foreground rounded-full px-2 py-0.5">
                        Kelas {selectedSantri.kelas}
                      </span>
                      <span className="text-sm bg-muted text-muted-foreground rounded-full px-2 py-0.5">
                        {selectedSantri.jenis_kelamin}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Total Hafalan</h4>
                  <span className="text-xl font-bold text-islamic-primary">
                    {selectedSantri.total_hafalan} Setoran
                  </span>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Riwayat Setoran</h4>
                  {studentSetoran.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Belum ada setoran
                    </p>
                  ) : (
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {studentSetoran.map((setoran) => (
                        <div key={setoran.id} className="border rounded-md p-3 text-sm">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{setoran.surat}</span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(setoran.tanggal).toLocaleDateString("id-ID")}
                            </span>
                          </div>
                          <div className="mt-1 text-xs">
                            Ayat {setoran.awal_ayat} - {setoran.akhir_ayat}
                          </div>
                          <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                            <div>
                              <span className="text-muted-foreground">Kelancaran:</span>{" "}
                              <span className="font-medium">{setoran.kelancaran}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Tajwid:</span>{" "}
                              <span className="font-medium">{setoran.tajwid}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Tahsin:</span>{" "}
                              <span className="font-medium">{setoran.tahsin}</span>
                            </div>
                          </div>
                          {setoran.catatan && (
                            <div className="mt-1 text-xs text-muted-foreground">
                              {setoran.catatan}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Achievements;
