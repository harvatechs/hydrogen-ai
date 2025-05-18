
import { useState, useEffect } from 'react';
import { useSettings } from '@/context/SettingsContext';
import { toast } from "@/components/ui/use-toast";

export const MODEL_OPTIONS = [
  { value: "gemini-2.0-flash", label: "Gemini 2.0 Flash" },
  { value: "gemini-2.0-pro", label: "Gemini 2.0 Pro" },
  { value: "gemini-1.5-flash", label: "Gemini 1.5 Flash" },
  { value: "gemini-1.5-pro", label: "Gemini 1.5 Pro" }
];

export function useSettings() {
  const { theme, setTheme, fontSize, setFontSize } = useSettings();

  // State for form values
  const [apiKey, setApiKey] = useState<string>('');
  const [apiURL, setApiURL] = useState<string>('');
  const [selectedTheme, setSelectedTheme] = useState<'dark' | 'light' | 'system'>(theme as any);
  const [selectedFontSize, setSelectedFontSize] = useState<'small' | 'medium' | 'large'>(fontSize as any);
  const [model, setModel] = useState<string>('');
  const [maxTokens, setMaxTokens] = useState<number>(800);
  const [temperature, setTemperature] = useState<number>(0.7);
  const [topP, setTopP] = useState<number>(0.9);
  const [showLoadingMessage, setShowLoadingMessage] = useState<boolean>(true);
  const [showDetailedResponse, setShowDetailedResponse] = useState<boolean>(true);
  const [autocompleteEnabled, setAutocompleteEnabled] = useState<boolean>(true);
  const [themeColors, setThemeColors] = useState<{ 
    primary: string; 
    secondary: string;
    accent: string;
  }>({
    primary: '',
    secondary: '',
    accent: ''
  });

  // Load settings on component mount
  useEffect(() => {
    const loadSettings = () => {
      // API settings
      const savedApiKey = localStorage.getItem('api-key') || '';
      const savedApiURL = localStorage.getItem('api-url') || '';
      setApiKey(savedApiKey);
      setApiURL(savedApiURL);

      // Model settings
      const savedModel = localStorage.getItem('model') || MODEL_OPTIONS[0].value;
      const savedMaxTokens = Number(localStorage.getItem('max-tokens') || '800');
      const savedTemperature = Number(localStorage.getItem('temperature') || '0.7');
      const savedTopP = Number(localStorage.getItem('top-p') || '0.9');
      setModel(savedModel);
      setMaxTokens(savedMaxTokens);
      setTemperature(savedTemperature);
      setTopP(savedTopP);

      // UI settings
      const savedShowLoadingMessage = localStorage.getItem('show-loading-message') !== 'false';
      const savedShowDetailedResponse = localStorage.getItem('show-detailed-response') !== 'false';
      const savedAutocompleteEnabled = localStorage.getItem('autocomplete-enabled') !== 'false';
      setShowLoadingMessage(savedShowLoadingMessage);
      setShowDetailedResponse(savedShowDetailedResponse);
      setAutocompleteEnabled(savedAutocompleteEnabled);

      // Theme colors
      const savedThemeColors = {
        primary: localStorage.getItem('theme-color-primary') || '',
        secondary: localStorage.getItem('theme-color-secondary') || '',
        accent: localStorage.getItem('theme-color-accent') || ''
      };
      setThemeColors(savedThemeColors);
    };

    loadSettings();
  }, []);

  // Save all settings
  const saveSettings = (onClose: () => void) => {
    try {
      // API settings
      localStorage.setItem('api-key', apiKey);
      localStorage.setItem('api-url', apiURL);

      // UI settings
      setTheme(selectedTheme);
      setFontSize(selectedFontSize);
      localStorage.setItem('show-loading-message', String(showLoadingMessage));
      localStorage.setItem('show-detailed-response', String(showDetailedResponse));
      localStorage.setItem('autocomplete-enabled', String(autocompleteEnabled));
      
      // Model settings
      localStorage.setItem('model', model);
      localStorage.setItem('max-tokens', String(maxTokens));
      localStorage.setItem('temperature', String(temperature));
      localStorage.setItem('top-p', String(topP));

      // Theme colors (if provided)
      if (themeColors.primary) {
        localStorage.setItem('theme-color-primary', themeColors.primary);
        document.documentElement.style.setProperty('--primary', themeColors.primary);
      }
      if (themeColors.secondary) {
        localStorage.setItem('theme-color-secondary', themeColors.secondary);
        document.documentElement.style.setProperty('--secondary', themeColors.secondary);
      }
      if (themeColors.accent) {
        localStorage.setItem('theme-color-accent', themeColors.accent);
        document.documentElement.style.setProperty('--accent', themeColors.accent);
      }

      toast({
        title: 'Settings saved',
        description: 'Your settings have been saved successfully.',
      });
      
      onClose();
    } catch (error) {
      toast({
        title: 'Error saving settings',
        description: 'There was an error saving your settings. Please try again.',
        variant: 'destructive',
      });
      console.error('Error saving settings:', error);
    }
  };

  // Reset to defaults
  const resetToDefaults = () => {
    try {
      // Confirm before resetting
      if (!window.confirm('Are you sure you want to reset all settings to defaults?')) {
        return;
      }

      // API settings
      setApiKey('');
      setApiURL('');
      localStorage.removeItem('api-key');
      localStorage.removeItem('api-url');

      // UI settings
      setSelectedTheme('dark');
      setSelectedFontSize('medium');
      setTheme('dark');
      setFontSize('medium');
      setShowLoadingMessage(true);
      setShowDetailedResponse(true);
      setAutocompleteEnabled(true);
      localStorage.setItem('show-loading-message', 'true');
      localStorage.setItem('show-detailed-response', 'true');
      localStorage.setItem('autocomplete-enabled', 'true');

      // Model settings
      setModel(MODEL_OPTIONS[0].value);
      setMaxTokens(800);
      setTemperature(0.7);
      setTopP(0.9);
      localStorage.setItem('model', MODEL_OPTIONS[0].value);
      localStorage.setItem('max-tokens', '800');
      localStorage.setItem('temperature', '0.7');
      localStorage.setItem('top-p', '0.9');

      // Theme colors
      setThemeColors({ primary: '', secondary: '', accent: '' });
      localStorage.removeItem('theme-color-primary');
      localStorage.removeItem('theme-color-secondary');
      localStorage.removeItem('theme-color-accent');
      document.documentElement.style.removeProperty('--primary');
      document.documentElement.style.removeProperty('--secondary');
      document.documentElement.style.removeProperty('--accent');

      toast({
        title: 'Settings reset',
        description: 'Your settings have been reset to defaults.',
      });
    } catch (error) {
      toast({
        title: 'Error resetting settings',
        description: 'There was an error resetting your settings. Please try again.',
        variant: 'destructive',
      });
      console.error('Error resetting settings:', error);
    }
  };

  return {
    apiKey, setApiKey,
    apiURL, setApiURL,
    selectedTheme, setSelectedTheme,
    selectedFontSize, setSelectedFontSize,
    model, setModel,
    maxTokens, setMaxTokens,
    temperature, setTemperature,
    topP, setTopP,
    showLoadingMessage, setShowLoadingMessage,
    showDetailedResponse, setShowDetailedResponse,
    autocompleteEnabled, setAutocompleteEnabled,
    themeColors, setThemeColors,
    saveSettings,
    resetToDefaults
  };
}
