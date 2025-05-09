
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Santri } from "@/types";
import { getAllSantris, getSantrisByClass, searchSantris, deleteSantri, getSetoransBySantriId } from "@/lib/mock-data";

const Dashboard = () => {
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [santris, setSantris] = useState<Santri[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSantri, setSelectedSantri] = useState<Santri | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [studentSetoran, setStudentSetoran] = useState<any[]>([]);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  // Classes from 7 to 12
  const classes = [7, 8, 9, 10, 11, 12];

  useEffect(() => {
    const fetchSantris = async () => {
      setLoading(true);
      try {
        let data: Santri[];
        
        if (searchQuery.trim()) {
          data = await searchSantris(searchQuery);
        } else if (selectedClass) {
          data = await getSantrisByClass(selectedClass);
        } else {
          data = await getAllSantris();
        }
        
        setSantris(data);
      } catch (error) {
        console.error("Error fetching santris:", error);
        toast({
          title: "Error",
          description: "Gagal memuat data santri",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchSantris();
  }, [selectedClass, searchQuery, toast]);

  const handleAddSantri = () => {
    navigate("/add-santri");
  };

  const handleClassSelect = (kelas: number) => {
    setSelectedClass(selectedClass === kelas ? null : kelas);
    setSearchQuery("");
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setSelectedClass(null);
  };

  const handleSelectSantri = async (santri: Santri) => {
    setSelectedSantri(santri);
    
    try {
      const setoran = await getSetoransBySantriId(santri.id);
      setStudentSetoran(setoran);
    } catch (error) {
      console.error("Error fetching setoran:", error);
      toast({
        title: "Error",
        description: "Gagal memuat data setoran",
        variant: "destructive",
      });
    }
  };

  const handleAddSetoran = () => {
    if (selectedSantri) {
      navigate(`/add-setoran/${selectedSantri.id}`);
    }
  };

  const handleDeleteSantri = async () => {
    if (!selectedSantri) return;
    
    try {
      await deleteSantri(selectedSantri.id);
      toast({
        title: "Berhasil",
        description: `Santri ${selectedSantri.nama} telah dihapus`,
      });
      
      // Refresh data after deletion
      if (selectedClass) {
        const data = await getSantrisByClass(selectedClass);
        setSantris(data);
      } else {
        const data = await getAllSantris();
        setSantris(data);
      }
      
      setSelectedSantri(null);
      setShowDeleteDialog(false);
    } catch (error) {
      console.error("Error deleting santri:", error);
      toast({
        title: "Error",
        description: "Gagal menghapus santri",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <Button onClick={handleAddSantri}>
          <Plus className="mr-2 h-4 w-4" /> Tambah Santri
        </Button>
      </div>
      
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Cari santri..."
          className="pl-8"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>
      
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {classes.map((kelas) => (
          <button
            key={kelas}
            onClick={() => handleClassSelect(kelas)}
            className={`islamic-bubble aspect-square ${
              selectedClass === kelas ? "bg-accent text-accent-foreground" : ""
            }`}
          >
            <span className="text-lg font-medium">Kelas {kelas}</span>
          </button>
        ))}
      </div>
      
      {loading ? (
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
          <p className="mt-2 text-muted-foreground">Memuat data...</p>
        </div>
      ) : santris.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">Tidak ada data santri</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {santris.map((santri) => (
            <Card key={santri.id} className="islamic-card overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleSelectSantri(santri)}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{santri.nama}</h3>
                    <div className="flex items-center mt-1">
                      <span className="text-xs bg-muted text-muted-foreground rounded-full px-2 py-0.5 mr-2">
                        Kelas {santri.kelas}
                      </span>
                      <span className="text-xs bg-muted text-muted-foreground rounded-full px-2 py-0.5">
                        {santri.jenis_kelamin}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-2xl font-semibold text-islamic-primary">{santri.total_hafalan}</span>
                    <span className="text-xs text-muted-foreground">Setoran</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {/* Santri Detail Dialog */}
      <Dialog open={!!selectedSantri && !showDeleteDialog} onOpenChange={() => setSelectedSantri(null)}>
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
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => setShowDeleteDialog(true)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Total Hafalan</h4>
                  <span className="text-xl font-bold text-islamic-primary">
                    {selectedSantri.total_hafalan} Setoran
                  </span>
                </div>
                
                <Button onClick={handleAddSetoran} className="w-full">
                  <Plus className="mr-2 h-4 w-4" /> Tambah Setoran
                </Button>
                
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
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus santri{" "}
              <span className="font-medium">{selectedSantri?.nama}</span>?
              Semua data setoran juga akan dihapus.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDeleteDialog(false)}>
              Batal
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteSantri}>
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Dashboard;
