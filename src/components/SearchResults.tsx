
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { SearchResult } from "@/utils/searchUtils";
import { ExternalLink, X } from "lucide-react";
import { useChat } from "@/context/ChatContext";

interface SearchResultsProps {
  results: SearchResult[];
  searchInfo: {
    formattedTotalResults: string;
    formattedSearchTime: string;
  };
  searchTerm: string;
  onClose: () => void;
}

export function SearchResults({ results, searchInfo, searchTerm, onClose }: SearchResultsProps) {
  const { sendMessage } = useChat();

  const handleUseResult = (result: SearchResult) => {
    sendMessage(`I found this information about "${searchTerm}": ${result.title} - ${result.snippet}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-3xl h-[80vh] bg-background border border-white/10 rounded-lg shadow-lg overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="text-lg font-semibold">
            Search Results for "{searchTerm}"
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="p-2 text-xs text-muted-foreground border-b border-white/10 bg-black/30">
          About {searchInfo.formattedTotalResults} results ({searchInfo.formattedSearchTime} seconds)
        </div>
        
        <ScrollArea className="h-[calc(80vh-7rem)]">
          <div className="p-4 space-y-6">
            {results.map((result, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-start justify-between">
                  <h3 className="text-md font-medium">
                    <a 
                      href={result.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:underline text-primary flex items-center"
                    >
                      {result.title}
                      <ExternalLink className="h-3 w-3 ml-1 opacity-70" />
                    </a>
                  </h3>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs h-7 glass-button"
                    onClick={() => handleUseResult(result)}
                  >
                    Use in Chat
                  </Button>
                </div>
                
                <p className="text-sm text-muted-foreground">{result.link}</p>
                <p className="text-sm">{result.snippet}</p>
                
                {result.pagemap?.cse_image?.[0]?.src && (
                  <div className="pt-2">
                    <img 
                      src={result.pagemap.cse_image[0].src}
                      alt={result.title}
                      className="max-h-24 rounded-md border border-white/10"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
