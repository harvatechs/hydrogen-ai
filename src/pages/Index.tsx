import { useEffect, useState } from "react";
import { ChatProvider, useChat } from "@/context/ChatContext";
import { Header } from "@/components/Header";
import { ChatHistory } from "@/components/ChatHistory";
import { ChatInput } from "@/components/ChatInput";
import { Sidebar } from "@/components/Sidebar";
import { SidebarProvider, Sidebar as ShadcnSidebar, SidebarContent, SidebarInset } from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { PanelLeft, PanelRightClose, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { SettingsPanel } from "@/components/SettingsPanel";
import { YouTubeSummarizer } from "@/atoms/YouTubeSummarizer";
import { FlashcardMaker } from "@/atoms/FlashcardMaker";

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
  
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  
  const toggleSidebar = () => {
    setSidebarOpen(prevState => !prevState);
  };
  
  const closeAtom = () => {
    setActiveAtom(null);
  };
  
  const handleAtomSubmit = (result: string) => {
    handleAtomResult(result);
  };
  
  return <ThemeHandler>
      <SidebarProvider>
        <div className={`flex w-full h-screen overflow-hidden 
          dark:bg-gradient-to-br dark:from-black dark:via-black dark:to-black/95 
          light:bg-gradient-to-br light:from-white light:via-white/95 light:to-white/90 
          font-size-${fontSize}`}>
          <ShadcnSidebar className={cn("transition-all duration-300 ease-in-out", sidebarOpen ? "md:flex" : "hidden")}>
            <SidebarContent>
              <Sidebar />
            </SidebarContent>
          </ShadcnSidebar>
          
          <SidebarInset className="flex flex-col h-screen relative transition-all duration-300 ease-in-out w-full">
            <Header onOpenSettings={() => setShowSettings(true)}>
              
            </Header>
            
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute bottom-0 left-0 w-full h-1/2 dark:bg-gradient-to-t dark:from-black/30 dark:to-transparent light:bg-gradient-to-t light:from-white/30 light:to-transparent opacity-30"></div>
              <div className="absolute top-0 right-0 w-1/3 h-1/3 dark:bg-black/20 light:bg-white/20 rounded-full blur-3xl"></div>
            </div>
            
            <div className="flex-1 relative overflow-hidden">
              <ScrollArea className="h-[calc(100vh-130px)]">
                <ChatHistory />
              </ScrollArea>
            </div>
            
            <ChatInput />
          </SidebarInset>
          
          {activeAtom === 'youtube' && (
            <YouTubeSummarizer 
              onClose={closeAtom} 
              onSubmit={handleAtomSubmit} 
            />
          )}
          
          {activeAtom === 'flashcard' && (
            <FlashcardMaker
              onClose={closeAtom}
              onSubmit={handleAtomSubmit}
            />
          )}
          
          {showSettings && <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm md:left-[16rem]">
              <div className="fixed left-0 top-0 h-full w-full max-w-md dark:bg-black/95 light:bg-white/95 shadow-lg dark:border-r dark:border-white/10 light:border-r light:border-black/10 overflow-hidden md:left-[16rem]">
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
