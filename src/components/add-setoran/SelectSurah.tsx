
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Surah {
  label: string;
  value: string;
}

interface SelectSurahProps {
  value: string;
  onChange: (v: string) => void;
  availableSurahs: Surah[];
  disabled?: boolean;
}

const SelectSurah: React.FC<SelectSurahProps> = ({
  value,
  onChange,
  availableSurahs,
  disabled
}) => (
  <div className="space-y-2">
    <Label htmlFor="surat" className="text-white font-medium">
      Surat *
    </Label>
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger className="bg-background border border-emerald-600 text-white hover:border-emerald-400">
        <SelectValue placeholder={disabled ? "Pilih juz terlebih dahulu" : "Pilih surat"} />
      </SelectTrigger>
      <SelectContent className="bg-gray-900 border-emerald-700 text-white">
        {availableSurahs.map((surat) => (
          <SelectItem key={surat.value} value={surat.value} className="hover:bg-emerald-700 focus:bg-emerald-700 text-white">
            {surat.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

export default SelectSurah;
