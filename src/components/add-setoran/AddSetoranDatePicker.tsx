
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
      <Label htmlFor="tanggal" className="block text-white text-sm font-bold mb-2">
        Tanggal *
      </Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal bg-background border-border text-white hover:bg-accent hover:text-accent-foreground",
              !tanggal && "text-white/50"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {tanggal ? tanggal.toLocaleDateString('id-ID') : <span>Pilih tanggal</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-popover border-border" align="start">
          <Calendar
            mode="single"
            selected={tanggal}
            onSelect={onTanggalChange}
            disabled={(date) =>
              date > new Date() || date < new Date("2021-01-01")
            }
            initialFocus
            className="p-3 pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default AddSetoranDatePicker;
