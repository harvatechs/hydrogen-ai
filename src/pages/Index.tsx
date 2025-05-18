
import { useState } from "react";
import { ChatProvider, useChat } from "@/context/ChatContext";
import { ChatInput } from "@/components/ChatInput";
import { MainLayout } from "@/components/layout/MainLayout";
import { ChatArea } from "@/components/features/ChatArea";
import { ThemeHandler } from "@/components/theme/ThemeHandler";
import { EnhancedSettingsPanel } from "@/components/EnhancedSettingsPanel";
import ErrorBoundary from "@/components/ErrorBoundary";
import { notificationService } from "@/services/NotificationService";

const AppContent = () => {
  const {
    fontSize,
    activeAtom,
  } = useChat();
  
  const [showSettings, setShowSettings] = useState(false);
  
  // Welcome notification on first visit
  useState(() => {
    const hasShownWelcome = localStorage.getItem("hasShownWelcome");
    if (!hasShownWelcome) {
      setTimeout(() => {
        notificationService.info(
          "Welcome to HydroGen AI! Ask me anything or try one of the special features.",
          "Getting Started",
          'normal'
        );
        localStorage.setItem("hasShownWelcome", "true");
      }, 1500);
    }
  });
  
  return (
    <ThemeHandler>
      <ErrorBoundary>
        <MainLayout>
          <div className={`flex-1 relative overflow-hidden flex flex-col font-size-${fontSize}`}>
            <ChatArea />
            {showSettings && (
              <EnhancedSettingsPanel 
                onClose={() => setShowSettings(false)} 
                open={showSettings} 
              />
            )}
          </div>
        </MainLayout>
      </ErrorBoundary>
    </ThemeHandler>
  );
};

const Index = () => {
  return (
    <ChatProvider>
      <AppContent />
    </ChatProvider>
  );
};

export default Index;
