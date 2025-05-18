
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
    <>
      <ChatHistory />
      <ChatInput />
      
      <AtomFeatures 
        activeAtom={activeAtom}
        atomParams={atomParams}
        onClose={closeAtom}
        onSubmitResult={handleAtomSubmit}
      />
    </>
  );
};
