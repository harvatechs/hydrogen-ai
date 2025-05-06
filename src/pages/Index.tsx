
import { useEffect, useState } from "react";
import { ChatProvider, useChat } from "@/context/ChatContext";
import { Header } from "@/components/Header";
import { ChatHistory } from "@/components/ChatHistory";
import { ChatInput } from "@/components/ChatInput";
import { Sidebar } from "@/components/Sidebar";
import { 
  SidebarProvider, 
  Sidebar as ShadcnSidebar, 
  SidebarContent, 
  SidebarTrigger,
  SidebarHeader,
  SidebarFooter
} from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { EnhancedSettingsPanel } from "@/components/EnhancedSettingsPanel";
import { YouTubeSummarizer } from "@/atoms/YouTubeSummarizer";
import { FlashcardMaker } from "@/atoms/FlashcardMaker";
import { WebSearchAtom } from "@/atoms/WebSearchAtom";
import { AISummarizer } from "@/atoms/AISummarizer";

// Theme application component
const ThemeHandler = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const {
    theme
  } = useChat();
  
  useEffect(() => {
    const htmlElement = document.documentElement;
    htmlElement.classList.remove("light", "dark");
    if (theme === "system") {
      const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      htmlElement.classList.add(systemPrefersDark ? "dark" : "light");
    } else {
      htmlElement.classList.add(theme);
    }
  }, [theme]);
  
  return <>{children}</>;
};

const AppContent = () => {
  const {
    fontSize,
    theme,
    activeAtom,
    atomParams,
    setActiveAtom,
    handleAtomResult
  } = useChat();
  
  const [showSettings, setShowSettings] = useState(false);
  
  const closeAtom = () => {
    setActiveAtom(null);
  };
  
  const handleAtomSubmit = (result: string) => {
    handleAtomResult(result);
  };
  
  // Get atom content based on active atom
  const renderAtomContent = () => {
    if (!activeAtom) return null;
    
    switch (activeAtom) {
      case 'youtube':
        return (
          <YouTubeSummarizer 
            videoUrl={atomParams} 
            onClose={closeAtom} 
            onSubmitResult={handleAtomSubmit}
          />
        );
      case 'flashcard':
        return (
          <FlashcardMaker 
            initialQuery={atomParams} 
            onClose={closeAtom} 
            onSubmitResult={handleAtomSubmit}
          />
        );
      case 'websearch':
        return (
          <WebSearchAtom
            initialQuery={atomParams}
            onClose={closeAtom}
            onSubmitResult={handleAtomSubmit}
          />
        );
      case 'summarize':
        return (
          <AISummarizer
            initialText={atomParams}
            onClose={closeAtom}
            onSubmitResult={handleAtomSubmit}
          />
        );
      default:
        return (
          <div className="fixed inset-0 z-40 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-background rounded-lg border border-white/10 shadow-lg p-6 max-w-xl w-full">
              <h2 className="text-xl font-semibold mb-4">Coming Soon</h2>
              <p className="text-muted-foreground">
                This feature is under development and will be available soon!
              </p>
              <div className="mt-6 flex justify-end">
                <Button onClick={closeAtom}>Close</Button>
              </div>
            </div>
          </div>
        );
    }
  };
  
  return <ThemeHandler>
      <SidebarProvider defaultOpen={window.innerWidth >= 768}>
        <div className={`flex w-full h-screen overflow-hidden 
          dark:bg-[#343541] dark:from-[#343541] dark:via-[#343541] dark:to-[#343541]
          light:bg-[#ffffff] light:from-[#ffffff] light:via-[#ffffff] light:to-[#ffffff]
          font-size-${fontSize}`}>
          
          {/* Sidebar integration */}
          <ShadcnSidebar className="chatgpt-sidebar border-r border-[#4d4d4f] dark:bg-[#202123] light:bg-[#f7f7f8]">
            <SidebarContent>
              <Sidebar collapsed={false} />
            </SidebarContent>
          </ShadcnSidebar>
          
          {/* Main Content */}
          <div className="flex flex-col h-screen relative w-full">
            {/* Header with Sidebar Toggle */}
            <div className="flex items-center border-b border-b-[#4d4d4f] dark:border-b-[#4d4d4f] light:border-b-[#e5e5e5] h-14 px-4">
              <SidebarTrigger className="mr-2 dark:text-white light:text-[#202123] dark:hover:bg-white/10 light:hover:bg-black/10" />
              <Header onOpenSettings={() => setShowSettings(true)} />
            </div>
            
            <div className="flex-1 relative overflow-hidden flex flex-col">
              <ScrollArea className="h-[calc(100vh-130px)] flex-1 flex flex-col">
                <div className="flex-1 flex flex-col">
                  <ChatHistory />
                </div>
              </ScrollArea>
              
              <ChatInput />
            </div>
          </div>
          
          {renderAtomContent()}
          
          {showSettings && <EnhancedSettingsPanel onClose={() => setShowSettings(false)} />}
        </div>
      </SidebarProvider>
    </ThemeHandler>;
};

const Index = () => {
  return <ChatProvider>
      <AppContent />
    </ChatProvider>;
};

export default Index;
