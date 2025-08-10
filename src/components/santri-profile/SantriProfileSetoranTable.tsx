
import { Setoran } from "@/types";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, BookOpen, Archive, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteSetoran } from "@/services/supabase/setoran.service";
import { toast } from "sonner";

const SantriProfileSetoranTable = ({ 
  setorans, 
  isLoading,
  santriId
}: { 
  setorans: Setoran[];
  isLoading?: boolean;
  santriId?: string;
}) => {
  const queryClient = useQueryClient();

  const deleteSetoranMutation = useMutation({
    mutationFn: deleteSetoran,
    onSuccess: () => {
      toast.success("Setoran berhasil dihapus!");
      queryClient.invalidateQueries({ queryKey: ["setoran"] });
      queryClient.invalidateQueries({ queryKey: ["santris"] });
      if (santriId) {
        queryClient.invalidateQueries({ queryKey: ["setoran", santriId] });
      }
    },
    onError: (error) => {
      console.error("Error deleting setoran:", error);
      toast.error("Gagal menghapus setoran. Silakan coba lagi.");
    },
  });

  if (isLoading) {
    return (
      <Card className="bg-card/70 backdrop-blur-sm border-border">
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            <span className="ml-2 text-emerald-600">Memuat data setoran...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Separate current and archived data for display
  const recentSetorans = setorans.slice(0, 15);
  const hasArchivedData = setorans.some(s => !s.id.startsWith('uuid')); // Simple check for archived data

  return (
    <Card className="bg-card/70 backdrop-blur-sm border-border">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-card-foreground flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Riwayat Setoran
          {hasArchivedData && (
            <Badge variant="secondary" className="ml-2">
              <Archive className="w-3 h-3 mr-1" />
              Termasuk Data Arsip
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!setorans.length ? (
          <div className="text-center py-8">
            <BookOpen className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-muted-foreground font-medium">Belum ada riwayat setoran</p>
            <p className="text-sm text-muted-foreground">Data setoran akan muncul di sini setelah santri melakukan setoran</p>
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
                  <TableHead className="font-semibold text-center">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentSetorans.map((s, index) => (
                  <TableRow key={s.id || index} className="hover:bg-muted/50">
                    <TableCell className="font-medium">
                      <span className="bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200 px-2 py-1 rounded text-sm">
                        {new Date(s.tanggal).toLocaleDateString("id-ID", {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium">
                      <span className="bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200 px-2 py-1 rounded text-sm">
                        {s.surat}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200 px-2 py-1 rounded text-sm">
                        {s.juz}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200 px-2 py-1 rounded text-sm">
                        {s.awal_ayat}-{s.akhir_ayat}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 px-2 py-1 rounded font-semibold">
                        {s.kelancaran}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200 px-2 py-1 rounded font-semibold">
                        {s.tajwid}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200 px-2 py-1 rounded font-semibold">
                        {s.tahsin}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm">
                      <span className="bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200 px-2 py-1 rounded text-sm">
                        {s.diuji_oleh}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Hapus Setoran</AlertDialogTitle>
                            <AlertDialogDescription>
                              Apakah Anda yakin ingin menghapus setoran {s.surat} Juz {s.juz} ayat {s.awal_ayat}-{s.akhir_ayat} tanggal {new Date(s.tanggal).toLocaleDateString("id-ID")}? 
                              Tindakan ini tidak dapat dibatalkan.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteSetoranMutation.mutate(s.id)}
                              className="bg-red-600 hover:bg-red-700"
                              disabled={deleteSetoranMutation.isPending}
                            >
                              {deleteSetoranMutation.isPending ? "Menghapus..." : "Hapus"}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {setorans.length > 15 && (
              <div className="text-center mt-4 text-sm text-muted-foreground">
                Menampilkan 15 setoran terbaru dari {setorans.length} total setoran
                {hasArchivedData && (
                  <div className="mt-1 flex items-center justify-center gap-1">
                    <Archive className="w-3 h-3" />
                    <span className="text-xs">Data termasuk riwayat dari Google Sheets</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SantriProfileSetoranTable;
