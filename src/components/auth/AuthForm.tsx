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
            
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            
          </div>
        </div>
        
        
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
          }) => <FormItem>
                <FormLabel className="text-foreground/70">Full Name (optional)</FormLabel>
                <FormControl>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Your full name" {...field} className="pl-10" disabled={isLoading} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>} />
            
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
            
          </div>
          
        </div>
        
        
      </TabsContent>
    </Tabs>;
}