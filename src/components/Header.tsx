
import React from "react";
import { Button } from "@/components/ui/button";
import { ApiKeyDialog } from "./ApiKeyDialog";
import { Sparkles as SparklesIcon, Settings, Search, User, Zap, Menu } from "lucide-react";
import { useChat } from "@/context/ChatContext";
import { useSidebar } from "@/components/ui/sidebar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/use-toast";

interface HeaderProps {
  children?: React.ReactNode;
}

export function Header({ children }: HeaderProps) {
  const { theme, model, sendMessage } = useChat();
  const { toggleSidebar } = useSidebar();

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
  
  const handleSearch = () => {
    toast({
      title: "Search activated",
      description: "Type your query in the input box below"
    });
  };
  
  const handleProSearch = () => {
    toast({
      title: "Pro Search activated",
      description: "This will search and analyze multiple sources"
    });
  };
  
  const handleModelChange = (model: string) => {
    // In a real app this would call setModel from context
    toast({
      title: "Model changed",
      description: `Now using ${model}`
    });
  };

  return (
    <header className="sticky top-0 z-10 border-b border-white/10 bg-black/50 backdrop-blur-md">
      <div className="flex items-center justify-between px-3 py-2 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          {children}
          
          <div className="flex items-center">
            <span className="font-semibold text-white mr-1">HydroGen</span>
            <span className="bg-gemini-yellow/20 text-gemini-yellow text-xs px-1.5 py-0.5 rounded-full">Beta</span>
          </div>
        </div>
        
        <div className="hidden md:flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="border-white/10 bg-black/40 text-white/70 hover:bg-gemini-yellow/10 hover:text-gemini-yellow transition-all duration-300"
            onClick={handleSearch}
          >
            <Search className="h-3.5 w-3.5 mr-2" />
            Search
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="border-white/10 bg-black/40 text-white/70 hover:bg-gemini-yellow/10 hover:text-gemini-yellow transition-all duration-300"
            onClick={handleProSearch}
          >
            <Zap className="h-3.5 w-3.5 mr-2" />
            Pro Search
          </Button>
        </div>
        
        <div className="flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs h-8 border-white/10 bg-black/40 text-muted-foreground hover:bg-gemini-yellow/10 hover:text-gemini-yellow transition-all duration-300"
              >
                <SparklesIcon className="h-3.5 w-3.5 mr-1.5 text-gemini-yellow" />
                {getModelDisplayName()}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-black/90 border-white/10">
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Select AI Model
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem 
                className="text-white focus:bg-gemini-yellow/10 focus:text-gemini-yellow"
                onClick={() => handleModelChange("Gemini 2.0 Pro")}
              >
                <div className="flex flex-col">
                  <span>Gemini 2.0 Pro</span>
                  <span className="text-xs text-muted-foreground">Advanced reasoning & analysis</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-white focus:bg-gemini-yellow/10 focus:text-gemini-yellow"
                onClick={() => handleModelChange("Gemini 2.0 Flash")}
              >
                <div className="flex flex-col">
                  <span>Gemini 2.0 Flash</span>
                  <span className="text-xs text-muted-foreground">Fast responses for simple questions</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-white focus:bg-gemini-yellow/10 focus:text-gemini-yellow"
                onClick={() => handleModelChange("Gemini 1.5 Pro")}
              >
                <div className="flex flex-col">
                  <span>Gemini 1.5 Pro</span>
                  <span className="text-xs text-muted-foreground">Long context understanding</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <ApiKeyDialog />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-muted-foreground hover:bg-gemini-yellow/10 hover:text-gemini-yellow transition-all duration-300"
              >
                <User className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-black/90 border-white/10">
              <DropdownMenuLabel className="text-white">My Account</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem className="text-white focus:bg-gemini-yellow/10 focus:text-gemini-yellow">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem className="text-white focus:bg-gemini-yellow/10 focus:text-gemini-yellow">
                Help & Support
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem className="text-red-400 focus:bg-red-500/10 focus:text-red-400">
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
