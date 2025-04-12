
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { useChat } from "@/context/ChatContext";

export function ChatInput() {
  const [message, setMessage] = useState("");
  const { sendMessage, isProcessing } = useChat();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isProcessing) return;
    
    const currentMessage = message;
    setMessage("");
    await sendMessage(currentMessage);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        placeholder="Ask a question..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="flex-grow"
        disabled={isProcessing}
      />
      <Button
        type="submit"
        size="icon"
        className="bg-gemini-purple hover:bg-gemini-purple/90"
        disabled={!message.trim() || isProcessing}
      >
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
}
