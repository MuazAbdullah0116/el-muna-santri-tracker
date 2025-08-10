
import { useState, useEffect } from "react";
import { Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useQuery } from "@tanstack/react-query";
import { fetchSantri } from "@/services/supabase/santri.service";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const SantriSearch = () => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();

  const { data: santris = [], isLoading } = useQuery({
    queryKey: ["santris"],
    queryFn: fetchSantri,
  });

  const filteredSantris = santris.filter(santri =>
    santri.nama.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleSelectSantri = (santriId: string) => {
    setOpen(false);
    setSearchValue("");
    navigate(`/santri/${santriId}`);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between bg-background/50 backdrop-blur-sm border-border/50 hover:bg-background/70"
        >
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            <span className="truncate">Cari Santri...</span>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <Command>
          <CommandInput 
            placeholder="Ketik nama santri..." 
            value={searchValue}
            onValueChange={setSearchValue}
          />
          <CommandList>
            <CommandEmpty>
              {isLoading ? "Memuat data..." : "Tidak ada santri ditemukan."}
            </CommandEmpty>
            <CommandGroup>
              {filteredSantris.slice(0, 10).map((santri) => (
                <CommandItem
                  key={santri.id}
                  value={santri.nama}
                  onSelect={() => handleSelectSantri(santri.id)}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <User className="h-4 w-4" />
                  <div className="flex flex-col">
                    <span className="font-medium">{santri.nama}</span>
                    <span className="text-xs text-muted-foreground">
                      Kelas {santri.kelas} • {santri.jenis_kelamin === "L" ? "Laki-laki" : "Perempuan"}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default SantriSearch;
