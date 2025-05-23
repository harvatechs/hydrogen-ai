
import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  useEffect(() => {
    // We can use this to log authentication events or perform other side effects
    if (user) {
      console.log("User authenticated:", user.id);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading your experience...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    // Redirect to auth page if not logged in
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
