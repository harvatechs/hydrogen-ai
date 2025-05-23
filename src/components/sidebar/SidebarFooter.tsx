
import { Button } from "@/components/ui/button";
import { ArrowLeftRight, Trash2 } from "lucide-react";
import { useState } from "react";
import { useAuth } from '@/context/AuthContext';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface SidebarFooterProps {
  currentConversationId: string | null;
  clearConversation: (id: string) => void;
}

export const SidebarFooter = ({ 
  currentConversationId,
  clearConversation 
}: SidebarFooterProps) => {
  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const { user } = useAuth();

  const handleClearClick = () => {
    setClearDialogOpen(true);
  };

  const handleConfirmClear = () => {
    if (currentConversationId) {
      clearConversation(currentConversationId);
    }
    setClearDialogOpen(false);
  };

  return (
    <div className="p-2 border-t border-border">
      <div className="flex flex-col gap-2">
        {user && (
          <div className="flex items-center space-x-2 px-2 py-1.5">
            <div className="flex-1 truncate">
              <p className="text-xs text-muted-foreground truncate">Signed in as:</p>
              <p className="text-xs font-medium truncate">{user.email}</p>
            </div>
          </div>
        )}
        
        <AlertDialog open={clearDialogOpen} onOpenChange={setClearDialogOpen}>
          <AlertDialogTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full justify-start text-muted-foreground hover:text-destructive"
              onClick={handleClearClick}
              disabled={!currentConversationId}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Clear conversation</span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Clear conversation</AlertDialogTitle>
              <AlertDialogDescription>
                This will delete all messages in the current conversation.
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleConfirmClear}
                className="bg-destructive hover:bg-destructive/90"
              >
                Clear
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-muted-foreground"
        >
          <ArrowLeftRight className="mr-2 h-4 w-4" />
          <span>Switch model</span>
        </Button>
      </div>
    </div>
  );
};
