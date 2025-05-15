
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Santri, SantriWithAchievement } from "@/types";
import { useToast } from "@/hooks/use-toast";
import SearchBar from "@/components/dashboard/SearchBar";
import { fetchSantri } from "@/services/supabase/santri.service";
import { fetchSetoranBySantri } from "@/services/supabase/setoran.service";
import { fetchTopHafalan, fetchTopPerformers } from "@/services/supabase/achievement.service";
import { getFormattedHafalanProgress } from "@/services/supabase/setoran.service";

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
  const [loading, setLoading] = useState(true);
  
  const { toast } = useToast();
  
  // Load data from database
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Get all santri for basic data
        const santriData = await fetchSantri();
        
        // Top hafalan with new improved calculation
        const hafalanData = await fetchTopHafalan();
        setTopHafalan(hafalanData.map(santri => ({
          ...santri,
          achievement: "hafalan" as "hafalan",
          value: santri.total_hafalan || 0,
          hafalanFormatted: getFormattedHafalanProgress(santri.total_hafalan || 0)
        })));
        
        // Top performers by score
        try {
          const performersData = await fetchTopPerformers();
          setTopNilai(performersData.map(santri => ({
            ...santri,
            achievement: "nilai" as "nilai",
            value: parseFloat(santri.nilai_rata.toFixed(1))
          })));
        } catch (err) {
          console.error("Error loading performers:", err);
          // If performers fail, create placeholder data
          setTopNilai(santriData.map(santri => ({
            ...santri,
            achievement: "nilai" as "nilai",
            value: 0
          })));
        }
        
        // Top teratur (regularity)
        setTopTeratur(santriData.map(santri => ({
          ...santri,
          achievement: "teratur" as "teratur",
          value: santri.total_hafalan || 0,
          hafalanFormatted: getFormattedHafalanProgress(santri.total_hafalan || 0)
        })).sort((a, b) => b.value - a.value));
        
      } catch (error) {
        console.error("Error loading achievement data:", error);
        toast({
          title: "Error",
          description: "Gagal memuat data prestasi",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [toast]);
  
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
    console.log("Selected santri for achievement details:", santri);
    try {
      setSelectedSantri(santri);
      
      // Fetch setoran data
      const setoran = await fetchSetoranBySantri(santri.id);
      console.log("Fetched setoran data:", setoran);
      setStudentSetoran(setoran);
      
      // Open dialog
      setIsDialogOpen(true);
    } catch (error) {
      console.error("Error fetching santri details:", error);
      toast({
        title: "Error",
        description: "Gagal memuat data setoran santri",
        variant: "destructive",
      });
    }
  };

  const renderAchievementCard = (title: string, santris: SantriWithAchievement[], valueLabel: string, isHafalan: boolean = false) => {
    if (loading) {
      return (
        <Card className="islamic-card">
          <CardHeader className="pb-2">
            <CardTitle>{title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-10">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
              <p className="mt-2 text-muted-foreground">Memuat data...</p>
            </div>
          </CardContent>
        </Card>
      );
    }
    
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
                      {isHafalan ? santri.hafalanFormatted : santri.value}
                    </span>
                    {!isHafalan && (
                      <span className="text-xs text-muted-foreground ml-1">
                        {valueLabel}
                      </span>
                    )}
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
          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari santri..."
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
            "",
            true
          )}
        </TabsContent>
        <TabsContent value="nilai" className="pt-4">
          {renderAchievementCard(
            "Nilai Terbaik",
            filteredNilai,
            "rerata",
            false
          )}
        </TabsContent>
        <TabsContent value="teratur" className="pt-4">
          {renderAchievementCard(
            "Hafalan Teratur",
            filteredTeratur,
            "",
            true
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
                    {getFormattedHafalanProgress(selectedSantri.total_hafalan || 0)}
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
