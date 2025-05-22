
import React from 'react';
import { AlertCircle, Trash, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useSidebar } from "@/components/ui/sidebar";

interface SidebarFooterProps {
  currentConversationId: string | null;
  clearConversation: (id: string) => void;
}

export const SidebarFooter: React.FC<SidebarFooterProps> = ({ 
  currentConversationId, 
  clearConversation
}) => {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  
  if (!currentConversationId) return null;
  
  if (collapsed) {
    return (
      <div className="p-2 flex flex-col items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={() => clearConversation(currentConversationId)}
              className="w-10 h-10 rounded-full border-white/10 dark:border-white/10 dark:hover:bg-white/5 dark:hover:text-white light:border-black/10 light:hover:bg-black/5 light:hover:text-black bg-transparent text-inherit transition-colors"
            >
              <Trash className="h-4 w-4" />
              <span className="sr-only">Clear conversation</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Clear conversation</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="w-10 h-10 rounded-full border-white/10 dark:border-white/10 dark:hover:bg-white/5 dark:hover:text-white light:border-black/10 light:hover:bg-black/5 light:hover:text-black bg-transparent text-inherit transition-colors"
            >
              <ShieldCheck className="h-4 w-4" />
              <span className="sr-only">Security enabled</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Security features enabled</TooltipContent>
        </Tooltip>
      </div>
    );
  }

  return (
    <div className="p-2 border-t border-white/10 dark:border-white/10 light:border-black/10 space-y-2">
      <Button
        variant="ghost"
        onClick={() => clearConversation(currentConversationId)}
        className="w-full justify-start text-left hover:bg-destructive/10 hover:text-destructive transition-colors dark:text-zinc-400 light:text-zinc-600 dark:hover:text-destructive light:hover:text-destructive"
      >
        <Trash className="mr-2 h-4 w-4" />
        Clear conversation
      </Button>
      
      <Button
        variant="ghost"
        className="w-full justify-start text-left hover:bg-blue-500/10 hover:text-blue-500 transition-colors dark:text-zinc-400 light:text-zinc-600"
      >
        <ShieldCheck className="mr-2 h-4 w-4" />
        Security features enabled
      </Button>
    </div>
  );
};
