
import React from "react";
import { ChatSkeleton, CodeBlockSkeleton } from "./chat-skeleton";
import { Card } from "./card";
import { Avatar } from "./avatar";
import { cn } from "@/lib/utils";

interface MessageSkeletonProps {
  includeCodeBlock?: boolean;
  className?: string;
}

export function MessageSkeleton({ includeCodeBlock = true, className }: MessageSkeletonProps) {
  return (
    <div className={cn("flex items-start gap-4 py-4 animate-fade-in", className)}>
      <Avatar className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold">
        H
      </Avatar>
      <div className="flex-1 space-y-2 overflow-hidden">
        <Card className="p-4 bg-muted/20">
          <ChatSkeleton lines={3} />
          {includeCodeBlock && (
            <CodeBlockSkeleton className="my-3" />
          )}
          <ChatSkeleton lines={2} className="mt-3" />
        </Card>
      </div>
    </div>
  );
}
