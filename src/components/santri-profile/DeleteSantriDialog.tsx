
import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Santri } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface DeleteSantriDialogProps {
  santri: Santri;
}

const DeleteSantriDialog = ({ santri }: DeleteSantriDialogProps) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const deleteMutation = useMutation({
    mutationFn: async () => {
      // First delete all setoran records for this santri
      const { error: setoranError } = await supabase
        .from('setoran')
        .delete()
        .eq('santri_id', santri.id);
      
      if (setoranError) throw setoranError;

      // Then delete the santri record
      const { error: santriError } = await supabase
        .from('santri')
        .delete()
        .eq('id', santri.id);
      
      if (santriError) throw santriError;
    },
    onSuccess: () => {
      toast.success("Santri berhasil dihapus");
      navigate("/dashboard");
    },
    onError: (error) => {
      console.error("Error deleting santri:", error);
      toast.error("Gagal menghapus santri");
    }
  });

  const handleDelete = () => {
    deleteMutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm" className="gap-2">
          <Trash2 className="w-4 h-4" />
          Hapus Santri
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Hapus Santri</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Apakah Anda yakin ingin menghapus santri <strong>{santri.nama}</strong>? 
            Semua data setoran yang terkait juga akan dihapus dan tidak dapat dikembalikan.
          </p>
          
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Batal
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Menghapus..." : "Hapus"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteSantriDialog;
