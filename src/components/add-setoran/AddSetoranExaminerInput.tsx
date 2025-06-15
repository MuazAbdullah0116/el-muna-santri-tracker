
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
    <Label htmlFor="diujiOleh" className="block text-white text-sm font-bold mb-2">
      Diuji Oleh *
    </Label>
    <Input
      type="text"
      id="diujiOleh"
      placeholder="Masukkan nama penguji"
      value={diujiOleh}
      onChange={(e) => onDiujiOlehChange(e.target.value)}
      className="w-full bg-background border-border text-white placeholder:text-white/50"
    />
  </div>
);

export default AddSetoranExaminerInput;
