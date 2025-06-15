
import { Setoran } from "@/types";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, BookOpen } from "lucide-react";

const SantriProfileChart = ({ 
  setorans, 
  isLoading 
}: { 
  setorans: Setoran[];
  isLoading?: boolean;
}) => {
  if (isLoading) {
    return (
      <Card className="bg-white/70 backdrop-blur-sm border-emerald-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            <span className="ml-2 text-emerald-600">Memuat data grafik...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Data untuk grafik perkembangan (akumulasi hafalan)
  let progress = 0;
  const graphData = setorans
    .slice() // clone array
    .sort((a, b) => new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime())
    .map((s, index) => {
      progress += (s.akhir_ayat - s.awal_ayat + 1);
      return { 
        tanggal: new Date(s.tanggal).toLocaleDateString("id-ID", { 
          month: 'short', 
          day: 'numeric' 
        }), 
        total: progress,
        surat: s.surat,
        ayat: `${s.awal_ayat}-${s.akhir_ayat}`
      };
    });

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-emerald-200">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-emerald-800 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Grafik Perkembangan Hafalan
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!graphData.length ? (
          <div className="text-center py-8">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 font-medium">Belum ada data setoran</p>
            <p className="text-sm text-gray-500">Grafik akan muncul setelah ada setoran pertama</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={graphData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="tanggal" 
                tick={{ fontSize: 12, fill: '#6b7280' }}
                stroke="#6b7280"
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#6b7280' }}
                stroke="#6b7280"
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#f9fafb',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px'
                }}
                formatter={(value, name) => [value + ' ayat', 'Total Hafalan']}
                labelFormatter={(label) => `Tanggal: ${label}`}
              />
              <Line 
                type="monotone" 
                dataKey="total" 
                stroke="#059669" 
                strokeWidth={3}
                dot={{ fill: '#059669', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#059669', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default SantriProfileChart;
