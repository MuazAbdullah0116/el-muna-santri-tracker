
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Users, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Santri } from "@/types";
import { fetchSantri, fetchSantriByClass, deleteSantri } from "@/services/supabase/santri.service";
import { fetchSetoranBySantri } from "@/services/supabase/setoran.service";
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-islamic-light via-white to-islamic-accent/10">
      <div className="space-y-8 p-6">
        {/* Header Section */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-islamic-primary/10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-islamic-primary to-islamic-secondary flex items-center justify-center shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Dashboard Santri</h1>
                <p className="text-gray-600">Kelola data santri dan setoran hafalan</p>
              </div>
            </div>
            
            <Button 
              onClick={handleAddSantri}
              className="bg-gradient-to-r from-islamic-primary to-islamic-secondary hover:from-islamic-primary/90 hover:to-islamic-secondary/90 shadow-lg px-6 py-3 rounded-xl"
            >
              <Plus className="mr-2 h-5 w-5" /> 
              Tambah Santri
            </Button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            <div className="bg-gradient-to-br from-islamic-primary/10 to-islamic-primary/5 rounded-xl p-4 border border-islamic-primary/20">
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-islamic-primary" />
                <div>
                  <p className="text-sm text-gray-600">Total Santri</p>
                  <p className="text-2xl font-bold text-islamic-primary">{santris.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-islamic-secondary/10 to-islamic-secondary/5 rounded-xl p-4 border border-islamic-secondary/20">
              <div className="flex items-center gap-3">
                <BookOpen className="w-8 h-8 text-islamic-secondary" />
                <div>
                  <p className="text-sm text-gray-600">Total Hafalan</p>
                  <p className="text-2xl font-bold text-islamic-secondary">
                    {santris.reduce((sum, santri) => sum + (santri.total_hafalan || 0), 0)}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-islamic-accent/10 to-islamic-accent/5 rounded-xl p-4 border border-islamic-accent/20">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-islamic-accent flex items-center justify-center text-white font-bold">
                  {selectedClass || "?"}
                </div>
                <div>
                  <p className="text-sm text-gray-600">Kelas Aktif</p>
                  <p className="text-2xl font-bold text-islamic-accent">
                    {selectedClass ? `Kelas ${selectedClass}` : "Semua"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Search Section */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-islamic-primary/10">
          <SearchBar searchQuery={searchQuery} onSearchChange={handleSearchChange} />
        </div>
        
        {/* Class Filter Section */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-islamic-primary/10">
          <ClassFilter 
            selectedClass={selectedClass} 
            onClassSelect={handleClassSelect} 
            classes={classes}
            refreshData={fetchSantris}
          />
        </div>
        
        {/* Content Section */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-islamic-primary/10">
          {loading ? (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-islamic-primary border-t-transparent shadow-lg"></div>
              <p className="mt-4 text-gray-600 font-medium">Memuat data santri...</p>
            </div>
          ) : santris.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-islamic-primary/10 to-islamic-secondary/10 flex items-center justify-center">
                <Users className="w-10 h-10 text-islamic-primary/60" />
              </div>
              <p className="text-gray-600 font-medium text-lg">Tidak ada data santri</p>
              <p className="text-gray-500 text-sm mt-2">Mulai dengan menambahkan santri baru</p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-6">
                <BookOpen className="w-6 h-6 text-islamic-primary" />
                <h2 className="text-xl font-semibold text-gray-800">
                  Daftar Santri {selectedClass && `- Kelas ${selectedClass}`}
                </h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
