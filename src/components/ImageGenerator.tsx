import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Check, Image as ImageIcon, Download, Copy, RefreshCw, Sparkles } from 'lucide-react';
import { useChat } from '@/context/ChatContext';
import { toast } from '@/components/ui/use-toast';

export function ImageGenerator({ onClose }: { onClose: () => void }) {
  const [prompt, setPrompt] = useState('');
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<'square' | 'portrait' | 'landscape'>('square');
  const [selectedStyle, setSelectedStyle] = useState<'photorealistic' | 'artistic' | 'cartoon' | '3d'>('photorealistic');
  const { sendMessage } = useChat();

  const imageSizes = {
    square: '1024x1024',
    portrait: '1024x1792',
    landscape: '1792x1024'
  };

  const styleDescriptions = {
    photorealistic: 'Detailed and realistic images',
    artistic: 'Creative and painterly style',
    cartoon: 'Stylized cartoon illustrations',
    '3d': '3D rendered objects and scenes'
  };

  // Example image URLs for demonstration
  const exampleImages = [
    'https://images.unsplash.com/photo-1682687982501-1e58ab814714',
    'https://images.unsplash.com/photo-1682687982501-1e58ab814714',
    'https://images.unsplash.com/photo-1682687982501-1e58ab814714',
    'https://images.unsplash.com/photo-1682687982501-1e58ab814714'
  ];

  const generateImages = () => {
    if (!prompt.trim()) {
      toast({
        title: "Empty prompt",
        description: "Please enter a description for the image you want to generate.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    // In a real implementation, this would call an API
    // For now, we'll simulate image generation with a delay
    setTimeout(() => {
      setGeneratedImages(exampleImages);
      setIsGenerating(false);
      
      toast({
        title: "Images generated",
        description: "Your images have been created successfully."
      });
      
      // Send the prompt to the chat for context
      sendMessage(`I generated images with the prompt: "${prompt}" (${imageSizes[selectedSize]}, ${selectedStyle} style)`);
    }, 2000);
  };

  const copyPrompt = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    
    setTimeout(() => {
      setCopied(null);
    }, 2000);
    
    toast({
      title: "Copied to clipboard",
      description: "The prompt has been copied to your clipboard."
    });
  };

  const downloadImage = (url: string) => {
    // In a real implementation, this would download the actual image
    // For now, we'll just show a toast
    toast({
      title: "Download started",
      description: "Your image is being downloaded."
    });
  };

  const enhancePrompt = () => {
    if (!prompt.trim()) {
      toast({
        title: "Empty prompt",
        description: "Please enter a basic prompt to enhance.",
        variant: "destructive"
      });
      return;
    }
    
    setIsGenerating(true);
    
    // Simulate enhancing the prompt
    setTimeout(() => {
      const enhancedPrompt = `${prompt}, highly detailed, professional photography, dramatic lighting, 8k resolution, trending on artstation, masterpiece`;
      setPrompt(enhancedPrompt);
      setIsGenerating(false);
      
      toast({
        title: "Prompt enhanced",
        description: "Your prompt has been enhanced with additional details."
      });
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full">
      <DialogHeader className="px-4 pt-4 pb-2">
        <DialogTitle className="text-xl flex items-center gap-2">
          <ImageIcon className="h-5 w-5 text-blue-500" />
          Image Generator
        </DialogTitle>
        <DialogDescription>
          Create images from text descriptions using AI
        </DialogDescription>
      </DialogHeader>
      
      <div className="p-4 space-y-4">
        <Textarea
          placeholder="Describe the image you want to generate in detail..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="min-h-[100px] dark:bg-black/20 light:bg-white"
        />
        
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={enhancePrompt}
            disabled={isGenerating}
            className="flex items-center gap-1.5"
          >
            <Sparkles className="h-3.5 w-3.5 text-yellow-500" />
            Enhance prompt
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => copyPrompt(prompt)}
            disabled={!prompt.trim()}
            className="flex items-center gap-1.5"
          >
            {copied === prompt ? (
              <Check className="h-3.5 w-3.5 text-green-500" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
            Copy
          </Button>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <div>
            <h3 className="text-sm font-medium mb-2">Image size</h3>
            <div className="flex flex-col gap-2">
              {(Object.keys(imageSizes) as Array<keyof typeof imageSizes>).map((size) => (
                <Button
                  key={size}
                  variant={selectedSize === size ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedSize(size)}
                  className="justify-start"
                >
                  {size.charAt(0).toUpperCase() + size.slice(1)} ({imageSizes[size]})
                </Button>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2">Style</h3>
            <div className="flex flex-col gap-2">
              {(Object.keys(styleDescriptions) as Array<keyof typeof styleDescriptions>).map((style) => (
                <Button
                  key={style}
                  variant={selectedStyle === style ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedStyle(style)}
                  className="justify-start"
                >
                  {style.charAt(0).toUpperCase() + style.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </div>
        
        <Button 
          onClick={generateImages} 
          disabled={isGenerating || !prompt.trim()} 
          className="w-full"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <ImageIcon className="mr-2 h-4 w-4" />
              Generate Images
            </>
          )}
        </Button>
      </div>
      
      {generatedImages.length > 0 && (
        <div className="flex-1 p-4 pt-0">
          <h3 className="text-sm font-medium mb-2">Generated Images</h3>
          <ScrollArea className="h-[300px]">
            <div className="grid grid-cols-2 gap-4">
              {generatedImages.map((image, index) => (
                <div key={index} className="relative group">
                  <img 
                    src={image} 
                    alt={`Generated image ${index + 1}`} 
                    className="w-full h-auto rounded-lg object-cover aspect-square"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center gap-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => downloadImage(image)}
                      className="h-8 w-8 bg-black/50 border-white/20 text-white hover:bg-black/70"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => copyPrompt(prompt)}
                      className="h-8 w-8 bg-black/50 border-white/20 text-white hover:bg-black/70"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
      
      <div className="p-4 border-t dark:border-white/10 light:border-black/10">
        <Button variant="outline" onClick={onClose} className="w-full">
          Close
        </Button>
      </div>
    </div>
  );
}
