
import React from 'react';
import { Bot } from 'lucide-react';
import { Label } from "@/components/ui/label";
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSettingsForm, MODEL_OPTIONS } from '../hooks/useSettingsForm';

export const ModelTab = {
  Icon: () => <Bot className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />,
  Content: () => {
    const {
      model,
      setModel, 
      maxTokens,
      setMaxTokens,
      temperature,
      setTemperature,
      topP,
      setTopP
    } = useSettingsForm();

    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-base sm:text-lg font-medium">Model Settings</h3>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Configure AI model parameters for optimal performance
          </p>
        </div>
        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="model-select">Model</Label>
            <Select
              value={model}
              onValueChange={setModel}
            >
              <SelectTrigger id="model-select" className="w-full h-10">
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent>
                {MODEL_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="max-tokens">Max Tokens</Label>
              <span className="text-xs sm:text-sm text-muted-foreground">{maxTokens}</span>
            </div>
            <Slider
              id="max-tokens"
              min={100}
              max={4000}
              step={100}
              value={[maxTokens]}
              onValueChange={(value) => setMaxTokens(value[0])}
              className="w-full py-2"
            />
            <p className="text-xs text-muted-foreground">
              Controls the maximum length of the model's response
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="temperature">Temperature</Label>
                <span className="text-xs sm:text-sm text-muted-foreground">{temperature.toFixed(1)}</span>
              </div>
              <Slider
                id="temperature"
                min={0}
                max={2}
                step={0.1}
                value={[temperature]}
                onValueChange={(value) => setTemperature(value[0])}
                className="w-full py-2"
              />
              <p className="text-xs text-muted-foreground">
                Higher values make output more random, lower values more deterministic
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="top-p">Top P</Label>
                <span className="text-xs sm:text-sm text-muted-foreground">{topP.toFixed(1)}</span>
              </div>
              <Slider
                id="top-p"
                min={0.1}
                max={1}
                step={0.1}
                value={[topP]}
                onValueChange={(value) => setTopP(value[0])}
                className="w-full py-2"
              />
              <p className="text-xs text-muted-foreground">
                Controls diversity via nucleus sampling
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
};
