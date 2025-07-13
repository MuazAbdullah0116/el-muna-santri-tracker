import { useState, useEffect } from "react";
import { Search, Users, BookOpen, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import IslamicLogo from "@/components/IslamicLogo";

interface Santri {
  id: string;
  nama: string;
  kelas: number;
  jenis_kelamin: string;
  total_hafalan: number;
  created_at: string;
}

interface Setoran {
  id: string;
  tanggal: string;
  juz: number;
  surat: string;
  awal_ayat: number;
  akhir_ayat: number;
  kelancaran: number;
  tajwid: number;
  tahsin: number;
  catatan: string | null;
  diuji_oleh: string;
}

const BrowseSantri = () => {
  const [santriList, setSantriList] = useState<Santri[]>([]);
  const [filteredSantri, setFilteredSantri] = useState<Santri[]>([]);
  const [selectedSantri, setSelectedSantri] = useState<Santri | null>(null);
  const [setoranHistory, setSetoranHistory] = useState<Setoran[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedKelas, setSelectedKelas] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const { toast } = useToast();

  // Fetch all santri
  const fetchSantri = async () => {
    try {
      const { data, error } = await supabase
        .from("santri")
        .select("*")
        .order("nama");

      if (error) throw error;
      setSantriList(data || []);
      setFilteredSantri(data || []);
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
  };

  // Fetch setoran history for selected santri
  const fetchSetoranHistory = async (santriId: string) => {
    setDetailLoading(true);
    try {
      const { data, error } = await supabase
        .from("setoran")
        .select("*")
        .eq("santri_id", santriId)
        .order("tanggal", { ascending: false });

      if (error) throw error;
      setSetoranHistory(data || []);
    } catch (error) {
      console.error("Error fetching setoran history:", error);
      toast({
        title: "Error",
        description: "Gagal memuat riwayat setoran",
        variant: "destructive",
      });
    } finally {
      setDetailLoading(false);
    }
  };

  // Filter santri based on search and class
  useEffect(() => {
    let filtered = santriList;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(santri =>
        santri.nama.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by class
    if (selectedKelas !== "all") {
      filtered = filtered.filter(santri => santri.kelas.toString() === selectedKelas);
    }

    setFilteredSantri(filtered);
  }, [searchTerm, selectedKelas, santriList]);

  useEffect(() => {
    fetchSantri();
  }, []);

  const handleSantriClick = (santri: Santri) => {
    setSelectedSantri(santri);
    fetchSetoranHistory(santri.id);
  };

  const getAverageScore = (setoran: Setoran[]) => {
    if (setoran.length === 0) return 0;
    const total = setoran.reduce((sum, s) => sum + s.kelancaran + s.tajwid + s.tahsin, 0);
    return Math.round(total / (setoran.length * 3));
  };

  const getKelasList = () => {
    const kelasSet = new Set(santriList.map(s => s.kelas));
    return Array.from(kelasSet).sort((a, b) => a - b);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <IslamicLogo size="lg" animated />
          <p className="mt-4 text-muted-foreground">Memuat data santri...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <IslamicLogo size="md" />
            <h1 className="text-3xl font-bold mt-4">Jelajah Santri</h1>
            <p className="text-primary-foreground/80 mt-2">
              Pondok Pesantren Al-Munawwarah
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Cari nama santri..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedKelas} onValueChange={setSelectedKelas}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter Kelas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kelas</SelectItem>
              {getKelasList().map((kelas) => (
                <SelectItem key={kelas} value={kelas.toString()}>
                  Kelas {kelas}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-primary" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Total Santri</p>
                  <p className="text-2xl font-bold">{filteredSantri.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <BookOpen className="h-8 w-8 text-primary" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Rata-rata Hafalan</p>
                  <p className="text-2xl font-bold">
                    {filteredSantri.length > 0
                      ? Math.round(filteredSantri.reduce((sum, s) => sum + (s.total_hafalan || 0), 0) / filteredSantri.length)
                      : 0
                    } Juz
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-primary" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Kelas Tersedia</p>
                  <p className="text-2xl font-bold">{getKelasList().length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Santri Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSantri.map((santri) => (
            <Card 
              key={santri.id} 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleSantriClick(santri)}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{santri.nama}</CardTitle>
                <div className="flex gap-2">
                  <Badge variant="outline">Kelas {santri.kelas}</Badge>
                  <Badge variant="secondary">
                    {santri.jenis_kelamin === "L" ? "Laki-laki" : "Perempuan"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Hafalan:</span>
                    <span className="font-medium">{santri.total_hafalan || 0} Juz</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Bergabung:</span>
                    <span className="font-medium">
                      {new Date(santri.created_at).toLocaleDateString("id-ID")}
                    </span>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4" size="sm">
                  Lihat Detail
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredSantri.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground">Tidak ada santri ditemukan</h3>
            <p className="text-muted-foreground">Coba ubah kata kunci pencarian atau filter kelas</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <Dialog open={!!selectedSantri} onOpenChange={() => setSelectedSantri(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Detail Santri: {selectedSantri?.nama}
            </DialogTitle>
          </DialogHeader>
          
          {selectedSantri && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Informasi Dasar</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Nama:</span>
                      <span className="font-medium">{selectedSantri.nama}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Kelas:</span>
                      <span className="font-medium">{selectedSantri.kelas}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Jenis Kelamin:</span>
                      <span className="font-medium">
                        {selectedSantri.jenis_kelamin === "L" ? "Laki-laki" : "Perempuan"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Hafalan:</span>
                      <span className="font-medium">{selectedSantri.total_hafalan || 0} Juz</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Statistik Setoran</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Setoran:</span>
                      <span className="font-medium">{setoranHistory.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Rata-rata Nilai:</span>
                      <span className="font-medium">{getAverageScore(setoranHistory)}/100</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Setoran Terakhir:</span>
                      <span className="font-medium">
                        {setoranHistory.length > 0
                          ? new Date(setoranHistory[0].tanggal).toLocaleDateString("id-ID")
                          : "Belum ada"
                        }
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Setoran History */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Riwayat Setoran</CardTitle>
                </CardHeader>
                <CardContent>
                  {detailLoading ? (
                    <div className="text-center py-4">
                      <p className="text-muted-foreground">Memuat riwayat setoran...</p>
                    </div>
                  ) : setoranHistory.length > 0 ? (
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {setoranHistory.map((setoran) => (
                        <div key={setoran.id} className="border rounded-lg p-3">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-medium">
                                {setoran.surat} (Juz {setoran.juz})
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Ayat {setoran.awal_ayat}-{setoran.akhir_ayat}
                              </p>
                            </div>
                            <Badge variant="outline">
                              {new Date(setoran.tanggal).toLocaleDateString("id-ID")}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-sm">
                            <div>
                              <span className="text-muted-foreground">Kelancaran: </span>
                              <span className="font-medium">{setoran.kelancaran}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Tajwid: </span>
                              <span className="font-medium">{setoran.tajwid}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Tahsin: </span>
                              <span className="font-medium">{setoran.tahsin}</span>
                            </div>
                          </div>
                          {setoran.catatan && (
                            <p className="text-sm text-muted-foreground mt-2">
                              Catatan: {setoran.catatan}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground mt-1">
                            Diuji oleh: {setoran.diuji_oleh}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Belum ada riwayat setoran</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BrowseSantri;