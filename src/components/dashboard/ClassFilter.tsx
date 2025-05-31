
import { useState } from "react";
import { ChevronUp, GraduationCap } from "lucide-react";
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
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-islamic-primary to-islamic-secondary flex items-center justify-center shadow-lg">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Filter Kelas</h2>
            <p className="text-sm text-muted-foreground">Tekan lama untuk naikkan kelas</p>
          </div>
        </div>
        
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {classes.map((kelas) => (
            <button
              key={kelas}
              onClick={() => handleClassClick(kelas)}
              onContextMenu={(e) => {
                e.preventDefault();
                handleLongPress(kelas);
              }}
              onTouchStart={(e) => {
                let touchTimer: NodeJS.Timeout;
                const startTouch = () => {
                  touchTimer = setTimeout(() => {
                    handleLongPress(kelas);
                  }, 800);
                };
                
                const endTouch = () => {
                  clearTimeout(touchTimer);
                };
                
                startTouch();
                
                e.currentTarget.addEventListener('touchend', endTouch, { once: true });
                e.currentTarget.addEventListener('touchcancel', endTouch, { once: true });
              }}
              className={`group relative overflow-hidden rounded-2xl aspect-square flex items-center justify-center transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                selectedClass === kelas 
                  ? "bg-gradient-to-br from-islamic-primary to-islamic-secondary text-white shadow-lg" 
                  : "bg-card border-2 border-border text-foreground hover:border-islamic-primary/40"
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative text-center">
                <div className="text-sm font-medium mb-1">Kelas</div>
                <div className="text-2xl font-bold">{kelas}</div>
              </div>
              
              {selectedClass === kelas && (
                <div className="absolute inset-0 border-2 border-white/30 rounded-2xl" />
              )}
            </button>
          ))}
        </div>
      </div>

      <Dialog open={promoteDialogOpen} onOpenChange={setPromoteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground">
              <ChevronUp className="w-5 h-5 text-islamic-primary" />
              Naikkan Kelas
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Apakah Anda yakin ingin menaikkan seluruh santri kelas {classToPromote} ke kelas {classToPromote ? classToPromote + 1 : ""}?
              <br />
              <span className="text-destructive font-medium">Tindakan ini tidak dapat dibatalkan.</span>
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
              className="bg-gradient-to-r from-islamic-primary to-islamic-secondary hover:from-islamic-primary/90 hover:to-islamic-secondary/90"
            >
              <ChevronUp className="h-4 w-4 mr-2" />
              {isPromoting ? "Memproses..." : "Naikkan Kelas"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ClassFilter;
