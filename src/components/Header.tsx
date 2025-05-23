
import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { ThemeToggle } from './theme/ThemeToggle';
import { MobileMenu } from './MobileMenu';
import { 
  BookOpenIcon, 
  HomeIcon, 
  LogOutIcon, 
  MessageCircleIcon, 
  Settings2Icon,
  ChevronDown,
  User
} from 'lucide-react';
import { useChat } from '@/context/ChatContext';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';

interface HeaderProps {
  onSettingsClick?: () => void;
}

export const Header = ({
  onSettingsClick
}: HeaderProps) => {
  const {
    user,
    signOut
  } = useAuth();
  
  const {
    activeAtom,
    setActiveAtom
  } = useChat();
  
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  // Detect scroll for shadow effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };
  
  const headerItems = [{
    id: 'chat',
    label: 'Chat',
    icon: MessageCircleIcon
  }, {
    id: 'search',
    label: 'Search Web',
    icon: HomeIcon
  }, {
    id: 'youtube',
    label: 'YouTube',
    icon: BookOpenIcon
  }];

  const modelOptions = [
    { id: 'lambda', name: 'HydroGen Lambda 2.0' },
    { id: 'atoms', name: 'HydroGen Atoms' },
    { id: 'molecule', name: 'HydroGen Molecule' },
    { id: 'compound', name: 'HydroGen Compound' }
  ];
  
  // Set default model
  const [currentModel, setCurrentModel] = useState(modelOptions[0]);

  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 font-medium">
              <span className="hidden sm:inline">HydroGen Beta</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-52 bg-popover">
            {modelOptions.map(model => (
              <DropdownMenuItem 
                key={model.id}
                onClick={() => setCurrentModel(model)}
                className={cn(
                  "cursor-pointer",
                  currentModel.id === model.id && "bg-accent text-accent-foreground"
                )}
              >
                {model.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="sm" 
          className="hidden md:flex items-center gap-1"
        >
          <MessageCircleIcon className="h-4 w-4" />
          <span>Chat</span>
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full h-9 w-9 border border-border/40"
            >
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52 bg-popover">
            {user && (
              <>
                <div className="px-2 py-1.5 text-sm font-semibold">
                  {user.email}
                </div>
                <DropdownMenuSeparator />
              </>
            )}
            <DropdownMenuItem onClick={onSettingsClick} className="cursor-pointer">
              <Settings2Icon className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive">
              <LogOutIcon className="mr-2 h-4 w-4" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <div className="md:hidden">
          <MobileMenu />
        </div>
      </div>
    </div>
  );
};
