import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthForm } from '@/components/auth/AuthForm';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ZapIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
const AuthPage = () => {
  const {
    user,
    loading
  } = useAuth();
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
    const gradients = ['from-background to-background/80 via-blue-500/5', 'from-background to-background/80 via-purple-500/5', 'from-background to-background/80 via-indigo-500/5', 'from-background to-background/80 via-pink-500/5', 'from-background to-background/80 via-cyan-500/5'];
    setBgClass(gradients[Math.floor(Math.random() * gradients.length)]);
  }, []);
  return <div className={cn("flex min-h-screen flex-col items-center justify-center px-4 sm:px-6 bg-gradient-to-tr transition-all duration-1000", bgClass, !mounted && "opacity-0")}>
      <div className="absolute inset-0 bg-grid-small-white/[0.2] bg-[size:20px_20px] pointer-events-none" style={{
      backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
      backgroundSize: '30px 30px',
      opacity: 0.4
    }} />
      
      <div className="w-full max-w-md space-y-8 relative z-10">
        <div className="flex flex-col items-center space-y-2 text-center">
          
          <CardTitle className="text-4xl font-extrabold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
            HydroGen AI
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Sign in to access lightning-fast AI-powered answers
          </CardDescription>
        </div>
        
        <Card className="border shadow-lg backdrop-blur-sm bg-card/80">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Welcome</CardTitle>
            <CardDescription>
              Sign in to your account or create a new one
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AuthForm />
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 pt-0 border-t border-border/40 mt-4">
            <div className="text-xs text-muted-foreground text-center">
              Unlock the full potential of AI assistance
            </div>
          </CardFooter>
        </Card>
        
        <p className="text-center text-sm text-muted-foreground mt-6">
          By signing in, you agree to our{' '}
          <Button variant="link" className="p-0 h-auto" asChild>
            <a href="#" className="font-medium">
              Terms of Service
            </a>
          </Button>{' '}
          and{' '}
          <Button variant="link" className="p-0 h-auto" asChild>
            <a href="#" className="font-medium">
              Privacy Policy
            </a>
          </Button>
        </p>
      </div>
    </div>;
};
export default AuthPage;