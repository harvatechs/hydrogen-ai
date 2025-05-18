
import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';

interface SearchResult {
  title: string;
  link: string;
  snippet: string;
}

interface SearchResultsProps {
  results: SearchResult[];
  isSearching: boolean;
}

export const SearchResults: React.FC<SearchResultsProps> = ({ 
  results, 
  isSearching 
}) => {
  if (isSearching) {
    return (
      <div className="space-y-3 p-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="overflow-hidden border-border/40">
            <CardContent className="p-4 space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 px-4 h-full text-center text-muted-foreground">
        <p className="mb-2">No search results yet</p>
        <p className="text-sm">Search the web to find information</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full max-h-[500px] pr-4">
      <div className="space-y-3 p-2">
        {results.map((result, index) => (
          <Card
            key={index}
            className="overflow-hidden border-border/40 transition-all hover:border-primary/30 hover:shadow-md"
          >
            <CardContent className="p-4">
              <CardTitle className="text-base font-semibold line-clamp-2 mb-1">
                {result.title}
              </CardTitle>
              <CardDescription className="text-xs flex items-center gap-1 mb-2 text-emerald-600 dark:text-emerald-400">
                <ExternalLink className="h-3 w-3" />
                <a 
                  href={result.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:underline truncate"
                >
                  {result.link}
                </a>
              </CardDescription>
              <p className="text-sm line-clamp-3">{result.snippet}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
};
