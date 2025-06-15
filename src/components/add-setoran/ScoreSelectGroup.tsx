
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ScoreSelectGroupProps {
  kelancaran: number;
  tajwid: number;
  tahsin: number;
  onKelancaranChange: (value: number) => void;
  onTajwidChange: (value: number) => void;
  onTahsinChange: (value: number) => void;
}

const ScoreSelectGroup: React.FC<ScoreSelectGroupProps> = ({
  kelancaran,
  tajwid,
  tahsin,
  onKelancaranChange,
  onTajwidChange,
  onTahsinChange,
}) => {
  // Nilai 1-10
  const options = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <div className="mb-4">
      <Label className="block text-white text-sm font-bold mb-2">
        Penilaian
      </Label>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="kelancaran" className="block text-white text-xs font-bold mb-1">
            Kelancaran
          </Label>
          <Select value={String(kelancaran)} onValueChange={(value) => onKelancaranChange(Number(value))}>
            <SelectTrigger className="w-full bg-white bg-opacity-20 border border-emerald-300 text-white focus:border-emerald-400">
              <SelectValue placeholder="Pilih Nilai" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-emerald-700 text-white">
              {options.map((value) => (
                <SelectItem key={value} value={String(value)} className="hover:bg-emerald-700 focus:bg-emerald-700 text-white">
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="tajwid" className="block text-white text-xs font-bold mb-1">
            Tajwid
          </Label>
          <Select value={String(tajwid)} onValueChange={(value) => onTajwidChange(Number(value))}>
            <SelectTrigger className="w-full bg-white bg-opacity-20 border border-emerald-300 text-white focus:border-emerald-400">
              <SelectValue placeholder="Pilih Nilai" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-emerald-700 text-white">
              {options.map((value) => (
                <SelectItem key={value} value={String(value)} className="hover:bg-emerald-700 focus:bg-emerald-700 text-white">
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="tahsin" className="block text-white text-xs font-bold mb-1">
            Tahsin
          </Label>
          <Select value={String(tahsin)} onValueChange={(value) => onTahsinChange(Number(value))}>
            <SelectTrigger className="w-full bg-white bg-opacity-20 border border-emerald-300 text-white focus:border-emerald-400">
              <SelectValue placeholder="Pilih Nilai" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-emerald-700 text-white">
              {options.map((value) => (
                <SelectItem key={value} value={String(value)} className="hover:bg-emerald-700 focus:bg-emerald-700 text-white">
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default ScoreSelectGroup;
