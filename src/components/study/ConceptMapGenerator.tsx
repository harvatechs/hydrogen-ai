
import React, { useState, useCallback, useRef } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Panel,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Card, 
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { 
  Loader2, 
  Network, 
  Check, 
  X,
  Download,
  Zap,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { validateAndSanitizeInput } from "@/utils/securityUtils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ConceptMapGeneratorProps {
  onClose: () => void;
  onSubmitMap: (mapHtml: string) => void;
  initialTopic?: string;
}

const nodeTypes = {};

export const ConceptMapGenerator: React.FC<ConceptMapGeneratorProps> = ({
  onClose,
  onSubmitMap,
  initialTopic = ''
}) => {
  const [topic, setTopic] = useState(initialTopic);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  // React Flow states
  const initialNodes = [
    {
      id: 'main',
      data: { label: topic || 'Your Topic' },
      position: { x: 250, y: 200 },
      style: {
        background: '#9E86ED',
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        padding: '10px 20px',
        width: 180,
        fontWeight: 'bold',
      },
    }
  ];
  
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const reactFlowWrapper = useRef<HTMLDivElement | null>(null);
  
  const onConnect = useCallback((params: any) => {
    setEdges((eds) => addEdge({
      ...params,
      animated: true,
      style: { stroke: '#9E86ED' },
    }, eds));
  }, [setEdges]);
  
  const handleTopicChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const validation = validateAndSanitizeInput(e.target.value);
    if (validation.isValid) {
      setTopic(validation.sanitizedInput || e.target.value);
      setErrorMessage("");
    } else {
      setErrorMessage(validation.message || "Invalid input");
    }
  };

  // Simulate generating a concept map
  const generateConceptMap = async () => {
    if (!topic.trim()) {
      setErrorMessage("Please enter a topic");
      return;
    }
    
    setIsLoading(true);
    setErrorMessage("");
    
    try {
      // Simulated AI response
      // In a real implementation, this would call an AI API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create a mind map structure based on the topic
      const newNodes = [
        {
          id: 'main',
          data: { label: topic },
          position: { x: 250, y: 200 },
          style: {
            background: '#9E86ED',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            padding: '10px 20px',
            width: 180,
            fontWeight: 'bold',
          },
        }
      ];
      
      // Generate subtopics
      const subtopics = generateSimulatedSubtopics(topic);
      
      // Add subtopic nodes
      for (let i = 0; i < subtopics.length; i++) {
        const angle = (2 * Math.PI * i) / subtopics.length;
        const radius = 200;
        const x = 250 + radius * Math.cos(angle);
        const y = 200 + radius * Math.sin(angle);
        
        newNodes.push({
          id: `subtopic-${i}`,
          data: { label: subtopics[i].title },
          position: { x, y },
          style: {
            background: subtopics[i].color,
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '8px 16px',
            width: 150,
            fontWeight: 'normal', // Added the missing fontWeight property here
          },
        });
      }
      
      // Generate connections
      const newEdges = subtopics.map((_, i) => ({
        id: `edge-${i}`,
        source: 'main',
        target: `subtopic-${i}`,
        animated: true,
        style: { stroke: '#9E86ED' },
      }));
      
      // Update the state with new nodes and edges
      setNodes(newNodes);
      setEdges(newEdges);
      
      toast({
        title: "Mind Map Generated",
        description: `Created a concept map for "${topic}"`
      });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to generate mind map");
      toast({
        title: "Error",
        description: "Failed to generate mind map",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSubmit = () => {
    if (nodes.length <= 1) {
      toast({
        title: "No mind map",
        description: "Please generate a mind map first",
        variant: "destructive"
      });
      return;
    }
    
    // Create HTML representation of the mind map
    const htmlContent = `
      <div class="space-y-4 mt-4">
        <div class="border border-white/10 rounded-lg p-4 bg-black/20">
          <h3 class="text-purple-400 font-medium mb-2">Concept Map: ${topic}</h3>
          <div class="flex flex-wrap gap-2 mt-3">
            ${nodes.slice(1).map(node => 
              `<div class="px-3 py-1 rounded-full text-sm" style="background-color: ${node.style?.background}; color: white;">
                ${node.data.label}
              </div>`
            ).join('')}
          </div>
        </div>
      </div>
    `;
    
    onSubmitMap(htmlContent);
  };
  
  // Helper function to generate simulated subtopics
  const generateSimulatedSubtopics = (mainTopic: string) => {
    // This is where you would call your AI API
    // For now, we'll generate some dummy subtopics based on the main topic
    const topics = [
      { title: `History of ${mainTopic}`, color: '#4285F4' },
      { title: `${mainTopic} principles`, color: '#EA4335' },
      { title: `${mainTopic} applications`, color: '#34A853' },
      { title: `Future of ${mainTopic}`, color: '#FBBC05' },
      { title: `${mainTopic} techniques`, color: '#FF7043' },
    ];
    
    // Random selection of 3-5 topics
    const count = Math.floor(Math.random() * 3) + 3;
    return topics.slice(0, count);
  };
  
  return (
    <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-5xl h-[80vh] shadow-xl border-white/10 dark:bg-black/90 light:bg-white/95 flex flex-col">
        <CardHeader className="border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Network className="h-5 w-5 text-purple-400" />
              <CardTitle>Concept Map Generator</CardTitle>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription>
            Visualize concepts and their relationships
          </CardDescription>
        </CardHeader>
        
        <div className="p-4 border-b border-white/10">
          <div className="flex gap-2">
            <Textarea
              placeholder="Enter a topic to generate a concept map..."
              value={topic}
              onChange={handleTopicChange}
              className="resize-none h-20"
            />
            <Button 
              className="whitespace-nowrap bg-purple-600 hover:bg-purple-700"
              onClick={generateConceptMap}
              disabled={isLoading || !topic.trim()}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  Generate Map
                </>
              )}
            </Button>
          </div>
          
          {errorMessage && (
            <div className="text-red-500 text-sm mt-2">
              {errorMessage}
            </div>
          )}
        </div>
        
        <CardContent className="flex-grow p-0 relative">
          <div ref={reactFlowWrapper} className="h-full w-full">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              nodeTypes={nodeTypes}
              fitView
              attributionPosition="bottom-right"
            >
              <Controls />
              <MiniMap 
                nodeStrokeColor={(n) => {
                  return n.style?.background as string || '#eee';
                }}
                nodeColor={(n) => {
                  return n.style?.background as string || '#fff';
                }}
              />
              <Background color="#aaa" gap={16} />
              <Panel position="top-right">
                <Button variant="outline" size="sm" className="shadow-sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </Panel>
            </ReactFlow>
          </div>
        </CardContent>
        
        <CardFooter className="border-t border-white/10 p-4">
          <div className="flex justify-between w-full">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            
            <Button
              onClick={handleSubmit}
              className="bg-purple-600 hover:bg-purple-700 text-white"
              disabled={nodes.length <= 1}
            >
              <Check className="mr-2 h-4 w-4" />
              Use Map
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

