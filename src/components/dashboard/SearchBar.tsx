
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

const SearchBar = ({ searchQuery, onSearchChange, placeholder = "Cari santri..." }: SearchBarProps) => {
  return (
    <div>
      <div className="flex items-center gap-3 mb-4 md:mb-6">
        <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-gradient-to-br from-islamic-secondary to-islamic-accent flex items-center justify-center shadow-lg">
          <Filter className="w-4 h-4 md:w-5 md:h-5 text-white" />
        </div>
        <div>
          <h2 className="text-lg md:text-xl font-bold text-foreground">Pencarian Santri</h2>
          <p className="text-xs md:text-sm text-muted-foreground">Temukan santri dengan cepat</p>
        </div>
      </div>
      
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 md:pl-4 pointer-events-none">
          <Search className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
        </div>
        <Input
          placeholder={placeholder}
          className="pl-10 md:pl-12 pr-3 md:pr-4 py-2 md:py-3 text-sm md:text-base border-2 border-border rounded-lg md:rounded-xl focus:border-islamic-primary focus:ring-islamic-primary/20 bg-background text-foreground shadow-sm transition-all duration-200"
          value={searchQuery}
          onChange={onSearchChange}
        />
        <div className="absolute inset-0 rounded-lg md:rounded-xl bg-gradient-to-r from-islamic-primary/5 to-islamic-secondary/5 pointer-events-none opacity-0 transition-opacity duration-200 peer-focus:opacity-100" />
      </div>
    </div>
  );
};

export default SearchBar;
