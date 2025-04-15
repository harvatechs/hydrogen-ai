import { useState } from 'react';
import { AtomTheme, ThemeCategory } from '@/types/atom-themes';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useChat } from '@/context/ChatContext';
import { toast } from '@/components/ui/use-toast';
import { 
  Code, 
  Calculator, 
  Beaker,
  DollarSign, 
  TrendingUp, 
  Landmark, 
  BookOpen, 
  Cpu, 
  Brain, 
  Globe, 
  History as HistoryIcon,
  Search
} from 'lucide-react';
import { Input } from './ui/input';

const themeCategories: { category: ThemeCategory; icon: React.ReactNode; color: string }[] = [
  { category: 'Coding', icon: <Code />, color: '#007ACC' },
  { category: 'Math', icon: <Calculator />, color: '#FF5722' },
  { category: 'Science', icon: <Beaker />, color: '#4CAF50' },
  { category: 'Finance', icon: <DollarSign />, color: '#4CAF50' },
  { category: 'Economics', icon: <TrendingUp />, color: '#9C27B0' },
  { category: 'Politics', icon: <Landmark />, color: '#2196F3' },
  { category: 'Literature', icon: <BookOpen />, color: '#795548' },
  { category: 'Computer Science', icon: <Cpu />, color: '#3F51B5' },
  { category: 'AI', icon: <Brain />, color: '#FF9800' },
  { category: 'Geography', icon: <Globe />, color: '#009688' },
  { category: 'History', icon: <HistoryIcon />, color: '#607D8B' }
];

const atomThemes: AtomTheme[] = [
  {
    id: 'coding-helper',
    name: 'Code Assistant',
    description: 'Help with coding problems, debugging, and optimization',
    category: 'Coding',
    prompt: 'You are an expert programming assistant. Help me with the following code:',
    icon: 'Code',
    color: '#007ACC'
  },
  {
    id: 'math-solver',
    name: 'Math Problem Solver',
    description: 'Step-by-step solutions to math problems',
    category: 'Math',
    prompt: 'Act as a math tutor. Solve the following problem step by step:',
    icon: 'Calculator',
    color: '#FF5722'
  },
  {
    id: 'science-explainer',
    name: 'Science Explainer',
    description: 'Clear explanations of scientific concepts',
    category: 'Science',
    prompt: 'Explain the following scientific concept in simple terms:',
    icon: 'Beaker',
    color: '#4CAF50'
  },
  {
    id: 'finance-advisor',
    name: 'Financial Advisor',
    description: 'Personal finance tips and investment advice',
    category: 'Finance',
    prompt: 'Act as a financial advisor. Help me with:',
    icon: 'DollarSign',
    color: '#4CAF50'
  },
  {
    id: 'economics-analyst',
    name: 'Economics Analyst',
    description: 'Analysis of economic trends and concepts',
    category: 'Economics',
    prompt: 'Analyze the following economic concept or situation:',
    icon: 'TrendingUp',
    color: '#9C27B0'
  },
  {
    id: 'political-analyst',
    name: 'Political Analyst',
    description: 'Balanced analysis of political systems and events',
    category: 'Politics',
    prompt: 'Provide a balanced analysis of the following political topic:',
    icon: 'Landmark',
    color: '#2196F3'
  },
  {
    id: 'literature-guide',
    name: 'Literature Guide',
    description: 'Analysis of literary works and writing assistance',
    category: 'Literature',
    prompt: 'Help me understand or analyze the following literary text:',
    icon: 'BookOpen',
    color: '#795548'
  },
  {
    id: 'computer-tutor',
    name: 'Computer Science Tutor',
    description: 'Explanations of CS concepts and algorithms',
    category: 'Computer Science',
    prompt: 'Explain the following computer science concept:',
    icon: 'Cpu',
    color: '#3F51B5'
  },
  {
    id: 'ai-expert',
    name: 'AI Researcher',
    description: 'Expert insights on artificial intelligence',
    category: 'AI',
    prompt: 'Provide expert insight on the following AI topic:',
    icon: 'Brain',
    color: '#FF9800'
  },
  {
    id: 'geography-guide',
    name: 'Geography Guide',
    description: 'Information about places, cultures, and landmarks',
    category: 'Geography',
    prompt: 'Tell me about the geography of:',
    icon: 'Globe',
    color: '#009688'
  },
  {
    id: 'history-buff',
    name: 'History Expert',
    description: 'Detailed historical context and events',
    category: 'History',
    prompt: 'Provide historical context for:',
    icon: 'HistoryIcon',
    color: '#607D8B'
  }
];

export function AtomThemes({ onClose }: { onClose: () => void }) {
  const [selectedCategory, setSelectedCategory] = useState<ThemeCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const { sendMessage } = useChat();

  const filteredThemes = atomThemes.filter(theme => 
    (selectedCategory === 'All' || theme.category === selectedCategory) &&
    (theme.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
     theme.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getIconComponent = (iconName: string) => {
    const category = themeCategories.find(cat => cat.category === 
      atomThemes.find(theme => theme.icon === iconName)?.category);
    return category?.icon || <Code />;
  };

  const applyTheme = (theme: AtomTheme) => {
    sendMessage(theme.prompt);
    toast({
      title: `${theme.name} activated`,
      description: `The ${theme.name} theme has been applied to your chat.`
    });
    onClose();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b dark:border-white/10 light:border-black/10">
        <h2 className="text-xl font-semibold mb-1">Atom Themes</h2>
        <p className="text-sm text-muted-foreground">Specialized templates for different types of questions</p>
        
        <div className="relative mt-3">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search themes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 dark:bg-black/20 light:bg-white"
          />
        </div>
      </div>
      
      <div className="flex overflow-x-auto py-2 px-4 gap-2 scrollbar-none border-b dark:border-white/10 light:border-black/10">
        <Button
          variant={selectedCategory === 'All' ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedCategory('All')}
          className="whitespace-nowrap"
        >
          All
        </Button>
        {themeCategories.map((cat) => (
          <Button
            key={cat.category}
            variant={selectedCategory === cat.category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(cat.category)}
            className="whitespace-nowrap"
            style={{ 
              backgroundColor: selectedCategory === cat.category ? cat.color : 'transparent',
              borderColor: cat.color,
              color: selectedCategory === cat.category ? 'white' : undefined
            }}
          >
            <span className="mr-2">{cat.icon}</span>
            {cat.category}
          </Button>
        ))}
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredThemes.map((theme) => (
            <div
              key={theme.id}
              className="p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md dark:bg-black/20 dark:border-white/10 dark:hover:bg-black/30 light:bg-white light:border-black/10 light:hover:bg-gray-50"
              onClick={() => applyTheme(theme)}
            >
              <div className="flex items-center mb-2">
                <div 
                  className="p-2 rounded-md mr-3" 
                  style={{ backgroundColor: theme.color + '20', color: theme.color }}
                >
                  {getIconComponent(theme.icon)}
                </div>
                <h3 className="font-medium">{theme.name}</h3>
              </div>
              <p className="text-sm text-muted-foreground">{theme.description}</p>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
