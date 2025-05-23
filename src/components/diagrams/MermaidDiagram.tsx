
import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Maximize2, Minimize2, Copy, Check } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface MermaidDiagramProps {
  chart: string;
  title?: string;
  className?: string;
  caption?: string;
}

export const MermaidDiagram: React.FC<MermaidDiagramProps> = ({
  chart,
  title,
  className,
  caption,
}) => {
  const diagramRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [uniqueId] = useState(`mermaid-${Math.random().toString(36).substring(2, 11)}`);

  useEffect(() => {
    // Initialize mermaid with dark theme support
    mermaid.initialize({
      theme: document.documentElement.classList.contains('dark') ? 'dark' : 'default',
      startOnLoad: true,
      securityLevel: 'strict',
      fontFamily: 'inherit',
    });

    const renderDiagram = async () => {
      if (diagramRef.current) {
        try {
          diagramRef.current.innerHTML = '';
          // Fix: Use mermaid.render() instead of mermaid.run() with the proper API
          const { svg } = await mermaid.render(uniqueId, chart);
          diagramRef.current.innerHTML = svg;
        } catch (error) {
          console.error("Failed to render Mermaid diagram:", error);
          if (diagramRef.current) {
            diagramRef.current.innerHTML = `<div class="p-4 text-red-500">
              Error rendering diagram: ${error instanceof Error ? error.message : String(error)}
            </div>`;
          }
        }
      }
    };

    // Small delay to ensure the DOM is ready
    const timerId = setTimeout(renderDiagram, 50);
    return () => clearTimeout(timerId);
  }, [chart, uniqueId]);

  const copyDiagramCode = () => {
    navigator.clipboard.writeText(chart);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className={`my-4 ${className || ''}`}>
      <div className="p-4 border-b border-border flex justify-between items-center">
        <div>
          {title && <h3 className="font-medium text-md">{title}</h3>}
          {caption && <p className="text-sm text-muted-foreground">{caption}</p>}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={copyDiagramCode} title="Copy diagram code">
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
          <Button variant="outline" size="icon" onClick={() => setExpanded(true)} title="View full screen">
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="p-4 overflow-auto max-h-96 diagram-container">
        <div id={uniqueId} ref={diagramRef} className="mermaid"></div>
      </div>

      <Dialog open={expanded} onOpenChange={setExpanded}>
        <DialogContent className="sm:max-w-4xl h-[90vh]">
          <div className="flex justify-between items-center mb-4">
            {title && <h3 className="font-medium text-lg">{title}</h3>}
            <Button variant="outline" size="icon" onClick={() => setExpanded(false)} title="Close full screen">
              <Minimize2 className="h-4 w-4" />
            </Button>
          </div>
          <div className="overflow-auto h-full p-4 border rounded-lg">
            <div id={`${uniqueId}-expanded`} className="mermaid">
              {chart}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
