
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Medal, Crown, Star } from "lucide-react";

interface TopPerformersCardProps {
  data: any[];
  isLoading: boolean;
  searchQuery: string;
  onSantriClick?: (santriId: string) => void;
}

const TopPerformersCard = ({ data, isLoading, searchQuery, onSantriClick }: TopPerformersCardProps) => {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-600" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-500" />;
      case 3:
        return <Medal className="h-5 w-5 text-amber-700" />;
      default:
        return <Star className="h-5 w-5 text-blue-700" />;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700";
      case 2:
        return "bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600";
      case 3:
        return "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700";
      default:
        return "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700";
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
      {filteredData.map((item, index) => {
        const rank = index + 1;
        return (
          <Card 
            key={item.id} 
            className={`${getRankColor(rank)} text-white border-none ${onSantriClick ? 'cursor-pointer transition-all duration-200' : ''}`}
            onClick={() => onSantriClick?.(item.id)}
          >
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                  <div className="flex-shrink-0">
                    {getRankIcon(rank)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-sm sm:text-base truncate">{item.nama}</h3>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs sm:text-sm opacity-90">
                      <span className="whitespace-nowrap">Kelas {item.kelas}</span>
                      <Badge variant="secondary" className="text-[10px] sm:text-xs bg-white/20 text-white border-white/30 w-fit">
                        {item.jenis_kelamin}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-sm sm:text-lg font-bold">#{rank}</div>
                  <div className="text-xs sm:text-sm opacity-90">
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
