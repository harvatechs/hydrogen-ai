
import { toast } from "@/components/ui/use-toast";

// Google Custom Search API configuration
const apiKey = 'AIzaSyDkImyDMpXroXPHCVD0cgGlD5hrBSk4LTA';
const cx = '013dfbd644bed4d5d';

export interface SearchResult {
  title: string;
  link: string;
  snippet: string;
  pagemap?: {
    cse_image?: Array<{ src: string }>;
    cse_thumbnail?: Array<{ src: string }>;
  };
}

export interface SearchResponse {
  items: SearchResult[];
  searchInformation: {
    formattedTotalResults: string;
    formattedSearchTime: string;
  };
}

export const searchGoogle = async (searchTerm: string): Promise<SearchResponse | null> => {
  if (!searchTerm.trim()) {
    toast({
      title: "Empty search",
      description: "Please enter a search term",
      variant: "destructive",
    });
    return null;
  }

  try {
    const apiUrl = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(searchTerm)}&key=${apiKey}&cx=${cx}`;
    
    console.log('Searching for:', searchTerm);
    console.log('API URL:', apiUrl);
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Search API error:', errorData);
      throw new Error(errorData.error?.message || 'Search request failed');
    }
    
    const data = await response.json();
    console.log('Search results:', data);
    return data;
  } catch (error) {
    console.error('Search error:', error);
    
    toast({
      title: "Search failed",
      description: error instanceof Error ? error.message : "An unexpected error occurred",
      variant: "destructive",
    });
    
    return null;
  }
};

// Function to handle popular topics search
export const searchPopularTopic = (topic: string, sendMessage: (message: string) => void) => {
  if (!topic) return;
  
  console.log('Searching popular topic:', topic);
  sendMessage(`I'd like to learn about ${topic}`);
  
  toast({
    title: "Topic selected",
    description: `Searching for information about ${topic}`,
  });
};

