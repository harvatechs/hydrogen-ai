
import React, { useState, useCallback } from 'react';
import { useChat } from '@/context/ChatContext';
import { toast } from '@/components/ui/use-toast';
import { SearchBox } from './search/SearchBox';
import { SearchResults } from './search/SearchResults';
import { SearchHeader } from './search/SearchHeader';
import { Card } from '@/components/ui/card';

interface SearchResult {
  title: string;
  link: string;
  snippet: string;
}

interface WebSearchAtomProps {
  query: string;
  onClose: () => void;
  onSubmitResult: (result: string) => void;
}

const mockSearchResults = (query: string): Promise<SearchResult[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          title: `Results for ${query} - First Result`,
          link: 'https://example.com/result1',
          snippet: `This is a sample result for your search on "${query}". It contains relevant information about your query that might be useful.`
        },
        {
          title: `${query} - Second Search Result with Additional Information`,
          link: 'https://example.com/result2',
          snippet: `More information about "${query}" can be found here. This result provides additional context and details that you might find interesting.`
        },
        {
          title: `Complete Guide to ${query} - Third Result`,
          link: 'https://example.com/result3',
          snippet: `A comprehensive guide about "${query}" with detailed explanations and examples. This is the most complete resource you'll find online.`
        }
      ]);
    }, 1500);
  });
};

const WebSearchAtom: React.FC<WebSearchAtomProps> = ({ query: initialQuery, onClose, onSubmitResult }) => {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = useCallback(async () => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    try {
      const searchResults = await mockSearchResults(query);
      setResults(searchResults);
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: 'Search Failed',
        description: 'Unable to complete search. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSearching(false);
    }
  }, [query]);

  const handleAskAI = useCallback(() => {
    if (results.length === 0) {
      toast({
        title: 'No Results',
        description: 'Please search for something first before asking AI.',
      });
      return;
    }

    const resultsText = results
      .map((result, i) => `[${i+1}] ${result.title}\n${result.link}\n${result.snippet}`)
      .join('\n\n');

    const prompt = `I searched for "${query}" and found these results. Can you summarize the key information?\n\n${resultsText}`;
    onSubmitResult(prompt);
    
    toast({
      title: 'Query Sent to AI',
      description: 'The search results have been sent to AI for analysis.'
    });
  }, [query, results, onSubmitResult]);

  return (
    <Card className="w-full max-w-3xl mx-auto overflow-hidden border border-border/50 bg-gradient-to-b from-background/80 to-background shadow-lg backdrop-blur-sm">
      <div className="p-4 md:p-6 space-y-4">
        <SearchHeader onAskAI={handleAskAI} isLoading={isSearching} onClose={onClose} />
        
        <SearchBox 
          query={query} 
          onQueryChange={setQuery} 
          onSearch={handleSearch} 
          isSearching={isSearching} 
        />
        
        <div className="h-[400px] overflow-hidden rounded-md border border-border/40 bg-background/60">
          <SearchResults results={results} isSearching={isSearching} />
        </div>
      </div>
    </Card>
  );
};

export default WebSearchAtom;
