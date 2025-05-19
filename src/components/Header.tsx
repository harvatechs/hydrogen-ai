import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ApiKeyDialog } from "./ApiKeyDialog";
import { Settings, User, Zap, Moon, Sun, LogOut } from "lucide-react";
import { useChat } from "@/context/ChatContext";
import { toast } from "@/components/ui/use-toast";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
interface HeaderProps {
  children?: React.ReactNode;
  onOpenSettings: () => void;
}
export function Header({
  children,
  onOpenSettings
}: HeaderProps) {
  const {
    theme,
    setTheme,
    model
  } = useChat();

  // Get model display name
  const getModelDisplayName = () => {
    switch (model) {
      case "gemini-2.0-pro":
        return "Gemini 2.0 Pro";
      case "gemini-2.0-flash":
        return "Gemini 2.0 Flash";
      case "gemini-1.5-pro":
        return "Gemini 1.5 Pro";
      case "gemini-1.5-flash":
        return "Gemini 1.5 Flash";
      default:
        return "Gemini";
    }
  };
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
    toast({
      title: `${theme === 'dark' ? 'Light' : 'Dark'} mode activated`,
      description: `Using ${theme === 'dark' ? 'light' : 'dark'} theme now`
    });
  };
  return <div className="flex items-center justify-between w-full backdrop-blur-md">
      <div className="flex items-center gap-2">
        {children}
        
        <div className="flex items-center">
          <span className="font-semibold text-white mr-1 dark:text-white light:text-black">HydroGen</span>
          <span className="bg-black/20 text-white text-xs px-1.5 py-0.5 rounded-full dark:text-white light:text-black light:bg-black/10">Beta</span>
        </div>
      </div>
      
      <div className="flex items-center gap-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="h-8 w-8 border-white/10 dark:border-white/10 light:border-black/10">
              <Zap className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-black/90 border-white/10 dark:bg-black/90 light:bg-white/95 light:border-black/10 light:text-black">
            <DropdownMenuLabel className="text-white light:text-black">AI Model</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/10 light:bg-black/10" />
            <DropdownMenuItem className="text-white focus:bg-white/10 focus:text-white group dark:text-white dark:focus:bg-white/10 light:text-black light:focus:bg-black/5">
              <div className="flex flex-col">
                <span className="font-medium">Current: {getModelDisplayName()}</span>
                <span className="text-xs text-muted-foreground group-hover:text-white/70 light:group-hover:text-black/70">
                  Change model in settings
                </span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <ApiKeyDialog />
        
        
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="h-8 w-8 border-white/10 dark:border-white/10 light:border-black/10">
              <User className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-black/90 border-white/10 dark:bg-black/90 light:bg-white/95 light:border-black/10 light:text-black">
            <DropdownMenuLabel className="text-white light:text-black">My Account</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/10 light:bg-black/10" />
            <DropdownMenuItem className="text-white focus:bg-white/10 focus:text-white dark:text-white dark:focus:bg-white/10 light:text-black light:focus:bg-black/5">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem className="text-white focus:bg-white/10 focus:text-white dark:text-white dark:focus:bg-white/10 light:text-black light:focus:bg-black/5">
              Help & Support
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/10 light:bg-black/10" />
            <DropdownMenuItem className="text-red-400 focus:bg-red-500/10 focus:text-red-400">
              <LogOut className="h-4 w-4 mr-2" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>;
}