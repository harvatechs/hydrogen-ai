import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Bookmark, X, ChevronLeft, ChevronRight, Download, Shuffle, RefreshCw, RotateCw, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";

interface FlashcardMakerProps {
  initialQuery?: string;
  onClose: () => void;
  onSubmitResult: (flashcards: string) => void;
}

interface Flashcard {
  id: string;
  front: string;
  back: string;
}

export function FlashcardMaker({ initialQuery = "", onClose, onSubmitResult }: FlashcardMakerProps) {
  const [topic, setTopic] = useState(initialQuery);
  const [context, setContext] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("create");
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [numCards, setNumCards] = useState("5");

  useEffect(() => {
    if (initialQuery) {
      setTopic(initialQuery);
    }
  }, [initialQuery]);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError("Please enter a topic for your flashcards.");
      return;
    }

    setIsLoading(true);
    setError("");
    setFlashcards([]);

    try {
      // In a real implementation, this would call the Gemini API to generate flashcards
      // For now, we'll simulate it with a timeout
      setTimeout(() => {
        // Generate example flashcards
        const numToGenerate = parseInt(numCards, 10) || 5;
        const generatedCards: Flashcard[] = [];
        
        // Machine Learning example cards
        const mlCards = [
          { front: "What is machine learning?", back: "Machine learning is a subset of artificial intelligence that enables systems to learn and improve from experience without being explicitly programmed." },
          { front: "What is supervised learning?", back: "Supervised learning is a type of machine learning where the model is trained on labeled data, learning to map inputs to known outputs." },
          { front: "What is unsupervised learning?", back: "Unsupervised learning is a type of machine learning where the model finds patterns in unlabeled data without explicit guidance." },
          { front: "What is reinforcement learning?", back: "Reinforcement learning is a type of machine learning where an agent learns to make decisions by taking actions in an environment to maximize a reward." },
          { front: "What is deep learning?", back: "Deep learning is a subset of machine learning that uses neural networks with multiple layers (deep neural networks) to analyze various factors of data." },
          { front: "What is overfitting?", back: "Overfitting occurs when a machine learning model learns the training data too well, including its noise and outliers, performing poorly on new, unseen data." },
          { front: "What is cross-validation?", back: "Cross-validation is a technique to evaluate machine learning models by training several models on different subsets of the available data and evaluating them on the complementary subset." }
        ];
        
        // History example cards
        const historyCards = [
          { front: "When did World War I begin?", back: "World War I began on July 28, 1914, and lasted until November 11, 1918." },
          { front: "Who was the first president of the United States?", back: "George Washington was the first president of the United States, serving from 1789 to 1797." },
          { front: "What was the Renaissance?", back: "The Renaissance was a period of European cultural, artistic, political, and economic 'rebirth' following the Middle Ages, spanning roughly from the 14th to the 17th century." },
          { front: "When did the Soviet Union dissolve?", back: "The Soviet Union dissolved on December 26, 1991, following the Belavezha Accords which declared the Soviet Union would cease to exist." },
          { front: "What was the Industrial Revolution?", back: "The Industrial Revolution was a period of transition to new manufacturing processes occurring from about 1760 to sometime between 1820 and 1840." },
          { front: "What was the significance of the Magna Carta?", back: "The Magna Carta, signed in 1215, established the principle that everyone, including the king, was subject to the law, and guaranteed certain rights and liberties." }
        ];
        
        // Select appropriate set based on topic
        let sourceCards = mlCards;
        if (topic.toLowerCase().includes("history") || topic.toLowerCase().includes("war") || topic.toLowerCase().includes("president")) {
          sourceCards = historyCards;
        }
        
        // Generate the requested number of cards
        for (let i = 0; i < numToGenerate && i < sourceCards.length; i++) {
          generatedCards.push({
            id: `card-${i}`,
            front: sourceCards[i].front,
            back: sourceCards[i].back
          });
        }
        
        setFlashcards(generatedCards);
        setActiveTab("review");
        setIsLoading(false);
        setCurrentCardIndex(0);
        setIsFlipped(false);
        
        toast({
          title: "Flashcards Generated",
          description: `Created ${generatedCards.length} flashcards on ${topic}`
        });
      }, 2000);
    } catch (err) {
      setError("Failed to generate flashcards. Please try again.");
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    if (currentCardIndex < flashcards.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(prev => prev - 1);
      setIsFlipped(false);
    }
  };

  const handleFlip = () => {
    setIsFlipped(prev => !prev);
  };

  const handleShuffle = () => {
    const shuffled = [...flashcards].sort(() => Math.random() - 0.5);
    setFlashcards(shuffled);
    setCurrentCardIndex(0);
    setIsFlipped(false);
    
    toast({
      title: "Flashcards Shuffled",
      description: "Your flashcards have been randomly reordered"
    });
  };
  
  const handleReset = () => {
    setCurrentCardIndex(0);
    setIsFlipped(false);
  };

  const handleSubmitFlashcards = () => {
    if (flashcards.length === 0) return;
    
    // Create HTML representation of the flashcards
    const htmlContent = `
      <h2>Flashcards: ${topic}</h2>
      <div class="space-y-4 mt-4">
        ${flashcards.map((card, index) => `
          <div class="border border-white/10 rounded-lg p-4 bg-black/20">
            <h3 class="text-blue-400 font-medium mb-2">Front: ${card.front}</h3>
            <p class="text-muted-foreground">Back: ${card.back}</p>
          </div>
        `).join('')}
      </div>
      <p class="mt-4">These flashcards cover key concepts related to ${topic}. Use them for studying and knowledge retention.</p>
    `;
    
    onSubmitResult(htmlContent);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-black/90 border border-white/10 rounded-lg w-full max-w-2xl shadow-xl flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center">
            <Bookmark className="h-5 w-5 text-blue-400 mr-2" />
            <h2 className="text-xl font-semibold text-white">Flashcard Maker</h2>
          </div>
          <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20">
            Atom
          </Badge>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="h-8 w-8 rounded-full hover:bg-white/10"
          >
            <X className="h-4 w-4" />
          </Button>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
          <div className="px-4 pt-2 border-b border-white/10">
            <TabsList className="bg-black/40">
              <TabsTrigger value="create" disabled={isLoading}>Create</TabsTrigger>
              <TabsTrigger value="review" disabled={flashcards.length === 0 || isLoading}>Review</TabsTrigger>
            </TabsList>
          </div>
          
          <ScrollArea className="flex-1">
            <TabsContent value="create" className="p-4 m-0 h-full">
        <div className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">
              Topic
            </label>
            <Input
              placeholder="E.g., Machine Learning, History, Biology..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="bg-black/50 border-white/10"
            />
          </div>
          
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">
              Additional Context (Optional)
            </label>
            <Textarea
              placeholder="Add any specific details, areas to focus on, or other context..."
              value={context}
              onChange={(e) => setContext(e.target.value)}
              className="bg-black/50 border-white/10 min-h-[100px]"
            />
          </div>
                
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">
                    Number of Flashcards
                  </label>
                  <Input
                    type="number"
                    min="1" 
                    max="20"
                    placeholder="5"
                    value={numCards}
                    onChange={(e) => setNumCards(e.target.value)}
                    className="bg-black/50 border-white/10 w-24"
                  />
                </div>
          
          {error && (
            <p className="text-red-400 text-sm mt-1">{error}</p>
          )}
              </div>
            </TabsContent>
            
            <TabsContent value="review" className="p-4 m-0 h-full space-y-4">
              {flashcards.length > 0 ? (
                <>
                  <div className="text-center text-sm text-muted-foreground">
                    Card {currentCardIndex + 1} of {flashcards.length}
                  </div>
                  
                  <div 
                    className="border border-white/10 rounded-lg bg-black/40 p-6 h-64 flex items-center justify-center cursor-pointer"
                    onClick={handleFlip}
                    style={{ perspective: '1000px' }}
                  >
                    <div
                      className="w-full h-full relative transition-transform duration-500"
                      style={{ 
                        transformStyle: 'preserve-3d',
                        transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0)',
                      }}
                    >
                      <div 
                        className="absolute w-full h-full flex items-center justify-center backface-hidden"
                        style={{ backfaceVisibility: 'hidden' }}
                      >
                        <div className="text-center p-4">
                          <h3 className="text-blue-400 text-xl font-medium mb-2">Question:</h3>
                          <p className="text-white text-lg">{flashcards[currentCardIndex]?.front}</p>
                          <p className="text-muted-foreground text-sm mt-8">(Click to flip)</p>
                        </div>
                      </div>
                      <div 
                        className="absolute w-full h-full flex items-center justify-center backface-hidden"
                        style={{ 
                          backfaceVisibility: 'hidden',
                          transform: 'rotateY(180deg)'
                        }}
                      >
                        <div className="text-center p-4">
                          <h3 className="text-blue-400 text-xl font-medium mb-2">Answer:</h3>
                          <p className="text-white text-lg">{flashcards[currentCardIndex]?.back}</p>
                          <p className="text-muted-foreground text-sm mt-8">(Click to flip back)</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <Button 
                      variant="outline" 
                      onClick={handlePrevious}
                      disabled={currentCardIndex === 0}
                      className="border-white/10 hover:bg-white/5"
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Previous
                    </Button>
                    
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={handleFlip}
                        className="h-8 w-8 rounded-full hover:bg-white/10"
                        title="Flip Card"
                      >
                        <RotateCw className="h-4 w-4" />
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={handleShuffle}
                        className="h-8 w-8 rounded-full hover:bg-white/10"
                        title="Shuffle Cards"
                      >
                        <Shuffle className="h-4 w-4" />
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={handleReset}
                        className="h-8 w-8 rounded-full hover:bg-white/10"
                        title="Reset to First Card"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                    
            <Button 
              variant="outline" 
                      onClick={handleNext}
                      disabled={currentCardIndex === flashcards.length - 1}
                      className="border-white/10 hover:bg-white/5"
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <Bookmark className="h-12 w-12 mx-auto text-blue-400/30 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Flashcards Yet</h3>
                  <p className="text-muted-foreground mb-4">Switch to the Create tab to generate flashcards</p>
                  <Button 
                    onClick={() => setActiveTab("create")}
                    variant="outline"
              className="border-white/10 hover:bg-white/5"
                  >
                    Go to Create
                  </Button>
                </div>
              )}
            </TabsContent>
          </ScrollArea>
        </Tabs>
        
        <div className="p-4 border-t border-white/10 flex justify-between">
          <Button 
            variant="ghost" 
            onClick={onClose}
            className="hover:bg-white/5"
            >
              Cancel
            </Button>
          
          {activeTab === "create" ? (
            <Button 
              onClick={handleGenerate}
              disabled={!topic.trim() || isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" /> 
                  Generating...
                </>
              ) : (
                'Generate Flashcards'
              )}
            </Button>
          ) : (
            <Button 
              onClick={handleSubmitFlashcards}
              disabled={flashcards.length === 0}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Check className="h-4 w-4 mr-2" />
              Use Flashcards
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
