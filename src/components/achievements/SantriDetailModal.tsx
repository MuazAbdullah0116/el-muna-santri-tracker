import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trophy, BookOpen, Star, Calendar, TrendingUp } from "lucide-react";
import { fetchSantriById } from "@/services/supabase/santri.service";
import { fetchSetoranBySantri } from "@/services/supabase/setoran.service";
import { getHafalanScore } from "@/services/quran/quranMapping";

interface SantriDetailModalProps {
  santriId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

const SantriDetailModal = ({ santriId, isOpen, onClose }: SantriDetailModalProps) => {
  const { data: santri, isLoading: isLoadingSantri } = useQuery({
    queryKey: ["santri", santriId],
    queryFn: () => fetchSantriById(santriId!),
    enabled: !!santriId,
  });

  const { data: setorans = [], isLoading: isLoadingSetorans } = useQuery({
    queryKey: ["setorans", santriId],
    queryFn: () => fetchSetoranBySantri(santriId!),
    enabled: !!santriId,
  });

  if (!santriId) return null;

  const calculateStats = () => {
    if (!setorans.length) return { avgScore: 0, totalSetoran: 0, lastSetoran: null };
    
    const totalScore = setorans.reduce((sum, s) => sum + (s.kelancaran + s.tajwid + s.tahsin), 0);
    const avgScore = totalScore / (setorans.length * 3);
    const lastSetoran = setorans.sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime())[0];
    
    return { avgScore, totalSetoran: setorans.length, lastSetoran };
  };

  const stats = calculateStats();
  const hafalanScore = getHafalanScore(santri?.total_hafalan || 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-emerald-50 to-teal-100">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-emerald-800 flex items-center gap-2">
            <Trophy className="h-6 w-6" />
            Detail Prestasi Santri
          </DialogTitle>
        </DialogHeader>

        {isLoadingSantri ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            <span className="ml-2 text-emerald-600">Memuat data santri...</span>
          </div>
        ) : santri ? (
          <div className="space-y-6">
            {/* Info Santri */}
            <Card className="bg-white/80 backdrop-blur-sm border-emerald-200">
              <CardHeader>
                <CardTitle className="text-lg text-emerald-800 flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Informasi Santri
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Nama</p>
                  <p className="font-semibold text-emerald-800">{santri.nama}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Kelas</p>
                  <p className="font-semibold">{santri.kelas}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Jenis Kelamin</p>
                  <Badge variant="secondary">{santri.jenis_kelamin}</Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Hafalan</p>
                  <p className="font-semibold text-emerald-700">
                    {hafalanScore.juz} Juz {hafalanScore.pages} Hal
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Statistik Prestasi */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm opacity-90">Nilai Rata-rata</p>
                      <p className="text-2xl font-bold">{stats.avgScore.toFixed(1)}/10</p>
                    </div>
                    <Star className="h-8 w-8 opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm opacity-90">Total Hafalan</p>
                      <p className="text-2xl font-bold">{santri.total_hafalan || 0}</p>
                      <p className="text-xs opacity-75">Ayat</p>
                    </div>
                    <BookOpen className="h-8 w-8 opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm opacity-90">Total Setoran</p>
                      <p className="text-2xl font-bold">{stats.totalSetoran}</p>
                      <p className="text-xs opacity-75">Kali</p>
                    </div>
                    <TrendingUp className="h-8 w-8 opacity-80" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Riwayat Setoran */}
            <Card className="bg-white/80 backdrop-blur-sm border-emerald-200">
              <CardHeader>
                <CardTitle className="text-lg text-emerald-800 flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Riwayat Setoran Terbaru
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingSetorans ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600"></div>
                    <span className="ml-2 text-emerald-600">Memuat riwayat setoran...</span>
                  </div>
                ) : setorans.length === 0 ? (
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Belum ada riwayat setoran</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Tanggal</TableHead>
                          <TableHead>Surat</TableHead>
                          <TableHead>Juz</TableHead>
                          <TableHead>Ayat</TableHead>
                          <TableHead className="text-center">Kelancaran</TableHead>
                          <TableHead className="text-center">Tajwid</TableHead>
                          <TableHead className="text-center">Tahsin</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {setorans.slice(0, 10).map((setoran) => (
                          <TableRow key={setoran.id}>
                            <TableCell>
                              {new Date(setoran.tanggal).toLocaleDateString("id-ID", {
                                day: 'numeric',
                                month: 'short'
                              })}
                            </TableCell>
                            <TableCell className="font-medium">{setoran.surat}</TableCell>
                            <TableCell>{setoran.juz}</TableCell>
                            <TableCell>
                              <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded text-xs">
                                {setoran.awal_ayat}-{setoran.akhir_ayat}
                              </span>
                            </TableCell>
                            <TableCell className="text-center">
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold">
                                {setoran.kelancaran}
                              </span>
                            </TableCell>
                            <TableCell className="text-center">
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">
                                {setoran.tajwid}
                              </span>
                            </TableCell>
                            <TableCell className="text-center">
                              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-semibold">
                                {setoran.tahsin}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    {setorans.length > 10 && (
                      <div className="text-center mt-4 text-sm text-gray-500">
                        Menampilkan 10 setoran terbaru dari {setorans.length} total setoran
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">Data santri tidak ditemukan</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SantriDetailModal;
