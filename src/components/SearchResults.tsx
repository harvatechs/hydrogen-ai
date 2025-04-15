
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { SearchResult } from "@/utils/searchUtils";
import { ExternalLink, X, Bookmark, Share2, ThumbsUp } from "lucide-react";
import { useChat } from "@/context/ChatContext";
import { toast } from "@/components/ui/use-toast";

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
    
    toast({
      title: "Using search result",
      description: "Added search result to your conversation"
    });
  };
  
  const handleSaveResult = (result: SearchResult) => {
    // In a real app, this would save to user bookmarks
    toast({
      title: "Bookmark saved",
      description: "This result has been saved to your bookmarks"
    });
  };
  
  const handleShareResult = (result: SearchResult) => {
    // Copy URL to clipboard
    navigator.clipboard.writeText(result.link);
    toast({
      title: "Link copied",
      description: "The URL has been copied to your clipboard"
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-3xl h-[80vh] bg-background border border-white/10 rounded-lg shadow-lg overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="text-lg font-semibold flex items-center">
            <span className="mr-2">🔍</span>
            Search Results for "{searchTerm}"
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-white/10 transition-colors">
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="p-2 text-xs text-muted-foreground border-b border-white/10 bg-black/30 flex justify-between">
          <span>About {searchInfo.formattedTotalResults} results ({searchInfo.formattedSearchTime} seconds)</span>
          <span className="text-blue-400">Powered by Google Search</span>
        </div>
        
        <ScrollArea className="h-[calc(80vh-7rem)]">
          <div className="p-4 space-y-6">
            {results.map((result, index) => (
              <div key={index} className="space-y-2 p-4 hover:bg-white/5 transition-colors rounded-lg border border-transparent hover:border-white/10 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
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
                    className="text-xs h-7 glass-button button-glow"
                    onClick={() => handleUseResult(result)}
                  >
                    Use in Chat
                  </Button>
                </div>
                
                <p className="text-sm text-muted-foreground truncate">{result.link}</p>
                <p className="text-sm">{result.snippet}</p>
                
                {result.pagemap?.cse_image?.[0]?.src && (
                  <div className="pt-2">
                    <img 
                      src={result.pagemap.cse_image[0].src}
                      alt={result.title}
                      className="max-h-24 rounded-md border border-white/10 hover:opacity-90 transition-opacity cursor-pointer"
                      onClick={() => window.open(result.link, '_blank')}
                    />
                  </div>
                )}
                
                <div className="flex gap-2 pt-2">
                  <Button variant="ghost" size="sm" className="text-xs h-7" onClick={() => handleSaveResult(result)}>
                    <Bookmark className="h-3 w-3 mr-1" />
                    Save
                  </Button>
                  <Button variant="ghost" size="sm" className="text-xs h-7" onClick={() => handleShareResult(result)}>
                    <Share2 className="h-3 w-3 mr-1" />
                    Share
                  </Button>
                  <Button variant="ghost" size="sm" className="text-xs h-7">
                    <ThumbsUp className="h-3 w-3 mr-1" />
                    Helpful
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
