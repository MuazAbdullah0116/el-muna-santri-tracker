import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Users, BookOpen, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Santri } from "@/types";
import { fetchSantri, fetchSantriByClass, deleteSantri } from "@/services/googleSheets/santri.service";
import { fetchSetoranBySantri } from "@/services/googleSheets/setoran.service";
import SantriCard from "@/components/dashboard/SantriCard";
import ClassFilter from "@/components/dashboard/ClassFilter";
import SearchBar from "@/components/dashboard/SearchBar";
import SantriDetail from "@/components/dashboard/SantriDetail";

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

  const fetchSantris = async () => {
    setLoading(true);
    try {
      let data: Santri[];
      
      if (searchQuery.trim()) {
        data = await fetchSantri(searchQuery);
      } else if (selectedClass) {
        data = await fetchSantriByClass(selectedClass);
      } else {
        data = await fetchSantri();
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

  useEffect(() => {
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
      const setoran = await fetchSetoranBySantri(santri.id);
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

  const handleDeleteSantri = async () => {
    if (!selectedSantri) return;
    
    try {
      await deleteSantri(selectedSantri.id);
      toast({
        title: "Berhasil",
        description: `Santri ${selectedSantri.nama} telah dihapus`,
      });
      
      // Refresh data after deletion
      await fetchSantris();
      
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

  const totalHafalan = santris.reduce((sum, santri) => sum + (santri.total_hafalan || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-islamic-accent/10">
      <div className="space-y-4 md:space-y-6 p-3 md:p-6">
        {/* Header Section - Mobile Optimized */}
        <div className="bg-card rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-xl border border-border">
          <div className="flex flex-col space-y-4 md:space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div className="flex items-center gap-3 md:gap-6">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-gradient-to-br from-islamic-primary to-islamic-secondary flex items-center justify-center shadow-xl">
                  <Users className="w-6 h-6 md:w-8 md:h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-xl md:text-3xl font-bold text-foreground mb-1 md:mb-2">Dashboard Santri</h1>
                  <p className="text-sm md:text-lg text-muted-foreground">Kelola data santri dan setoran hafalan</p>
                </div>
              </div>
              
              <Button 
                onClick={handleAddSantri}
                className="w-full sm:w-auto bg-gradient-to-r from-islamic-primary to-islamic-secondary hover:from-islamic-primary/90 hover:to-islamic-secondary/90 shadow-xl px-4 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl text-sm md:text-lg font-semibold"
              >
                <Plus className="mr-2 h-4 w-4 md:h-6 md:w-6" /> 
                Tambah Santri
              </Button>
            </div>
            
            {/* Enhanced Stats - Mobile Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-6">
              <div className="bg-gradient-to-br from-islamic-primary/10 to-islamic-primary/5 rounded-xl md:rounded-2xl p-4 md:p-6 border border-islamic-primary/20">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-islamic-primary flex items-center justify-center shadow-lg">
                    <Users className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-muted-foreground font-medium">Total Santri</p>
                    <p className="text-xl md:text-3xl font-bold text-islamic-primary">{santris.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-islamic-secondary/10 to-islamic-secondary/5 rounded-xl md:rounded-2xl p-4 md:p-6 border border-islamic-secondary/20">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-islamic-secondary flex items-center justify-center shadow-lg">
                    <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-muted-foreground font-medium">Total Hafalan</p>
                    <p className="text-xl md:text-3xl font-bold text-islamic-secondary">{totalHafalan}</p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-islamic-accent/10 to-islamic-accent/5 rounded-xl md:rounded-2xl p-4 md:p-6 border border-islamic-accent/20">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-islamic-accent flex items-center justify-center shadow-lg">
                    <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-muted-foreground font-medium">Kelas Aktif</p>
                    <p className="text-xl md:text-3xl font-bold text-islamic-accent">
                      {selectedClass ? selectedClass : "Semua"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Search Section */}
        <div className="bg-card rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-xl border border-border">
          <SearchBar searchQuery={searchQuery} onSearchChange={handleSearchChange} />
        </div>
        
        {/* Class Filter Section */}
        <div className="bg-card rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-xl border border-border">
          <ClassFilter 
            selectedClass={selectedClass} 
            onClassSelect={handleClassSelect} 
            classes={classes}
            refreshData={fetchSantris}
          />
        </div>
        
        {/* Content Section */}
        <div className="bg-card rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-xl border border-border">
          {loading ? (
            <div className="text-center py-12 md:py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 md:h-16 md:w-16 border-4 border-islamic-primary border-t-transparent shadow-lg"></div>
              <p className="mt-4 md:mt-6 text-muted-foreground font-medium text-base md:text-lg">Memuat data santri...</p>
            </div>
          ) : santris.length === 0 ? (
            <div className="text-center py-12 md:py-20">
              <div className="w-16 h-16 md:w-24 md:h-24 mx-auto mb-4 md:mb-6 rounded-full bg-gradient-to-br from-islamic-primary/10 to-islamic-secondary/10 flex items-center justify-center">
                <Users className="w-8 h-8 md:w-12 md:h-12 text-islamic-primary/60" />
              </div>
              <p className="text-foreground font-medium text-lg md:text-xl mb-2">Tidak ada data santri</p>
              <p className="text-muted-foreground text-sm md:text-base">Mulai dengan menambahkan santri baru</p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-gradient-to-br from-islamic-primary to-islamic-secondary flex items-center justify-center shadow-lg">
                  <BookOpen className="w-4 h-4 md:w-5 md:h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg md:text-2xl font-bold text-foreground">
                    Daftar Santri {selectedClass && `- Kelas ${selectedClass}`}
                  </h2>
                  <p className="text-sm md:text-base text-muted-foreground">Klik untuk melihat detail santri</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
                {santris.map((santri) => (
                  <SantriCard 
                    key={santri.id} 
                    santri={santri} 
                    onClick={handleSelectSantri}
                  />
                ))}
              </div>
            </>
          )}
        </div>
        
        <SantriDetail 
          selectedSantri={selectedSantri}
          studentSetoran={studentSetoran}
          onClose={() => setSelectedSantri(null)}
          onDelete={handleDeleteSantri}
          showDeleteDialog={showDeleteDialog}
          setShowDeleteDialog={setShowDeleteDialog}
          refreshData={fetchSantris}
        />
      </div>
    </div>
  );
};

export default Dashboard;
