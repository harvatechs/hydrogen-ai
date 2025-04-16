
import React from 'react';
import { BadgeCheck, Book, Calculator, Calendar, Clock, FileText, FlaskConical, Globe, Lightbulb } from 'lucide-react';

const StudentTools = () => {
  const tools = [
    { name: 'Flashcards', icon: BadgeCheck, color: 'text-blue-500' },
    { name: 'Calculator', icon: Calculator, color: 'text-green-500' },
    { name: 'Notes', icon: FileText, color: 'text-yellow-500' },
    { name: 'Dictionary', icon: Book, color: 'text-purple-500' },
    { name: 'Timer', icon: Clock, color: 'text-red-500' },
    { name: 'Science', icon: FlaskConical, color: 'text-teal-500' },
    { name: 'Languages', icon: Globe, color: 'text-indigo-500' },
    { name: 'Study Tips', icon: Lightbulb, color: 'text-amber-500' }
  ];

  return (
    <div className="student-tools animate-fade-in">
      <h2 className="flex items-center text-lg font-semibold mb-4">
        <Calendar className="mr-2 h-5 w-5 text-gemini-purple" />
        Student Resources
      </h2>
      
      <div className="tools-grid">
        {tools.map((tool) => (
          <div key={tool.name} className="tool-item hover-lift">
            <tool.icon className={`tool-icon ${tool.color}`} />
            <span>{tool.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentTools;
