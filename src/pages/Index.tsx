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
import { SettingsPanel } from "@/components/SettingsPanel";
import { YouTubeSummarizer } from "@/atoms/YouTubeSummarizer";
import { FlashcardMaker } from "@/atoms/FlashcardMaker";
import { WebSearchAtom } from "@/atoms/WebSearchAtom";

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
          dark:bg-gradient-to-br dark:from-black dark:via-black dark:to-black/95 
          light:bg-gradient-to-br light:from-white light:via-white/95 light:to-white/90 
          font-size-${fontSize}`}>
          
          {/* Properly integrate the UI sidebar with our custom Sidebar component */}
          <ShadcnSidebar>
            <SidebarContent>
              <Sidebar collapsed={false} />
            </SidebarContent>
          </ShadcnSidebar>
          
          {/* Main Content */}
          <div className="flex flex-col h-screen relative w-full">
            {/* Header with Sidebar Toggle */}
            <div className="flex items-center border-b border-b-white/10 light:border-b-black/10 h-14 px-4">
              <SidebarTrigger className="mr-2 dark:text-white light:text-black dark:hover:bg-white/10 light:hover:bg-black/10" />
              <Header onOpenSettings={() => setShowSettings(true)} />
            </div>
            
            <div className="absolute inset-0 pointer-events-none top-14">
              <div className="absolute bottom-0 left-0 w-full h-1/2 dark:bg-gradient-to-t dark:from-black/30 dark:to-transparent light:bg-gradient-to-t light:from-white/30 light:to-transparent opacity-30"></div>
              <div className="absolute top-0 right-0 w-1/3 h-1/3 dark:bg-black/20 light:bg-white/20 rounded-full blur-3xl"></div>
            </div>
            
            <div className="flex-1 relative overflow-hidden">
              <ScrollArea className="h-[calc(100vh-130px)]">
                <ChatHistory />
              </ScrollArea>
            </div>
            
            <ChatInput />
          </div>
          
          {renderAtomContent()}
          
          {showSettings && <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
              <div className="fixed left-0 top-0 h-full w-full max-w-md dark:bg-black/95 light:bg-white/95 shadow-lg dark:border-r dark:border-white/10 light:border-r light:border-black/10 overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b dark:border-white/10 light:border-black/10">
                  <h2 className="text-lg font-semibold dark:text-white light:text-black">Settings</h2>
                  <Button variant="ghost" size="icon" onClick={() => setShowSettings(false)} className="dark:hover:bg-white/5 light:hover:bg-black/5">
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <SettingsPanel onClose={() => setShowSettings(false)} />
              </div>
            </div>}
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
