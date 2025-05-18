
import React from 'react';
import { Save } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { AppearanceTab } from './tabs/AppearanceTab';
import { ApiTab } from './tabs/ApiTab';
import { ModelTab } from './tabs/ModelTab';
import { AdvancedTab } from './tabs/AdvancedTab';
import { useSettings } from './hooks/useSettingsForm';

export interface SettingsTabsProps {
  onClose: () => void;
}

export function SettingsTabs({ onClose }: SettingsTabsProps) {
  const { saveSettings } = useSettings();
  
  return (
    <>
      <Tabs defaultValue="appearance" className="w-full">
        <div className="px-3 sm:px-6 sticky top-[72px] z-10 bg-background/95 backdrop-blur-sm py-2">
          <TabsList className="w-full grid grid-cols-2 sm:grid-cols-4 mb-4 gap-1 sm:gap-0">
            <TabsTrigger value="appearance" className="text-xs sm:text-sm py-2">
              <AppearanceTab.Icon />
              <span className="hidden xs:inline">Appearance</span>
              <span className="xs:hidden">Look</span>
            </TabsTrigger>
            <TabsTrigger value="api" className="text-xs sm:text-sm py-2">
              <ApiTab.Icon />
              <span>API</span>
            </TabsTrigger>
            <TabsTrigger value="model" className="text-xs sm:text-sm py-2">
              <ModelTab.Icon />
              <span>Model</span>
            </TabsTrigger>
            <TabsTrigger value="advanced" className="text-xs sm:text-sm py-2">
              <AdvancedTab.Icon />
              <span className="hidden xs:inline">Advanced</span>
              <span className="xs:hidden">More</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="appearance" className="space-y-4 px-3 sm:px-6 pt-2 pb-20 sm:pb-6">
          <AppearanceTab.Content />
        </TabsContent>

        <TabsContent value="api" className="space-y-4 px-3 sm:px-6 pt-2 pb-20 sm:pb-6">
          <ApiTab.Content />
        </TabsContent>

        <TabsContent value="model" className="space-y-4 px-3 sm:px-6 pt-2 pb-20 sm:pb-6">
          <ModelTab.Content />
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4 px-3 sm:px-6 pt-2 pb-20 sm:pb-6">
          <AdvancedTab.Content />
        </TabsContent>
      </Tabs>
      
      <div className="px-3 sm:px-6 py-4 flex justify-between gap-3 sticky bottom-0 bg-background/95 backdrop-blur-sm border-t mt-4">
        <Button variant="outline" onClick={onClose} className="flex-1 h-10">
          Cancel
        </Button>
        <Button onClick={() => saveSettings(onClose)} className="flex-1 h-10">
          <Save className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2" />
          Save Settings
        </Button>
      </div>
    </>
  );
}
