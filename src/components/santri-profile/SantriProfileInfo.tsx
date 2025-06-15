
import { Santri } from "@/types";
import { User, MapPin, BookOpen, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const SantriProfileInfo = ({ santri }: { santri: Santri }) => (
  <Card className="bg-white/70 backdrop-blur-sm border-emerald-200">
    <CardContent className="p-6">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
          <User className="w-10 h-10 text-white" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-emerald-800">{santri.nama}</h2>
          
          <div className="flex items-center justify-center gap-2 text-emerald-600">
            <MapPin className="w-4 h-4" />
            <span className="font-medium">Kelas {santri.kelas}</span>
            <span>•</span>
            <span className="font-medium">{santri.jenis_kelamin}</span>
          </div>
          
          <div className="flex items-center justify-center gap-2 text-emerald-600">
            <BookOpen className="w-4 h-4" />
            <span className="text-sm">Total Hafalan: {santri.total_hafalan || 0} ayat</span>
          </div>
          
          <div className="flex items-center justify-center gap-2 text-gray-500">
            <Calendar className="w-4 h-4" />
            <span className="text-xs">
              Bergabung: {new Date(santri.created_at).toLocaleDateString("id-ID")}
            </span>
          </div>
          
          <div className="text-xs text-gray-400 mt-2">
            ID: {santri.id}
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default SantriProfileInfo;
