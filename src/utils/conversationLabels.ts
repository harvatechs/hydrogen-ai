
import { Message } from "@/types/message";

/**
 * Generates a user-friendly label for a conversation based on its messages
 */
export function generateConversationLabel(messages: Message[]): string {
  // Find the first user message as it usually contains the topic
  const firstUserMessage = messages.find(msg => msg.role === 'user');
  
  if (!firstUserMessage) {
    return "New Conversation";
  }
  
  // Extract the first sentence or a portion of the message
  const content = firstUserMessage.content;
  
  // Clean up the content (remove markdown, code blocks, etc)
  const cleanedContent = content.replace(/```[\s\S]*?```/g, '')
                              .replace(/`[^`]*`/g, '')
                              .replace(/#/g, '')
                              .replace(/\*\*/g, '')
                              .replace(/\*/g, '')
                              .trim();
  
  // Get first part of the message
  let label = cleanedContent.split(/[.!?]/)[0].trim();
  
  // Limit label length
  if (label.length > 40) {
    label = label.substring(0, 37) + "...";
  } else if (label.length === 0) {
    // Fallback if the first sentence is empty
    label = cleanedContent.substring(0, 40);
    if (label.length === 40) {
      label += "...";
    }
  }
  
  return label || "New Conversation";
}
