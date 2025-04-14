
import { useEffect, useState } from "react";
import { ChatProvider, useChat } from "@/context/ChatContext";
import { Header } from "@/components/Header";
import { ChatHistory } from "@/components/ChatHistory";
import { ChatInput } from "@/components/ChatInput";
import { Sidebar } from "@/components/Sidebar";
import { SidebarProvider, Sidebar as ShadcnSidebar, SidebarContent, SidebarInset } from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { PanelLeft, PanelRightClose } from "lucide-react";
import { cn } from "@/lib/utils";
import { SettingsPanel } from "@/components/SettingsPanel";

// Theme application component
const ThemeHandler = ({ children }: { children: React.ReactNode }) => {
  const { theme } = useChat();
  
  useEffect(() => {
    // Apply theme to html element
    const htmlElement = document.documentElement;
    htmlElement.classList.remove("light", "dark");
    
    if (theme === "system") {
      // Check system preference
      const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      htmlElement.classList.add(systemPrefersDark ? "dark" : "light");
    } else {
      htmlElement.classList.add(theme);
    }
  }, [theme]);
  
  return <>{children}</>;
};

const AppContent = () => {
  const { fontSize, theme } = useChat();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  
  const toggleSidebar = () => {
    setSidebarOpen(prevState => !prevState);
  };
  
  return (
    <ThemeHandler>
      <SidebarProvider>
        <div className={`flex w-full h-screen overflow-hidden bg-gradient-to-br from-black via-black to-black/95 dark:bg-gradient-to-br dark:from-black dark:via-black dark:to-black/95 light:bg-gradient-to-br light:from-white light:via-white/95 light:to-white/90 font-size-${fontSize}`}>
          <ShadcnSidebar className={cn(
            "transition-all duration-300 ease-in-out",
            sidebarOpen ? "md:flex" : "hidden"
          )}>
            <SidebarContent>
              <Sidebar />
            </SidebarContent>
          </ShadcnSidebar>
          
          <SidebarInset className="flex flex-col h-screen relative transition-all duration-300 ease-in-out w-full">
            <Header onOpenSettings={() => setShowSettings(true)}>
              <Button
                variant="ghost"
                size="icon"
                className="mr-2 text-white/70 hover:text-white hover:bg-glassy transition-all duration-300 dark:text-white/70 dark:hover:text-white light:text-black/70 light:hover:text-black"
                onClick={toggleSidebar}
                aria-label={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
              >
                {sidebarOpen ? <PanelRightClose size={18} /> : <PanelLeft size={18} />}
                <span className="sr-only">Toggle Sidebar</span>
              </Button>
            </Header>
            
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-glassy to-transparent opacity-30"></div>
              <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-glassy rounded-full blur-3xl"></div>
            </div>
            
            <div className="flex-1 relative overflow-hidden">
              <ScrollArea className="h-[calc(100vh-130px)]">
                <ChatHistory />
              </ScrollArea>
            </div>
            
            <ChatInput />
          </SidebarInset>
          
          {/* Settings Panel */}
          {showSettings && (
            <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm md:left-[16rem]">
              <div className="fixed left-0 top-0 h-full w-full max-w-md bg-background shadow-lg border-r border-white/10 overflow-hidden md:left-[16rem]">
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                  <h2 className="text-lg font-semibold">Settings</h2>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setShowSettings(false)}
                    className="glass-button"
                  >
                    <PanelRightClose className="h-5 w-5" />
                  </Button>
                </div>
                <SettingsPanel onClose={() => setShowSettings(false)} />
              </div>
            </div>
          )}
        </div>
      </SidebarProvider>
    </ThemeHandler>
  );
};

const Index = () => {
  return (
    <ChatProvider>
      <AppContent />
    </ChatProvider>
  );
};

export default Index;
