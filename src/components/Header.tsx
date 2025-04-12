
import { Button } from "@/components/ui/button";
import { ApiKeyDialog } from "./ApiKeyDialog";
import { PanelLeft, History, ChevronDown } from "lucide-react";
import { useChat } from "@/context/ChatContext";
import { toast } from "@/components/ui/use-toast";
import { useSidebar } from "@/components/ui/sidebar";

export function Header() {
  const { clearMessages } = useChat();
  const { toggleSidebar } = useSidebar();
  
  return (
    <header className="border-b border-white/10 p-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 md:hidden text-muted-foreground"
          onClick={toggleSidebar}
        >
          <PanelLeft className="h-5 w-5" />
        </Button>
        <Button 
          variant="ghost" 
          className="font-semibold text-white flex items-center gap-1 hover:bg-secondary"
        >
          HydroGen <ChevronDown className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          className="text-xs h-8 border-white/10 bg-transparent text-muted-foreground hover:bg-secondary hover:text-white"
        >
          <History className="h-4 w-4 mr-2" />
          Temporary
        </Button>
        <ApiKeyDialog />
      </div>
    </header>
  );
}
