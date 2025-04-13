import { Button } from "@/components/ui/button";
import { ApiKeyDialog } from "./ApiKeyDialog";
import { PanelLeft, History, ChevronDown, Sparkles } from "lucide-react";
import { useChat } from "@/context/ChatContext";
import { toast } from "@/components/ui/use-toast";
import { useSidebar } from "@/components/ui/sidebar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
export function Header() {
  const {
    clearMessages,
    theme,
    model
  } = useChat();
  const {
    toggleSidebar
  } = useSidebar();

  // Get model display name
  const getModelDisplayName = () => {
    switch (model) {
      case "gemini-2.0-pro":
        return "Gemini 2.0 Pro";
      case "gemini-2.0-flash":
        return "Gemini 2.0 Flash";
      case "gemini-1.5-pro":
        return "Gemini 1.5 Pro";
      case "gemini-1.5-flash":
        return "Gemini 1.5 Flash";
      default:
        return "Gemini";
    }
  };
  return <header className="border-b border-white/10 p-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="h-8 w-8 md:hidden text-muted-foreground" onClick={toggleSidebar}>
          <PanelLeft className="h-5 w-5" />
        </Button>
        <Button variant="ghost" className="font-semibold flex items-center gap-1 bg-transparent text-white">
          HydroGen <ChevronDown className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex items-center gap-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="text-xs h-8 border-white/10 bg-transparent text-muted-foreground hover:bg-secondary hover:text-white">
              <Sparkles className="h-4 w-4 mr-2" />
              {getModelDisplayName()}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Model Selection</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Gemini 2.0 Flash</DropdownMenuItem>
            <DropdownMenuItem>Gemini 2.0 Pro</DropdownMenuItem>
            <DropdownMenuItem>Gemini 1.5 Flash</DropdownMenuItem>
            <DropdownMenuItem>Gemini 1.5 Pro</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <ApiKeyDialog />
      </div>
    </header>;
}