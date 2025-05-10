
import { useState } from "react";
import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Santri } from "@/types";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";

interface SantriDetailProps {
  selectedSantri: Santri | null;
  studentSetoran: any[];
  onClose: () => void;
  onDelete: () => void;
  showDeleteDialog: boolean;
  setShowDeleteDialog: (show: boolean) => void;
}

const SantriDetail = ({ 
  selectedSantri, 
  studentSetoran, 
  onClose, 
  onDelete, 
  showDeleteDialog, 
  setShowDeleteDialog 
}: SantriDetailProps) => {
  const navigate = useNavigate();

  const handleAddSetoran = () => {
    if (selectedSantri) {
      navigate(`/add-setoran/${selectedSantri.id}`);
    }
  };

  return (
    <>
      <Dialog open={!!selectedSantri && !showDeleteDialog} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Detail Santri</DialogTitle>
            <DialogDescription>
              Informasi dan riwayat setoran santri
            </DialogDescription>
          </DialogHeader>
          
          {selectedSantri && (
            <>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-medium">{selectedSantri.nama}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm bg-muted text-muted-foreground rounded-full px-2 py-0.5">
                        Kelas {selectedSantri.kelas}
                      </span>
                      <span className="text-sm bg-muted text-muted-foreground rounded-full px-2 py-0.5">
                        {selectedSantri.jenis_kelamin}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => setShowDeleteDialog(true)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Total Hafalan</h4>
                  <span className="text-xl font-bold text-islamic-primary">
                    {selectedSantri.total_hafalan} Setoran
                  </span>
                </div>
                
                <Button onClick={handleAddSetoran} className="w-full">
                  <Plus className="mr-2 h-4 w-4" /> Tambah Setoran
                </Button>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Riwayat Setoran</h4>
                  {studentSetoran.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Belum ada setoran
                    </p>
                  ) : (
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {studentSetoran.map((setoran) => (
                        <div key={setoran.id} className="border rounded-md p-3 text-sm">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{setoran.surat}</span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(setoran.tanggal).toLocaleDateString("id-ID")}
                            </span>
                          </div>
                          <div className="mt-1 text-xs">
                            Ayat {setoran.awal_ayat} - {setoran.akhir_ayat}
                          </div>
                          <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                            <div>
                              <span className="text-muted-foreground">Kelancaran:</span>{" "}
                              <span className="font-medium">{setoran.kelancaran}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Tajwid:</span>{" "}
                              <span className="font-medium">{setoran.tajwid}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Tahsin:</span>{" "}
                              <span className="font-medium">{setoran.tahsin}</span>
                            </div>
                          </div>
                          {setoran.catatan && (
                            <div className="mt-1 text-xs text-muted-foreground">
                              {setoran.catatan}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus santri{" "}
              <span className="font-medium">{selectedSantri?.nama}</span>?
              Semua data setoran juga akan dihapus.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDeleteDialog(false)}>
              Batal
            </AlertDialogCancel>
            <AlertDialogAction onClick={onDelete}>
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default SantriDetail;
