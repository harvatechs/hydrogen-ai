
import { OpenRouterResponse } from '@/types/message';

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
        max_tokens: 1500
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to generate completion');
    }

    return await response.json();
  } catch (error) {
    console.error('Error calling OpenRouter API:', error);
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
  } = {}
): Promise<string[]> {
  try {
    // In a real implementation, this would use the correct API endpoint for image generation
    // For demo purposes, we're just simulating the response
    
    // Mock response
    return [
      'https://picsum.photos/seed/img1/512/512',
      'https://picsum.photos/seed/img2/512/512',
      'https://picsum.photos/seed/img3/512/512',
      'https://picsum.photos/seed/img4/512/512'
    ];
  } catch (error) {
    console.error('Error calling image generation API:', error);
    throw error;
  }
}
