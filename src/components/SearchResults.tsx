
import { X, ExternalLink, Copy, Clock, Search, ArrowUpRight } from "lucide-react";
import { Button } from "./ui/button";
import { useChat } from "@/context/ChatContext";
import { Card } from "./ui/card";
import { extractDomain, formatSearchTime, highlightSearchTerms } from "@/utils/searchUtils";
import { toast } from "./ui/use-toast";
import { ScrollArea } from "./ui/scroll-area";

interface SearchResultsProps {
  results: any[];
  searchInfo: {
    formattedTotalResults: string;
    formattedSearchTime: string;
    totalResults: string;
    searchTime: number;
  };
  searchTerm: string;
  onClose: () => void;
}

export function SearchResults({ 
  results, 
  searchInfo, 
  searchTerm, 
  onClose 
}: SearchResultsProps) {
  const { sendMessage } = useChat();
  
  const handleUseResult = (result: any) => {
    const prompt = `I found this information about "${searchTerm}": "${result.snippet}" from the website ${result.displayLink || extractDomain(result.link)}. Can you provide more insights about this?`;
    
    sendMessage(prompt);
    onClose();
    
    toast({
      title: "Using search result",
      description: "Analyzing the selected search result"
    });
  };
  
  const handleResearchAll = () => {
    const summaryText = results
      .slice(0, 3)
      .map(result => `- ${result.snippet}`)
      .join("\n");
    
    const prompt = `I searched for "${searchTerm}" and found these results:\n\n${summaryText}\n\nCan you synthesize this information and tell me what's important to know about "${searchTerm}"?`;
    
    sendMessage(prompt);
    onClose();
    
    toast({
      title: "Research in progress",
      description: "Analyzing multiple search results"
    });
  };
  
  const createMarkup = (html: string) => {
    return { __html: html };
  };
  
  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="bg-card relative max-w-4xl w-full rounded-xl shadow-xl animate-fade-in border dark:border-white/10 light:border-black/10">
        <div className="flex items-center justify-between p-4 border-b dark:border-white/10 light:border-black/10">
          <div className="flex items-center">
            <Search className="h-5 w-5 mr-2 text-gemini-purple" />
            <h2 className="text-lg font-semibold">Search Results: <span className="text-gemini-purple">{searchTerm.replace('/web ', '')}</span></h2>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="text-xs text-muted-foreground flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {formatSearchTime(searchInfo.searchTime)}
              <span className="mx-2">•</span>
              {searchInfo.formattedTotalResults} results
            </div>
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose} 
              className="h-8 w-8 rounded-full text-muted-foreground"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <ScrollArea className="max-h-[70vh] overflow-y-auto p-4">
          <div className="space-y-4">
            {results.map((result, i) => (
              <div key={i} className="search-result-item">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <a 
                      href={result.link} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="search-result-title flex items-center hover:underline"
                    >
                      {result.title}
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                    
                    <div className="search-result-url flex items-center">
                      {result.pagemap?.cse_image?.[0]?.src && (
                        <img 
                          src={result.pagemap.cse_image[0].src} 
                          alt="" 
                          className="h-4 w-4 mr-1 rounded object-cover" 
                        />
                      )}
                      {result.displayLink || extractDomain(result.link)}
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="ml-2 h-8 flex-shrink-0"
                    onClick={() => handleUseResult(result)}
                  >
                    <span className="sr-only md:not-sr-only md:inline-block">Use</span>
                    <ArrowUpRight className="h-3 w-3 md:ml-1" />
                  </Button>
                </div>
                
                <div 
                  className="search-result-snippet mt-1 text-sm"
                  dangerouslySetInnerHTML={createMarkup(highlightSearchTerms(result.snippet, searchTerm.replace('/web ', '')))}
                />
              </div>
            ))}
          </div>
        </ScrollArea>
        
        <div className="flex justify-between items-center p-4 border-t dark:border-white/10 light:border-black/10">
          <div className="text-xs text-muted-foreground">
            Powered by Google Custom Search
          </div>
          
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onClose}
            >
              Close
            </Button>
            
            <Button 
              variant="default" 
              size="sm"
              onClick={handleResearchAll}
              className="bg-gemini-purple hover:bg-gemini-purple/90 text-white"
            >
              Research All
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
