
import { useEffect, useState } from "react";
import { ChatProvider, useChat } from "@/context/ChatContext";
import { Header } from "@/components/Header";
import { ChatHistory } from "@/components/ChatHistory";
import { ChatInput } from "@/components/ChatInput";
import { Sidebar } from "@/components/Sidebar";
import { SidebarProvider, Sidebar as ShadcnSidebar, SidebarContent, SidebarInset } from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { PanelLeft, X, HelpCircle } from "lucide-react";
import { SettingsPanel } from "@/components/SettingsPanel";
import StudentTools from "@/components/StudentTools";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

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
    // Apply theme to html element
    const htmlElement = document.documentElement;
    htmlElement.classList.remove("light", "dark");
    if (theme === "system") {
      // Check system preference
      const systemPrefersDark = window.matchMedia("(prefers-reduced-motion: no-preference)").matches;
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
    theme
  } = useChat();
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
  const [showSettings, setShowSettings] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showStudentTools, setShowStudentTools] = useState(true);

  // Handle window resize to detect mobile screens
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile && sidebarOpen) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [sidebarOpen]);
  
  const toggleSidebar = () => {
    if (isMobile) {
      setShowMobileMenu(!showMobileMenu);
    } else {
      setSidebarOpen(!sidebarOpen);
    }
  };
  
  const toggleTools = () => {
    setShowStudentTools(!showStudentTools);
  };
  
  return <ThemeHandler>
      <SidebarProvider>
        <div className={`flex w-full h-screen overflow-hidden 
          dark:bg-gradient-to-br dark:from-black dark:via-black dark:to-black/95 
          light:bg-gradient-to-br light:from-gray-50 light:via-gray-50 light:to-white
          font-size-${fontSize}`}>
          
          {/* Desktop Sidebar */}
          {sidebarOpen && !isMobile && <ShadcnSidebar className="hidden md:flex">
              <SidebarContent>
                <Sidebar />
              </SidebarContent>
            </ShadcnSidebar>}
          
          {/* Mobile Menu Overlay */}
          {showMobileMenu && isMobile && <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex md:hidden">
              <div className="w-4/5 max-w-xs h-full">
                <Sidebar />
              </div>
              <div className="flex-1" onClick={() => setShowMobileMenu(false)}></div>
            </div>}
          
          <SidebarInset className="flex flex-col h-screen relative transition-all duration-300 ease-in-out w-full">
            <Header onOpenSettings={() => setShowSettings(true)} toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen || showMobileMenu} />
            
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute bottom-0 left-0 w-full h-1/2 dark:bg-gradient-to-t dark:from-black/30 dark:to-transparent light:bg-gradient-to-t light:from-white/30 light:to-transparent opacity-30"></div>
              <div className="absolute top-0 right-0 w-1/3 h-1/3 dark:bg-primary/5 light:bg-primary/5 rounded-full blur-3xl"></div>
            </div>
            
            <div className="flex-1 relative overflow-hidden">
              {/* Student Tools Section */}
              {showStudentTools ? (
                <StudentTools />
              ) : (
                <ScrollArea className="h-[calc(100vh-200px)]">
                  <ChatHistory />
                </ScrollArea>
              )}
            </div>
            
            <div className="flex justify-center space-x-2 py-2">
              <Button 
                variant={showStudentTools ? "default" : "outline"} 
                className={showStudentTools ? "bg-gemini-purple hover:bg-gemini-purple/90 text-white" : ""}
                onClick={toggleTools}
              >
                Answer Engine
              </Button>
              <Button 
                variant={!showStudentTools ? "default" : "outline"}
                className={!showStudentTools ? "bg-gemini-purple hover:bg-gemini-purple/90 text-white" : ""}
                onClick={toggleTools}
              >
                Chat
              </Button>
            </div>
            
            {!showStudentTools && <ChatInput />}
          </SidebarInset>
          
          {/* Settings Panel */}
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
          
          {/* Sidebar toggle when sidebar is closed */}
          {!sidebarOpen && !showMobileMenu && !isMobile && <div className="absolute top-4 left-4 z-10">
              <Button variant="outline" size="icon" onClick={() => setSidebarOpen(true)} className="h-8 w-8 rounded-full bg-background/50 backdrop-blur-sm border-white/10">
                <PanelLeft className="h-4 w-4" />
              </Button>
            </div>}
          
          {/* Help Button */}
          <div className="fixed bottom-24 right-4 z-20">
            <Tooltip>
              <TooltipTrigger asChild>
                
              </TooltipTrigger>
              <TooltipContent>
                <p>Help & Support</p>
              </TooltipContent>
            </Tooltip>
          </div>
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
