
import React from 'react';
import { 
  BadgeCheck, 
  Book, 
  Calculator, 
  Calendar, 
  Clock, 
  FileText, 
  FlaskConical, 
  Globe, 
  Lightbulb 
} from 'lucide-react';
import { 
  HoverCard, 
  HoverCardContent, 
  HoverCardTrigger 
} from '@/components/ui/hover-card';

const StudentTools = () => {
  const tools = [
    { 
      name: 'Flashcards', 
      icon: BadgeCheck, 
      color: 'text-blue-500',
      description: 'Create and study flashcards to memorize key concepts'
    },
    { 
      name: 'Calculator', 
      icon: Calculator, 
      color: 'text-green-500',
      description: 'Perform calculations and solve math problems'
    },
    { 
      name: 'Notes', 
      icon: FileText, 
      color: 'text-yellow-500',
      description: 'Take and organize your study notes'
    },
    { 
      name: 'Dictionary', 
      icon: Book, 
      color: 'text-purple-500',
      description: 'Look up definitions and synonyms'
    },
    { 
      name: 'Timer', 
      icon: Clock, 
      color: 'text-red-500',
      description: 'Set timers for focused study sessions'
    },
    { 
      name: 'Science', 
      icon: FlaskConical, 
      color: 'text-teal-500',
      description: 'Access scientific tools and references'
    },
    { 
      name: 'Languages', 
      icon: Globe, 
      color: 'text-indigo-500',
      description: 'Translate and learn new languages'
    },
    { 
      name: 'Study Tips', 
      icon: Lightbulb, 
      color: 'text-amber-500',
      description: 'Get advice to improve your study habits'
    }
  ];

  return (
    <div className="student-tools animate-fade-in">
      <h2 className="flex items-center text-lg font-semibold mb-4">
        <Calendar className="mr-2 h-5 w-5 text-gemini-purple" />
        Student Resources
      </h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {tools.map((tool) => (
          <HoverCard key={tool.name}>
            <HoverCardTrigger asChild>
              <div className="tool-item flex flex-col items-center justify-center p-3 rounded-lg transition-all duration-200 hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer">
                <tool.icon className={`h-6 w-6 mb-2 ${tool.color}`} />
                <span className="text-sm font-medium">{tool.name}</span>
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-64 p-3">
              <div className="flex space-x-2">
                <tool.icon className={`h-5 w-5 mt-0.5 ${tool.color}`} />
                <div>
                  <h4 className="text-sm font-semibold">{tool.name}</h4>
                  <p className="text-xs text-muted-foreground">{tool.description}</p>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        ))}
      </div>
    </div>
  );
};

export default StudentTools;
