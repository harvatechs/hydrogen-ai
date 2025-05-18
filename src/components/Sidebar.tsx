
import { useState, useRef, useEffect } from "react";
import { useChat } from "@/context/ChatContext";
import { toast } from "@/components/ui/use-toast";
import { SidebarHeader } from "./sidebar/SidebarHeader";
import { ConversationGroups } from "./sidebar/ConversationGroups";
import { SidebarFooter } from "./sidebar/SidebarFooter";
import { DeleteDialog } from "./sidebar/DeleteDialog";

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
    sendMessage
  } = useChat();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [conversationToDelete, setConversationToDelete] = useState<string | null>(null);
  const editInputRef = useRef<HTMLInputElement>(null);

  const filteredConversations = conversations.filter(chat => 
    chat.title.toLowerCase().includes(searchTerm.toLowerCase()));

  // Date grouping helper
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

  return (
    <div className="w-full h-full flex flex-col bg-background border-r border-white/10 dark:bg-background light:bg-white/95 light:border-black/10">
      <SidebarHeader 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleSearchKeyDown={handleSearchKeyDown}
        createNewConversation={createNewConversation}
      />
      
      <div className="flex-1 overflow-auto p-2">
        {filteredConversations.length === 0 && searchTerm ? (
          <div className="text-sm text-center text-muted-foreground p-4">
            No conversations matching "{searchTerm}"
          </div>
        ) : (
          <ConversationGroups 
            groupedConversations={groupedConversations}
            currentConversationId={currentConversationId}
            editingId={editingId}
            editTitle={editTitle}
            collapsed={collapsed}
            setCurrentConversation={setCurrentConversation}
            handleStartEdit={handleStartEdit}
            handleSaveEdit={handleSaveEdit}
            handleCancelEdit={handleCancelEdit}
            handleKeyDown={handleKeyDown}
            setEditTitle={setEditTitle}
            handleDeleteClick={handleDeleteClick}
          />
        )}
      </div>
      
      <SidebarFooter 
        currentConversationId={currentConversationId}
        clearConversation={clearConversation}
      />
      
      <DeleteDialog 
        isOpen={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
