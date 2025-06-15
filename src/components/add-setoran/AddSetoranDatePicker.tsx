
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import React from "react";

interface AddSetoranDatePickerProps {
  tanggal: Date | undefined;
  onTanggalChange: (date: Date | undefined) => void;
}

const AddSetoranDatePicker: React.FC<AddSetoranDatePickerProps> = ({ tanggal, onTanggalChange }) => {
  return (
    <div className="mb-4">
      <Label htmlFor="tanggal" className="block text-gray-700 text-sm font-bold mb-2">
        Tanggal
      </Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !tanggal && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {tanggal ? tanggal.toLocaleDateString() : <span>Pilih tanggal</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={tanggal}
            onSelect={onTanggalChange}
            disabled={(date) =>
              date > new Date() || date < new Date("2021-01-01")
            }
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default AddSetoranDatePicker;
