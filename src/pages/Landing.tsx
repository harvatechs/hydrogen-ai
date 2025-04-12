
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Clock, Brain, MessageSquare, Globe, Shield, ChevronDown } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";

export default function Landing() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header/Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-white/10 backdrop-blur-lg bg-background/70">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-white">HydroGen</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors">How It Works</a>
            <a href="#stats" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors">Stats</a>
            <a href="#faq" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors">FAQ</a>
          </nav>
          <div>
            <Button variant="default" size="sm" asChild>
              <Link to="/app">Open App</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32 flex flex-col items-center justify-center text-center px-4">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gemini-purple/20 via-background to-background z-0"></div>
        <div className="container relative z-10 max-w-5xl">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent mb-6">
            Where Curiosity Meets AI Magic
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Ask Anything. Discover Everything. Unlock the Answers You Seek
          </p>
          <Button size="lg" className="px-8 py-6 text-base rounded-full" asChild>
            <Link to="/app">
              Launch App
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          
          <div className="mt-12 pt-12 border-t border-white/10">
            <p className="text-sm text-muted-foreground mb-6">Trusted by Industry Leaders</p>
            <div className="flex flex-wrap justify-center gap-8 opacity-70">
              <div className="h-8 w-24 bg-white/10 rounded flex items-center justify-center">Company 1</div>
              <div className="h-8 w-24 bg-white/10 rounded flex items-center justify-center">Company 2</div>
              <div className="h-8 w-24 bg-white/10 rounded flex items-center justify-center">Company 3</div>
              <div className="h-8 w-24 bg-white/10 rounded flex items-center justify-center">Company 4</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover what makes HydroGen the ultimate answer engine
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card className="bg-secondary/50 border-white/5">
              <CardContent className="p-6">
                <Clock className="h-10 w-10 mb-4 text-gemini-purple" />
                <h3 className="text-xl font-bold mb-2">Lightning Fast</h3>
                <p className="text-muted-foreground">
                  Get answers in milliseconds with our industry-leading 50ms response time, ensuring you never wait for knowledge.
                </p>
              </CardContent>
            </Card>
            
            {/* Feature 2 */}
            <Card className="bg-secondary/50 border-white/5">
              <CardContent className="p-6">
                <Check className="h-10 w-10 mb-4 text-gemini-purple" />
                <h3 className="text-xl font-bold mb-2">99.9% Accuracy</h3>
                <p className="text-muted-foreground">
                  Trust our AI to deliver precise, factual answers every time. We've engineered for truth and reliability.
                </p>
              </CardContent>
            </Card>
            
            {/* Feature 3 */}
            <Card className="bg-secondary/50 border-white/5">
              <CardContent className="p-6">
                <Brain className="h-10 w-10 mb-4 text-gemini-purple" />
                <h3 className="text-xl font-bold mb-2">AI-Powered Insights</h3>
                <p className="text-muted-foreground">
                  Our advanced algorithms don't just find answers - they understand context and deliver meaningful insights.
                </p>
              </CardContent>
            </Card>
            
            {/* Feature 4 */}
            <Card className="bg-secondary/50 border-white/5">
              <CardContent className="p-6">
                <MessageSquare className="h-10 w-10 mb-4 text-gemini-purple" />
                <h3 className="text-xl font-bold mb-2">Natural Conversations</h3>
                <p className="text-muted-foreground">
                  Ask questions in your own words. Our AI understands natural language and responds conversationally.
                </p>
              </CardContent>
            </Card>
            
            {/* Feature 5 */}
            <Card className="bg-secondary/50 border-white/5">
              <CardContent className="p-6">
                <Globe className="h-10 w-10 mb-4 text-gemini-purple" />
                <h3 className="text-xl font-bold mb-2">Fully Responsive</h3>
                <p className="text-muted-foreground">
                  Access HydroGen from any device. Our interface adapts perfectly to smartphones, tablets, and desktops.
                </p>
              </CardContent>
            </Card>
            
            {/* Feature 6 */}
            <Card className="bg-secondary/50 border-white/5">
              <CardContent className="p-6">
                <Shield className="h-10 w-10 mb-4 text-gemini-purple" />
                <h3 className="text-xl font-bold mb-2">Privacy Focused</h3>
                <p className="text-muted-foreground">
                  Your questions and data stay private. We prioritize security and never share your information with third parties.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 bg-secondary/30">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Getting answers has never been this simple
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="relative flex flex-col items-center text-center">
              <div className="w-16 h-16 flex items-center justify-center bg-gemini-purple text-white text-2xl font-bold rounded-full mb-6">1</div>
              <h3 className="text-xl font-bold mb-2">Ask Your Question</h3>
              <p className="text-muted-foreground">
                Type any question in the search bar using natural language.
              </p>
            </div>
            
            {/* Step 2 */}
            <div className="relative flex flex-col items-center text-center">
              <div className="w-16 h-16 flex items-center justify-center bg-gemini-purple text-white text-2xl font-bold rounded-full mb-6">2</div>
              <h3 className="text-xl font-bold mb-2">AI Processing</h3>
              <p className="text-muted-foreground">
                Our AI analyzes your question and searches for the most accurate answer.
              </p>
            </div>
            
            {/* Step 3 */}
            <div className="relative flex flex-col items-center text-center">
              <div className="w-16 h-16 flex items-center justify-center bg-gemini-purple text-white text-2xl font-bold rounded-full mb-6">3</div>
              <h3 className="text-xl font-bold mb-2">Instant Results</h3>
              <p className="text-muted-foreground">
                Within milliseconds, you'll receive a comprehensive, accurate answer.
              </p>
            </div>
            
            {/* Step 4 */}
            <div className="relative flex flex-col items-center text-center">
              <div className="w-16 h-16 flex items-center justify-center bg-gemini-purple text-white text-2xl font-bold rounded-full mb-6">4</div>
              <h3 className="text-xl font-bold mb-2">Explore Further</h3>
              <p className="text-muted-foreground">
                Ask follow-up questions or explore related topics with ease.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-20 px-4 bg-gradient-to-b from-background to-secondary/20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">HydroGen by the Numbers</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We're changing how people access information
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">50</div>
              <div className="text-muted-foreground">Millisecond Response</div>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">99.9</div>
              <div className="text-muted-foreground">Accuracy Rate</div>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">500</div>
              <div className="text-muted-foreground">Million+ Questions</div>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">30</div>
              <div className="text-muted-foreground">Minutes to Build This</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-4">
        <div className="container max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to know about HydroGen
            </p>
          </div>
          
          <div className="space-y-6">
            {/* FAQ Item 1 */}
            <div className="bg-secondary/50 border border-white/5 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-2">What is HydroGen?</h3>
              <p className="text-muted-foreground">
                HydroGen is an AI-powered answer engine that provides accurate, instant responses to any question. Built by HarVa Groups in just 30 minutes, it leverages advanced AI to deliver 99.9% accuracy with 50ms response times.
              </p>
            </div>
            
            {/* FAQ Item 2 */}
            <div className="bg-secondary/50 border border-white/5 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-2">How accurate are the answers?</h3>
              <p className="text-muted-foreground">
                HydroGen delivers answers with a remarkable 99.9% accuracy rate. Our AI models are trained on vast datasets and continuously improved to ensure you receive the most precise information available.
              </p>
            </div>
            
            {/* FAQ Item 3 */}
            <div className="bg-secondary/50 border border-white/5 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-2">Was HydroGen really built in 30 minutes?</h3>
              <p className="text-muted-foreground">
                Yes! HydroGen was built in just 30 minutes as an experimental project by HarVa Groups. It demonstrates the power of modern AI development tools to create sophisticated applications in record time.
              </p>
            </div>
            
            {/* FAQ Item 4 */}
            <div className="bg-secondary/50 border border-white/5 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-2">What types of questions can I ask?</h3>
              <p className="text-muted-foreground">
                You can ask HydroGen virtually anything! From scientific queries to historical facts, from technological explanations to philosophical questions - our AI is designed to handle a wide range of topics with expertise.
              </p>
            </div>
            
            {/* FAQ Item 5 */}
            <div className="bg-secondary/50 border border-white/5 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-2">Who created HydroGen?</h3>
              <p className="text-muted-foreground">
                HydroGen was created by HarVa Groups in collaboration with FreakVinci Open Labs and OpenMatrix. It represents a collaborative experiment showcasing rapid AI application development.
              </p>
            </div>
            
            {/* FAQ Item 6 */}
            <div className="bg-secondary/50 border border-white/5 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-2">Is HydroGen free to use?</h3>
              <p className="text-muted-foreground">
                Currently, HydroGen is in beta and available for free. We're constantly improving the platform and may introduce premium features in the future, but we're committed to maintaining a free tier.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gemini-purple/20">
        <div className="container max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Experience AI-Powered Answers?</h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Join thousands of users who are already discovering the power of instant, accurate knowledge
          </p>
          <Button size="lg" className="px-8 py-6 text-base rounded-full" asChild>
            <Link to="/app">
              Launch HydroGen
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-4">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <span className="text-xl font-bold text-white">HydroGen</span>
              <p className="text-sm text-muted-foreground mt-2">
                © 2025 HarVa Groups. All rights reserved.
              </p>
            </div>
            <div className="flex space-x-8">
              <a href="#" className="text-sm text-muted-foreground hover:text-white">Privacy</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-white">Terms</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-white">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
