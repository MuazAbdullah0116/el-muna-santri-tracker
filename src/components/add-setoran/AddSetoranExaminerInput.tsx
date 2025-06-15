
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";

interface AddSetoranExaminerInputProps {
  diujiOleh: string;
  onDiujiOlehChange: (v: string) => void;
}

const AddSetoranExaminerInput: React.FC<AddSetoranExaminerInputProps> = ({
  diujiOleh,
  onDiujiOlehChange,
}) => (
  <div className="mb-6">
    <Label htmlFor="diujiOleh" className="block text-gray-700 text-sm font-bold mb-2">
      Diuji Oleh
    </Label>
    <Input
      type="text"
      id="diujiOleh"
      placeholder="Masukkan nama penguji"
      value={diujiOleh}
      onChange={(e) => onDiujiOlehChange(e.target.value)}
      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    />
  </div>
);

export default AddSetoranExaminerInput;
