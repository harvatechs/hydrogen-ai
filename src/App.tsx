
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";

// Ensure the uuid package is installed
// <lov-add-dependency>uuid@11.1.0</lov-add-dependency>

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => {
  // Fix body height issue that prevents scrolling
  useEffect(() => {
    // This ensures the body takes full height and allows scrolling where needed
    document.body.style.height = '100%';
    document.body.style.overflowX = 'hidden';
    document.documentElement.style.height = '100%';
    
    // Cleanup function
    return () => {
      document.body.style.height = '';
      document.body.style.overflowX = '';
      document.documentElement.style.height = '';
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen w-full">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/app" element={<Index />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
