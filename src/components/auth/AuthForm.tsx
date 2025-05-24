
import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAuth } from '@/context/AuthContext';
import { Loader2, Mail, Lock, User, EyeIcon, EyeOffIcon, Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { validateAndSanitizeInput } from '@/utils/securityUtils';
import { toast } from '@/components/ui/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';

// Enhanced validation schemas with security measures
const loginSchema = z.object({
  emailOrUsername: z.string()
    .min(3, { message: 'Please enter a valid email or username' })
    .max(100, { message: 'Input too long' })
    .refine((val) => {
      const validation = validateAndSanitizeInput(val);
      return validation.isValid;
    }, { message: 'Invalid characters detected' }),
  password: z.string()
    .min(6, { message: 'Password must be at least 6 characters' })
    .max(128, { message: 'Password too long' })
});

const signupSchema = z.object({
  email: z.string()
    .email({ message: 'Please enter a valid email' })
    .max(100, { message: 'Email too long' }),
  password: z.string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .max(128, { message: 'Password too long' })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
      message: 'Password must contain uppercase, lowercase, number, and special character'
    }),
  username: z.string()
    .min(3, { message: 'Username must be at least 3 characters' })
    .max(30, { message: 'Username too long' })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: 'Username can only contain letters, numbers, and underscores'
    }),
  fullName: z.string()
    .min(2, { message: 'Full name must be at least 2 characters' })
    .max(50, { message: 'Full name too long' })
    .optional()
});

type LoginFormValues = z.infer<typeof loginSchema>;
type SignupFormValues = z.infer<typeof signupSchema>;

// Password strength calculator
const calculatePasswordStrength = (password: string): number => {
  let strength = 0;
  if (password.length >= 8) strength += 20;
  if (password.length >= 12) strength += 10;
  if (/[a-z]/.test(password)) strength += 20;
  if (/[A-Z]/.test(password)) strength += 20;
  if (/\d/.test(password)) strength += 20;
  if (/[@$!%*?&]/.test(password)) strength += 10;
  return Math.min(strength, 100);
};

