import { useState, useRef, useEffect } from "react";
import { useChat } from "@/context/ChatContext";
import { toast } from "@/components/ui/use-toast";
import { SidebarHeader } from "./sidebar/SidebarHeader";
import { ConversationGroups } from "./sidebar/ConversationGroups";
import { SidebarFooter } from "./sidebar/SidebarFooter";
import { DeleteDialog } from "./sidebar/DeleteDialog";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";

interface SidebarProps {
  collapsed?: boolean;
}

export function Sidebar({ collapsed: collapsedProp = false }: SidebarProps) {
  // Get the sidebar state from the Shadcn sidebar context
  const { state } = useSidebar();
  // Use the state to determine if sidebar is collapsed
  const isCollapsed = state === "collapsed";
  
  const {
    clearMessages,
    conversations,
    currentConversationId,
    setCurrentConversation,
    updateConversationTitle,
    clearConversation,
    deleteConversation,
    createNewConversation,
    sendMessage,
    generateTitle,
    apiKey,
  } = useChat();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [conversationToDelete, setConversationToDelete] = useState<string | null>(null);
  const [generatingTitleFor, setGeneratingTitleFor] = useState<string | null>(null);
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

  const handleRegenerateTitle = async (id: string) => {
    const conversation = conversations.find(c => c.id === id);
    if (conversation && apiKey) {
      setGeneratingTitleFor(id);
      try {
        await generateTitle(id, conversation.messages);
        toast({
          title: "Title Generated",
          description: "Conversation title has been updated based on content."
        });
      } catch (error) {
        toast({
          title: "Title Generation Failed",
          description: "Could not generate a title. Try again later.",
          variant: "destructive"
        });
      } finally {
        setGeneratingTitleFor(null);
      }
    } else if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please set your Google Gemini API key in settings first.",
        variant: "destructive"
      });
    }
  };

  // Add event listener for sidebar state changes
  useEffect(() => {
    const handleSidebarStateChange = (event: CustomEvent) => {
      // This is just for debugging, no need to set state here as we use `state` directly
      console.log("Sidebar state changed:", event.detail.open);
    };

    // Add event listener for custom event
    window.addEventListener("sidebar-state-changed", handleSidebarStateChange as EventListener);

    // Clean up event listener
    return () => {
      window.removeEventListener("sidebar-state-changed", handleSidebarStateChange as EventListener);
    };
  }, []);

  return (
    <div className={cn(
      "w-full h-full flex flex-col bg-background border-r border-white/10 dark:bg-background light:bg-white/95 light:border-black/10",
      isCollapsed && "items-center" // Center items when collapsed
    )}>
      <SidebarHeader 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleSearchKeyDown={handleSearchKeyDown}
        createNewConversation={createNewConversation}
        collapsed={isCollapsed}
      />
      
      <div className={cn(
        "flex-1 overflow-auto p-2",
        isCollapsed && "w-full"
      )}>
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
            collapsed={isCollapsed}
            generatingTitleFor={generatingTitleFor}
            setCurrentConversation={setCurrentConversation}
            handleStartEdit={handleStartEdit}
            handleSaveEdit={handleSaveEdit}
            handleCancelEdit={handleCancelEdit}
            handleKeyDown={handleKeyDown}
            setEditTitle={setEditTitle}
            handleDeleteClick={handleDeleteClick}
            handleRegenerateTitle={handleRegenerateTitle}
          />
        )}
      </div>
      
      <SidebarFooter 
        currentConversationId={currentConversationId}
        clearConversation={clearConversation}
        collapsed={isCollapsed}
      />
      
      <DeleteDialog 
        isOpen={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
