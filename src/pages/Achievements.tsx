
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Medal, Target } from "lucide-react";
import SearchBar from "@/components/dashboard/SearchBar";
import TopHafalanCard from "@/components/achievements/TopHafalanCard";
import TopPerformersCard from "@/components/achievements/TopPerformersCard";
import TopRegularityCard from "@/components/achievements/TopRegularityCard";
import { fetchTopHafalan, fetchTopPerformers, fetchTopRegularity } from "@/services/supabase/achievement.service";

const Achievements = () => {
  const [selectedGender, setSelectedGender] = useState<"all" | "Ikhwan" | "Akhwat">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: topHafalan = [],
    isLoading: isLoadingHafalan,
  } = useQuery({
    queryKey: ["topHafalan", selectedGender === "all" ? undefined : selectedGender],
    queryFn: () => fetchTopHafalan(selectedGender === "all" ? undefined : selectedGender),
  });

  const {
    data: topPerformers = [],
    isLoading: isLoadingPerformers,
  } = useQuery({
    queryKey: ["topPerformers", selectedGender === "all" ? undefined : selectedGender],
    queryFn: () => fetchTopPerformers(selectedGender === "all" ? undefined : selectedGender),
  });

  const {
    data: topRegularity = [],
    isLoading: isLoadingRegularity,
  } = useQuery({
    queryKey: ["topRegularity", selectedGender === "all" ? undefined : selectedGender],
    queryFn: () => fetchTopRegularity(selectedGender === "all" ? undefined : selectedGender),
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 p-4">
      <div className="max-w-6xl mx-auto">
        <Card className="mb-6 bg-white/70 backdrop-blur-sm border-emerald-200">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-emerald-800 text-center flex items-center justify-center gap-2">
              <Trophy className="h-8 w-8" />
              Prestasi Santri
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <SearchBar
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange}
                placeholder="Cari santri berdasarkan nama..."
              />
            </div>
          </CardContent>
        </Card>

        <div className="mb-6">
          <Tabs value={selectedGender} onValueChange={(value) => setSelectedGender(value as any)}>
            <TabsList className="grid w-full grid-cols-3 bg-white/70 backdrop-blur-sm">
              <TabsTrigger value="all">Semua</TabsTrigger>
              <TabsTrigger value="Ikhwan">Ikhwan</TabsTrigger>
              <TabsTrigger value="Akhwat">Akhwat</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="bg-white/70 backdrop-blur-sm border-emerald-200">
            <CardHeader>
              <CardTitle className="text-emerald-800 flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Hafalan Terbanyak
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TopHafalanCard 
                data={topHafalan} 
                isLoading={isLoadingHafalan} 
                searchQuery={searchQuery}
              />
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-emerald-200">
            <CardHeader>
              <CardTitle className="text-emerald-800 flex items-center gap-2">
                <Medal className="h-5 w-5" />
                Nilai Tertinggi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TopPerformersCard 
                data={topPerformers} 
                isLoading={isLoadingPerformers} 
                searchQuery={searchQuery}
              />
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-emerald-200">
            <CardHeader>
              <CardTitle className="text-emerald-800 flex items-center gap-2">
                <Target className="h-5 w-5" />
                Setoran Terkonsisten
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TopRegularityCard 
                data={topRegularity} 
                isLoading={isLoadingRegularity} 
                searchQuery={searchQuery}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Achievements;
