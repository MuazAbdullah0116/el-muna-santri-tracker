
import React, { useState, useMemo } from "react";
import { useQuery } from '@tanstack/react-query';
import SearchBar from "@/components/dashboard/SearchBar";
import ClassFilter from "@/components/dashboard/ClassFilter";
import SantriCard from "@/components/dashboard/SantriCard";
import SantriDetail from "@/components/dashboard/SantriDetail";
import { fetchSantri } from "@/services/supabase/santri.service";
import { fetchAllSetoran } from "@/services/supabase/setoran.service";
import { Santri } from "@/types";

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState<number | "all">("all");
  const [selectedSantri, setSelectedSantri] = useState<Santri | null>(null);

  // Fetch santri data
  const { data: santriData = [], isLoading: santriLoading } = useQuery({
    queryKey: ['santri'],
    queryFn: () => fetchSantri(),
  });

  // Fetch all setoran data (including archived)
  const { data: setoranData = [], isLoading: setoranLoading } = useQuery({
    queryKey: ['all-setoran'],
    queryFn: fetchAllSetoran,
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
      const matchesClass = selectedClass === "all" || santri.kelas === Number(selectedClass);
      return matchesSearch && matchesClass;
    });
  }, [santriWithActualHafalan, searchQuery, selectedClass]);

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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-emerald-950 dark:to-teal-950 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-emerald-800 dark:text-emerald-200 mb-2">
            Dashboard Santri
          </h1>
          <p className="text-emerald-600 dark:text-emerald-400">
            Kelola dan pantau perkembangan hafalan santri
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          <div className="flex-1">
            <SearchBar 
              searchQuery={searchQuery} 
              onSearchChange={handleSearchChange}
              placeholder="Cari santri berdasarkan nama..."
            />
          </div>
          <div className="lg:w-64">
            <ClassFilter 
              selectedClass={selectedClass} 
              onClassChange={handleClassChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
            <div className="text-gray-500 dark:text-gray-400 text-lg">
              {searchQuery || selectedClass !== "all" 
                ? "Tidak ada santri yang sesuai dengan filter"
                : "Belum ada data santri"
              }
            </div>
          </div>
        )}

        {selectedSantri && (
          <SantriDetail 
            santri={selectedSantri} 
            onClose={handleCloseDetail}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
