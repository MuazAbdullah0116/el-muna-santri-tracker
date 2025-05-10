
import { Card, CardContent } from "@/components/ui/card";
import { Santri } from "@/types";

interface SantriCardProps {
  santri: Santri;
  onClick: (santri: Santri) => void;
}

const SantriCard = ({ santri, onClick }: SantriCardProps) => {
  return (
    <Card 
      className="islamic-card overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" 
      onClick={() => onClick(santri)}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">{santri.nama}</h3>
            <div className="flex items-center mt-1">
              <span className="text-xs bg-muted text-muted-foreground rounded-full px-2 py-0.5 mr-2">
                Kelas {santri.kelas}
              </span>
              <span className="text-xs bg-muted text-muted-foreground rounded-full px-2 py-0.5">
                {santri.jenis_kelamin}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-semibold text-islamic-primary">{santri.total_hafalan}</span>
            <span className="text-xs text-muted-foreground">Setoran</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SantriCard;
