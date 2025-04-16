
import { useState } from 'react';
import { AnswerEngine } from './AnswerEngine';
import { YouTubeSummarizer } from './YouTubeSummarizer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AtomCard } from './AtomCard';
import { Sparkles, YoutubeIcon, Search, BookOpen, FileText, BrainCircuit, FlaskConical } from 'lucide-react';

export default function StudentTools() {
  const [activeAtom, setActiveAtom] = useState<string | null>(null);

  const handleAtomClose = () => {
    setActiveAtom(null);
  };

  return (
    <div className="w-full">
      {activeAtom === 'youtube' && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="bg-card border border-border rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <YouTubeSummarizer onClose={handleAtomClose} />
          </div>
        </div>
      )}

      <Tabs defaultValue="answer-engine" className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="answer-engine" className="flex items-center gap-2">
            <BrainCircuit size={16} />
            <span>Answer Engine</span>
          </TabsTrigger>
          <TabsTrigger value="atoms" className="flex items-center gap-2">
            <Sparkles size={16} />
            <span>Atoms</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="answer-engine" className="space-y-4">
          <AnswerEngine />
        </TabsContent>

        <TabsContent value="atoms" className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <AtomCard
              title="YouTube Summarizer"
              description="Generate summaries from YouTube videos"
              icon={<YoutubeIcon className="h-5 w-5 text-red-500" />}
              onClick={() => setActiveAtom('youtube')}
              color="bg-red-500/10"
            />
            <AtomCard
              title="Flashcard Maker"
              description="Create study flashcards from any text"
              icon={<FileText className="h-5 w-5 text-emerald-500" />}
              onClick={() => {}}
              color="bg-emerald-500/10"
              disabled
            />
            <AtomCard
              title="Research Assistant"
              description="Search and cite academic sources"
              icon={<Search className="h-5 w-5 text-blue-500" />}
              onClick={() => {}}
              color="bg-blue-500/10"
              disabled
            />
            <AtomCard
              title="Study Guide"
              description="Generate comprehensive study guides"
              icon={<BookOpen className="h-5 w-5 text-purple-500" />}
              onClick={() => {}}
              color="bg-purple-500/10"
              disabled
            />
            <AtomCard
              title="Concept Explorer"
              description="Interactive concept maps and explanations"
              icon={<BrainCircuit className="h-5 w-5 text-amber-500" />}
              onClick={() => {}}
              color="bg-amber-500/10"
              disabled
            />
            <AtomCard
              title="Formula Helper"
              description="Science & math formula explanations"
              icon={<FlaskConical className="h-5 w-5 text-cyan-500" />}
              onClick={() => {}}
              color="bg-cyan-500/10"
              disabled
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
