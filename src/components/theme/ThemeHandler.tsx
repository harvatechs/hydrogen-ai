
import React, { useEffect } from 'react';
import { useChat } from '@/context/ChatContext';

interface ThemeHandlerProps {
  children: React.ReactNode;
}

export const ThemeHandler: React.FC<ThemeHandlerProps> = ({
  children
}) => {
  const { theme } = useChat();
  
  useEffect(() => {
    try {
      const htmlElement = document.documentElement;
      htmlElement.classList.remove("light", "dark");
      if (theme === "system") {
        const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        htmlElement.classList.add(systemPrefersDark ? "dark" : "light");
      } else {
        htmlElement.classList.add(theme);
      }
    } catch (error) {
      console.error("Theme application error:", error);
      // Fallback to dark theme
      document.documentElement.classList.add("dark");
    }
  }, [theme]);
  
  return <>{children}</>;
};
