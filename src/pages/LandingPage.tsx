
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Globe, MessageSquare, Search, Zap, Bot, ArrowRight, Star } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white overflow-hidden">
      {/* Hero Section */}
      <div className="relative pt-20 pb-32 px-4 md:px-6">
        <div className="absolute inset-0 z-0 opacity-30">
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-purple-500/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-blue-500/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-2 rounded-lg shadow-lg">
              <Bot className="h-8 w-8 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-center mb-6 bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
            HydroGen AI
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 text-center max-w-3xl mx-auto mb-10">
            Your intelligent assistant powered by advanced AI. Ask questions, get summaries, search the web, and more.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/app">
              <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-6 h-auto text-lg rounded-lg shadow-lg transition-all duration-300">
                Start Chatting <ArrowRight className="ml-2" />
              </Button>
            </Link>
            
            <Button variant="outline" size="lg" className="border-gray-700 hover:border-gray-600 text-gray-300 hover:text-white px-8 py-6 h-auto text-lg rounded-lg">
              Learn More
            </Button>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="py-20 bg-black/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">Powerful Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 transition-all duration-300 hover:border-purple-500/30 hover:translate-y-[-2px]">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-lg shadow-md w-fit mb-4">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">AI Conversations</h3>
              <p className="text-gray-400">
                Engage in natural conversations with an advanced AI assistant that learns from context.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 transition-all duration-300 hover:border-purple-500/30 hover:translate-y-[-2px]">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-lg shadow-md w-fit mb-4">
                <Search className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Web Search</h3>
              <p className="text-gray-400">
                Find information from across the web and get AI-powered summaries of search results.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 transition-all duration-300 hover:border-purple-500/30 hover:translate-y-[-2px]">
              <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-3 rounded-lg shadow-md w-fit mb-4">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Flashcards</h3>
              <p className="text-gray-400">
                Create interactive flashcards from any text for efficient learning and memorization.
              </p>
            </div>
            
            {/* Feature 4 */}
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 transition-all duration-300 hover:border-purple-500/30 hover:translate-y-[-2px]">
              <div className="bg-gradient-to-br from-purple-500 to-fuchsia-600 p-3 rounded-lg shadow-md w-fit mb-4">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">YouTube Summaries</h3>
              <p className="text-gray-400">
                Get concise summaries of YouTube videos without watching the full content.
              </p>
            </div>
            
            {/* Feature 5 */}
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 transition-all duration-300 hover:border-purple-500/30 hover:translate-y-[-2px]">
              <div className="bg-gradient-to-br from-red-500 to-pink-600 p-3 rounded-lg shadow-md w-fit mb-4">
                <Star className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Custom Themes</h3>
              <p className="text-gray-400">
                Customize the appearance with light and dark themes to match your preferences.
              </p>
            </div>
            
            {/* Feature 6 */}
            <div className="bg-gradient-to-br from-indigo-500/20 to-purple-600/20 backdrop-blur-sm border border-gray-800 rounded-xl p-6 transition-all duration-300 hover:border-purple-500/30 hover:translate-y-[-2px]">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-3 rounded-lg shadow-md w-fit mb-4">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">More Coming Soon</h3>
              <p className="text-gray-400">
                We're constantly adding new features to enhance your AI experience.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Call to Action */}
      <div className="py-20 px-4 md:px-6 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Start using HydroGen AI today</h2>
          <p className="text-xl text-gray-300 mb-8">
            Experience the power of AI with our intuitive interface and powerful features.
          </p>
          <Link to="/app" className="inline-block">
            <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-10 py-6 h-auto text-lg rounded-lg shadow-lg transition-all duration-300">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="py-8 px-4 md:px-6 bg-black/80 border-t border-gray-800">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-1.5 rounded-md shadow-lg mr-2">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <span className="text-white font-semibold">HydroGen AI</span>
          </div>
          
          <div className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} HydroGen AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
