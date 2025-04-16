import React from 'react';
import { BadgeCheck } from 'lucide-react'; // Replace Flashcard with BadgeCheck

const StudentTools = () => {
  return (
    <div className="student-tools">
      <h2>Student Tools</h2>
      <div className="tools-grid">
        <div className="tool-item">
          <BadgeCheck className="tool-icon" /> {/* Updated icon */}
          <span>Flashcards</span>
        </div>
      </div>
    </div>
  );
};

export default StudentTools;
