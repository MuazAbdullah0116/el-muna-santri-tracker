
import React, { useState, useMemo } from "react";
import { useQuery } from '@tanstack/react-query';
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SearchBar from "@/components/dashboard/SearchBar";
import ClassFilter from "@/components/dashboard/ClassFilter";
import SantriCard from "@/components/dashboard/SantriCard";
import SantriDetail from "@/components/dashboard/SantriDetail";

import { fetchSantri } from "@/services/supabase/santri.service";
import { fetchAllSetoran, fetchSetoranBySantri } from "@/services/supabase/setoran.service";
import { Santri } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/services/supabase/client";

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState<number | "all">("all");
  const [selectedSantri, setSelectedSantri] = useState<Santri | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { toast } = useToast();

  // Fetch santri data
  const { data: santriData = [], isLoading: santriLoading, refetch: refetchSantri } = useQuery({
    queryKey: ['santri'],
    queryFn: () => fetchSantri(),
  });

  // Fetch all setoran data (including archived)
  const { data: setoranData = [], isLoading: setoranLoading } = useQuery({
    queryKey: ['all-setoran'],
    queryFn: fetchAllSetoran,
  });

  // Fetch selected santri's setoran data
  const { data: studentSetoran = [] } = useQuery({
    queryKey: ['santri-setoran', selectedSantri?.id],
    queryFn: () => fetchSetoranBySantri(selectedSantri!.id),
    enabled: !!selectedSantri,
  });

  // Calculate actual hafalan for each santri based on all setoran data
  const santriWithActualHafalan = useMemo(() => {
    if (!Array.isArray(santriData) || santriData.length === 0 || !Array.isArray(setoranData) || setoranData.length === 0) {
      return santriData || [];
    }

    return santriData.map(santri => {
      const santriSetoran = setoranData.filter((setoran: any) => setoran.santri_id === santri.id);
      const actualHafalan = santriSetoran.reduce((total: number, setoran: any) => {
        return total + (setoran.akhir_ayat - setoran.awal_ayat + 1);
      }, 0);

      return {
        ...santri,
        total_hafalan: actualHafalan
      };
    });
  }, [santriData, setoranData]);

  const filteredSantri = useMemo(() => {
    return santriWithActualHafalan.filter((santri) => {
      const matchesSearch = santri.nama.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesClass = selectedClass === "all" || santri.kelas === selectedClass;
      return matchesSearch && matchesClass;
    });
  }, [santriWithActualHafalan, searchQuery, selectedClass]);

  // Get unique classes from santri data
  const classes = useMemo(() => {
    const uniqueClasses = [...new Set(santriData.map(santri => santri.kelas))].sort((a, b) => a - b);
    return uniqueClasses;
  }, [santriData]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleClassChange = (kelas: number | "all") => {
    setSelectedClass(kelas);
  };

  const handleSantriClick = (santri: Santri) => {
    setSelectedSantri(santri);
  };

  const handleCloseDetail = () => {
    setSelectedSantri(null);
    setShowDeleteDialog(false);
  };

  const handleDeleteSantri = async () => {
    if (!selectedSantri) return;

    try {
      // Delete all setoran records for this santri first
      await supabase
        .from('setoran')
        .delete()
        .eq('santri_id', selectedSantri.id);

      // Then delete the santri
      await supabase
        .from('santri')
        .delete()
        .eq('id', selectedSantri.id);

      toast({
        title: "Berhasil",
        description: "Data santri berhasil dihapus",
      });

      setSelectedSantri(null);
      setShowDeleteDialog(false);
      await refetchSantri();
    } catch (error) {
      console.error("Error deleting santri:", error);
      toast({
        title: "Error",
        description: "Gagal menghapus data santri",
        variant: "destructive",
      });
    }
  };

  const refreshData = async () => {
    await refetchSantri();
  };

  const isLoading = santriLoading || setoranLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-emerald-950 dark:to-teal-950 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            <span className="ml-3 text-lg text-emerald-600">Memuat data santri...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-islamic-light to-islamic-light/50 dark:from-islamic-dark dark:to-islamic-dark/50 p-2 sm:p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-4 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-1 sm:mb-2">
                Dashboard Santri
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                Kelola dan pantau perkembangan hafalan santri
              </p>
            </div>
            <Link to="/add-santri" className="w-full sm:w-auto">
              <Button className="bg-islamic-primary hover:bg-islamic-primary/90 text-white w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Tambah Santri
              </Button>
            </Link>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-4 sm:mb-6">
          <SearchBar 
            searchQuery={searchQuery} 
            onSearchChange={handleSearchChange}
            placeholder="Cari santri berdasarkan nama..."
          />
        </div>

        {/* Class Filter */}
        <div className="mb-4 sm:mb-8">
          <ClassFilter 
            selectedClass={selectedClass === "all" ? null : selectedClass}
            onClassSelect={handleClassChange}
            classes={classes}
            refreshData={refreshData}
            showPromotionHint={false}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {filteredSantri.map((santri) => (
            <SantriCard 
              key={santri.id} 
              santri={santri} 
              onClick={() => handleSantriClick(santri)}
            />
          ))}
        </div>

        {filteredSantri.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground text-lg">
              {searchQuery || selectedClass !== "all" 
                ? "Tidak ada santri yang sesuai dengan filter"
                : "Belum ada data santri"
              }
            </div>
          </div>
        )}

        {selectedSantri && (
          <SantriDetail 
            selectedSantri={selectedSantri}
            studentSetoran={studentSetoran}
            onClose={handleCloseDetail}
            onDelete={handleDeleteSantri}
            showDeleteDialog={showDeleteDialog}
            setShowDeleteDialog={setShowDeleteDialog}
            refreshData={refreshData}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
