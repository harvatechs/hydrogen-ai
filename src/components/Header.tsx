
import React from "react";
import { Button } from "@/components/ui/button";
import { MoonStar, PanelLeft, Settings, Sun, Search, BellRing } from "lucide-react";
import { useChat } from "@/context/ChatContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { toast } from "@/components/ui/use-toast";

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
    toast({
      title: `${theme === 'dark' ? 'Light' : 'Dark'} mode activated`,
      description: `Using ${theme === 'dark' ? 'light' : 'dark'} theme now`
    });
  };
  
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-2 border-b bg-background px-4 dark:border-white/10 light:border-black/10 backdrop-blur-sm">
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
        <HoverCard>
          <HoverCardTrigger asChild>
            <div className="relative h-8 w-8 overflow-hidden rounded-full bg-gemini-gradient flex items-center justify-center cursor-pointer">
              <div className="text-white font-semibold text-sm">H</div>
            </div>
          </HoverCardTrigger>
          <HoverCardContent className="w-48">
            <div className="flex flex-col space-y-1">
              <h4 className="text-sm font-semibold">HydroGen Beta</h4>
              <p className="text-xs text-muted-foreground">Next-generation AI assistant powered by advanced ML models</p>
            </div>
          </HoverCardContent>
        </HoverCard>
        
        <div className="hidden md:flex flex-col">
          <h1 className="text-lg font-semibold tracking-tight">HydroGen Beta</h1>
          <p className="text-xs text-muted-foreground">Next-gen AI assistant</p>
        </div>
      </div>
      
      <div className="ml-auto flex items-center gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="hidden md:flex items-center gap-1.5 h-8 button-hover-visible"
        >
          <Search className="h-3.5 w-3.5" />
          <span className="text-xs">Search docs</span>
        </Button>
        
        <div 
          className="hidden md:flex items-center justify-center h-8 px-3 text-xs font-medium rounded-full bg-yellow-500/20 text-yellow-500 border border-yellow-500/30"
        >
          Beta Version
        </div>
        
        <Button 
          variant="ghost" 
          size="icon"
          className="relative button-hover-visible"
        >
          <BellRing className="h-5 w-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </Button>
        
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
