
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";

interface AddSetoranAyatRangeProps {
  awalAyat: number;
  akhirAyat: number;
  onAwalAyatChange: (v: number) => void;
  onAkhirAyatChange: (v: number) => void;
}

const AddSetoranAyatRange: React.FC<AddSetoranAyatRangeProps> = ({
  awalAyat,
  akhirAyat,
  onAwalAyatChange,
  onAkhirAyatChange,
}) => (
  <div className="grid grid-cols-2 gap-4 mb-4">
    <div>
      <Label htmlFor="awalAyat" className="block text-gray-700 text-sm font-bold mb-2">
        Awal Ayat
      </Label>
      <Input
        type="number"
        id="awalAyat"
        placeholder="Awal"
        value={awalAyat}
        onChange={(e) => onAwalAyatChange(Number(e.target.value))}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      />
    </div>
    <div>
      <Label htmlFor="akhirAyat" className="block text-gray-700 text-sm font-bold mb-2">
        Akhir Ayat
      </Label>
      <Input
        type="number"
        id="akhirAyat"
        placeholder="Akhir"
        value={akhirAyat}
        onChange={(e) => onAkhirAyatChange(Number(e.target.value))}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      />
    </div>
  </div>
);

export default AddSetoranAyatRange;
