import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useChat } from "@/context/ChatContext";
import { toast } from "@/components/ui/use-toast";
import { Slider } from "@/components/ui/slider";
import { Moon, Sun, Palette, Zap, Book, Globe, PenSquare, RefreshCw, Save, Eye, MessageSquareText, Info, FileText, 
  Laptop, Mic, Volume2, VolumeX, Bookmark, BellRing, HardDrive, Key, X, ChevronLeft, Trash2, Code } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface SettingsPanelProps {
  onClose: () => void;
}

export function SettingsPanel({ onClose }: SettingsPanelProps) {
  const { 
    apiKey, 
    setApiKey, 
    apiUrl, 
    setApiUrl, 
    theme, 
    setTheme, 
    fontSize, 
    setFontSize,
    model,
    setModel
  } = useChat();
  
  const [key, setKey] = useState(apiKey || "");
  const [url, setUrl] = useState(apiUrl || "");
  const [selectedModel, setSelectedModel] = useState(model || "gemini-2.0-flash");
  const [selectedTheme, setSelectedTheme] = useState(theme);
  const [selectedFontSize, setSelectedFontSize] = useState(fontSize);
  const [activeTab, setActiveTab] = useState("appearance");
  
  // Additional settings state
  const [responseLength, setResponseLength] = useState<number[]>([0.5]);
  const [temperature, setTemperature] = useState<number[]>([0.7]);
  const [voiceVolume, setVoiceVolume] = useState<number[]>([0.8]);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("english");
  const [historyEnabled, setHistoryEnabled] = useState(true);
  const [citationsEnabled, setCitationsEnabled] = useState(true);
  const [streamingEnabled, setStreamingEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [codeHighlightTheme, setCodeHighlightTheme] = useState("dark");
  const [saveToDisk, setSaveToDisk] = useState(false);
  
  // Model information
  const modelInfo = {
    "gemini-2.0-flash": {
      name: "Gemini 2.0 Flash",
      description: "Fast response times, optimized for simple questions and everyday use.",
      tokens: "16K",
      speed: "Very Fast",
      capabilities: ["Chat", "Text Generation", "Simple reasoning"]
    },
    "gemini-2.0-pro": {
      name: "Gemini 2.0 Pro",
      description: "Advanced reasoning and comprehensive responses with deep knowledge.",
      tokens: "32K",
      speed: "Fast",
      capabilities: ["Chat", "Text Generation", "Complex reasoning", "Advanced problem solving", "Code generation"]
    },
    "gemini-1.5-flash": {
      name: "Gemini 1.5 Flash",
      description: "Balanced performance and efficiency for everyday tasks.",
      tokens: "8K",
      speed: "Very Fast",
      capabilities: ["Chat", "Text Generation", "Basic reasoning"]
    },
    "gemini-1.5-pro": {
      name: "Gemini 1.5 Pro",
      description: "Google's high-performance model with exceptional capabilities.",
      tokens: "128K",
      speed: "Standard",
      capabilities: ["Chat", "Text Generation", "Expert reasoning", "Long context understanding", "Advanced code generation"]
    }
  };
  
  // Save appearance settings
  const handleSaveAppearance = () => {
    setTheme(selectedTheme);
    setFontSize(selectedFontSize);
    
    toast({
      title: "Appearance Settings Saved",
      description: "Your display preferences have been updated."
    });
  };
  
  const handleSaveApiSettings = () => {
    if (key.trim()) {
      setApiKey(key.trim());
      setApiUrl(url.trim());
      setModel(selectedModel);
      toast({
        title: "API Settings Saved",
        description: "Your Google Gemini API settings have been saved."
      });
    } else {
      toast({
        title: "Error",
        description: "Please enter a valid API key.",
        variant: "destructive",
      });
    }
  };
  
  // Reset to default API settings
  const handleResetApiSettings = () => {
    const defaultKey = "AIzaSyApy8Nw8M6PeUWtKapURmaZnuH4lWogN6I";
    const defaultUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
    const defaultModel = "gemini-2.0-flash";
    
    setKey(defaultKey);
    setUrl(defaultUrl);
    setSelectedModel(defaultModel);
    setApiKey(defaultKey);
    setApiUrl(defaultUrl);
    setModel(defaultModel);
    
    toast({
      title: "Default Settings Restored",
      description: "API settings have been reset to default values."
    });
  };
  
  // Save model parameters
  const handleSaveModelParams = () => {
    // In a real implementation, this would save these parameters to a context or API
    toast({
      title: "Model Parameters Saved",
      description: "Your model configuration has been updated."
    });
  };
  
  // Save behavior settings
  const handleSaveBehaviorSettings = () => {
    // In a real implementation, this would save these parameters to a context or API
    toast({
      title: "Behavior Settings Saved",
      description: "Your AI behavior preferences have been updated."
    });
  };
  
  // Save all settings
  const handleSaveAllSettings = () => {
    handleSaveAppearance();
    handleSaveApiSettings();
    handleSaveModelParams();
    handleSaveBehaviorSettings();
    
    toast({
      title: "All Settings Saved",
      description: "Your preferences have been updated successfully."
    });
    
    onClose();
  };

  return (
    <div className="w-full h-full flex flex-col relative bg-gradient-to-b from-background to-background/95">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-background/90 backdrop-blur-md border-b border-white/10 p-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Button 
            onClick={onClose} 
            variant="ghost" 
            size="sm" 
            className="h-9 w-9 rounded-full p-0 dark:hover:bg-white/10 light:hover:bg-black/10"
          >
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
          </Button>
          <div>
            <h2 className="text-xl font-semibold">Settings</h2>
            <p className="text-xs text-muted-foreground">Customize your experience</p>
          </div>
        </div>
        <Button 
          onClick={handleSaveAllSettings} 
          size="sm" 
          className="bg-primary/90 hover:bg-primary text-primary-foreground rounded-full px-4"
        >
          <Save className="h-4 w-4 mr-2" />
          Save All
        </Button>
      </div>
      
      {/* Content */}
      <div className="flex-1 flex flex-col">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <div className="sticky top-[73px] z-20 bg-background/90 backdrop-blur-md p-4">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="appearance">
                <Palette className="h-4 w-4 mr-2" />
                Display
              </TabsTrigger>
              <TabsTrigger value="models">
                <Zap className="h-4 w-4 mr-2" />
                Models
              </TabsTrigger>
              <TabsTrigger value="advanced">
                <MessageSquareText className="h-4 w-4 mr-2" />
                Behavior
              </TabsTrigger>
              <TabsTrigger value="about">
                <Info className="h-4 w-4 mr-2" />
                About
              </TabsTrigger>
            </TabsList>
          </div>
          
          <ScrollArea className="flex-1 p-4">
            <TabsContent value="appearance" className="p-4 border rounded-lg">
              <h3 className="text-lg font-medium mb-4">Appearance Settings</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium mb-2">Theme</h4>
                  <RadioGroup value={theme} onValueChange={setTheme} className="flex flex-col space-y-1">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="dark" id="theme-dark" />
                      <Label htmlFor="theme-dark" className="flex items-center cursor-pointer">
                        <Moon className="h-4 w-4 mr-2" />
                        Dark
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="light" id="theme-light" />
                      <Label htmlFor="theme-light" className="flex items-center cursor-pointer">
                        <Sun className="h-4 w-4 mr-2" />
                        Light
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="system" id="theme-system" />
                      <Label htmlFor="theme-system" className="flex items-center cursor-pointer">
                        <Laptop className="h-4 w-4 mr-2" />
                        System
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <Separator className="my-4" />
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Font Size</h4>
                  <RadioGroup value={fontSize} onValueChange={setFontSize} className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="sm" id="font-sm" />
                      <Label htmlFor="font-sm" className="cursor-pointer">Small</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="md" id="font-md" />
                      <Label htmlFor="font-md" className="cursor-pointer">Medium</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="lg" id="font-lg" />
                      <Label htmlFor="font-lg" className="cursor-pointer">Large</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <Separator className="my-4" />
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Code Highlighting Theme</h4>
                  <Select value={codeHighlightTheme} onValueChange={setCodeHighlightTheme}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="github">GitHub</SelectItem>
                      <SelectItem value="monokai">Monokai</SelectItem>
                      <SelectItem value="dracula">Dracula</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="models" className="p-4 border rounded-lg">
              <h3 className="text-lg font-medium mb-4">Model Settings</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium mb-2">API Key</h4>
                  <Input 
                    type="password" 
                    value={key} 
                    onChange={(e) => setKey(e.target.value)}
                    placeholder="Enter your Google Gemini API key" 
                    className="bg-black/20 border-white/10"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Get your API key from the <a href="https://makersuite.google.com/app/apikey" className="text-primary hover:underline" target="_blank" rel="noreferrer">Google AI Studio</a>
                  </p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Model Selection</h4>
                  <RadioGroup value={selectedModel} onValueChange={setSelectedModel} className="space-y-3">
                    {Object.entries(modelInfo).map(([id, info]) => (
                      <div key={id} className="flex items-start space-x-3 p-3 rounded-lg border border-white/10 bg-white/5">
                        <RadioGroupItem value={id} id={`model-${id}`} className="mt-1" />
                        <div className="space-y-1.5">
                          <Label htmlFor={`model-${id}`} className="font-medium cursor-pointer">
                            {info.name}
                          </Label>
                          <p className="text-sm text-muted-foreground">{info.description}</p>
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
                
                <div className="flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={handleResetApiSettings}
                    className="border-white/10 hover:bg-white/5"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reset to Default
                  </Button>
                  <Button onClick={handleSaveApiSettings} className="bg-primary">
                    <Save className="h-4 w-4 mr-2" />
                    Save API Settings
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="advanced" className="p-4 border rounded-lg">
              <h3 className="text-lg font-medium mb-4">Advanced Settings</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm">Streaming Responses</Label>
                    <p className="text-xs text-muted-foreground">Show AI responses as they are generated</p>
                  </div>
                  <Switch 
                    checked={streamingEnabled}
                    onCheckedChange={setStreamingEnabled}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm">Save Chat History</Label>
                    <p className="text-xs text-muted-foreground">Store conversations for later reference</p>
                  </div>
                  <Switch 
                    checked={historyEnabled}
                    onCheckedChange={setHistoryEnabled}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm">Voice Output</Label>
                    <p className="text-xs text-muted-foreground">Enable text-to-speech for AI responses</p>
                  </div>
                  <Switch 
                    checked={voiceEnabled}
                    onCheckedChange={setVoiceEnabled}
                  />
                </div>
                
                <div className="flex justify-end mt-4">
                  <Button onClick={handleSaveModelParams} className="bg-primary">
                    <Save className="h-4 w-4 mr-2" />
                    Save Settings
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="about" className="p-4 border rounded-lg">
              <h3 className="text-lg font-medium mb-4">About</h3>
              
              <div className="space-y-4">
                <div className="flex justify-center py-4">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold">HydroGen AI</h2>
                    <p className="text-sm text-muted-foreground">Version 2.0.0</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-1">About</h4>
                  <p className="text-sm text-muted-foreground">
                    HydroGen AI is a powerful chat interface for Google's Gemini AI models, 
                    featuring a range of productivity tools and a clean, modern interface.
                  </p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-1">Features</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• YouTube Video Summarization</li>
                    <li>• Flashcard Generation</li>
                    <li>• Web Search Integration</li>
                    <li>• Voice Input/Output</li>
                    <li>• Customizable Interface</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </div>
      
      {/* Footer */}
      <div className="sticky bottom-0 bg-background/90 backdrop-blur-md p-4 flex justify-between items-center border-t border-white/10">
        <Button onClick={onClose} variant="outline" className="border-white/10 hover:bg-white/5">
          Cancel
        </Button>
        <Button onClick={handleSaveAllSettings} className="bg-primary/90 hover:bg-primary">
          <Save className="h-4 w-4 mr-2" />
          Save All Changes
        </Button>
      </div>
    </div>
  );
}
