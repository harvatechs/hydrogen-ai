
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthForm } from '@/components/auth/AuthForm';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ZapIcon } from 'lucide-react';

const AuthPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (user && !loading) {
      navigate('/app');
    }
  }, [user, loading, navigate]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 sm:px-6 bg-gradient-to-tr from-background to-background/80">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center space-y-2 text-center">
          <div className="h-14 w-14 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white mb-1">
            <ZapIcon size={28} />
          </div>
          <CardTitle className="text-4xl font-extrabold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
            HydroGen AI
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Sign in to access lightning-fast AI-powered answers
          </CardDescription>
        </div>
        
        <Card className="border shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Welcome</CardTitle>
            <CardDescription>
              Sign in to your account or create a new one
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AuthForm />
          </CardContent>
        </Card>
        
        <p className="text-center text-sm text-muted-foreground mt-6">
          By signing in, you agree to our{' '}
          <a href="#" className="underline underline-offset-2 hover:text-primary">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="underline underline-offset-2 hover:text-primary">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}

export default AuthPage;
