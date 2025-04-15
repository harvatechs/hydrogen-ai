
import { OpenRouterResponse } from '@/types/message';
import { toast } from "@/components/ui/use-toast";

const OPENROUTER_API_KEY = "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";
const API_URL = "https://openrouter.ai/api/v1/chat/completions";

export async function generateCompletionWithOpenRouter(
  messages: { role: string; content: string }[],
  model: string = "openai/gpt-3.5-turbo"
): Promise<OpenRouterResponse> {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'HydroGen AI'
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        temperature: 0.7,
        max_tokens: 1500,
        stream: false
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenRouter API error:', errorData);
      throw new Error(errorData.error?.message || 'Failed to generate completion');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error calling OpenRouter API:', error);
    toast({
      title: "AI Response Error",
      description: error instanceof Error ? error.message : "Failed to get a response from AI service",
      variant: "destructive"
    });
    throw error;
  }
}

export async function generateImageWithOpenRouter(
  prompt: string,
  model: string = "stability/stable-diffusion-xl",
  options: {
    style?: string;
    aspectRatio?: string;
    enhancePrompt?: boolean;
    negativePrompt?: string;
  } = {}
): Promise<string[]> {
  try {
    toast({
      title: "Generating image",
      description: "Creating your image with AI...",
    });
    
    // In a real implementation, this would use the correct API endpoint for image generation
    // For demo purposes, we're just simulating the response
    
    // Add a slight delay to simulate processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock response with better placeholder images
    return [
      'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=512&h=512&fit=crop',
      'https://images.unsplash.com/photo-1590523278191-995cbcda646b?w=512&h=512&fit=crop',
      'https://images.unsplash.com/photo-1613336026275-d6d473084e85?w=512&h=512&fit=crop',
      'https://images.unsplash.com/photo-1604871000636-074fa5117945?w=512&h=512&fit=crop'
    ];
  } catch (error) {
    console.error('Error calling image generation API:', error);
    toast({
      title: "Image Generation Failed",
      description: error instanceof Error ? error.message : "Failed to generate image",
      variant: "destructive"
    });
    throw error;
  }
}

// New function for streaming responses (more like ChatGPT)
export async function streamCompletionWithOpenRouter(
  messages: { role: string; content: string }[],
  onChunk: (chunk: string) => void,
  onComplete: (fullResponse: string) => void,
  model: string = "openai/gpt-3.5-turbo"
): Promise<void> {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'HydroGen AI'
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        temperature: 0.7,
        max_tokens: 1500,
        stream: true
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenRouter streaming API error:', errorData);
      throw new Error(errorData.error?.message || 'Failed to generate streaming completion');
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error('Stream not available');

    const decoder = new TextDecoder();
    let fullResponse = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      const chunk = decoder.decode(value);
      
      // Parse the chunk and extract the content
      const lines = chunk.split('\n').filter(line => line.trim() !== '');
      
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') continue;
          
          try {
            const parsed = JSON.parse(data);
            if (parsed.choices && parsed.choices[0]?.delta?.content) {
              const content = parsed.choices[0].delta.content;
              onChunk(content);
              fullResponse += content;
            }
          } catch (e) {
            console.error('Error parsing streaming response:', e);
          }
        }
      }
    }
    
    onComplete(fullResponse);
    
  } catch (error) {
    console.error('Error with streaming completion:', error);
    toast({
      title: "Streaming Error",
      description: error instanceof Error ? error.message : "Failed to stream AI response",
      variant: "destructive"
    });
    throw error;
  }
}
