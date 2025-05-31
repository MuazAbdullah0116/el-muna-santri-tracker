
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

const SearchBar = ({ searchQuery, onSearchChange, placeholder = "Cari santri..." }: SearchBarProps) => {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-islamic-secondary to-islamic-accent flex items-center justify-center shadow-lg">
          <Filter className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">Pencarian Santri</h2>
          <p className="text-sm text-muted-foreground">Temukan santri dengan cepat</p>
        </div>
      </div>
      
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          <Search className="h-5 w-5 text-muted-foreground" />
        </div>
        <Input
          placeholder={placeholder}
          className="pl-12 pr-4 py-3 text-base border-2 border-border rounded-xl focus:border-islamic-primary focus:ring-islamic-primary/20 bg-background text-foreground shadow-sm transition-all duration-200"
          value={searchQuery}
          onChange={onSearchChange}
        />
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-islamic-primary/5 to-islamic-secondary/5 pointer-events-none opacity-0 transition-opacity duration-200 peer-focus:opacity-100" />
      </div>
    </div>
  );
};

export default SearchBar;
