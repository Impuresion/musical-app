
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface SearchBarProps {
  query: string;
  onQueryChange: (query: string) => void;
}

export const SearchBar = ({ query, onQueryChange }: SearchBarProps) => {
  return (
    <div className="flex gap-4 mb-6">
      <Input
        placeholder="Поиск треков..."
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        className="max-w-md"
      />
      <Button variant="outline" size="icon">
        <Search className="h-4 w-4" />
      </Button>
    </div>
  );
};
