
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
  const { fontSize } = useChat();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  return (
    <ThemeHandler>
      <SidebarProvider>
        <div className={`flex w-full h-screen overflow-hidden bg-gradient-to-br from-black via-black to-black/95 font-size-${fontSize}`}>
          <ShadcnSidebar className={cn(
            "transition-all duration-300 ease-in-out",
            sidebarOpen ? "md:flex" : "hidden"
          )}>
            <SidebarContent>
              <Sidebar />
            </SidebarContent>
          </ShadcnSidebar>
          
          <SidebarInset className="flex flex-col h-screen relative transition-all duration-300 ease-in-out">
            <Header>
              <Button
                variant="ghost"
                size="icon"
                className="mr-2 text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? <PanelRightClose size={18} /> : <PanelLeft size={18} />}
                <span className="sr-only">Toggle Sidebar</span>
              </Button>
            </Header>
            
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-gemini-yellow/5 to-transparent opacity-30"></div>
              <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gemini-yellow/5 rounded-full blur-3xl"></div>
            </div>
            
            <div className="flex-1 relative overflow-hidden">
              <ScrollArea className="h-[calc(100vh-130px)]">
                <ChatHistory />
              </ScrollArea>
            </div>
            
            <ChatInput />
          </SidebarInset>
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
