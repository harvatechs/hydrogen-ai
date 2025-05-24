
import React, { useState } from 'react';
import { ChatHistory } from "@/components/ChatHistory";
import { ChatInput } from "@/components/ChatInput";
import { useChat } from "@/context/ChatContext";
import { AtomFeatures } from './AtomFeatures';

export const ChatArea: React.FC = () => {
  const {
    activeAtom,
    atomParams,
    setActiveAtom,
    handleAtomResult
  } = useChat();
  
  const closeAtom = () => {
    setActiveAtom(null);
  };
  
  const handleAtomSubmit = (result: string) => {
    handleAtomResult(result);
  };

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex-1 overflow-hidden">
        <ChatHistory />
      </div>
      <div className="flex-shrink-0 px-2 sm:px-4 pb-4 sm:pb-6">
        <ChatInput />
      </div>
      
      <AtomFeatures 
        activeAtom={activeAtom}
        atomParams={atomParams}
        onClose={closeAtom}
        onSubmitResult={handleAtomSubmit}
      />
    </div>
  );
};
