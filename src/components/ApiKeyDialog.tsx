import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings } from "lucide-react";
import { useChat } from "@/context/ChatContext";
import { toast } from "@/components/ui/use-toast";
export function ApiKeyDialog() {
  const {
    apiKey,
    setApiKey,
    apiUrl,
    setApiUrl
  } = useChat();
  const [key, setKey] = useState(apiKey || "");
  const [url, setUrl] = useState(apiUrl || "");
  const [open, setOpen] = useState(false);
  const handleSave = () => {
    if (key.trim()) {
      setApiKey(key.trim());
      if (url.trim()) {
        setApiUrl(url.trim());
      }
      toast({
        title: "API Settings Saved",
        description: "Your Google Gemini API settings have been saved."
      });
      setOpen(false);
    } else {
      toast({
        title: "Error",
        description: "Please enter a valid API key.",
        variant: "destructive"
      });
    }
  };
  return <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Google Gemini API Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2 pb-4">
          <div className="space-y-2">
            <Label htmlFor="api-key">Enter your Google Gemini API Key</Label>
            <Input id="api-key" type="password" placeholder="API Key" value={key} onChange={e => setKey(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="api-url">API Endpoint URL (Optional)</Label>
            <Input id="api-url" type="text" placeholder="API URL" value={url} onChange={e => setUrl(e.target.value)} />
          </div>
          <div className="text-xs text-muted-foreground">
            Get your API key from{" "}
            <a href="https://ai.google.dev/tutorials/setup" target="_blank" rel="noreferrer" className="text-gemini-purple hover:underline">
              Google AI Studio
            </a>
          </div>
          <Button onClick={handleSave} className="w-full bg-gemini-purple hover:bg-gemini-purple/90 text-white">Save API Settings</Button>
        </div>
      </DialogContent>
    </Dialog>;
}