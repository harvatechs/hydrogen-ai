import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Search, Settings, Trash2, User, LogOut, Edit2, X, Check, Moon, Sun, HelpCircle, Plus, MessageSquare, PanelLeftClose, PanelLeft, Image, Youtube, Sparkles, Palette, Cpu } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useChat } from "@/context/ChatContext";
import { toast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { AtomThemes } from "./AtomThemes";
import { YouTubeSummarizer } from "./YouTubeSummarizer";
import { AIModels } from "./AIModels";
import { ImageGenerator } from "./ImageGenerator";
export function Sidebar() {
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
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const editInputRef = useRef<HTMLInputElement>(null);
  const [showAtomThemes, setShowAtomThemes] = useState(false);
  const [showYouTubeTools, setShowYouTubeTools] = useState(false);
  const [showAIModels, setShowAIModels] = useState(false);
  const [showImageGenerator, setShowImageGenerator] = useState(false);
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
  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };
  if (!sidebarVisible) {
    return <div className="absolute top-4 left-4 z-50">
        <Button variant="outline" size="icon" onClick={toggleSidebar} className="rounded-full bg-primary hover:bg-primary/90 dark:bg-primary dark:hover:bg-primary/90 light:bg-primary light:hover:bg-primary/90" aria-label="Show Sidebar">
          <PanelLeft className="h-5 w-5 text-primary-foreground" />
        </Button>
      </div>;
  }
  const renderConversationGroup = (title: string, conversations: typeof filteredConversations) => {
    if (conversations.length === 0) return null;
    return <div key={title}>
        <div className="text-xs font-medium text-muted-foreground mb-2 px-2">
          {title}
        </div>
        
        <div className="space-y-1 mb-3">
          {conversations.map(chat => <div key={chat.id} className="relative group">
              {editingId === chat.id ? <div className="flex items-center px-2">
                  <Input ref={editInputRef} value={editTitle} onChange={e => setEditTitle(e.target.value)} onKeyDown={handleKeyDown} className="h-7 text-sm dark:bg-black/20 dark:border-white/10 light:bg-white/80 light:border-black/10" />
                  <div className="flex space-x-1 ml-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleSaveEdit}>
                      <Check className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleCancelEdit}>
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div> : <Button variant={chat.id === currentConversationId ? "secondary" : "ghost"} className={`w-full justify-start text-left h-auto py-2 px-3 pr-7 rounded-md
                    ${chat.id === currentConversationId ? "dark:bg-white/10 light:bg-black/5" : "dark:hover:bg-white/5 light:hover:bg-black/5"}`} onClick={() => setCurrentConversation(chat.id)}>
                  <MessageSquare className="mr-2 h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{chat.title}</span>
                </Button>}
              
              {!editingId && chat.id === currentConversationId && <div className="absolute right-1 top-1.5 hidden group-hover:flex space-x-1">
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={() => handleStartEdit(chat.id, chat.title)}>
                    <Edit2 className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => handleDeleteClick(chat.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>}
            </div>)}
        </div>
      </div>;
  };
  return <div className="w-full h-full flex flex-col bg-background border-r border-white/10 dark:bg-background light:bg-white/95 light:border-black/10 relative">
      <div className="absolute top-3 right-3 z-10">
        
      </div>

      <div className="p-2">
        <Button variant="outline" onClick={createNewConversation} className="w-full justify-start text-left border-white/10 dark:border-white/10 light:border-black/10 mb-1 text-slate-50 bg-transparent">
          <Plus className="mr-2 h-4 w-4" />
          New chat
        </Button>
        
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search or type /web to search..." className="pl-9 bg-transparent dark:border-white/10 light:border-black/10 focus-visible:ring-muted" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} onKeyDown={handleSearchKeyDown} />
        </div>
      </div>
      
      <div className="px-2 py-1">
        <div className="text-xs font-medium text-muted-foreground mb-1 px-2">
          AI Tools
        </div>
        <div className="grid grid-cols-2 gap-1.5 mb-2">
          <Button variant="outline" size="sm" onClick={() => setShowAtomThemes(true)} className="flex items-center justify-start gap-1.5 h-auto py-1.5 dark:bg-transparent light:bg-transparent dark:hover:bg-white/5 light:hover:bg-black/5">
            <Sparkles className="h-3.5 w-3.5 text-yellow-500" />
            <span className="text-xs">Atom Themes</span>
          </Button>
          
          <Button variant="outline" size="sm" onClick={() => setShowAIModels(true)} className="flex items-center justify-start gap-1.5 h-auto py-1.5 dark:bg-transparent light:bg-transparent dark:hover:bg-white/5 light:hover:bg-black/5">
            <Cpu className="h-3.5 w-3.5 text-violet-500" />
            <span className="text-xs text-slate-50">AI Models</span>
          </Button>
          
          <Button variant="outline" size="sm" onClick={() => setShowYouTubeTools(true)} className="flex items-center justify-start gap-1.5 h-auto py-1.5 dark:bg-transparent light:bg-transparent dark:hover:bg-white/5 light:hover:bg-black/5">
            <Youtube className="h-3.5 w-3.5 text-red-500" />
            <span className="text-xs text-slate-50">YouTube</span>
          </Button>
          
          <Button variant="outline" size="sm" onClick={() => setShowImageGenerator(true)} className="flex items-center justify-start gap-1.5 h-auto py-1.5 dark:bg-transparent light:bg-transparent dark:hover:bg-white/5 light:hover:bg-black/5">
            <Image className="h-3.5 w-3.5 text-blue-500" />
            <span className="text-xs text-slate-50">Image Gen</span>
          </Button>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto p-2">
        {filteredConversations.length === 0 && searchTerm ? <div className="text-sm text-center text-muted-foreground p-4">
            No conversations matching "{searchTerm}"
          </div> : <>
            {renderConversationGroup("Today", groupedConversations.today)}
            {renderConversationGroup("Yesterday", groupedConversations.yesterday)}
            {renderConversationGroup("Previous 7 Days", groupedConversations.pastWeek)}
            {renderConversationGroup("Previous 30 Days", groupedConversations.pastMonth)}
            {renderConversationGroup("Older", groupedConversations.older)}
          </>}
      </div>
      
      <div className="p-2 border-t dark:border-white/10 light:border-black/10">
        <div className="space-y-1">
          <Button variant="ghost" onClick={() => clearConversation(currentConversationId || "")} className="w-full justify-start text-slate-50 bg-transparent">
            <Trash2 className="mr-2 h-4 w-4" />
            Clear conversation
          </Button>
          
          <Button variant="ghost" onClick={toggleTheme} className="w-full justify-start dark:hover:bg-white/5 light:hover:bg-black/5">
            {theme === 'dark' ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
            {theme === 'dark' ? 'Light mode' : 'Dark mode'}
          </Button>
          
          <Button variant="ghost" className="w-full justify-start bg-transparent text-slate-50">
            <HelpCircle className="mr-2 h-4 w-4" />
            Help & FAQ
          </Button>
        </div>
        
        <Separator className="my-2 dark:bg-white/10 light:bg-black/10" />
        
        <Button variant="ghost" className="w-full justify-start bg-transparent text-slate-50">
          <User className="mr-2 h-4 w-4" />
          My account
        </Button>
        
        <Button variant="ghost" className="w-full justify-start bg-transparent text-red-300">
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
      
      <Dialog open={showAtomThemes} onOpenChange={setShowAtomThemes}>
        <DialogContent className="dark:bg-black/95 dark:border-white/10 light:bg-white/95 light:border-black/10 max-w-3xl h-[80vh]">
          <AtomThemes onClose={() => setShowAtomThemes(false)} />
        </DialogContent>
      </Dialog>
      
      <Dialog open={showYouTubeTools} onOpenChange={setShowYouTubeTools}>
        <DialogContent className="dark:bg-black/95 dark:border-white/10 light:bg-white/95 light:border-black/10 max-w-2xl h-[80vh]">
          <YouTubeSummarizer onClose={() => setShowYouTubeTools(false)} />
        </DialogContent>
      </Dialog>
      
      <Dialog open={showAIModels} onOpenChange={setShowAIModels}>
        <DialogContent className="dark:bg-black/95 dark:border-white/10 light:bg-white/95 light:border-black/10 max-w-2xl h-[80vh]">
          <AIModels onClose={() => setShowAIModels(false)} />
        </DialogContent>
      </Dialog>
      
      <Dialog open={showImageGenerator} onOpenChange={setShowImageGenerator}>
        <DialogContent className="dark:bg-black/95 dark:border-white/10 light:bg-white/95 light:border-black/10 max-w-2xl h-[80vh]">
          <ImageGenerator onClose={() => setShowImageGenerator(false)} />
        </DialogContent>
      </Dialog>
    </div>;
}