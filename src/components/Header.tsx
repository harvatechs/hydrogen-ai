import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ApiKeyDialog } from "./ApiKeyDialog";
import { Search, Settings, User, Zap, Moon, Sun, LogOut } from "lucide-react";
import { useChat } from "@/context/ChatContext";
import { toast } from "@/components/ui/use-toast";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { searchGoogle } from "@/utils/searchUtils";
import { SearchResults } from "./SearchResults";
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
    model,
    sendMessage
  } = useChat();
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [searchResults, setSearchResults] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);

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
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      toast({
        title: "Enter search term",
        description: "Please enter what you want to search for"
      });
      return;
    }
    setIsSearching(true);
    const results = await searchGoogle(searchTerm);
    setIsSearching(false);
    if (results && results.items) {
      setSearchResults(results);
    } else {
      toast({
        title: "No results found",
        description: "Try a different search term"
      });
    }
  };
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    } else if (e.key === 'Escape') {
      setShowSearchInput(false);
    }
  };
  const handleCloseSearch = () => {
    setSearchResults(null);
    setSearchTerm("");
  };
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
    toast({
      title: `${theme === 'dark' ? 'Light' : 'Dark'} mode activated`,
      description: `Using ${theme === 'dark' ? 'light' : 'dark'} theme now`
    });
  };
  return <header className="sticky top-0 z-10 border-b border-white/10 bg-black/50 backdrop-blur-md dark:bg-black/50 light:bg-white/80">
      <div className="flex items-center justify-between px-3 py-2 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          {children}
          
          <div className="flex items-center">
            <span className="font-semibold text-white mr-1 dark:text-white light:text-black">HydroGen</span>
            <span className="bg-glassy text-white text-xs px-1.5 py-0.5 rounded-full dark:text-white light:text-black">Beta</span>
          </div>
        </div>
        
        <div className="hidden md:flex items-center space-x-2">
          {showSearchInput && <div className="relative">
              <input type="text" className="bg-glassy-dark border border-white/10 pl-9 pr-4 py-1.5 rounded-md text-sm focus:ring-1 focus:ring-white/30 focus:outline-none text-white w-64" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} onKeyDown={handleSearchKeyDown} placeholder="Search the web..." autoFocus />
              <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/70" />
              {isSearching && <div className="absolute right-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>}
            </div>}
          
          {!showSearchInput}
          
          
          
          
        </div>
        
        <div className="flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="glass-button h-8 w-8">
                <Zap className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-black/90 border-white/10">
              <DropdownMenuLabel className="text-white">AI Model</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem className="text-white focus:bg-glassy focus:text-white group">
                <div className="flex flex-col">
                  <span className="font-medium">Current: {getModelDisplayName()}</span>
                  <span className="text-xs text-muted-foreground group-hover:text-white/70">
                    Change model in settings
                  </span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <ApiKeyDialog />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="glass-button h-8 w-8">
                <User className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-black/90 border-white/10">
              <DropdownMenuLabel className="text-white">My Account</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem className="text-white focus:bg-glassy focus:text-white">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem className="text-white focus:bg-glassy focus:text-white">
                Help & Support
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem className="text-red-400 focus:bg-red-500/10 focus:text-red-400">
                <LogOut className="h-4 w-4 mr-2" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {searchResults && <SearchResults results={searchResults.items} searchInfo={searchResults.searchInformation} searchTerm={searchTerm} onClose={handleCloseSearch} />}
    </header>;
}