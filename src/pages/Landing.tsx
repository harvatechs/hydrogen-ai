
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
  X
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";

export default function Landing() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

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
        isScrolled ? 'bg-background/80 border-white/10' : 'bg-transparent border-transparent'
      }`}>
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-white light:text-black">
              <span className="text-gemini-purple">Hydro</span>Gen
            </span>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <button 
              onClick={() => scrollToSection('features')} 
              className="text-sm font-medium text-muted-foreground hover:text-white hover:text-primary transition-colors light:hover:text-primary"
            >
              Features
            </button>
            <button 
              onClick={() => scrollToSection('how-it-works')} 
              className="text-sm font-medium text-muted-foreground hover:text-white hover:text-primary transition-colors light:hover:text-primary"
            >
              How It Works
            </button>
            <button 
              onClick={() => scrollToSection('stats')} 
              className="text-sm font-medium text-muted-foreground hover:text-white hover:text-primary transition-colors light:hover:text-primary"
            >
              Stats
            </button>
            <button 
              onClick={() => scrollToSection('faq')} 
              className="text-sm font-medium text-muted-foreground hover:text-white hover:text-primary transition-colors light:hover:text-primary"
            >
              FAQ
            </button>
          </nav>
          
          {/* Mobile Menu Button */}
          <div className="flex items-center gap-4">
            <Button variant="default" size="sm" asChild className="hidden md:inline-flex btn-custom btn-primary">
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
              <Button variant="default" className="w-full mt-2 btn-custom btn-primary" asChild>
                <Link to="/app">Open App</Link>
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 md:py-24 lg:py-32 flex flex-col items-center justify-center text-center px-4">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gemini-purple/20 via-background to-background z-0"></div>
        <div className="relative z-10 container max-w-5xl animate-fade-in">
          <div className="inline-block mb-3 px-3 py-1 rounded-full bg-white/10 light:bg-black/5 backdrop-blur-sm text-xs font-medium text-white light:text-black border border-white/10 light:border-black/10">
            <span className="mr-1">✨</span> AI-powered answers to your questions
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight bg-gradient-to-r from-white to-white/70 dark:bg-clip-text dark:text-transparent light:text-black mb-6">
            Where Curiosity Meets<br className="hidden sm:block" /> AI Magic
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground light:text-gray-600 max-w-2xl mx-auto mb-10">
            Ask Anything. Discover Everything. Unlock the Answers You Seek
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="cta-button w-full sm:w-auto" asChild>
              <Link to="/app">
                Launch App
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            
            <Button size="lg" variant="outline" className="w-full sm:w-auto border-white/10 light:border-black/10 hover:bg-white/5 light:hover:bg-black/5" onClick={() => scrollToSection('how-it-works')}>
              Learn More
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
          <div className="mt-16 pt-16 border-t border-white/10 light:border-black/10">
            <p className="text-sm text-muted-foreground mb-6">Trusted by Industry Leaders</p>
            <div className="flex flex-wrap justify-center gap-6 opacity-70">
              <div className="h-10 px-4 flex items-center justify-center glass-card">TechCorp</div>
              <div className="h-10 px-4 flex items-center justify-center glass-card">Futura AI</div>
              <div className="h-10 px-4 flex items-center justify-center glass-card">Quantum Inc</div>
              <div className="h-10 px-4 flex items-center justify-center glass-card">StellarTech</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container">
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-flex items-center justify-center mb-4 px-4 py-1 rounded-full bg-gemini-purple/10 text-sm font-medium text-gemini-purple">
              <Sparkles className="mr-2 h-4 w-4" />
              Powerful Features
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Smart Technology at Your Fingertips
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover what makes HydroGen the ultimate answer engine
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Feature 1 */}
            <Card className="feature-card">
              <CardContent className="p-0">
                <div className="p-6 space-y-4">
                  <div className="h-12 w-12 rounded-lg flex items-center justify-center bg-gemini-purple/10">
                    <Clock className="h-6 w-6 text-gemini-purple" />
                  </div>
                  <h3 className="text-xl font-bold">Lightning Fast</h3>
                  <p className="text-muted-foreground">
                    Get answers in milliseconds with our industry-leading 50ms response time, ensuring you never wait for knowledge.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            {/* Feature 2 */}
            <Card className="feature-card">
              <CardContent className="p-0">
                <div className="p-6 space-y-4">
                  <div className="h-12 w-12 rounded-lg flex items-center justify-center bg-gemini-purple/10">
                    <Check className="h-6 w-6 text-gemini-purple" />
                  </div>
                  <h3 className="text-xl font-bold">99.9% Accuracy</h3>
                  <p className="text-muted-foreground">
                    Trust our AI to deliver precise, factual answers every time. We've engineered for truth and reliability.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            {/* Feature 3 */}
            <Card className="feature-card">
              <CardContent className="p-0">
                <div className="p-6 space-y-4">
                  <div className="h-12 w-12 rounded-lg flex items-center justify-center bg-gemini-purple/10">
                    <Brain className="h-6 w-6 text-gemini-purple" />
                  </div>
                  <h3 className="text-xl font-bold">AI-Powered Insights</h3>
                  <p className="text-muted-foreground">
                    Our advanced algorithms don't just find answers - they understand context and deliver meaningful insights.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            {/* Feature 4 */}
            <Card className="feature-card">
              <CardContent className="p-0">
                <div className="p-6 space-y-4">
                  <div className="h-12 w-12 rounded-lg flex items-center justify-center bg-gemini-purple/10">
                    <MessageSquare className="h-6 w-6 text-gemini-purple" />
                  </div>
                  <h3 className="text-xl font-bold">Natural Conversations</h3>
                  <p className="text-muted-foreground">
                    Ask questions in your own words. Our AI understands natural language and responds conversationally.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            {/* Feature 5 */}
            <Card className="feature-card">
              <CardContent className="p-0">
                <div className="p-6 space-y-4">
                  <div className="h-12 w-12 rounded-lg flex items-center justify-center bg-gemini-purple/10">
                    <Globe className="h-6 w-6 text-gemini-purple" />
                  </div>
                  <h3 className="text-xl font-bold">Fully Responsive</h3>
                  <p className="text-muted-foreground">
                    Access HydroGen from any device. Our interface adapts perfectly to smartphones, tablets, and desktops.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            {/* Feature 6 */}
            <Card className="feature-card">
              <CardContent className="p-0">
                <div className="p-6 space-y-4">
                  <div className="h-12 w-12 rounded-lg flex items-center justify-center bg-gemini-purple/10">
                    <Shield className="h-6 w-6 text-gemini-purple" />
                  </div>
                  <h3 className="text-xl font-bold">Privacy Focused</h3>
                  <p className="text-muted-foreground">
                    Your questions and data stay private. We prioritize security and never share your information with third parties.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 bg-secondary/30 light:bg-accent/30">
        <div className="container">
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-flex items-center justify-center mb-4 px-4 py-1 rounded-full bg-gemini-purple/10 text-sm font-medium text-gemini-purple">
              <Zap className="mr-2 h-4 w-4" />
              Simple Process
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Getting answers has never been this simple
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="relative flex flex-col items-center text-center group">
              <div className="relative">
                <div className="w-16 h-16 flex items-center justify-center bg-gemini-purple text-white text-2xl font-bold rounded-full mb-6 transition-all duration-300 group-hover:scale-110">1</div>
                <div className="absolute top-0 left-0 w-16 h-16 bg-gemini-purple/30 rounded-full blur-lg opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <h3 className="text-xl font-bold mb-2">Ask Your Question</h3>
              <p className="text-muted-foreground">
                Type any question in the search bar using natural language.
              </p>
            </div>
            
            {/* Step 2 */}
            <div className="relative flex flex-col items-center text-center group">
              <div className="relative">
                <div className="w-16 h-16 flex items-center justify-center bg-gemini-purple text-white text-2xl font-bold rounded-full mb-6 transition-all duration-300 group-hover:scale-110">2</div>
                <div className="absolute top-0 left-0 w-16 h-16 bg-gemini-purple/30 rounded-full blur-lg opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <h3 className="text-xl font-bold mb-2">AI Processing</h3>
              <p className="text-muted-foreground">
                Our AI analyzes your question and searches for the most accurate answer.
              </p>
            </div>
            
            {/* Step 3 */}
            <div className="relative flex flex-col items-center text-center group">
              <div className="relative">
                <div className="w-16 h-16 flex items-center justify-center bg-gemini-purple text-white text-2xl font-bold rounded-full mb-6 transition-all duration-300 group-hover:scale-110">3</div>
                <div className="absolute top-0 left-0 w-16 h-16 bg-gemini-purple/30 rounded-full blur-lg opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <h3 className="text-xl font-bold mb-2">Instant Results</h3>
              <p className="text-muted-foreground">
                Within milliseconds, you'll receive a comprehensive, accurate answer.
              </p>
            </div>
            
            {/* Step 4 */}
            <div className="relative flex flex-col items-center text-center group">
              <div className="relative">
                <div className="w-16 h-16 flex items-center justify-center bg-gemini-purple text-white text-2xl font-bold rounded-full mb-6 transition-all duration-300 group-hover:scale-110">4</div>
                <div className="absolute top-0 left-0 w-16 h-16 bg-gemini-purple/30 rounded-full blur-lg opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <h3 className="text-xl font-bold mb-2">Explore Further</h3>
              <p className="text-muted-foreground">
                Ask follow-up questions or explore related topics with ease.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-20 px-4 bg-gradient-to-b from-background to-secondary/20 light:from-background light:to-accent/20">
        <div className="container">
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-flex items-center justify-center mb-4 px-4 py-1 rounded-full bg-gemini-purple/10 text-sm font-medium text-gemini-purple">
              <Sparkles className="mr-2 h-4 w-4" />
              The Numbers
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">HydroGen by the Numbers</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We're changing how people access information
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-transparent border-0 shadow-none">
              <CardContent className="p-6 glass-card h-full flex flex-col items-center justify-center">
                <div className="text-4xl md:text-5xl font-bold text-gemini-purple mb-2">50</div>
                <div className="text-center text-muted-foreground">Millisecond Response</div>
              </CardContent>
            </Card>
            
            <Card className="bg-transparent border-0 shadow-none">
              <CardContent className="p-6 glass-card h-full flex flex-col items-center justify-center">
                <div className="text-4xl md:text-5xl font-bold text-gemini-purple mb-2">99.9</div>
                <div className="text-center text-muted-foreground">Accuracy Rate</div>
              </CardContent>
            </Card>
            
            <Card className="bg-transparent border-0 shadow-none">
              <CardContent className="p-6 glass-card h-full flex flex-col items-center justify-center">
                <div className="text-4xl md:text-5xl font-bold text-gemini-purple mb-2">500</div>
                <div className="text-center text-muted-foreground">Million+ Questions</div>
              </CardContent>
            </Card>
            
            <Card className="bg-transparent border-0 shadow-none">
              <CardContent className="p-6 glass-card h-full flex flex-col items-center justify-center">
                <div className="text-4xl md:text-5xl font-bold text-gemini-purple mb-2">30</div>
                <div className="text-center text-muted-foreground">Minutes to Build This</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-4">
        <div className="container max-w-4xl">
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-flex items-center justify-center mb-4 px-4 py-1 rounded-full bg-gemini-purple/10 text-sm font-medium text-gemini-purple">
              <MessageSquare className="mr-2 h-4 w-4" />
              Questions & Answers
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to know about HydroGen
            </p>
          </div>
          
          <div className="space-y-6">
            {/* FAQ Items */}
            <Card className="feature-card overflow-hidden">
              <CardContent className="p-0">
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">What is HydroGen?</h3>
                  <p className="text-muted-foreground">
                    HydroGen is an AI-powered answer engine that provides accurate, instant responses to any question. Built by HarVa Groups in just 30 minutes, it leverages advanced AI to deliver 99.9% accuracy with 50ms response times.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="feature-card overflow-hidden">
              <CardContent className="p-0">
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">How accurate are the answers?</h3>
                  <p className="text-muted-foreground">
                    HydroGen delivers answers with a remarkable 99.9% accuracy rate. Our AI models are trained on vast datasets and continuously improved to ensure you receive the most precise information available.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="feature-card overflow-hidden">
              <CardContent className="p-0">
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">Was HydroGen really built in 30 minutes?</h3>
                  <p className="text-muted-foreground">
                    Yes! HydroGen was built in just 30 minutes as an experimental project by HarVa Groups. It demonstrates the power of modern AI development tools to create sophisticated applications in record time.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="feature-card overflow-hidden">
              <CardContent className="p-0">
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">What types of questions can I ask?</h3>
                  <p className="text-muted-foreground">
                    You can ask HydroGen virtually anything! From scientific queries to historical facts, from technological explanations to philosophical questions - our AI is designed to handle a wide range of topics with expertise.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="feature-card overflow-hidden">
              <CardContent className="p-0">
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">Who created HydroGen?</h3>
                  <p className="text-muted-foreground">
                    HydroGen was created by HarVa Groups in collaboration with FreakVinci Open Labs and OpenMatrix. It represents a collaborative experiment showcasing rapid AI application development.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="feature-card overflow-hidden">
              <CardContent className="p-0">
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">Is HydroGen free to use?</h3>
                  <p className="text-muted-foreground">
                    Currently, HydroGen is in beta and available for free. We're constantly improving the platform and may introduce premium features in the future, but we're committed to maintaining a free tier.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gemini-purple/20 light:bg-gemini-purple/10">
        <div className="container max-w-4xl text-center animate-fade-in">
          <div className="inline-flex items-center justify-center mb-4 px-4 py-1 rounded-full bg-white/10 light:bg-gemini-purple/20 backdrop-blur-sm text-sm font-medium text-white light:text-gemini-purple">
            <Sparkles className="mr-2 h-4 w-4" />
            Get Started Now
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Experience AI-Powered Answers?</h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Join thousands of users who are already discovering the power of instant, accurate knowledge
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild className="cta-button sm:px-10">
              <Link to="/app">
                Launch HydroGen
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            
            <Button variant="outline" className="border-white/10 light:border-gemini-purple/20 hover:bg-white/5 light:hover:bg-gemini-purple/10" onClick={() => scrollToSection('features')}>
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 light:border-black/10 py-12 px-4">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="text-xl font-bold text-white light:text-black mb-2">
                <span className="text-gemini-purple">Hydro</span>Gen
              </div>
              <p className="text-sm text-muted-foreground">
                © 2025 HarVa Groups. All rights reserved.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-4 md:gap-8">
              <a href="#" className="text-sm text-muted-foreground hover:text-white hover:text-primary transition-colors light:hover:text-primary flex items-center">
                Privacy <ExternalLink className="ml-1 h-3 w-3" />
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-white hover:text-primary transition-colors light:hover:text-primary flex items-center">
                Terms <ExternalLink className="ml-1 h-3 w-3" />
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-white hover:text-primary transition-colors light:hover:text-primary flex items-center">
                Contact <ExternalLink className="ml-1 h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
