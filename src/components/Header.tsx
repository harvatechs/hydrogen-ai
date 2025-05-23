
import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { ThemeToggle } from './theme/ThemeToggle';
import { MobileMenu } from './MobileMenu';
import { BookOpenIcon, HomeIcon, LogOutIcon, MessageCircleIcon, Settings2Icon } from 'lucide-react';
import { useChat } from '@/context/ChatContext';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

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
  
  const headerItems = [
    { id: 'chat', label: 'Chat', icon: MessageCircleIcon },
    { id: 'search', label: 'Search Web', icon: HomeIcon },
    { id: 'youtube', label: 'YouTube', icon: BookOpenIcon },
  ];
  
  return (
    <header
      className={cn(
        'sticky top-0 z-40 flex w-full items-center justify-between border-b bg-background/80 py-3 px-4 backdrop-blur-md transition-shadow duration-300 md:px-6',
        isScrolled ? 'shadow-md' : ''
      )}
    >
      <div className="flex items-center gap-2 sm:gap-4">
        <h1 className="text-lg font-semibold tracking-tight bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent hidden md:block">
          HydroGen AI
        </h1>
        
        <div className="hidden md:flex gap-2">
          {headerItems.map((item) => (
            <Button
              key={item.id}
              variant={activeAtom === item.id ? 'default' : 'ghost'}
              size="sm"
              className="hidden sm:flex items-center gap-2"
              onClick={() => setActiveAtom(item.id as any)}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Button>
          ))}
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <ThemeToggle />
        
        {user && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            title="Sign out"
            className="hidden sm:flex"
          >
            <LogOutIcon className="h-5 w-5" />
            <span className="sr-only">Sign out</span>
          </Button>
        )}
        
        <Button
          variant="ghost"
          size="icon"
          onClick={onSettingsClick}
          title="Settings"
        >
          <Settings2Icon className="h-5 w-5" />
          <span className="sr-only">Settings</span>
        </Button>
        
        <MobileMenu
          items={[
            ...headerItems.map(item => ({
              label: item.label,
              icon: item.icon,
              action: () => setActiveAtom(item.id as any),
              active: activeAtom === item.id
            })),
            {
              label: 'Sign Out',
              icon: LogOutIcon,
              action: handleLogout,
              danger: true
            }
          ]}
          className="md:hidden"
        />
      </div>
    </header>
  );
};
