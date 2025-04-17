
export type AtomType = 'youtube' | 'flashcard' | 'mindmap' | 'studyguide' | 'websearch';

export interface AtomCommand {
  type: AtomType;
  params: string;
}

export const parseAtomCommand = (message: string): AtomCommand | null => {
  // Check if the message starts with a / command
  if (!message.startsWith('/')) return null;
  
  // Get the command and parameters
  const parts = message.split(' ');
  const command = parts[0].substring(1).toLowerCase(); // Remove the / and lowercase
  const params = parts.slice(1).join(' ');
  
  // Match command to atom type
  let type: AtomType | null = null;
  
  if (command === 'youtube' || command === 'yt') {
    type = 'youtube';
  } else if (command === 'flashcard' || command === 'flashcards' || command === 'fc') {
    type = 'flashcard';
  } else if (command === 'mindmap' || command === 'map' || command === 'mm') {
    type = 'mindmap';
  } else if (command === 'studyguide' || command === 'study' || command === 'sg') {
    type = 'studyguide';
  } else if (command === 'web' || command === 'search' || command === 'websearch') {
    type = 'websearch';
  }
  
  if (!type) return null;
  
  return {
    type,
    params
  };
};
