
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
  const options = [1, 2, 3, 4, 5];

  return (
    <div className="mb-4">
      <Label className="block text-gray-700 text-sm font-bold mb-2">
        Penilaian
      </Label>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="kelancaran" className="block text-gray-700 text-xs font-bold mb-1">
            Kelancaran
          </Label>
          <Select value={String(kelancaran)} onValueChange={(value) => onKelancaranChange(Number(value))}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih Nilai" />
            </SelectTrigger>
            <SelectContent>
              {options.map((value) => (
                <SelectItem key={value} value={String(value)}>
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="tajwid" className="block text-gray-700 text-xs font-bold mb-1">
            Tajwid
          </Label>
          <Select value={String(tajwid)} onValueChange={(value) => onTajwidChange(Number(value))}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih Nilai" />
            </SelectTrigger>
            <SelectContent>
              {options.map((value) => (
                <SelectItem key={value} value={String(value)}>
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="tahsin" className="block text-gray-700 text-xs font-bold mb-1">
            Tahsin
          </Label>
          <Select value={String(tahsin)} onValueChange={(value) => onTahsinChange(Number(value))}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih Nilai" />
            </SelectTrigger>
            <SelectContent>
              {options.map((value) => (
                <SelectItem key={value} value={String(value)}>
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

