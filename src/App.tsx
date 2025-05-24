
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { AuthGuard } from "./components/auth/AuthGuard";
import Index from "./pages/Index";
import AuthPage from "./pages/AuthPage";
import LandingPage from "./pages/LandingPage";
import NotFound from "./pages/NotFound";
import { useEffect, useState } from "react";
import { SettingsProvider } from "./context/SettingsContext";
import { LoadingScreen } from "./components/LoadingScreen";
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
  const [isLoading, setIsLoading] = useState(true);
  
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
      
      // Simulate app loading
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1200);
      
      return () => clearTimeout(timer);
    } catch (error) {
      console.error("Error setting theme:", error);
      // Fallback to dark theme if there's an error
      setTheme('dark');
      document.documentElement.classList.add('dark');
      setIsLoading(false);
    }
  }, []);
  
  // Add Google Fonts for enhanced typography
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Fira+Code:wght@400;500&display=swap';
    document.head.appendChild(link);
    
    document.body.style.fontFamily = "'Inter', sans-serif";
    
    return () => {
      document.head.removeChild(link);
    };
  }, []);
  
  // Add viewport meta for responsive design
  useEffect(() => {
    const metaViewport = document.createElement('meta');
    metaViewport.name = 'viewport';
    metaViewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
    document.head.appendChild(metaViewport);
    
    return () => {
      document.head.removeChild(metaViewport);
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

  if (isLoading) {
    return <LoadingScreen message="Starting HydroGen AI" />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <SettingsProvider initialTheme={theme}>
            <TooltipProvider>
              <Toaster />
              <Sonner position="top-right" className="toaster-container" />
              <div className="min-h-screen w-full">
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/auth" element={<AuthPage />} />
                  <Route
                    path="/app/*"
                    element={
                      <AuthGuard>
                        <Index />
                      </AuthGuard>
                    }
                  />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
            </TooltipProvider>
          </SettingsProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
