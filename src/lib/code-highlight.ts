
export const supportedLanguages = [
  { name: 'Plain Text', value: 'plaintext' },
  { name: 'JavaScript', value: 'javascript' },
  { name: 'TypeScript', value: 'typescript' },
  { name: 'Python', value: 'python' },
  { name: 'Java', value: 'java' },
  { name: 'C', value: 'c' },
  { name: 'C++', value: 'cpp' },
  { name: 'C#', value: 'csharp' },
  { name: 'HTML', value: 'html' },
  { name: 'CSS', value: 'css' },
  { name: 'Markdown', value: 'markdown' },
  { name: 'JSON', value: 'json' },
  { name: 'YAML', value: 'yaml' },
  { name: 'SQL', value: 'sql' },
  { name: 'PHP', value: 'php' },
  { name: 'Ruby', value: 'ruby' },
  { name: 'Go', value: 'go' },
  { name: 'Rust', value: 'rust' },
  { name: 'Shell/Bash', value: 'bash' },
  { name: 'PowerShell', value: 'powershell' }
];

// Function to identify the language from a code block
export const identifyLanguage = (languageCode: string): string => {
  const normCode = languageCode.toLowerCase().trim();
  
  // Handle common aliases and variations
  const aliases: Record<string, string> = {
    'js': 'javascript',
    'ts': 'typescript',
    'py': 'python',
    'cs': 'csharp',
    'golang': 'go',
    'sh': 'bash',
    'shell': 'bash',
    'yml': 'yaml'
  };
  
  if (aliases[normCode]) {
    return aliases[normCode];
  }
  
  // Try to find a direct match
  const match = supportedLanguages.find(lang => lang.value === normCode);
  if (match) {
    return match.value;
  }
  
  // Default to plaintext if no match
  return 'plaintext';
};
