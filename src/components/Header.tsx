
import React from 'react';
import { Button } from "@/components/ui/button";
import { Settings, PanelLeft, PanelLeftClose, Moon, Sun, MessageSquare, Menu } from "lucide-react";
import { useChat } from "@/context/ChatContext";
import { cn } from "@/lib/utils";

interface HeaderProps {
  onOpenSettings: () => void;
  toggleSidebar: () => void;
  sidebarOpen: boolean;
}

export function Header({
  onOpenSettings,
  toggleSidebar,
  sidebarOpen
}: HeaderProps) {
  const {
    theme,
    setTheme
  } = useChat();
  
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };
  
  return (
    <header className="border-b dark:border-white/10 light:border-black/10 p-3 flex items-center justify-between sticky top-0 z-30 bg-background backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar} 
          className="h-9 w-9 rounded-full dark:hover:bg-white/5 light:hover:bg-black/5"
          aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {sidebarOpen ? 
            <PanelLeftClose className="h-5 w-5" /> : 
            <PanelLeft className="h-5 w-5" />
          }
        </Button>
        
        <div className="flex items-center gap-1.5">
          <div className="flex items-center">
            <h1 className="text-lg font-semibold">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gemini-purple to-blue-500">
                HydroGen
              </span>
            </h1>
            <div className="flex items-center justify-center ml-1.5">
              <div className="bg-gemini-purple text-white text-[10px] px-1.5 py-0.5 rounded-sm font-medium uppercase">
                Beta
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleTheme} 
          className="h-9 w-9 rounded-full dark:hover:bg-white/5 light:hover:bg-black/5"
          aria-label={theme === 'dark' ? "Switch to light mode" : "Switch to dark mode"}
        >
          {theme === 'dark' ? 
            <Sun className="h-5 w-5" /> : 
            <Moon className="h-5 w-5" />
          }
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onOpenSettings} 
          className="h-9 w-9 rounded-full dark:hover:bg-white/5 light:hover:bg-black/5"
          aria-label="Open settings"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
