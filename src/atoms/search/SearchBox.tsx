
import React from 'react';
import { Search, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SearchBoxProps {
  query: string;
  onQueryChange: (value: string) => void;
  onSearch: () => void;
  isSearching: boolean;
}

export const SearchBox: React.FC<SearchBoxProps> = ({ 
  query, 
  onQueryChange, 
  onSearch, 
  isSearching 
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="relative w-full">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          <Search className="h-4 w-4" />
        </div>
        <Input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search the web..."
          className="pl-10 pr-14 h-12 bg-background/80 backdrop-blur-sm border-muted"
        />
        <Button
          size="sm"
          onClick={onSearch}
          disabled={!query.trim() || isSearching}
          className="absolute right-1 top-1/2 -translate-y-1/2 h-8 px-3 flex items-center gap-1"
        >
          {isSearching ? (
            <span className="animate-pulse">Searching...</span>
          ) : (
            <>
              Search
              <ArrowRight className="h-3.5 w-3.5" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
