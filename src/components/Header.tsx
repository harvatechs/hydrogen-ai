
import { Button } from "@/components/ui/button";
import { ApiKeyDialog } from "./ApiKeyDialog";
import { PanelLeft, ChevronDown, Sparkles, Settings, Search, MoreHorizontal, User } from "lucide-react";
import { useChat } from "@/context/ChatContext";
import { useSidebar } from "@/components/ui/sidebar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export function Header() {
  const { theme, model } = useChat();
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

  return (
    <header className="sticky top-0 z-10 border-b border-white/10 bg-black/50 backdrop-blur-md">
      <div className="flex items-center justify-between px-3 py-2 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 md:hidden text-muted-foreground" 
            onClick={toggleSidebar}
          >
            <PanelLeft className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center">
            <span className="font-semibold text-white mr-1">HydroGen</span>
            <span className="bg-gemini-yellow/20 text-gemini-yellow text-xs px-1.5 py-0.5 rounded-full">Beta</span>
          </div>
        </div>
        
        <div className="hidden md:flex items-center">
          <Button 
            variant="outline" 
            size="sm" 
            className="border-white/10 bg-black/40 text-white/70 hover:bg-black/60 hover:text-white mr-2"
          >
            <Search className="h-3.5 w-3.5 mr-2" />
            Search
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="border-white/10 bg-black/40 text-white/70 hover:bg-black/60 hover:text-white"
          >
            Pro Search
          </Button>
        </div>
        
        <div className="flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs h-8 border-white/10 bg-black/40 text-muted-foreground hover:bg-black/60 hover:text-white"
              >
                <Sparkles className="h-3.5 w-3.5 mr-1.5 text-gemini-yellow" />
                {getModelDisplayName()}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-black/90 border-white/10">
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Select AI Model
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem className="text-white focus:bg-white/10 focus:text-white">
                Gemini 2.0 Pro
              </DropdownMenuItem>
              <DropdownMenuItem className="text-white focus:bg-white/10 focus:text-white">
                Gemini 2.0 Flash
              </DropdownMenuItem>
              <DropdownMenuItem className="text-white focus:bg-white/10 focus:text-white">
                Gemini 1.5 Pro
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <ApiKeyDialog />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                <User className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-black/90 border-white/10">
              <DropdownMenuLabel className="text-white">My Account</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem className="text-white focus:bg-white/10 focus:text-white">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem className="text-white focus:bg-white/10 focus:text-white">
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
