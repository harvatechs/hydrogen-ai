import { toast } from "@/components/ui/use-toast";
import { Message } from "@/types/message";

export class ChatApiService {
  static async sendMessageToApi(
    apiUrl: string, 
    apiKey: string, 
    content: string, 
    conversationContext: string, 
    systemPrompt: string = "",
    temperature: number = 0.7,
    maxOutputTokens: number = 1000,
    controller?: AbortController
  ): Promise<string> {
    // Check if streaming is enabled
    const streamingEnabled = localStorage.getItem("app-streaming-enabled") !== "false";
    
    if (streamingEnabled) {
      try {
        return await this.handleStreamingRequest(
          apiUrl, apiKey, content, conversationContext, systemPrompt, 
          temperature, maxOutputTokens, controller
        );
      } catch (error) {
        console.error("Streaming failed, falling back to standard request", error);
        return await this.handleNonStreamingRequest(
          apiUrl, apiKey, content, conversationContext, systemPrompt, 
          temperature, maxOutputTokens, controller
        );
      }
    } else {
      return await this.handleNonStreamingRequest(
        apiUrl, apiKey, content, conversationContext, systemPrompt, 
        temperature, maxOutputTokens, controller
      );
    }
  }

  private static async handleStreamingRequest(
    apiUrl: string,
    apiKey: string,
    content: string,
    conversationContext: string,
    systemPrompt: string = "",
    temperature: number = 0.7,
    maxOutputTokens: number = 1000,
    controller?: AbortController
  ): Promise<string> {
    const systemPromptSection = systemPrompt ? 
      `\nCUSTOM INSTRUCTIONS:\n${systemPrompt}\n\n` : 
      "";
    
    const streamUrl = `${apiUrl}:streamGenerateContent?key=${apiKey}`;
    const response = await fetch(streamUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are HydroGen AI, a helpful, advanced assistant powered by Google's Gemini technology.${systemPromptSection}

            CONVERSATION HISTORY FOR CONTEXT (use this for follow-up questions):
            ${conversationContext}

            Answer this question accurately and helpfully: "${content}"

            RESPONSE FORMAT:
            - Use HTML for structure (<h2>, <h3> for headings, <p> for paragraphs)
            - Use <strong> for key concepts and <em> for definitions
            - Use <ul>, <ol>, <li> for lists
            - Use <blockquote> for quotes
            - Use <table>, <tr>, <th>, <td> for data tables
            - Use <code> for code snippets and equations
            - Always use semantic HTML5 for proper structure`
          }]
        }],
        generationConfig: {
          temperature: temperature,
          maxOutputTokens: maxOutputTokens,
          topP: 0.9,
          topK: 40
        }
      }),
      signal: controller?.signal
    });

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("Failed to get response stream reader");
    }

    let fullText = '';

    // Read the stream
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      // Convert the chunk to text
      const chunk = new TextDecoder().decode(value);

      try {
        // The stream comes as multiple JSON objects separated by newlines
        const lines = chunk.split('\n').filter(line => line.trim());

        for (const line of lines) {
          try {
            const data = JSON.parse(line);
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

            if (text) {
              fullText += text;
            }
          } catch (e) {
            console.warn('Error parsing streaming chunk:', e);
          }
        }
      } catch (e) {
        console.error('Error processing stream chunk:', e);
      }
    }

    if (!fullText) {
      throw new Error("No text was generated in the response stream");
    }
    
    return fullText;
  }

  private static async handleNonStreamingRequest(
    apiUrl: string,
    apiKey: string,
    content: string,
    conversationContext: string,
    systemPrompt: string = "",
    temperature: number = 0.7,
    maxOutputTokens: number = 1000,
    controller?: AbortController
  ): Promise<string> {
    const systemPromptSection = systemPrompt ? 
      `\nCUSTOM INSTRUCTIONS:\n${systemPrompt}\n\n` : 
      "";
      
    const response = await fetch(`${apiUrl}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are HydroGen AI, a helpful, advanced assistant powered by Google's Gemini technology.${systemPromptSection}

            CONVERSATION HISTORY FOR CONTEXT (use this for follow-up questions):
            ${conversationContext}

            Answer this question accurately and helpfully: "${content}"

            RESPONSE FORMAT:
            - Use HTML for structure (<h2>, <h3> for headings, <p> for paragraphs)
            - Use <strong> for key concepts and <em> for definitions
            - Use <ul>, <ol>, <li> for lists
            - Use <blockquote> for quotes
            - Use <table>, <tr>, <th>, <td> for data tables
            - Use <code> for code snippets and equations
            - Always use semantic HTML5 for proper structure`
          }]
        }],
        generationConfig: {
          temperature: temperature,
          maxOutputTokens: maxOutputTokens,
          topP: 0.9,
          topK: 40
        }
      }),
      signal: controller?.signal
    });
      
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data.candidates[0]?.content?.parts[0]?.text || "No response generated.";

    return generatedText;
  }

  static async generateShortTitle(
    apiUrl: string, 
    apiKey: string, 
    prompt: string
  ): Promise<string> {
    try {
      const response = await fetch(`${apiUrl}?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 50,
            topP: 0.9,
            topK: 40
          }
        }),
      });
      
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }

      const data = await response.json();
      const generatedText = data.candidates[0]?.content?.parts[0]?.text || "";

      return generatedText;
    } catch (error) {
      console.error("Error generating title:", error);
      throw error;
    }
  }
}
