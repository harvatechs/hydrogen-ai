
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface MobileMenuItem {
  label: string;
  icon: React.ElementType;
  action: () => void;
  active?: boolean;
  danger?: boolean;
}

interface MobileMenuProps {
  items: MobileMenuItem[];
  className?: string;
}

export function MobileMenu({ items, className }: MobileMenuProps) {
  return (
    <div className={className}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {items.map((item, i) => (
            <DropdownMenuItem
              key={i}
              className={cn(
                "cursor-pointer flex items-center gap-2 py-2",
                item.active && "bg-muted",
                item.danger && "text-destructive focus:text-destructive"
              )}
              onClick={item.action}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
