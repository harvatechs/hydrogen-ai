
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import LandingPage from "./pages/LandingPage";
import NotFound from "./pages/NotFound";
import { useEffect, useState } from "react";
import { SettingsProvider } from "./context/SettingsContext";
import "./styles/enhanced-ui.css";
import "./styles/chatgpt-theme.css";

// Create QueryClient with improved error handling and retry logic
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        // Don't retry on 401/403 errors (auth issues)
        if (error instanceof Error && 
            error.message.includes('401') || 
            error.message.includes('403')) {
          return false;
        }
        // Only retry twice for other errors
        return failureCount < 2;
      },
      staleTime: 60000, // 1 minute
    },
  },
});

const App = () => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  
  // Check system preference and set initial theme - with improved error handling
  useEffect(() => {
    try {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null;
      
      // Sanitize saved theme to prevent XSS
      const validThemes = ['dark', 'light'];
      const safeTheme = savedTheme && validThemes.includes(savedTheme) ? savedTheme : null;
      
      if (safeTheme) {
        setTheme(safeTheme);
        document.documentElement.classList.add(safeTheme);
      } else if (prefersDark) {
        setTheme('dark');
        document.documentElement.classList.add('dark');
      } else {
        setTheme('light');
        document.documentElement.classList.add('light');
      }
    } catch (error) {
      console.error("Error setting theme:", error);
      // Fallback to dark theme if there's an error
      setTheme('dark');
      document.documentElement.classList.add('dark');
    }
  }, []);
  
  // Set Content Security Meta Tag
  useEffect(() => {
    const metaCSP = document.createElement('meta');
    metaCSP.httpEquiv = 'Content-Security-Policy';
    metaCSP.content = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://generativelanguage.googleapis.com; font-src 'self' data:";
    document.head.appendChild(metaCSP);
    
    return () => {
      document.head.removeChild(metaCSP);
    };
  }, []);
  
  // Fix scrolling issues
  useEffect(() => {
    // Add smooth scrolling to the entire document
    document.documentElement.style.scrollBehavior = 'smooth';
    document.documentElement.style.height = '100%';
    document.body.style.minHeight = '100vh';
    document.body.style.overflowX = 'hidden';
    
    return () => {
      document.documentElement.style.scrollBehavior = '';
      document.documentElement.style.height = '';
      document.body.style.minHeight = '';
      document.body.style.overflowX = '';
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <SettingsProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner position="top-right" className="toaster-container" />
          <BrowserRouter>
            <div className="min-h-screen w-full">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/app" element={<Index />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </SettingsProvider>
    </QueryClientProvider>
  );
};

export default App;
