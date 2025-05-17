
import { useState } from "react";
import { Trash, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Santri } from "@/types";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/services/supabase/client";
import { getFormattedHafalanProgress } from "@/services/supabase/setoran.service";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SantriDetailProps {
  selectedSantri: Santri | null;
  studentSetoran: any[];
  onClose: () => void;
  onDelete: () => void;
  showDeleteDialog: boolean;
  setShowDeleteDialog: (show: boolean) => void;
  refreshData: () => Promise<void>;
}

const SantriDetail = ({ 
  selectedSantri, 
  studentSetoran, 
  onClose, 
  onDelete, 
  showDeleteDialog, 
  setShowDeleteDialog,
  refreshData
}: SantriDetailProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    nama: "",
    kelas: 0,
    jenis_kelamin: ""
  });

  // Classes from 7 to 12
  const classes = [7, 8, 9, 10, 11, 12];

  const handleAddSetoran = () => {
    if (selectedSantri) {
      navigate(`/add-setoran/${selectedSantri.id}`);
    }
  };

  const handleEditClick = () => {
    if (selectedSantri) {
      setEditForm({
        nama: selectedSantri.nama,
        kelas: selectedSantri.kelas,
        jenis_kelamin: selectedSantri.jenis_kelamin
      });
      setIsEditing(true);
    }
  };

  const handleUpdateSantri = async () => {
    if (!selectedSantri) return;
    
    try {
      const { error } = await supabase
        .from('santri')
        .update({
          nama: editForm.nama.trim(),
          kelas: editForm.kelas,
          jenis_kelamin: editForm.jenis_kelamin
        })
        .eq('id', selectedSantri.id);
      
      if (error) throw error;
      
      toast({
        title: "Berhasil",
        description: "Data santri berhasil diperbarui",
      });
      
      setIsEditing(false);
      await refreshData();
    } catch (error) {
      console.error("Error updating santri:", error);
      toast({
        title: "Error",
        description: "Gagal memperbarui data santri",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Dialog open={!!selectedSantri && !showDeleteDialog && !isEditing} onOpenChange={onClose}>
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
                <div className="flex justify-between items-start">
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
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleEditClick}
                      title="Edit Data"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => setShowDeleteDialog(true)}
                      title="Hapus Santri"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Total Hafalan</h4>
                  <span className="text-xl font-bold text-islamic-primary">
                    {getFormattedHafalanProgress(selectedSantri.total_hafalan || 0)}
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
                          <div className="mt-2 text-xs flex justify-end">
                            <span className="text-muted-foreground">
                              Penguji: <span className="font-medium">{setoran.diuji_oleh}</span>
                            </span>
                          </div>
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
      
      {/* Edit Dialog */}
      <Dialog open={isEditing} onOpenChange={(open) => !open && setIsEditing(false)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Data Santri</DialogTitle>
            <DialogDescription>
              Ubah data santri di bawah ini
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nama Santri</Label>
              <Input
                id="edit-name"
                value={editForm.nama}
                onChange={(e) => setEditForm({...editForm, nama: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-class">Kelas</Label>
              <Select 
                value={editForm.kelas.toString()} 
                onValueChange={(value) => setEditForm({...editForm, kelas: parseInt(value)})}
              >
                <SelectTrigger id="edit-class">
                  <SelectValue placeholder="Pilih Kelas" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((kelas) => (
                    <SelectItem key={kelas} value={kelas.toString()}>
                      Kelas {kelas}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-gender">Jenis Kelamin</Label>
              <Select 
                value={editForm.jenis_kelamin} 
                onValueChange={(value) => setEditForm({...editForm, jenis_kelamin: value})}
              >
                <SelectTrigger id="edit-gender">
                  <SelectValue placeholder="Pilih Jenis Kelamin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ikhwan">Ikhwan</SelectItem>
                  <SelectItem value="Akhwat">Akhwat</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Batal
            </Button>
            <Button onClick={handleUpdateSantri}>
              Simpan Perubahan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
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
