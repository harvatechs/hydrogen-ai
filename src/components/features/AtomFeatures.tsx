
import React from 'react';
import { YouTubeSummarizer } from "@/atoms/YouTubeSummarizer";
import { FlashcardMaker } from "@/atoms/FlashcardMaker";
import WebSearchAtom from "@/atoms/WebSearchAtom";
import { AISummarizer } from "@/atoms/AISummarizer";
import { FlashcardGenerator } from "@/components/study/FlashcardGenerator";
import { Summarizer } from "@/components/study/Summarizer";
import { AtomType } from "@/types/atoms";
import { Button } from "@/components/ui/button";
import { notificationService } from "@/services/NotificationService";

interface AtomFeaturesProps {
  activeAtom: AtomType | null;
  atomParams: string;
  onClose: () => void;
  onSubmitResult: (result: string) => void;
}

export const AtomFeatures: React.FC<AtomFeaturesProps> = ({
  activeAtom,
  atomParams,
  onClose,
  onSubmitResult
}) => {
  const handleAtomSubmit = (result: string) => {
    onSubmitResult(result);
    notificationService.success("Feature completed successfully!");
  };
  
  // Get atom content based on active atom
  if (!activeAtom) return null;
  
  switch (activeAtom) {
    case 'youtube':
      return (
        <YouTubeSummarizer 
          videoUrl={atomParams} 
          onClose={onClose} 
          onSubmitResult={handleAtomSubmit}
        />
      );
    case 'flashcard':
      return atomParams ? (
        <FlashcardMaker 
          initialQuery={atomParams} 
          onClose={onClose} 
          onSubmitResult={handleAtomSubmit}
        />
      ) : (
        <FlashcardGenerator 
          onClose={onClose}
          onSubmitFlashcards={handleAtomSubmit}
        />
      );
    case 'websearch':
      return (
        <WebSearchAtom
          query={atomParams}
          onClose={onClose}
          onSubmitResult={handleAtomSubmit}
        />
      );
    case 'summarize':
      return atomParams ? (
        <AISummarizer
          initialText={atomParams}
          onClose={onClose}
          onSubmitResult={handleAtomSubmit}
        />
      ) : (
        <Summarizer
          onClose={onClose}
          onSubmitSummary={handleAtomSubmit}
        />
      );
    default:
      return (
        <div className="fixed inset-0 z-40 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg border border-white/10 shadow-lg p-6 max-w-xl w-full">
            <h2 className="text-xl font-semibold mb-4">Coming Soon</h2>
            <p className="text-muted-foreground">
              This feature is under development and will be available soon!
            </p>
            <div className="mt-6 flex justify-end">
              <Button onClick={onClose}>Close</Button>
            </div>
          </div>
        </div>
      );
  }
};
