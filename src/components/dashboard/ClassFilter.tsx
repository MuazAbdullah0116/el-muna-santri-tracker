
import { useState } from "react";
import { ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/services/supabase/client";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";

interface ClassFilterProps {
  selectedClass: number | null;
  onClassSelect: (kelas: number) => void;
  classes: number[];
  refreshData: () => Promise<void>;
}

const ClassFilter = ({ selectedClass, onClassSelect, classes, refreshData }: ClassFilterProps) => {
  const [promoteDialogOpen, setPromoteDialogOpen] = useState(false);
  const [classToPromote, setClassToPromote] = useState<number | null>(null);
  const [isPromoting, setIsPromoting] = useState(false);
  const { toast } = useToast();

  const handleClassClick = (kelas: number) => {
    onClassSelect(kelas);
  };

  const handleLongPress = (kelas: number) => {
    setClassToPromote(kelas);
    setPromoteDialogOpen(true);
  };

  const handlePromoteClass = async () => {
    if (!classToPromote) return;
    
    const newClass = classToPromote + 1;
    if (newClass > 12) {
      toast({
        title: "Peringatan",
        description: "Kelas tidak dapat dinaikkan melebihi kelas 12",
        variant: "destructive",
      });
      setPromoteDialogOpen(false);
      return;
    }
    
    setIsPromoting(true);
    
    try {
      const { error } = await supabase
        .from('santri')
        .update({ kelas: newClass })
        .eq('kelas', classToPromote);
      
      if (error) throw error;
      
      toast({
        title: "Berhasil",
        description: `Semua santri kelas ${classToPromote} telah dinaikkan ke kelas ${newClass}`,
      });
      
      await refreshData();
    } catch (error) {
      console.error("Error promoting class:", error);
      toast({
        title: "Error",
        description: "Gagal menaikkan kelas santri",
        variant: "destructive",
      });
    } finally {
      setIsPromoting(false);
      setPromoteDialogOpen(false);
    }
  };

  return (
    <>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {classes.map((kelas) => (
          <button
            key={kelas}
            onClick={() => handleClassClick(kelas)}
            onContextMenu={(e) => {
              e.preventDefault();
              handleLongPress(kelas);
            }}
            onTouchStart={() => {
              const longPressTimer = setTimeout(() => {
                handleLongPress(kelas);
              }, 800);
              return () => clearTimeout(longPressTimer);
            }}
            className={`islamic-bubble aspect-square relative ${
              selectedClass === kelas ? "bg-accent text-accent-foreground" : ""
            }`}
          >
            <span className="text-lg font-medium">Kelas {kelas}</span>
          </button>
        ))}
      </div>

      <Dialog open={promoteDialogOpen} onOpenChange={setPromoteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Naikkan Kelas</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menaikkan seluruh santri kelas {classToPromote} ke kelas {classToPromote ? classToPromote + 1 : ""}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setPromoteDialogOpen(false)}
            >
              Batal
            </Button>
            <Button 
              onClick={handlePromoteClass} 
              disabled={isPromoting}
              className="flex items-center gap-2"
            >
              <ChevronUp className="h-4 w-4" />
              {isPromoting ? "Memproses..." : "Naikkan Kelas"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ClassFilter;
