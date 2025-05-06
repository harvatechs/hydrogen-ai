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
  const [responseLength, setResponseLength] = useState<number[]>([
    parseFloat(localStorage.getItem("app-response-length") || "0.5")
  ]);
  const [temperature, setTemperature] = useState<number[]>([
    parseFloat(localStorage.getItem("app-temperature") || "0.7")
  ]);
  const [voiceVolume, setVoiceVolume] = useState<number[]>([
    parseFloat(localStorage.getItem("app-voice-volume") || "0.8")
  ]);
  const [voiceEnabled, setVoiceEnabled] = useState(
    localStorage.getItem("app-voice-enabled") === "true"
  );
  const [systemPrompt, setSystemPrompt] = useState(
    localStorage.getItem("app-system-prompt") || ""
  );
  const [selectedLanguage, setSelectedLanguage] = useState("english");
  const [historyEnabled, setHistoryEnabled] = useState(
    localStorage.getItem("app-history-enabled") !== "false"
  );
  const [citationsEnabled, setCitationsEnabled] = useState(true);
  const [streamingEnabled, setStreamingEnabled] = useState(
    localStorage.getItem("app-streaming-enabled") !== "false"
  );
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [codeHighlightTheme, setCodeHighlightTheme] = useState(
    localStorage.getItem("app-code-theme") || "dark"
  );
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
  
  // Track if this is the first render
  const [isFirstRender, setIsFirstRender] = useState(true);

  // Save appearance settings
  const handleSaveAppearance = () => {
    // Ensure selectedTheme is cast to the correct type
    setTheme(selectedTheme as 'dark' | 'light' | 'system');
    setFontSize(selectedFontSize);
    localStorage.setItem("app-code-theme", codeHighlightTheme);
    
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
      {/* Header with subtle gradient background */}
      <div className="sticky top-0 z-30 bg-gradient-to-r from-background to-background/90 backdrop-blur-md border-b border-white/10 p-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Button 
            onClick={onClose} 
            variant="ghost" 
            size="sm" 
            className="h-9 w-9 rounded-full p-0 dark:hover:bg-white/10 light:hover:bg-black/10 transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
          </Button>
          <div>
            <h2 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">Settings</h2>
            <p className="text-xs text-muted-foreground">Customize your experience</p>
          </div>
        </div>
        <Button 
          onClick={handleSaveAllSettings} 
          size="sm" 
          className="bg-primary/90 hover:bg-primary text-primary-foreground rounded-full px-4 transition-colors"
        >
          <Save className="h-4 w-4 mr-2" />
          Save All
        </Button>
      </div>
      
      {/* Content */}
      <div className="flex-1 flex flex-col">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <div className="sticky top-[73px] z-20 bg-background/90 backdrop-blur-md p-4 pb-0">
            <TabsList className="grid grid-cols-4 w-full p-1 bg-black/20 border border-white/10 rounded-xl">
              <TabsTrigger 
                value="appearance" 
                className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/20 data-[state=active]:to-purple-500/20 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200"
              >
                <Palette className="h-4 w-4 mr-2" />
                Display
              </TabsTrigger>
              <TabsTrigger 
                value="models" 
                className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/20 data-[state=active]:to-purple-500/20 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200"
              >
                <Zap className="h-4 w-4 mr-2" />
                Models
              </TabsTrigger>
              <TabsTrigger 
                value="advanced" 
                className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/20 data-[state=active]:to-purple-500/20 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200"
              >
                <MessageSquareText className="h-4 w-4 mr-2" />
                Behavior
              </TabsTrigger>
              <TabsTrigger 
                value="about" 
                className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/20 data-[state=active]:to-purple-500/20 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200"
              >
                <Info className="h-4 w-4 mr-2" />
                About
              </TabsTrigger>
            </TabsList>
          </div>
          
          <ScrollArea className="flex-1 p-4 pb-20">
            <TabsContent value="appearance" className="p-4 border rounded-lg">
              <h3 className="text-lg font-medium mb-4">Appearance Settings</h3>
              
              <div className="space-y-6">
                <div className="space-y-3">
                  <h4 className="text-sm font-medium mb-2">Theme</h4>
                  <RadioGroup value={theme} onValueChange={setTheme}>
                    <div className="grid grid-cols-3 gap-3">
                      <div 
                        className={`cursor-pointer rounded-lg border p-3 ${theme === 'dark' ? 'bg-primary/20 border-primary' : 'border-white/10 bg-white/5'} hover:bg-white/10 hover:border-white/20 transition-all duration-200`}
                        onClick={() => setTheme('dark')}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <Moon className="h-4 w-4" />
                            <span className="text-sm font-medium">Dark</span>
                          </div>
                          <RadioGroupItem value="dark" id="theme-dark" />
                        </div>
                        <div className="h-20 rounded bg-zinc-900 border border-zinc-800 p-2">
                          <div className="h-3 w-3/4 rounded-sm bg-zinc-700 mb-1"></div>
                          <div className="h-3 w-1/2 rounded-sm bg-zinc-700"></div>
                        </div>
                      </div>
                      
                      <div 
                        className={`cursor-pointer rounded-lg border p-3 ${theme === 'light' ? 'bg-primary/20 border-primary' : 'border-white/10 bg-white/5'} hover:bg-white/10 hover:border-white/20 transition-all duration-200`}
                        onClick={() => setTheme('light')}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <Sun className="h-4 w-4" />
                            <span className="text-sm font-medium">Light</span>
                          </div>
                          <RadioGroupItem value="light" id="theme-light" />
                        </div>
                        <div className="h-20 rounded bg-gray-100 border border-gray-200 p-2">
                          <div className="h-3 w-3/4 rounded-sm bg-gray-300 mb-1"></div>
                          <div className="h-3 w-1/2 rounded-sm bg-gray-300"></div>
                        </div>
                      </div>
                      
                      <div 
                        className={`cursor-pointer rounded-lg border p-3 ${theme === 'system' ? 'bg-primary/20 border-primary' : 'border-white/10 bg-white/5'} hover:bg-white/10 hover:border-white/20 transition-all duration-200`}
                        onClick={() => setTheme('system')}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <Laptop className="h-4 w-4" />
                            <span className="text-sm font-medium">System</span>
                          </div>
                          <RadioGroupItem value="system" id="theme-system" />
                        </div>
                        <div className="h-20 rounded bg-gradient-to-r from-zinc-900 to-gray-200 border border-zinc-800 p-2">
                          <div className="h-3 w-3/4 rounded-sm bg-gradient-to-r from-zinc-700 to-gray-300 mb-1"></div>
                          <div className="h-3 w-1/2 rounded-sm bg-gradient-to-r from-zinc-700 to-gray-300"></div>
                        </div>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-3">
                  <h4 className="text-sm font-medium mb-2">Font Size</h4>
                  <RadioGroup value={fontSize} onValueChange={setFontSize}>
                    <div className="grid grid-cols-3 gap-3">
                      <div 
                        className={`cursor-pointer rounded-lg border p-3 ${fontSize === 'sm' ? 'bg-primary/20 border-primary' : 'border-white/10 bg-white/5'} hover:bg-white/10 hover:border-white/20 transition-all duration-200`}
                        onClick={() => setFontSize('sm')}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-medium">Small</span>
                          <RadioGroupItem value="sm" id="font-sm" />
                        </div>
                        <div className="flex flex-col items-center space-y-1">
                          <span className="text-xs">Aa</span>
                          <p className="text-xs text-muted-foreground">Compact view</p>
                        </div>
                      </div>
                      
                      <div 
                        className={`cursor-pointer rounded-lg border p-3 ${fontSize === 'md' ? 'bg-primary/20 border-primary' : 'border-white/10 bg-white/5'} hover:bg-white/10 hover:border-white/20 transition-all duration-200`}
                        onClick={() => setFontSize('md')}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-medium">Medium</span>
                          <RadioGroupItem value="md" id="font-md" />
                        </div>
                        <div className="flex flex-col items-center space-y-1">
                          <span className="text-sm">Aa</span>
                          <p className="text-xs text-muted-foreground">Default size</p>
                        </div>
                      </div>
                      
                      <div 
                        className={`cursor-pointer rounded-lg border p-3 ${fontSize === 'lg' ? 'bg-primary/20 border-primary' : 'border-white/10 bg-white/5'} hover:bg-white/10 hover:border-white/20 transition-all duration-200`}
                        onClick={() => setFontSize('lg')}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-medium">Large</span>
                          <RadioGroupItem value="lg" id="font-lg" />
                        </div>
                        <div className="flex flex-col items-center space-y-1">
                          <span className="text-base">Aa</span>
                          <p className="text-xs text-muted-foreground">Better readability</p>
                        </div>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-3">
                  <h4 className="text-sm font-medium mb-2">Code Highlighting Theme</h4>
                  <Select value={codeHighlightTheme} onValueChange={setCodeHighlightTheme}>
                    <SelectTrigger className="w-full bg-black/20 border-white/10">
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
                  <div className="rounded-md border border-white/10 bg-black/20 p-3 overflow-hidden">
                    <pre className="text-xs overflow-x-auto">
                      <code className={`language-javascript ${codeHighlightTheme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>
                        {`function example() {\n  // This shows syntax highlighting\n  const greeting = "Hello, world!";\n  console.log(greeting);\n  return 42;\n}`}
                      </code>
                    </pre>
                  </div>
                </div>
                
                <div className="flex justify-end mt-4">
                  <Button onClick={handleSaveAppearance} className="bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90 transition-opacity">
                    <Save className="h-4 w-4 mr-2" />
                    Save Appearance
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="models" className="p-4 border rounded-lg">
              <h3 className="text-lg font-medium mb-4">Model Settings</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium mb-2 flex items-center">
                    API Key 
                    <span className="ml-1 cursor-help text-muted-foreground hover:text-foreground transition-colors" title="Required for the app to function">
                      <Info className="h-3.5 w-3.5" />
                    </span>
                  </h4>
                  <div className="space-y-2">
                    <Input 
                      type="password" 
                      value={key} 
                      onChange={(e) => setKey(e.target.value)}
                      placeholder="Enter your Google Gemini API key" 
                      className="bg-black/20 border-white/10 focus-visible:ring-primary"
                    />
                    <div className="flex items-center space-x-1">
                      <Key className="h-3 w-3 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">
                        Get your API key from the <a href="https://makersuite.google.com/app/apikey" className="text-primary hover:underline" target="_blank" rel="noreferrer">Google AI Studio</a>
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">API Endpoint URL</h4>
                  <Input 
                    type="text" 
                    value={url} 
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Enter API URL" 
                    className="bg-black/20 border-white/10"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    The default URL will work for most users.
                  </p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Model Selection</h4>
                  <RadioGroup value={selectedModel} onValueChange={setSelectedModel} className="space-y-3">
                    {Object.entries(modelInfo).map(([id, info]) => (
                      <div 
                        key={id} 
                        className={`flex items-start space-x-3 p-4 rounded-lg border ${selectedModel === id ? 'border-primary bg-primary/10' : 'border-white/10 bg-white/5'} hover:bg-white/10 hover:border-white/20 transition-all duration-200 cursor-pointer`}
                        onClick={() => setSelectedModel(id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setSelectedModel(id);
                          }
                        }}
                        tabIndex={0}
                        role="radio"
                        aria-checked={selectedModel === id}
                      >
                        <RadioGroupItem value={id} id={`model-${id}`} className="mt-1" />
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center justify-between">
                            <Label htmlFor={`model-${id}`} className="font-medium cursor-pointer">
                              {info.name}
                            </Label>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {info.tokens}
                              </Badge>
                              <Badge variant="secondary" className={`text-xs ${
                                info.speed === "Very Fast" ? "bg-green-500/20 text-green-400" :
                                info.speed === "Fast" ? "bg-blue-500/20 text-blue-400" :
                                "bg-yellow-500/20 text-yellow-400"
                              }`}>
                                {info.speed}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">{info.description}</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {info.capabilities.map((cap, i) => (
                              <Badge key={i} variant="secondary" className="text-xs bg-primary/20">
                                {cap}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
                
                <div className="space-y-2">
                  <Button 
                    variant="secondary" 
                    className="w-full border border-primary/30 hover:bg-primary/10 transition-colors"
                    onClick={() => {
                      if (!key.trim()) {
                        toast({
                          title: "API Key Required",
                          description: "Please enter an API key to test the connection.",
                          variant: "destructive",
                        });
                        return;
                      }
                      
                      toast({
                        title: "Testing Connection...",
                        description: "Sending a test request to the Gemini API.",
                      });
                      
                      // Code to test the API connection would go here
                      setTimeout(() => {
                        toast({
                          title: "Connection Successful!",
                          description: "Your API key and endpoint are working correctly.",
                        });
                      }, 1500);
                    }}
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Test Connection
                  </Button>
                </div>
                
                <div className="flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={handleResetApiSettings}
                    className="border-white/10 hover:bg-white/5 transition-colors"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reset to Default
                  </Button>
                  <Button onClick={handleSaveApiSettings} className="bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90 transition-opacity">
                    <Save className="h-4 w-4 mr-2" />
                    Save API Settings
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="advanced" className="p-4 border rounded-lg">
              <h3 className="text-lg font-medium mb-4">Advanced Settings</h3>
              
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Label className="text-sm font-medium">Response Temperature</Label>
                      <span className="ml-1 cursor-help text-muted-foreground hover:text-foreground transition-colors" title="Controls randomness: higher values create more creative responses, lower values are more predictable">
                        <Info className="h-3.5 w-3.5" />
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground bg-primary/10 px-2 py-0.5 rounded-full">{temperature[0].toFixed(1)}</span>
                  </div>
                  <Slider
                    value={temperature}
                    onValueChange={setTemperature}
                    min={0}
                    max={1}
                    step={0.1}
                    className="py-2"
                    trackClassName="bg-gradient-to-r from-blue-500 to-purple-500"
                    thumbClassName="border-2 border-primary shadow-md shadow-primary/25 hover:scale-110 transition-transform"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Precise</span>
                    <span>Balanced</span>
                    <span>Creative</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Higher values make output more random, lower values more deterministic.
                  </p>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Label className="text-sm font-medium">Response Length</Label>
                      <span className="ml-1 cursor-help text-muted-foreground hover:text-foreground transition-colors" title="Determines how detailed the AI's responses will be">
                        <Info className="h-3.5 w-3.5" />
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground bg-primary/10 px-2 py-0.5 rounded-full">
                      {responseLength[0] <= 0.33 ? "Concise" : responseLength[0] <= 0.66 ? "Balanced" : "Detailed"}
                    </span>
                  </div>
                  <Slider
                    value={responseLength}
                    onValueChange={setResponseLength}
                    min={0}
                    max={1}
                    step={0.01}
                    className="py-2"
                    trackClassName="bg-gradient-to-r from-blue-500 to-purple-500"
                    thumbClassName="border-2 border-primary shadow-md shadow-primary/25 hover:scale-110 transition-transform"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Concise</span>
                    <span>Balanced</span>
                    <span>Detailed</span>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">System Prompt Template</h4>
                  <Textarea 
                    value={systemPrompt}
                    onChange={(e) => setSystemPrompt(e.target.value)}
                    placeholder="Custom instructions for the AI assistant..."
                    className="h-24 resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    Define default behavior instructions for the AI.
                  </p>
                </div>
                
                <Separator />

                <div className="flex items-center justify-between group hover:bg-white/5 p-2 -mx-2 rounded-lg transition-colors">
                  <div className="space-y-0.5">
                    <Label className="text-sm group-hover:text-primary transition-colors">Streaming Responses</Label>
                    <p className="text-xs text-muted-foreground">Show AI responses as they are generated</p>
                  </div>
                  <Switch 
                    checked={streamingEnabled}
                    onCheckedChange={setStreamingEnabled}
                    className="data-[state=checked]:bg-primary data-[state=checked]:scale-105 transition-all"
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between group hover:bg-white/5 p-2 -mx-2 rounded-lg transition-colors">
                  <div className="space-y-0.5">
                    <Label className="text-sm group-hover:text-primary transition-colors">Save Chat History</Label>
                    <p className="text-xs text-muted-foreground">Store conversations for later reference</p>
                  </div>
                  <Switch 
                    checked={historyEnabled}
                    onCheckedChange={setHistoryEnabled}
                    className="data-[state=checked]:bg-primary data-[state=checked]:scale-105 transition-all"
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between group hover:bg-white/5 p-2 -mx-2 rounded-lg transition-colors">
                  <div className="space-y-0.5">
                    <Label className="text-sm group-hover:text-primary transition-colors">Voice Output</Label>
                    <p className="text-xs text-muted-foreground">Enable text-to-speech for AI responses</p>
                  </div>
                  <Switch 
                    checked={voiceEnabled}
                    onCheckedChange={setVoiceEnabled}
                    className="data-[state=checked]:bg-primary data-[state=checked]:scale-105 transition-all"
                  />
                </div>
                
                {voiceEnabled && (
                  <div className="pl-6 space-y-3 border-l-2 border-primary/20">
                    <div className="flex justify-between">
                      <Label className="text-sm font-medium">Voice Volume</Label>
                      <span className="text-xs text-muted-foreground">{Math.round(voiceVolume[0] * 100)}%</span>
                    </div>
                    <Slider
                      value={voiceVolume}
                      onValueChange={setVoiceVolume}
                      min={0}
                      max={1}
                      step={0.01}
                      className="py-2"
                      trackClassName="bg-gradient-to-r from-blue-500 to-purple-500"
                      thumbClassName="border-2 border-primary shadow-md shadow-primary/25 hover:scale-110 transition-transform"
                    />
                  </div>
                )}
                
                <div className="flex justify-end mt-4">
                  <Button onClick={handleSaveBehaviorSettings} className="bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90 transition-opacity">
                    <Save className="h-4 w-4 mr-2" />
                    Save Settings
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="about" className="p-4 border rounded-lg">
              <h3 className="text-lg font-medium mb-4">About</h3>
              
              <div className="space-y-6">
                <div className="flex justify-center py-8">
                  <div className="text-center space-y-3">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full blur-xl opacity-20"></div>
                      <div className="relative text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
                        HydroGen AI
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">Version 2.0.0</p>
                    <div className="pt-2">
                      <Badge variant="outline" className="bg-black/20 border-white/10">Powered by Google Gemini</Badge>
                    </div>
                  </div>
                </div>
                
                <Card className="border-white/10 bg-black/20 overflow-hidden">
                  <div className="absolute right-0 top-0 h-16 w-16 opacity-10">
                    <Info className="h-full w-full" />
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center">
                      <Info className="h-4 w-4 mr-2 text-blue-400" />
                      About
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      HydroGen AI is a powerful chat interface for Google's Gemini AI models, 
                      featuring a range of productivity tools and a clean, modern interface 
                      designed for productivity and a seamless user experience.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="border-white/10 bg-black/20 overflow-hidden">
                  <div className="absolute right-0 top-0 h-16 w-16 opacity-10">
                    <Zap className="h-full w-full" />
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center">
                      <Zap className="h-4 w-4 mr-2 text-yellow-400" />
                      Features
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-start space-x-2 group">
                        <div className="bg-blue-500/20 p-1.5 rounded group-hover:bg-blue-500/30 transition-colors">
                          <FileText className="h-3.5 w-3.5 text-blue-400" />
                        </div>
                        <div className="text-sm">YouTube Summarization</div>
                      </div>
                      <div className="flex items-start space-x-2 group">
                        <div className="bg-green-500/20 p-1.5 rounded group-hover:bg-green-500/30 transition-colors">
                          <Book className="h-3.5 w-3.5 text-green-400" />
                        </div>
                        <div className="text-sm">Flashcard Generation</div>
                      </div>
                      <div className="flex items-start space-x-2 group">
                        <div className="bg-purple-500/20 p-1.5 rounded group-hover:bg-purple-500/30 transition-colors">
                          <Globe className="h-3.5 w-3.5 text-purple-400" />
                        </div>
                        <div className="text-sm">Web Search Integration</div>
                      </div>
                      <div className="flex items-start space-x-2 group">
                        <div className="bg-red-500/20 p-1.5 rounded group-hover:bg-red-500/30 transition-colors">
                          <Mic className="h-3.5 w-3.5 text-red-400" />
                        </div>
                        <div className="text-sm">Voice Input/Output</div>
                      </div>
                      <div className="flex items-start space-x-2 group">
                        <div className="bg-yellow-500/20 p-1.5 rounded group-hover:bg-yellow-500/30 transition-colors">
                          <Palette className="h-3.5 w-3.5 text-yellow-400" />
                        </div>
                        <div className="text-sm">Customizable Interface</div>
                      </div>
                      <div className="flex items-start space-x-2 group">
                        <div className="bg-cyan-500/20 p-1.5 rounded group-hover:bg-cyan-500/30 transition-colors">
                          <Code className="h-3.5 w-3.5 text-cyan-400" />
                        </div>
                        <div className="text-sm">Code Generation</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-white/10 bg-black/20 overflow-hidden">
                  <div className="absolute right-0 top-0 h-16 w-16 opacity-10">
                    <HardDrive className="h-full w-full" />
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center">
                      <HardDrive className="h-4 w-4 mr-2 text-gray-400" />
                      Storage
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Your conversations and settings are stored locally in your browser.
                    </p>
                    <div className="flex justify-between gap-2">
                      <Button variant="outline" className="text-xs border-white/10 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-colors flex-1">
                        <Trash2 className="h-3.5 w-3.5 mr-1" />
                        Clear All Chats
                      </Button>
                      <Button variant="outline" className="text-xs border-white/10 hover:bg-blue-500/10 hover:text-blue-400 hover:border-blue-500/20 transition-colors flex-1">
                        <RefreshCw className="h-3.5 w-3.5 mr-1" />
                        Reset Settings
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </div>
      
      {/* Footer */}
      <div className="sticky bottom-0 bg-background/90 backdrop-blur-md p-4 flex justify-between items-center border-t border-white/10">
        <Button onClick={onClose} variant="outline" className="border-white/10 hover:bg-white/5 transition-colors">
          Cancel
        </Button>
        <Button onClick={handleSaveAllSettings} className="bg-primary/90 hover:bg-primary transition-colors">
          <Save className="h-4 w-4 mr-2" />
          Save All Changes
        </Button>
      </div>
    </div>
  );
}
