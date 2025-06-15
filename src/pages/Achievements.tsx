
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Trophy, Medal, Target, BookOpen, Star, TrendingUp } from "lucide-react";
import SearchBar from "@/components/dashboard/SearchBar";
import TopHafalanCard from "@/components/achievements/TopHafalanCard";
import TopPerformersCard from "@/components/achievements/TopPerformersCard";
import TopRegularityCard from "@/components/achievements/TopRegularityCard";
import { fetchTopHafalan, fetchTopPerformers, fetchTopRegularity } from "@/services/supabase/achievement.service";

const Achievements = () => {
  const [selectedGender, setSelectedGender] = useState<"all" | "Ikhwan" | "Akhwat">("all");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["hafalan", "nilai", "konsistensi"]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

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

  const handleSantriClick = (santriId: string) => {
    navigate(`/santri/${santriId}`);
  };

  const categoryConfig = [
    {
      id: "hafalan",
      label: "Hafalan Terbanyak",
      icon: BookOpen,
      component: TopHafalanCard,
      data: topHafalan,
      isLoading: isLoadingHafalan,
      color: "text-emerald-800"
    },
    {
      id: "nilai",
      label: "Nilai Tertinggi", 
      icon: Star,
      component: TopPerformersCard,
      data: topPerformers,
      isLoading: isLoadingPerformers,
      color: "text-blue-800"
    },
    {
      id: "konsistensi",
      label: "Setoran Terkonsisten",
      icon: TrendingUp,
      component: TopRegularityCard,
      data: topRegularity,
      isLoading: isLoadingRegularity,
      color: "text-purple-800"
    }
  ];

  const visibleCategories = categoryConfig.filter(cat => selectedCategories.includes(cat.id));

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 p-4">
      <div className="max-w-6xl mx-auto">
        <Card className="mb-6 bg-white/70 backdrop-blur-sm border-emerald-200">
          <CardHeader>
            <CardTitle className="text-2xl sm:text-3xl font-bold text-emerald-800 text-center flex items-center justify-center gap-2">
              <Trophy className="h-6 w-6 sm:h-8 sm:w-8" />
              Prestasi Santri
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <SearchBar
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
              placeholder="Cari santri berdasarkan nama..."
            />
            
            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Kategori Prestasi:</label>
              <ToggleGroup 
                type="multiple" 
                value={selectedCategories} 
                onValueChange={setSelectedCategories}
                className="flex flex-wrap justify-center gap-2"
              >
                <ToggleGroupItem value="hafalan" aria-label="Hafalan Terbanyak" size="sm">
                  <BookOpen className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Hafalan</span>
                  <span className="sm:hidden">H</span>
                </ToggleGroupItem>
                <ToggleGroupItem value="nilai" aria-label="Nilai Tertinggi" size="sm">
                  <Star className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Nilai</span>
                  <span className="sm:hidden">N</span>
                </ToggleGroupItem>
                <ToggleGroupItem value="konsistensi" aria-label="Setoran Terkonsisten" size="sm">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Konsistensi</span>
                  <span className="sm:hidden">K</span>
                </ToggleGroupItem>
              </ToggleGroup>
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

        {visibleCategories.length === 0 ? (
          <Card className="bg-white/70 backdrop-blur-sm border-emerald-200">
            <CardContent className="p-8 text-center">
              <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Pilih minimal satu kategori prestasi untuk ditampilkan</p>
            </CardContent>
          </Card>
        ) : (
          <div className={`grid grid-cols-1 ${visibleCategories.length === 2 ? 'lg:grid-cols-2' : visibleCategories.length >= 3 ? 'lg:grid-cols-3' : ''} gap-6`}>
            {visibleCategories.map(category => {
              const Component = category.component;
              const Icon = category.icon;
              
              return (
                <Card key={category.id} className="bg-white/70 backdrop-blur-sm border-emerald-200">
                  <CardHeader>
                    <CardTitle className={`${category.color} flex items-center gap-2 text-sm sm:text-base`}>
                      <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                      {category.label}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Component 
                      data={category.data} 
                      isLoading={category.isLoading} 
                      searchQuery={searchQuery}
                      onSantriClick={handleSantriClick}
                    />
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Achievements;
