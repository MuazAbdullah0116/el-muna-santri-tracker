
import { Setoran } from "@/types";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const SantriProfileChart = ({ 
  setorans, 
  isLoading 
}: { 
  setorans: Setoran[];
  isLoading?: boolean;
}) => {
  if (isLoading) {
    return (
      <div className="text-muted-foreground text-sm">
        Memuat data grafik...
      </div>
    );
  }

  // Data untuk grafik perkembangan (akumulasi hafalan)
  let progress = 0;
  const graphData = setorans
    .slice() // clone array
    .sort((a, b) => new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime())
    .map((s) => {
      progress += (s.akhir_ayat - s.awal_ayat + 1);
      return { tanggal: s.tanggal, total: progress };
    });

  if (!graphData.length) {
    return (
      <div className="text-muted-foreground text-sm">
        Belum ada data untuk menampilkan grafik perkembangan hafalan.
      </div>
    );
  }

  return (
    <div>
      <div className="font-semibold mb-2">Grafik Perkembangan Hafalan</div>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={graphData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="tanggal" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Line type="monotone" dataKey="total" stroke="#16a34a" dot />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SantriProfileChart;
