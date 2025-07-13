
import { Santri, Setoran } from "@/types";
import { Award, TrendingUp, BookOpen, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SantriProfileAchievement = ({
  santri,
  setorans,
}: {
  santri: Santri;
  setorans: Setoran[];
}) => {
  // Calculate actual total hafalan from all setoran data (including archived)
  const actualTotalHafalan = setorans.reduce((total, setoran) => {
    return total + (setoran.akhir_ayat - setoran.awal_ayat + 1);
  }, 0);

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
    <Card className="bg-card/70 backdrop-blur-sm border-border">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-card-foreground flex items-center gap-2">
          <Award className="w-5 h-5" />
          Prestasi Santri
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-emerald-50 dark:bg-emerald-950/50 p-3 rounded-lg text-center">
            <BookOpen className="w-6 h-6 text-emerald-600 dark:text-emerald-400 mx-auto mb-1" />
            <div className="text-2xl font-bold text-emerald-800 dark:text-emerald-200">
              {actualTotalHafalan}
            </div>
            <div className="text-xs text-emerald-600 dark:text-emerald-400">Total Ayat</div>
          </div>
          
          <div className="bg-teal-50 dark:bg-teal-950/50 p-3 rounded-lg text-center">
            <TrendingUp className="w-6 h-6 text-teal-600 dark:text-teal-400 mx-auto mb-1" />
            <div className="text-2xl font-bold text-teal-800 dark:text-teal-200">{totalSetoran}</div>
            <div className="text-xs text-teal-600 dark:text-teal-400">Total Setoran</div>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-muted-foreground">Kelancaran</span>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="font-bold text-emerald-600 dark:text-emerald-400">{nilaiRataKelancaran}</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-muted-foreground">Tajwid</span>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="font-bold text-emerald-600 dark:text-emerald-400">{nilaiRataTajwid}</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-muted-foreground">Tahsin</span>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="font-bold text-emerald-600 dark:text-emerald-400">{nilaiRataTahsin}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SantriProfileAchievement;
