
import { Message } from "@/types/message";

export function generateConversationLabel(messages: Message[]): string {
  // If no messages, return a default label
  if (messages.length === 0) {
    return "New Conversation";
  }

  // Get the first user message's content for context
  const firstUserMessage = messages.find(msg => msg.role === "user");
  
  if (!firstUserMessage) return "Untitled Conversation";

  // Truncate and clean up the label
  const labelBase = firstUserMessage.content
    .split(/\s+/)
    .slice(0, 5)
    .join(" ")
    .replace(/[^a-zA-Z0-9 ]/g, '');

  // Limit label length
  return labelBase.length > 30 
    ? labelBase.substring(0, 30) + "..." 
    : labelBase || "Conversation";
}
