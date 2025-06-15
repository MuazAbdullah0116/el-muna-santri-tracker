
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";

interface AyatRangeInputProps {
  awalAyat: string;
  akhirAyat: string;
  minAyat: number;
  maxAyat: number;
  onAwalAyatChange: (v: string) => void;
  onAkhirAyatChange: (v: string) => void;
  disabled?: boolean;
}

const AyatRangeInput: React.FC<AyatRangeInputProps> = ({
  awalAyat,
  akhirAyat,
  minAyat,
  maxAyat,
  onAwalAyatChange,
  onAkhirAyatChange,
  disabled
}) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="space-y-2">
      <Label htmlFor="awal_ayat" className="text-white font-medium">
        Ayat Awal *
      </Label>
      <Input
        id="awal_ayat"
        type="number"
        placeholder={`Min: ${minAyat}`}
        value={awalAyat}
        onChange={(e) => onAwalAyatChange(e.target.value)}
        min={minAyat}
        max={maxAyat}
        disabled={disabled}
        className="bg-white bg-opacity-20 border border-emerald-300 text-white placeholder:text-white/70 focus:border-emerald-400"
      />
    </div>

    <div className="space-y-2">
      <Label htmlFor="akhir_ayat" className="text-white font-medium">
        Ayat Akhir *
      </Label>
      <Input
        id="akhir_ayat"
        type="number"
        placeholder={`Max: ${maxAyat}`}
        value={akhirAyat}
        onChange={(e) => onAkhirAyatChange(e.target.value)}
        min={awalAyat || minAyat}
        max={maxAyat}
        disabled={!awalAyat || disabled}
        className="bg-white bg-opacity-20 border border-emerald-300 text-white placeholder:text-white/70 focus:border-emerald-400"
      />
    </div>
  </div>
);

export default AyatRangeInput;
