
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <Button onClick={handleAddSantri}>
          <Plus className="mr-2 h-4 w-4" /> Tambah Santri
        </Button>
      </div>
      
      <SearchBar searchQuery={searchQuery} onSearchChange={handleSearchChange} />
      
      <ClassFilter 
        selectedClass={selectedClass} 
        onClassSelect={handleClassSelect} 
        classes={classes}
        refreshData={fetchSantris}
      />
      
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
            <SantriCard 
              key={santri.id} 
              santri={santri} 
              onClick={handleSelectSantri}
            />
          ))}
        </div>
      )}
      
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
  );
};

export default Dashboard;
