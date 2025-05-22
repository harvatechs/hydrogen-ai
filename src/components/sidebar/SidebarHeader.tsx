
import React from 'react';
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SidebarHeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  handleSearchKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  createNewConversation: () => void;
  collapsed?: boolean;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  searchTerm,
  setSearchTerm,
  handleSearchKeyDown,
  createNewConversation,
  collapsed = false
}) => {
  if (collapsed) {
    return (
      <div className="p-2 flex flex-col items-center">
        <Button 
          variant="outline" 
          onClick={createNewConversation} 
          className="w-10 h-10 p-0 rounded-full flex items-center justify-center border-white/10 dark:border-white/10 dark:hover:bg-white/5 dark:hover:text-white light:border-black/10 light:hover:bg-black/5 light:hover:text-black mb-1 bg-transparent text-inherit transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span className="sr-only">New chat</span>
        </Button>
      </div>
    );
  }

  return (
    <div className="p-2">
      <Button 
        variant="outline" 
        onClick={createNewConversation} 
        className="w-full justify-start text-left border-white/10 dark:border-white/10 dark:hover:bg-white/5 dark:hover:text-white light:border-black/10 light:hover:bg-black/5 light:hover:text-black mb-1 bg-transparent text-inherit transition-colors"
      >
        <Plus className="mr-2 h-4 w-4" />
        New chat
      </Button>
      
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search or type /web to search..." 
          className="pl-9 bg-transparent dark:border-white/10 light:border-black/10 focus-visible:ring-muted" 
          value={searchTerm} 
          onChange={e => setSearchTerm(e.target.value)} 
          onKeyDown={handleSearchKeyDown} 
        />
      </div>
    </div>
  );
};
