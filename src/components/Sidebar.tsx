
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { 
  Plus, MessageSquare, Search, Settings, 
  Trash2, ExternalLink, User, LogOut
} from "lucide-react";
import { useState } from "react";
import { useChat } from "@/context/ChatContext";
import { toast } from "@/components/ui/use-toast";

export function Sidebar() {
  const { clearMessages } = useChat();
  const [chatHistory] = useState([
    { id: 1, title: "New chat", active: true },
    { id: 2, title: "React vs Angular comparison" },
    { id: 3, title: "How to optimize website performance" },
    { id: 4, title: "Machine learning basics explained" },
  ]);
  
  const handleClear = () => {
    clearMessages();
    toast({
      title: "Chat Cleared",
      description: "All messages have been cleared."
    });
  };
  
  return (
    <div className="w-full h-full flex flex-col bg-background border-r border-white/10">
      <div className="p-2">
        <Button 
          variant="outline" 
          className="w-full justify-start text-left border-white/10 hover:bg-secondary mb-1"
        >
          <Plus className="mr-2 h-4 w-4" />
          New chat
        </Button>
        
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search conversations..." 
            className="pl-9 bg-transparent border-white/10 focus-visible:ring-muted"
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-auto p-2">
        <div className="text-xs font-medium text-muted-foreground mb-2 px-2">
          Today
        </div>
        
        <div className="space-y-1">
          {chatHistory.map((chat) => (
            <Button
              key={chat.id}
              variant={chat.active ? "secondary" : "ghost"}
              className="w-full justify-start text-left h-auto py-2 px-3"
            >
              <MessageSquare className="mr-2 h-4 w-4 flex-shrink-0" />
              <span className="truncate">{chat.title}</span>
            </Button>
          ))}
        </div>
      </div>
      
      <div className="p-2 border-t border-white/10">
        <div className="space-y-1">
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground hover:text-white"
            onClick={handleClear}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Clear conversations
          </Button>
          
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground hover:text-white"
          >
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
          
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground hover:text-white"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            Updates & FAQ
          </Button>
        </div>
        
        <Separator className="my-2 bg-white/10" />
        
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-white"
        >
          <User className="mr-2 h-4 w-4" />
          My account
        </Button>
        
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-white"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </Button>
      </div>
    </div>
  );
}
