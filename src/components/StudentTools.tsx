
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
  Tooltip, 
  TooltipContent, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

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
          <Tooltip key={tool.name}>
            <TooltipTrigger asChild>
              <div 
                className={cn(
                  "tool-item flex flex-col items-center justify-center p-3 rounded-lg transition-all duration-200 hover:bg-primary/5 cursor-pointer",
                  "dark:hover:bg-white/10 light:hover:bg-black/5"
                )}
              >
                <tool.icon className={`h-6 w-6 mb-2 ${tool.color}`} />
                <span className="text-sm font-medium">{tool.name}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent className="p-2">
              <div className="flex space-x-2">
                <tool.icon className={`h-4 w-4 mt-0.5 ${tool.color}`} />
                <div>
                  <p className="text-xs">{tool.description}</p>
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </div>
  );
};

export default StudentTools;
