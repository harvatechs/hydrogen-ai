
import React from "react";
import { Button } from "@/components/ui/button";
import { MoonStar, PanelLeft, Settings, Sun } from "lucide-react";
import { useChat } from "@/context/ChatContext";
import { useIsMobile } from "@/hooks/use-mobile";

interface HeaderProps {
  onOpenSettings: () => void;
  toggleSidebar: () => void;
  sidebarOpen: boolean;
}

export function Header({ onOpenSettings, toggleSidebar, sidebarOpen }: HeaderProps) {
  const { theme, setTheme } = useChat();
  const isMobile = useIsMobile();
  
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };
  
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-2 border-b bg-background px-4 dark:border-white/10 light:border-black/10">
      {!sidebarOpen && !isMobile && (
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar} 
          className="mr-2 button-hover-visible"
          aria-label="Toggle sidebar"
        >
          <PanelLeft className="h-5 w-5" />
        </Button>
      )}
      
      <div className="flex items-center gap-2">
        <div className="relative h-8 w-8 overflow-hidden rounded-full bg-gemini-gradient flex items-center justify-center">
          <div className="text-white font-semibold text-sm">H</div>
        </div>
        
        <div className="hidden md:flex flex-col">
          <h1 className="text-lg font-semibold tracking-tight">HydroGen Beta</h1>
          <p className="text-xs text-muted-foreground">Next-gen AI assistant</p>
        </div>
      </div>
      
      <div className="ml-auto flex items-center gap-2">
        <div 
          className="hidden md:flex items-center justify-center h-8 px-3 text-xs font-medium rounded-full bg-yellow-500/20 text-yellow-500 border border-yellow-500/30"
        >
          Beta Version
        </div>
        
        <Button 
          variant="ghost" 
          size="icon"
          onClick={toggleTheme}
          className="hidden md:flex button-hover-visible"
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <MoonStar className="h-5 w-5" />}
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onOpenSettings}
          aria-label="Settings"
          className="button-hover-visible"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
