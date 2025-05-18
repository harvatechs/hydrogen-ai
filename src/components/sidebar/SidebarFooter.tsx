
import React from 'react';
import { Trash2, HelpCircle, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface SidebarFooterProps {
  currentConversationId: string | null;
  clearConversation: (id: string) => void;
}

export const SidebarFooter: React.FC<SidebarFooterProps> = ({
  currentConversationId,
  clearConversation
}) => {
  return (
    <div className="p-2 border-t dark:border-white/10 light:border-black/10">
      <div className="space-y-1">
        <Button 
          variant="ghost" 
          onClick={() => clearConversation(currentConversationId || "")} 
          className="w-full justify-start dark:hover:bg-white/5 dark:hover:text-white light:hover:bg-black/5 light:hover:text-black transition-colors"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Clear conversation
        </Button>
        
        <Button 
          variant="ghost" 
          className="w-full justify-start dark:hover:bg-white/5 dark:hover:text-white light:hover:bg-black/5 light:hover:text-black transition-colors"
        >
          <HelpCircle className="mr-2 h-4 w-4" />
          Help & FAQ
        </Button>
      </div>
      
      <Separator className="my-2 dark:bg-white/10 light:bg-black/10" />
      
      <Button 
        variant="ghost" 
        className="w-full justify-start dark:hover:bg-white/5 dark:hover:text-white light:hover:bg-black/5 light:hover:text-black transition-colors"
      >
        <User className="mr-2 h-4 w-4" />
        My account
      </Button>
      
      <Button 
        variant="ghost" 
        className="w-full justify-start dark:hover:bg-white/5 dark:hover:text-white light:hover:bg-black/5 light:hover:text-black transition-colors"
      >
        <LogOut className="mr-2 h-4 w-4" />
        Log out
      </Button>
    </div>
  );
};
