
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MermaidDiagram } from './MermaidDiagram';
import { ArrowRight, FileDown, Copy, Check, Undo } from "lucide-react";

interface MermaidGeneratorProps {
  initialDiagram?: string;
  onClose: () => void;
  onSubmitDiagram: (result: string) => void;
}

export const MermaidGenerator: React.FC<MermaidGeneratorProps> = ({
  initialDiagram = '',
  onClose,
  onSubmitDiagram,
}) => {
  const [diagramCode, setDiagramCode] = useState(initialDiagram || getDefaultDiagram());
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  function getDefaultDiagram() {
    return `graph TD
    A[Start] --> B{Is it a process?}
    B -->|Yes| C[Show as flowchart]
    B -->|No| D[Show as relationship]
    C --> E[End]
    D --> E[End]`;
  }

  const examples = {
    flowchart: `graph TD
    A[Start] --> B{Decision}
    B -->|Yes| C[Process 1]
    B -->|No| D[Process 2]
    C --> E[End]
    D --> E[End]`,
    sequence: `sequenceDiagram
    participant User
    participant System
    User->>System: Request data
    System->>Database: Query
    Database-->>System: Return results
    System-->>User: Display data`,
    class: `classDiagram
    class Animal {
        +name: string
        +age: int
        +makeSound(): void
    }
    class Dog {
        +breed: string
        +bark(): void
    }
    Animal <|-- Dog`,
    entity: `erDiagram
    CUSTOMER ||--o{ ORDER : places
    ORDER ||--|{ LINE_ITEM : contains
    CUSTOMER }|..|{ DELIVERY-ADDRESS : uses`,
    mindmap: `mindmap
    root((Study Topics))
      Physics
        Mechanics
        Electromagnetism
        Quantum
      Mathematics
        Calculus
        Statistics
      Biology
        Genetics
        Ecology`
  };

  const selectExample = (example: keyof typeof examples) => {
    setDiagramCode(examples[example]);
  };

  const resetDiagram = () => {
    setDiagramCode(getDefaultDiagram());
  };

  const copyCode = () => {
    navigator.clipboard.writeText(diagramCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = () => {
    onSubmitDiagram(diagramCode);
  };

  const downloadSVG = () => {
    // Find the SVG element
    const svgElement = document.querySelector('.diagram-container svg');
    if (!svgElement) {
      console.error('No SVG element found');
      return;
    }

    // Get SVG source
    const serializer = new XMLSerializer();
    let source = serializer.serializeToString(svgElement);
    
    // Add namespaces
    if (!source.match(/^<svg[^>]+xmlns="http:\/\/www\.w3\.org\/2000\/svg"/)) {
      source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
    }
    if (!source.match(/^<svg[^>]+"http:\/\/www\.w3\.org\/1999\/xlink"/)) {
      source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
    }

    // Create a Blob from the SVG string
    const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
    
    // Create a download URL
    const url = URL.createObjectURL(blob);
    
    // Create a temporary link and trigger download
    const link = document.createElement('a');
    link.href = url;
    link.download = 'diagram.svg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-40 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-background rounded-lg border border-white/10 shadow-lg p-6 max-w-6xl w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Interactive Diagram Builder</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={resetDiagram}>
              <Undo className="h-4 w-4 mr-1" /> Reset
            </Button>
            <Button variant="outline" size="sm" onClick={copyCode}>
              {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
              {copied ? 'Copied' : 'Copy'}
            </Button>
            <Button variant="outline" size="sm" onClick={downloadSVG}>
              <FileDown className="h-4 w-4 mr-1" /> Download
            </Button>
          </div>
        </div>

        <Tabs defaultValue="editor" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="editor">Editor</TabsTrigger>
            <TabsTrigger value="examples">Examples</TabsTrigger>
            <TabsTrigger value="help">Help</TabsTrigger>
          </TabsList>

          <TabsContent value="editor" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-2">Diagram Code</h3>
                <Textarea
                  value={diagramCode}
                  onChange={(e) => {
                    setDiagramCode(e.target.value);
                    setPreviewError(null);
                  }}
                  className="font-mono h-96 resize-none"
                  placeholder="Enter your Mermaid.js diagram code here..."
                />
                {previewError && (
                  <div className="mt-2 text-red-500 text-sm">{previewError}</div>
                )}
              </div>
              <div>
                <h3 className="font-medium mb-2">Preview</h3>
                <div className="border rounded-lg bg-muted/20 h-96 overflow-auto">
                  <MermaidDiagram chart={diagramCode} />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="examples" className="space-y-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="p-4 hover:bg-accent/50 cursor-pointer" onClick={() => selectExample('flowchart')}>
                <h3 className="font-medium mb-2">Flowchart</h3>
                <p className="text-sm text-muted-foreground mb-2">Visualize a process or workflow</p>
                <div className="h-32 overflow-hidden border rounded-lg p-2 text-xs font-mono bg-muted/20">
                  {examples.flowchart}
                </div>
              </Card>

              <Card className="p-4 hover:bg-accent/50 cursor-pointer" onClick={() => selectExample('sequence')}>
                <h3 className="font-medium mb-2">Sequence Diagram</h3>
                <p className="text-sm text-muted-foreground mb-2">Show interactions between systems</p>
                <div className="h-32 overflow-hidden border rounded-lg p-2 text-xs font-mono bg-muted/20">
                  {examples.sequence}
                </div>
              </Card>

              <Card className="p-4 hover:bg-accent/50 cursor-pointer" onClick={() => selectExample('class')}>
                <h3 className="font-medium mb-2">Class Diagram</h3>
                <p className="text-sm text-muted-foreground mb-2">Represent object-oriented structures</p>
                <div className="h-32 overflow-hidden border rounded-lg p-2 text-xs font-mono bg-muted/20">
                  {examples.class}
                </div>
              </Card>

              <Card className="p-4 hover:bg-accent/50 cursor-pointer" onClick={() => selectExample('entity')}>
                <h3 className="font-medium mb-2">Entity Relationship</h3>
                <p className="text-sm text-muted-foreground mb-2">Show database relationships</p>
                <div className="h-32 overflow-hidden border rounded-lg p-2 text-xs font-mono bg-muted/20">
                  {examples.entity}
                </div>
              </Card>

              <Card className="p-4 hover:bg-accent/50 cursor-pointer" onClick={() => selectExample('mindmap')}>
                <h3 className="font-medium mb-2">Mind Map</h3>
                <p className="text-sm text-muted-foreground mb-2">Organize ideas and concepts</p>
                <div className="h-32 overflow-hidden border rounded-lg p-2 text-xs font-mono bg-muted/20">
                  {examples.mindmap}
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="help" className="space-y-4">
            <div className="prose max-w-none dark:prose-invert">
              <h3>Mermaid.js Syntax Reference</h3>
              <p>
                Mermaid allows you to create diagrams and visualizations using text and code.
                Here are some basic syntax examples:
              </p>

              <h4>Flowcharts</h4>
              <pre className="bg-muted/20 p-2 rounded-lg overflow-x-auto">
                {`graph TD
    A[Rectangle] --> B(Rounded Rectangle)
    B --> C{Decision}
    C -->|Yes| D[Result 1]
    C -->|No| E[Result 2]`}
              </pre>

              <h4>Sequence Diagrams</h4>
              <pre className="bg-muted/20 p-2 rounded-lg overflow-x-auto">
                {`sequenceDiagram
    Alice->>John: Hello John, how are you?
    John-->>Alice: Great!`}
              </pre>

              <h4>Class Diagrams</h4>
              <pre className="bg-muted/20 p-2 rounded-lg overflow-x-auto">
                {`classDiagram
    Animal <|-- Duck
    Animal <|-- Fish
    Animal : +name String
    Animal: +age int
    Animal: +makeSound()`}
              </pre>

              <p>
                <a 
                  href="https://mermaid.js.org/syntax/flowchart.html" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-700"
                >
                  Visit the Mermaid.js documentation for more syntax examples
                </a>
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>
            <ArrowRight className="h-4 w-4 mr-2" />
            Insert Diagram
          </Button>
        </div>
      </div>
    </div>
  );
};
