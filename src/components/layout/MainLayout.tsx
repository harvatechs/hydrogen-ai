
import React, { useEffect } from "react";
import { 
  SidebarProvider, 
  Sidebar as ShadcnSidebar, 
  SidebarContent, 
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Sidebar } from "@/components/Sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Header } from "@/components/Header";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  // Function to dispatch an event when sidebar state changes
  const handleSidebarStateChange = (open: boolean) => {
    const event = new CustomEvent("sidebar-state-changed", { 
      detail: { open }
    });
    window.dispatchEvent(event);
  };
  
  useEffect(() => {
    // Initial state based on viewport width
    const isInitiallyOpen = window.innerWidth >= 768;
    handleSidebarStateChange(isInitiallyOpen);
    
    // Function to handle viewport resize
    const handleResize = () => {
      const shouldBeOpen = window.innerWidth >= 768;
      handleSidebarStateChange(shouldBeOpen);
    };
    
    // Add event listener for window resize
    window.addEventListener('resize', handleResize);
    
    // Cleanup on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <SidebarProvider 
      defaultOpen={window.innerWidth >= 768}
      onOpenChange={handleSidebarStateChange}
    >
      <div className="flex w-full h-screen overflow-hidden 
        dark:bg-gradient-to-br dark:from-black dark:via-black dark:to-black/95 
        light:bg-gradient-to-br light:from-white light:via-white/95 light:to-white/90">
        
        {/* Properly integrate the UI sidebar with our custom Sidebar component */}
        <ShadcnSidebar className="z-30">
          <SidebarContent>
            <Sidebar collapsed={false} />
          </SidebarContent>
        </ShadcnSidebar>
        
        {/* Main Content */}
        <div className="flex flex-col h-screen relative w-full">
          {/* Header with Sidebar Toggle */}
          <div className="flex items-center border-b border-b-white/10 light:border-b-black/10 h-14 px-4 z-20">
            <SidebarTrigger className="mr-2 dark:text-white light:text-black dark:hover:bg-white/10 light:hover:bg-black/10" />
            <Header onOpenSettings={() => {}} />
          </div>
          
          <div className="absolute inset-0 pointer-events-none top-14">
            <div className="absolute bottom-0 left-0 w-full h-1/2 dark:bg-gradient-to-t dark:from-black/30 dark:to-transparent light:bg-gradient-to-t light:from-white/30 light:to-transparent opacity-30"></div>
            <div className="absolute top-0 right-0 w-1/3 h-1/3 dark:bg-black/20 light:bg-white/20 rounded-full blur-3xl"></div>
          </div>
          
          <div className="flex-1 relative overflow-hidden flex flex-col">
            <ScrollArea className="h-[calc(100vh-130px)] flex-1 flex flex-col pb-32">
              <div className="flex-1 flex flex-col">
                {children}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};
