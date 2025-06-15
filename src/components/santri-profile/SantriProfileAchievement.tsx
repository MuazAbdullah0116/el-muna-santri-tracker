
import { Santri, Setoran } from "@/types";
import { Award, TrendingUp } from "lucide-react";

const SantriProfileAchievement = ({
  santri,
  setorans,
}: {
  santri: Santri;
  setorans: Setoran[];
}) => {
  // Rangkum beberapa data prestasi sederhana
  const totalHafalan = santri.total_hafalan || 0;
  const totalSetoran = setorans.length;
  const nilaiRata =
    setorans.length > 0
      ? (
          setorans.reduce((sum, s) => sum + (s.kelancaran + s.tajwid + s.tahsin) / 3, 0) /
          setorans.length
        ).toFixed(2)
      : "-";
  return (
    <div className="flex flex-wrap gap-4">
      <div className="flex items-center gap-2">
        <Award className="text-islamic-gold w-5 h-5" />
        <span className="font-semibold">Total Hafalan:</span>
        <span>{totalHafalan}</span>
      </div>
      <div className="flex items-center gap-2">
        <TrendingUp className="text-islamic-secondary w-5 h-5" />
        <span className="font-semibold">Total Setoran:</span>
        <span>{totalSetoran}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-semibold">Nilai Rata-rata:</span>
        <span>{nilaiRata}</span>
      </div>
    </div>
  );
};

export default SantriProfileAchievement;
