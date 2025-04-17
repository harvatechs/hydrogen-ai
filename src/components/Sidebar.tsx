import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Search, Settings, Trash2, User, LogOut, Edit2, X, Check, Moon, Sun, HelpCircle, Plus, MessageSquare } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useChat } from "@/context/ChatContext";
import { toast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SidebarProps {
  collapsed?: boolean;
}

export function Sidebar({ collapsed = false }: SidebarProps) {
  const {
    clearMessages,
    conversations,
    currentConversationId,
    setCurrentConversation,
    updateConversationTitle,
    clearConversation,
    deleteConversation,
    createNewConversation,
    theme,
    setTheme,
    sendMessage
  } = useChat();
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [conversationToDelete, setConversationToDelete] = useState<string | null>(null);
  const editInputRef = useRef<HTMLInputElement>(null);

  const filteredConversations = conversations.filter(chat => chat.title.toLowerCase().includes(searchTerm.toLowerCase()));

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const pastWeek = new Date(today);
  pastWeek.setDate(pastWeek.getDate() - 7);
  const pastMonth = new Date(today);
  pastMonth.setMonth(pastMonth.getMonth() - 1);

  const groupedConversations = {
    today: filteredConversations.filter(chat => chat.lastUpdatedAt >= today),
    yesterday: filteredConversations.filter(chat => chat.lastUpdatedAt >= yesterday && chat.lastUpdatedAt < today),
    pastWeek: filteredConversations.filter(chat => chat.lastUpdatedAt >= pastWeek && chat.lastUpdatedAt < yesterday),
    pastMonth: filteredConversations.filter(chat => chat.lastUpdatedAt >= pastMonth && chat.lastUpdatedAt < pastWeek),
    older: filteredConversations.filter(chat => chat.lastUpdatedAt < pastMonth)
  };

  useEffect(() => {
    if (editingId && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingId]);

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchTerm.startsWith('/web ')) {
      const query = searchTerm.replace('/web ', '').trim();
      if (query) {
        sendMessage(`Search the web for: ${query}`);
        setSearchTerm('');
      }
    }
  };

  const handleStartEdit = (id: string, title: string) => {
    setEditingId(id);
    setEditTitle(title);
  };

  const handleSaveEdit = () => {
    if (editingId && editTitle.trim()) {
      updateConversationTitle(editingId, editTitle.trim());
      setEditingId(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  const handleDeleteClick = (id: string) => {
    setConversationToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (conversationToDelete) {
      deleteConversation(conversationToDelete);
      toast({
        title: "Conversation Deleted",
        description: "The conversation has been permanently removed."
      });
    }
    setDeleteDialogOpen(false);
    setConversationToDelete(null);
  };

  const handleClear = () => {
    clearMessages();
    toast({
      title: "Chat Cleared",
      description: "All messages have been cleared."
    });
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
    toast({
      title: `${theme === 'dark' ? 'Light' : 'Dark'} mode activated`,
      description: `Using ${theme === 'dark' ? 'light' : 'dark'} theme now`
    });
  };

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

  const renderConversationItem = (chat: any) => {
    return (
      <div key={chat.id} className="relative group">
        {editingId === chat.id ? (
          <div className="flex items-center px-2">
            <Input 
              ref={editInputRef} 
              value={editTitle} 
              onChange={e => setEditTitle(e.target.value)} 
              onKeyDown={handleKeyDown} 
              className="h-7 text-sm dark:bg-black/20 dark:border-white/10 light:bg-white/80 light:border-black/10" 
            />
            <div className="flex space-x-1 ml-1">
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleSaveEdit}>
                <Check className="h-3.5 w-3.5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleCancelEdit}>
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ) : (
          withTooltip(
            <Button 
              variant={chat.id === currentConversationId ? "secondary" : "ghost"} 
              className={`w-full justify-${collapsed ? 'center' : 'start'} text-left h-auto py-2 ${collapsed ? 'px-2' : 'px-3 pr-7'} rounded-md
                ${chat.id === currentConversationId 
                  ? "dark:bg-white/10 dark:text-white light:bg-black/5 light:text-black" 
                  : "dark:hover:bg-white/5 dark:hover:text-white light:hover:bg-black/5 light:hover:text-black transition-colors"}`} 
              onClick={() => setCurrentConversation(chat.id)}
            >
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
        
        {!editingId && chat.id === currentConversationId && !collapsed && (
          <div className="absolute right-1 top-1.5 hidden group-hover:flex space-x-1">
            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={() => handleStartEdit(chat.id, chat.title)}>
              <Edit2 className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => handleDeleteClick(chat.id)}>
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
      </div>
    );
  };

  const renderConversationGroup = (title: string, conversations: typeof filteredConversations) => {
    if (conversations.length === 0) return null;
    return (
      <div key={title}>
        {!collapsed && (
          <div className="text-xs font-medium text-muted-foreground mb-2 px-2">
            {title}
          </div>
        )}
        
        <div className="space-y-1 mb-3">
          {conversations.map(chat => renderConversationItem(chat))}
        </div>
      </div>
    );
  };

  return <div className="w-full h-full flex flex-col bg-background border-r border-white/10 dark:bg-background light:bg-white/95 light:border-black/10">
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
      
      <div className="flex-1 overflow-auto p-2">
        {filteredConversations.length === 0 && searchTerm ? (
          <div className="text-sm text-center text-muted-foreground p-4">
            No conversations matching "{searchTerm}"
          </div>
        ) : (
          <>
            {renderConversationGroup("Today", groupedConversations.today)}
            {renderConversationGroup("Yesterday", groupedConversations.yesterday)}
            {renderConversationGroup("Previous 7 Days", groupedConversations.pastWeek)}
            {renderConversationGroup("Previous 30 Days", groupedConversations.pastMonth)}
            {renderConversationGroup("Older", groupedConversations.older)}
          </>
        )}
      </div>
      
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
      
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="dark:bg-black/90 dark:border-white/10 light:bg-white light:border-black/10">
          <DialogHeader>
            <DialogTitle className="dark:text-white light:text-black">Delete Conversation</DialogTitle>
            <DialogDescription className="dark:text-white/70 light:text-black/70">
              Are you sure you want to delete this conversation? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} className="dark:border-white/10 light:border-black/10">
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>;
}
