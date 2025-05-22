
/**
 * Utility functions for working with diagrams
 */
import mermaid from 'mermaid';

/**
 * Initialize Mermaid with appropriate configuration
 */
export function initializeMermaid() {
  mermaid.initialize({
    theme: document.documentElement.classList.contains('dark') ? 'dark' : 'default',
    startOnLoad: true,
    securityLevel: 'strict',
    flowchart: {
      htmlLabels: true,
      curve: 'basis'
    },
    sequence: {
      diagramMarginX: 50,
      diagramMarginY: 10,
      actorMargin: 50,
      width: 150,
      height: 65,
      boxMargin: 10,
      boxTextMargin: 5,
      noteMargin: 10,
    },
    er: {
      diagramPadding: 20,
      layoutDirection: 'TB',
      minEntityWidth: 100,
      minEntityHeight: 75,
      entityPadding: 15,
      stroke: 'gray',
    },
    gantt: {
      titleTopMargin: 25,
      barHeight: 20,
      barGap: 4,
      topPadding: 50,
      leftPadding: 75,
      gridLineStartPadding: 35,
      fontSize: 11,
      sectionFontSize: 11,
      numberSectionStyles: 4,
    }
  });
}

/**
 * Generate example diagram code for a given type
 */
export function getDiagramExample(type: 'flowchart' | 'sequence' | 'class' | 'er' | 'gantt' | 'mindmap' = 'flowchart'): string {
  switch (type) {
    case 'flowchart':
      return `graph TD
    A[Start] --> B{Decision}
    B -->|Yes| C[Process 1]
    B -->|No| D[Process 2]
    C --> E[End]
    D --> E[End]`;
    
    case 'sequence':
      return `sequenceDiagram
    participant User
    participant System
    participant Database
    User->>System: Request data
    System->>Database: Query
    Database-->>System: Return results
    System-->>User: Display data`;
    
    case 'class':
      return `classDiagram
    class Animal {
        +name: string
        +age: int
        +makeSound(): void
    }
    class Dog {
        +breed: string
        +bark(): void
    }
    Animal <|-- Dog`;
    
    case 'er':
      return `erDiagram
    CUSTOMER ||--o{ ORDER : places
    ORDER ||--|{ LINE_ITEM : contains
    CUSTOMER }|..|{ DELIVERY_ADDRESS : uses`;
    
    case 'gantt':
      return `gantt
    title Project Schedule
    dateFormat  YYYY-MM-DD
    section Planning
    Requirements analysis: 2023-01-01, 2023-01-07
    System design: 2023-01-08, 2023-01-15
    section Development
    Implementation: 2023-01-16, 2023-02-15
    Testing: 2023-02-16, 2023-02-28`;
    
    case 'mindmap':
      return `mindmap
    root((Main Topic))
      Subtopic 1
        Detail A
        Detail B
      Subtopic 2
        Detail C
        Detail D`;
      
    default:
      return `graph TD
    A[Start] --> B{Decision}
    B -->|Yes| C[Process 1]
    B -->|No| D[Process 2]
    C --> E[End]
    D --> E[End]`;
  }
}

/**
 * Validate Mermaid syntax
 */
export async function validateMermaidSyntax(code: string): Promise<{ isValid: boolean; error?: string }> {
  try {
    const { parser } = await mermaid.parseSync(code);
    return { isValid: true };
  } catch (error) {
    return { 
      isValid: false, 
      error: error instanceof Error ? error.message : String(error)
    };
  }
}
