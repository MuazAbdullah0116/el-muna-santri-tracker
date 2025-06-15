
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Santri } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SantriCard from "@/components/dashboard/SantriCard";
import SearchBar from "@/components/dashboard/SearchBar";
import ClassFilter from "@/components/dashboard/ClassFilter";
import { fetchSantri, fetchSantriByClass, deleteSantri } from "@/services/supabase/santri.service";

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState<number | null>(null);

  const {
    data: santris = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["santris", searchQuery, selectedClass],
    queryFn: () => {
      if (selectedClass) {
        return fetchSantriByClass(selectedClass);
      }
      return fetchSantri(searchQuery);
    },
  });

  // Generate all classes from 7 to 12, plus any existing classes from data
  const existingClasses = [...new Set(santris.map(santri => santri.kelas))];
  const allClasses = [7, 8, 9, 10, 11, 12];
  const classes = [...new Set([...allClasses, ...existingClasses])].sort((a, b) => a - b);

  const handleDeleteSantri = async (id: string) => {
    try {
      await deleteSantri(id);
      toast.success("Santri berhasil dihapus");
      refetch();
    } catch (error) {
      console.error("Error deleting santri:", error);
      toast.error("Gagal menghapus santri");
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleClassSelect = (kelas: number) => {
    setSelectedClass(selectedClass === kelas ? null : kelas);
  };

  const refreshData = async () => {
    await refetch();
  };

  if (error) {
    toast.error("Gagal memuat data santri");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 p-4">
      <div className="max-w-7xl mx-auto">
        <Card className="mb-6 bg-white/70 backdrop-blur-sm border-emerald-200">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-emerald-800 text-center">
              Dashboard Santri
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-6">
              {/* Search Bar */}
              <div className="w-full">
                <SearchBar
                  searchQuery={searchQuery}
                  onSearchChange={handleSearchChange}
                />
              </div>
              
              {/* Class Filter */}
              <div className="w-full">
                <ClassFilter
                  selectedClass={selectedClass}
                  onClassSelect={handleClassSelect}
                  classes={classes}
                  refreshData={refreshData}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/70 backdrop-blur-sm">
            <TabsTrigger value="all">Semua Santri</TabsTrigger>
            <TabsTrigger value="ikhwan">Ikhwan</TabsTrigger>
            <TabsTrigger value="akhwat">Akhwat</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {isLoading ? (
                <div className="col-span-full text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
                  <p className="mt-2 text-emerald-600">Memuat data santri...</p>
                </div>
              ) : santris.length === 0 ? (
                <div className="col-span-full text-center py-8">
                  <p className="text-gray-500">
                    {selectedClass 
                      ? `Tidak ada santri di kelas ${selectedClass}` 
                      : searchQuery 
                        ? `Tidak ada santri yang ditemukan untuk "${searchQuery}"` 
                        : "Tidak ada santri yang ditemukan"
                    }
                  </p>
                </div>
              ) : (
                santris.map((santri) => (
                  <SantriCard
                    key={santri.id}
                    santri={santri}
                  />
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="ikhwan" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {isLoading ? (
                <div className="col-span-full text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
                  <p className="mt-2 text-emerald-600">Memuat data santri...</p>
                </div>
              ) : (
                santris
                  .filter((santri) => santri.jenis_kelamin === "Ikhwan")
                  .map((santri) => (
                    <SantriCard
                      key={santri.id}
                      santri={santri}
                    />
                  ))
              )}
              {santris.filter((santri) => santri.jenis_kelamin === "Ikhwan").length === 0 && !isLoading && (
                <div className="col-span-full text-center py-8">
                  <p className="text-gray-500">Tidak ada santri Ikhwan yang ditemukan</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="akhwat" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {isLoading ? (
                <div className="col-span-full text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
                  <p className="mt-2 text-emerald-600">Memuat data santri...</p>
                </div>
              ) : (
                santris
                  .filter((santri) => santri.jenis_kelamin === "Akhwat")
                  .map((santri) => (
                    <SantriCard
                      key={santri.id}
                      santri={santri}
                    />
                  ))
              )}
              {santris.filter((santri) => santri.jenis_kelamin === "Akhwat").length === 0 && !isLoading && (
                <div className="col-span-full text-center py-8">
                  <p className="text-gray-500">Tidak ada santri Akhwat yang ditemukan</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
