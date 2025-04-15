
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";

// Instead of using context, we'll use local storage directly
export function ApiKeyDialog() {
  const [key, setKey] = useState(localStorage.getItem('openRouterApiKey') || "");
  const [url, setUrl] = useState(localStorage.getItem('openRouterApiUrl') || "");
  const [open, setOpen] = useState(false);
  
  const handleSave = () => {
    if (key.trim()) {
      localStorage.setItem('openRouterApiKey', key.trim());
      
      if (url.trim()) {
        localStorage.setItem('openRouterApiUrl', url.trim());
      }
      
      toast({
        title: "API Settings Saved",
        description: "Your OpenRouter API settings have been saved."
      });
      
      setOpen(false);
      
      // Reload the page to apply changes
      window.location.reload();
    } else {
      toast({
        title: "Error",
        description: "Please enter a valid API key.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Configure API Key</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md dark:bg-black/95 light:bg-white/95">
        <DialogHeader>
          <DialogTitle>OpenRouter API Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2 pb-4">
          <div className="space-y-2">
            <Label htmlFor="api-key">Enter your OpenRouter API Key</Label>
            <Input 
              id="api-key" 
              type="password" 
              placeholder="API Key" 
              value={key} 
              onChange={e => setKey(e.target.value)} 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="api-url">API Endpoint URL (Optional)</Label>
            <Input 
              id="api-url" 
              type="text" 
              placeholder="API URL" 
              value={url} 
              onChange={e => setUrl(e.target.value)} 
            />
          </div>
          <div className="text-xs text-muted-foreground">
            Get your API key from{" "}
            <a 
              href="https://openrouter.ai/keys" 
              target="_blank" 
              rel="noreferrer" 
              className="text-primary hover:underline"
            >
              OpenRouter
            </a>
          </div>
          <Button 
            onClick={handleSave} 
            className="w-full"
          >
            Save API Settings
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