export function AuthForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('login');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [passwordStrength, setPasswordStrength] = useState<number>(0);
  const [securityAlert, setSecurityAlert] = useState<string>('');
  const { signIn, signUp, signInWithGoogle } = useAuth();

  // Login form with enhanced security
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      emailOrUsername: '',
      password: ''
    }
  });

  // Signup form with enhanced validation
  const signupForm = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
      username: '',
      fullName: ''
    }
  });

  // Watch password for strength calculation
  const watchedPassword = signupForm.watch('password');
  useState(() => {
    if (watchedPassword) {
      setPasswordStrength(calculatePasswordStrength(watchedPassword));
    }
  });

  async function onLoginSubmit(data: LoginFormValues) {
    setIsLoading(true);
    setSecurityAlert('');
    
    try {
      // Additional security validation
      const emailValidation = validateAndSanitizeInput(data.emailOrUsername);
      if (!emailValidation.isValid) {
        setSecurityAlert('Invalid input detected. Please check your credentials.');
        return;
      }

      await signIn(data.emailOrUsername, data.password);
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
    } catch (error: any) {
      setSecurityAlert(error.message || 'Authentication failed. Please try again.');
      toast({
        title: "Sign in failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function onSignupSubmit(data: SignupFormValues) {
    setIsLoading(true);
    setSecurityAlert('');
    
    try {
      // Enhanced security checks
      if (passwordStrength < 60) {
        setSecurityAlert('Password is too weak. Please choose a stronger password.');
        return;
      }

      await signUp(data.email, data.password, {
        username: data.username,
        full_name: data.fullName
      });
      
      toast({
        title: "Account created successfully!",
        description: "Please check your email to verify your account.",
      });
    } catch (error: any) {
      setSecurityAlert(error.message || 'Registration failed. Please try again.');
      toast({
        title: "Registration failed",
        description: error.message || "Please try again with different credentials.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    setIsLoading(true);
    try {
      await signInWithGoogle();
      toast({
        title: "Welcome!",
        description: "You have successfully signed in with Google.",
      });
    } catch (error: any) {
      toast({
        title: "Google sign in failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const getPasswordStrengthColor = (strength: number) => {
    if (strength < 30) return 'bg-red-500';
    if (strength < 60) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = (strength: number) => {
    if (strength < 30) return 'Weak';
    if (strength < 60) return 'Medium';
    return 'Strong';
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {securityAlert && (
        <Alert className="mb-4 border-yellow-500/20 bg-yellow-500/10">
          <AlertTriangle className="h-4 w-4 text-yellow-500" />
          <AlertDescription className="text-yellow-700 dark:text-yellow-300">
            {securityAlert}
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6 bg-muted/30">
          <TabsTrigger 
            value="login" 
            className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
          >
            <Shield className="h-4 w-4 mr-2" />
            Sign In
          </TabsTrigger>
          <TabsTrigger 
            value="signup" 
            className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
          >
            <User className="h-4 w-4 mr-2" />
            Sign Up
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="login" className="space-y-4">
          <Form {...loginForm}>
            <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
              <FormField
                control={loginForm.control}
                name="emailOrUsername"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground/90 font-medium">Email or Username</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="yourname@example.com"
                          {...field}
                          className="pl-10 bg-background/50 border-border/50 focus:border-primary transition-colors"
                          disabled={isLoading}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={loginForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground/90 font-medium">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          {...field}
                          className="pl-10 pr-10 bg-background/50 border-border/50 focus:border-primary transition-colors"
                          disabled={isLoading}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-10 w-10 text-muted-foreground hover:text-foreground"
                          onClick={togglePasswordVisibility}
                          disabled={isLoading}
                        >
                          {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                          <span className="sr-only">
                            {showPassword ? "Hide password" : "Show password"}
                          </span>
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 transition-all" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In Securely'
                )}
              </Button>

              <Button
                type="button"
                variant="link"
                size="sm"
                className="w-full text-xs text-muted-foreground hover:text-primary"
                disabled={isLoading}
              >
                Forgot password?
              </Button>
            </form>
          </Form>
        </TabsContent>
        
        <TabsContent value="signup" className="space-y-4">
          <Form {...signupForm}>
            <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-4">
              <FormField
                control={signupForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground/90 font-medium">Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="yourname@example.com"
                          {...field}
                          className="pl-10 bg-background/50 border-border/50 focus:border-primary transition-colors"
                          disabled={isLoading}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={signupForm.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground/90 font-medium">Username</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="cooluser123"
                          {...field}
                          className="pl-10 bg-background/50 border-border/50 focus:border-primary transition-colors"
                          disabled={isLoading}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={signupForm.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground/90 font-medium">Full Name (optional)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Your full name"
                          {...field}
                          className="pl-10 bg-background/50 border-border/50 focus:border-primary transition-colors"
                          disabled={isLoading}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={signupForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground/90 font-medium">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          {...field}
                          className="pl-10 pr-10 bg-background/50 border-border/50 focus:border-primary transition-colors"
                          disabled={isLoading}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-10 w-10 text-muted-foreground hover:text-foreground"
                          onClick={togglePasswordVisibility}
                          disabled={isLoading}
                        >
                          {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                          <span className="sr-only">
                            {showPassword ? "Hide password" : "Show password"}
                          </span>
                        </Button>
                      </div>
                    </FormControl>
                    {watchedPassword && (
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Password strength:</span>
                          <span className={`font-medium ${passwordStrength >= 60 ? 'text-green-500' : passwordStrength >= 30 ? 'text-yellow-500' : 'text-red-500'}`}>
                            {getPasswordStrengthText(passwordStrength)}
                          </span>
                        </div>
                        <Progress 
                          value={passwordStrength} 
                          className="h-2"
                        />
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 transition-all" 
                disabled={isLoading || passwordStrength < 60}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Create Secure Account
                  </>
                )}
              </Button>
            </form>
          </Form>
        </TabsContent>
      </Tabs>
    </div>
  );
}
