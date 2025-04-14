import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Plus, MessageSquare, Search, Settings, Trash2, ExternalLink, User, LogOut, Edit2, X, Check, Moon, Sun, HelpCircle } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useChat } from "@/context/ChatContext";
import { toast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { SettingsPanel } from "./SettingsPanel";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
export function Sidebar() {
  const {
    clearMessages,
    conversations,
    currentConversationId,
    setCurrentConversation,
    updateConversationTitle,
    clearConversation,
    deleteConversation,
    createNewConversation
  } = useChat();
  const [searchTerm, setSearchTerm] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [conversationToDelete, setConversationToDelete] = useState<string | null>(null);
  const editInputRef = useRef<HTMLInputElement>(null);

  // Filter conversations based on search term
  const filteredConversations = conversations.filter(chat => chat.title.toLowerCase().includes(searchTerm.toLowerCase()));

  // Group conversations by date
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

  // Focus on edit input when editing starts
  useEffect(() => {
    if (editingId && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingId]);
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
  const renderConversationGroup = (title: string, conversations: typeof filteredConversations) => {
    if (conversations.length === 0) return null;
    return <div key={title}>
        <div className="text-xs font-medium text-muted-foreground mb-2 px-2">
          {title}
        </div>
        
        <div className="space-y-1 mb-3">
          {conversations.map(chat => <div key={chat.id} className="relative group">
              {editingId === chat.id ? <div className="flex items-center px-2">
                  <Input ref={editInputRef} value={editTitle} onChange={e => setEditTitle(e.target.value)} onKeyDown={handleKeyDown} className="h-7 text-sm" />
                  <div className="flex space-x-1 ml-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleSaveEdit}>
                      <Check className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleCancelEdit}>
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div> : <Button variant={chat.id === currentConversationId ? "secondary" : "ghost"} className="w-full justify-start text-left h-auto py-2 px-3 pr-7" onClick={() => setCurrentConversation(chat.id)}>
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
  return <div className="w-full h-full flex flex-col bg-background border-r border-white/10">
      <div className="p-2">
        <Button variant="outline" onClick={createNewConversation} className="w-full justify-start text-left border-white/10 mb-1 text-slate-50 bg-[gemini-light] bg-transparent">
          <Plus className="mr-2 h-4 w-4" />
          New chat
        </Button>
        
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search conversations..." className="pl-9 bg-transparent border-white/10 focus-visible:ring-muted" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
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
      
      <div className="p-2 border-t border-white/10">
        <div className="space-y-1">
          <Button variant="ghost" onClick={() => clearConversation(currentConversationId || "")} className="w-full justify-start text-gray-300 bg-transparent">
            <Trash2 className="mr-2 h-4 w-4" />
            Clear conversation
          </Button>
          
          <Button variant="ghost" onClick={() => setShowSettings(true)} className="w-full justify-start text-gray-300 bg-transparent">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
          
          <Button variant="ghost" className="w-full justify-start text-gray-300 bg-transparent">
            <HelpCircle className="mr-2 h-4 w-4" />
            Help & FAQ
          </Button>
        </div>
        
        <Separator className="my-2 bg-white/10" />
        
        <Button variant="ghost" className="w-full justify-start text-gray-300 bg-transparent">
          <User className="mr-2 h-4 w-4" />
          My account
        </Button>
        
        <Button variant="ghost" className="w-full justify-start text-gray-300 bg-transparent">
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </Button>
      </div>
      
      {/* Settings Panel */}
      {showSettings && <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm md:left-[16rem]">
          <div className="fixed left-0 top-0 h-full w-full max-w-md bg-background shadow-lg border-r border-white/10 overflow-hidden md:left-[16rem]">
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h2 className="text-lg font-semibold">Settings</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowSettings(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <SettingsPanel />
          </div>
        </div>}
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Conversation</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this conversation? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>;
}