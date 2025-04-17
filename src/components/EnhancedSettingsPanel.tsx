import React, { useState, useEffect } from 'react';
import { toast } from "@/components/ui/use-toast";
import { useSettings } from '@/context/SettingsContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Switch } from '@/components/ui/switch';
import { 
  X, 
  Settings, 
  Save, 
  Moon, 
  Sun, 
  Monitor, 
  Palette, 
  Key, 
  Bot, 
  Info, 
  RefreshCw 
} from 'lucide-react';

// Define MODEL_OPTIONS if not available from the imports
const MODEL_OPTIONS = [
  { value: "gemini-2.0-flash", label: "Gemini 2.0 Flash" },
  { value: "gemini-2.0-pro", label: "Gemini 2.0 Pro" },
  { value: "gemini-1.5-flash", label: "Gemini 1.5 Flash" },
  { value: "gemini-1.5-pro", label: "Gemini 1.5 Pro" }
];

export interface EnhancedSettingsPanelProps {
  onClose: () => void;
  open: boolean;
}

export function EnhancedSettingsPanel({ onClose, open }: EnhancedSettingsPanelProps) {
  const { theme, setTheme, fontSize, setFontSize } = useSettings();

  // State for form values
  const [apiKey, setApiKey] = useState<string>('');
  const [apiURL, setApiURL] = useState<string>('');
  const [selectedTheme, setSelectedTheme] = useState<'dark' | 'light' | 'system'>(theme as any);
  const [selectedFontSize, setSelectedFontSize] = useState<'small' | 'medium' | 'large'>(fontSize as any);
  const [model, setModel] = useState<string>('');
  const [maxTokens, setMaxTokens] = useState<number>(800);
  const [temperature, setTemperature] = useState<number>(0.7);
  const [topP, setTopP] = useState<number>(0.9);
  const [showLoadingMessage, setShowLoadingMessage] = useState<boolean>(true);
  const [showDetailedResponse, setShowDetailedResponse] = useState<boolean>(true);
  const [autocompleteEnabled, setAutocompleteEnabled] = useState<boolean>(true);
  const [themeColors, setThemeColors] = useState<{ 
    primary: string; 
    secondary: string;
    accent: string;
  }>({
    primary: '',
    secondary: '',
    accent: ''
  });

  // Load settings on component mount
  useEffect(() => {
    const loadSettings = () => {
      // API settings
      const savedApiKey = localStorage.getItem('api-key') || '';
      const savedApiURL = localStorage.getItem('api-url') || '';
      setApiKey(savedApiKey);
      setApiURL(savedApiURL);

      // Model settings
      const savedModel = localStorage.getItem('model') || MODEL_OPTIONS[0].value;
      const savedMaxTokens = Number(localStorage.getItem('max-tokens') || '800');
      const savedTemperature = Number(localStorage.getItem('temperature') || '0.7');
      const savedTopP = Number(localStorage.getItem('top-p') || '0.9');
      setModel(savedModel);
      setMaxTokens(savedMaxTokens);
      setTemperature(savedTemperature);
      setTopP(savedTopP);

      // UI settings
      const savedShowLoadingMessage = localStorage.getItem('show-loading-message') !== 'false';
      const savedShowDetailedResponse = localStorage.getItem('show-detailed-response') !== 'false';
      const savedAutocompleteEnabled = localStorage.getItem('autocomplete-enabled') !== 'false';
      setShowLoadingMessage(savedShowLoadingMessage);
      setShowDetailedResponse(savedShowDetailedResponse);
      setAutocompleteEnabled(savedAutocompleteEnabled);

      // Theme colors
      const savedThemeColors = {
        primary: localStorage.getItem('theme-color-primary') || '',
        secondary: localStorage.getItem('theme-color-secondary') || '',
        accent: localStorage.getItem('theme-color-accent') || ''
      };
      setThemeColors(savedThemeColors);
    };

    loadSettings();
  }, []);

  // Save all settings
  const saveSettings = () => {
    try {
      // API settings
      localStorage.setItem('api-key', apiKey);
      localStorage.setItem('api-url', apiURL);

      // UI settings
      setTheme(selectedTheme);
      setFontSize(selectedFontSize);
      localStorage.setItem('show-loading-message', String(showLoadingMessage));
      localStorage.setItem('show-detailed-response', String(showDetailedResponse));
      localStorage.setItem('autocomplete-enabled', String(autocompleteEnabled));
      
      // Model settings
      localStorage.setItem('model', model);
      localStorage.setItem('max-tokens', String(maxTokens));
      localStorage.setItem('temperature', String(temperature));
      localStorage.setItem('top-p', String(topP));

      // Theme colors (if provided)
      if (themeColors.primary) {
        localStorage.setItem('theme-color-primary', themeColors.primary);
        document.documentElement.style.setProperty('--primary', themeColors.primary);
      }
      if (themeColors.secondary) {
        localStorage.setItem('theme-color-secondary', themeColors.secondary);
        document.documentElement.style.setProperty('--secondary', themeColors.secondary);
      }
      if (themeColors.accent) {
        localStorage.setItem('theme-color-accent', themeColors.accent);
        document.documentElement.style.setProperty('--accent', themeColors.accent);
      }

      toast({
        title: 'Settings saved',
        description: 'Your settings have been saved successfully.',
      });
      
      onClose();
    } catch (error) {
      toast({
        title: 'Error saving settings',
        description: 'There was an error saving your settings. Please try again.',
        variant: 'destructive',
      });
      console.error('Error saving settings:', error);
    }
  };

  // Reset to defaults
  const resetToDefaults = () => {
    try {
      // Confirm before resetting
      if (!window.confirm('Are you sure you want to reset all settings to defaults?')) {
        return;
      }

      // API settings
      setApiKey('');
      setApiURL('');
      localStorage.removeItem('api-key');
      localStorage.removeItem('api-url');

      // UI settings
      setSelectedTheme('dark');
      setSelectedFontSize('medium');
      setTheme('dark');
      setFontSize('medium');
      setShowLoadingMessage(true);
      setShowDetailedResponse(true);
      setAutocompleteEnabled(true);
      localStorage.setItem('show-loading-message', 'true');
      localStorage.setItem('show-detailed-response', 'true');
      localStorage.setItem('autocomplete-enabled', 'true');

      // Model settings
      setModel(MODEL_OPTIONS[0].value);
      setMaxTokens(800);
      setTemperature(0.7);
      setTopP(0.9);
      localStorage.setItem('model', MODEL_OPTIONS[0].value);
      localStorage.setItem('max-tokens', '800');
      localStorage.setItem('temperature', '0.7');
      localStorage.setItem('top-p', '0.9');

      // Theme colors
      setThemeColors({ primary: '', secondary: '', accent: '' });
      localStorage.removeItem('theme-color-primary');
      localStorage.removeItem('theme-color-secondary');
      localStorage.removeItem('theme-color-accent');
      document.documentElement.style.removeProperty('--primary');
      document.documentElement.style.removeProperty('--secondary');
      document.documentElement.style.removeProperty('--accent');

      toast({
        title: 'Settings reset',
        description: 'Your settings have been reset to defaults.',
      });
    } catch (error) {
      toast({
        title: 'Error resetting settings',
        description: 'There was an error resetting your settings. Please try again.',
        variant: 'destructive',
      });
      console.error('Error resetting settings:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-full w-full h-full sm:h-auto sm:max-w-4xl sm:max-h-[90vh] p-0 overflow-auto border-0 sm:border-2 rounded-none sm:rounded-lg">
        <DialogHeader className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm p-4 pb-2">
          <DialogTitle className="text-xl sm:text-2xl font-bold">Settings</DialogTitle>
          <DialogDescription className="text-sm">Customize your HydroGen experience</DialogDescription>
          <Button variant="ghost" size="icon" onClick={onClose} className="absolute right-4 top-4 h-9 w-9">
            <X className="h-5 w-5" />
          </Button>
        </DialogHeader>
        
        <Tabs defaultValue="appearance" className="w-full">
          <div className="px-3 sm:px-6 sticky top-[72px] z-10 bg-background/95 backdrop-blur-sm py-2">
            <TabsList className="w-full grid grid-cols-2 sm:grid-cols-4 mb-4 gap-1 sm:gap-0">
              <TabsTrigger value="appearance" className="text-xs sm:text-sm py-2">
                <Palette className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">Appearance</span>
                <span className="xs:hidden">Look</span>
              </TabsTrigger>
              <TabsTrigger value="api" className="text-xs sm:text-sm py-2">
                <Key className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span>API</span>
              </TabsTrigger>
              <TabsTrigger value="model" className="text-xs sm:text-sm py-2">
                <Bot className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span>Model</span>
              </TabsTrigger>
              <TabsTrigger value="advanced" className="text-xs sm:text-sm py-2">
                <Settings className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">Advanced</span>
                <span className="xs:hidden">More</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Appearance Tab */}
          <TabsContent value="appearance" className="space-y-4 px-3 sm:px-6 pt-2 pb-20 sm:pb-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-base sm:text-lg font-medium">Theme</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div
                    className={`flex flex-row sm:flex-col items-center gap-3 sm:gap-2 rounded-lg border p-3 sm:p-4 cursor-pointer hover:bg-accent/50 ${
                      selectedTheme === 'light' ? 'border-primary bg-accent/20' : ''
                    }`}
                    onClick={() => setSelectedTheme('light')}
                  >
                    <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-md bg-white dark:bg-gray-200 flex items-center justify-center">
                      <Sun className="h-5 w-5 sm:h-6 sm:w-6 text-black" />
                    </div>
                    <span>Light</span>
                  </div>
                  <div
                    className={`flex flex-row sm:flex-col items-center gap-3 sm:gap-2 rounded-lg border p-3 sm:p-4 cursor-pointer hover:bg-accent/50 ${
                      selectedTheme === 'dark' ? 'border-primary bg-accent/20' : ''
                    }`}
                    onClick={() => setSelectedTheme('dark')}
                  >
                    <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-md bg-gray-900 flex items-center justify-center">
                      <Moon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <span>Dark</span>
                  </div>
                  <div
                    className={`flex flex-row sm:flex-col items-center gap-3 sm:gap-2 rounded-lg border p-3 sm:p-4 cursor-pointer hover:bg-accent/50 ${
                      selectedTheme === 'system' ? 'border-primary bg-accent/20' : ''
                    }`}
                    onClick={() => setSelectedTheme('system')}
                  >
                    <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-md bg-gradient-to-tr from-gray-900 to-white flex items-center justify-center">
                      <Monitor className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700" />
                    </div>
                    <span>System</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-base sm:text-lg font-medium">Font Size</h3>
                <div className="grid grid-cols-3 gap-2">
                  <div
                    className={`flex flex-col items-center gap-2 rounded-lg border p-3 sm:p-4 cursor-pointer hover:bg-accent/50 ${
                      selectedFontSize === 'small' ? 'border-primary bg-accent/20' : ''
                    }`}
                    onClick={() => setSelectedFontSize('small')}
                  >
                    <div className="text-sm">Aa</div>
                    <span>Small</span>
                  </div>
                  <div
                    className={`flex flex-col items-center gap-2 rounded-lg border p-3 sm:p-4 cursor-pointer hover:bg-accent/50 ${
                      selectedFontSize === 'medium' ? 'border-primary bg-accent/20' : ''
                    }`}
                    onClick={() => setSelectedFontSize('medium')}
                  >
                    <div className="text-base">Aa</div>
                    <span>Medium</span>
                  </div>
                  <div
                    className={`flex flex-col items-center gap-2 rounded-lg border p-3 sm:p-4 cursor-pointer hover:bg-accent/50 ${
                      selectedFontSize === 'large' ? 'border-primary bg-accent/20' : ''
                    }`}
                    onClick={() => setSelectedFontSize('large')}
                  >
                    <div className="text-lg">Aa</div>
                    <span>Large</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-base sm:text-lg font-medium">Custom Theme Colors</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Customize application colors (optional). Use hex color codes (e.g., #FF5733).
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="primary-color">Primary Color</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="primary-color"
                        placeholder="#6366f1"
                        value={themeColors.primary}
                        onChange={(e) => setThemeColors({...themeColors, primary: e.target.value})}
                        className="h-10"
                      />
                      <div 
                        className="w-10 h-10 rounded-md border"
                        style={{backgroundColor: themeColors.primary || 'var(--primary)'}}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="secondary-color">Secondary Color</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="secondary-color"
                        placeholder="#f43f5e"
                        value={themeColors.secondary}
                        onChange={(e) => setThemeColors({...themeColors, secondary: e.target.value})}
                        className="h-10"
                      />
                      <div 
                        className="w-10 h-10 rounded-md border"
                        style={{backgroundColor: themeColors.secondary || 'var(--secondary)'}}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accent-color">Accent Color</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="accent-color"
                        placeholder="#22c55e"
                        value={themeColors.accent}
                        onChange={(e) => setThemeColors({...themeColors, accent: e.target.value})}
                        className="h-10"
                      />
                      <div 
                        className="w-10 h-10 rounded-md border"
                        style={{backgroundColor: themeColors.accent || 'var(--accent)'}}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* API Tab */}
          <TabsContent value="api" className="space-y-4 px-3 sm:px-6 pt-2 pb-20 sm:pb-6">
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
          </TabsContent>

          {/* Model Tab */}
          <TabsContent value="model" className="space-y-4 px-3 sm:px-6 pt-2 pb-20 sm:pb-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-base sm:text-lg font-medium">Model Settings</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Configure AI model parameters for optimal performance
                </p>
              </div>
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="model-select">Model</Label>
                  <Select
                    value={model}
                    onValueChange={setModel}
                  >
                    <SelectTrigger id="model-select" className="w-full h-10">
                      <SelectValue placeholder="Select a model" />
                    </SelectTrigger>
                    <SelectContent>
                      {MODEL_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="max-tokens">Max Tokens</Label>
                    <span className="text-xs sm:text-sm text-muted-foreground">{maxTokens}</span>
                  </div>
                  <Slider
                    id="max-tokens"
                    min={100}
                    max={4000}
                    step={100}
                    value={[maxTokens]}
                    onValueChange={(value) => setMaxTokens(value[0])}
                    className="w-full py-2"
                  />
                  <p className="text-xs text-muted-foreground">
                    Controls the maximum length of the model's response
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="temperature">Temperature</Label>
                      <span className="text-xs sm:text-sm text-muted-foreground">{temperature.toFixed(1)}</span>
                    </div>
                    <Slider
                      id="temperature"
                      min={0}
                      max={2}
                      step={0.1}
                      value={[temperature]}
                      onValueChange={(value) => setTemperature(value[0])}
                      className="w-full py-2"
                    />
                    <p className="text-xs text-muted-foreground">
                      Higher values make output more random, lower values more deterministic
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="top-p">Top P</Label>
                      <span className="text-xs sm:text-sm text-muted-foreground">{topP.toFixed(1)}</span>
                    </div>
                    <Slider
                      id="top-p"
                      min={0.1}
                      max={1}
                      step={0.1}
                      value={[topP]}
                      onValueChange={(value) => setTopP(value[0])}
                      className="w-full py-2"
                    />
                    <p className="text-xs text-muted-foreground">
                      Controls diversity via nucleus sampling
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Advanced Tab */}
          <TabsContent value="advanced" className="space-y-4 px-3 sm:px-6 pt-2 pb-20 sm:pb-6">
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
          </TabsContent>
        </Tabs>
        <div className="px-3 sm:px-6 py-4 flex justify-between gap-3 sticky bottom-0 bg-background/95 backdrop-blur-sm border-t mt-4">
          <Button variant="outline" onClick={onClose} className="flex-1 h-10">
            Cancel
          </Button>
          <Button onClick={saveSettings} className="flex-1 h-10">
            <Save className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2" />
            Save Settings
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
