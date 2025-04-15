
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { toast } from "@/components/ui/use-toast";
import { ExplanationLevel } from "@/types/message";
import { useChat } from "@/context/ChatContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  BrainCircuit, 
  FileQuestion, 
  Flashcard, 
  GraduationCap, 
  Lightbulb, 
  Microphone, 
  School, 
  Search
} from "lucide-react";

export function StudentTools({ onClose }: { onClose: () => void }) {
  const [topic, setTopic] = useState("");
  const [explanationLevel, setExplanationLevel] = useState<number>(2);
  const [activeTab, setActiveTab] = useState("explain");
  const { sendMessage } = useChat();
  
  const levelMap: Record<number, ExplanationLevel> = {
    0: "five",
    1: "ten",
    2: "fifteen",
    3: "expert"
  };
  
  const levelDescriptions: Record<number, string> = {
    0: "Explain like I'm 5 - Very simple explanations",
    1: "Explain like I'm 10 - Simplified concepts",
    2: "Explain like I'm 15 - Moderate complexity",
    3: "Expert explanation - Advanced details"
  };

  const handleExplain = () => {
    if (!topic) {
      toast({
        title: "Topic required",
        description: "Please enter a topic to explain",
        variant: "destructive",
      });
      return;
    }
    
    const level = levelMap[explanationLevel];
    const promptMap: Record<ExplanationLevel, string> = {
      five: "Explain like I'm 5 years old: ",
      ten: "Explain like I'm 10 years old: ",
      fifteen: "Explain like I'm a high school student: ",
      expert: "Provide an expert-level explanation of: "
    };
    
    sendMessage(`${promptMap[level]}${topic}`);
    toast({
      title: "Generating explanation",
      description: `Creating a ${level}-level explanation of "${topic}"`
    });
    onClose();
  };

  const handleCreateFlashcards = () => {
    if (!topic) {
      toast({
        title: "Topic required",
        description: "Please enter a topic for flashcards",
        variant: "destructive",
      });
      return;
    }
    
    sendMessage(`Create a set of flashcards to help me study ${topic}. Include at least 5 question-answer pairs.`);
    toast({
      title: "Generating flashcards",
      description: `Creating flashcards for "${topic}"`
    });
    onClose();
  };

  const handleCreateQuiz = () => {
    if (!topic) {
      toast({
        title: "Topic required",
        description: "Please enter a topic for the quiz",
        variant: "destructive",
      });
      return;
    }
    
    sendMessage(`Create a mini quiz about ${topic} with 5 multiple-choice questions. Include questions, options, and correct answers.`);
    toast({
      title: "Generating quiz",
      description: `Creating a quiz about "${topic}"`
    });
    onClose();
  };

  const handleCreatePodcast = () => {
    if (!topic) {
      toast({
        title: "Topic required",
        description: "Please enter a topic for the podcast",
        variant: "destructive",
      });
      return;
    }
    
    sendMessage(`Create a short educational podcast script about ${topic}. It should be engaging, conversational, and about 5 minutes long if read aloud.`);
    toast({
      title: "Generating podcast script",
      description: `Creating a podcast script about "${topic}"`
    });
    onClose();
  };
  
  const handleHelpWithHomework = () => {
    if (!topic) {
      toast({
        title: "Question required",
        description: "Please enter your homework question",
        variant: "destructive",
      });
      return;
    }
    
    sendMessage(`Help me solve this homework problem: ${topic}. Please explain the step-by-step process.`);
    toast({
      title: "Helping with homework",
      description: "Analyzing your homework question"
    });
    onClose();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4 p-4 border-b dark:border-white/10 light:border-black/10">
        <div className="flex items-center mb-2">
          <GraduationCap className="mr-2 h-5 w-5 text-yellow-500" />
          <h2 className="text-xl font-semibold">Student Tools</h2>
        </div>
        <p className="text-sm text-muted-foreground">Educational tools to help you study and learn</p>
      </div>
      
      <div className="p-4 flex-1 overflow-auto">
        <div className="flex items-center mb-4 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Enter a topic, concept, or question..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="pl-10 bg-background border-input"
          />
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="explain" className="flex flex-col items-center gap-1 py-3">
              <Lightbulb className="h-4 w-4" />
              <span className="text-xs">Explain</span>
            </TabsTrigger>
            <TabsTrigger value="flashcards" className="flex flex-col items-center gap-1 py-3">
              <Flashcard className="h-4 w-4" />
              <span className="text-xs">Flashcards</span>
            </TabsTrigger>
            <TabsTrigger value="quiz" className="flex flex-col items-center gap-1 py-3">
              <FileQuestion className="h-4 w-4" />
              <span className="text-xs">Quiz</span>
            </TabsTrigger>
            <TabsTrigger value="podcast" className="flex flex-col items-center gap-1 py-3">
              <Microphone className="h-4 w-4" />
              <span className="text-xs">Podcast</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="explain" className="space-y-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Explanation Level</h3>
                <div className="mb-6">
                  <Slider
                    value={[explanationLevel]} 
                    min={0}
                    max={3}
                    step={1}
                    onValueChange={(values) => setExplanationLevel(values[0])}
                    className="my-4"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>ELI5</span>
                    <span>ELI10</span>
                    <span>ELI15</span>
                    <span>Expert</span>
                  </div>
                </div>
                <div className="p-3 rounded-md bg-primary/10 mb-4">
                  <p className="text-sm">{levelDescriptions[explanationLevel]}</p>
                </div>
              </div>
              
              <Button 
                onClick={handleExplain} 
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
              >
                <Lightbulb className="mr-2 h-4 w-4" />
                Generate Explanation
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="flashcards" className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Create flashcards to help you memorize and study important concepts.</p>
              <div className="grid grid-cols-2 gap-4 my-4">
                <div className="p-3 bg-primary/5 rounded-md flex flex-col items-center justify-center aspect-[4/3] border border-primary/10">
                  <div className="text-xs text-muted-foreground mb-1">Question</div>
                  <div className="text-sm font-medium">What is photosynthesis?</div>
                </div>
                <div className="p-3 bg-primary/5 rounded-md flex flex-col items-center justify-center aspect-[4/3] border border-primary/10">
                  <div className="text-xs text-muted-foreground mb-1">Answer</div>
                  <div className="text-sm">The process by which plants convert light energy into chemical energy.</div>
                </div>
              </div>
              <Button 
                onClick={handleCreateFlashcards} 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Flashcard className="mr-2 h-4 w-4" />
                Generate Flashcards
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="quiz" className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Test your knowledge with a custom quiz on any topic.</p>
              <div className="p-4 bg-primary/5 rounded-md my-4 border border-primary/10">
                <h4 className="text-sm font-medium mb-2">Sample Quiz Question</h4>
                <p className="text-sm mb-2">What is the capital of France?</p>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center">
                    <div className="w-5 h-5 rounded-full border border-primary/30 flex items-center justify-center mr-2 text-xs">A</div>
                    <span>London</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-5 h-5 rounded-full border border-green-500 bg-green-500/20 flex items-center justify-center mr-2 text-xs">B</div>
                    <span className="font-medium">Paris</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-5 h-5 rounded-full border border-primary/30 flex items-center justify-center mr-2 text-xs">C</div>
                    <span>Berlin</span>
                  </div>
                </div>
              </div>
              <Button 
                onClick={handleCreateQuiz} 
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              >
                <FileQuestion className="mr-2 h-4 w-4" />
                Generate Quiz
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="podcast" className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Create a mini podcast script about any educational topic.</p>
              <div className="p-4 bg-primary/5 rounded-md my-4 border border-primary/10 max-h-48 overflow-y-auto">
                <h4 className="text-sm font-medium mb-2">Sample Podcast Script</h4>
                <p className="text-xs text-muted-foreground italic">
                  "Welcome to MicroLearn! Today we're exploring [Topic]. Did you know that...
                  [Main content would appear here with interesting facts and explanations]
                  ...And that's our quick lesson for today. Thanks for listening to MicroLearn!"
                </p>
              </div>
              <Button 
                onClick={handleCreatePodcast} 
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                <Microphone className="mr-2 h-4 w-4" />
                Generate Podcast Script
              </Button>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 border-t dark:border-white/10 light:border-black/10 pt-4">
          <h3 className="text-sm font-medium mb-2">Other Student Tools</h3>
          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant="outline" 
              className="justify-start text-left h-auto py-3 dark:hover:bg-white/5 light:hover:bg-black/5"
              onClick={handleHelpWithHomework}
            >
              <BookOpen className="mr-2 h-4 w-4 text-blue-500" />
              <div className="flex flex-col items-start">
                <span className="text-xs font-medium">Homework Help</span>
                <span className="text-xs text-muted-foreground">Get step-by-step solutions</span>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="justify-start text-left h-auto py-3 dark:hover:bg-white/5 light:hover:bg-black/5"
              onClick={() => {
                sendMessage("Summarize the key concepts and definitions of " + (topic || "this subject"));
                toast({
                  title: "Generating summary",
                  description: "Creating a concise study guide"
                });
                onClose();
              }}
            >
              <BrainCircuit className="mr-2 h-4 w-4 text-purple-500" />
              <div className="flex flex-col items-start">
                <span className="text-xs font-medium">Study Guide</span>
                <span className="text-xs text-muted-foreground">Key concepts & definitions</span>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="justify-start text-left h-auto py-3 dark:hover:bg-white/5 light:hover:bg-black/5"
              onClick={() => {
                sendMessage("Create a mind map for learning " + (topic || "this subject"));
                toast({
                  title: "Generating mind map",
                  description: "Creating a visual learning aid"
                });
                onClose();
              }}
            >
              <School className="mr-2 h-4 w-4 text-green-500" />
              <div className="flex flex-col items-start">
                <span className="text-xs font-medium">Mind Map</span>
                <span className="text-xs text-muted-foreground">Visual learning aids</span>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="justify-start text-left h-auto py-3 dark:hover:bg-white/5 light:hover:bg-black/5"
              onClick={() => {
                sendMessage("Research paper outline for " + (topic || "this subject"));
                toast({
                  title: "Generating research outline",
                  description: "Creating a paper structure"
                });
                onClose();
              }}
            >
              <FileQuestion className="mr-2 h-4 w-4 text-red-500" />
              <div className="flex flex-col items-start">
                <span className="text-xs font-medium">Research Helper</span>
                <span className="text-xs text-muted-foreground">Paper outlines & citations</span>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
