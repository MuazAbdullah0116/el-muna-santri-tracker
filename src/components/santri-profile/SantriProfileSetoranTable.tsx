
import { Setoran } from "@/types";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, BookOpen } from "lucide-react";

const SantriProfileSetoranTable = ({ 
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
            <span className="ml-2 text-emerald-600">Memuat data setoran...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-emerald-200">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-emerald-800 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Riwayat Setoran Terbaru
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!setorans.length ? (
          <div className="text-center py-8">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 font-medium">Belum ada riwayat setoran</p>
            <p className="text-sm text-gray-500">Data setoran akan muncul di sini setelah santri melakukan setoran</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold">Tanggal</TableHead>
                  <TableHead className="font-semibold">Surat</TableHead>
                  <TableHead className="font-semibold">Juz</TableHead>
                  <TableHead className="font-semibold">Ayat</TableHead>
                  <TableHead className="font-semibold text-center">Kelancaran</TableHead>
                  <TableHead className="font-semibold text-center">Tajwid</TableHead>
                  <TableHead className="font-semibold text-center">Tahsin</TableHead>
                  <TableHead className="font-semibold">Penguji</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {setorans.slice(0, 15).map((s) => (
                  <TableRow key={s.id} className="hover:bg-emerald-50/50">
                    <TableCell className="font-medium">
                      {new Date(s.tanggal).toLocaleDateString("id-ID", {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </TableCell>
                    <TableCell className="font-medium text-emerald-700">{s.surat}</TableCell>
                    <TableCell>{s.juz}</TableCell>
                    <TableCell>
                      <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded text-sm">
                        {s.awal_ayat}-{s.akhir_ayat}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded font-semibold">
                        {s.kelancaran}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded font-semibold">
                        {s.tajwid}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded font-semibold">
                        {s.tahsin}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">{s.diuji_oleh}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {setorans.length > 15 && (
              <div className="text-center mt-4 text-sm text-gray-500">
                Menampilkan 15 setoran terbaru dari {setorans.length} total setoran
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SantriProfileSetoranTable;
