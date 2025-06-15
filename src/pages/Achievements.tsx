
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Target, Crown } from "lucide-react";
import { fetchTopHafalan, fetchTopPerformers, fetchTopRegularity } from "@/services/supabase/achievement.service";

const Achievements = () => {
  const [selectedGender, setSelectedGender] = useState<"all" | "Ikhwan" | "Akhwat">("all");

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

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Medal className="h-5 w-5 text-amber-600" />;
      default:
        return <Trophy className="h-5 w-5 text-emerald-600" />;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-400 to-yellow-600";
      case 2:
        return "bg-gradient-to-r from-gray-300 to-gray-500";
      case 3:
        return "bg-gradient-to-r from-amber-400 to-amber-600";
      default:
        return "bg-gradient-to-r from-emerald-400 to-emerald-600";
    }
  };

  const renderRankingCard = (data: any[], isLoading: boolean, title: string, valueKey?: string) => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-200 h-16 rounded-lg"></div>
          ))}
        </div>
      );
    }

    if (data.length === 0) {
      return (
        <div className="text-center py-8">
          <Target className="h-12 w-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500">Belum ada data ranking</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {data.slice(0, 10).map((item, index) => {
          const rank = index + 1;
          return (
            <Card key={item.id} className={`${getRankColor(rank)} text-white border-none`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getRankIcon(rank)}
                    <div>
                      <h3 className="font-semibold">{item.nama}</h3>
                      <div className="flex items-center space-x-2 text-sm opacity-90">
                        <span>Kelas {item.kelas}</span>
                        <Badge variant="secondary" className="text-xs">
                          {item.jenis_kelamin}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">#{rank}</div>
                    {valueKey && (
                      <div className="text-sm opacity-90">
                        {valueKey === 'nilai_rata' 
                          ? `${item[valueKey]?.toFixed(1) || 0}/10`
                          : item[valueKey] || 0
                        }
                      </div>
                    )}
                    {item.hafalanJuz !== undefined && (
                      <div className="text-xs opacity-75">
                        {item.hafalanJuz > 0 && `${item.hafalanJuz} Juz `}
                        {item.hafalanPages > 0 && `${item.hafalanPages} Hal `}
                        {item.hafalanLines > 0 && `${item.hafalanLines} Baris`}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
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
                Top Hafalan
              </CardTitle>
            </CardHeader>
            <CardContent>
              {renderRankingCard(topHafalan, isLoadingHafalan, "Hafalan", "total_hafalan")}
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-emerald-200">
            <CardHeader>
              <CardTitle className="text-emerald-800 flex items-center gap-2">
                <Medal className="h-5 w-5" />
                Top Nilai
              </CardTitle>
            </CardHeader>
            <CardContent>
              {renderRankingCard(topPerformers, isLoadingPerformers, "Nilai", "nilai_rata")}
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-emerald-200">
            <CardHeader>
              <CardTitle className="text-emerald-800 flex items-center gap-2">
                <Target className="h-5 w-5" />
                Top Konsistensi
              </CardTitle>
            </CardHeader>
            <CardContent>
              {renderRankingCard(topRegularity, isLoadingRegularity, "Konsistensi", "total_hafalan")}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Achievements;
