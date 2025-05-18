
import React from 'react';
import { Palette, Sun, Moon, Monitor } from 'lucide-react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useSettings } from '../hooks/useSettingsForm';

export const AppearanceTab = {
  Icon: () => <Palette className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />,
  Content: () => {
    const {
      selectedTheme, 
      setSelectedTheme,
      selectedFontSize, 
      setSelectedFontSize,
      themeColors,
      setThemeColors
    } = useSettings();

    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-base sm:text-lg font-medium">Theme</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div
              className={`flex flex-row sm:flex-col items-center gap-3 sm:gap-2 rounded-lg border p-3 sm:p-4 cursor-pointer hover:bg-accent/50 ${
                selectedTheme === 'light' ? 'border-primary bg-accent/20' : ''
              }`}
              onClick={() => setSelectedTheme('light')}
            >
              <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-md bg-white dark:bg-gray-200 flex items-center justify-center">
                <Sun className="h-5 w-5 sm:h-6 sm:w-6 text-black" />
              </div>
              <span>Light</span>
            </div>
            <div
              className={`flex flex-row sm:flex-col items-center gap-3 sm:gap-2 rounded-lg border p-3 sm:p-4 cursor-pointer hover:bg-accent/50 ${
                selectedTheme === 'dark' ? 'border-primary bg-accent/20' : ''
              }`}
              onClick={() => setSelectedTheme('dark')}
            >
              <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-md bg-gray-900 flex items-center justify-center">
                <Moon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <span>Dark</span>
            </div>
            <div
              className={`flex flex-row sm:flex-col items-center gap-3 sm:gap-2 rounded-lg border p-3 sm:p-4 cursor-pointer hover:bg-accent/50 ${
                selectedTheme === 'system' ? 'border-primary bg-accent/20' : ''
              }`}
              onClick={() => setSelectedTheme('system')}
            >
              <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-md bg-gradient-to-tr from-gray-900 to-white flex items-center justify-center">
                <Monitor className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700" />
              </div>
              <span>System</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-base sm:text-lg font-medium">Font Size</h3>
          <div className="grid grid-cols-3 gap-2">
            <div
              className={`flex flex-col items-center gap-2 rounded-lg border p-3 sm:p-4 cursor-pointer hover:bg-accent/50 ${
                selectedFontSize === 'small' ? 'border-primary bg-accent/20' : ''
              }`}
              onClick={() => setSelectedFontSize('small')}
            >
              <div className="text-sm">Aa</div>
              <span>Small</span>
            </div>
            <div
              className={`flex flex-col items-center gap-2 rounded-lg border p-3 sm:p-4 cursor-pointer hover:bg-accent/50 ${
                selectedFontSize === 'medium' ? 'border-primary bg-accent/20' : ''
              }`}
              onClick={() => setSelectedFontSize('medium')}
            >
              <div className="text-base">Aa</div>
              <span>Medium</span>
            </div>
            <div
              className={`flex flex-col items-center gap-2 rounded-lg border p-3 sm:p-4 cursor-pointer hover:bg-accent/50 ${
                selectedFontSize === 'large' ? 'border-primary bg-accent/20' : ''
              }`}
              onClick={() => setSelectedFontSize('large')}
            >
              <div className="text-lg">Aa</div>
              <span>Large</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-base sm:text-lg font-medium">Custom Theme Colors</h3>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Customize application colors (optional). Use hex color codes (e.g., #FF5733).
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="primary-color">Primary Color</Label>
              <div className="flex space-x-2">
                <Input
                  id="primary-color"
                  placeholder="#6366f1"
                  value={themeColors.primary}
                  onChange={(e) => setThemeColors({...themeColors, primary: e.target.value})}
                  className="h-10"
                />
                <div 
                  className="w-10 h-10 rounded-md border"
                  style={{backgroundColor: themeColors.primary || 'var(--primary)'}}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="secondary-color">Secondary Color</Label>
              <div className="flex space-x-2">
                <Input
                  id="secondary-color"
                  placeholder="#f43f5e"
                  value={themeColors.secondary}
                  onChange={(e) => setThemeColors({...themeColors, secondary: e.target.value})}
                  className="h-10"
                />
                <div 
                  className="w-10 h-10 rounded-md border"
                  style={{backgroundColor: themeColors.secondary || 'var(--secondary)'}}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="accent-color">Accent Color</Label>
              <div className="flex space-x-2">
                <Input
                  id="accent-color"
                  placeholder="#22c55e"
                  value={themeColors.accent}
                  onChange={(e) => setThemeColors({...themeColors, accent: e.target.value})}
                  className="h-10"
                />
                <div 
                  className="w-10 h-10 rounded-md border"
                  style={{backgroundColor: themeColors.accent || 'var(--accent)'}}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};
