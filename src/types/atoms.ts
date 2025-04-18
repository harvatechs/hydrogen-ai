export type AtomType = 'youtube' | 'flashcard' | 'websearch' | 'summarize' | null;

export interface AtomCommand {
  type: AtomType;
  params: string;
}

export function parseAtomCommand(message: string): AtomCommand | null {
  if (message.startsWith('/youtube') || message.startsWith('/yt')) {
    const params = message.startsWith('/youtube') ? 
      message.substring(9).trim() : 
      message.substring(4).trim();
    return { type: 'youtube', params };
  } else if (message.startsWith('/flashcard') || message.startsWith('/fc')) {
    const params = message.startsWith('/flashcard') ? 
      message.substring(11).trim() : 
      message.substring(4).trim();
    return { type: 'flashcard', params };
  } else if (message.startsWith('/web') || message.startsWith('/search')) {
    const params = message.startsWith('/web') ? 
      message.substring(5).trim() : 
      message.substring(8).trim();
    return { type: 'websearch', params };
  } else if (message.startsWith('/summarize') || message.startsWith('/sum')) {
    const params = message.startsWith('/summarize') ? 
      message.substring(11).trim() : 
      message.substring(5).trim();
    return { type: 'summarize', params };
  }
  return null;
}
