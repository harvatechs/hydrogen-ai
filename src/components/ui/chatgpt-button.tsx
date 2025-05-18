
import React from "react";
import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

const chatGptButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-gray-800/80 hover:bg-gray-700/80 text-gray-100 border border-gray-700/60",
        primary:
          "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md",
        secondary:
          "bg-gray-800/60 hover:bg-gray-700/60 text-gray-200 border border-gray-700/40",
        ghost: "hover:bg-gray-800/60 hover:text-gray-100 text-gray-300",
        link: "text-primary underline-offset-4 hover:underline",
        destructive:
          "bg-red-600/80 hover:bg-red-700/80 text-white",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3 py-1 text-xs",
        lg: "h-12 px-6 py-3 text-base",
        icon: "h-10 w-10 p-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ChatGptButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof chatGptButtonVariants> {
  asChild?: boolean;
}

const ChatGptButton = React.forwardRef<HTMLButtonElement, ChatGptButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(chatGptButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

ChatGptButton.displayName = "ChatGptButton";

export { ChatGptButton, chatGptButtonVariants };
