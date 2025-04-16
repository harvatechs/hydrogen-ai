
/**
 * Answer Engine API using Google's Gemini model
 */

const API_KEY = 'AIzaSyApy8Nw8M6PeUWtKapURmaZnuH4lWogN6I';
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export interface AnswerResponse {
  content: string;
  isError: boolean;
  errorMessage?: string;
}

export async function fetchAnswer(query: string): Promise<AnswerResponse> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Answer this question accurately and helpfully: "${query}"

            RESPONSE FORMAT:
            - Use HTML for structure (<h2>, <h3> for headings, <p> for paragraphs)
            - Use <strong> for key concepts and <em> for definitions
            - Use <ul>, <ol>, <li> for lists
            - Use <blockquote> for quotes
            - Use <table>, <tr>, <th>, <td> for data tables
            - Use <code> for code snippets and equations
            - Use <a href=""> for citations

            CONTENT STRUCTURE:
            1. Begin with a clear, direct answer to the question (2-3 sentences)
            2. Provide an executive summary with key takeaways (bullet points)
            3. Give necessary background information and context
            4. Present a detailed explanation with:
            • Step-by-step breakdowns when applicable
            • Evidence and data from reliable sources
            • Multiple perspectives when the topic is debated
            • Visual descriptions or analogies for complex concepts
            5. Address common misconceptions or frequently asked questions
            6. Include practical applications or real-world examples
            7. Conclude with future implications or next steps
            8. Add references to credible sources

            QUALITY GUIDELINES:
            - Ensure factual accuracy and cite reliable sources
            - Use clear, accessible language for all expertise levels
            - Explain technical terms when they first appear
            - Provide balanced coverage of different viewpoints
            - Distinguish clearly between facts and opinions
            - Acknowledge limitations in current knowledge
            - Organize information logically with smooth transitions
            - Use concrete examples to illustrate abstract concepts
            - Tailor depth based on the complexity of the question

            Respond in a helpful, informative tone that's accessible to beginners but substantive enough for experts.`
          }]
        }],
        generationConfig: {
          temperature: 0.5,
          maxOutputTokens: 4096,
        }
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API error:', errorData);
      return {
        content: '',
        isError: true,
        errorMessage: errorData.error?.message || 'Failed to generate answer'
      };
    }

    const data = await response.json();
    
    if (!data.candidates || data.candidates.length === 0) {
      return {
        content: '',
        isError: true,
        errorMessage: 'No response from Gemini API'
      };
    }
    
    // Extract the text from the response
    const rawContent = data.candidates[0].content.parts[0].text;
    
    // Process the content to enhance formatting if needed
    const processedContent = enhanceContentFormatting(rawContent);
    
    return {
      content: processedContent,
      isError: false
    };
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return {
      content: '',
      isError: true,
      errorMessage: error instanceof Error ? error.message : 'An unexpected error occurred'
    };
  }
}

/**
 * Enhance content formatting to make it more visually appealing
 */
function enhanceContentFormatting(content: string): string {
  // Basic safety check to remove any potentially harmful scripts
  let safeContent = content.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Make sure all links open in a new tab
  safeContent = safeContent.replace(/<a([^>]*)>/gi, '<a$1 target="_blank" rel="noopener noreferrer">');
  
  // Add syntax highlighting for code blocks (optional enhancement)
  safeContent = safeContent.replace(/<code>([\s\S]*?)<\/code>/gi, (match, p1) => {
    return `<code class="bg-black/30 px-1 py-0.5 rounded text-yellow-200">${p1}</code>`;
  });
  
  // Add table styling
  safeContent = safeContent.replace(/<table>/gi, '<table class="border-collapse w-full my-4">');
  safeContent = safeContent.replace(/<th>/gi, '<th class="border border-gray-600 px-4 py-2 bg-black/20">');
  safeContent = safeContent.replace(/<td>/gi, '<td class="border border-gray-700 px-4 py-2">');
  
  // Highlight blockquotes
  safeContent = safeContent.replace(/<blockquote>/gi, '<blockquote class="border-l-4 border-gemini-yellow/50 pl-4 py-2 my-4 italic text-gray-300">');
  
  return safeContent;
}
