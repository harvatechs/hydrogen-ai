
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => {
  // Fix scrolling issues
  useEffect(() => {
    // We don't want to set overflow:hidden on the root elements
    // because it breaks scrolling in scroll areas.
    
    // Make sure we have proper body styling but allow scrolling within components
    document.body.style.height = '100%';
    document.body.style.overflow = 'auto';
    document.documentElement.style.height = '100%';
    
    // Add smooth scrolling to the entire document
    document.documentElement.style.scrollBehavior = 'smooth';
    
    return () => {
      document.body.style.height = '';
      document.body.style.overflow = '';
      document.documentElement.style.height = '';
      document.documentElement.style.scrollBehavior = '';
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner position="top-right" className="toaster-container" />
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
