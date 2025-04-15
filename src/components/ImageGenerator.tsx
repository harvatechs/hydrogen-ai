
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Image, Download, Copy, ExternalLink, Palette, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

type ImageStyle = 
  | 'photorealistic' 
  | 'digital-art' 
  | 'anime' 
  | 'illustration' 
  | 'painting' 
  | 'sketch' 
  | '3d-render';

interface ImageGenerationOptions {
  style: ImageStyle;
  ratio: '1:1' | '16:9' | '9:16' | '4:3' | '3:4';
  enhancePrompt: boolean;
}

export function ImageGenerator({ onClose }: { onClose: () => void }) {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [options, setOptions] = useState<ImageGenerationOptions>({
    style: 'photorealistic',
    ratio: '1:1',
    enhancePrompt: true
  });

  // OpenRouter API Key (this should be stored securely in a production environment)
  const apiKey = "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";

  const generateImages = async () => {
    if (!prompt.trim()) {
      toast({
        title: 'Empty prompt',
        description: 'Please enter a description for your image',
        variant: 'destructive'
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      // In a real implementation, you would call the actual API
      // For demo purposes, we'll simulate the API call with a timeout
      toast({
        title: 'Generating images',
        description: 'This may take a few moments...'
      });

      setTimeout(() => {
        // Mock generated images - in a real app, these would come from the API
        const mockImages = [
          'https://picsum.photos/seed/img1/512/512',
          'https://picsum.photos/seed/img2/512/512',
          'https://picsum.photos/seed/img3/512/512',
          'https://picsum.photos/seed/img4/512/512'
        ];
        
        setGeneratedImages(mockImages);
        setIsGenerating(false);
        
        toast({
          title: 'Images generated',
          description: `Created ${mockImages.length} images based on your prompt`
        });
      }, 3000);
    } catch (error) {
      setIsGenerating(false);
      toast({
        title: 'Error generating images',
        description: 'There was a problem with the image generation service',
        variant: 'destructive'
      });
    }
  };

  const handleDownload = (imageUrl: string, index: number) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `generated-image-${index}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: 'Image downloaded',
      description: 'The image has been saved to your device'
    });
  };

  const handleCopyURL = (imageUrl: string) => {
    navigator.clipboard.writeText(imageUrl);
    
    toast({
      title: 'URL copied',
      description: 'Image URL has been copied to clipboard'
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b dark:border-white/10 light:border-black/10">
        <h2 className="text-xl font-semibold mb-1">Image Generator</h2>
        <p className="text-sm text-muted-foreground">Create AI-generated images from text descriptions</p>
      </div>
      
      <div className="p-4 flex-1 overflow-auto space-y-4">
        <div>
          <label className="text-sm font-medium mb-1 block">Image Description</label>
          <Textarea
            placeholder="Describe the image you want to generate..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[100px] resize-none"
          />
          <div className="text-xs text-muted-foreground mt-1">
            Be detailed and specific about what you want to see in the image
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Style</label>
            <Select
              value={options.style}
              onValueChange={(value) => setOptions({...options, style: value as ImageStyle})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="photorealistic">Photorealistic</SelectItem>
                <SelectItem value="digital-art">Digital Art</SelectItem>
                <SelectItem value="anime">Anime</SelectItem>
                <SelectItem value="illustration">Illustration</SelectItem>
                <SelectItem value="painting">Painting</SelectItem>
                <SelectItem value="sketch">Sketch</SelectItem>
                <SelectItem value="3d-render">3D Render</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">Aspect Ratio</label>
            <Select
              value={options.ratio}
              onValueChange={(value) => setOptions({...options, ratio: value as any})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select ratio" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1:1">Square (1:1)</SelectItem>
                <SelectItem value="16:9">Landscape (16:9)</SelectItem>
                <SelectItem value="9:16">Portrait (9:16)</SelectItem>
                <SelectItem value="4:3">Standard (4:3)</SelectItem>
                <SelectItem value="3:4">Portrait (3:4)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            className={cn(
              "flex items-center gap-1 border-dashed",
              options.enhancePrompt 
                ? "dark:bg-white/5 dark:text-white light:bg-black/5 light:text-black" 
                : ""
            )}
            onClick={() => setOptions({...options, enhancePrompt: !options.enhancePrompt})}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Enhance Prompt</span>
            {options.enhancePrompt && <Check className="h-3 w-3 ml-1" />}
          </Button>
          
          <div className="text-xs text-muted-foreground">
            AI will automatically improve your prompt for better results
          </div>
        </div>
        
        <Button 
          onClick={generateImages}
          disabled={isGenerating || !prompt.trim()}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Palette className="h-4 w-4 mr-2" />
              Generate Images
            </>
          )}
        </Button>
        
        {generatedImages.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-medium">Generated Images</h3>
            <div className="grid grid-cols-2 gap-4">
              {generatedImages.map((image, index) => (
                <div key={index} className="rounded-lg overflow-hidden border dark:border-white/10 light:border-black/10">
                  <div className="aspect-square relative">
                    <img 
                      src={image} 
                      alt={`Generated image ${index+1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
                      <div className="flex justify-end space-x-1">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-8 w-8 bg-white/10 backdrop-blur-sm hover:bg-white/20"
                          onClick={() => handleCopyURL(image)}
                        >
                          <Copy className="h-4 w-4 text-white" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-8 w-8 bg-white/10 backdrop-blur-sm hover:bg-white/20"
                          onClick={() => handleDownload(image, index)}
                        >
                          <Download className="h-4 w-4 text-white" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-8 w-8 bg-white/10 backdrop-blur-sm hover:bg-white/20"
                          onClick={() => window.open(image, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4 text-white" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
