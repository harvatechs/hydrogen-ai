
import { useState, useRef, FormEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Search, ThumbsUp, ThumbsDown, RefreshCw, Copy, Share } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";
import { fetchAnswer } from '@/utils/answerEngineApi';

export function AnswerEngine() {
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastQuery, setLastQuery] = useState('');
  const [feedbackGiven, setFeedbackGiven] = useState<'positive' | 'negative' | null>(null);
  const answerRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;
    
    setIsLoading(true);
    setAnswer('');
    setLastQuery(query);
    setFeedbackGiven(null);
    
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

  return (
    <div className="container mx-auto py-6 max-w-4xl px-4">
      <Card className="shadow-lg border dark:border-white/10 light:border-black/10">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gemini-purple to-blue-500">
              Answer Engine
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
          
          {isLoading && (
            <div className="flex flex-col items-center py-10 space-y-4">
              <Loader2 className="h-10 w-10 text-gemini-purple animate-spin" />
              <p className="text-muted-foreground text-center">Generating comprehensive answer...</p>
            </div>
          )}
          
          {!isLoading && answer && (
            <div className="mt-4">
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
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
