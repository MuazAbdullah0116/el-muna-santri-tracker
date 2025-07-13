
import { Card, CardContent } from "@/components/ui/card";
import { Santri } from "@/types";
import { User, Award, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SantriCardProps {
  santri: Santri;
  onClick?: (santri: Santri) => void;
}

const SantriCard = ({ santri, onClick }: SantriCardProps) => {
  const navigate = useNavigate();
  const handleClick = () => {
    if (onClick) {
      onClick(santri);
    } else {
      navigate(`/santri/${santri.id}`);
    }
  };
  return (
    <Card 
      className="group relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02] bg-gradient-to-br from-card via-card to-islamic-light/30 dark:to-islamic-dark/30 border border-islamic-primary/20 hover:border-islamic-primary/40" 
      onClick={handleClick}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-islamic-primary/5 to-islamic-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <CardContent className="relative p-3 sm:p-4 md:p-6">
        <div className="flex flex-col space-y-2 sm:space-y-3 md:space-y-4">
          {/* Header with Avatar and Name */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-islamic-primary to-islamic-secondary flex items-center justify-center shadow-lg flex-shrink-0">
              <User className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm sm:text-base md:text-lg text-foreground truncate group-hover:text-islamic-primary transition-colors">
                {santri.nama}
              </h3>
            </div>
          </div>
          
          {/* Class and Gender Tags */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            <span className="inline-flex items-center px-1.5 py-0.5 sm:px-2 sm:py-1 md:px-3 md:py-1 rounded-full text-[10px] sm:text-xs font-medium bg-islamic-primary/10 text-islamic-primary border border-islamic-primary/20">
              <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 sm:mr-1" />
              Kelas {santri.kelas}
            </span>
            <span className="inline-flex items-center px-1.5 py-0.5 sm:px-2 sm:py-1 md:px-3 md:py-1 rounded-full text-[10px] sm:text-xs font-medium bg-islamic-secondary/10 text-islamic-secondary border border-islamic-secondary/20">
              {santri.jenis_kelamin}
            </span>
          </div>
          
          {/* Hafalan Count */}
          <div className="flex items-center justify-center bg-gradient-to-br from-islamic-accent/20 to-islamic-gold/20 rounded-xl p-2 sm:p-3 md:p-4 border border-islamic-gold/30">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-0.5 sm:mb-1">
                <Award className="w-3 h-3 sm:w-4 sm:h-4 text-islamic-gold" />
              </div>
              <span className="text-lg sm:text-xl md:text-2xl font-bold text-islamic-primary bg-gradient-to-r from-islamic-primary to-islamic-secondary bg-clip-text text-transparent">
                {santri.total_hafalan || 0}
              </span>
              <div className="text-[10px] sm:text-xs text-muted-foreground font-medium">Setoran</div>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-islamic-primary via-islamic-secondary to-islamic-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </CardContent>
    </Card>
  );
};

export default SantriCard;
