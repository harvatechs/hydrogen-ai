
import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { ThemeToggle } from './theme/ThemeToggle';
import { MobileMenu } from './MobileMenu';
import { BookOpenIcon, HomeIcon, LogOutIcon, MessageCircleIcon, Settings2Icon, ChevronDown, User, Shield, Bell, Search } from 'lucide-react';
import { useChat } from '@/context/ChatContext';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { validateAndSanitizeInput } from '@/utils/securityUtils';

interface HeaderProps {
  onSettingsClick?: () => void;
}

export const Header = ({ onSettingsClick }: HeaderProps) => {
  const { user, signOut } = useAuth();
  const { activeAtom, setActiveAtom } = useChat();
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Detect scroll for enhanced header styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleSearch = (query: string) => {
    const validation = validateAndSanitizeInput(query);
    if (validation.isValid && validation.sanitizedInput) {
      setSearchQuery(validation.sanitizedInput);
      // Implement search functionality
    }
  };

  const modelOptions = [
    { id: 'lambda', name: 'HydroGen Lambda 2.0', description: 'Advanced reasoning model' },
    { id: 'atoms', name: 'HydroGen Atoms', description: 'Fast response model' },
    { id: 'molecule', name: 'HydroGen Molecule', description: 'Balanced performance' },
    { id: 'compound', name: 'HydroGen Compound', description: 'Complex task specialist' }
  ];

  const [currentModel, setCurrentModel] = useState(modelOptions[0]);

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
    <div className={cn(
      "flex w-full items-center justify-between transition-all duration-300 relative",
      isScrolled && "backdrop-blur-md bg-background/80"
    )}>
      {/* Left Section - Model Selector */}
      <div className="flex items-center space-x-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="flex items-center gap-2 font-medium hover:bg-accent/50 transition-colors px-3 py-2 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span className="hidden sm:inline font-semibold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  HydroGen Beta
                </span>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-72 bg-background/95 backdrop-blur-md border shadow-lg">
            <div className="p-2">
              <div className="text-xs font-medium text-muted-foreground mb-2 px-2">
                Select AI Model
              </div>
              {modelOptions.map(model => (
                <DropdownMenuItem
                  key={model.id}
                  onClick={() => setCurrentModel(model)}
                  className={cn(
                    "cursor-pointer p-3 rounded-md transition-colors",
                    currentModel.id === model.id && "bg-accent text-accent-foreground"
                  )}
                >
                  <div className="flex flex-col">
                    <div className="flex items-center justify-between w-full">
                      <span className="font-medium">{model.name}</span>
                      {currentModel.id === model.id && (
                        <Badge variant="secondary" className="text-xs">Active</Badge>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground mt-1">
                      {model.description}
                    </span>
                  </div>
                </DropdownMenuItem>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Center Section - Search (for larger screens) */}
      <div className="hidden md:flex flex-1 max-w-md mx-4">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full pl-10 pr-4 py-2 bg-accent/20 border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Right Section - Actions */}
      <div className="flex items-center gap-2">
        {/* Temporary Chat Badge */}
        <Badge variant="outline" className="hidden sm:flex items-center gap-1 bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
          <div className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse" />
          Temporary Chat
        </Badge>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="h-9 w-9 relative">
          <Bell className="h-4 w-4" />
          <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
            <span className="text-[10px]">3</span>
          </div>
        </Button>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full h-9 w-9 border border-border/40 hover:border-border transition-colors"
            >
              <User className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 bg-background/95 backdrop-blur-md border shadow-lg">
            {user && (
              <>
                <div className="px-3 py-3 border-b border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-semibold">
                      {user.email?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{user.email}</div>
                      <div className="text-xs text-muted-foreground">Pro User</div>
                    </div>
                  </div>
                </div>
              </>
            )}
            
            <div className="py-1">
              <DropdownMenuItem onClick={onSettingsClick} className="cursor-pointer px-3 py-2">
                <Settings2Icon className="mr-3 h-4 w-4" />
                <span>Settings & Privacy</span>
              </DropdownMenuItem>
              
              <DropdownMenuItem className="cursor-pointer px-3 py-2">
                <Shield className="mr-3 h-4 w-4" />
                <span>Security</span>
              </DropdownMenuItem>
            </div>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem 
              onClick={handleLogout} 
              className="cursor-pointer text-destructive focus:text-destructive px-3 py-2"
            >
              <LogOutIcon className="mr-3 h-4 w-4" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* Mobile Menu */}
        <div className="md:hidden">
          <MobileMenu items={mobileMenuItems} />
        </div>
      </div>
    </div>
  );
};
