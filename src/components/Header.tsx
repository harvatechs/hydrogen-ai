import React from 'react';
import { Button } from "@/components/ui/button";
import { Settings, PanelLeft, PanelLeftClose, Moon, Sun, MessageSquare } from "lucide-react";
import { useChat } from "@/context/ChatContext";
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
  return <header className="border-b dark:border-white/10 light:border-black/10 p-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="h-9 w-9 rounded-full dark:hover:bg-white/5 light:hover:bg-black/5">
          {sidebarOpen ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeft className="h-5 w-5" />}
        </Button>
        
        <div className="flex items-center gap-1.5">
          
          <h1 className="text-lg font-semibold">HydroGen</h1>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-9 w-9 rounded-full dark:hover:bg-white/5 light:hover:bg-black/5">
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
        
        <Button variant="ghost" size="icon" onClick={onOpenSettings} className="h-9 w-9 rounded-full dark:hover:bg-white/5 light:hover:bg-black/5">
          <Settings className="h-5 w-5" />
        </Button>
      </div>
    </header>;
}