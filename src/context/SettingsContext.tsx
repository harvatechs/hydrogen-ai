
import React, { createContext, useContext, useState, useEffect } from 'react';

// Types
type ThemeType = 'dark' | 'light' | 'system';
type FontSizeType = 'small' | 'medium' | 'large';

interface SettingsContextType {
  theme: ThemeType;
  fontSize: FontSizeType;
  setTheme: (theme: ThemeType) => void;
  setFontSize: (size: FontSizeType) => void;
}

interface SettingsProviderProps {
  children: React.ReactNode;
  initialTheme?: ThemeType;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ 
  children, 
  initialTheme 
}) => {
  // Get stored theme or use default/provided initialTheme
  const getStoredTheme = (): ThemeType => {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem('app-theme');
      if (saved === 'dark' || saved === 'light' || saved === 'system') {
        return saved;
      }
    }
    return initialTheme || 'dark';
  };

  // Get stored font size or use default
  const getStoredFontSize = (): FontSizeType => {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem('app-font-size');
      if (saved === 'small' || saved === 'medium' || saved === 'large') {
        return saved;
      }
    }
    return 'medium';
  };

  const [theme, setThemeState] = useState<ThemeType>(getStoredTheme());
  const [fontSize, setFontSizeState] = useState<FontSizeType>(getStoredFontSize());

  // Apply theme
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('app-theme', theme);
      }
      
      // Apply system preference if theme is 'system'
      if (theme === 'system') {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.classList.remove('dark', 'light');
        document.documentElement.classList.add(isDark ? 'dark' : 'light');
      } else {
        document.documentElement.classList.remove('dark', 'light');
        document.documentElement.classList.add(theme);
      }
    }
  }, [theme]);

  // Apply font size
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-font-size', fontSize);
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('app-font-size', fontSize);
      }
    }
  }, [fontSize]);

  const setTheme = (newTheme: ThemeType) => {
    setThemeState(newTheme);
  };

  const setFontSize = (newSize: FontSizeType) => {
    setFontSizeState(newSize);
  };

  return (
    <SettingsContext.Provider
      value={{
        theme,
        fontSize,
        setTheme,
        setFontSize,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
