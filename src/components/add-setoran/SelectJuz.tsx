
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SelectJuzProps {
  value: string;
  onChange: (v: string) => void;
}

const SelectJuz: React.FC<SelectJuzProps> = ({ value, onChange }) => (
  <div className="space-y-2">
    <Label htmlFor="juz" className="text-white font-medium">
      Juz *
    </Label>
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="bg-background border border-emerald-600 text-white hover:border-emerald-400">
        <SelectValue placeholder="Pilih juz" />
      </SelectTrigger>
      <SelectContent className="bg-gray-900 border-emerald-700 text-white">
        {Array.from({ length: 30 }, (_, i) => i + 1).map((juz) => (
          <SelectItem key={juz} value={juz.toString()} className="hover:bg-emerald-700 focus:bg-emerald-700 text-white">
            Juz {juz}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

export default SelectJuz;
