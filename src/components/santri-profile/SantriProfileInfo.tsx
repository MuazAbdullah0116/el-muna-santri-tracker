
import { Santri } from "@/types";
import { User, MapPin } from "lucide-react";

const SantriProfileInfo = ({ santri }: { santri: Santri }) => (
  <div className="flex gap-4 items-center">
    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-islamic-primary to-islamic-secondary flex items-center justify-center shadow">
      <User className="w-8 h-8 text-white" />
    </div>
    <div>
      <div className="font-bold text-lg">{santri.nama}</div>
      <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
        <span className="flex items-center gap-1">
          <MapPin className="w-4 h-4" /> Kelas {santri.kelas}
        </span>
        <span>•</span>
        <span>{santri.jenis_kelamin}</span>
      </div>
      <div className="text-xs text-muted-foreground mt-1">
        ID: {santri.id}
      </div>
    </div>
  </div>
);

export default SantriProfileInfo;
