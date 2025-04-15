
import { useState } from 'react';
import { useChat } from '@/context/ChatContext';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Check, Sparkles, Zap, Cpu, Brain, Search } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Input } from './ui/input';

interface AIModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  strengths: string[];
  contextLength: number;
  isPro: boolean;
  isSelected?: boolean;
}

const aiModels: AIModel[] = [
  {
    id: 'openai/gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    provider: 'OpenAI',
    description: 'Fast and efficient for most everyday tasks',
    strengths: ['Coding assistance', 'General knowledge', 'Creative writing'],
    contextLength: 16000,
    isPro: false,
    isSelected: true
  },
  {
    id: 'openai/gpt-4o',
    name: 'GPT-4o',
    provider: 'OpenAI',
    description: 'Advanced reasoning and knowledge',
    strengths: ['Complex problem solving', 'Nuanced understanding', 'Detailed explanations'],
    contextLength: 32000,
    isPro: true
  },
  {
    id: 'anthropic/claude-3-opus',
    name: 'Claude 3 Opus',
    provider: 'Anthropic',
    description: 'Anthropic\'s most powerful model',
    strengths: ['Thoughtful analysis', 'Nuanced reasoning', 'High accuracy'],
    contextLength: 200000,
    isPro: true
  },
  {
    id: 'anthropic/claude-3-sonnet',
    name: 'Claude 3 Sonnet',
    provider: 'Anthropic',
    description: 'Balanced performance and thoughtfulness',
    strengths: ['Clear explanations', 'Creative tasks', 'Balanced responses'],
    contextLength: 200000,
    isPro: false
  },
  {
    id: 'meta-llama/llama-3-70b-chat',
    name: 'Llama 3 70B',
    provider: 'Meta',
    description: 'Open-source model with strong capabilities',
    strengths: ['General knowledge', 'Multilingual', 'Open ecosystem'],
    contextLength: 8000,
    isPro: false
  },
  {
    id: 'google/gemini-pro',
    name: 'Gemini Pro',
    provider: 'Google',
    description: 'Google\'s advanced reasoning model',
    strengths: ['Knowledge retrieval', 'Structured data', 'Logical reasoning'],
    contextLength: 32000,
    isPro: false
  },
  {
    id: 'mistral/mistral-large',
    name: 'Mistral Large',
    provider: 'Mistral AI',
    description: 'Powerful model with strong reasoning',
    strengths: ['Technical understanding', 'Efficient reasoning', 'Factual responses'],
    contextLength: 32000,
    isPro: true
  }
];

export function AIModels({ onClose }: { onClose: () => void }) {
  const { setModel } = useChat();
  const [models, setModels] = useState<AIModel[]>(aiModels);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModel, setSelectedModel] = useState<string>('openai/gpt-3.5-turbo');

  const filteredModels = models.filter(model => 
    model.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    model.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
    model.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectModel = (modelId: string) => {
    setSelectedModel(modelId);
    const updatedModels = models.map(model => ({
      ...model,
      isSelected: model.id === modelId
    }));
    setModels(updatedModels);
  };

  const handleApplyModel = () => {
    const selectedModelObj = models.find(m => m.id === selectedModel);
    if (selectedModelObj) {
      if (selectedModelObj.isPro) {
        toast({
          title: 'Pro Model Selected',
          description: `${selectedModelObj.name} is a premium model that may use more credits.`,
        });
      } else {
        toast({
          title: 'Model Changed',
          description: `Now using ${selectedModelObj.name} for all conversations.`,
        });
      }
      setModel(selectedModel);
      onClose();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b dark:border-white/10 light:border-black/10">
        <h2 className="text-xl font-semibold mb-1">AI Models</h2>
        <p className="text-sm text-muted-foreground">Choose an AI model for your conversations</p>
        
        <div className="relative mt-3">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search models..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 dark:bg-black/20 light:bg-white"
          />
        </div>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-3">
          {filteredModels.map((model) => (
            <div 
              key={model.id}
              className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                model.isSelected 
                  ? 'dark:bg-white/5 dark:border-primary/50 light:bg-primary/5 light:border-primary/50 ring-1 ring-primary' 
                  : 'dark:border-white/10 dark:hover:bg-black/30 light:border-black/10 light:hover:bg-gray-50'
              }`}
              onClick={() => handleSelectModel(model.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                    model.isPro ? 'bg-gradient-to-br from-yellow-400 to-purple-600' : 'bg-primary/10'
                  }`}>
                    {model.isPro ? <Sparkles className="h-4 w-4 text-white" /> : <Cpu className="h-4 w-4 text-primary" />}
                  </div>
                  <div>
                    <h3 className="font-medium flex items-center">
                      {model.name}
                      {model.isPro && (
                        <span className="ml-2 text-xs py-0.5 px-1.5 rounded-full bg-gradient-to-r from-yellow-500 to-purple-500 text-white font-medium">
                          PRO
                        </span>
                      )}
                    </h3>
                    <div className="text-xs text-muted-foreground">{model.provider}</div>
                  </div>
                </div>
                
                {model.isSelected && (
                  <div className="bg-primary text-primary-foreground rounded-full p-1">
                    <Check className="h-4 w-4" />
                  </div>
                )}
              </div>
              
              <p className="text-sm mt-2 text-muted-foreground">{model.description}</p>
              
              <div className="mt-3 flex flex-wrap gap-2">
                {model.strengths.map((strength, index) => (
                  <span 
                    key={index}
                    className="text-xs py-1 px-2 rounded-full dark:bg-white/5 dark:text-white/80 light:bg-black/5 light:text-black/80"
                  >
                    {strength}
                  </span>
                ))}
                <span className="text-xs py-1 px-2 rounded-full dark:bg-white/5 dark:text-white/80 light:bg-black/5 light:text-black/80">
                  {model.contextLength.toLocaleString()} tokens
                </span>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      
      <div className="p-4 border-t dark:border-white/10 light:border-black/10">
        <Button onClick={handleApplyModel} className="w-full">
          Apply Model
        </Button>
      </div>
    </div>
  );
}
