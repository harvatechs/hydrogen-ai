
import { ChatProvider } from "@/context/ChatContext";
import { Header } from "@/components/Header";
import { ChatHistory } from "@/components/ChatHistory";
import { ChatInput } from "@/components/ChatInput";
import { Sidebar } from "@/components/Sidebar";
import { SidebarProvider, Sidebar as ShadcnSidebar, SidebarContent, SidebarInset } from "@/components/ui/sidebar";

const Index = () => {
  return (
    <ChatProvider>
      <SidebarProvider>
        <div className="flex w-full h-screen bg-background text-foreground">
          <ShadcnSidebar className="hidden md:flex">
            <SidebarContent>
              <Sidebar />
            </SidebarContent>
          </ShadcnSidebar>
          
          <SidebarInset className="flex flex-col h-screen bg-background">
            <Header />
            
            <div className="flex-1 overflow-hidden">
              <ChatHistory />
            </div>
            
            <div className="p-4 md:px-8 md:pb-8">
              <ChatInput />
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </ChatProvider>
  );
};

export default Index;
