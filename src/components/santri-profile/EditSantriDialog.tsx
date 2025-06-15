
import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit } from "lucide-react";
import { Santri } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface EditSantriDialogProps {
  santri: Santri;
}

const EditSantriDialog = ({ santri }: EditSantriDialogProps) => {
  const [open, setOpen] = useState(false);
  const [nama, setNama] = useState(santri.nama);
  const [kelas, setKelas] = useState(santri.kelas.toString());
  const [jenisKelamin, setJenisKelamin] = useState(santri.jenis_kelamin);
  
  const queryClient = useQueryClient();

  const editMutation = useMutation({
    mutationFn: async (data: { nama: string; kelas: number; jenis_kelamin: "Ikhwan" | "Akhwat" }) => {
      const { error } = await supabase
        .from('santri')
        .update(data)
        .eq('id', santri.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["santri", santri.id] });
      toast.success("Profil santri berhasil diperbarui");
      setOpen(false);
    },
    onError: (error) => {
      console.error("Error updating santri:", error);
      toast.error("Gagal memperbarui profil santri");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    editMutation.mutate({
      nama,
      kelas: parseInt(kelas),
      jenis_kelamin: jenisKelamin as "Ikhwan" | "Akhwat"
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 h-8 sm:h-9">
          <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">Edit Profil</span>
          <span className="sm:hidden">Edit</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Profil Santri</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nama">Nama</Label>
            <Input
              id="nama"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Nama santri"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="kelas">Kelas</Label>
            <Select value={kelas} onValueChange={setKelas}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih kelas" />
              </SelectTrigger>
              <SelectContent>
                {[7, 8, 9, 10, 11, 12].map((kelasNum) => (
                  <SelectItem key={kelasNum} value={kelasNum.toString()}>
                    Kelas {kelasNum}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="jenis_kelamin">Jenis Kelamin</Label>
            <Select value={jenisKelamin} onValueChange={(value) => setJenisKelamin(value as "Ikhwan" | "Akhwat")}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih jenis kelamin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Ikhwan">Ikhwan</SelectItem>
                <SelectItem value="Akhwat">Akhwat</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Batal
            </Button>
            <Button type="submit" disabled={editMutation.isPending}>
              {editMutation.isPending ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditSantriDialog;
