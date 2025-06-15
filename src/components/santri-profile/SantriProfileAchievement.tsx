
import { Santri, Setoran } from "@/types";
import { Award, TrendingUp, BarChart3, Star, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SantriProfileAchievement = ({
  santri,
  setorans,
}: {
  santri: Santri;
  setorans: Setoran[];
}) => {
  const totalHafalan = santri.total_hafalan || 0;
  const totalSetoran = setorans.length;
  const nilaiRataKelancaran = setorans.length > 0
    ? (setorans.reduce((sum, s) => sum + s.kelancaran, 0) / setorans.length).toFixed(1)
    : "0";
  const nilaiRataTajwid = setorans.length > 0
    ? (setorans.reduce((sum, s) => sum + s.tajwid, 0) / setorans.length).toFixed(1)
    : "0";
  const nilaiRataTahsin = setorans.length > 0
    ? (setorans.reduce((sum, s) => sum + s.tahsin, 0) / setorans.length).toFixed(1)
    : "0";

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-emerald-200">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-emerald-800 flex items-center gap-2">
          <Award className="w-5 h-5" />
          Prestasi Santri
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-emerald-50 p-3 rounded-lg text-center">
            <BookOpen className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
            <div className="text-2xl font-bold text-emerald-800">{totalHafalan}</div>
            <div className="text-xs text-emerald-600">Total Ayat</div>
          </div>
          
          <div className="bg-teal-50 p-3 rounded-lg text-center">
            <TrendingUp className="w-6 h-6 text-teal-600 mx-auto mb-1" />
            <div className="text-2xl font-bold text-teal-800">{totalSetoran}</div>
            <div className="text-xs text-teal-600">Total Setoran</div>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Kelancaran</span>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="font-bold text-emerald-600">{nilaiRataKelancaran}</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Tajwid</span>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="font-bold text-emerald-600">{nilaiRataTajwid}</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Tahsin</span>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="font-bold text-emerald-600">{nilaiRataTahsin}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SantriProfileAchievement;
