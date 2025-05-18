
import { toast } from "@/components/ui/use-toast";
import { toast as sonnerToast } from "sonner";

type NotificationType = 'success' | 'error' | 'warning' | 'info';
type NotificationDuration = 'short' | 'normal' | 'long' | 'persistent';

interface NotificationOptions {
  title?: string;
  description: string;
  type?: NotificationType;
  duration?: NotificationDuration | number;
  action?: {
    label: string;
    onClick: () => void;
  };
  useStack?: boolean;
}

class NotificationService {
  private getDuration(duration: NotificationDuration | number): number {
    if (typeof duration === 'number') return duration;
    
    switch (duration) {
      case 'short': return 3000;
      case 'normal': return 5000;
      case 'long': return 8000;
      case 'persistent': return Infinity;
      default: return 5000;
    }
  }
  
  show({
    title,
    description,
    type = 'info',
    duration = 'normal',
    action,
    useStack = false
  }: NotificationOptions): void {
    const durationMs = this.getDuration(duration);
    
    // Use Sonner for stacked notifications
    if (useStack) {
      if (type === 'success') {
        sonnerToast.success(title || 'Success', {
          description,
          duration: durationMs,
          action: action ? { 
            label: action.label,
            onClick: action.onClick
          } : undefined
        });
      } else if (type === 'error') {
        sonnerToast.error(title || 'Error', {
          description,
          duration: durationMs,
          action: action ? { 
            label: action.label,
            onClick: action.onClick
          } : undefined
        });
      } else if (type === 'warning') {
        sonnerToast.warning(title || 'Warning', {
          description,
          duration: durationMs,
          action: action ? { 
            label: action.label,
            onClick: action.onClick
          } : undefined
        });
      } else {
        sonnerToast.info(title || 'Information', {
          description,
          duration: durationMs,
          action: action ? { 
            label: action.label,
            onClick: action.onClick
          } : undefined
        });
      }
      return;
    }
    
    // Use Shadcn/UI toast for non-stacked notifications
    toast({
      title: title || this.getTitleFromType(type),
      description,
      duration: durationMs === Infinity ? undefined : durationMs,
      variant: type === 'info' ? 'default' : type === 'success' ? 'default' : type
    });
  }
  
  private getTitleFromType(type: NotificationType): string {
    switch (type) {
      case 'success': return 'Success';
      case 'error': return 'Error';
      case 'warning': return 'Warning';
      case 'info': return 'Information';
    }
  }
  
  success(description: string, title?: string, duration: NotificationDuration = 'normal'): void {
    this.show({
      title,
      description,
      type: 'success',
      duration,
      useStack: true
    });
  }
  
  error(description: string, title?: string, duration: NotificationDuration = 'normal'): void {
    this.show({
      title,
      description,
      type: 'error',
      duration,
      useStack: true
    });
  }
  
  warning(description: string, title?: string, duration: NotificationDuration = 'normal'): void {
    this.show({
      title,
      description,
      type: 'warning',
      duration,
      useStack: true
    });
  }
  
  info(description: string, title?: string, duration: NotificationDuration = 'normal'): void {
    this.show({
      title,
      description,
      type: 'info',
      duration,
      useStack: true
    });
  }
}

export const notificationService = new NotificationService();
