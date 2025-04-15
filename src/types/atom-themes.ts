
export type ThemeCategory = 
  | 'Coding' 
  | 'Math' 
  | 'Science' 
  | 'Finance' 
  | 'Economics' 
  | 'Politics' 
  | 'Literature' 
  | 'Computer Science' 
  | 'AI' 
  | 'Geography' 
  | 'History'
  | 'Popular'
  | 'Medicine'
  | 'Creative'
  | 'Music'
  | 'Film'
  | 'Art'
  | 'Games'
  | 'Food'
  | 'Business'
  | 'Law'
  | 'Education'
  | 'Engineering'
  | 'Social Sciences';

export interface AtomTheme {
  id: string;
  name: string;
  description: string;
  category: ThemeCategory;
  prompt: string;
  icon: string;
  color: string;
}
