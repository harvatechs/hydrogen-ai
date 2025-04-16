import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Search, X, ExternalLink, FileText, Copy, Loader2, CornerRightDown, ThumbsUp, ThumbsDown, 
  Bookmark, BookmarkCheck, ScanSearch, Globe, Calendar, Newspaper, Filter, Info, RefreshCw } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { searchGoogle, SearchResult } from '@/utils/searchUtils';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from '@/lib/utils';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { motion, AnimatePresence } from 'framer-motion';

interface WebSearchAtomProps {
  initialQuery: string;
  onClose: () => void;
  onSubmitResult: (result: string) => void;
}

export function WebSearchAtom({ initialQuery, onClose, onSubmitResult }: WebSearchAtomProps) {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searchInfo, setSearchInfo] = useState<{ formattedTotalResults: string; formattedSearchTime: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [savedResults, setSavedResults] = useState<{[key: string]: boolean}>({});
  const [summary, setSummary] = useState<string>('');
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [activeFilters, setActiveFilters] = useState<{[key: string]: boolean}>({
    news: false,
    images: false,
    videos: false,
    recent: false
  });
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null);
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // Auto-focus on search input when component mounts
  useEffect(() => {
    setTimeout(() => {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, 100);
  }, []);

  // Perform initial search when component mounts
  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  const performSearch = async (query: string) => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    setResults([]);
    setSummary('');
    setSelectedResult(null);
    
    try {
      // Build search query with filters
      let enhancedQuery = query;
      if (activeFilters.news) enhancedQuery += ' news';
      if (activeFilters.recent) enhancedQuery += ' after:2023';
      
      const response = await searchGoogle(enhancedQuery);
      
      if (response && response.items) {
        setResults(response.items);
        setSearchInfo(response.searchInformation);
        
        // Auto-switch to results tab if needed
        if (activeTab !== 'all') {
          setActiveTab('all');
        }
        
        toast({
          title: "Search complete",
          description: `Found ${response.items.length} results`,
          duration: 3000,
        });
      } else {
        toast({
          title: "No results found",
          description: "Try a different search term",
          variant: "destructive",
          duration: 3000,
        });
      }
    } catch (error) {
      toast({
        title: "Search failed",
        description: "There was an error performing your search",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchQuery);
  };

  const handleUseResult = (result: SearchResult) => {
    const formattedResult = `Information from "${result.title}": ${result.snippet}\nSource: ${result.link}`;
    onSubmitResult(formattedResult);
  };

  const handleSaveResult = (resultId: string) => {
    setSavedResults(prev => ({
      ...prev,
      [resultId]: !prev[resultId]
    }));
    
    toast({
      title: savedResults[resultId] ? "Result unsaved" : "Result saved",
      description: "You can access saved results in the Bookmarks tab",
      duration: 2000,
    });
  };

  const generateSummary = async () => {
    if (results.length === 0) return;
    
    setIsSummarizing(true);
    
    // Get the top 3-5 results for summarization
    const topResults = results.slice(0, 5);
    const resultTexts = topResults.map(r => `${r.title}: ${r.snippet}`).join('\n\n');
    
    try {
      // In a real implementation, this would call an AI service to generate a summary
      // For now, we'll simulate a response with setTimeout
      setTimeout(() => {
        const simulatedSummary = `Based on search results for "${searchQuery}", I found that: 
        
        The main points about this topic include various perspectives and detailed information from multiple sources. The search results indicate this is a topic with significant coverage across different websites and publications.
        
        Key information includes details found in the top results, with consensus among sources about the primary facts related to this query.
        
        Sources: Based on the top ${topResults.length} search results.`;
        
        setSummary(simulatedSummary);
        setIsSummarizing(false);
        
        // Auto-switch to summary tab
        setActiveTab('summary');
        
        toast({
          title: "Summary generated",
          description: "AI summary is now available",
          duration: 3000,
        });
      }, 1500);
    } catch (error) {
      toast({
        title: "Summary generation failed",
        description: "Unable to generate summary at this time",
        variant: "destructive",
        duration: 3000,
      });
      setIsSummarizing(false);
    }
  };

  const useSummary = () => {
    if (!summary) return;
    onSubmitResult(summary);
    onClose();
  };

  const getSavedResults = () => {
    return results.filter((_, index) => savedResults[`result-${index}`]);
  };
  
  const openResultDetail = (result: SearchResult) => {
    setSelectedResult(result);
  };
  
  const closeResultDetail = () => {
    setSelectedResult(null);
  };
  
  const toggleFilter = (filterId: keyof typeof activeFilters) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterId]: !prev[filterId]
    }));
  };
  
  const getActiveFilterCount = () => {
    return Object.values(activeFilters).filter(Boolean).length;
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      if (selectedResult) {
        closeResultDetail();
      } else {
        onClose();
      }
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/50 backdrop-blur-sm"
      onKeyDown={handleKeyDown}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.15 }}
        className="w-full max-w-4xl h-[90vh] sm:h-[85vh] relative"
      >
        <Card className="w-full h-full shadow-xl border-white/20 bg-background/95 flex flex-col overflow-hidden">
          {/* Header section */}
          <CardHeader className="p-3 sm:p-4 border-b border-white/10 flex-shrink-0 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ScanSearch className="h-5 w-5 text-primary" />
                <CardTitle className="text-base sm:text-lg">Web Search</CardTitle>
                <Badge variant="outline" className="ml-1 bg-primary/10 border-primary/30 text-primary hidden sm:flex">
                  Atom
                </Badge>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={onClose}
                      className="h-8 w-8 rounded-full hover:bg-white/10"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="left">Close</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <CardDescription className="text-xs sm:text-sm">Search the web and use results in your conversation</CardDescription>
            
            <form onSubmit={handleSearch} className="mt-2">
              <div className="flex space-x-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    ref={searchInputRef}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Enter search query..."
                    className="pl-10 pr-4 h-10 w-full bg-background border-white/20 focus-visible:ring-primary/50"
                  />
                </div>
                <DropdownMenu open={isFilterMenuOpen} onOpenChange={setIsFilterMenuOpen}>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className={cn(
                        "h-10 w-10 border-white/20 relative",
                        getActiveFilterCount() > 0 && "bg-primary/10 border-primary/30"
                      )}
                    >
                      <Filter className="h-4 w-4" />
                      {getActiveFilterCount() > 0 && (
                        <Badge className="absolute -top-2 -right-2 h-5 min-w-5 flex items-center justify-center p-0 text-xs bg-primary text-primary-foreground">
                          {getActiveFilterCount()}
                        </Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-background/95 backdrop-blur-sm border-white/20">
                    <DropdownMenuItem 
                      onClick={() => toggleFilter('news')}
                      className="flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center">
                        <Newspaper className="h-4 w-4 mr-2" />
                        <span>News Results</span>
                      </div>
                      <Switch checked={activeFilters.news} className="ml-2" />
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => toggleFilter('recent')}
                      className="flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>Recent Content</span>
                      </div>
                      <Switch checked={activeFilters.recent} className="ml-2" />
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button 
                  type="submit" 
                  disabled={isLoading || !searchQuery.trim()}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
                </Button>
              </div>
            </form>
          </CardHeader>
          
          {/* Main content */}
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <div className="px-3 sm:px-4 border-b border-white/10">
              <TabsList className="w-full justify-start border-b-0">
                <TabsTrigger 
                  value="all" 
                  className={cn(
                    "text-xs sm:text-sm data-[state=active]:bg-primary/10",
                    results.length === 0 ? "opacity-50" : "opacity-100"
                  )}
                  disabled={results.length === 0}
                >
                  <Globe className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Results</span>
                  <span className="sm:hidden">Results</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="saved" 
                  className={cn(
                    "text-xs sm:text-sm data-[state=active]:bg-primary/10", 
                    Object.keys(savedResults).length === 0 ? "opacity-50" : "opacity-100"
                  )}
                  disabled={Object.keys(savedResults).length === 0}
                >
                  <Bookmark className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Saved</span>
                  <span className="sm:hidden">Saved</span>
                  {Object.keys(savedResults).length > 0 && (
                    <Badge className="ml-1 h-5 min-w-5 flex items-center justify-center p-0 text-xs">
                      {Object.keys(savedResults).filter(k => savedResults[k]).length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger 
                  value="summary" 
                  className={cn(
                    "text-xs sm:text-sm data-[state=active]:bg-primary/10",
                    results.length === 0 ? "opacity-50" : "opacity-100"
                  )}
                  disabled={results.length === 0}
                >
                  <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">AI Summary</span>
                  <span className="sm:hidden">Summary</span>
                </TabsTrigger>
              </TabsList>
            </div>
            
            <CardContent className="p-0 overflow-hidden flex-1">
              {/* All Results Tab */}
              <TabsContent value="all" className="h-full m-0 data-[state=active]:flex-1 flex flex-col">
                {isLoading ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex-1 flex items-center justify-center"
                  >
                    <div className="flex flex-col items-center">
                      <Loader2 className="h-10 w-10 text-primary animate-spin" />
                      <p className="mt-4 text-sm text-muted-foreground">Searching the web...</p>
                    </div>
                  </motion.div>
                ) : results.length > 0 ? (
                  <>
                    {searchInfo && (
                      <div className="px-3 sm:px-4 py-2 text-xs text-muted-foreground border-b border-white/10 bg-black/20 flex justify-between items-center">
                        <div>
                          About {searchInfo.formattedTotalResults} results ({searchInfo.formattedSearchTime} seconds)
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setActiveTab('summary')}
                          className="h-6 px-2 text-xs flex items-center gap-1"
                          disabled={isSummarizing || summary !== ''}
                        >
                          {summary ? (
                            <>View Summary</>
                          ) : isSummarizing ? (
                            <>
                              <Loader2 className="h-3 w-3 animate-spin" />
                              Generating...
                            </>
                          ) : (
                            <>Generate Summary</>
                          )}
                        </Button>
                      </div>
                    )}
                    
                    <AnimatePresence mode="wait">
                      {selectedResult ? (
                        <motion.div
                          key="detail-view"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="h-full flex flex-col"
                        >
                          <div className="border-b border-white/10 bg-black/30 py-2 px-3 sm:px-4 flex items-center">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={closeResultDetail}
                              className="h-7 mr-2"
                            >
                              <X className="h-3.5 w-3.5 mr-1" /> Back
                            </Button>
                            <h3 className="text-sm font-medium truncate flex-1">{selectedResult.title}</h3>
                          </div>
                          
                          <ScrollArea className="flex-1">
                            <div className="p-4 space-y-4">
                              <div className="space-y-2">
                                <h2 className="text-lg font-semibold">{selectedResult.title}</h2>
                                <a 
                                  href={selectedResult.link} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-xs text-primary hover:underline flex items-center"
                                >
                                  {selectedResult.link}
                                  <ExternalLink className="h-3 w-3 ml-1" />
                                </a>
                                
                                <Separator className="my-3" />
                                
                                {selectedResult.pagemap?.cse_image?.[0]?.src && (
                                  <div className="my-4 flex justify-center">
                                    <img 
                                      src={selectedResult.pagemap.cse_image[0].src}
                                      alt={selectedResult.title}
                                      className="max-h-48 rounded-md border border-white/10"
                                    />
                                  </div>
                                )}
                                
                                <div className="text-sm leading-relaxed space-y-2">
                                  <p>{selectedResult.snippet}</p>
                                </div>
                              </div>
                            </div>
                          </ScrollArea>
                          
                          <div className="border-t border-white/10 p-3 flex justify-between items-center">
                            <div className="flex space-x-2">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleSaveResult(`result-${results.indexOf(selectedResult)}`)}
                              >
                                {savedResults[`result-${results.indexOf(selectedResult)}`] ? (
                                  <>
                                    <BookmarkCheck className="h-4 w-4 mr-1.5 text-primary" />
                                    Saved
                                  </>
                                ) : (
                                  <>
                                    <Bookmark className="h-4 w-4 mr-1.5" />
                                    Save
                                  </>
                                )}
                              </Button>
                              
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => {
                                  navigator.clipboard.writeText(selectedResult.snippet);
                                  toast({ title: "Copied to clipboard", duration: 2000 });
                                }}
                              >
                                <Copy className="h-4 w-4 mr-1.5" />
                                Copy
                              </Button>
                            </div>
                            
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => {
                                handleUseResult(selectedResult);
                                onClose();
                              }}
                              className="bg-primary hover:bg-primary/90"
                            >
                              <CornerRightDown className="h-4 w-4 mr-1.5" />
                              Use in Chat
                            </Button>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="results-list"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="h-full"
                        >
                          <ScrollArea className="h-full">
                            <div className="p-3 sm:p-4 space-y-3">
                              {results.map((result, index) => (
                                <motion.div 
                                  key={index}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.2, delay: index * 0.05 }}
                                  className="group space-y-1.5 p-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                                  onClick={() => openResultDetail(result)}
                                >
                                  <div className="flex items-start justify-between">
                                    <h3 className="text-sm sm:text-base font-medium">
                                      <span className="hover:underline text-primary line-clamp-1">
                                        {result.title}
                                      </span>
                                    </h3>
                                    
                                    <div className="flex space-x-1 ml-2 flex-shrink-0">
                                      <TooltipProvider>
                                        <Tooltip>
                                          <TooltipTrigger asChild onClick={e => {
                                            e.stopPropagation();
                                            handleSaveResult(`result-${index}`);
                                          }}>
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              className="h-7 w-7 p-0 rounded-full"
                                            >
                                              {savedResults[`result-${index}`] ? 
                                                <BookmarkCheck className="h-3.5 w-3.5 text-primary" /> : 
                                                <Bookmark className="h-3.5 w-3.5" />
                                              }
                                            </Button>
                                          </TooltipTrigger>
                                          <TooltipContent side="left" className="text-xs">
                                            {savedResults[`result-${index}`] ? 'Unsave' : 'Save'} result
                                          </TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>
                                    </div>
                                  </div>
                                  
                                  <p className="text-xs text-muted-foreground truncate">{result.link}</p>
                                  <p className="text-xs sm:text-sm line-clamp-2">{result.snippet}</p>
                                  
                                  <div className="pt-1.5 flex justify-end">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleUseResult(result);
                                        onClose();
                                      }}
                                      className="h-7 text-xs bg-primary/10 hover:bg-primary/20 border-primary/30"
                                    >
                                      <CornerRightDown className="h-3 w-3 mr-1" />
                                      Use in Chat
                                    </Button>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </ScrollArea>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex-1 flex items-center justify-center p-4"
                  >
                    <div className="text-center max-w-md mx-auto">
                      <Search className="h-12 w-12 mx-auto text-muted-foreground opacity-20" />
                      <h3 className="mt-4 text-lg font-medium">No search results yet</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Enter a query and hit search to find information
                      </p>
                      <div className="mt-4 space-y-2">
                        <p className="text-xs text-muted-foreground">Try searching for:</p>
                        {["latest news", "climate change solutions", "history of artificial intelligence", "best productivity tips"].map((suggestion, i) => (
                          <Button 
                            key={i}
                            variant="outline" 
                            size="sm"
                            className="mx-1 text-xs border-white/10 hover:bg-white/10"
                            onClick={() => {
                              setSearchQuery(suggestion);
                              performSearch(suggestion);
                            }}
                          >
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </TabsContent>
              
              {/* Saved Results Tab */}
              <TabsContent value="saved" className="h-full m-0 data-[state=active]:flex-1 flex flex-col">
                <ScrollArea className="flex-1">
                  <div className="p-3 sm:p-4">
                    {Object.keys(savedResults).filter(k => savedResults[k]).length > 0 ? (
                      <div className="space-y-3">
                        {results
                          .filter((_, index) => savedResults[`result-${index}`])
                          .map((result, index) => (
                            <motion.div 
                              key={index}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.2, delay: index * 0.05 }}
                              className="p-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                              onClick={() => {
                                const originalIndex = results.findIndex(r => r.link === result.link);
                                if (originalIndex >= 0) {
                                  openResultDetail(result);
                                }
                              }}
                            >
                              <div className="flex items-start justify-between">
                                <h3 className="text-sm font-medium">
                                  <span className="hover:underline text-primary">
                                    {result.title}
                                  </span>
                                </h3>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 w-7 p-0 rounded-full ml-2"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const originalIndex = results.findIndex(r => r.link === result.link);
                                    if (originalIndex >= 0) {
                                      handleSaveResult(`result-${originalIndex}`);
                                    }
                                  }}
                                >
                                  <BookmarkCheck className="h-3.5 w-3.5 text-primary" />
                                </Button>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1 truncate">{result.link}</p>
                              <p className="text-xs sm:text-sm mt-1.5 line-clamp-2">{result.snippet}</p>
                              
                              <div className="mt-3 flex justify-end">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleUseResult(result);
                                    onClose();
                                  }}
                                  className="h-7 text-xs bg-primary/10 hover:bg-primary/20 border-primary/30"
                                >
                                  <CornerRightDown className="h-3 w-3 mr-1" />
                                  Use in Chat
                                </Button>
                              </div>
                            </motion.div>
                          ))}
                      </div>
                    ) : (
                      <div className="text-center py-10">
                        <Bookmark className="h-12 w-12 mx-auto text-muted-foreground opacity-20" />
                        <h3 className="mt-4 text-lg font-medium">No saved results</h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                          Bookmark search results to save them for later
                        </p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
              
              {/* Summary Tab */}
              <TabsContent value="summary" className="h-full m-0 data-[state=active]:flex-1 flex flex-col">
                <div className="flex-1 flex flex-col">
                  {results.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-center">
                        <FileText className="h-12 w-12 mx-auto text-muted-foreground opacity-20" />
                        <h3 className="mt-4 text-lg font-medium">No search performed</h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                          Perform a search to generate an AI summary
                        </p>
                      </div>
                    </div>
                  ) : summary ? (
                    <div className="flex-1 flex flex-col p-3 sm:p-4">
                      <Card className="flex-1 border border-white/10 bg-black/20 shadow-md">
                        <CardHeader className="p-3 sm:p-4 pb-0 sm:pb-2">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base sm:text-lg">AI Summary</CardTitle>
                            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                              Based on top results
                            </Badge>
                          </div>
                          <CardDescription className="text-xs sm:text-sm">Generated from search results for "{searchQuery}"</CardDescription>
                        </CardHeader>
                        <CardContent className="p-3 sm:p-4 pt-2">
                          <ScrollArea className="h-[30vh] sm:h-[35vh]">
                            <div className="whitespace-pre-line text-sm leading-relaxed">{summary}</div>
                          </ScrollArea>
                        </CardContent>
                        <CardFooter className="flex justify-between border-t border-white/10 p-3 sm:p-4">
                          <div className="flex space-x-2">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="h-8 text-xs border-white/10"
                                    onClick={() => {
                                      navigator.clipboard.writeText(summary);
                                      toast({ title: "Summary copied to clipboard", duration: 2000 });
                                    }}
                                  >
                                    <Copy className="h-3.5 w-3.5 mr-1.5" />
                                    Copy
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent side="bottom">Copy to clipboard</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="h-8 text-xs border-white/10"
                                    onClick={() => {
                                      setSummary('');
                                      toast({ title: "Summary cleared", duration: 2000 });
                                      generateSummary();
                                    }}
                                  >
                                    <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                                    Regenerate
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent side="bottom">Generate a new summary</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                          
                          <Button
                            onClick={() => {
                              useSummary();
                            }}
                            size="sm"
                            className="h-8 text-xs bg-primary hover:bg-primary/90"
                          >
                            <CornerRightDown className="h-3.5 w-3.5 mr-1.5" />
                            Use Summary in Chat
                          </Button>
                        </CardFooter>
                      </Card>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-4">
                      <div className="text-center max-w-md">
                        <FileText className="h-16 w-16 mx-auto text-primary/20 mb-4" />
                        <h3 className="text-lg font-medium mb-2">Generate AI Summary</h3>
                        <p className="text-sm text-muted-foreground mb-6">
                          Create a concise summary of your search results to quickly understand the main points
                        </p>
                        <Button 
                          onClick={generateSummary} 
                          disabled={isSummarizing || results.length === 0}
                          className="bg-primary hover:bg-primary/90"
                        >
                          {isSummarizing ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Generating Summary...
                            </>
                          ) : (
                            <>
                              <FileText className="h-4 w-4 mr-2" />
                              Generate Summary
                            </>
                          )}
                        </Button>
                        <p className="text-xs text-muted-foreground mt-4">
                          AI will analyze the top search results to create a comprehensive summary
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </motion.div>
    </div>
  );
} 