
import React from 'react';
import { Key, Info } from 'lucide-react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useSettingsForm } from '../hooks/useSettingsForm';

export const ApiTab = {
  Icon: () => <Key className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />,
  Content: () => {
    const { apiKey, setApiKey, apiURL, setApiURL } = useSettingsForm();

    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-base sm:text-lg font-medium">API Configuration</h3>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Enter your API credentials for connecting to language models
          </p>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="api-key" className="flex items-center gap-2">
              API Key
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs text-xs sm:text-sm">Your API key for authentication with the AI service</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <Input
              id="api-key"
              type="password"
              placeholder="Enter your API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="h-10"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="api-url" className="flex items-center gap-2">
              API URL (Optional)
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs text-xs sm:text-sm">Custom API endpoint URL (leave empty for default)</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <Input
              id="api-url"
              type="text"
              placeholder="https://api.example.com/v1"
              value={apiURL}
              onChange={(e) => setApiURL(e.target.value)}
              className="h-10"
            />
          </div>
        </div>
      </div>
    );
  }
};
