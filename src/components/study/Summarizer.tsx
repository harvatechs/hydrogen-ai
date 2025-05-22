
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Card, 
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Loader2, 
  FileText, 
  Check, 
  X, 
  Copy,
  FileDown, 
  FileUp
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { summarizeContent, SummaryOptions } from "@/utils/studyAids";
import { validateAndSanitizeInput } from "@/utils/securityUtils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface SummarizerProps {
  onClose: () => void;
  onSubmitSummary: (summaryHtml: string) => void;
}

export const Summarizer: React.FC<SummarizerProps> = ({
  onClose,
  onSubmitSummary
}) => {
  const [content, setContent] = useState("");
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("input");
  const [errorMessage, setErrorMessage] = useState("");
  const [summaryLength, setSummaryLength] = useState<'short' | 'medium' | 'long'>('medium');
  const [includeKeyPoints, setIncludeKeyPoints] = useState(true);
  
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const validation = validateAndSanitizeInput(e.target.value);
    if (validation.isValid) {
      setContent(validation.sanitizedInput || e.target.value);
      setErrorMessage("");
    } else {
      setErrorMessage(validation.message || "Invalid input");
    }
  };
  
  const handleSummarize = async () => {
    if (!content.trim()) {
      setErrorMessage("Please enter content to summarize");
      return;
    }
    
    setIsLoading(true);
    setErrorMessage("");
    
    try {
      const options: SummaryOptions = {
        length: summaryLength,
        includeKeyPoints
      };
      
      const result = await summarizeContent(content, options);
      setSummary(result);
      setActiveTab("summary");
      
      toast({
        title: "Summary Generated",
        description: `Created a ${summaryLength} summary of your content`
      });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to generate summary");
      toast({
        title: "Error",
        description: "Failed to generate summary",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCopy = () => {
    navigator.clipboard.writeText(summary).then(() => {
      toast({
        title: "Copied",
        description: "Summary copied to clipboard"
      });
    }).catch(() => {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive"
      });
    });
  };
  
  const handleSubmit = () => {
    if (!summary.trim()) {
      return;
    }
    
    // Convert line breaks to HTML
    const formattedSummary = summary
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br />');
    
    // Create HTML representation
    const htmlContent = `
      <div class="space-y-4 mt-4">
        <div class="border border-white/10 rounded-lg p-4 bg-black/20">
          <h3 class="text-blue-400 font-medium mb-2">Summary (${summaryLength}):</h3>
          <div class="text-muted-foreground">
            <p>${formattedSummary}</p>
          </div>
        </div>
      </div>
    `;
    
    onSubmitSummary(htmlContent);
  };
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.type !== 'text/plain' && !file.type.includes('document')) {
      toast({
        title: "Invalid File",
        description: "Please upload a text or document file",
        variant: "destructive"
      });
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        // Validate and set content
        const validation = validateAndSanitizeInput(text);
        if (validation.isValid) {
          setContent(validation.sanitizedInput || text);
        } else {
          toast({
            title: "Warning",
            description: "The file contained potentially unsafe content that was sanitized",
            variant: "destructive"
          });
          setContent(validation.sanitizedInput || '');
        }
      }
    };
    
    reader.readAsText(file);
    
    // Reset file input
    e.target.value = '';
  };
  
  return (
    <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl shadow-xl border-white/10 dark:bg-black/90 light:bg-white/95">
        <CardHeader className="border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-green-400" />
              <CardTitle>Text Summarizer</CardTitle>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription>
            Create concise summaries of long text
          </CardDescription>
        </CardHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="px-6 pt-4 border-b border-white/10">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="input">Input</TabsTrigger>
              <TabsTrigger value="summary" disabled={!summary.trim()}>Summary</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="input" className="p-0 m-0">
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">Paste your content</label>
                <div>
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    accept=".txt,.doc,.docx,.pdf"
                    onChange={handleFileUpload}
                  />
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => document.getElementById('file-upload')?.click()}
                    className="text-xs"
                  >
                    <FileUp className="h-3.5 w-3.5 mr-1" />
                    Upload File
                  </Button>
                </div>
              </div>
              
              <Textarea 
                placeholder="Enter or paste text to summarize..." 
                value={content}
                onChange={handleContentChange}
                rows={10}
                className="dark:bg-black/40 light:bg-white/90 min-h-[200px] resize-none"
              />
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Summary Length</h4>
                  <RadioGroup value={summaryLength} onValueChange={(v) => setSummaryLength(v as 'short' | 'medium' | 'long')} className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="short" id="short" />
                      <Label htmlFor="short">Short</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="medium" id="medium" />
                      <Label htmlFor="medium">Medium</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="long" id="long" />
                      <Label htmlFor="long">Long</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="include-key-points" 
                    checked={includeKeyPoints}
                    onCheckedChange={(checked) => setIncludeKeyPoints(checked === true)}
                  />
                  <Label htmlFor="include-key-points">Include key points</Label>
                </div>
              </div>
              
              {errorMessage && (
                <div className="text-red-500 text-sm mt-2">
                  {errorMessage}
                </div>
              )}
            </CardContent>
          </TabsContent>
          
          <TabsContent value="summary" className="p-0 m-0">
            <CardContent className="p-6">
              {summary ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20">
                      {summaryLength.charAt(0).toUpperCase() + summaryLength.slice(1)} Summary
                    </Badge>
                    <Button variant="ghost" size="sm" onClick={handleCopy}>
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </Button>
                  </div>
                  
                  <ScrollArea className="h-[300px] border rounded-md dark:bg-black/40 light:bg-white/90 p-4">
                    <div className="whitespace-pre-wrap">{summary}</div>
                  </ScrollArea>
                </div>
              ) : (
                <div className="text-center py-10">
                  <FileText className="mx-auto h-10 w-10 text-muted-foreground" />
                  <h3 className="mt-2 text-lg font-medium">No Summary Yet</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Generate a summary to view it here
                  </p>
                </div>
              )}
            </CardContent>
          </TabsContent>
        </Tabs>
        
        <CardFooter className="border-t border-white/10 p-6 flex justify-between">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          
          {activeTab === "input" ? (
            <Button 
              onClick={handleSummarize} 
              disabled={!content.trim() || isLoading}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Summarizing...
                </>
              ) : (
                <>
                  <FileDown className="mr-2 h-4 w-4" />
                  Summarize
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              className="bg-green-600 hover:bg-green-700 text-white"
              disabled={!summary.trim()}
            >
              <Check className="mr-2 h-4 w-4" />
              Use Summary
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};
