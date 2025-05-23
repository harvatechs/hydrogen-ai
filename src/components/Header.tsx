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
  return;
};