
import React from 'react';
import { X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { SettingsTabs } from './SettingsTabs';

export interface SettingsDialogProps {
  onClose: () => void;
  open: boolean;
}

export function SettingsDialog({ onClose, open }: SettingsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-full w-full h-full sm:h-auto sm:max-w-4xl sm:max-h-[90vh] p-0 overflow-auto border-0 sm:border-2 rounded-none sm:rounded-lg">
        <DialogHeader className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm p-4 pb-2">
          <DialogTitle className="text-xl sm:text-2xl font-bold">Settings</DialogTitle>
          <DialogDescription className="text-sm">Customize your HydroGen experience</DialogDescription>
          <Button variant="ghost" size="icon" onClick={onClose} className="absolute right-4 top-4 h-9 w-9">
            <X className="h-5 w-5" />
          </Button>
        </DialogHeader>
        
        <SettingsTabs onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
}
