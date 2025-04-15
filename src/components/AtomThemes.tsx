
import { useState, useRef, useEffect } from 'react';
import { AtomTheme, ThemeCategory } from '@/types/atom-themes';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useChat } from '@/context/ChatContext';
import { toast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { 
  Code, 
  Calculator, 
  Beaker,
  DollarSign, 
  TrendingUp, 
  Landmark, 
  BookOpen, 
  Cpu, 
  Brain, 
  Globe, 
  History as HistoryIcon,
  Search,
  Filter,
  X,
  Star,
  HeartPulse,
  PenTool,
  Music,
  Film,
  Palette,
  Dices,
  Wine,
  Coffee,
  Utensils,
  Building,
  BadgeCheck,
  LibraryBig,
  Hammer,
  Users,
  LayoutDashboard,
  MessageSquare,
  LucideIcon,
  BarChart3,
  FileText,
  Lightbulb,
  Microscope,
  Plane,
  Scale,
  Award,
  Stethoscope,
  Rocket,
  GraduationCap,
  GitBranch,
  Terminal
} from 'lucide-react';

// Extended theme categories
const themeCategories: { category: ThemeCategory; icon: React.ReactNode; color: string }[] = [
  { category: 'Popular', icon: <Star />, color: '#fbbf24' },
  { category: 'Coding', icon: <Code />, color: '#007ACC' },
  { category: 'Math', icon: <Calculator />, color: '#FF5722' },
  { category: 'Science', icon: <Beaker />, color: '#4CAF50' },
  { category: 'Finance', icon: <DollarSign />, color: '#4CAF50' },
  { category: 'Economics', icon: <TrendingUp />, color: '#9C27B0' },
  { category: 'Politics', icon: <Landmark />, color: '#2196F3' },
  { category: 'Literature', icon: <BookOpen />, color: '#795548' },
  { category: 'Computer Science', icon: <Cpu />, color: '#3F51B5' },
  { category: 'AI', icon: <Brain />, color: '#FF9800' },
  { category: 'Geography', icon: <Globe />, color: '#009688' },
  { category: 'History', icon: <HistoryIcon />, color: '#607D8B' },
  { category: 'Medicine', icon: <HeartPulse />, color: '#E91E63' },
  { category: 'Creative', icon: <PenTool />, color: '#673AB7' },
  { category: 'Music', icon: <Music />, color: '#FFC107' },
  { category: 'Film', icon: <Film />, color: '#FF5722' },
  { category: 'Art', icon: <Palette />, color: '#9C27B0' },
  { category: 'Games', icon: <Dices />, color: '#2196F3' },
  { category: 'Food', icon: <Utensils />, color: '#FF9800' },
  { category: 'Business', icon: <Building />, color: '#607D8B' },
  { category: 'Law', icon: <Scale />, color: '#795548' },
  { category: 'Education', icon: <GraduationCap />, color: '#4CAF50' },
  { category: 'Engineering', icon: <Hammer />, color: '#FE5B52' },
  { category: 'Social Sciences', icon: <Users />, color: '#00BCD4' }
];

// Extended atom themes list with 100+ tools
const atomThemes: AtomTheme[] = [
  // Popular tools
  {
    id: 'coding-helper',
    name: 'Code Assistant',
    description: 'Help with coding problems, debugging, and optimization',
    category: 'Popular',
    prompt: 'You are an expert programming assistant. Help me with the following code:',
    icon: 'Code',
    color: '#007ACC'
  },
  {
    id: 'essay-writer',
    name: 'Essay Writer',
    description: 'Create well-structured essays and academic papers',
    category: 'Popular',
    prompt: 'Act as an expert essay writer. Help me write about:',
    icon: 'FileText',
    color: '#673AB7'
  },
  {
    id: 'creative-storyteller',
    name: 'Creative Storyteller',
    description: 'Generate engaging fictional stories and narratives',
    category: 'Popular',
    prompt: 'Act as a creative storyteller and write a compelling story about:',
    icon: 'BookOpen',
    color: '#FF9800'
  },
  {
    id: 'research-assistant',
    name: 'Research Assistant',
    description: 'Find and summarize information on various topics',
    category: 'Popular',
    prompt: 'Act as a research assistant. Help me gather information about:',
    icon: 'Search',
    color: '#4CAF50'
  },
  {
    id: 'math-solver',
    name: 'Math Problem Solver',
    description: 'Step-by-step solutions to math problems',
    category: 'Popular',
    prompt: 'Act as a math tutor. Solve the following problem step by step:',
    icon: 'Calculator',
    color: '#FF5722'
  },
  
  // Coding and Computer Science tools
  {
    id: 'code-debugger',
    name: 'Code Debugger',
    description: 'Find and fix bugs in your code',
    category: 'Coding',
    prompt: 'Debug this code and explain the issues:',
    icon: 'Code',
    color: '#007ACC'
  },
  {
    id: 'code-optimizer',
    name: 'Code Optimizer',
    description: 'Improve performance and efficiency of code',
    category: 'Coding',
    prompt: 'Optimize the following code for better performance:',
    icon: 'Cpu',
    color: '#4CAF50'
  },
  {
    id: 'sql-assistant',
    name: 'SQL Assistant',
    description: 'Help with database queries and optimization',
    category: 'Coding',
    prompt: 'Help me with the following SQL query:',
    icon: 'Database',
    color: '#FF5722'
  },
  {
    id: 'git-helper',
    name: 'Git Helper',
    description: 'Git commands and workflow assistance',
    category: 'Coding',
    prompt: 'I need help with the following Git problem:',
    icon: 'GitBranch',
    color: '#F05032'
  },
  {
    id: 'frontend-dev',
    name: 'Frontend Developer',
    description: 'Help with HTML, CSS, and JavaScript',
    category: 'Coding',
    prompt: 'Act as a frontend developer. Help me with:',
    icon: 'LayoutDashboard',
    color: '#61DAFB'
  },
  {
    id: 'backend-dev',
    name: 'Backend Developer',
    description: 'Server-side programming assistance',
    category: 'Coding',
    prompt: 'Act as a backend developer. Help me with:',
    icon: 'Server',
    color: '#6DB33F'
  },
  {
    id: 'cli-expert',
    name: 'CLI Expert',
    description: 'Terminal and command line assistance',
    category: 'Coding',
    prompt: 'Help me with the following command line problem:',
    icon: 'Terminal',
    color: '#333333'
  },
  
  // Math tools
  {
    id: 'calculus-solver',
    name: 'Calculus Solver',
    description: 'Solutions for calculus problems',
    category: 'Math',
    prompt: 'Solve and explain this calculus problem:',
    icon: 'Calculator',
    color: '#FF5722'
  },
  {
    id: 'algebra-helper',
    name: 'Algebra Helper',
    description: 'Step-by-step algebra solutions',
    category: 'Math',
    prompt: 'Solve this algebra problem with detailed steps:',
    icon: 'Calculator',
    color: '#9C27B0'
  },
  {
    id: 'statistics-assistant',
    name: 'Statistics Assistant',
    description: 'Statistical analysis and probability',
    category: 'Math',
    prompt: 'Help me with this statistics problem:',
    icon: 'BarChart3',
    color: '#2196F3'
  },
  {
    id: 'geometry-solver',
    name: 'Geometry Solver',
    description: 'Solutions for geometry problems',
    category: 'Math',
    prompt: 'Solve this geometry problem:',
    icon: 'Square',
    color: '#4CAF50'
  },
  
  // Science tools
  {
    id: 'science-explainer',
    name: 'Science Explainer',
    description: 'Clear explanations of scientific concepts',
    category: 'Science',
    prompt: 'Explain this scientific concept in simple terms:',
    icon: 'Beaker',
    color: '#4CAF50'
  },
  {
    id: 'physics-tutor',
    name: 'Physics Tutor',
    description: 'Physics problem-solving and explanations',
    category: 'Science',
    prompt: 'Help me understand and solve this physics problem:',
    icon: 'Atom',
    color: '#3F51B5'
  },
  {
    id: 'chemistry-lab',
    name: 'Chemistry Lab',
    description: 'Chemistry concepts and equations',
    category: 'Science',
    prompt: 'Explain this chemistry concept or solve this problem:',
    icon: 'Flask',
    color: '#9C27B0'
  },
  {
    id: 'biology-expert',
    name: 'Biology Expert',
    description: 'Biology concepts and explanations',
    category: 'Science',
    prompt: 'Explain this biology concept:',
    icon: 'Microscope',
    color: '#4CAF50'
  },
  {
    id: 'astronomy-guide',
    name: 'Astronomy Guide',
    description: 'Explanations about space and celestial objects',
    category: 'Science',
    prompt: 'Tell me about this astronomy concept:',
    icon: 'Star',
    color: '#FF9800'
  },
  
  // Finance tools
  {
    id: 'finance-advisor',
    name: 'Financial Advisor',
    description: 'Personal finance tips and investment advice',
    category: 'Finance',
    prompt: 'Act as a financial advisor. Help me with:',
    icon: 'DollarSign',
    color: '#4CAF50'
  },
  {
    id: 'investment-analyst',
    name: 'Investment Analyst',
    description: 'Analysis of investment opportunities',
    category: 'Finance',
    prompt: 'Analyze this investment opportunity:',
    icon: 'TrendingUp',
    color: '#2196F3'
  },
  {
    id: 'tax-consultant',
    name: 'Tax Consultant',
    description: 'Help with tax questions and planning',
    category: 'Finance',
    prompt: 'Act as a tax consultant. Help me with:',
    icon: 'FileText',
    color: '#607D8B'
  },
  {
    id: 'budget-planner',
    name: 'Budget Planner',
    description: 'Personal and business budget planning',
    category: 'Finance',
    prompt: 'Help me create a budget for:',
    icon: 'PieChart',
    color: '#9C27B0'
  },
  
  // Economics tools
  {
    id: 'economics-analyst',
    name: 'Economics Analyst',
    description: 'Analysis of economic trends and concepts',
    category: 'Economics',
    prompt: 'Analyze the following economic concept or situation:',
    icon: 'TrendingUp',
    color: '#9C27B0'
  },
  {
    id: 'market-analyst',
    name: 'Market Analyst',
    description: 'Analysis of market trends and forces',
    category: 'Economics',
    prompt: 'Analyze these market conditions:',
    icon: 'BarChart3',
    color: '#2196F3'
  },
  {
    id: 'trade-expert',
    name: 'Trade Expert',
    description: 'International trade and policy analysis',
    category: 'Economics',
    prompt: 'Explain this trade concept or analyze this situation:',
    icon: 'Globe',
    color: '#4CAF50'
  },
  
  // Politics tools
  {
    id: 'political-analyst',
    name: 'Political Analyst',
    description: 'Balanced analysis of political systems and events',
    category: 'Politics',
    prompt: 'Provide a balanced analysis of the following political topic:',
    icon: 'Landmark',
    color: '#2196F3'
  },
  {
    id: 'policy-analyst',
    name: 'Policy Analyst',
    description: 'Analysis of public policies and their impacts',
    category: 'Politics',
    prompt: 'Analyze this policy and its potential impacts:',
    icon: 'FileText',
    color: '#607D8B'
  },
  {
    id: 'international-relations',
    name: 'International Relations Expert',
    description: 'Analysis of global politics and relations',
    category: 'Politics',
    prompt: 'Analyze this international relations issue:',
    icon: 'Globe',
    color: '#3F51B5'
  },
  
  // Literature tools
  {
    id: 'literature-guide',
    name: 'Literature Guide',
    description: 'Analysis of literary works and writing assistance',
    category: 'Literature',
    prompt: 'Help me understand or analyze the following literary text:',
    icon: 'BookOpen',
    color: '#795548'
  },
  {
    id: 'poetry-analyst',
    name: 'Poetry Analyst',
    description: 'Analysis and interpretation of poetry',
    category: 'Literature',
    prompt: 'Analyze this poem:',
    icon: 'BookOpen',
    color: '#9C27B0'
  },
  {
    id: 'creative-writer',
    name: 'Creative Writer',
    description: 'Creative writing assistance and ideas',
    category: 'Literature',
    prompt: 'Help me write a creative piece about:',
    icon: 'PenTool',
    color: '#FF9800'
  },
  {
    id: 'essay-reviewer',
    name: 'Essay Reviewer',
    description: 'Feedback and improvements for essays',
    category: 'Literature',
    prompt: 'Review this essay and suggest improvements:',
    icon: 'FileText',
    color: '#4CAF50'
  },
  
  // Computer Science tools
  {
    id: 'computer-tutor',
    name: 'Computer Science Tutor',
    description: 'Explanations of CS concepts and algorithms',
    category: 'Computer Science',
    prompt: 'Explain the following computer science concept:',
    icon: 'Cpu',
    color: '#3F51B5'
  },
  {
    id: 'algorithm-designer',
    name: 'Algorithm Designer',
    description: 'Help with algorithm design and analysis',
    category: 'Computer Science',
    prompt: 'Help me design an efficient algorithm for:',
    icon: 'GitBranch',
    color: '#FF5722'
  },
  {
    id: 'data-structures',
    name: 'Data Structures Expert',
    description: 'Explanations and implementations of data structures',
    category: 'Computer Science',
    prompt: 'Explain this data structure or help me implement:',
    icon: 'Database',
    color: '#4CAF50'
  },
  {
    id: 'systems-architect',
    name: 'Systems Architect',
    description: 'System design and architecture assistance',
    category: 'Computer Science',
    prompt: 'Help me design a system for:',
    icon: 'LayoutDashboard',
    color: '#607D8B'
  },
  
  // AI tools
  {
    id: 'ai-expert',
    name: 'AI Researcher',
    description: 'Expert insights on artificial intelligence',
    category: 'AI',
    prompt: 'Provide expert insight on the following AI topic:',
    icon: 'Brain',
    color: '#FF9800'
  },
  {
    id: 'ml-engineer',
    name: 'Machine Learning Engineer',
    description: 'ML model design and implementation help',
    category: 'AI',
    prompt: 'Help me with this machine learning problem:',
    icon: 'Network',
    color: '#9C27B0'
  },
  {
    id: 'nlp-specialist',
    name: 'NLP Specialist',
    description: 'Natural Language Processing expertise',
    category: 'AI',
    prompt: 'Explain this NLP concept or help me with:',
    icon: 'MessageSquare',
    color: '#2196F3'
  },
  {
    id: 'computer-vision',
    name: 'Computer Vision Expert',
    description: 'Help with computer vision concepts and applications',
    category: 'AI',
    prompt: 'Help me understand this computer vision concept:',
    icon: 'Eye',
    color: '#4CAF50'
  },
  
  // Geography tools
  {
    id: 'geography-guide',
    name: 'Geography Guide',
    description: 'Information about places, cultures, and landmarks',
    category: 'Geography',
    prompt: 'Tell me about the geography of:',
    icon: 'Globe',
    color: '#009688'
  },
  {
    id: 'travel-advisor',
    name: 'Travel Advisor',
    description: 'Travel tips and destination information',
    category: 'Geography',
    prompt: 'Give me travel advice for:',
    icon: 'Plane',
    color: '#2196F3'
  },
  {
    id: 'urban-planner',
    name: 'Urban Planner',
    description: 'City design and urban development concepts',
    category: 'Geography',
    prompt: 'Help me understand urban planning for:',
    icon: 'Building',
    color: '#607D8B'
  },
  
  // History tools
  {
    id: 'history-buff',
    name: 'History Expert',
    description: 'Detailed historical context and events',
    category: 'History',
    prompt: 'Provide historical context for:',
    icon: 'HistoryIcon',
    color: '#607D8B'
  },
  {
    id: 'ancient-historian',
    name: 'Ancient History Expert',
    description: 'Information about ancient civilizations',
    category: 'History',
    prompt: 'Tell me about this ancient history topic:',
    icon: 'Landmark',
    color: '#795548'
  },
  {
    id: 'modern-historian',
    name: 'Modern History Expert',
    description: 'Insights on modern historical events',
    category: 'History',
    prompt: 'Explain this modern historical event:',
    icon: 'BookOpen',
    color: '#3F51B5'
  },
  
  // Medicine tools
  {
    id: 'medical-explainer',
    name: 'Medical Explainer',
    description: 'Clear explanations of medical concepts',
    category: 'Medicine',
    prompt: 'Explain this medical concept in simple terms:',
    icon: 'HeartPulse',
    color: '#E91E63'
  },
  {
    id: 'health-advisor',
    name: 'Health Advisor',
    description: 'General health and wellness information',
    category: 'Medicine',
    prompt: 'Provide information about this health topic:',
    icon: 'Stethoscope',
    color: '#4CAF50'
  },
  {
    id: 'nutrition-expert',
    name: 'Nutrition Expert',
    description: 'Dietary and nutritional guidance',
    category: 'Medicine',
    prompt: 'Give me nutritional advice about:',
    icon: 'Utensils',
    color: '#FF9800'
  },
  {
    id: 'mental-health',
    name: 'Mental Health Guide',
    description: 'Information about mental health and wellness',
    category: 'Medicine',
    prompt: 'Provide information about this mental health topic:',
    icon: 'Brain',
    color: '#9C27B0'
  },
  
  // Creative tools
  {
    id: 'creative-coach',
    name: 'Creative Coach',
    description: 'Ideas and inspiration for creative projects',
    category: 'Creative',
    prompt: 'Help me with creative ideas for:',
    icon: 'PenTool',
    color: '#673AB7'
  },
  {
    id: 'writing-assistant',
    name: 'Writing Assistant',
    description: 'Help with writing and editing text',
    category: 'Creative',
    prompt: 'Help me write or edit the following:',
    icon: 'FileText',
    color: '#4CAF50'
  },
  {
    id: 'storyteller',
    name: 'Storyteller',
    description: 'Creative storytelling and narrative help',
    category: 'Creative',
    prompt: 'Help me create a story about:',
    icon: 'BookOpen',
    color: '#FF9800'
  },
  
  // Music tools
  {
    id: 'music-teacher',
    name: 'Music Teacher',
    description: 'Music theory and instrument lessons',
    category: 'Music',
    prompt: 'Teach me about this music concept:',
    icon: 'Music',
    color: '#FFC107'
  },
  {
    id: 'music-historian',
    name: 'Music Historian',
    description: 'Information about music history and genres',
    category: 'Music',
    prompt: 'Tell me about this music history topic:',
    icon: 'Music',
    color: '#3F51B5'
  },
  {
    id: 'song-analyst',
    name: 'Song Analyst',
    description: 'Analysis of lyrics and musical composition',
    category: 'Music',
    prompt: 'Analyze these song lyrics or this composition:',
    icon: 'Music',
    color: '#9C27B0'
  },
  
  // Film tools
  {
    id: 'film-critic',
    name: 'Film Critic',
    description: 'Analysis and reviews of films',
    category: 'Film',
    prompt: 'Analyze or review this film:',
    icon: 'Film',
    color: '#FF5722'
  },
  {
    id: 'screenplay-writer',
    name: 'Screenplay Writer',
    description: 'Help with screenplay writing',
    category: 'Film',
    prompt: 'Help me write a screenplay about:',
    icon: 'FileText',
    color: '#795548'
  },
  {
    id: 'film-historian',
    name: 'Film Historian',
    description: 'Information about film history and movements',
    category: 'Film',
    prompt: 'Tell me about this film history topic:',
    icon: 'Film',
    color: '#607D8B'
  },
  
  // Art tools
  {
    id: 'art-historian',
    name: 'Art Historian',
    description: 'Information about art history and movements',
    category: 'Art',
    prompt: 'Tell me about this art history topic:',
    icon: 'Palette',
    color: '#9C27B0'
  },
  {
    id: 'art-critic',
    name: 'Art Critic',
    description: 'Analysis and interpretation of artwork',
    category: 'Art',
    prompt: 'Analyze this artwork:',
    icon: 'Palette',
    color: '#FF9800'
  },
  {
    id: 'design-consultant',
    name: 'Design Consultant',
    description: 'Advice on visual and design aspects',
    category: 'Art',
    prompt: 'Give me design advice for:',
    icon: 'PenTool',
    color: '#2196F3'
  },
  
  // Games tools
  {
    id: 'game-designer',
    name: 'Game Designer',
    description: 'Help with game mechanics and design',
    category: 'Games',
    prompt: 'Help me design a game with these elements:',
    icon: 'Dices',
    color: '#2196F3'
  },
  {
    id: 'chess-coach',
    name: 'Chess Coach',
    description: 'Chess strategy and move analysis',
    category: 'Games',
    prompt: 'Help me with this chess position or concept:',
    icon: 'CheckSquare',
    color: '#607D8B'
  },
  {
    id: 'rpg-master',
    name: 'RPG Game Master',
    description: 'Help with role-playing game scenarios',
    category: 'Games',
    prompt: 'Help me create an RPG scenario with:',
    icon: 'Map',
    color: '#9C27B0'
  },
  
  // Food tools
  {
    id: 'chef',
    name: 'Chef',
    description: 'Recipes and cooking techniques',
    category: 'Food',
    prompt: 'Give me a recipe or cooking advice for:',
    icon: 'Utensils',
    color: '#FF9800'
  },
  {
    id: 'wine-expert',
    name: 'Wine Expert',
    description: 'Wine recommendations and information',
    category: 'Food',
    prompt: 'Tell me about this wine or recommend a wine for:',
    icon: 'Wine',
    color: '#E91E63'
  },
  {
    id: 'barista',
    name: 'Barista',
    description: 'Coffee knowledge and brewing techniques',
    category: 'Food',
    prompt: 'Tell me about this coffee or brewing method:',
    icon: 'Coffee',
    color: '#795548'
  },
  
  // Business tools
  {
    id: 'business-consultant',
    name: 'Business Consultant',
    description: 'Business strategy and management advice',
    category: 'Business',
    prompt: 'Give me business advice for:',
    icon: 'Building',
    color: '#607D8B'
  },
  {
    id: 'marketing-expert',
    name: 'Marketing Expert',
    description: 'Marketing strategy and campaign advice',
    category: 'Business',
    prompt: 'Help me with a marketing strategy for:',
    icon: 'Target',
    color: '#FF5722'
  },
  {
    id: 'entrepreneur-coach',
    name: 'Entrepreneur Coach',
    description: 'Startup and entrepreneurship guidance',
    category: 'Business',
    prompt: 'Give me entrepreneurial advice for:',
    icon: 'Rocket',
    color: '#4CAF50'
  },
  {
    id: 'product-manager',
    name: 'Product Manager',
    description: 'Product development and management advice',
    category: 'Business',
    prompt: 'Help me with product management for:',
    icon: 'Package',
    color: '#2196F3'
  },
  
  // Law tools
  {
    id: 'legal-assistant',
    name: 'Legal Assistant',
    description: 'Basic legal information and guidance',
    category: 'Law',
    prompt: 'Provide legal information about:',
    icon: 'Scale',
    color: '#795548'
  },
  {
    id: 'contract-reviewer',
    name: 'Contract Reviewer',
    description: 'Help understanding and reviewing contracts',
    category: 'Law',
    prompt: 'Help me understand this contract clause:',
    icon: 'FileText',
    color: '#607D8B'
  },
  {
    id: 'ip-advisor',
    name: 'IP Advisor',
    description: 'Intellectual property guidance',
    category: 'Law',
    prompt: 'Give me IP information about:',
    icon: 'Award',
    color: '#9C27B0'
  },
  
  // Education tools
  {
    id: 'teacher',
    name: 'Teacher',
    description: 'Explanations and lessons on various subjects',
    category: 'Education',
    prompt: 'Teach me about:',
    icon: 'GraduationCap',
    color: '#4CAF50'
  },
  {
    id: 'study-guide',
    name: 'Study Guide Creator',
    description: 'Create study materials and summaries',
    category: 'Education',
    prompt: 'Create a study guide for:',
    icon: 'FileText',
    color: '#2196F3'
  },
  {
    id: 'language-tutor',
    name: 'Language Tutor',
    description: 'Help learning and practicing languages',
    category: 'Education',
    prompt: 'Help me learn or practice this language:',
    icon: 'MessageSquare',
    color: '#FF9800'
  },
  {
    id: 'test-prep',
    name: 'Test Preparation Coach',
    description: 'Help preparing for exams and tests',
    category: 'Education',
    prompt: 'Help me prepare for this test:',
    icon: 'ClipboardCheck',
    color: '#E91E63'
  },
  
  // Engineering tools
  {
    id: 'mechanical-engineer',
    name: 'Mechanical Engineer',
    description: 'Help with mechanical engineering problems',
    category: 'Engineering',
    prompt: 'Help me with this mechanical engineering problem:',
    icon: 'Hammer',
    color: '#FE5B52'
  },
  {
    id: 'electrical-engineer',
    name: 'Electrical Engineer',
    description: 'Help with electrical engineering problems',
    category: 'Engineering',
    prompt: 'Help me with this electrical engineering problem:',
    icon: 'Zap',
    color: '#FFC107'
  },
  {
    id: 'civil-engineer',
    name: 'Civil Engineer',
    description: 'Help with civil engineering problems',
    category: 'Engineering',
    prompt: 'Help me with this civil engineering problem:',
    icon: 'Building',
    color: '#607D8B'
  },
  
  // Social Sciences tools
  {
    id: 'psychologist',
    name: 'Psychologist',
    description: 'Information about psychology concepts',
    category: 'Social Sciences',
    prompt: 'Explain this psychology concept:',
    icon: 'Brain',
    color: '#9C27B0'
  },
  {
    id: 'sociologist',
    name: 'Sociologist',
    description: 'Information about sociology concepts',
    category: 'Social Sciences',
    prompt: 'Explain this sociology concept:',
    icon: 'Users',
    color: '#00BCD4'
  },
  {
    id: 'anthropologist',
    name: 'Anthropologist',
    description: 'Information about anthropology concepts',
    category: 'Social Sciences',
    prompt: 'Explain this anthropology concept:',
    icon: 'Globe',
    color: '#795548'
  }
];

const IconComponent = ({ iconName }: { iconName: string }) => {
  // Map of icon names to their components
  const iconMap: Record<string, React.ReactNode> = {
    Code: <Code />,
    Calculator: <Calculator />,
    Beaker: <Beaker />,
    DollarSign: <DollarSign />,
    TrendingUp: <TrendingUp />,
    Landmark: <Landmark />,
    BookOpen: <BookOpen />,
    Cpu: <Cpu />,
    Brain: <Brain />,
    Globe: <Globe />,
    HistoryIcon: <HistoryIcon />,
    Search: <Search />,
    HeartPulse: <HeartPulse />,
    PenTool: <PenTool />,
    Music: <Music />,
    Film: <Film />,
    Palette: <Palette />,
    Dices: <Dices />,
    Wine: <Wine />,
    Coffee: <Coffee />,
    Utensils: <Utensils />,
    Building: <Building />,
    FileText: <FileText />,
    BarChart3: <BarChart3 />,
    Star: <Star />,
    Lightbulb: <Lightbulb />,
    Microscope: <Microscope />,
    Plane: <Plane />,
    Scale: <Scale />,
    Award: <Award />,
    Stethoscope: <Stethoscope />,
    Rocket: <Rocket />,
    GraduationCap: <GraduationCap />,
    GitBranch: <GitBranch />,
    Terminal: <Terminal />,
    MessageSquare: <MessageSquare />
  };
  
  return <>{iconMap[iconName] || <Code />}</>;
};

export function AtomThemes({ onClose }: { onClose: () => void }) {
  const [selectedCategory, setSelectedCategory] = useState<ThemeCategory | 'All'>('Popular');
  const [searchQuery, setSearchQuery] = useState('');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState<'browse' | 'popular' | 'recent'>('browse');
  const { sendMessage } = useChat();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [recentlyUsed, setRecentlyUsed] = useState<string[]>([]);
  const [favoriteThemes, setFavoriteThemes] = useState<string[]>([]);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  
  // Load recently used themes from localStorage
  useEffect(() => {
    const storedRecent = localStorage.getItem('recentlyUsedThemes');
    if (storedRecent) {
      setRecentlyUsed(JSON.parse(storedRecent));
    }
    
    const storedFavorites = localStorage.getItem('favoriteThemes');
    if (storedFavorites) {
      setFavoriteThemes(JSON.parse(storedFavorites));
    }
  }, []);
  
  // Scroll to top when category changes
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [selectedCategory]);
  
  const filteredThemes = atomThemes.filter(theme => 
    (selectedCategory === 'All' || theme.category === selectedCategory) &&
    (theme.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
     theme.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  const popularThemes = [...atomThemes]
    .sort(() => 0.5 - Math.random()) // Shuffle randomly for demo
    .slice(0, 6);
  
  const recentThemes = recentlyUsed
    .map(id => atomThemes.find(theme => theme.id === id))
    .filter(Boolean) as AtomTheme[];
  
  const favoriteThemesList = favoriteThemes
    .map(id => atomThemes.find(theme => theme.id === id))
    .filter(Boolean) as AtomTheme[];
  
  const applyTheme = (theme: AtomTheme) => {
    // Add to recently used
    const newRecent = [theme.id, ...recentlyUsed.filter(id => id !== theme.id)].slice(0, 8);
    setRecentlyUsed(newRecent);
    localStorage.setItem('recentlyUsedThemes', JSON.stringify(newRecent));
    
    sendMessage(theme.prompt);
    toast({
      title: `${theme.name} activated`,
      description: `The ${theme.name} theme has been applied to your chat.`
    });
    onClose();
  };
  
  const toggleFavorite = (themeId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    if (favoriteThemes.includes(themeId)) {
      const newFavorites = favoriteThemes.filter(id => id !== themeId);
      setFavoriteThemes(newFavorites);
      localStorage.setItem('favoriteThemes', JSON.stringify(newFavorites));
    } else {
      const newFavorites = [...favoriteThemes, themeId];
      setFavoriteThemes(newFavorites);
      localStorage.setItem('favoriteThemes', JSON.stringify(newFavorites));
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b dark:border-white/10 light:border-black/10">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold mb-1">HydroGen Theme Library</h2>
            <p className="text-sm text-muted-foreground">100+ specialized templates for different types of questions</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="relative mt-3">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search themes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 dark:bg-black/20 light:bg-white"
          />
        </div>
      </div>
      
      <Tabs defaultValue="browse" className="flex-1 flex flex-col" onValueChange={(v) => setActiveTab(v as any)}>
        <div className="flex items-center justify-between px-4 pt-2">
          <TabsList>
            <TabsTrigger value="browse" className="text-sm">Browse</TabsTrigger>
            <TabsTrigger value="popular" className="text-sm">Popular</TabsTrigger>
            <TabsTrigger value="recent" className="text-sm">Recent & Favorites</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 flex items-center text-xs gap-1"
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              >
                <Filter className="h-3 w-3" />
                {selectedCategory === 'All' ? 'All Categories' : selectedCategory}
              </Button>
              
              {showFilterDropdown && (
                <div className="absolute right-0 top-full mt-1 z-50 w-48 bg-card border dark:border-white/10 light:border-black/10 rounded-md shadow-lg p-1 max-h-80 overflow-y-auto">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start h-8 text-xs mb-1"
                    onClick={() => {
                      setSelectedCategory('All');
                      setShowFilterDropdown(false);
                    }}
                  >
                    All Categories
                  </Button>
                  
                  <Separator className="my-1" />
                  
                  {themeCategories.map((cat) => (
                    <Button
                      key={cat.category}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start h-8 text-xs"
                      onClick={() => {
                        setSelectedCategory(cat.category);
                        setShowFilterDropdown(false);
                      }}
                    >
                      <div className="mr-2" style={{ color: cat.color }}>{cat.icon}</div>
                      {cat.category}
                    </Button>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex bg-muted rounded-md overflow-hidden h-8">
              <Button 
                variant={view === 'grid' ? "secondary" : "ghost"} 
                size="icon" 
                className="h-8 w-8 rounded-none"
                onClick={() => setView('grid')}
              >
                <LayoutDashboard className="h-3.5 w-3.5" />
              </Button>
              <Button 
                variant={view === 'list' ? "secondary" : "ghost"} 
                size="icon" 
                className="h-8 w-8 rounded-none"
                onClick={() => setView('list')}
              >
                <LibraryBig className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
        
        <TabsContent value="browse" className="flex-1 mt-2 px-0">
          <ScrollArea className="h-full px-4" ref={scrollContainerRef}>
            {searchQuery && (
              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-2">{filteredThemes.length} results for "{searchQuery}"</p>
              </div>
            )}
            
            {view === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredThemes.map((theme) => (
                  <div
                    key={theme.id}
                    className="p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md dark:bg-black/20 dark:border-white/10 dark:hover:bg-black/30 light:bg-white light:border-black/10 light:hover:bg-gray-50 group"
                    onClick={() => applyTheme(theme)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <div 
                          className="p-2 rounded-md mr-3" 
                          style={{ backgroundColor: theme.color + '20', color: theme.color }}
                        >
                          <IconComponent iconName={theme.icon} />
                        </div>
                        <h3 className="font-medium">{theme.name}</h3>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => toggleFavorite(theme.id, e)}
                      >
                        <Star className={`h-3.5 w-3.5 ${favoriteThemes.includes(theme.id) ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">{theme.description}</p>
                    <div className="mt-2 flex">
                      <Badge variant="outline" className="text-xs">
                        {theme.category}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredThemes.map((theme) => (
                  <div
                    key={theme.id}
                    className="flex items-center p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md dark:bg-black/20 dark:border-white/10 dark:hover:bg-black/30 light:bg-white light:border-black/10 light:hover:bg-gray-50 group"
                    onClick={() => applyTheme(theme)}
                  >
                    <div 
                      className="p-2 rounded-md mr-3 flex-shrink-0" 
                      style={{ backgroundColor: theme.color + '20', color: theme.color }}
                    >
                      <IconComponent iconName={theme.icon} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{theme.name}</h3>
                        <Badge variant="outline" className="text-xs">
                          {theme.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{theme.description}</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7 ml-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                      onClick={(e) => toggleFavorite(theme.id, e)}
                    >
                      <Star className={`h-3.5 w-3.5 ${favoriteThemes.includes(theme.id) ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="popular" className="flex-1 mt-2 px-4">
          <h3 className="text-lg font-medium mb-4">Popular Themes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {popularThemes.map((theme) => (
              <div
                key={theme.id}
                className="p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md dark:bg-black/20 dark:border-white/10 dark:hover:bg-black/30 light:bg-white light:border-black/10 light:hover:bg-gray-50 group"
                onClick={() => applyTheme(theme)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div 
                      className="p-2 rounded-md mr-3" 
                      style={{ backgroundColor: theme.color + '20', color: theme.color }}
                    >
                      <IconComponent iconName={theme.icon} />
                    </div>
                    <h3 className="font-medium">{theme.name}</h3>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => toggleFavorite(theme.id, e)}
                  >
                    <Star className={`h-3.5 w-3.5 ${favoriteThemes.includes(theme.id) ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">{theme.description}</p>
                <div className="mt-2 flex">
                  <Badge variant="outline" className="text-xs">
                    {theme.category}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4">Staff Picks</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {atomThemes.slice(5, 11).map((theme) => (
                <div
                  key={theme.id}
                  className="p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md dark:bg-black/20 dark:border-white/10 dark:hover:bg-black/30 light:bg-white light:border-black/10 light:hover:bg-gray-50 group"
                  onClick={() => applyTheme(theme)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div 
                        className="p-2 rounded-md mr-3" 
                        style={{ backgroundColor: theme.color + '20', color: theme.color }}
                      >
                        <IconComponent iconName={theme.icon} />
                      </div>
                      <h3 className="font-medium">{theme.name}</h3>
                    </div>
                    <Badge className="bg-blue-500">
                      <BadgeCheck className="h-3 w-3 mr-1" />
                      <span className="text-xs">Staff Pick</span>
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{theme.description}</p>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="recent" className="flex-1 mt-2 px-4">
          {favoriteThemesList.length > 0 && (
            <>
              <h3 className="text-lg font-medium mb-4">Favorites</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {favoriteThemesList.map((theme) => (
                  <div
                    key={theme.id}
                    className="p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md dark:bg-black/20 dark:border-white/10 dark:hover:bg-black/30 light:bg-white light:border-black/10 light:hover:bg-gray-50 group"
                    onClick={() => applyTheme(theme)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <div 
                          className="p-2 rounded-md mr-3" 
                          style={{ backgroundColor: theme.color + '20', color: theme.color }}
                        >
                          <IconComponent iconName={theme.icon} />
                        </div>
                        <h3 className="font-medium">{theme.name}</h3>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7"
                        onClick={(e) => toggleFavorite(theme.id, e)}
                      >
                        <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">{theme.description}</p>
                  </div>
                ))}
              </div>
              
              <Separator className="my-6" />
            </>
          )}
          
          {recentThemes.length > 0 ? (
            <>
              <h3 className="text-lg font-medium mb-4">Recently Used</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recentThemes.map((theme) => (
                  <div
                    key={theme.id}
                    className="p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md dark:bg-black/20 dark:border-white/10 dark:hover:bg-black/30 light:bg-white light:border-black/10 light:hover:bg-gray-50 group"
                    onClick={() => applyTheme(theme)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <div 
                          className="p-2 rounded-md mr-3" 
                          style={{ backgroundColor: theme.color + '20', color: theme.color }}
                        >
                          <IconComponent iconName={theme.icon} />
                        </div>
                        <h3 className="font-medium">{theme.name}</h3>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => toggleFavorite(theme.id, e)}
                      >
                        <Star className={`h-3.5 w-3.5 ${favoriteThemes.includes(theme.id) ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">{theme.description}</p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <p className="text-muted-foreground text-center mb-4">No recently used themes yet</p>
              <Button onClick={() => setActiveTab('browse')}>Browse Themes</Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
