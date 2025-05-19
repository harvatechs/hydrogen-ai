
import React, { useRef } from 'react';
import { Edit2, MessageSquare, Trash2, Check, X, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface ConversationItemProps {
  chat: {
    id: string;
    title: string;
  };
  currentConversationId: string | null;
  editingId: string | null;
  editTitle: string;
  collapsed: boolean;
  isGeneratingTitle: boolean;
  onSelect: (id: string) => void;
  onStartEdit: (id: string, title: string) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onEditChange: (value: string) => void;
  onDeleteClick: (id: string) => void;
  onRegenerateTitle: (id: string) => void;
}

export const ConversationItem: React.FC<ConversationItemProps> = ({
  chat,
  currentConversationId,
  editingId,
  editTitle,
  collapsed,
  isGeneratingTitle,
  onSelect,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onKeyDown,
  onEditChange,
  onDeleteClick,
  onRegenerateTitle
}) => {
  const editInputRef = useRef<HTMLInputElement>(null);

  const withTooltip = (children: React.ReactNode, label: string) => {
    if (!collapsed) return children;
    
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {children}
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>{label}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <div className="relative group">
      {editingId === chat.id ? (
        <div className="flex items-center px-2">
          <Input 
            ref={editInputRef} 
            value={editTitle} 
            onChange={e => onEditChange(e.target.value)} 
            onKeyDown={onKeyDown} 
            className="h-7 text-sm dark:bg-black/20 dark:border-white/10 light:bg-white/80 light:border-black/10" 
          />
          <div className="flex space-x-1 ml-1">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onSaveEdit}>
              <Check className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onCancelEdit}>
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      ) : (
        withTooltip(
          <Button 
            variant={chat.id === currentConversationId ? "secondary" : "ghost"} 
            className={cn(
              `w-full justify-${collapsed ? 'center' : 'start'} text-left h-auto py-2 relative`,
              collapsed ? 'px-2' : 'px-3 pr-9',
              'rounded-md',
              chat.id === currentConversationId 
                ? "dark:bg-white/10 dark:text-white light:bg-black/5 light:text-black" 
                : "dark:hover:bg-white/5 dark:hover:text-white light:hover:bg-black/5 light:hover:text-black transition-colors"
            )}
            onClick={() => onSelect(chat.id)}
            disabled={isGeneratingTitle}
          >
            {isGeneratingTitle && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-md">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            )}
            <MessageSquare className={`${collapsed ? '' : 'mr-2'} h-4 w-4 flex-shrink-0`} />
            {!collapsed && (
              <span className="truncate">
                {chat.title}
              </span>
            )}
          </Button>,
          chat.title
        )
      )}
      
      {!editingId && chat.id === currentConversationId && !collapsed && !isGeneratingTitle && (
        <div className="absolute right-1 top-1.5 hidden group-hover:flex space-x-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7 text-muted-foreground hover:text-foreground"
            onClick={() => onRegenerateTitle(chat.id)}
            title="Generate a title based on the conversation content"
          >
            <Sparkles className="h-3.5 w-3.5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7 text-muted-foreground hover:text-foreground" 
            onClick={() => onStartEdit(chat.id, chat.title)}
          >
            <Edit2 className="h-3.5 w-3.5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7 text-muted-foreground hover:text-destructive" 
            onClick={() => onDeleteClick(chat.id)}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}
    </div>
  );
};
