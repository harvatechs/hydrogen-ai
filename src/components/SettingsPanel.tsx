
import React, { useState } from "react";
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

  return (
    <div className="w-full h-full overflow-y-auto p-4 space-y-6">
      <h2 className="text-xl font-semibold mb-4">Settings</h2>
      
      <Accordion type="single" collapsible defaultValue="appearance">
        <AccordionItem value="appearance">
          <AccordionTrigger className="text-md font-medium">
            Appearance
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label>Theme</Label>
              <RadioGroup value={theme} onValueChange={setTheme} className="flex flex-col space-y-1">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="dark" id="theme-dark" />
                  <Label htmlFor="theme-dark" className="cursor-pointer">Dark</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="light" id="theme-light" />
                  <Label htmlFor="theme-light" className="cursor-pointer">Light</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="system" id="theme-system" />
                  <Label htmlFor="theme-system" className="cursor-pointer">System</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="space-y-2">
              <Label>Font Size</Label>
              <RadioGroup value={fontSize} onValueChange={setFontSize} className="flex flex-col space-y-1">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="small" id="font-small" />
                  <Label htmlFor="font-small" className="cursor-pointer">Small</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="medium" id="font-medium" />
                  <Label htmlFor="font-medium" className="cursor-pointer">Medium</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="large" id="font-large" />
                  <Label htmlFor="font-large" className="cursor-pointer">Large</Label>
                </div>
              </RadioGroup>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="api">
          <AccordionTrigger className="text-md font-medium">
            API Configuration
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="api-key">Google Gemini API Key</Label>
              <Input
                id="api-key"
                type="password"
                placeholder="API Key"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                className="font-mono text-xs"
              />
              <p className="text-xs text-muted-foreground">
                Get your API key from{" "}
                <a
                  href="https://ai.google.dev/tutorials/setup"
                  target="_blank"
                  rel="noreferrer"
                  className="text-gemini-purple hover:underline"
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
                className="font-mono text-xs"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gemini-2.0-flash">Gemini 2.0 Flash</SelectItem>
                  <SelectItem value="gemini-2.0-pro">Gemini 2.0 Pro</SelectItem>
                  <SelectItem value="gemini-1.5-flash">Gemini 1.5 Flash</SelectItem>
                  <SelectItem value="gemini-1.5-pro">Gemini 1.5 Pro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex space-x-2 pt-2">
              <Button 
                onClick={handleSaveApiSettings} 
                className="flex-1 bg-gemini-purple hover:bg-gemini-purple/90"
              >
                Save API Settings
              </Button>
              <Button 
                onClick={handleResetApiSettings}
                variant="outline"
                className="flex-1"
              >
                Reset to Default
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="advanced">
          <AccordionTrigger className="text-md font-medium">
            Advanced Settings
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="streaming">Response Streaming</Label>
                <p className="text-xs text-muted-foreground">
                  Receive response tokens in real-time
                </p>
              </div>
              <Switch id="streaming" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="history">Save Chat History</Label>
                <p className="text-xs text-muted-foreground">
                  Store conversations in local storage
                </p>
              </div>
              <Switch id="history" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="citations">Auto Citations</Label>
                <p className="text-xs text-muted-foreground">
                  Automatically generate citations for responses
                </p>
              </div>
              <Switch id="citations" defaultChecked />
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="about">
          <AccordionTrigger className="text-md font-medium">
            About HydroGen
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-2">
            <div className="space-y-1">
              <h3 className="font-semibold">HydroGen</h3>
              <p className="text-sm text-muted-foreground">
                Version 1.0.0
              </p>
              <p className="text-sm text-muted-foreground">
                Powered by Google Gemini 2.0
              </p>
              <p className="text-sm pt-2">
                A modern AI answer engine with a focus on structured, 
                comprehensive answers to your questions.
              </p>
              <div className="pt-4">
                <Button variant="outline" size="sm" className="w-full">
                  Check for Updates
                </Button>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
