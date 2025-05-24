
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthForm } from '@/components/auth/AuthForm';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const AuthPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (user && !loading) {
      navigate('/app');
    }
  }, [user, loading, navigate]);

  const [bgClass, setBgClass] = useState('from-background');

  // Random gradient background on each mount
  useEffect(() => {
    const gradients = [
      'from-background to-background/80 via-blue-500/5',
      'from-background to-background/80 via-purple-500/5',
      'from-background to-background/80 via-indigo-500/5',
      'from-background to-background/80 via-pink-500/5',
      'from-background to-background/80 via-cyan-500/5'
    ];
    setBgClass(gradients[Math.floor(Math.random() * gradients.length)]);
  }, []);

  return (
    <div className={cn(
      "flex min-h-screen flex-col items-center justify-center",
      "px-4 sm:px-6 lg:px-8",
      "bg-gradient-to-tr transition-all duration-1000",
      "relative overflow-hidden",
      bgClass,
      !mounted && "opacity-0"
    )}>
      {/* Background Grid Pattern */}
      <div 
        className="absolute inset-0 bg-grid-small-white/[0.2] pointer-events-none opacity-40"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: 'clamp(20px, 5vw, 30px) clamp(20px, 5vw, 30px)',
        }} 
      />
      
      {/* Main Content Container */}
      <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg space-y-6 sm:space-y-8 relative z-10">
        {/* Header Section */}
        <div className="flex flex-col items-center space-y-3 sm:space-y-4 text-center">
          <CardTitle className="text-3xl sm:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent leading-tight">
            HydroGen AI
          </CardTitle>
          <CardDescription className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-md px-2">
            Sign in to access lightning-fast AI-powered answers
          </CardDescription>
        </div>
        
        {/* Auth Card */}
        <Card className="border shadow-lg backdrop-blur-sm bg-card/80 mx-auto w-full">
          <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6">
            <CardTitle className="text-lg sm:text-xl lg:text-2xl text-center">Welcome</CardTitle>
            <CardDescription className="text-sm sm:text-base text-center">
              Sign in to your account or create a new one
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
            <AuthForm />
          </CardContent>
        </Card>
        
        {/* Footer Text */}
        <div className="text-center">
          <p className="text-xs sm:text-sm text-muted-foreground px-4">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
