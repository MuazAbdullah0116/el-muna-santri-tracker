
import { useState } from "react";
import { Trash, Edit, User, Calendar, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Santri } from "@/types";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { sheetdbFetch, SHEETDB_CONFIG } from "@/services/sheetdb/client";
import { getFormattedHafalanProgress } from "@/services/sheetdb/setoran.service";

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
      await sheetdbFetch(`${SHEETDB_CONFIG.SANTRI_API_URL}/id/${selectedSantri.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          data: {
            nama: editForm.nama.trim(),
            kelas: editForm.kelas,
            jenis_kelamin: editForm.jenis_kelamin
          }
        }),
      });
      
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
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-xl">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-islamic-primary to-islamic-secondary flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              Detail Santri
            </DialogTitle>
            <DialogDescription>
              Informasi lengkap dan riwayat setoran santri
            </DialogDescription>
          </DialogHeader>
          
          {selectedSantri && (
            <>
              <div className="space-y-6">
                {/* Santri Info Card */}
                <div className="bg-gradient-to-br from-islamic-light/20 to-islamic-primary/5 rounded-2xl p-6 border border-islamic-primary/20">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-islamic-primary to-islamic-secondary flex items-center justify-center shadow-lg">
                        <User className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-800">{selectedSantri.nama}</h3>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-islamic-primary/10 text-islamic-primary border border-islamic-primary/20">
                            Kelas {selectedSantri.kelas}
                          </span>
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-islamic-secondary/10 text-islamic-secondary border border-islamic-secondary/20">
                            {selectedSantri.jenis_kelamin}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handleEditClick}
                        className="hover:bg-islamic-primary hover:text-white"
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
                  
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-islamic-primary" />
                        <span className="font-semibold text-gray-700">Total Hafalan</span>
                      </div>
                      <span className="text-2xl font-bold text-islamic-primary">
                        {getFormattedHafalanProgress(selectedSantri.total_hafalan || 0)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <Button onClick={handleAddSetoran} className="w-full py-3 bg-gradient-to-r from-islamic-primary to-islamic-secondary hover:from-islamic-primary/90 hover:to-islamic-secondary/90 rounded-xl shadow-lg">
                  <Plus className="mr-2 h-5 w-5" /> Tambah Setoran
                </Button>
                
                {/* Setoran History */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-islamic-primary" />
                    <h4 className="text-lg font-semibold text-gray-800">Riwayat Setoran</h4>
                  </div>
                  
                  {studentSetoran.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-xl">
                      <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600 font-medium">Belum ada setoran</p>
                      <p className="text-sm text-gray-500">Mulai dengan menambahkan setoran pertama</p>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-80 overflow-y-auto">
                      {studentSetoran.map((setoran) => (
                        <div key={setoran.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-center mb-3">
                            <span className="font-semibold text-islamic-primary text-lg">{setoran.surat}</span>
                            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">
                              {new Date(setoran.tanggal).toLocaleDateString("id-ID", {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                              })}
                            </span>
                          </div>
                          
                          <div className="mb-3">
                            <span className="text-sm font-medium text-gray-700 bg-islamic-light/30 px-2 py-1 rounded-lg">
                              Ayat {setoran.awal_ayat} - {setoran.akhir_ayat}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-3 mb-3">
                            <div className="text-center">
                              <div className="text-xs text-gray-500 mb-1">Kelancaran</div>
                              <div className="font-semibold text-islamic-primary bg-islamic-primary/10 px-2 py-1 rounded-lg">
                                {setoran.kelancaran}
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-xs text-gray-500 mb-1">Tajwid</div>
                              <div className="font-semibold text-islamic-secondary bg-islamic-secondary/10 px-2 py-1 rounded-lg">
                                {setoran.tajwid}
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-xs text-gray-500 mb-1">Tahsin</div>
                              <div className="font-semibold text-islamic-accent bg-islamic-accent/10 px-2 py-1 rounded-lg">
                                {setoran.tahsin}
                              </div>
                            </div>
                          </div>
                          
                          {setoran.catatan && (
                            <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                              <div className="text-xs text-gray-500 mb-1">Catatan:</div>
                              <div className="text-sm text-gray-700">{setoran.catatan}</div>
                            </div>
                          )}
                          
                          <div className="flex justify-end">
                            <span className="text-xs text-gray-500">
                              Penguji: <span className="font-medium text-islamic-primary">{setoran.diuji_oleh}</span>
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
            <DialogTitle className="flex items-center gap-2">
              <Edit className="w-5 h-5 text-islamic-primary" />
              Edit Data Santri
            </DialogTitle>
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
                className="rounded-xl"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-class">Kelas</Label>
              <Select 
                value={editForm.kelas.toString()} 
                onValueChange={(value) => setEditForm({...editForm, kelas: parseInt(value)})}
              >
                <SelectTrigger id="edit-class" className="rounded-xl">
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
                <SelectTrigger id="edit-gender" className="rounded-xl">
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
            <Button variant="outline" onClick={() => setIsEditing(false)} className="rounded-xl">
              Batal
            </Button>
            <Button onClick={handleUpdateSantri} className="rounded-xl bg-gradient-to-r from-islamic-primary to-islamic-secondary">
              Simpan Perubahan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Trash className="w-5 h-5 text-red-500" />
              Konfirmasi Hapus
            </AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus santri{" "}
              <span className="font-medium text-islamic-primary">{selectedSantri?.nama}</span>?
              <br />
              <span className="text-red-600 font-medium">Semua data setoran juga akan dihapus dan tidak dapat dikembalikan.</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDeleteDialog(false)} className="rounded-xl">
              Batal
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={onDelete}
              className="bg-red-500 hover:bg-red-600 rounded-xl"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default SantriDetail;
