
import { useEffect, useState } from "react";
import { ChatProvider, useChat } from "@/context/ChatContext";
import { Header } from "@/components/Header";
import { ChatHistory } from "@/components/ChatHistory";
import { ChatInput } from "@/components/ChatInput";
import { Sidebar } from "@/components/Sidebar";
import { SidebarProvider, Sidebar as ShadcnSidebar, SidebarContent, SidebarInset } from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { PanelLeft, X, Sparkles, GraduationCap, YouTube, Image as ImageIcon, Cpu } from "lucide-react";
import { SettingsPanel } from "@/components/SettingsPanel";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { AtomThemes } from "@/components/AtomThemes";
import { StudentTools } from "@/components/StudentTools";
import { AIModels } from "@/components/AIModels";
import { ImageGenerator } from "@/components/ImageGenerator";
import { YouTubeSummarizer } from "@/components/YouTubeSummarizer";
import { useIsMobile } from "@/hooks/use-mobile";

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
    theme
  } = useChat();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showQuickTools, setShowQuickTools] = useState(false);
  const [showAtomThemes, setShowAtomThemes] = useState(false);
  const [showStudentTools, setShowStudentTools] = useState(false);
  const [showAIModels, setShowAIModels] = useState(false);
  const [showImageGenerator, setShowImageGenerator] = useState(false);
  const [showYouTubeTools, setShowYouTubeTools] = useState(false);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    // On mobile, initially hide sidebar
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [isMobile]);
  
  return <ThemeHandler>
      <SidebarProvider>
        <div className={`flex w-full h-screen overflow-hidden 
          dark:bg-gradient-to-br dark:from-black dark:via-black dark:to-black/95 
          light:bg-gradient-to-br light:from-white light:via-white/95 light:to-white/90 
          font-size-${fontSize}`}>
          {sidebarOpen && (
            <ShadcnSidebar className={`${isMobile ? 'fixed inset-0 z-50 w-[85%] max-w-[280px]' : 'md:flex'}`}>
              <SidebarContent>
                <Sidebar />
              </SidebarContent>
            </ShadcnSidebar>
          )}
          
          {sidebarOpen && isMobile && (
            <div 
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" 
              onClick={() => setSidebarOpen(false)}
            />
          )}
          
          <SidebarInset className="flex flex-col h-screen relative transition-all duration-300 ease-in-out w-full">
            <Header 
              onOpenSettings={() => setShowSettings(true)}
              toggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
              sidebarOpen={sidebarOpen}
            />
            
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
          
          {/* Quick floating tools access (mobile only) */}
          {isMobile && (
            <div className="fixed right-4 bottom-20 z-30">
              <Button
                variant="secondary"
                size="icon"
                className="h-12 w-12 rounded-full shadow-lg bg-gemini-gradient text-white"
                onClick={() => setShowQuickTools(!showQuickTools)}
              >
                <Sparkles className="h-5 w-5" />
              </Button>
              
              {showQuickTools && (
                <div className="absolute bottom-16 right-0 bg-card rounded-lg shadow-lg border dark:border-white/10 light:border-black/10 p-2 w-[180px]">
                  <Button
                    variant="ghost"
                    className="w-full justify-start mb-1 text-sm py-2"
                    onClick={() => {
                      setShowAtomThemes(true);
                      setShowQuickTools(false);
                    }}
                  >
                    <Sparkles className="h-4 w-4 mr-2 text-yellow-500" />
                    Atom Themes
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start mb-1 text-sm py-2"
                    onClick={() => {
                      setShowStudentTools(true);
                      setShowQuickTools(false);
                    }}
                  >
                    <GraduationCap className="h-4 w-4 mr-2 text-green-500" />
                    Student Tools
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start mb-1 text-sm py-2"
                    onClick={() => {
                      setShowYouTubeTools(true);
                      setShowQuickTools(false);
                    }}
                  >
                    <YouTube className="h-4 w-4 mr-2 text-red-500" />
                    YouTube Tools
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start mb-1 text-sm py-2"
                    onClick={() => {
                      setShowImageGenerator(true);
                      setShowQuickTools(false);
                    }}
                  >
                    <ImageIcon className="h-4 w-4 mr-2 text-blue-500" />
                    Image Generator
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-sm py-2"
                    onClick={() => {
                      setShowAIModels(true);
                      setShowQuickTools(false);
                    }}
                  >
                    <Cpu className="h-4 w-4 mr-2 text-purple-500" />
                    AI Models
                  </Button>
                </div>
              )}
            </div>
          )}
          
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
          
          {/* Tool Dialogs */}
          <Dialog open={showAtomThemes} onOpenChange={setShowAtomThemes}>
            <DialogContent className="dark:bg-black/95 dark:border-white/10 light:bg-white/95 light:border-black/10 max-w-3xl h-[80vh] overflow-hidden max-h-[90vh] md:h-[80vh]">
              <AtomThemes onClose={() => setShowAtomThemes(false)} />
            </DialogContent>
          </Dialog>
          
          <Dialog open={showStudentTools} onOpenChange={setShowStudentTools}>
            <DialogContent className="dark:bg-black/95 dark:border-white/10 light:bg-white/95 light:border-black/10 max-w-2xl h-[80vh] overflow-hidden max-h-[90vh] md:h-[80vh]">
              <StudentTools onClose={() => setShowStudentTools(false)} />
            </DialogContent>
          </Dialog>
          
          <Dialog open={showAIModels} onOpenChange={setShowAIModels}>
            <DialogContent className="dark:bg-black/95 dark:border-white/10 light:bg-white/95 light:border-black/10 max-w-2xl h-[80vh] overflow-hidden max-h-[90vh] md:h-[80vh]">
              <AIModels onClose={() => setShowAIModels(false)} />
            </DialogContent>
          </Dialog>
          
          <Dialog open={showImageGenerator} onOpenChange={setShowImageGenerator}>
            <DialogContent className="dark:bg-black/95 dark:border-white/10 light:bg-white/95 light:border-black/10 max-w-2xl h-[80vh] overflow-hidden max-h-[90vh] md:h-[80vh]">
              <ImageGenerator onClose={() => setShowImageGenerator(false)} />
            </DialogContent>
          </Dialog>
          
          <Dialog open={showYouTubeTools} onOpenChange={setShowYouTubeTools}>
            <DialogContent className="dark:bg-black/95 dark:border-white/10 light:bg-white/95 light:border-black/10 max-w-2xl h-[80vh] overflow-hidden max-h-[90vh] md:h-[80vh]">
              <YouTubeSummarizer onClose={() => setShowYouTubeTools(false)} />
            </DialogContent>
          </Dialog>
          
          {/* Sidebar toggle when sidebar is closed */}
          {!sidebarOpen && (
            <div className="absolute top-4 left-4 z-10">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => setSidebarOpen(true)} 
                className="h-8 w-8 rounded-full bg-background/50 backdrop-blur-sm border-white/10"
              >
                <PanelLeft className="h-4 w-4" />
              </Button>
            </div>
          )}
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
