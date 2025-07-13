
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
  onClassSelect: (kelas: number | "all") => void;
  classes: number[];
  refreshData: () => Promise<void>;
  showPromotionHint?: boolean;
}

const ClassFilter = ({ selectedClass, onClassSelect, classes, refreshData, showPromotionHint = true }: ClassFilterProps) => {
  const [promoteDialogOpen, setPromoteDialogOpen] = useState(false);
  const [classToPromote, setClassToPromote] = useState<number | null>(null);
  const [isPromoting, setIsPromoting] = useState(false);
  const { toast } = useToast();

  const handleClassClick = (kelas: number) => {
    onClassSelect(kelas);
  };

  const handleAllClassClick = () => {
    onClassSelect("all");
  };

  const handleLongPress = (kelas: number) => {
    if (!showPromotionHint) return;
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
      <div>
        <div className="flex items-center gap-3 mb-4 md:mb-6">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-gradient-to-br from-islamic-primary to-islamic-secondary flex items-center justify-center shadow-lg">
            <GraduationCap className="w-4 h-4 md:w-5 md:h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-bold text-foreground">Filter Kelas</h2>
            {showPromotionHint && (
              <p className="text-xs md:text-sm text-muted-foreground">Tekan lama untuk naikkan kelas</p>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6">
          {/* All Classes Button */}
          <button
            onClick={handleAllClassClick}
            className={`group relative overflow-hidden rounded-2xl h-24 md:h-32 lg:h-36 flex items-center justify-center transition-all duration-300 hover:scale-105 hover:shadow-lg md:hover:shadow-xl ${
              selectedClass === null 
                ? "bg-gradient-to-br from-islamic-primary to-islamic-secondary text-white shadow-md md:shadow-lg" 
                : "bg-card border-2 border-border text-foreground hover:border-islamic-primary/40"
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="relative text-center">
              <div className="text-sm md:text-base font-medium mb-1">Semua</div>
              <div className="text-2xl md:text-3xl lg:text-4xl font-bold">Kelas</div>
            </div>
            
            {selectedClass === null && (
              <div className="absolute inset-0 border-2 border-white/30 rounded-2xl" />
            )}
          </button>

          {classes.map((kelas) => (
            <button
              key={kelas}
              onClick={() => handleClassClick(kelas)}
              onContextMenu={(e) => {
                if (!showPromotionHint) return;
                e.preventDefault();
                handleLongPress(kelas);
              }}
              onTouchStart={(e) => {
                if (!showPromotionHint) return;
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
              className={`group relative overflow-hidden rounded-2xl h-24 md:h-32 lg:h-36 flex items-center justify-center transition-all duration-300 hover:scale-105 hover:shadow-lg md:hover:shadow-xl ${
                selectedClass === kelas 
                  ? "bg-gradient-to-br from-islamic-primary to-islamic-secondary text-white shadow-md md:shadow-lg" 
                  : "bg-card border-2 border-border text-foreground hover:border-islamic-primary/40"
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative text-center">
                <div className="text-sm md:text-base font-medium mb-1">Kelas</div>
                <div className="text-2xl md:text-3xl lg:text-4xl font-bold">{kelas}</div>
              </div>
              
              {selectedClass === kelas && (
                <div className="absolute inset-0 border-2 border-white/30 rounded-2xl" />
              )}
            </button>
          ))}
        </div>
      </div>

      {showPromotionHint && (
        <Dialog open={promoteDialogOpen} onOpenChange={setPromoteDialogOpen}>
          <DialogContent className="sm:max-w-md mx-4">
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
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button 
                variant="outline" 
                onClick={() => setPromoteDialogOpen(false)}
                className="w-full sm:w-auto"
              >
                Batal
              </Button>
              <Button 
                onClick={handlePromoteClass} 
                disabled={isPromoting}
                className="w-full sm:w-auto bg-gradient-to-r from-islamic-primary to-islamic-secondary hover:from-islamic-primary/90 hover:to-islamic-secondary/90"
              >
                <ChevronUp className="h-4 w-4 mr-2" />
                {isPromoting ? "Memproses..." : "Naikkan Kelas"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default ClassFilter;
