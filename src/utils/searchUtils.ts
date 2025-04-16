
import { toast } from "@/components/ui/use-toast";

// Google Custom Search API configuration
const apiKey = 'AIzaSyDkImyDMpXroXPHCVD0cgGlD5hrBSk4LTA';
const cx = '013dfbd644bed4d5d';

export interface SearchResult {
  title: string;
  link: string;
  snippet: string;
  formattedUrl?: string;
  htmlTitle?: string;
  htmlSnippet?: string;
  displayLink?: string;
  pagemap?: {
    cse_image?: Array<{ src: string }>;
    cse_thumbnail?: Array<{ src: string }>;
    metatags?: Array<Record<string, string>>;
  };
}

export interface SearchResponse {
  items: SearchResult[];
  searchInformation: {
    formattedTotalResults: string;
    formattedSearchTime: string;
    totalResults: string;
    searchTime: number;
  };
  queries?: {
    request: Array<{
      searchTerms: string;
      count: number;
    }>;
    nextPage?: Array<{
      startIndex: number;
    }>;
  };
}

export const searchGoogle = async (searchTerm: string, startIndex = 1): Promise<SearchResponse | null> => {
  if (!searchTerm.trim()) {
    toast({
      title: "Empty search",
      description: "Please enter a search term",
      variant: "destructive",
    });
    return null;
  }

  try {
    const apiUrl = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(searchTerm)}&key=${apiKey}&cx=${cx}&start=${startIndex}`;
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Search error details:', errorData);
      throw new Error(errorData.error?.message || 'Search request failed');
    }
    
    const data = await response.json();
    
    // If debugging is needed
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

// Function to extract domain from URL
export const extractDomain = (url: string): string => {
  try {
    const domain = new URL(url).hostname.replace('www.', '');
    return domain;
  } catch (e) {
    return url;
  }
};

// Function to format search time
export const formatSearchTime = (seconds: number): string => {
  return `${(seconds * 1000).toFixed(2)} ms`;
};

// Function to highlight search terms in text
export const highlightSearchTerms = (text: string, searchTerm: string): string => {
  if (!searchTerm || !text) return text;
  
  const terms = searchTerm.split(' ').filter(term => term.length > 2);
  let highlightedText = text;
  
  terms.forEach(term => {
    const regex = new RegExp(`(${term})`, 'gi');
    highlightedText = highlightedText.replace(regex, '<mark>$1</mark>');
  });
  
  return highlightedText;
};
