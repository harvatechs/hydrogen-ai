
import { useState, useRef, FormEvent, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Search, ThumbsUp, ThumbsDown, RefreshCw, Copy, Share, History, Lightbulb, Zap } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";
import { fetchAnswer } from '@/utils/answerEngineApi';
import { searchGoogle, SearchResult } from '@/utils/searchUtils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

export function AnswerEngine() {
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastQuery, setLastQuery] = useState('');
  const [feedbackGiven, setFeedbackGiven] = useState<'positive' | 'negative' | null>(null);
  const [queryHistory, setQueryHistory] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const answerRef = useRef<HTMLDivElement>(null);

  // Load query history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('vireon-query-history');
    if (savedHistory) {
      try {
        setQueryHistory(JSON.parse(savedHistory).slice(0, 10));
      } catch (e) {
        console.error('Error loading query history:', e);
      }
    }
  }, []);

  // Save query history to localStorage when it changes
  useEffect(() => {
    if (queryHistory.length > 0) {
      localStorage.setItem('vireon-query-history', JSON.stringify(queryHistory.slice(0, 10)));
    }
  }, [queryHistory]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;
    
    // Add query to history if it's not already the most recent
    if (queryHistory.length === 0 || queryHistory[0] !== query) {
      setQueryHistory(prev => [query, ...prev.slice(0, 9)]);
    }
    
    setIsLoading(true);
    setAnswer('');
    setLastQuery(query);
    setFeedbackGiven(null);
    setSearchResults([]);
    
    // First, fetch search results
    setIsSearching(true);
    try {
      const results = await searchGoogle(query);
      if (results && results.items) {
        setSearchResults(results.items);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
    
    // Then, get AI answer
    try {
      const response = await fetchAnswer(query);
      
      if (response.isError) {
        toast({
          title: "Error generating answer",
          description: response.errorMessage || "Please try again later",
          variant: "destructive"
        });
      } else {
        setAnswer(response.content);
      }
    } catch (error) {
      toast({
        title: "Failed to get answer",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const useHistoryQuery = (historyQuery: string) => {
    setQuery(historyQuery);
  };

  const handleCopy = () => {
    if (answerRef.current) {
      const text = answerRef.current.innerText;
      navigator.clipboard.writeText(text)
        .then(() => {
          toast({
            title: "Copied to clipboard",
            description: "Answer has been copied to your clipboard.",
            duration: 2000,
          });
        })
        .catch(err => {
          toast({
            title: "Copy failed",
            description: "Failed to copy the answer. Please try again.",
            variant: "destructive",
          });
        });
    }
  };

  const handleShare = () => {
    if (navigator.share && lastQuery && answer) {
      navigator.share({
        title: 'Vireon Answer',
        text: `Question: ${lastQuery}\n\nAnswer: ${answerRef.current?.innerText || answer}`
      }).catch(err => {
        console.error('Share failed:', err);
      });
    } else {
      toast({
        title: "Share not supported",
        description: "Web Share API is not supported on this browser.",
        variant: "destructive",
      });
    }
  };

  const handleFeedback = (type: "positive" | "negative") => {
    setFeedbackGiven(type);
    toast({
      title: type === "positive" ? "Thank you for your feedback!" : "We'll work to improve",
      description: type === "positive" 
        ? "We're glad this was helpful." 
        : "Thank you for helping us improve our answers.",
      duration: 3000,
    });
  };

  const handleRegen = async () => {
    if (!lastQuery || isLoading) return;
    
    setIsLoading(true);
    setAnswer('');
    setFeedbackGiven(null);
    
    try {
      const response = await fetchAnswer(lastQuery);
      
      if (response.isError) {
        toast({
          title: "Error regenerating answer",
          description: response.errorMessage || "Please try again later",
          variant: "destructive"
        });
      } else {
        setAnswer(response.content);
      }
    } catch (error) {
      toast({
        title: "Failed to regenerate answer",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderHistorySuggestions = () => {
    if (queryHistory.length === 0) return null;
    
    return (
      <div className="mt-4">
        <h3 className="text-sm font-medium mb-2 text-muted-foreground flex items-center">
          <History className="h-3.5 w-3.5 mr-1" /> Recent Questions
        </h3>
        <div className="flex flex-wrap gap-2">
          {queryHistory.slice(0, 5).map((historyItem, index) => (
            <Button 
              key={index} 
              variant="outline" 
              size="sm" 
              className="text-xs h-7"
              onClick={() => useHistoryQuery(historyItem)}
            >
              {historyItem.length > 30 ? `${historyItem.slice(0, 30)}...` : historyItem}
            </Button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto py-6 max-w-4xl px-4">
      <Card className="shadow-lg border dark:border-white/10 light:border-black/10">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gemini-purple to-blue-500">
              Vireon Answer Engine
            </span>
          </CardTitle>
          <CardDescription className="text-center">
            Ask any question to get a detailed, structured answer
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="mb-6">
            <div className="flex items-center space-x-2">
              <div className="relative flex-grow">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                  <Search className="h-4 w-4" />
                </div>
                <Input 
                  placeholder="Ask a question..." 
                  value={query} 
                  onChange={(e) => setQuery(e.target.value)} 
                  className="pl-10 py-6"
                  disabled={isLoading}
                />
              </div>
              <Button 
                type="submit" 
                className="bg-gemini-purple hover:bg-gemini-purple/90 text-white"
                disabled={!query.trim() || isLoading}
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Ask"}
              </Button>
            </div>
          </form>
          
          {!isLoading && !answer && !lastQuery && renderHistorySuggestions()}
          
          {isLoading && (
            <div className="flex flex-col items-center py-10 space-y-4">
              <Loader2 className="h-10 w-10 text-gemini-purple animate-spin" />
              <p className="text-muted-foreground text-center">Generating comprehensive answer...</p>
            </div>
          )}
          
          {!isLoading && answer && (
            <div className="mt-4">
              <Tabs defaultValue="answer" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="answer" className="flex items-center gap-2">
                    <Lightbulb className="h-4 w-4" />
                    <span>AI Answer</span>
                  </TabsTrigger>
                  <TabsTrigger value="sources" className="flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    <span>Web Sources</span>
                    {searchResults.length > 0 && (
                      <Badge variant="outline" className="ml-1">{searchResults.length}</Badge>
                    )}
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="answer">
                  <div className="bg-card rounded-lg p-4 border dark:border-white/10 light:border-black/10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-sm font-medium text-muted-foreground">
                        Answer to: <span className="text-primary">{lastQuery}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full"
                          onClick={handleCopy}
                          title="Copy answer"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full"
                          onClick={handleShare}
                          title="Share answer"
                        >
                          <Share className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full"
                          onClick={handleRegen}
                          title="Regenerate answer"
                          disabled={isLoading}
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <ScrollArea className="h-[60vh] pr-4">
                      <div 
                        ref={answerRef}
                        className="prose prose-invert dark:prose-invert prose-headings:text-gemini-yellow prose-headings:font-semibold prose-h1:text-xl prose-h2:text-lg prose-h3:text-base prose-p:text-muted-foreground prose-a:text-blue-400 prose-strong:text-white prose-strong:font-semibold prose-em:text-yellow-200 prose-blockquote:border-l-2 prose-blockquote:border-gemini-yellow/50 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-muted-foreground/80 max-w-none"
                        dangerouslySetInnerHTML={{ __html: answer }}
                      />
                    </ScrollArea>
                    
                    <div className="flex items-center justify-between mt-6 pt-4 border-t dark:border-white/10 light:border-black/10">
                      <div className="text-xs text-muted-foreground">
                        Powered by Gemini 2.0 Flash
                      </div>
                      
                      {!feedbackGiven ? (
                        <div className="flex items-center space-x-1">
                          <span className="text-xs text-muted-foreground mr-2">Was this answer helpful?</span>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-8 w-8 rounded-full hover:bg-green-500/20 hover:text-green-400" 
                            onClick={() => handleFeedback("positive")}
                          >
                            <ThumbsUp className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-8 w-8 rounded-full hover:bg-red-500/20 hover:text-red-400" 
                            onClick={() => handleFeedback("negative")}
                          >
                            <ThumbsDown className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="text-xs">
                          {feedbackGiven === "positive" ? 
                            <span className="text-green-400 flex items-center"><ThumbsUp className="h-3 w-3 mr-1" /> Thank you for your feedback</span> : 
                            <span className="text-amber-400 flex items-center"><ThumbsDown className="h-3 w-3 mr-1" /> We'll work to improve</span>
                          }
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="sources">
                  <div className="bg-card rounded-lg p-4 border dark:border-white/10 light:border-black/10">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold mb-1">Web Sources</h3>
                      <p className="text-sm text-muted-foreground">
                        These sources were used to supplement and verify the AI-generated answer.
                      </p>
                    </div>
                    
                    <ScrollArea className="h-[60vh]">
                      {isSearching ? (
                        <div className="flex items-center justify-center py-8">
                          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                      ) : searchResults.length > 0 ? (
                        <div className="space-y-4">
                          {searchResults.map((result, index) => (
                            <div key={index} className="border dark:border-white/10 light:border-black/10 rounded-lg p-3 hover:bg-card/80">
                              <a 
                                href={result.link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:text-blue-600 font-medium block mb-1"
                              >
                                {result.title}
                              </a>
                              <div className="text-xs text-muted-foreground mb-2">
                                {result.displayLink || result.link}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {result.snippet}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <Search className="h-8 w-8 mx-auto mb-2 opacity-30" />
                          <p>No sources available for this query.</p>
                        </div>
                      )}
                    </ScrollArea>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
