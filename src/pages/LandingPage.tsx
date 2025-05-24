import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  CheckIcon, 
  BrainIcon, 
  ShieldIcon, 
  MessageSquareIcon, 
  SmartphoneIcon, 
  ZapIcon, 
  SearchIcon,
  ArrowDownIcon,
  UserIcon,
  SendIcon,
  BoltIcon,
  TargetIcon,
  WandIcon,
  MenuIcon,
  XIcon,
  ChevronDownIcon,
  TwitterIcon,
  LinkedinIcon,
  GithubIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/context/AuthContext";

const LandingPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const statsRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Animation on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    
    if (statsRef.current) {
      observer.observe(statsRef.current);
    }
    
    return () => observer.disconnect();
  }, []);

  // Handle Launch App button click
  const handleLaunchApp = () => {
    if (user) {
      // User is already signed in, redirect to the main app
      navigate('/app');
    } else {
      // User is not signed in, redirect to auth page
      navigate('/auth');
    }
  };
  
  // Animated counter
  const AnimatedCounter = ({ end, duration = 2000, label, suffix = "" }: { 
    end: number; 
    duration?: number; 
    label: string;
    suffix?: string;
  }) => {
    const [count, setCount] = useState(0);
    
    useEffect(() => {
      if (!isVisible) return;
      
      let start = 0;
      const increment = end / (duration / 16);
      
      const timer = setInterval(() => {
        start += increment;
        setCount(Math.floor(start));
        
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        }
      }, 16);
      
      return () => clearInterval(timer);
    }, [end, duration, isVisible]);
    
    return (
      <Card className="feature-card border p-6 text-center hover:shadow-lg transition-all">
        <div className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
          {count}{suffix}
        </div>
        <div className="text-sm text-muted-foreground">{label}</div>
      </Card>
    );
  };

  const faqData = [
    {
      question: "What is HydroGen?",
      answer: "HydroGen is an AI-powered answer engine that provides accurate, instant responses to any question. Built by HarVa Groups in just 30 minutes, it leverages advanced AI to deliver 99.9% accuracy with 50ms response times."
    },
    {
      question: "How accurate are the answers?",
      answer: "HydroGen delivers answers with a remarkable 99.9% accuracy rate. Our AI models are trained on vast datasets and continuously improved to ensure you receive the most precise information available."
    },
    {
      question: "Was this really built in 30 minutes?",
      answer: "Yes! HydroGen was built in just 30 minutes as an experimental project by HarVa Groups. It demonstrates the power of modern AI development tools to create sophisticated applications in record time."
    },
    {
      question: "What types of questions can I ask?",
      answer: "You can ask HydroGen virtually anything! From scientific queries to historical facts, from technological explanations to philosophical questions - our AI is designed to handle a wide range of topics with expertise."
    },
    {
      question: "Who created HydroGen?",
      answer: "HydroGen was created by HarVa Groups in collaboration with FreakVinci Open Labs and OpenMatrix. It represents a collaborative experiment showcasing rapid AI application development."
    },
    {
      question: "Is HydroGen free to use?",
      answer: "Currently, HydroGen is in beta and available for free. We're constantly improving the platform and may introduce premium features in the future, but we're committed to maintaining a free tier."
    }
  ];

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <ScrollArea className="h-screen w-full">
      <div className="min-h-screen bg-background">
        {/* Background Gradients */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[5%] left-[5%] w-[400px] h-[400px] bg-indigo-500/20 rounded-full blur-[80px] opacity-50" />
          <div className="absolute bottom-[10%] right-[5%] w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[80px] opacity-50" />
        </div>

        {/* Header */}
        <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex justify-between items-center py-4">
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  HydroGen
                </div>
                <span className="text-xs font-medium px-2 py-1 bg-pink-500 text-white rounded-full">
                  Beta
                </span>
              </div>
              
              <div className="hidden md:flex items-center gap-8">
                <button onClick={() => scrollToSection('home')} className="text-foreground hover:text-primary transition-colors">
                  Home
                </button>
                <button onClick={() => scrollToSection('features')} className="text-foreground hover:text-primary transition-colors">
                  Features
                </button>
                <button onClick={() => scrollToSection('how-it-works')} className="text-foreground hover:text-primary transition-colors">
                  How It Works
                </button>
                <button onClick={() => scrollToSection('faq')} className="text-foreground hover:text-primary transition-colors">
                  FAQ
                </button>
              </div>

              <div className="hidden md:block">
                <Button 
                  onClick={handleLaunchApp}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                >
                  {user ? 'Go to App' : 'Get Started'}
                </Button>
              </div>

              <button 
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
              </button>
            </nav>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-md border-b border-border">
              <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
                <button onClick={() => scrollToSection('home')} className="text-left text-foreground hover:text-primary transition-colors">
                  Home
                </button>
                <button onClick={() => scrollToSection('features')} className="text-left text-foreground hover:text-primary transition-colors">
                  Features
                </button>
                <button onClick={() => scrollToSection('how-it-works')} className="text-left text-foreground hover:text-primary transition-colors">
                  How It Works
                </button>
                <button onClick={() => scrollToSection('faq')} className="text-left text-foreground hover:text-primary transition-colors">
                  FAQ
                </button>
                <Button 
                  onClick={() => {
                    handleLaunchApp();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                >
                  {user ? 'Go to App' : 'Get Started'}
                </Button>
              </div>
            </div>
          )}
        </header>

        {/* Hero Section */}
        <section id="home" className="relative py-20 md:py-32 text-center overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Where Curiosity Meets AI Magic
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed">
              Ask Anything. Discover Everything. Unlock the Answers You Seek
            </p>
            <Button 
              size="lg" 
              onClick={handleLaunchApp}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-lg px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
            >
              {user ? 'Go to App' : 'Launch App'} <SendIcon className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-gradient-to-b from-background to-muted/20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                Powerful Features
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Discover what makes HydroGen the ultimate answer engine
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="feature-card border p-8 hover:shadow-lg transition-all group hover:border-indigo-300">
                <div className="h-16 w-16 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
                  <BoltIcon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold mb-4">Lightning Fast</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Get answers in milliseconds with our industry-leading 50ms response time, ensuring you never wait for knowledge.
                </p>
              </Card>

              <Card className="feature-card border p-8 hover:shadow-lg transition-all group hover:border-indigo-300">
                <div className="h-16 w-16 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
                  <TargetIcon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold mb-4">99.9% Accuracy</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Trust our AI to deliver precise, factual answers every time. We've engineered for truth and reliability.
                </p>
              </Card>

              <Card className="feature-card border p-8 hover:shadow-lg transition-all group hover:border-indigo-300">
                <div className="h-16 w-16 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
                  <BrainIcon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold mb-4">AI-Powered Insights</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Our advanced algorithms don't just find answers - they understand context and deliver meaningful insights.
                </p>
              </Card>

              <Card className="feature-card border p-8 hover:shadow-lg transition-all group hover:border-indigo-300">
                <div className="h-16 w-16 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
                  <WandIcon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold mb-4">Natural Conversations</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Ask questions in your own words. Our AI understands natural language and responds conversationally.
                </p>
              </Card>

              <Card className="feature-card border p-8 hover:shadow-lg transition-all group hover:border-indigo-300">
                <div className="h-16 w-16 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-600 flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
                  <SmartphoneIcon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold mb-4">Fully Responsive</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Access HydroGen from any device. Our interface adapts perfectly to smartphones, tablets, and desktops.
                </p>
              </Card>

              <Card className="feature-card border p-8 hover:shadow-lg transition-all group hover:border-indigo-300">
                <div className="h-16 w-16 rounded-xl bg-gradient-to-r from-teal-500 to-green-600 flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
                  <ShieldIcon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold mb-4">Privacy Focused</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Your questions and data stay private. We prioritize security and never share your information with third parties.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                How It Works
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Getting answers has never been this simple
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { number: "1", title: "Ask Your Question", description: "Type any question in the search bar using natural language." },
                { number: "2", title: "AI Processing", description: "Our AI analyzes your question and searches for the most accurate answer." },
                { number: "3", title: "Instant Results", description: "Within milliseconds, you'll receive a comprehensive, accurate answer." },
                { number: "4", title: "Explore Further", description: "Ask follow-up questions or explore related topics with ease." }
              ].map((step, index) => (
                <div key={index} className="text-center relative">
                  <div className="h-20 w-20 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-2xl font-bold flex items-center justify-center mx-auto mb-6 shadow-lg">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-bold mb-4">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-gradient-to-b from-muted/20 to-background" ref={statsRef}>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                HydroGen by the Numbers
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                We're changing how people access information
              </p>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <AnimatedCounter end={50} label="Millisecond Response" suffix="ms" />
              <AnimatedCounter end={99.9} label="Accuracy Rate" suffix="%" />
              <AnimatedCounter end={500} label="Million+ Questions" suffix="M+" />
              <AnimatedCounter end={30} label="Minutes to Build This" />
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-purple-50/50 to-pink-50/50 dark:from-indigo-950/20 dark:via-purple-950/20 dark:to-pink-950/20" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Everything you need to know about HydroGen
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
              {faqData.map((faq, index) => (
                <Card key={index} className="border bg-background/80 backdrop-blur-sm hover:shadow-lg transition-all">
                  <CardContent className="p-6">
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full text-left flex justify-between items-center"
                    >
                      <h3 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent pr-4">
                        {faq.question}
                      </h3>
                      <ChevronDownIcon 
                        className={`h-5 w-5 text-indigo-600 transition-transform flex-shrink-0 ${
                          activeFaq === index ? 'rotate-180' : ''
                        }`} 
                      />
                    </button>
                    {activeFaq === index && (
                      <div className="mt-4 pt-4 border-t border-border">
                        <p className="text-muted-foreground leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600 text-white relative overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Ready to Get Answers?
            </h2>
            <p className="text-xl opacity-90 max-w-3xl mx-auto mb-10 leading-relaxed">
              Join thousands of curious minds exploring the world with HydroGen. Ask your first question today and experience the future of knowledge discovery.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={handleLaunchApp}
                className="bg-white text-indigo-600 hover:bg-gray-100 text-lg px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
              >
                {user ? 'Go to App' : 'Start Using HydroGen'}
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white/10 text-lg px-8 py-4 rounded-lg"
                onClick={() => scrollToSection('features')}
              >
                Learn More
              </Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <div className="text-2xl font-bold">HydroGen</div>
                  <span className="text-xs font-medium px-2 py-1 bg-pink-500 rounded-full">Beta</span>
                </div>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  An experimental AI-powered answer engine built in 30 minutes with 99.9% accuracy and lightning-fast response times.
                </p>
                <div className="flex gap-4">
                  <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-indigo-600 transition-colors">
                    <TwitterIcon className="h-5 w-5" />
                  </a>
                  <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-indigo-600 transition-colors">
                    <LinkedinIcon className="h-5 w-5" />
                  </a>
                  <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-indigo-600 transition-colors">
                    <GithubIcon className="h-5 w-5" />
                  </a>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-bold mb-6">Product</h3>
                <ul className="space-y-3 text-gray-300">
                  <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-bold mb-6">Company</h3>
                <ul className="space-y-3 text-gray-300">
                  <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-bold mb-6">Legal</h3>
                <ul className="space-y-3 text-gray-300">
                  <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">GDPR</a></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-gray-700 pt-8 text-center">
              <p className="text-gray-400 text-sm">
                © 2025 HydroGen. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </ScrollArea>
  );
};

export default LandingPage;
