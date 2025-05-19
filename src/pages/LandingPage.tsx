
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { CheckIcon, BrainIcon, ShieldIcon, MessageSquareIcon, SmartphoneIcon, ZapIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ChatGptButton } from "@/components/ui/chatgpt-button";

const LandingPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  
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
  
  // Animated counter
  const AnimatedCounter = ({ end, duration = 2000, label }: { end: number; duration?: number; label: string }) => {
    const [count, setCount] = useState(0);
    const countRef = useRef<HTMLSpanElement>(null);
    
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
      <div className="flex flex-col items-center">
        <div className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
          {label.includes("ms") ? `${count}ms` : label.includes("%") ? `${count}%` : `${count}M+`}
        </div>
        <div className="text-sm text-muted-foreground mt-2">{label}</div>
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 py-20 md:py-32">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-purple-950/20 z-10" />
          <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] z-0" />
          
          <div className="absolute -bottom-40 left-0 right-0 h-[400px] bg-gradient-to-t from-gemini-purple/20 via-accent/5 to-transparent blur-3xl opacity-30 z-0"></div>
        </div>
        
        <div className="container relative z-20 max-w-5xl mx-auto text-center">
          <div className="space-y-4 mb-8">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight bg-gradient-to-r from-white via-white to-purple-300 dark:from-white dark:via-white dark:to-purple-300 bg-clip-text text-transparent pb-2 animate-fade-in">
              HydroGen AI –<br className="md:hidden" /> Answers at the Speed of Thought
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto text-muted-foreground animate-fade-in animation-delay-100">
              Lightning-fast, contextual, and AI-powered search engine built for the curious mind.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10 animate-fade-in animation-delay-200">
            <Link to="/app">
              <ChatGptButton variant="primary" size="lg" className="w-full sm:w-auto">
                <ZapIcon className="mr-2 h-5 w-5" />
                Launch App
              </ChatGptButton>
            </Link>
            <Button variant="outline" size="lg" className="w-full sm:w-auto" onClick={() => {
              const featuresElement = document.getElementById("features");
              featuresElement?.scrollIntoView({ behavior: "smooth" });
            }}>
              Learn More
            </Button>
          </div>
          
          {/* Demo showcase */}
          <div className="mt-16 md:mt-20 max-w-4xl mx-auto relative glass-card p-4 md:p-6 animate-fade-in animation-delay-500">
            <div className="relative rounded-lg overflow-hidden bg-black/50 backdrop-blur-sm border border-white/10">
              <div className="p-4 md:p-6 text-left">
                <div className="flex items-center mb-4">
                  <div className="flex items-center space-x-2 ml-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex">
                    <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold mr-3 flex-shrink-0">U</div>
                    <div className="bg-gray-700/40 rounded-2xl p-3 text-gray-200 max-w-[80%]">
                      What is the fastest AI answer engine in 2025?
                    </div>
                  </div>
                  <div className="flex">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold mr-3 flex-shrink-0">H</div>
                    <div className="bg-gray-800/80 rounded-2xl p-3 text-gray-100 max-w-[80%]">
                      <p>The fastest AI answer engine in 2025 is <span className="font-bold text-purple-300">HydroGen AI</span>, with an industry-leading average response time of just <span className="font-bold text-purple-300">50ms</span>.</p>
                      <p className="mt-2">It combines advanced neural processing with optimized algorithms to deliver accurate answers nearly instantly, outperforming competitors by 200-300%.</p>
                      <p className="typing-animation mt-2">Would you like to know more about HydroGen's technology?</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="text-muted-foreground"
          >
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </div>
      </section>
      
      {/* Key Features */}
      <section id="features" className="py-20 px-4 relative">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">✨ Key Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover what makes HydroGen AI the most powerful answer engine available today
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Feature 1 */}
            <div className="feature-card border p-6 flex flex-col">
              <div className="h-14 w-14 rounded-full bg-gradient-to-br from-yellow-400 to-orange-600 flex items-center justify-center text-white mb-5">
                <ZapIcon size={28} />
              </div>
              <h3 className="text-xl font-bold mb-2">⚡ Lightning Fast</h3>
              <p className="text-muted-foreground flex-grow">Answers delivered in as little as 50ms — faster than the blink of an eye.</p>
            </div>
            
            {/* Feature 2 */}
            <div className="feature-card border p-6 flex flex-col">
              <div className="h-14 w-14 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white mb-5">
                <CheckIcon size={28} />
              </div>
              <h3 className="text-xl font-bold mb-2">🎯 99.9% Accuracy</h3>
              <p className="text-muted-foreground flex-grow">Trustworthy and factual responses you can rely on for critical decisions.</p>
            </div>
            
            {/* Feature 3 */}
            <div className="feature-card border p-6 flex flex-col">
              <div className="h-14 w-14 rounded-full bg-gradient-to-br from-purple-400 to-indigo-600 flex items-center justify-center text-white mb-5">
                <BrainIcon size={28} />
              </div>
              <h3 className="text-xl font-bold mb-2">🧠 AI-Powered Insights</h3>
              <p className="text-muted-foreground flex-grow">Understands questions in context, delivering intelligent and relevant answers.</p>
            </div>
            
            {/* Feature 4 */}
            <div className="feature-card border p-6 flex flex-col">
              <div className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-400 to-sky-600 flex items-center justify-center text-white mb-5">
                <ShieldIcon size={28} />
              </div>
              <h3 className="text-xl font-bold mb-2">🛡️ Privacy-Focused</h3>
              <p className="text-muted-foreground flex-grow">No tracking. Your data stays yours, ensuring complete confidentiality.</p>
            </div>
            
            {/* Feature 5 */}
            <div className="feature-card border p-6 flex flex-col">
              <div className="h-14 w-14 rounded-full bg-gradient-to-br from-pink-400 to-rose-600 flex items-center justify-center text-white mb-5">
                <MessageSquareIcon size={28} />
              </div>
              <h3 className="text-xl font-bold mb-2">💬 Natural Conversations</h3>
              <p className="text-muted-foreground flex-grow">Talk to AI like you're texting a friend, with fluid back-and-forth exchanges.</p>
            </div>
            
            {/* Feature 6 */}
            <div className="feature-card border p-6 flex flex-col">
              <div className="h-14 w-14 rounded-full bg-gradient-to-br from-teal-400 to-cyan-600 flex items-center justify-center text-white mb-5">
                <SmartphoneIcon size={28} />
              </div>
              <h3 className="text-xl font-bold mb-2">📱 Fully Responsive</h3>
              <p className="text-muted-foreground flex-grow">Works seamlessly across all devices — from desktop to mobile and tablets.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works */}
      <section className="py-20 px-4 bg-gradient-to-b from-background to-background/80 relative">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">🧪 How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Experience the simplicity and power of HydroGen AI in four easy steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="relative">
              <div className="glass-card p-6 h-full flex flex-col items-center text-center relative z-10">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white mb-5 text-2xl font-bold">1</div>
                <h3 className="text-xl font-bold mb-3">Ask Your Question</h3>
                <p className="text-muted-foreground">Type naturally — no keywords needed</p>
              </div>
              <div className="hidden md:block absolute top-1/2 left-full h-0.5 w-full bg-gradient-to-r from-purple-500 to-transparent -translate-y-1/2 -translate-x-8 z-0"></div>
            </div>
            
            {/* Step 2 */}
            <div className="relative">
              <div className="glass-card p-6 h-full flex flex-col items-center text-center relative z-10">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white mb-5 text-2xl font-bold">2</div>
                <h3 className="text-xl font-bold mb-3">AI Gets to Work</h3>
                <p className="text-muted-foreground">HydroGen analyzes and understands your intent</p>
              </div>
              <div className="hidden md:block absolute top-1/2 left-full h-0.5 w-full bg-gradient-to-r from-indigo-500 to-transparent -translate-y-1/2 -translate-x-8 z-0"></div>
            </div>
            
            {/* Step 3 */}
            <div className="relative">
              <div className="glass-card p-6 h-full flex flex-col items-center text-center relative z-10">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white mb-5 text-2xl font-bold">3</div>
                <h3 className="text-xl font-bold mb-3">Instant Results</h3>
                <p className="text-muted-foreground">Accurate answers in under a second</p>
              </div>
              <div className="hidden md:block absolute top-1/2 left-full h-0.5 w-full bg-gradient-to-r from-blue-500 to-transparent -translate-y-1/2 -translate-x-8 z-0"></div>
            </div>
            
            {/* Step 4 */}
            <div>
              <div className="glass-card p-6 h-full flex flex-col items-center text-center">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center text-white mb-5 text-2xl font-bold">4</div>
                <h3 className="text-xl font-bold mb-3">Explore More</h3>
                <p className="text-muted-foreground">Ask follow-ups, refine queries, stay curious</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="py-20 px-4" ref={statsRef}>
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">📊 By the Numbers</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              HydroGen AI achieves remarkable performance metrics that set new industry standards
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            {isVisible && (
              <>
                <AnimatedCounter end={50} label="Average Response Time" />
                <AnimatedCounter end={99.9} label="Accuracy Rate %" />
                <AnimatedCounter end={500} label="Questions Answered" />
                <AnimatedCounter end={30} label="Built In Minutes" />
              </>
            )}
          </div>
        </div>
      </section>
      
      {/* Tech Stack */}
      <section className="py-20 px-4 bg-gradient-to-b from-background to-background/80">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">🖥️ Tech Stack</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Built with modern technologies for performance, flexibility, and developer experience
            </p>
          </div>
          
          <div className="max-w-2xl mx-auto glass-card border p-6">
            <pre className="text-sm md:text-base overflow-x-auto">
              <code className="language-typescript block whitespace-pre rounded text-left p-4 bg-black/30">
                {`// HydroGen AI Technology Stack
                
const techStack = {
  frontend: [
    "React + TypeScript",
    "Tailwind CSS",
    "Shadcn UI Components"
  ],
  icons: "Lucide React",
  design: [
    "Responsive layout (mobile-first)",
    "Gradient-rich UI",
    "Dark/light mode support"
  ],
  performance: {
    responseTime: "~50ms",
    accuracy: "99.9%",
    devTime: "30 minutes"
  }
};

// Start using HydroGen today!`}
              </code>
            </pre>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-20 px-4">
        <div className="container max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">🙋 Frequently Asked Questions</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to know about HydroGen AI
            </p>
          </div>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-left">What is HydroGen?</AccordionTrigger>
              <AccordionContent>
                HydroGen is an AI-powered answer engine that delivers instant, reliable answers. Created in 30 minutes as a showcase by HarVa Groups, it represents the cutting edge of AI response technology.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-left">How accurate are the answers?</AccordionTrigger>
              <AccordionContent>
                HydroGen boasts a 99.9% accuracy rate by using high-quality datasets and continuous learning algorithms. Our system is constantly improving through feedback and validation processes.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-left">Was it really built in 30 minutes?</AccordionTrigger>
              <AccordionContent>
                Yes, it was! HydroGen is a testament to rapid prototyping and development with modern AI tools. Our team leveraged state-of-the-art frameworks and pre-built components to create a functional product in minimal time.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4">
              <AccordionTrigger className="text-left">What questions can I ask?</AccordionTrigger>
              <AccordionContent>
                Literally anything — science, history, tech, philosophy, or just random curiosities. HydroGen's knowledge base spans across domains and can handle both factual queries and more nuanced questions requiring reasoning.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-5">
              <AccordionTrigger className="text-left">Who created HydroGen?</AccordionTrigger>
              <AccordionContent>
                Built by HarVa Groups in collaboration with FreakVinci Open Labs and OpenMatrix. Our team combines expertise in AI, UX design, and software development to push the boundaries of what's possible.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-6">
              <AccordionTrigger className="text-left">Is HydroGen free to use?</AccordionTrigger>
              <AccordionContent>
                Currently in beta and free to use. Future versions may include premium features, but a free tier will always remain available to ensure accessibility for all users.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>
      
      {/* About the Creators */}
      <section className="py-16 px-4 bg-gradient-to-b from-background to-background/80">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">🤝 About the Creators</h2>
          </div>
          
          <div className="flex flex-col md:flex-row justify-center items-center gap-8">
            <div className="glass-card p-6 text-center max-w-xs flex-1">
              <div className="h-16 w-16 mx-auto rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white mb-4 text-xl font-bold">H</div>
              <h3 className="text-lg font-bold mb-2">HarVa Groups</h3>
              <p className="text-muted-foreground text-sm">Lead development and AI architecture</p>
            </div>
            
            <div className="glass-card p-6 text-center max-w-xs flex-1">
              <div className="h-16 w-16 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white mb-4 text-xl font-bold">F</div>
              <h3 className="text-lg font-bold mb-2">FreakVinci Open Labs</h3>
              <p className="text-muted-foreground text-sm">UI/UX design and user experience</p>
            </div>
            
            <div className="glass-card p-6 text-center max-w-xs flex-1">
              <div className="h-16 w-16 mx-auto rounded-full bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white mb-4 text-xl font-bold">O</div>
              <h3 className="text-lg font-bold mb-2">OpenMatrix</h3>
              <p className="text-muted-foreground text-sm">Data processing and optimization</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-purple-950/30 z-10" />
          <div className="absolute -bottom-40 left-0 right-0 h-[400px] bg-gradient-to-t from-gemini-purple/30 via-accent/5 to-transparent blur-3xl opacity-30 z-0"></div>
        </div>
        
        <div className="container max-w-4xl mx-auto relative z-10">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-6 bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent">
              Start Using HydroGen — Ask Anything.<br/>Discover Everything.
            </h2>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Join thousands of curious minds using HydroGen AI for instant answers to their most pressing questions.
            </p>
            
            <Link to="/app">
              <ChatGptButton variant="primary" size="lg" className="mx-auto cta-button">
                <ZapIcon className="mr-2 h-5 w-5" />
                Launch HydroGen Now
              </ChatGptButton>
            </Link>
            
            <div className="mt-16 pt-6 border-t border-border flex justify-center space-x-8">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Terms of Use</a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Contact</a>
            </div>
            
            <div className="mt-6 text-sm text-muted-foreground">
              © {new Date().getFullYear()} HydroGen AI. All rights reserved.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
