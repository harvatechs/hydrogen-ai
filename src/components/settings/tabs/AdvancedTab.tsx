
import React from 'react';
import { Settings, RefreshCw } from 'lucide-react';
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useSettings } from '../hooks/useSettingsForm';

export const AdvancedTab = {
  Icon: () => <Settings className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />,
  Content: () => {
    const { 
      showLoadingMessage, setShowLoadingMessage,
      showDetailedResponse, setShowDetailedResponse,
      autocompleteEnabled, setAutocompleteEnabled,
      resetToDefaults
    } = useSettings();

    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-base sm:text-lg font-medium">Advanced Settings</h3>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Configure additional options for the application
          </p>
        </div>
        <div className="space-y-5">
          <div className="flex items-start sm:items-center justify-between gap-3">
            <div className="space-y-0.5 flex-1">
              <Label htmlFor="loading-messages" className="text-sm">Show Loading Messages</Label>
              <p className="text-xs text-muted-foreground">
                Display typing animation while generating response
              </p>
            </div>
            <Switch
              id="loading-messages"
              checked={showLoadingMessage}
              onCheckedChange={setShowLoadingMessage}
              className="mt-1 sm:mt-0"
            />
          </div>
          <div className="flex items-start sm:items-center justify-between gap-3">
            <div className="space-y-0.5 flex-1">
              <Label htmlFor="detailed-response" className="text-sm">Show Detailed Response Info</Label>
              <p className="text-xs text-muted-foreground">
                Display model, tokens, and timing information with responses
              </p>
            </div>
            <Switch
              id="detailed-response"
              checked={showDetailedResponse}
              onCheckedChange={setShowDetailedResponse}
              className="mt-1 sm:mt-0"
            />
          </div>
          <div className="flex items-start sm:items-center justify-between gap-3">
            <div className="space-y-0.5 flex-1">
              <Label htmlFor="autocomplete" className="text-sm">Enable Autocomplete</Label>
              <p className="text-xs text-muted-foreground">
                Allow AI to suggest completions as you type
              </p>
            </div>
            <Switch
              id="autocomplete"
              checked={autocompleteEnabled}
              onCheckedChange={setAutocompleteEnabled}
              className="mt-1 sm:mt-0"
            />
          </div>
          <div className="pt-4 border-t">
            <Button 
              variant="destructive" 
              onClick={resetToDefaults}
              className="w-full h-10"
            >
              <RefreshCw className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2" />
              Reset All Settings
            </Button>
          </div>
        </div>
      </div>
    );
  }
};
