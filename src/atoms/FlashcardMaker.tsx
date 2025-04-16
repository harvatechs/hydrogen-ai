
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Bookmark, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface FlashcardMakerProps {
  onClose: () => void;
  onSubmit: (flashcards: string) => void;
}

export function FlashcardMaker({ onClose, onSubmit }: FlashcardMakerProps) {
  const [topic, setTopic] = useState("");
  const [context, setContext] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError("Please enter a topic for your flashcards.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // In a real implementation, this would call the Gemini API to generate flashcards
      // For now, we'll simulate it with a timeout
      setTimeout(() => {
        const flashcards = `
          <h2>Flashcards: ${topic}</h2>
          <div class="space-y-4 mt-4">
            <div class="border border-white/10 rounded-lg p-4 bg-black/20">
              <h3 class="text-gemini-yellow font-medium mb-2">Front: What is machine learning?</h3>
              <p class="text-muted-foreground">Back: Machine learning is a subset of artificial intelligence that enables systems to learn and improve from experience without being explicitly programmed.</p>
            </div>
            
            <div class="border border-white/10 rounded-lg p-4 bg-black/20">
              <h3 class="text-gemini-yellow font-medium mb-2">Front: What is supervised learning?</h3>
              <p class="text-muted-foreground">Back: Supervised learning is a type of machine learning where the model is trained on labeled data, learning to map inputs to known outputs.</p>
            </div>
            
            <div class="border border-white/10 rounded-lg p-4 bg-black/20">
              <h3 class="text-gemini-yellow font-medium mb-2">Front: What is unsupervised learning?</h3>
              <p class="text-muted-foreground">Back: Unsupervised learning is a type of machine learning where the model finds patterns in unlabeled data without explicit guidance.</p>
            </div>
          </div>
          <p class="mt-4">These flashcards cover basic concepts related to ${topic}. You can use them for studying or further expand them with more specific questions.</p>
        `;
        
        onSubmit(flashcards);
        setIsLoading(false);
      }, 2000);
    } catch (err) {
      setError("Failed to generate flashcards. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-black/90 border border-white/10 rounded-lg w-full max-w-lg p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Bookmark className="h-5 w-5 text-blue-400 mr-2" />
            <h2 className="text-xl font-semibold text-white">Flashcard Maker</h2>
          </div>
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
          
          {error && (
            <p className="text-red-400 text-sm mt-1">{error}</p>
          )}
          
          <div className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="border-white/10 hover:bg-white/5"
            >
              Cancel
            </Button>
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
          </div>
        </div>
      </div>
    </div>
  );
}
