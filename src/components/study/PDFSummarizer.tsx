
import React, { useState, useRef, useEffect } from 'react';
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
import {
  Loader2,
  FileText,
  Check,
  X,
  Copy,
  FileUp,
  Download,
  FileQuestion
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { summarizeContent, SummaryOptions } from "@/utils/studyAids";
import { validateAndSanitizeInput } from "@/utils/securityUtils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import * as pdfjs from 'pdfjs-dist';

// Import worker URL 
import { PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist';

// Configure pdfjs worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PDFSummarizerProps {
  onClose: () => void;
  onSubmitSummary: (summaryHtml: string) => void;
}

export const PDFSummarizer: React.FC<PDFSummarizerProps> = ({
  onClose,
  onSubmitSummary
}) => {
  const [pdfContent, setPdfContent] = useState("");
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState("upload");
  const [errorMessage, setErrorMessage] = useState("");
  const [summaryLength, setSummaryLength] = useState<'short' | 'medium' | 'long'>('medium');
  const [includeKeyPoints, setIncludeKeyPoints] = useState(true);
  const [fileName, setFileName] = useState("");
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [processingProgress, setProcessingProgress] = useState(0);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const extractTextFromPDF = async (file: File): Promise<string> => {
    setIsProcessing(true);
    setProcessingProgress(0);
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      setPageCount(pdf.numPages);
      
      let fullText = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        setCurrentPage(i);
        setProcessingProgress(Math.floor((i / pdf.numPages) * 100));
        
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(' ');
        fullText += pageText + '\n\n';
      }
      
      return fullText;
    } catch (error) {
      console.error('Error extracting text from PDF:', error);
      throw new Error('Failed to extract text from PDF');
    } finally {
      setIsProcessing(false);
      setProcessingProgress(100);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast({
        title: "Invalid File",
        description: "Please upload a PDF file",
        variant: "destructive"
      });
      return;
    }

    setFileName(file.name);
    setIsLoading(true);
    setErrorMessage("");

    try {
      const text = await extractTextFromPDF(file);
      setPdfContent(text);
      setActiveTab("content");
      
      toast({
        title: "PDF Loaded",
        description: `Successfully extracted ${text.length} characters from ${file.name}`
      });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to process PDF file");
      toast({
        title: "Error",
        description: "Failed to process PDF file",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const validation = validateAndSanitizeInput(e.target.value);
    if (validation.isValid) {
      setPdfContent(validation.sanitizedInput || e.target.value);
      setErrorMessage("");
    } else {
      setErrorMessage(validation.message || "Invalid input");
    }
  };

  const handleSummarize = async () => {
    if (!pdfContent.trim()) {
      setErrorMessage("Please upload a PDF or enter text to summarize");
      return;
    }
    
    setIsLoading(true);
    setErrorMessage("");
    
    try {
      const options: SummaryOptions = {
        length: summaryLength,
        includeKeyPoints
      };
      
      const result = await summarizeContent(pdfContent, options);
      setSummary(result);
      setActiveTab("summary");
      
      toast({
        title: "Summary Generated",
        description: `Created a ${summaryLength} summary of your PDF`
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
          <h3 class="text-blue-400 font-medium mb-2">PDF Summary: ${fileName || 'Document'}</h3>
          <div class="text-muted-foreground">
            <p>${formattedSummary}</p>
          </div>
        </div>
      </div>
    `;
    
    onSubmitSummary(htmlContent);
  };

  return (
    <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl shadow-xl border-white/10 dark:bg-black/90 light:bg-white/95">
        <CardHeader className="border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-400" />
              <CardTitle>PDF Summarizer</CardTitle>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription>
            Upload a PDF file and create a concise summary
          </CardDescription>
        </CardHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="px-6 pt-4 border-b border-white/10">
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="upload">Upload</TabsTrigger>
              <TabsTrigger value="content" disabled={!pdfContent.trim()}>Content</TabsTrigger>
              <TabsTrigger value="summary" disabled={!summary.trim()}>Summary</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="upload" className="p-0 m-0">
            <CardContent className="p-6 space-y-4">
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center">
                <input
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
                <div className="flex flex-col items-center justify-center gap-3">
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
                      <div className="text-lg font-semibold">Processing PDF...</div>
                      <div className="text-sm text-muted-foreground">
                        Page {currentPage} of {pageCount}
                      </div>
                      <Progress value={processingProgress} className="w-64" />
                    </>
                  ) : (
                    <>
                      <FileQuestion className="h-16 w-16 text-gray-400" />
                      <h3 className="text-lg font-semibold">Upload a PDF file</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Drag and drop or click to browse
                      </p>
                      <Button 
                        onClick={handleFileSelect} 
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <FileUp className="h-4 w-4 mr-2" />
                        Select PDF File
                      </Button>
                    </>
                  )}
                </div>
              </div>
              
              {fileName && (
                <div className="bg-blue-900/20 border border-blue-500/30 rounded p-3 flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-blue-400 mr-2" />
                    <span className="text-sm">{fileName}</span>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => setActiveTab("content")}>
                    View Content
                  </Button>
                </div>
              )}
              
              {errorMessage && (
                <div className="text-red-500 text-sm mt-2">
                  {errorMessage}
                </div>
              )}
            </CardContent>
          </TabsContent>
          
          <TabsContent value="content" className="p-0 m-0">
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label>PDF Content</Label>
                <Textarea 
                  placeholder="PDF content will appear here. You can edit if needed." 
                  value={pdfContent}
                  onChange={handleContentChange}
                  rows={10}
                  className="dark:bg-black/40 light:bg-white/90 min-h-[200px] resize-none"
                />
              </div>
              
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
              
              <div className="flex justify-end">
                <Button 
                  onClick={handleSummarize} 
                  disabled={!pdfContent.trim() || isLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Summarizing...
                    </>
                  ) : (
                    <>
                      <FileText className="mr-2 h-4 w-4" />
                      Generate Summary
                    </>
                  )}
                </Button>
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
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-400" />
                      <span className="font-medium">{fileName || 'Document'} Summary</span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={handleCopy}>
                        <Copy className="h-4 w-4 mr-1" />
                        Copy
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
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
          
          {activeTab === "summary" && (
            <Button
              onClick={handleSubmit}
              className="bg-blue-600 hover:bg-blue-700 text-white"
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
