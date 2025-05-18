
import React from 'react';
import { Bot, Globe, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SearchHeaderProps {
  onAskAI: () => void;
  onClose: () => void;
  isLoading: boolean;
}

export const SearchHeader: React.FC<SearchHeaderProps> = ({ 
  onAskAI, 
  onClose,
  isLoading 
}) => {
  return (
    <div className="flex items-center justify-between gap-4 pb-4">
      <div className="flex items-center gap-2">
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-lg shadow-md">
          <Globe className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="font-semibold">Web Search</h3>
          <p className="text-xs text-muted-foreground">Find information from across the web</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          onClick={onAskAI}
          disabled={isLoading}
          className="h-8 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all"
        >
          <Bot className="h-3.5 w-3.5 mr-2" />
          Ask AI about this
        </Button>
        
        <Button
          size="sm"
          variant="ghost"
          onClick={onClose}
          className="h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
