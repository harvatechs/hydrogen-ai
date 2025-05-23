import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAuth } from '@/context/AuthContext';
import { Loader2, Mail, Lock, User, EyeIcon, EyeOffIcon } from 'lucide-react';

// Validation schemas
const loginSchema = z.object({
  emailOrUsername: z.string().min(3, {
    message: 'Please enter a valid email or username'
  }),
  password: z.string().min(6, {
    message: 'Password must be at least 6 characters'
  })
});
const signupSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email'
  }),
  password: z.string().min(6, {
    message: 'Password must be at least 6 characters'
  }),
  username: z.string().min(3, {
    message: 'Username must be at least 3 characters'
  }).regex(/^[a-zA-Z0-9_]+$/, {
    message: 'Username can only contain letters, numbers, and underscores'
  }),
  fullName: z.string().min(2, {
    message: 'Full name must be at least 2 characters'
  }).optional()
});
type LoginFormValues = z.infer<typeof loginSchema>;
type SignupFormValues = z.infer<typeof signupSchema>;
export function AuthForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('login');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const {
    signIn,
    signUp,
    signInWithGoogle
  } = useAuth();

  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      emailOrUsername: '',
      password: ''
    }
  });

  // Signup form
  const signupForm = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
      username: '',
      fullName: ''
    }
  });
  async function onLoginSubmit(data: LoginFormValues) {
    setIsLoading(true);
    try {
      await signIn(data.emailOrUsername, data.password);
    } finally {
      setIsLoading(false);
    }
  }
  async function onSignupSubmit(data: SignupFormValues) {
    setIsLoading(true);
    try {
      await signUp(data.email, data.password, {
        username: data.username,
        full_name: data.fullName
      });
    } finally {
      setIsLoading(false);
    }
  }
  async function handleGoogleSignIn() {
    setIsLoading(true);
    try {
      await signInWithGoogle();
    } finally {
      setIsLoading(false);
    }
  }
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  return <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="login" className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Sign In</TabsTrigger>
        <TabsTrigger value="signup" className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Sign Up</TabsTrigger>
      </TabsList>
      
      <TabsContent value="login" className="space-y-4">
        <Form {...loginForm}>
          <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
            <FormField control={loginForm.control} name="emailOrUsername" render={({
            field
          }) => <FormItem>
                  <FormLabel className="text-foreground/70">Email or Username</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="yourname@example.com" {...field} className="pl-10" disabled={isLoading} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>} />
            
            <FormField control={loginForm.control} name="password" render={({
            field
          }) => <FormItem>
                  <FormLabel className="text-foreground/70">Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input type={showPassword ? "text" : "password"} placeholder="••••••••" {...field} className="pl-10" disabled={isLoading} />
                      <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-10 w-10 text-muted-foreground" onClick={togglePasswordVisibility} disabled={isLoading}>
                        {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                        <span className="sr-only">
                          {showPassword ? "Hide password" : "Show password"}
                        </span>
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>} />
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </> : 'Sign In'}
            </Button>

            <Button type="button" variant="link" size="sm" className="w-full text-xs text-muted-foreground hover:text-primary" disabled={isLoading}>
              Forgot password?
            </Button>
          </form>
        </Form>
        
        <div className="relative mt-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background/80 backdrop-blur-sm px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>
        
        <Button variant="outline" onClick={handleGoogleSignIn} className="w-full" disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Google
        </Button>
      </TabsContent>
      
      <TabsContent value="signup" className="space-y-4">
        <Form {...signupForm}>
          <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-4">
            <FormField control={signupForm.control} name="email" render={({
            field
          }) => <FormItem>
                  <FormLabel className="text-foreground/70">Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="yourname@example.com" {...field} className="pl-10" disabled={isLoading} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>} />
            
            <FormField control={signupForm.control} name="username" render={({
            field
          }) => <FormItem>
                  <FormLabel className="text-foreground/70">Username</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="cooluser123" {...field} className="pl-10" disabled={isLoading} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>} />
            
            <FormField control={signupForm.control} name="fullName" render={({
            field
          }) => {}} />
            
            <FormField control={signupForm.control} name="password" render={({
            field
          }) => <FormItem>
                  <FormLabel className="text-foreground/70">Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input type={showPassword ? "text" : "password"} placeholder="••••••••" {...field} className="pl-10" disabled={isLoading} />
                      <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-10 w-10 text-muted-foreground" onClick={togglePasswordVisibility} disabled={isLoading}>
                        {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                        <span className="sr-only">
                          {showPassword ? "Hide password" : "Show password"}
                        </span>
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>} />
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </> : 'Create account'}
            </Button>
          </form>
        </Form>
        
        <div className="relative mt-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background/80 backdrop-blur-sm px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>
        
        <Button variant="outline" onClick={handleGoogleSignIn} className="w-full" disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Google
        </Button>
      </TabsContent>
    </Tabs>;
}