
import React from "react";
import { Link } from "react-router-dom";
import { 
  ArrowRightIcon, 
  CheckIcon, 
  CodeIcon, 
  LayoutDashboardIcon, 
  RocketIcon, 
  ZapIcon 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

const LandingPage = () => {
  return (
    <ScrollArea className="h-screen w-full">
      <div className="flex min-h-screen flex-col">
        {/* Navbar */}
        <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 items-center justify-between">
            <div className="mr-4 flex">
              <Link to="/" className="mr-6 flex items-center space-x-2">
                <ZapIcon className="h-6 w-6" />
                <span className="font-bold inline-block">HydroGen AI</span>
              </Link>
            </div>
            <nav className="flex items-center gap-6">
              <Link 
                to="/app"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                <Button>
                  Get Started
                  <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </nav>
          </div>
        </header>

        <main className="flex-1">
          {/* Hero Section */}
          <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
            <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
              <Link
                to="/app"
                className="rounded-2xl bg-muted px-4 py-1.5 text-sm font-medium"
              >
                Now Available
              </Link>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                AI-Powered Answers at the Speed of Thought
              </h1>
              <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
                HydroGen AI delivers lightning-fast, contextual, and accurate responses to your questions
                with industry-leading response times.
              </p>
              <div className="space-x-4">
                <Link to="/app">
                  <Button size="lg" className="gap-2">
                    <ZapIcon className="h-4 w-4" />
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section
            id="features"
            className="container space-y-6 bg-slate-50 py-8 dark:bg-transparent md:py-12 lg:py-24"
          >
            <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
              <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-6xl">
                Features
              </h2>
              <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
                Experience the power of AI with our comprehensive set of features
                designed to enhance your productivity and creativity.
              </p>
            </div>
            <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
              <Card className="border-none shadow-md">
                <CardHeader>
                  <ZapIcon className="h-10 w-10 text-primary" />
                  <CardTitle>Lightning Fast</CardTitle>
                  <CardDescription>
                    Get responses in milliseconds with our optimized architecture.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Our advanced neural processing delivers accurate answers nearly instantly.</p>
                </CardContent>
              </Card>
              <Card className="border-none shadow-md">
                <CardHeader>
                  <CheckIcon className="h-10 w-10 text-primary" />
                  <CardTitle>Highly Accurate</CardTitle>
                  <CardDescription>
                    Trust in our 99.9% accuracy rate for critical decisions.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>We continuously train our models with high-quality data to ensure reliable responses.</p>
                </CardContent>
              </Card>
              <Card className="border-none shadow-md">
                <CardHeader>
                  <CodeIcon className="h-10 w-10 text-primary" />
                  <CardTitle>Code Support</CardTitle>
                  <CardDescription>
                    Get help with programming in multiple languages.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>From debugging to optimization, our AI understands code across various languages.</p>
                </CardContent>
              </Card>
              <Card className="border-none shadow-md">
                <CardHeader>
                  <LayoutDashboardIcon className="h-10 w-10 text-primary" />
                  <CardTitle>Customizable Interface</CardTitle>
                  <CardDescription>
                    Adapt the UI to meet your specific needs.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Choose between light and dark modes, and customize your workspace layout.</p>
                </CardContent>
              </Card>
              <Card className="border-none shadow-md">
                <CardHeader>
                  <RocketIcon className="h-10 w-10 text-primary" />
                  <CardTitle>Productivity Tools</CardTitle>
                  <CardDescription>
                    Enhance your workflow with integrated tools.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>From summarization to content generation, speed up your daily tasks.</p>
                </CardContent>
              </Card>
              <Card className="border-none shadow-md">
                <CardHeader>
                  <ZapIcon className="h-10 w-10 text-primary" />
                  <CardTitle>Instant Responses</CardTitle>
                  <CardDescription>
                    No waiting time for complex queries.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Our distributed processing ensures quick responses even for demanding tasks.</p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* How It Works Section */}
          <section id="how-it-works" className="container py-8 md:py-12 lg:py-24">
            <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
              <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-6xl">
                How It Works
              </h2>
              <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
                Experience the simplicity and power of HydroGen AI in a few easy steps
              </p>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-4">
              <Card className="relative overflow-hidden border-none bg-gradient-to-b from-primary/20 via-primary/5 to-background shadow-md">
                <CardHeader>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-2xl font-bold">1</div>
                  <CardTitle>Ask Your Question</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Type naturally — no keywords needed. Our AI understands your intent.</p>
                </CardContent>
              </Card>
              <Card className="relative overflow-hidden border-none bg-gradient-to-b from-primary/20 via-primary/5 to-background shadow-md">
                <CardHeader>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-2xl font-bold">2</div>
                  <CardTitle>AI Gets to Work</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Advanced algorithms process your query with contextual understanding.</p>
                </CardContent>
              </Card>
              <Card className="relative overflow-hidden border-none bg-gradient-to-b from-primary/20 via-primary/5 to-background shadow-md">
                <CardHeader>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-2xl font-bold">3</div>
                  <CardTitle>Instant Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Receive accurate answers in milliseconds, faster than you can blink.</p>
                </CardContent>
              </Card>
              <Card className="relative overflow-hidden border-none bg-gradient-to-b from-primary/20 via-primary/5 to-background shadow-md">
                <CardHeader>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-2xl font-bold">4</div>
                  <CardTitle>Explore More</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Ask follow-ups, refine queries, and continue your learning journey.</p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* CTA Section */}
          <section id="get-started" className="container py-8 md:py-12 lg:py-24">
            <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
              <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl">
                Ready to Experience HydroGen AI?
              </h2>
              <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
                Join thousands of satisfied users who are already benefiting from our advanced AI platform.
              </p>
              <Link
                to="/app"
                className="mt-4"
              >
                <Button size="lg" className="gap-2">
                  <ZapIcon className="h-4 w-4" />
                  Launch App Now
                </Button>
              </Link>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="border-t py-6 md:py-0">
          <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
            <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
              <ZapIcon className="h-6 w-6" />
              <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                &copy; {new Date().getFullYear()} HydroGen AI. All rights reserved.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Link to="#" className="text-sm text-muted-foreground hover:text-foreground">
                Privacy Policy
              </Link>
              <Separator orientation="vertical" className="h-4" />
              <Link to="#" className="text-sm text-muted-foreground hover:text-foreground">
                Terms of Service
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </ScrollArea>
  );
};

export default LandingPage;
