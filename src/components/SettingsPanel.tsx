
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
import { Moon, Sun, Palette, Zap, Book, Globe, PenSquare, RefreshCw, Save, Eye, MessageSquareText, Info, FileText, Languages, 
  Laptop, Mic, Volume2, VolumeX, Bookmark, BellRing, HardDrive, Key, Sparkles } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export function SettingsPanel() {
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
    toast({
      title: "Model Parameters Saved",
      description: "Your model configuration has been updated."
    });
  };
  
  // Save all settings
  const handleSaveAllSettings = () => {
    handleSaveApiSettings();
    handleSaveModelParams();
    
    toast({
      title: "All Settings Saved",
      description: "Your preferences have been updated successfully."
    });
  };

  return (
    <div className="w-full h-full overflow-y-auto flex flex-col">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
        <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-sm border-b border-white/10 p-4">
          <TabsList className="grid grid-cols-4 w-full bg-black/40">
            <TabsTrigger value="appearance" className="flex flex-col items-center py-2 px-2 text-xs data-[state=active]:text-gemini-yellow">
              <Palette size={14} className="mb-1" />
              <span>Display</span>
            </TabsTrigger>
            <TabsTrigger value="models" className="flex flex-col items-center py-2 px-2 text-xs data-[state=active]:text-gemini-yellow">
              <Zap size={14} className="mb-1" />
              <span>Models</span>
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex flex-col items-center py-2 px-2 text-xs data-[state=active]:text-gemini-yellow">
              <MessageSquareText size={14} className="mb-1" />
              <span>Behavior</span>
            </TabsTrigger>
            <TabsTrigger value="about" className="flex flex-col items-center py-2 px-2 text-xs data-[state=active]:text-gemini-yellow">
              <Info size={14} className="mb-1" />
              <span>About</span>
            </TabsTrigger>
          </TabsList>
        </div>
        
        <div className="p-4 space-y-6">
          {/* Appearance Tab */}
          <TabsContent value="appearance" className="space-y-6">
            <div className="bg-black/40 rounded-lg p-4 space-y-4 border border-white/10">
              <h3 className="text-md font-medium text-gemini-yellow flex items-center">
                <Eye className="h-4 w-4 mr-2" />
                Theme
              </h3>
              <RadioGroup value={theme} onValueChange={setTheme} className="grid grid-cols-3 gap-2">
                <Label className="flex flex-col items-center space-y-2 cursor-pointer">
                  <div className={`h-20 w-full rounded-md border ${theme === 'dark' ? 'border-gemini-yellow' : 'border-white/10'} bg-black p-2 flex items-center justify-center`}>
                    <Moon size={24} className="text-white/70" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dark" id="theme-dark" />
                    <span>Dark</span>
                  </div>
                </Label>
                
                <Label className="flex flex-col items-center space-y-2 cursor-pointer">
                  <div className={`h-20 w-full rounded-md border ${theme === 'light' ? 'border-gemini-yellow' : 'border-white/10'} bg-white p-2 flex items-center justify-center`}>
                    <Sun size={24} className="text-black/70" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="light" id="theme-light" />
                    <span>Light</span>
                  </div>
                </Label>
                
                <Label className="flex flex-col items-center space-y-2 cursor-pointer">
                  <div className={`h-20 w-full rounded-md border ${theme === 'system' ? 'border-gemini-yellow' : 'border-white/10'} bg-gradient-to-r from-black to-white p-2 flex items-center justify-center`}>
                    <Laptop size={24} className="text-white/70" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="system" id="theme-system" />
                    <span>System</span>
                  </div>
                </Label>
              </RadioGroup>
            </div>
            
            <div className="bg-black/40 rounded-lg p-4 space-y-4 border border-white/10">
              <h3 className="text-md font-medium text-gemini-yellow flex items-center">
                <PenSquare className="h-4 w-4 mr-2" />
                Text Size
              </h3>
              <RadioGroup value={fontSize} onValueChange={setFontSize} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="small" id="font-small" />
                    <Label htmlFor="font-small" className="cursor-pointer">Small</Label>
                  </div>
                  <div className="text-sm font-size-small">Aa</div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="medium" id="font-medium" />
                    <Label htmlFor="font-medium" className="cursor-pointer">Medium</Label>
                  </div>
                  <div className="text-base font-size-normal">Aa</div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="large" id="font-large" />
                    <Label htmlFor="font-large" className="cursor-pointer">Large</Label>
                  </div>
                  <div className="text-lg font-size-large">Aa</div>
                </div>
              </RadioGroup>
            </div>
            
            <div className="bg-black/40 rounded-lg p-4 space-y-4 border border-white/10">
              <h3 className="text-md font-medium text-gemini-yellow flex items-center">
                <Globe className="h-4 w-4 mr-2" />
                Language
              </h3>
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger className="bg-black/30 border-white/10">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent className="bg-black border-white/10">
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="spanish">Spanish</SelectItem>
                  <SelectItem value="french">French</SelectItem>
                  <SelectItem value="german">German</SelectItem>
                  <SelectItem value="chinese">Chinese</SelectItem>
                  <SelectItem value="japanese">Japanese</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="bg-black/40 rounded-lg p-4 space-y-4 border border-white/10">
              <h3 className="text-md font-medium text-gemini-yellow flex items-center">
                <Volume2 className="h-4 w-4 mr-2" />
                Voice Settings
              </h3>
              <div className="flex items-center justify-between">
                <Label htmlFor="voice-enabled" className="cursor-pointer">Voice responses</Label>
                <Switch 
                  id="voice-enabled" 
                  checked={voiceEnabled} 
                  onCheckedChange={setVoiceEnabled}
                />
              </div>
              
              <div className={voiceEnabled ? "space-y-3" : "space-y-3 opacity-50 pointer-events-none"}>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Voice volume</Label>
                    <span className="text-sm text-muted-foreground">{Math.round(voiceVolume[0] * 100)}%</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <VolumeX size={16} className="text-muted-foreground" />
                    <Slider 
                      value={voiceVolume} 
                      onValueChange={setVoiceVolume} 
                      max={1} 
                      step={0.1} 
                      className="flex-1"
                    />
                    <Volume2 size={16} className="text-muted-foreground" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Voice type</Label>
                  <Select defaultValue="female">
                    <SelectTrigger className="bg-black/30 border-white/10">
                      <SelectValue placeholder="Select voice" />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-white/10">
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="neutral">Neutral</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Models Tab */}
          <TabsContent value="models" className="space-y-6">
            <div className="bg-black/40 rounded-lg p-4 space-y-4 border border-white/10">
              <h3 className="text-md font-medium text-gemini-yellow flex items-center">
                <Zap className="h-4 w-4 mr-2" />
                Model Selection
              </h3>
              <div className="grid gap-3">
                {Object.entries(modelInfo).map(([id, info]) => (
                  <Label 
                    key={id}
                    htmlFor={`model-${id}`}
                    className={`flex flex-col p-3 rounded-lg border ${selectedModel === id ? 'border-gemini-yellow bg-gemini-yellow/5' : 'border-white/10 hover:bg-black/20'} cursor-pointer transition-colors`}
                  >
                    <div className="flex items-start">
                      <RadioGroup value={selectedModel} onValueChange={setSelectedModel} className="flex">
                        <RadioGroupItem 
                          value={id} 
                          id={`model-${id}`}
                          className="mt-1"
                        />
                      </RadioGroup>
                      <div className="ml-3 space-y-1">
                        <div className="flex items-center">
                          <span className="font-medium">{info.name}</span>
                          {id.includes("2.0") && <Badge className="ml-2 text-[10px] bg-gemini-yellow/20 text-gemini-yellow">Latest</Badge>}
                        </div>
                        <p className="text-xs text-muted-foreground">{info.description}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          <Badge variant="outline" className="text-[10px]">{info.tokens} tokens</Badge>
                          <Badge variant="outline" className="text-[10px]">{info.speed}</Badge>
                          {info.capabilities.slice(0, 2).map((cap, i) => (
                            <Badge key={i} variant="outline" className="text-[10px]">{cap}</Badge>
                          ))}
                          {info.capabilities.length > 2 && (
                            <Badge variant="outline" className="text-[10px]">+{info.capabilities.length - 2} more</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </Label>
                ))}
              </div>
            </div>
            
            <div className="bg-black/40 rounded-lg p-4 space-y-4 border border-white/10">
              <h3 className="text-md font-medium text-gemini-yellow flex items-center">
                <Key className="h-4 w-4 mr-2" />
                API Configuration
              </h3>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="api-key">Google Gemini API Key</Label>
                  <Input
                    id="api-key"
                    type="password"
                    placeholder="API Key"
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    className="font-mono text-xs bg-black/30 border-white/10"
                  />
                  <p className="text-xs text-muted-foreground">
                    Get your API key from{" "}
                    <a
                      href="https://ai.google.dev/tutorials/setup"
                      target="_blank"
                      rel="noreferrer"
                      className="text-gemini-yellow hover:underline"
                    >
                      Google AI Studio
                    </a>
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="api-url">API Endpoint URL</Label>
                  <Input
                    id="api-url"
                    type="text"
                    placeholder="API URL"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="font-mono text-xs bg-black/30 border-white/10"
                  />
                </div>
                
                <div className="flex space-x-2 pt-2">
                  <Button 
                    onClick={handleSaveApiSettings} 
                    className="flex-1 bg-gemini-yellow text-black hover:bg-gemini-yellow/90"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save API Settings
                  </Button>
                  <Button 
                    onClick={handleResetApiSettings}
                    variant="outline"
                    className="flex-1 border-gemini-yellow/20 hover:bg-gemini-yellow/10"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reset to Default
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="bg-black/40 rounded-lg p-4 space-y-4 border border-white/10">
              <h3 className="text-md font-medium text-gemini-yellow flex items-center">
                <Zap className="h-4 w-4 mr-2" />
                Model Parameters
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Temperature</Label>
                    <span className="text-sm text-muted-foreground">{temperature[0].toFixed(1)}</span>
                  </div>
                  <Slider 
                    value={temperature} 
                    onValueChange={setTemperature} 
                    max={1} 
                    step={0.1} 
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>More Focused</span>
                    <span>More Creative</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Response Length</Label>
                    <span className="text-sm text-muted-foreground">
                      {responseLength[0] < 0.3 ? "Concise" : responseLength[0] < 0.7 ? "Balanced" : "Detailed"}
                    </span>
                  </div>
                  <Slider 
                    value={responseLength} 
                    onValueChange={setResponseLength} 
                    max={1} 
                    step={0.1} 
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Shorter</span>
                    <span>Longer</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="system-prompt">System Prompt</Label>
                  <Input
                    id="system-prompt"
                    placeholder="Enter a custom system prompt"
                    value={systemPrompt}
                    onChange={(e) => setSystemPrompt(e.target.value)}
                    className="bg-black/30 border-white/10"
                  />
                  <p className="text-xs text-muted-foreground">
                    Set instructions that guide how the AI responds.
                  </p>
                </div>
                
                <Button 
                  onClick={handleSaveModelParams} 
                  className="w-full bg-gemini-yellow/20 text-gemini-yellow hover:bg-gemini-yellow/30 border border-gemini-yellow/30"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Parameters
                </Button>
              </div>
            </div>
          </TabsContent>
          
          {/* Advanced Tab */}
          <TabsContent value="advanced" className="space-y-6">
            <div className="bg-black/40 rounded-lg p-4 space-y-4 border border-white/10">
              <h3 className="text-md font-medium text-gemini-yellow flex items-center">
                <MessageSquareText className="h-4 w-4 mr-2" />
                Response Behavior
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="streaming" className="cursor-pointer">Response Streaming</Label>
                    <p className="text-xs text-muted-foreground">
                      Receive response tokens in real-time
                    </p>
                  </div>
                  <Switch 
                    id="streaming" 
                    checked={streamingEnabled}
                    onCheckedChange={setStreamingEnabled}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="citations" className="cursor-pointer">Auto Citations</Label>
                    <p className="text-xs text-muted-foreground">
                      Automatically generate citations for responses
                    </p>
                  </div>
                  <Switch 
                    id="citations"
                    checked={citationsEnabled}
                    onCheckedChange={setCitationsEnabled}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="code-highlight" className="cursor-pointer">Code Highlight Theme</Label>
                    <p className="text-xs text-muted-foreground">
                      Choose styling for code blocks
                    </p>
                  </div>
                  <Select value={codeHighlightTheme} onValueChange={setCodeHighlightTheme}>
                    <SelectTrigger className="w-36 bg-black/30 border-white/10">
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-white/10">
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="github">GitHub</SelectItem>
                      <SelectItem value="monokai">Monokai</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <div className="bg-black/40 rounded-lg p-4 space-y-4 border border-white/10">
              <h3 className="text-md font-medium text-gemini-yellow flex items-center">
                <HardDrive className="h-4 w-4 mr-2" />
                Data Management
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="history" className="cursor-pointer">Save Chat History</Label>
                    <p className="text-xs text-muted-foreground">
                      Store conversations in local storage
                    </p>
                  </div>
                  <Switch 
                    id="history" 
                    checked={historyEnabled}
                    onCheckedChange={setHistoryEnabled}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="save-disk" className="cursor-pointer">Auto-export Conversations</Label>
                    <p className="text-xs text-muted-foreground">
                      Save finished conversations to disk as text files
                    </p>
                  </div>
                  <Switch 
                    id="save-disk"
                    checked={saveToDisk}
                    onCheckedChange={setSaveToDisk}
                  />
                </div>
                
                <div className="pt-2">
                  <Button
                    variant="outline"
                    className="w-full text-red-500 border-red-500/20 hover:bg-red-500/10 hover:text-red-400"
                  >
                    Clear All Local Data
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="bg-black/40 rounded-lg p-4 space-y-4 border border-white/10">
              <h3 className="text-md font-medium text-gemini-yellow flex items-center">
                <BellRing className="h-4 w-4 mr-2" />
                Notifications
              </h3>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifications" className="cursor-pointer">Desktop Notifications</Label>
                  <p className="text-xs text-muted-foreground">
                    Get notified when responses are ready
                  </p>
                </div>
                <Switch 
                  id="notifications"
                  checked={notificationsEnabled}
                  onCheckedChange={setNotificationsEnabled}
                />
              </div>
            </div>
          </TabsContent>
          
          {/* About Tab */}
          <TabsContent value="about" className="space-y-6">
            <div className="bg-black/40 rounded-lg p-4 space-y-4 border border-white/10">
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-gemini-yellow/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-8 w-8 text-gemini-yellow" />
                </div>
                <h3 className="text-xl font-bold text-gemini-yellow">HydroGen AI</h3>
                <p className="text-sm text-muted-foreground">Version 1.0.0</p>
                <p className="text-sm mt-4">
                  A modern AI assistant powered by Google Gemini models,
                  designed for students and professionals.
                </p>
              </div>
              
              <div className="pt-4 space-y-2">
                <Button variant="outline" className="w-full border-gemini-yellow/20 hover:bg-gemini-yellow/10">
                  Check for Updates
                </Button>
                <Button variant="outline" className="w-full border-white/10 hover:bg-white/5">
                  View Documentation
                </Button>
                <Button variant="outline" className="w-full border-white/10 hover:bg-white/5">
                  Privacy Policy
                </Button>
              </div>
            </div>
            
            <div className="bg-black/40 rounded-lg p-4 space-y-2 border border-white/10">
              <h3 className="text-md font-medium text-gemini-yellow flex items-center">
                <Zap className="h-4 w-4 mr-2" />
                Powered By
              </h3>
              <p className="text-sm text-muted-foreground">
                Google Gemini 2.0 AI models
              </p>
              
              <h3 className="text-md font-medium text-gemini-yellow flex items-center pt-2">
                <Book className="h-4 w-4 mr-2" />
                Created For
              </h3>
              <p className="text-sm text-muted-foreground">
                Students and professionals seeking knowledge and insights
              </p>
            </div>
          </TabsContent>
        </div>
      </Tabs>
      
      <div className="sticky bottom-0 w-full bg-black/80 backdrop-blur-sm border-t border-white/10 p-4">
        <Button onClick={handleSaveAllSettings} className="w-full bg-gemini-yellow text-black hover:bg-gemini-yellow/90">
          <Save className="h-4 w-4 mr-2" />
          Save All Settings
        </Button>
      </div>
    </div>
  );
}
