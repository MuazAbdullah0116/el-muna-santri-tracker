
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Medal, Crown, Star } from "lucide-react";

interface TopPerformersCardProps {
  data: any[];
  isLoading: boolean;
  searchQuery: string;
}

const TopPerformersCard = ({ data, isLoading, searchQuery }: TopPerformersCardProps) => {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Medal className="h-5 w-5 text-amber-600" />;
      default:
        return <Star className="h-5 w-5 text-emerald-600" />;
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
        return "bg-gradient-to-r from-blue-400 to-blue-600";
    }
  };

  const filteredData = searchQuery 
    ? data.filter(item => item.nama?.toLowerCase().includes(searchQuery.toLowerCase()))
    : data;

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse bg-gray-200 h-16 rounded-lg"></div>
        ))}
      </div>
    );
  }

  if (filteredData.length === 0) {
    return (
      <div className="text-center py-8">
        <Star className="h-12 w-12 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-500">
          {searchQuery ? `Tidak ada santri yang cocok dengan "${searchQuery}"` : "Belum ada data nilai"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredData.slice(0, 10).map((item, index) => {
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
                  <div className="text-sm opacity-90">
                    {item.nilai_rata?.toFixed(1) || 0}/10
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default TopPerformersCard;
