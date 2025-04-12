
import { Button } from "@/components/ui/button";
import { ApiKeyDialog } from "./ApiKeyDialog";
import { Trash2 } from "lucide-react";
import { useChat } from "@/context/ChatContext";
import { toast } from "@/components/ui/use-toast";

export function Header() {
  const { clearMessages } = useChat();
  
  const handleClear = () => {
    clearMessages();
    toast({
      title: "Chat Cleared",
      description: "All messages have been cleared."
    });
  };
  
  return (
    <header className="border-b p-4 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-bold text-gemini-purple">Quest Scribe</h1>
        <span className="bg-gemini-purple/10 text-gemini-purple text-xs px-2 py-1 rounded-full">
          Gemini AI
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9"
          onClick={handleClear}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
        <ApiKeyDialog />
      </div>
    </header>
  );
}
