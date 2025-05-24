
import React from 'react';
import { ChatHistory } from "@/components/ChatHistory";
import { ChatInput } from "@/components/ChatInput";
import { useChat } from "@/context/ChatContext";
import { AtomFeatures } from './AtomFeatures';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const ChatArea: React.FC = () => {
  const {
    activeAtom,
    atomParams,
    setActiveAtom,
    handleAtomResult,
    messages
  } = useChat();
  
  const closeAtom = () => {
    setActiveAtom(null);
  };
  
  const handleAtomSubmit = (result: string) => {
    handleAtomResult(result);
  };

  return (
    <div className="flex flex-col h-full relative">
      {/* Security Notice for new sessions */}
      {messages.length === 0 && (
        <div className="p-4 max-w-4xl mx-auto w-full">
          <Alert className="bg-blue-500/10 border-blue-500/20 mb-4">
            <Shield className="h-4 w-4 text-blue-500" />
            <AlertDescription className="text-blue-700 dark:text-blue-300 flex items-center justify-between">
              <span className="text-sm">
                Your conversations are encrypted and secure. This is a temporary chat session.
              </span>
              <Badge variant="outline" className="ml-2 bg-blue-500/10 text-blue-600 border-blue-500/30">
                Secure
              </Badge>
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-h-0">
        <ChatHistory />
        
        {/* Chat Input with enhanced styling */}
        <div className="flex-shrink-0 border-t border-border/50 bg-background/80 backdrop-blur-sm">
          <ChatInput />
        </div>
      </div>
      
      {/* Atom Features Overlay */}
      <AtomFeatures 
        activeAtom={activeAtom}
        atomParams={atomParams}
        onClose={closeAtom}
        onSubmitResult={handleAtomSubmit}
      />
    </div>
  );
};
