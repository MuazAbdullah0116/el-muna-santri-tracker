
import { Card, CardContent } from "@/components/ui/card";
import { Santri } from "@/types";
import { User, Award, MapPin } from "lucide-react";

interface SantriCardProps {
  santri: Santri;
  onClick: (santri: Santri) => void;
}

const SantriCard = ({ santri, onClick }: SantriCardProps) => {
  return (
    <Card 
      className="group relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02] bg-gradient-to-br from-card via-card to-islamic-light/30 dark:to-islamic-dark/30 border border-islamic-primary/20 hover:border-islamic-primary/40" 
      onClick={() => onClick(santri)}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-islamic-primary/5 to-islamic-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <CardContent className="relative p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-islamic-primary to-islamic-secondary flex items-center justify-center shadow-lg">
                <User className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-foreground truncate group-hover:text-islamic-primary transition-colors">
                  {santri.nama}
                </h3>
              </div>
            </div>
            
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-islamic-primary/10 text-islamic-primary border border-islamic-primary/20">
                <MapPin className="w-3 h-3 mr-1" />
                Kelas {santri.kelas}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-islamic-secondary/10 text-islamic-secondary border border-islamic-secondary/20">
                {santri.jenis_kelamin}
              </span>
            </div>
          </div>
          
          <div className="flex flex-col items-center justify-center bg-gradient-to-br from-islamic-accent/20 to-islamic-gold/20 rounded-2xl p-4 min-w-[80px] border border-islamic-gold/30">
            <div className="flex items-center gap-1 mb-1">
              <Award className="w-4 h-4 text-islamic-gold" />
            </div>
            <span className="text-2xl font-bold text-islamic-primary bg-gradient-to-r from-islamic-primary to-islamic-secondary bg-clip-text text-transparent">
              {santri.total_hafalan || 0}
            </span>
            <span className="text-xs text-muted-foreground font-medium">Setoran</span>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-islamic-primary via-islamic-secondary to-islamic-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </CardContent>
    </Card>
  );
};

export default SantriCard;
