
import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { MobileMenu } from './MobileMenu';
import { BookOpenIcon, HomeIcon, LogOutIcon, MessageCircleIcon, Settings2Icon, ChevronDown, User } from 'lucide-react';
import { useChat } from '@/context/ChatContext';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';

interface HeaderProps {
  onSettingsClick?: () => void;
}

export const Header = ({ onSettingsClick }: HeaderProps) => {
  const { user, signOut } = useAuth();
  const { activeAtom, setActiveAtom } = useChat();
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

  const modelOptions = [
    { id: 'lambda', name: 'HydroGen Lambda 2.0' },
    { id: 'atoms', name: 'HydroGen Atoms' },
    { id: 'molecule', name: 'HydroGen Molecule' },
    { id: 'compound', name: 'HydroGen Compound' }
  ];

  // Set default model
  const [currentModel, setCurrentModel] = useState(modelOptions[0]);

  // Mobile menu items
  const mobileMenuItems = [
    {
      label: 'Chat',
      icon: MessageCircleIcon,
      action: () => console.log('Chat clicked'),
      active: false
    },
    {
      label: 'Settings',
      icon: Settings2Icon,
      action: onSettingsClick || (() => {}),
      active: false
    },
    {
      label: 'Sign out',
      icon: LogOutIcon,
      action: handleLogout,
      active: false,
      danger: true
    }
  ];

  return (
    <div className="flex w-full items-center justify-between px-2 sm:px-4">
      {/* Left side - Model dropdown */}
      <div className="flex items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="flex items-center gap-1 sm:gap-2 font-medium text-xs sm:text-sm px-2 sm:px-3 h-8 sm:h-9"
            >
              <span className="hidden xs:inline sm:inline lg:inline">HydroGen Beta</span>
              <span className="xs:hidden sm:hidden">Beta</span>
              <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48 sm:w-52 bg-popover">
            {modelOptions.map(model => (
              <DropdownMenuItem 
                key={model.id} 
                onClick={() => setCurrentModel(model)} 
                className={cn(
                  "cursor-pointer text-xs sm:text-sm",
                  currentModel.id === model.id && "bg-accent text-accent-foreground"
                )}
              >
                {model.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Temporary Chat button - hidden on very small screens */}
        <Button 
          variant="ghost" 
          size="sm" 
          className="hidden xs:flex sm:flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3 h-8 sm:h-9"
        >
          <MessageCircleIcon className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">Temporary Chat</span>
          <span className="sm:hidden">Chat</span>
        </Button>
        
        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full h-8 w-8 sm:h-9 sm:w-9 border border-border/40"
            >
              <User className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 sm:w-52 bg-popover">
            {user && (
              <>
                <div className="px-2 py-1.5 text-xs sm:text-sm font-semibold truncate">
                  {user.email}
                </div>
                <DropdownMenuSeparator />
              </>
            )}
            <DropdownMenuItem 
              onClick={onSettingsClick} 
              className="cursor-pointer text-xs sm:text-sm"
            >
              <Settings2Icon className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={handleLogout} 
              className="cursor-pointer text-destructive text-xs sm:text-sm"
            >
              <LogOutIcon className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* Mobile Menu - only visible on small screens */}
        <div className="md:hidden">
          <MobileMenu items={mobileMenuItems} />
        </div>
      </div>
    </div>
  );
};
