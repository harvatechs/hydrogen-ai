
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

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

// Get stored theme or use default
const getStoredTheme = (): ThemeType => {
  const saved = localStorage.getItem('app-theme');
  if (saved === 'dark' || saved === 'light' || saved === 'system') {
    return saved;
  }
  return 'dark';
};

// Get stored font size or use default
const getStoredFontSize = (): FontSizeType => {
  const saved = localStorage.getItem('app-font-size');
  if (saved === 'small' || saved === 'medium' || saved === 'large') {
    return saved;
  }
  return 'medium';
};

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeType>(getStoredTheme());
  const [fontSize, setFontSizeState] = useState<FontSizeType>(getStoredFontSize());

  // Apply theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('app-theme', theme);
    
    // Apply system preference if theme is 'system'
    if (theme === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.remove('dark', 'light');
      document.documentElement.classList.add(isDark ? 'dark' : 'light');
    } else {
      document.documentElement.classList.remove('dark', 'light');
      document.documentElement.classList.add(theme);
    }
  }, [theme]);

  // Apply font size
  useEffect(() => {
    document.documentElement.setAttribute('data-font-size', fontSize);
    localStorage.setItem('app-font-size', fontSize);
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
