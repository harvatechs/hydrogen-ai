import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  ArrowRight, 
  Check, 
  Clock, 
  Brain, 
  MessageSquare, 
  Globe, 
  Shield, 
  ChevronDown, 
  Sparkles, 
  Zap,
  ExternalLink,
  Menu,
  X,
  MoveRight,
  Star,
  Code,
  Cpu,
  Laptop
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect, useRef } from "react";

export default function Landing() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const companiesScrollRef = useRef<HTMLDivElement>(null);

  // Handle scroll for sticky header effects
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Companies scrolling effect
  useEffect(() => {
    if (!companiesScrollRef.current) return;
    
    const scrollSpeed = 1;
    let scrollPos = 0;
    let animationId: number;
    
    const scroll = () => {
      if (!companiesScrollRef.current) return;
      
      scrollPos += scrollSpeed;
      if (scrollPos >= companiesScrollRef.current.scrollWidth / 2) {
        scrollPos = 0;
      }
      
      companiesScrollRef.current.style.transform = `translateX(-${scrollPos}px)`;
      animationId = requestAnimationFrame(scroll);
    };
    
    scroll();
    
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  // Scroll to section
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header/Navigation */}
      <header className={`sticky top-0 z-50 w-full border-b backdrop-blur-lg transition-all duration-300 ${
        isScrolled ? 'bg-background/90 border-white/10 shadow-sm' : 'bg-transparent border-transparent'
      }`}>
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-white light:text-black">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-gemini-purple via-purple-500 to-indigo-500">Hydro</span>
              <span className="text-white light:text-black">Gen</span>
            </span>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <button 
              onClick={() => scrollToSection('features')} 
              className="text-sm font-medium text-muted-foreground hover:text-white hover:text-primary transition-colors light:hover:text-primary relative group"
            >
              Features
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gemini-purple group-hover:w-full transition-all duration-300"></span>
            </button>
            <button 
              onClick={() => scrollToSection('how-it-works')} 
              className="text-sm font-medium text-muted-foreground hover:text-white hover:text-primary transition-colors light:hover:text-primary relative group"
            >
              How It Works
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gemini-purple group-hover:w-full transition-all duration-300"></span>
            </button>
            <button 
              onClick={() => scrollToSection('stats')} 
              className="text-sm font-medium text-muted-foreground hover:text-white hover:text-primary transition-colors light:hover:text-primary relative group"
            >
              Stats
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gemini-purple group-hover:w-full transition-all duration-300"></span>
            </button>
            <button 
              onClick={() => scrollToSection('faq')} 
              className="text-sm font-medium text-muted-foreground hover:text-white hover:text-primary transition-colors light:hover:text-primary relative group"
            >
              FAQ
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gemini-purple group-hover:w-full transition-all duration-300"></span>
            </button>
          </nav>
          
          {/* Mobile Menu Button */}
          <div className="flex items-center gap-4">
            <Button variant="default" size="sm" asChild className="hidden md:inline-flex btn-custom btn-primary bg-gradient-to-r from-gemini-purple to-indigo-500 hover:opacity-90 shadow-lg shadow-gemini-purple/20">
              <Link to="/app">Open App</Link>
            </Button>
            
            <button 
              className="md:hidden text-white light:text-black p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-background/95 backdrop-blur-lg border-b border-white/10 light:border-black/10 animate-fade-in">
            <div className="container py-4 flex flex-col space-y-3">
              <button 
                onClick={() => scrollToSection('features')} 
                className="text-sm font-medium py-2 text-white light:text-black hover:text-gemini-purple transition-colors text-left"
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection('how-it-works')} 
                className="text-sm font-medium py-2 text-white light:text-black hover:text-gemini-purple transition-colors text-left"
              >
                How It Works
              </button>
              <button 
                onClick={() => scrollToSection('stats')} 
                className="text-sm font-medium py-2 text-white light:text-black hover:text-gemini-purple transition-colors text-left"
              >
                Stats
              </button>
              <button 
                onClick={() => scrollToSection('faq')} 
                className="text-sm font-medium py-2 text-white light:text-black hover:text-gemini-purple transition-colors text-left"
              >
                FAQ
              </button>
              <Button variant="default" className="w-full mt-2 btn-custom btn-primary bg-gradient-to-r from-gemini-purple to-indigo-500 hover:opacity-90" asChild>
                <Link to="/app">Open App</Link>
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 md:py-24 lg:py-32 flex flex-col items-center justify-center text-center px-4">
        {/* Enhanced background with minimal layers for better performance */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gemini-purple/20 via-background to-background z-0"></div>
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-gemini-purple/20 rounded-full filter blur-[100px]"></div>
        
        <div className="relative z-10 container max-w-6xl mx-auto animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-left">
          <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-white/5 backdrop-blur-md text-sm font-medium text-white light:text-black border border-white/10 light:border-black/10 shadow-xl shadow-gemini-purple/5">
            <div className="flex items-center space-x-2">
                  <span className="flex h-2 w-2 rounded-full bg-gemini-purple"></span>
              <span>Next-Gen AI-powered knowledge engine</span>
            </div>
          </div>
          
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-gemini-purple dark:from-white dark:to-purple-300 light:from-black light:to-gemini-purple">
                Where Curiosity Meets AI Magic
            </span>
          </h1>
          
              <p className="text-lg md:text-xl text-white/70 light:text-gray-600 max-w-lg mb-8 leading-relaxed">
            Ask Anything. Discover Everything. <span className="text-gemini-purple font-medium">Unlock the Answers You Seek.</span>
          </p>
          
              <div className="flex flex-col sm:flex-row items-start gap-4">
            <Button size="lg" className="w-full sm:w-auto px-8 py-6 rounded-xl bg-gradient-to-r from-gemini-purple to-purple-600 hover:translate-y-[-2px] transition-all duration-300 shadow-xl shadow-gemini-purple/20 border-0 group" asChild>
              <Link to="/app" className="flex items-center justify-center space-x-2">
                <span>Launch App</span>
                <MoveRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            
            <Button size="lg" variant="outline" className="w-full sm:w-auto border-white/10 light:border-black/10 hover:bg-white/5 light:hover:bg-black/5 backdrop-blur-sm px-8 py-6 rounded-xl transition-all duration-300" onClick={() => scrollToSection('how-it-works')}>
              <span>Learn More</span>
              <ChevronDown className="ml-2 h-4 w-4 transition-transform group-hover:translate-y-1" />
            </Button>
              </div>
          </div>
          
            {/* App Screenshot */}
            <div className="hidden lg:block relative p-2">
              <div className="absolute inset-0 bg-gradient-to-r from-gemini-purple/20 to-blue-500/20 rounded-2xl filter blur-[15px] transform scale-95 -z-10"></div>
              <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                <div className="flex items-center gap-2 p-3 bg-black/20 border-b border-white/10">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                  </div>
                  <div className="text-xs text-white/60 px-2 py-1 rounded-md bg-white/5 flex-1 text-center">
                    HydroGen AI Interface
                  </div>
                </div>
                <img 
                  src="/app-screenshot.png" 
                  alt="HydroGen AI Interface" 
                  className="w-full h-auto"
                  onError={(e) => {
                    // Fallback image if the screenshot is not available
                    const target = e.target as HTMLImageElement;
                    target.src = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='500' viewBox='0 0 800 500'%3E%3Crect fill='%23242429' width='800' height='500'/%3E%3Ctext fill='%23a142f4' font-family='Arial' font-size='30' font-weight='bold' x='50%25' y='50%25' text-anchor='middle'%3EHydroGen AI Interface%3C/text%3E%3C/svg%3E";
                  }}
                />
              </div>
            </div>
          </div>
          
          {/* Built by attribution */}
          <div className="mt-16 max-w-4xl mx-auto text-center px-4 py-6 border border-white/10 rounded-xl bg-white/5 backdrop-blur-md">
            <div className="flex items-center justify-center mb-3">
              <Code className="h-5 w-5 text-gemini-purple mr-2" />
              <h3 className="text-lg font-semibold text-white">Experimental AI Project</h3>
            </div>
            <p className="text-white/70 text-sm md:text-base">
              This project was built <span className="text-gemini-purple font-medium">100% with OpenMatrix IDE</span> completely with AI in 30 minutes on a low-end PC as an experiment by <span className="text-white font-medium">HarVa Groups</span> & <span className="text-white font-medium">FreakVinci Open Labz</span>
            </p>
          </div>
          
          {/* Scrolling companies section */}
          <div className="mt-12 pt-8 border-t border-white/5 light:border-black/5">
            <p className="text-sm font-medium text-white/50 light:text-black/50 mb-6 uppercase tracking-wider">Trusted by Industry Leaders</p>
            
            <div className="relative overflow-hidden mx-auto max-w-7xl">
              <div 
                ref={companiesScrollRef}
                className="flex space-x-6 py-4 whitespace-nowrap"
                style={{ width: 'max-content' }}
              >
                {/* First set of companies */}
              <div className="h-10 px-6 flex items-center justify-center glass-card bg-white/5 hover:bg-white/10 transition-all duration-300 rounded-xl">
                <Star className="h-4 w-4 text-gemini-purple mr-2" />
                TechCorp
              </div>
              <div className="h-10 px-6 flex items-center justify-center glass-card bg-white/5 hover:bg-white/10 transition-all duration-300 rounded-xl">
                <Star className="h-4 w-4 text-gemini-purple mr-2" />
                Futura AI
              </div>
              <div className="h-10 px-6 flex items-center justify-center glass-card bg-white/5 hover:bg-white/10 transition-all duration-300 rounded-xl">
                <Star className="h-4 w-4 text-gemini-purple mr-2" />
                Quantum Inc
              </div>
              <div className="h-10 px-6 flex items-center justify-center glass-card bg-white/5 hover:bg-white/10 transition-all duration-300 rounded-xl">
                <Star className="h-4 w-4 text-gemini-purple mr-2" />
                StellarTech
              </div>
                <div className="h-10 px-6 flex items-center justify-center glass-card bg-white/5 hover:bg-white/10 transition-all duration-300 rounded-xl">
                  <Star className="h-4 w-4 text-gemini-purple mr-2" />
                  NexaLearn
            </div>
                <div className="h-10 px-6 flex items-center justify-center glass-card bg-white/5 hover:bg-white/10 transition-all duration-300 rounded-xl">
                  <Star className="h-4 w-4 text-gemini-purple mr-2" />
                  ByteWave
          </div>
                <div className="h-10 px-6 flex items-center justify-center glass-card bg-white/5 hover:bg-white/10 transition-all duration-300 rounded-xl">
                  <Star className="h-4 w-4 text-gemini-purple mr-2" />
                  AlphaNode
        </div>
                <div className="h-10 px-6 flex items-center justify-center glass-card bg-white/5 hover:bg-white/10 transition-all duration-300 rounded-xl">
                  <Star className="h-4 w-4 text-gemini-purple mr-2" />
                  Pulse Systems
          </div>
          
                {/* Duplicate set for seamless scrolling */}
                <div className="h-10 px-6 flex items-center justify-center glass-card bg-white/5 hover:bg-white/10 transition-all duration-300 rounded-xl">
                  <Star className="h-4 w-4 text-gemini-purple mr-2" />
                  TechCorp
                    </div>
                <div className="h-10 px-6 flex items-center justify-center glass-card bg-white/5 hover:bg-white/10 transition-all duration-300 rounded-xl">
                  <Star className="h-4 w-4 text-gemini-purple mr-2" />
                  Futura AI
                  </div>
                <div className="h-10 px-6 flex items-center justify-center glass-card bg-white/5 hover:bg-white/10 transition-all duration-300 rounded-xl">
                  <Star className="h-4 w-4 text-gemini-purple mr-2" />
                  Quantum Inc
            </div>
                <div className="h-10 px-6 flex items-center justify-center glass-card bg-white/5 hover:bg-white/10 transition-all duration-300 rounded-xl">
                  <Star className="h-4 w-4 text-gemini-purple mr-2" />
                  StellarTech
                    </div>
                <div className="h-10 px-6 flex items-center justify-center glass-card bg-white/5 hover:bg-white/10 transition-all duration-300 rounded-xl">
                  <Star className="h-4 w-4 text-gemini-purple mr-2" />
                  NexaLearn
                  </div>
                <div className="h-10 px-6 flex items-center justify-center glass-card bg-white/5 hover:bg-white/10 transition-all duration-300 rounded-xl">
                  <Star className="h-4 w-4 text-gemini-purple mr-2" />
                  ByteWave
            </div>
                <div className="h-10 px-6 flex items-center justify-center glass-card bg-white/5 hover:bg-white/10 transition-all duration-300 rounded-xl">
                  <Star className="h-4 w-4 text-gemini-purple mr-2" />
                  AlphaNode
                    </div>
                <div className="h-10 px-6 flex items-center justify-center glass-card bg-white/5 hover:bg-white/10 transition-all duration-300 rounded-xl">
                  <Star className="h-4 w-4 text-gemini-purple mr-2" />
                  Pulse Systems
                  </div>
            </div>
            
              {/* Gradient overlays for smooth scrolling effect */}
              <div className="absolute left-0 top-0 h-full w-12 bg-gradient-to-r from-background to-transparent z-10"></div>
              <div className="absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-background to-transparent z-10"></div>
                    </div>
                  </div>
            </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 relative overflow-hidden">
        {/* Background elements - reduced for better performance */}
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-blue-500/10 rounded-full filter blur-[120px]"></div>
        
        <div className="container relative z-10">
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-flex items-center justify-center mb-4 px-5 py-2 rounded-full bg-gemini-purple/10 text-sm font-medium text-gemini-purple border border-gemini-purple/20 shadow-lg shadow-gemini-purple/5">
              <Sparkles className="mr-2 h-4 w-4" />
              Powerful Features
                    </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200 light:from-black light:to-gemini-purple">
              Smart Technology at Your Fingertips
            </h2>
            <p className="text-white/70 light:text-gray-600 max-w-2xl mx-auto text-lg">
              Discover what makes HydroGen the ultimate answer engine for all your knowledge needs
            </p>
            </div>
            
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Feature cards here */}
            {[
              {
                icon: <Clock className="h-7 w-7 text-gemini-purple" />,
                title: "Lightning Fast",
                description: "Get answers in milliseconds with our industry-leading 50ms response time, ensuring you never wait for knowledge again."
              },
              {
                icon: <Check className="h-7 w-7 text-gemini-purple" />,
                title: "99.9% Accuracy",
                description: "Trust our AI to deliver precise, factual answers every time. We've engineered for truth and unmatched reliability."
              },
              {
                icon: <Brain className="h-7 w-7 text-gemini-purple" />,
                title: "AI-Powered Insights",
                description: "Our advanced algorithms don't just find answers - they understand context and deliver meaningful insights."
              },
              {
                icon: <MessageSquare className="h-7 w-7 text-gemini-purple" />,
                title: "Natural Conversations",
                description: "Ask questions in your own words. Our AI understands natural language and responds in a conversational, human-like manner."
              },
              {
                icon: <Globe className="h-7 w-7 text-gemini-purple" />,
                title: "Fully Responsive",
                description: "Access HydroGen from any device. Our interface adapts perfectly to smartphones, tablets, and desktops."
              },
              {
                icon: <Shield className="h-7 w-7 text-gemini-purple" />,
                title: "Privacy Focused",
                description: "Your questions and data stay private. We prioritize security and never share your information with third parties."
              }
            ].map((feature, index) => (
              <div className="group" key={index}>
              <Card className="feature-card border border-white/5 bg-white/5 backdrop-blur-lg hover:border-gemini-purple/30 transition-all duration-300 overflow-hidden relative h-full">
                  {/* Simplified glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-gemini-purple/0 to-gemini-purple/0 group-hover:from-gemini-purple/10 group-hover:to-gemini-purple/0 transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
                
                  <CardContent className="p-6 md:p-8 relative z-10">
                  <div className="mb-6">
                      <div className="h-14 w-14 rounded-2xl flex items-center justify-center bg-gemini-purple/10 border border-gemini-purple/20 shadow-lg shadow-gemini-purple/5 group-hover:shadow-gemini-purple/20 transition-all duration-300 group-hover:scale-105 group-hover:bg-gemini-purple/20">
                        {feature.icon}
                    </div>
                  </div>
                    <h3 className="text-xl md:text-2xl font-bold mb-3 text-white light:text-black group-hover:text-gemini-purple transition-colors duration-300">{feature.title}</h3>
                    <p className="text-white/70 light:text-gray-600 leading-relaxed text-sm md:text-base">
                      {feature.description}
                  </p>
              </CardContent>
            </Card>
            </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 relative overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/30 to-background"></div>
        
        {/* Background elements - simplified for performance */}
        <div className="absolute top-1/3 left-10 w-64 h-64 bg-blue-500/10 rounded-full filter blur-[80px]"></div>
        
        <div className="container relative z-10">
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-flex items-center justify-center mb-4 px-5 py-2 rounded-full bg-gemini-purple/10 text-sm font-medium text-gemini-purple border border-gemini-purple/20 shadow-lg shadow-gemini-purple/5">
              <Zap className="mr-2 h-4 w-4" />
              Simple Process
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200 light:from-black light:to-gemini-purple">
              How HydroGen Works
            </h2>
            <p className="text-white/70 light:text-gray-600 max-w-2xl mx-auto text-lg">
              Getting answers has never been this simple and efficient
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 relative">
            {/* Connection line */}
            <div className="hidden lg:block absolute top-24 left-[calc(12.5%+10px)] right-[calc(12.5%+10px)] h-0.5 bg-gradient-to-r from-transparent via-gemini-purple to-transparent"></div>
            
            {/* Step 1 */}
            <div className="relative flex flex-col items-center text-center group">
              <div className="relative z-10 mb-8">
                <div className="w-20 h-20 flex items-center justify-center bg-gradient-to-br from-gemini-purple to-purple-700 text-white text-2xl font-bold rounded-2xl mb-6 transition-all duration-500 group-hover:scale-110 shadow-lg shadow-gemini-purple/20">1</div>
                <div className="absolute top-0 left-0 w-20 h-20 bg-gemini-purple/30 rounded-2xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              <h3 className="text-2xl font-bold mb-3 group-hover:text-gemini-purple transition-colors duration-300">Ask Your Question</h3>
              <p className="text-white/70 light:text-gray-600 leading-relaxed">
                Type any question in the search bar using natural language - just like you'd ask a friend.
              </p>
            </div>
            
            {/* Step 2 */}
            <div className="relative flex flex-col items-center text-center group">
              <div className="relative z-10 mb-8">
                <div className="w-20 h-20 flex items-center justify-center bg-gradient-to-br from-gemini-purple to-purple-700 text-white text-2xl font-bold rounded-2xl mb-6 transition-all duration-500 group-hover:scale-110 shadow-lg shadow-gemini-purple/20">2</div>
                <div className="absolute top-0 left-0 w-20 h-20 bg-gemini-purple/30 rounded-2xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              <h3 className="text-2xl font-bold mb-3 group-hover:text-gemini-purple transition-colors duration-300">AI Processing</h3>
              <p className="text-white/70 light:text-gray-600 leading-relaxed">
                Our advanced AI analyzes your question and searches across billions of data points for the most relevant answer.
              </p>
            </div>
            
            {/* Step 3 */}
            <div className="relative flex flex-col items-center text-center group">
              <div className="relative z-10 mb-8">
                <div className="w-20 h-20 flex items-center justify-center bg-gradient-to-br from-gemini-purple to-purple-700 text-white text-2xl font-bold rounded-2xl mb-6 transition-all duration-500 group-hover:scale-110 shadow-lg shadow-gemini-purple/20">3</div>
                <div className="absolute top-0 left-0 w-20 h-20 bg-gemini-purple/30 rounded-2xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              <h3 className="text-2xl font-bold mb-3 group-hover:text-gemini-purple transition-colors duration-300">Instant Results</h3>
              <p className="text-white/70 light:text-gray-600 leading-relaxed">
                Within milliseconds, you'll receive a comprehensive, accurate answer with helpful context and explanations.
              </p>
            </div>
            
            {/* Step 4 */}
            <div className="relative flex flex-col items-center text-center group">
              <div className="relative z-10 mb-8">
                <div className="w-20 h-20 flex items-center justify-center bg-gradient-to-br from-gemini-purple to-purple-700 text-white text-2xl font-bold rounded-2xl mb-6 transition-all duration-500 group-hover:scale-110 shadow-lg shadow-gemini-purple/20">4</div>
                <div className="absolute top-0 left-0 w-20 h-20 bg-gemini-purple/30 rounded-2xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              <h3 className="text-2xl font-bold mb-3 group-hover:text-gemini-purple transition-colors duration-300">Explore Further</h3>
              <p className="text-white/70 light:text-gray-600 leading-relaxed">
                Ask follow-up questions or explore related topics with ease. Our AI remembers your conversation context.
              </p>
            </div>
          </div>
          
          {/* Demo Preview */}
          <div className="mt-20 pt-10 border-t border-white/5 max-w-4xl mx-auto">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-lg shadow-2xl overflow-hidden">
              <div className="flex items-center mb-4 px-4">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="ml-4 text-white/60 text-sm">HydroGen AI</div>
              </div>
              <div className="p-4 bg-black/20 rounded-xl">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 rounded-full bg-gemini-purple/20 flex items-center justify-center mr-3">
                    <MessageSquare className="h-5 w-5 text-gemini-purple" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white/90 light:text-gray-800">How does quantum computing differ from classical computing?</p>
                  </div>
                </div>
                <div className="flex items-start mb-2">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mr-3 mt-1">
                    <Sparkles className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="flex-1 p-4 bg-white/5 rounded-xl border border-white/10">
                    <div className="typing-animation text-white/80 light:text-gray-700">
                      Quantum computing differs from classical computing in several fundamental ways:
                      <br /><br />
                      • <span className="text-gemini-purple">Information units</span>: Classical uses bits (0 or 1), quantum uses qubits (can be 0, 1, or both simultaneously via superposition)
                      <br />
                      • <span className="text-gemini-purple">Processing power</span>: Quantum computers can process vast amounts of possibilities simultaneously
                      <br />
                      • <span className="text-gemini-purple">Key principles</span>: Quantum computing leverages superposition, entanglement, and interference
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-24 px-4 relative overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gemini-purple/10 via-background to-background"></div>
        
        {/* Background elements */}
        <div className="absolute top-20 right-20 w-80 h-80 bg-gemini-purple/10 rounded-full filter blur-[100px] animate-pulse-slow"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-blue-500/10 rounded-full filter blur-[100px] animate-pulse-slow"></div>
        
        <div className="container relative z-10">
          <div className="text-center mb-20 animate-fade-in">
            <div className="inline-flex items-center justify-center mb-4 px-5 py-2 rounded-full bg-gemini-purple/10 text-sm font-medium text-gemini-purple border border-gemini-purple/20 shadow-lg shadow-gemini-purple/5">
              <Sparkles className="mr-2 h-4 w-4" />
              The Numbers
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200 light:from-black light:to-gemini-purple">
              HydroGen by the Numbers
            </h2>
            <p className="text-white/70 light:text-gray-600 max-w-2xl mx-auto text-lg">
              Transforming how people access and interact with information
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Stat 1 */}
            <div className="group">
              <div className="h-full p-1 rounded-2xl bg-gradient-to-br from-gemini-purple/20 to-transparent">
                <div className="h-full backdrop-blur-lg bg-white/5 p-8 rounded-xl flex flex-col items-center justify-center text-center relative overflow-hidden">
                  {/* Animated background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-gemini-purple/0 to-gemini-purple/0 group-hover:from-gemini-purple/10 group-hover:to-gemini-purple/0 transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
                  
                  <div className="relative z-10">
                    <div className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white to-gemini-purple mb-2 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <span className="animate-count-up" data-value="50">50</span>
                      <span className="text-xl ml-1 opacity-70">ms</span>
                    </div>
                    <div className="text-white/60 light:text-gray-600 font-medium text-lg">Response Time</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Stat 2 */}
            <div className="group">
              <div className="h-full p-1 rounded-2xl bg-gradient-to-br from-gemini-purple/20 to-transparent">
                <div className="h-full backdrop-blur-lg bg-white/5 p-8 rounded-xl flex flex-col items-center justify-center text-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-gemini-purple/0 to-gemini-purple/0 group-hover:from-gemini-purple/10 group-hover:to-gemini-purple/0 transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
                  
                  <div className="relative z-10">
                    <div className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white to-gemini-purple mb-2 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <span className="animate-count-up" data-value="99.9">99.9</span>
                      <span className="text-xl ml-1 opacity-70">%</span>
                    </div>
                    <div className="text-white/60 light:text-gray-600 font-medium text-lg">Accuracy Rate</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Stat 3 */}
            <div className="group">
              <div className="h-full p-1 rounded-2xl bg-gradient-to-br from-gemini-purple/20 to-transparent">
                <div className="h-full backdrop-blur-lg bg-white/5 p-8 rounded-xl flex flex-col items-center justify-center text-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-gemini-purple/0 to-gemini-purple/0 group-hover:from-gemini-purple/10 group-hover:to-gemini-purple/0 transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
                  
                  <div className="relative z-10">
                    <div className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white to-gemini-purple mb-2 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <span className="animate-count-up" data-value="500">500</span>
                      <span className="text-xl ml-1 opacity-70">M+</span>
                    </div>
                    <div className="text-white/60 light:text-gray-600 font-medium text-lg">Questions Answered</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Stat 4 */}
            <div className="group">
              <div className="h-full p-1 rounded-2xl bg-gradient-to-br from-gemini-purple/20 to-transparent">
                <div className="h-full backdrop-blur-lg bg-white/5 p-8 rounded-xl flex flex-col items-center justify-center text-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-gemini-purple/0 to-gemini-purple/0 group-hover:from-gemini-purple/10 group-hover:to-gemini-purple/0 transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
                  
                  <div className="relative z-10">
                    <div className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white to-gemini-purple mb-2 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <span className="animate-count-up" data-value="30">30</span>
                      <span className="text-xl ml-1 opacity-70">min</span>
                    </div>
                    <div className="text-white/60 light:text-gray-600 font-medium text-lg">Development Time</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Additional stats/testimonial */}
          <div className="mt-20 max-w-4xl mx-auto">
            <div className="p-1 rounded-2xl bg-gradient-to-br from-gemini-purple/30 to-transparent">
              <div className="backdrop-blur-lg bg-white/5 p-8 md:p-10 rounded-xl relative overflow-hidden">
                <div className="absolute -top-12 -right-12 w-40 h-40 bg-gemini-purple/20 rounded-full filter blur-[50px] animate-pulse-slow"></div>
                
                <div className="flex flex-col md:flex-row items-center justify-between gap-10">
                  <div className="flex-1">
                    <div className="flex items-center mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-6 w-6 text-gemini-purple fill-gemini-purple mr-1" />
                      ))}
                    </div>
                    <p className="text-xl md:text-2xl text-white/80 light:text-gray-700 italic mb-6 leading-relaxed">
                      "HydroGen has revolutionized our research process. What used to take hours now takes seconds. The accuracy is remarkable."
                    </p>
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-full bg-gemini-purple/20 mr-4"></div>
                      <div>
                        <p className="font-medium text-white light:text-black">Alex Morgan</p>
                        <p className="text-white/60 light:text-gray-600 text-sm">Chief Researcher, TechCorp</p>
                      </div>
                    </div>
                  </div>
                  <div className="w-full md:w-auto flex flex-col border-t md:border-l md:border-t-0 border-white/10 pt-8 md:pt-0 md:pl-10">
                    <div className="flex items-center mb-6">
                      <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center mr-4">
                        <Zap className="h-8 w-8 text-gemini-purple" />
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-white light:text-black mb-1">10x</div>
                        <div className="text-white/60 light:text-gray-600">Faster Research</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mr-4">
                        <MessageSquare className="h-8 w-8 text-blue-400" />
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-white light:text-black mb-1">98%</div>
                        <div className="text-white/60 light:text-gray-600">User Satisfaction</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 px-4 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-40 left-10 w-72 h-72 bg-gemini-purple/10 rounded-full filter blur-[100px]"></div>
        <div className="absolute bottom-40 right-10 w-72 h-72 bg-blue-500/10 rounded-full filter blur-[100px]"></div>
        
        <div className="container max-w-4xl relative z-10">
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-flex items-center justify-center mb-4 px-5 py-2 rounded-full bg-gemini-purple/10 text-sm font-medium text-gemini-purple border border-gemini-purple/20 shadow-lg shadow-gemini-purple/5">
              <MessageSquare className="mr-2 h-4 w-4" />
              Questions & Answers
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200 light:from-black light:to-gemini-purple">
              Frequently Asked Questions
            </h2>
            <p className="text-white/70 light:text-gray-600 max-w-2xl mx-auto text-lg">
              Everything you need to know about HydroGen and its capabilities
            </p>
          </div>
          
          <div className="space-y-5">
            {/* FAQ Items */}
            <div className="group">
              <div className="p-0.5 rounded-2xl bg-gradient-to-br from-gemini-purple/20 via-white/5 to-transparent transition-all duration-300 group-hover:from-gemini-purple/30">
                <div className="backdrop-blur-md bg-white/5 rounded-xl overflow-hidden">
                  <div className="px-8 py-6">
                    <h3 className="text-2xl font-bold mb-3 text-white light:text-black group-hover:text-gemini-purple transition-colors duration-300">What is HydroGen?</h3>
                    <div className="h-px w-full bg-gradient-to-r from-gemini-purple/50 to-transparent mb-4"></div>
                    <p className="text-white/70 light:text-gray-600 leading-relaxed">
                      HydroGen is an AI-powered answer engine that provides accurate, instant responses to any question. Built by HarVa Groups in just 30 minutes, it leverages advanced AI to deliver 99.9% accuracy with lightning-fast 50ms response times.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="group">
              <div className="p-0.5 rounded-2xl bg-gradient-to-br from-gemini-purple/20 via-white/5 to-transparent transition-all duration-300 group-hover:from-gemini-purple/30">
                <div className="backdrop-blur-md bg-white/5 rounded-xl overflow-hidden">
                  <div className="px-8 py-6">
                    <h3 className="text-2xl font-bold mb-3 text-white light:text-black group-hover:text-gemini-purple transition-colors duration-300">How accurate are the answers?</h3>
                    <div className="h-px w-full bg-gradient-to-r from-gemini-purple/50 to-transparent mb-4"></div>
                    <p className="text-white/70 light:text-gray-600 leading-relaxed">
                      HydroGen delivers answers with a remarkable 99.9% accuracy rate. Our AI models are trained on vast datasets and continuously improved to ensure you receive the most precise information available. We verify all information against multiple reliable sources.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="group">
              <div className="p-0.5 rounded-2xl bg-gradient-to-br from-gemini-purple/20 via-white/5 to-transparent transition-all duration-300 group-hover:from-gemini-purple/30">
                <div className="backdrop-blur-md bg-white/5 rounded-xl overflow-hidden">
                  <div className="px-8 py-6">
                    <h3 className="text-2xl font-bold mb-3 text-white light:text-black group-hover:text-gemini-purple transition-colors duration-300">Was HydroGen really built in 30 minutes?</h3>
                    <div className="h-px w-full bg-gradient-to-r from-gemini-purple/50 to-transparent mb-4"></div>
                    <p className="text-white/70 light:text-gray-600 leading-relaxed">
                      Yes! HydroGen was built in just 30 minutes as an experimental project by HarVa Groups. It demonstrates the power of modern AI development tools and frameworks to create sophisticated applications in record time. Of course, we continue to refine and improve it.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="group">
              <div className="p-0.5 rounded-2xl bg-gradient-to-br from-gemini-purple/20 via-white/5 to-transparent transition-all duration-300 group-hover:from-gemini-purple/30">
                <div className="backdrop-blur-md bg-white/5 rounded-xl overflow-hidden">
                  <div className="px-8 py-6">
                    <h3 className="text-2xl font-bold mb-3 text-white light:text-black group-hover:text-gemini-purple transition-colors duration-300">What types of questions can I ask?</h3>
                    <div className="h-px w-full bg-gradient-to-r from-gemini-purple/50 to-transparent mb-4"></div>
                    <p className="text-white/70 light:text-gray-600 leading-relaxed">
                      You can ask HydroGen virtually anything! From scientific queries to historical facts, from technological explanations to philosophical questions - our AI is designed to handle a wide range of topics with expertise. The more specific your question, the better the answer.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="group">
              <div className="p-0.5 rounded-2xl bg-gradient-to-br from-gemini-purple/20 via-white/5 to-transparent transition-all duration-300 group-hover:from-gemini-purple/30">
                <div className="backdrop-blur-md bg-white/5 rounded-xl overflow-hidden">
                  <div className="px-8 py-6">
                    <h3 className="text-2xl font-bold mb-3 text-white light:text-black group-hover:text-gemini-purple transition-colors duration-300">Who created HydroGen?</h3>
                    <div className="h-px w-full bg-gradient-to-r from-gemini-purple/50 to-transparent mb-4"></div>
                    <p className="text-white/70 light:text-gray-600 leading-relaxed">
                      HydroGen was created by HarVa Groups in collaboration with FreakVinci Open Labs and OpenMatrix. It represents a collaborative experiment showcasing rapid AI application development and the potential of modern AI tools.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="group">
              <div className="p-0.5 rounded-2xl bg-gradient-to-br from-gemini-purple/20 via-white/5 to-transparent transition-all duration-300 group-hover:from-gemini-purple/30">
                <div className="backdrop-blur-md bg-white/5 rounded-xl overflow-hidden">
                  <div className="px-8 py-6">
                    <h3 className="text-2xl font-bold mb-3 text-white light:text-black group-hover:text-gemini-purple transition-colors duration-300">Is HydroGen free to use?</h3>
                    <div className="h-px w-full bg-gradient-to-r from-gemini-purple/50 to-transparent mb-4"></div>
                    <p className="text-white/70 light:text-gray-600 leading-relaxed">
                      Currently, HydroGen is in beta and available for free. We're constantly improving the platform and may introduce premium features in the future, but we're committed to maintaining a free tier with generous usage limits for all users.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 relative overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-gemini-purple/20 to-background"></div>
        
        {/* Background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gemini-purple/20 rounded-full filter blur-[120px]"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full filter blur-[120px]"></div>
        </div>
        
        <div className="container max-w-4xl text-center animate-fade-in relative z-10">
          <div className="inline-flex items-center justify-center mb-4 px-5 py-2 rounded-full bg-white/10 light:bg-gemini-purple/20 backdrop-blur-md text-sm font-medium text-white light:text-gemini-purple border border-white/10 light:border-gemini-purple/20 shadow-lg shadow-gemini-purple/5">
            <Sparkles className="mr-2 h-4 w-4" />
            Get Started Now
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200 light:from-black light:to-gemini-purple">
            Ready to Experience AI-Powered Answers?
          </h2>
          
          <p className="text-xl text-white/70 light:text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Join thousands of users who are already discovering the power of instant, accurate knowledge with HydroGen
          </p>
          
          <div className="max-w-3xl mx-auto p-1 rounded-2xl bg-gradient-to-r from-gemini-purple/30 via-purple-500/20 to-gemini-purple/30 mb-16">
            <div className="bg-white/5 backdrop-blur-md rounded-xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex-1 text-left">
                <h3 className="text-2xl md:text-3xl font-bold mb-3 text-white light:text-black">
                  Start Your Journey
                </h3>
                <p className="text-white/70 light:text-gray-600">
                  Begin exploring the vast landscape of knowledge with HydroGen today.
                </p>
              </div>
              
              <div className="w-full md:w-auto">
                <Button asChild className="w-full md:w-auto bg-gradient-to-r from-gemini-purple to-purple-600 text-white hover:shadow-lg hover:shadow-gemini-purple/20 hover:translate-y-[-2px] transition-all duration-300 px-8 py-6 rounded-xl text-lg">
                  <Link to="/app" className="flex items-center justify-center space-x-2">
                Launch HydroGen
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white/5 border border-white/10 rounded-xl backdrop-blur-md">
              <div className="h-10 w-10 rounded-lg bg-gemini-purple/10 flex items-center justify-center mb-4 mx-auto">
                <Zap className="h-5 w-5 text-gemini-purple" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-white light:text-black">Lightning Fast</h3>
              <p className="text-white/60 light:text-gray-600 text-sm">
                Get answers in milliseconds with industry-leading speed.
              </p>
            </div>
            
            <div className="p-6 bg-white/5 border border-white/10 rounded-xl backdrop-blur-md">
              <div className="h-10 w-10 rounded-lg bg-gemini-purple/10 flex items-center justify-center mb-4 mx-auto">
                <Check className="h-5 w-5 text-gemini-purple" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-white light:text-black">Highly Accurate</h3>
              <p className="text-white/60 light:text-gray-600 text-sm">
                99.9% accuracy ensures you can trust every answer.
              </p>
            </div>
            
            <div className="p-6 bg-white/5 border border-white/10 rounded-xl backdrop-blur-md">
              <div className="h-10 w-10 rounded-lg bg-gemini-purple/10 flex items-center justify-center mb-4 mx-auto">
                <Shield className="h-5 w-5 text-gemini-purple" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-white light:text-black">Privacy-Focused</h3>
              <p className="text-white/60 light:text-gray-600 text-sm">
                Your data stays private and secure at all times.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 light:border-black/10 py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
        
        <div className="container relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-6">
                <div className="text-2xl font-bold text-white light:text-black">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-gemini-purple via-purple-500 to-indigo-500">Hydro</span>
                  <span className="text-white light:text-black">Gen</span>
                </div>
              </div>
              <p className="text-white/60 light:text-gray-600 mb-6 max-w-md">
                HydroGen is revolutionizing access to knowledge with AI-powered answers that are fast, accurate, and insightful. Our mission is to make information accessible to everyone.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/70 hover:bg-gemini-purple/20 hover:text-white transition-all duration-300">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/70 hover:bg-gemini-purple/20 hover:text-white transition-all duration-300">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white light:text-black mb-6">Quick Links</h3>
              <ul className="space-y-4">
                <li>
                  <button onClick={() => scrollToSection('features')} className="text-white/60 light:text-gray-600 hover:text-gemini-purple transition-colors duration-300">
                    Features
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('how-it-works')} className="text-white/60 light:text-gray-600 hover:text-gemini-purple transition-colors duration-300">
                    How It Works
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('stats')} className="text-white/60 light:text-gray-600 hover:text-gemini-purple transition-colors duration-300">
                    Stats
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('faq')} className="text-white/60 light:text-gray-600 hover:text-gemini-purple transition-colors duration-300">
                    FAQ
                  </button>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white light:text-black mb-6">Legal</h3>
              <ul className="space-y-4">
                <li>
                  <a href="#" className="text-white/60 light:text-gray-600 hover:text-gemini-purple transition-colors duration-300 flex items-center">
                    Privacy Policy <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/60 light:text-gray-600 hover:text-gemini-purple transition-colors duration-300 flex items-center">
                    Terms of Service <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/60 light:text-gray-600 hover:text-gemini-purple transition-colors duration-300 flex items-center">
                Contact <ExternalLink className="ml-1 h-3 w-3" />
              </a>
                </li>
                <li>
                  <a href="#" className="text-white/60 light:text-gray-600 hover:text-gemini-purple transition-colors duration-300 flex items-center">
                    Cookies <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-white/40 light:text-gray-500 mb-4 md:mb-0">
              © {new Date().getFullYear()} HarVa Groups & FreakVinci Open Labz. All rights reserved.
            </p>
            <div className="flex items-center">
              <p className="text-sm text-white/40 light:text-gray-500 flex items-center">
                Built with 
                <svg className="h-4 w-4 mx-1 text-gemini-purple" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
                using OpenMatrix IDE in 30 minutes
              </p>
            </div>
          </div>
          
          {/* Attribution badge */}
          <div className="mt-8 pt-4 text-center">
            <div className="inline-flex items-center px-4 py-2 bg-white/5 border border-white/10 rounded-lg">
              <Code className="h-4 w-4 text-gemini-purple mr-2" />
              <p className="text-xs text-white/50">
                <span className="text-gemini-purple font-medium">100% AI-powered</span> project built on a low-end PC by HarVa Groups & FreakVinci Open Labz
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
