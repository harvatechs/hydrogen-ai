
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Loader2, BookOpen, BookText, Plus, Download, X } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { generateFlashcards, Flashcard } from "@/utils/studyAids";
import { validateAndSanitizeInput } from "@/utils/securityUtils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface FlashcardGeneratorProps {
  onClose: () => void;
  onSubmitFlashcards: (flashcardsHtml: string) => void;
}

export const FlashcardGenerator: React.FC<FlashcardGeneratorProps> = ({
  onClose,
  onSubmitFlashcards
}) => {
  const [topic, setTopic] = useState("");
  const [content, setContent] = useState("");
  const [numCards, setNumCards] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [activeTab, setActiveTab] = useState("create");
  const [errorMessage, setErrorMessage] = useState("");
  
  const handleTopicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const validation = validateAndSanitizeInput(e.target.value);
    if (validation.isValid) {
      setTopic(validation.sanitizedInput || e.target.value);
      setErrorMessage("");
    } else {
      setErrorMessage(validation.message || "Invalid input");
    }
  };
  
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const validation = validateAndSanitizeInput(e.target.value);
    if (validation.isValid) {
      setContent(validation.sanitizedInput || e.target.value);
      setErrorMessage("");
    } else {
      setErrorMessage(validation.message || "Invalid input");
    }
  };
  
  const handleGenerate = async () => {
    if (!topic.trim() && !content.trim()) {
      setErrorMessage("Please enter a topic or content to generate flashcards");
      return;
    }
    
    setIsLoading(true);
    setErrorMessage("");
    
    try {
      // Use a combination of topic and content
      const inputText = content.trim() 
        ? content 
        : `Generate flashcards about ${topic}`;
      
      const cards = await generateFlashcards(inputText, numCards);
      setFlashcards(cards);
      setActiveTab("view");
      
      toast({
        title: "Flashcards Generated",
        description: `Created ${cards.length} flashcards on ${topic || 'your topic'}`
      });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to generate flashcards");
      toast({
        title: "Error",
        description: "Failed to generate flashcards",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSubmit = () => {
    if (flashcards.length === 0) {
      toast({
        title: "No Flashcards",
        description: "Please generate flashcards first",
        variant: "destructive"
      });
      return;
    }
    
    // Create HTML representation of the flashcards
    const htmlContent = `
      <h2>Flashcards: ${topic || 'Study Material'}</h2>
      <div class="space-y-4 mt-4">
        ${flashcards.map((card, index) => `
          <div class="border border-white/10 rounded-lg p-4 bg-black/20">
            <h3 class="text-blue-400 font-medium mb-2">Question: ${card.front}</h3>
            <p class="text-muted-foreground">Answer: ${card.back}</p>
          </div>
        `).join('')}
      </div>
      <p class="mt-4">These flashcards cover key concepts related to ${topic || 'your topic'}. Use them for studying and knowledge retention.</p>
    `;
    
    onSubmitFlashcards(htmlContent);
  };
  
  const handleNumCardsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0 && value <= 20) {
      setNumCards(value);
    }
  };
  
  return (
    <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl shadow-xl border-white/10 dark:bg-black/90 light:bg-white/95">
        <CardHeader className="border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cards className="h-5 w-5 text-blue-400" />
              <CardTitle>Flashcard Generator</CardTitle>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription>
            Create flashcards from your study material or topic
          </CardDescription>
        </CardHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="px-6 pt-4 border-b border-white/10">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="create">Create</TabsTrigger>
              <TabsTrigger value="view" disabled={flashcards.length === 0}>View</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="create" className="p-0 m-0">
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Topic</label>
                <Input 
                  placeholder="Enter a topic for your flashcards" 
                  value={topic}
                  onChange={handleTopicChange}
                  className="dark:bg-black/40 light:bg-white/90"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Content (Optional)</label>
                <Textarea 
                  placeholder="Paste content to generate flashcards from" 
                  value={content}
                  onChange={handleContentChange}
                  rows={6}
                  className="dark:bg-black/40 light:bg-white/90 min-h-[100px] resize-none"
                />
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-32 space-y-2">
                  <label className="text-sm font-medium">Number of Cards</label>
                  <Input 
                    type="number"
                    min="1"
                    max="20"
                    value={numCards}
                    onChange={handleNumCardsChange}
                    className="dark:bg-black/40 light:bg-white/90"
                  />
                </div>
              </div>
              
              {errorMessage && (
                <div className="text-red-500 text-sm mt-2">
                  {errorMessage}
                </div>
              )}
            </CardContent>
          </TabsContent>
          
          <TabsContent value="view" className="p-0 m-0">
            <CardContent className="p-6">
              {flashcards.length > 0 ? (
                <ScrollArea className="h-80">
                  <div className="space-y-4">
                    {flashcards.map((card, index) => (
                      <Card key={card.id} className="border-white/10 dark:bg-black/40 light:bg-white/90">
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Badge className="mr-2 bg-blue-500/20 text-blue-400 border-blue-500/30">
                                Card {index + 1}
                              </Badge>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="space-y-4">
                            <div>
                              <h4 className="text-sm font-medium text-blue-400">Question:</h4>
                              <p className="mt-1">{card.front}</p>
                            </div>
                            <Separator />
                            <div>
                              <h4 className="text-sm font-medium text-green-400">Answer:</h4>
                              <p className="mt-1">{card.back}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="text-center py-10">
                  <BookOpen className="mx-auto h-10 w-10 text-muted-foreground" />
                  <h3 className="mt-2 text-lg font-medium">No Flashcards Yet</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Generate flashcards to view them here
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
          
          {activeTab === "create" ? (
            <Button 
              onClick={handleGenerate} 
              disabled={(!topic.trim() && !content.trim()) || isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Generate Flashcards
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={flashcards.length === 0}
            >
              <Download className="mr-2 h-4 w-4" />
              Use Flashcards
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};
