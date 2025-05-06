
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { useEffect, useState } from "react";
import { SettingsProvider } from "./context/SettingsContext";
import "./styles/enhanced-ui.css";

// Create QueryClient with improved settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

const App = () => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  
  // Check system preference and set initial theme
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null;
    
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.add(savedTheme);
    } else if (prefersDark) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    } else {
      setTheme('light');
      document.documentElement.classList.add('light');
    }
  }, []);
  
  // Watch for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (event: MediaQueryListEvent) => {
      const systemTheme = event.matches ? 'dark' : 'light';
      const userTheme = localStorage.getItem('theme');
      
      // Only update if user is using system preference (no saved theme)
      if (!userTheme) {
        setTheme(systemTheme);
        document.documentElement.classList.remove('dark', 'light');
        document.documentElement.classList.add(systemTheme);
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  
  // Fix scrolling issues
  useEffect(() => {
    // Add smooth scrolling to the entire document
    document.documentElement.style.scrollBehavior = 'smooth';
    document.documentElement.style.height = '100%';
    document.body.style.minHeight = '100vh';
    document.body.style.overflowX = 'hidden';
    
    // Add some CSS variables for the current theme
    if (theme === 'dark') {
      document.documentElement.style.setProperty('--app-background', '#121212');
      document.documentElement.style.setProperty('--app-text', 'rgba(255, 255, 255, 0.87)');
      document.documentElement.style.setProperty('--app-border', 'rgba(255, 255, 255, 0.1)');
    } else {
      document.documentElement.style.setProperty('--app-background', '#ffffff');
      document.documentElement.style.setProperty('--app-text', 'rgba(0, 0, 0, 0.87)');
      document.documentElement.style.setProperty('--app-border', 'rgba(0, 0, 0, 0.1)');
    }
    
    return () => {
      document.documentElement.style.scrollBehavior = '';
      document.documentElement.style.height = '';
      document.body.style.minHeight = '';
      document.body.style.overflowX = '';
    };
  }, [theme]);

  return (
    <QueryClientProvider client={queryClient}>
      <SettingsProvider>
        <TooltipProvider>
          <Toaster position="top-center" />
          <Sonner position="top-right" className="toaster-container" />
          <BrowserRouter>
            <div className="min-h-screen w-full">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/app" element={<Navigate to="/" replace />} />
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
