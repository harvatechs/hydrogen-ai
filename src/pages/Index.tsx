
import { useEffect } from "react";
import { ChatProvider, useChat } from "@/context/ChatContext";
import { Header } from "@/components/Header";
import { ChatHistory } from "@/components/ChatHistory";
import { ChatInput } from "@/components/ChatInput";
import { Sidebar } from "@/components/Sidebar";
import { SidebarProvider, Sidebar as ShadcnSidebar, SidebarContent, SidebarInset } from "@/components/ui/sidebar";

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
  
  return (
    <ThemeHandler>
      <SidebarProvider>
        <div className={`flex w-full h-screen bg-background text-foreground font-size-${fontSize}`}>
          <ShadcnSidebar className="hidden md:flex">
            <SidebarContent>
              <Sidebar />
            </SidebarContent>
          </ShadcnSidebar>
          
          <SidebarInset className="flex flex-col h-screen bg-background">
            <Header />
            
            <div className="flex-1 overflow-hidden">
              <ChatHistory />
            </div>
            
            <div className="p-4 md:px-8 md:pb-8">
              <ChatInput />
            </div>
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
