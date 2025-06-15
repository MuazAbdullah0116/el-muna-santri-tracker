
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Trophy, Medal, Target, BookOpen, Star, TrendingUp } from "lucide-react";
import SearchBar from "@/components/dashboard/SearchBar";
import TopHafalanCard from "@/components/achievements/TopHafalanCard";
import TopPerformersCard from "@/components/achievements/TopPerformersCard";
import TopRegularityCard from "@/components/achievements/TopRegularityCard";
import SantriDetailModal from "@/components/achievements/SantriDetailModal";
import { fetchTopHafalan, fetchTopPerformers, fetchTopRegularity } from "@/services/supabase/achievement.service";

const Achievements = () => {
  const [selectedGender, setSelectedGender] = useState<"all" | "Ikhwan" | "Akhwat">("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("hafalan");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSantriId, setSelectedSantriId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    setSelectedSantriId(santriId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSantriId(null);
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

  const selectedCategoryConfig = categoryConfig.find(cat => cat.id === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-6 bg-white/80 backdrop-blur-sm border-emerald-200">
          <CardHeader>
            <CardTitle className="text-2xl sm:text-3xl font-bold text-emerald-800 text-center flex items-center justify-center gap-2">
              <Trophy className="h-6 w-6 sm:h-8 sm:w-8" />
              Prestasi Santri
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <SearchBar
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
              placeholder="Cari santri berdasarkan nama..."
            />
            
            {/* Category Filter */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-emerald-800">Kategori Prestasi:</label>
              <RadioGroup 
                value={selectedCategory} 
                onValueChange={setSelectedCategory}
                className="flex flex-wrap justify-center gap-4"
              >
                {categoryConfig.map((category) => {
                  const Icon = category.icon;
                  return (
                    <div key={category.id} className="flex items-center space-x-2">
                      <RadioGroupItem 
                        value={category.id} 
                        id={category.id}
                        className="border-emerald-500 text-emerald-600"
                      />
                      <Label 
                        htmlFor={category.id} 
                        className="flex items-center gap-2 cursor-pointer text-sm font-medium text-emerald-700 hover:text-emerald-800"
                      >
                        <Icon className="h-4 w-4" />
                        <span className="hidden sm:inline">{category.label}</span>
                        <span className="sm:hidden">
                          {category.id === "hafalan" ? "Hafalan" : 
                           category.id === "nilai" ? "Nilai" : "Konsistensi"}
                        </span>
                      </Label>
                    </div>
                  );
                })}
              </RadioGroup>
            </div>
          </CardContent>
        </Card>

        <div className="mb-6">
          <Tabs value={selectedGender} onValueChange={(value) => setSelectedGender(value as any)}>
            <TabsList className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-sm border border-emerald-200">
              <TabsTrigger 
                value="all" 
                className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
              >
                Semua
              </TabsTrigger>
              <TabsTrigger 
                value="Ikhwan"
                className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
              >
                Ikhwan
              </TabsTrigger>
              <TabsTrigger 
                value="Akhwat"
                className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
              >
                Akhwat
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {selectedCategoryConfig && (
          <Card className="bg-white/80 backdrop-blur-sm border-emerald-200">
            <CardHeader>
              <CardTitle className={`${selectedCategoryConfig.color} flex items-center gap-2 text-lg sm:text-xl`}>
                <selectedCategoryConfig.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                {selectedCategoryConfig.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <selectedCategoryConfig.component 
                data={selectedCategoryConfig.data} 
                isLoading={selectedCategoryConfig.isLoading} 
                searchQuery={searchQuery}
                onSantriClick={handleSantriClick}
              />
            </CardContent>
          </Card>
        )}

        <SantriDetailModal 
          santriId={selectedSantriId}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      </div>
    </div>
  );
};

export default Achievements;
