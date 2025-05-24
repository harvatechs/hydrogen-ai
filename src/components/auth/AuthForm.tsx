
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
  const { signIn, signUp, signInWithGoogle } = useAuth();

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

  return (
    <div className="w-full space-y-4 sm:space-y-6">
      <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4 sm:mb-6 h-10 sm:h-11">
          <TabsTrigger 
            value="login" 
            className="text-sm sm:text-base rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Sign In
          </TabsTrigger>
          <TabsTrigger 
            value="signup" 
            className="text-sm sm:text-base rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Sign Up
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="login" className="space-y-4 sm:space-y-5">
          <Form {...loginForm}>
            <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4 sm:space-y-5">
              <FormField
                control={loginForm.control}
                name="emailOrUsername"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground/70 text-sm sm:text-base">Email or Username</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                        <Input 
                          placeholder="yourname@example.com" 
                          {...field} 
                          className="pl-10 sm:pl-12 h-11 sm:h-12 text-base" 
                          disabled={isLoading}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-sm" />
                  </FormItem>
                )}
              />
              
              <FormField
                control={loginForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground/70 text-sm sm:text-base">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                        <Input 
                          type={showPassword ? "text" : "password"} 
                          placeholder="••••••••" 
                          {...field} 
                          className="pl-10 sm:pl-12 pr-12 h-11 sm:h-12 text-base" 
                          disabled={isLoading}
                        />
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon" 
                          className="absolute right-0 top-0 h-11 sm:h-12 w-11 sm:w-12 text-muted-foreground hover:text-foreground" 
                          onClick={togglePasswordVisibility} 
                          disabled={isLoading}
                        >
                          {showPassword ? <EyeOffIcon className="h-4 w-4 sm:h-5 sm:w-5" /> : <EyeIcon className="h-4 w-4 sm:h-5 sm:w-5" />}
                          <span className="sr-only">
                            {showPassword ? "Hide password" : "Show password"}
                          </span>
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-sm" />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full h-11 sm:h-12 text-base font-medium" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>

              <Button 
                type="button" 
                variant="link" 
                size="sm" 
                className="w-full text-xs sm:text-sm text-muted-foreground hover:text-primary" 
                disabled={isLoading}
              >
                Forgot password?
              </Button>
            </form>
          </Form>
        </TabsContent>
        
        <TabsContent value="signup" className="space-y-4 sm:space-y-5">
          <Form {...signupForm}>
            <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-4 sm:space-y-5">
              <FormField
                control={signupForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground/70 text-sm sm:text-base">Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                        <Input 
                          placeholder="yourname@example.com" 
                          {...field} 
                          className="pl-10 sm:pl-12 h-11 sm:h-12 text-base" 
                          disabled={isLoading}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-sm" />
                  </FormItem>
                )}
              />
              
              <FormField
                control={signupForm.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground/70 text-sm sm:text-base">Username</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                        <Input 
                          placeholder="cooluser123" 
                          {...field} 
                          className="pl-10 sm:pl-12 h-11 sm:h-12 text-base" 
                          disabled={isLoading}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-sm" />
                  </FormItem>
                )}
              />
              
              <FormField
                control={signupForm.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground/70 text-sm sm:text-base">Full Name (optional)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                        <Input 
                          placeholder="Your full name" 
                          {...field} 
                          className="pl-10 sm:pl-12 h-11 sm:h-12 text-base" 
                          disabled={isLoading}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-sm" />
                  </FormItem>
                )}
              />
              
              <FormField
                control={signupForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground/70 text-sm sm:text-base">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                        <Input 
                          type={showPassword ? "text" : "password"} 
                          placeholder="••••••••" 
                          {...field} 
                          className="pl-10 sm:pl-12 pr-12 h-11 sm:h-12 text-base" 
                          disabled={isLoading}
                        />
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon" 
                          className="absolute right-0 top-0 h-11 sm:h-12 w-11 sm:w-12 text-muted-foreground hover:text-foreground" 
                          onClick={togglePasswordVisibility} 
                          disabled={isLoading}
                        >
                          {showPassword ? <EyeOffIcon className="h-4 w-4 sm:h-5 sm:w-5" /> : <EyeIcon className="h-4 w-4 sm:h-5 sm:w-5" />}
                          <span className="sr-only">
                            {showPassword ? "Hide password" : "Show password"}
                          </span>
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-sm" />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full h-11 sm:h-12 text-base font-medium" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  'Create account'
                )}
              </Button>
            </form>
          </Form>
        </TabsContent>
      </Tabs>
    </div>
  );
}
