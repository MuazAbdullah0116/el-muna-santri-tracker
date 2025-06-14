import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Santri, SantriWithAchievement } from "@/types";
import { useToast } from "@/hooks/use-toast";
import SearchBar from "@/components/dashboard/SearchBar";
import { fetchSantri } from "@/services/supabase/santri.service";
import { fetchSetoranBySantri } from "@/services/supabase/setoran.service";
import { 
  fetchTopHafalan, 
  fetchTopPerformers,
  fetchTopRegularity 
} from "@/services/supabase/achievement.service";
import { getFormattedHafalanProgress } from "@/services/supabase/setoran.service";
import { Crown, Trophy, Star, User, BookOpen } from "lucide-react";

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
  
  // Load data based on current gender filter
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Determine the gender filter for API calls
        const genderFilter = filter === "all" 
          ? undefined 
          : filter === "ikhwan" 
            ? "Ikhwan" 
            : "Akhwat";
        
        // Top hafalan with improved calculation
        const hafalanData = await fetchTopHafalan(genderFilter);
        setTopHafalan(hafalanData.map(santri => ({
          ...santri,
          achievement: "hafalan" as "hafalan",
          value: santri.total_hafalan || 0,
          hafalanFormatted: getFormattedHafalanProgress(santri.total_hafalan || 0)
        })));
        
        // Top performers by score
        try {
          const performersData = await fetchTopPerformers(genderFilter);
          setTopNilai(performersData.map(santri => ({
            ...santri,
            achievement: "nilai" as "nilai",
            value: parseFloat(santri.nilai_rata.toFixed(1))
          })));
        } catch (err) {
          console.error("Error loading performers:", err);
          toast({
            title: "Error",
            description: "Gagal memuat data prestasi nilai",
            variant: "destructive",
          });
          setTopNilai([]);
        }
        
        // Top teratur (regularity) - now using dedicated service
        try {
          const regularityData = await fetchTopRegularity(genderFilter);
          setTopTeratur(regularityData.map(santri => ({
            ...santri,
            achievement: "teratur" as "teratur",
            value: santri.total_hafalan || 0,
            hafalanFormatted: getFormattedHafalanProgress(santri.total_hafalan || 0)
          })));
        } catch (err) {
          console.error("Error loading regularity data:", err);
          toast({
            title: "Error",
            description: "Gagal memuat data hafalan teratur",
            variant: "destructive",
          });
          setTopTeratur([]);
        }
        
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
  }, [toast, filter]); // Re-fetch when filter changes
  
  // Apply search filter
  useEffect(() => {
    const filterBySearch = (santris: SantriWithAchievement[]) => {
      return santris.filter(santri => {
        // Search filter
        return !searchQuery ||
          santri.nama.toLowerCase().includes(searchQuery.toLowerCase());
      });
    };
    
    setFilteredHafalan(filterBySearch(topHafalan));
    setFilteredNilai(filterBySearch(topNilai));
    setFilteredTeratur(filterBySearch(topTeratur));
  }, [searchQuery, topHafalan, topNilai, topTeratur]);

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

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Crown className="w-4 h-4 text-yellow-500" />;
      case 1:
        return <Trophy className="w-4 h-4 text-gray-400" />;
      case 2:
        return <Star className="w-4 h-4 text-amber-600" />;
      default:
        return <span className="w-4 h-4 flex items-center justify-center text-xs font-medium text-muted-foreground">{index + 1}</span>;
    }
  };

  const renderAchievementCard = (title: string, santris: SantriWithAchievement[], valueLabel: string, isHafalan: boolean = false) => {
    if (loading) {
      return (
        <Card className="bg-gradient-to-br from-card via-card to-islamic-light/20 dark:to-islamic-dark/20 border border-islamic-primary/20 shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-foreground">{title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-10">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-islamic-primary border-t-transparent shadow-lg"></div>
              <p className="mt-2 text-muted-foreground">Memuat data...</p>
            </div>
          </CardContent>
        </Card>
      );
    }
    
    return (
      <Card className="bg-gradient-to-br from-card via-card to-islamic-light/20 dark:to-islamic-dark/20 border border-islamic-primary/20 shadow-xl">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-foreground">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-islamic-primary to-islamic-secondary flex items-center justify-center shadow-lg">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {santris.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-islamic-primary/10 to-islamic-secondary/10 flex items-center justify-center">
                <User className="w-8 h-8 text-islamic-primary/60" />
              </div>
              <p className="text-muted-foreground font-medium">Tidak ada data</p>
            </div>
          ) : (
            <div className="space-y-4">
              {santris.map((santri, index) => (
                <div
                  key={santri.id}
                  className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 cursor-pointer hover:shadow-lg hover:scale-[1.02] ${
                    index < 3 
                      ? "bg-gradient-to-r from-islamic-accent/10 via-card to-islamic-gold/10 border-islamic-gold/30 hover:border-islamic-gold/50" 
                      : "bg-gradient-to-r from-card via-card to-islamic-light/10 dark:to-islamic-dark/10 border-border hover:border-islamic-primary/30"
                  }`}
                  onClick={() => handleSelectSantri(santri)}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-islamic-primary/5 to-islamic-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="relative p-4">
                    <div className="flex items-center gap-4">
                      {/* Rank & Avatar */}
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shadow-md ${
                          index === 0
                            ? "bg-gradient-to-br from-yellow-400 to-yellow-600"
                            : index === 1
                            ? "bg-gradient-to-br from-gray-300 to-gray-500"
                            : index === 2
                            ? "bg-gradient-to-br from-amber-600 to-amber-800"
                            : "bg-gradient-to-br from-muted to-muted-foreground/20"
                        }`}>
                          {getRankIcon(index)}
                        </div>
                        
                        <Avatar className="w-12 h-12 shadow-lg border-2 border-background">
                          <AvatarFallback className="bg-gradient-to-br from-islamic-primary to-islamic-secondary text-white font-semibold text-sm">
                            {getInitials(santri.nama)}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      
                      {/* Student Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-lg text-foreground truncate group-hover:text-islamic-primary transition-colors">
                          {santri.nama}
                        </h4>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <Badge variant="secondary" className="bg-islamic-primary/10 text-islamic-primary border-islamic-primary/20 text-xs">
                            Kelas {santri.kelas}
                          </Badge>
                          <Badge variant="outline" className="bg-islamic-secondary/10 text-islamic-secondary border-islamic-secondary/20 text-xs">
                            {santri.jenis_kelamin}
                          </Badge>
                        </div>
                      </div>
                      
                      {/* Achievement Value */}
                      <div className="flex flex-col items-end justify-center bg-gradient-to-br from-background/80 to-islamic-accent/10 rounded-xl p-4 min-w-[100px] border border-islamic-primary/20 shadow-md">
                        <div className="text-2xl font-bold bg-gradient-to-r from-islamic-primary to-islamic-secondary bg-clip-text text-transparent">
                          {isHafalan ? santri.hafalanFormatted : santri.value}
                        </div>
                        {!isHafalan && (
                          <div className="text-xs text-muted-foreground font-medium mt-1">
                            {valueLabel}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-islamic-primary via-islamic-secondary to-islamic-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-islamic-accent/10">
      <div className="space-y-8 p-6">
        {/* Header Section */}
        <div className="bg-card rounded-3xl p-8 shadow-xl border border-border">
          <div className="flex items-center gap-6 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-islamic-primary to-islamic-secondary flex items-center justify-center shadow-xl">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Prestasi Santri</h1>
              <p className="text-muted-foreground text-lg">Pencapaian terbaik dalam hafalan Al-Qur'an</p>
            </div>
          </div>
          
          {/* Filter Section */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <SearchBar
                searchQuery={searchQuery}
                onSearchChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari santri..."
              />
            </div>
            
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={filter === "all" ? "default" : "outline"}
                onClick={() => setFilter("all")}
                className={filter === "all" ? "bg-gradient-to-r from-islamic-primary to-islamic-secondary" : ""}
              >
                Semua
              </Button>
              <Button
                variant={filter === "ikhwan" ? "default" : "outline"}
                onClick={() => setFilter("ikhwan")}
                className={filter === "ikhwan" ? "bg-gradient-to-r from-islamic-primary to-islamic-secondary" : ""}
              >
                Ikhwan
              </Button>
              <Button
                variant={filter === "akhwat" ? "default" : "outline"}
                onClick={() => setFilter("akhwat")}
                className={filter === "akhwat" ? "bg-gradient-to-r from-islamic-primary to-islamic-secondary" : ""}
              >
                Akhwat
              </Button>
            </div>
          </div>
        </div>
        
        {/* Tabs Section */}
        <div className="bg-card rounded-3xl p-8 shadow-xl border border-border">
          <Tabs defaultValue="hafalan" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8 bg-muted/50 rounded-xl p-1">
              <TabsTrigger value="hafalan" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-islamic-primary data-[state=active]:to-islamic-secondary data-[state=active]:text-white">
                Hafalan Terbanyak
              </TabsTrigger>
              <TabsTrigger value="nilai" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-islamic-primary data-[state=active]:to-islamic-secondary data-[state=active]:text-white">
                Nilai Terbaik
              </TabsTrigger>
              <TabsTrigger value="teratur" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-islamic-primary data-[state=active]:to-islamic-secondary data-[state=active]:text-white">
                Hafalan Teratur
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="hafalan" className="mt-0">
              {renderAchievementCard(
                "Hafalan Terbanyak",
                filteredHafalan,
                "",
                true
              )}
            </TabsContent>
            <TabsContent value="nilai" className="mt-0">
              {renderAchievementCard(
                "Nilai Terbaik",
                filteredNilai,
                "rerata",
                false
              )}
            </TabsContent>
            <TabsContent value="teratur" className="mt-0">
              {renderAchievementCard(
                "Hafalan Teratur",
                filteredTeratur,
                "",
                true
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Santri Detail Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md bg-card border border-border">
            <DialogHeader>
              <DialogTitle className="text-foreground">Detail Santri</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Informasi dan riwayat setoran santri
              </DialogDescription>
            </DialogHeader>
            
            {selectedSantri && (
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-islamic-primary/10 to-islamic-secondary/10 rounded-xl border border-islamic-primary/20">
                  <Avatar className="w-16 h-16 shadow-lg border-2 border-background">
                    <AvatarFallback className="bg-gradient-to-br from-islamic-primary to-islamic-secondary text-white font-semibold">
                      {getInitials(selectedSantri.nama)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-foreground">{selectedSantri.nama}</h3>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <Badge variant="secondary" className="bg-islamic-primary/10 text-islamic-primary border-islamic-primary/20">
                        Kelas {selectedSantri.kelas}
                      </Badge>
                      <Badge variant="outline" className="bg-islamic-secondary/10 text-islamic-secondary border-islamic-secondary/20">
                        {selectedSantri.jenis_kelamin}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-islamic-accent/10 to-islamic-gold/10 rounded-xl border border-islamic-gold/30">
                  <h4 className="font-semibold text-foreground">Total Hafalan</h4>
                  <span className="text-2xl font-bold bg-gradient-to-r from-islamic-primary to-islamic-secondary bg-clip-text text-transparent">
                    {getFormattedHafalanProgress(selectedSantri.total_hafalan || 0)}
                  </span>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground">Riwayat Setoran</h4>
                  {studentSetoran.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-islamic-primary/10 to-islamic-secondary/10 flex items-center justify-center">
                        <BookOpen className="w-8 h-8 text-islamic-primary/60" />
                      </div>
                      <p className="text-muted-foreground font-medium">Belum ada setoran</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {studentSetoran.map((setoran) => (
                        <div key={setoran.id} className="border border-border rounded-xl p-4 bg-gradient-to-r from-card to-islamic-light/5 dark:to-islamic-dark/5 hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-semibold text-foreground">{setoran.surat}</span>
                            <Badge variant="outline" className="text-xs">
                              {new Date(setoran.tanggal).toLocaleDateString("id-ID")}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground mb-3">
                            Ayat {setoran.awal_ayat} - {setoran.akhir_ayat}
                          </div>
                          <div className="grid grid-cols-3 gap-3 text-xs">
                            <div className="text-center p-2 bg-background/50 rounded-lg border">
                              <div className="text-muted-foreground mb-1">Kelancaran</div>
                              <div className="font-semibold text-islamic-primary">{setoran.kelancaran}</div>
                            </div>
                            <div className="text-center p-2 bg-background/50 rounded-lg border">
                              <div className="text-muted-foreground mb-1">Tajwid</div>
                              <div className="font-semibold text-islamic-secondary">{setoran.tajwid}</div>
                            </div>
                            <div className="text-center p-2 bg-background/50 rounded-lg border">
                              <div className="text-muted-foreground mb-1">Tahsin</div>
                              <div className="font-semibold text-islamic-accent">{setoran.tahsin}</div>
                            </div>
                          </div>
                          {setoran.catatan && (
                            <div className="mt-3 text-sm text-muted-foreground bg-background/30 p-2 rounded-lg border">
                              {setoran.catatan}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Achievements;
