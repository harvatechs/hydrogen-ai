
import React from 'react';
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface ChatSkeletonProps {
  lines?: number;
  className?: string;
}

export function ChatSkeleton({ lines = 3, className }: ChatSkeletonProps) {
  const randomWidth = () => {
    const widths = ['60%', '75%', '85%', '70%', '80%', '90%', '65%'];
    return widths[Math.floor(Math.random() * widths.length)];
  };
  
  return (
    <div className={cn("space-y-2 animated-skeleton", className)}>
      {Array(lines).fill(0).map((_, i) => (
        <div key={i} className="flex flex-col gap-1">
          <Skeleton 
            className={cn(
              "h-4 rounded bg-gradient-to-r from-muted/60 via-muted/80 to-muted/60 background-animate", 
              i === 0 ? "w-3/4" : `w-[${randomWidth()}]`
            )} 
          />
          {i === lines - 1 && <div className="typing-indicator flex gap-1 mt-3">
            <div className="dot-pulse"></div>
          </div>}
        </div>
      ))}
    </div>
  );
}

export function CodeBlockSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-md border border-border p-4 my-3", className)}>
      <div className="flex items-center justify-between mb-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-16" />
      </div>
      <div className="space-y-2">
        {Array(8).fill(0).map((_, i) => (
          <Skeleton 
            key={i} 
            className={cn(
              "h-4 bg-gradient-to-r from-muted/60 via-muted/80 to-muted/60 background-animate", 
              i % 3 === 0 ? "w-full" : i % 3 === 1 ? "w-3/4" : "w-1/2"
            )} 
          />
        ))}
      </div>
    </div>
  );
}
