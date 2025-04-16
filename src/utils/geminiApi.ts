
/**
 * Gemini API Integration for HydroGen AI
 */

export interface GeminiMessage {
  role: 'user' | 'model' | 'system';
  content: string;
}

export interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
      role: string;
    };
    finishReason: string;
  }>;
}

const API_KEY = 'AIzaSyApy8Nw8M6PeUWtKapURmaZnuH4lWogN6I';
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export async function generateCompletionWithGemini(
  messages: GeminiMessage[]
): Promise<string> {
  try {
    // Format messages for Gemini API
    const formattedMessages = messages.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.content }]
    }));

    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: formattedMessages,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1500,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API error:', errorData);
      throw new Error(errorData.error?.message || 'Failed to generate completion');
    }

    const data = await response.json() as GeminiResponse;
    
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error('No response from Gemini API');
    }
    
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw error;
  }
}

// Function to transcribe audio to text using Gemini API
export async function transcribeAudioWithGemini(audioBlob: Blob): Promise<string> {
  // This is a placeholder for future audio transcription integration
  // For now, we'll return a message explaining that transcription is in development
  return "Audio transcription with Gemini API is coming soon. Your voice was recorded successfully.";
}
