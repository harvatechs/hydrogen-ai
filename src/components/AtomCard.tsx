
import { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Lock } from 'lucide-react';

interface AtomCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  onClick: () => void;
  color?: string;
  disabled?: boolean;
}

export function AtomCard({ 
  title, 
  description, 
  icon, 
  onClick, 
  color = "bg-primary/10",
  disabled = false 
}: AtomCardProps) {
  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all duration-300 hover:shadow-md border-2 overflow-hidden group relative",
        disabled ? "opacity-70 cursor-not-allowed hover:shadow-none" : "hover:border-primary/50",
      )}
      onClick={disabled ? undefined : onClick}
    >
      <CardContent className="p-0">
        <div className="p-5 flex flex-col space-y-2">
          <div className={cn("h-10 w-10 rounded-full flex items-center justify-center mb-2", color)}>
            {icon}
          </div>
          <div className="flex items-center justify-between">
            <h3 className="font-medium">{title}</h3>
            {disabled && (
              <span className="text-muted-foreground">
                <Lock size={14} />
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{description}</p>
          {disabled && (
            <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="bg-background px-3 py-1 rounded-full text-xs font-medium">Coming Soon</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
