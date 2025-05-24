
import React, { useEffect, useState } from "react";
import { 
  SidebarProvider, 
  Sidebar as ShadcnSidebar, 
  SidebarContent, 
  SidebarTrigger,
  useSidebar
} from "@/components/ui/sidebar";
import { Sidebar } from "@/components/Sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Header } from "@/components/Header";
import { EnhancedSettingsPanel } from "@/components/EnhancedSettingsPanel";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  children: React.ReactNode;
}

// Hook to detect mobile devices
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkDevice();
    window.addEventListener('resize', checkDevice);
    
    return () => window.removeEventListener('resize', checkDevice);
  }, []);
  
  return isMobile;
};

// Create a component to handle sidebar state changes
const SidebarStateHandler = () => {
  const { state, open, setOpen } = useSidebar();
  const isMobile = useIsMobile();
  
  useEffect(() => {
    // Dispatch the event when sidebar state changes
    const event = new CustomEvent("sidebar-state-changed", { 
      detail: { open, state, isMobile }
    });
    window.dispatchEvent(event);
    
    // Function to handle viewport resize
    const handleResize = () => {
      const shouldBeOpen = window.innerWidth >= 768;
      if (shouldBeOpen !== open && !isMobile) {
        setOpen(shouldBeOpen);
      }
    };
    
    // Add event listener for window resize
    window.addEventListener('resize', handleResize);
    
    // Cleanup on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [open, state, setOpen, isMobile]);
  
  return null;
};

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();
  // Default to open on desktop, closed on mobile
  const defaultOpen = !isMobile;
  const [showSettings, setShowSettings] = useState(false);

  const handleSettingsClick = () => {
    setShowSettings(!showSettings);
  };

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <SidebarStateHandler />
      <div className={cn(
        "flex w-full h-screen overflow-hidden",
        "dark:bg-gradient-to-br dark:from-black dark:via-black dark:to-black/95",
        "light:bg-gradient-to-br light:from-white light:via-white/95 light:to-white/90",
        isMobile && "mobile-layout"
      )}>
        
        {/* Mobile sidebar overlay */}
        {isMobile && (
          <div className="sidebar-overlay" />
        )}
        
        {/* Sidebar - responsive behavior */}
        <ShadcnSidebar 
          className={cn(
            "z-30 transition-all duration-300",
            isMobile ? "sidebar-mobile" : "sidebar-desktop"
          )}
          style={{
            width: isMobile ? 'var(--sidebar-width-mobile)' : 'var(--sidebar-width)'
          }}
        >
          <SidebarContent className="h-full">
            <Sidebar />
          </SidebarContent>
        </ShadcnSidebar>
        
        {/* Main Content */}
        <div className={cn(
          "flex flex-col h-screen relative w-full min-w-0",
          "transition-all duration-300"
        )}>
          {/* Header with responsive design */}
          <div className={cn(
            "flex items-center border-b z-20 bg-background/95 backdrop-blur-md",
            "border-b-white/10 light:border-b-black/10",
            isMobile ? "h-14 px-4" : "h-16 px-6",
            "safe-top"
          )}>
            <SidebarTrigger 
              className={cn(
                "touch-target",
                "dark:text-white light:text-black", 
                "dark:hover:bg-white/10 light:hover:bg-black/10",
                isMobile ? "mr-3" : "mr-4"
              )} 
            />
            <Header onSettingsClick={handleSettingsClick} />
          </div>
          
          {/* Background decorations */}
          <div className="absolute inset-0 pointer-events-none top-14 md:top-16">
            <div className="absolute bottom-0 left-0 w-full h-1/2 dark:bg-gradient-to-t dark:from-black/30 dark:to-transparent light:bg-gradient-to-t light:from-white/30 light:to-transparent opacity-30"></div>
            <div className="absolute top-0 right-0 w-1/3 h-1/3 dark:bg-black/20 light:bg-white/20 rounded-full blur-3xl"></div>
          </div>
          
          {/* Main content area */}
          <div className="flex-1 relative overflow-hidden flex flex-col">
            <ScrollArea className={cn(
              "flex-1 flex flex-col mobile-scroll",
              isMobile ? "h-[calc(100vh-56px-env(safe-area-inset-top)-env(safe-area-inset-bottom))]" : "h-[calc(100vh-64px)]"
            )}>
              <div className={cn(
                "flex-1 flex flex-col",
                isMobile ? "pb-safe-bottom" : "pb-32"
              )}>
                {children}
              </div>
            </ScrollArea>
          </div>

          {/* Settings panel */}
          {showSettings && (
            <EnhancedSettingsPanel 
              onClose={() => setShowSettings(false)} 
              open={showSettings} 
            />
          )}
        </div>
      </div>
    </SidebarProvider>
  );
};
