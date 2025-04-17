
import React, {
  createContext,
  useState,
  useContext,
  useEffect
} from "react";
import { ApiConfig } from "@/types/message";

interface SettingsContextProps {
  fontSize: string;
  setFontSize: (size: string) => void;
  theme: string;
  setTheme: (theme: string) => void;
  apiKey: string;
  setApiKey: (key: string) => void;
  apiUrl: string;
  setApiUrl: (url: string) => void;
  model: string;
  setModel: (model: string) => void;
}

const SettingsContext = createContext<SettingsContextProps | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [fontSize, setFontSize] = useState<string>(() => 
    localStorage.getItem("fontSize") || "medium"
  );
  const [theme, setTheme] = useState<string>(() => 
    localStorage.getItem("theme") || "dark"
  );
  const [apiKey, setApiKey] = useState<string>(() => 
    localStorage.getItem("apiKey") || ""
  );
  const [apiUrl, setApiUrl] = useState<string>(() => 
    localStorage.getItem("apiUrl") || "https://api.openai.com/v1/chat/completions"
  );
  const [model, setModel] = useState<string>(() => 
    localStorage.getItem("model") || "gpt-3.5-turbo"
  );

  // Persist settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem("fontSize", fontSize);
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.className = theme;
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("apiKey", apiKey);
  }, [apiKey]);

  useEffect(() => {
    localStorage.setItem("apiUrl", apiUrl);
  }, [apiUrl]);

  useEffect(() => {
    localStorage.setItem("model", model);
  }, [model]);

  const value = {
    fontSize,
    setFontSize,
    theme,
    setTheme,
    apiKey,
    setApiKey,
    apiUrl,
    setApiUrl,
    model,
    setModel
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};
