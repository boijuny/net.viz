import React, { useCallback, useEffect, useState } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
  Handle,
  Position,
  NodeProps,
  MiniMap,
  useReactFlow,
  ReactFlowProvider,
} from 'reactflow';
import dagre from 'dagre';
import 'reactflow/dist/style.css';
import { GraphData } from '../types/models';
import Legend from './Legend';
import GraphToolbar from './GraphToolbar';
import { Card, CardContent } from './ui/card';

// Type definitions
interface NodeStyle {
  color: string;
  gradient: string;
  icon: string;
  category: string;
}

interface NodeData {
  label: string;
  type: keyof typeof nodeStyles | 'default';
  input?: any;
  output?: any;
  attributes?: any;
}

interface NetworkGraphProps {
  onNodeClick: (nodeId: string) => void;
  data: GraphData;
}

type FlowNode = Node<NodeData>;

// Enhanced color scheme with semantic grouping
const nodeStyles: Record<string, NodeStyle> = {
  // Feature Extraction (CNN family)
  Conv: {
    color: '#4285f4',
    gradient: 'linear-gradient(45deg, #4285f4, #2b6cb0)',
    icon: '⊞',
    category: 'Feature Extraction'
  },
  ConvTranspose: {
    color: '#4285f4',
    gradient: 'linear-gradient(45deg, #4285f4, #2b6cb0)',
    icon: '⊟',
    category: 'Feature Extraction'
  },
  MaxPool: {
    color: '#4285f4',
    gradient: 'linear-gradient(45deg, #4285f4, #2b6cb0)',
    icon: '▼',
    category: 'Feature Extraction'
  },
  AveragePool: {
    color: '#4285f4',
    gradient: 'linear-gradient(45deg, #4285f4, #2b6cb0)',
    icon: '▽',
    category: 'Feature Extraction'
  },
  GlobalAveragePool: {
    color: '#4285f4',
    gradient: 'linear-gradient(45deg, #4285f4, #2b6cb0)',
    icon: '◇',
    category: 'Feature Extraction'
  },
  
  // Dense Operations (Linear transformations)
  Linear: {
    color: '#ea4335',
    gradient: 'linear-gradient(45deg, #ea4335, #c53030)',
    icon: '→',
    category: 'Dense'
  },
  Gemm: {
    color: '#ea4335',
    gradient: 'linear-gradient(45deg, #ea4335, #c53030)',
    icon: '→',
    category: 'Dense'
  },
  MatMul: {
    color: '#ea4335',
    gradient: 'linear-gradient(45deg, #ea4335, #c53030)',
    icon: '⊗',
    category: 'Dense'
  },

  // Sequence Processing
  LSTM: {
    color: '#ec4899',
    gradient: 'linear-gradient(45deg, #ec4899, #be185d)',
    icon: '↻',
    category: 'Sequence'
  },
  GRU: {
    color: '#ec4899',
    gradient: 'linear-gradient(45deg, #ec4899, #be185d)',
    icon: '↻',
    category: 'Sequence'
  },
  RNN: {
    color: '#ec4899',
    gradient: 'linear-gradient(45deg, #ec4899, #be185d)',
    icon: '↻',
    category: 'Sequence'
  },
  Embedding: {
    color: '#ec4899',
    gradient: 'linear-gradient(45deg, #ec4899, #be185d)',
    icon: '⋈',
    category: 'Sequence'
  },

  // Attention Mechanisms
  MultiHeadAttention: {
    color: '#9333ea',
    gradient: 'linear-gradient(45deg, #9333ea, #6b21a8)',
    icon: '⊕',
    category: 'Attention'
  },
  Attention: {
    color: '#9333ea',
    gradient: 'linear-gradient(45deg, #9333ea, #6b21a8)',
    icon: '⊕',
    category: 'Attention'
  },
  SelfAttention: {
    color: '#9333ea',
    gradient: 'linear-gradient(45deg, #9333ea, #6b21a8)',
    icon: '⊕',
    category: 'Attention'
  },
  
  // Activation Functions
  ReLU: {
    color: '#34a853',
    gradient: 'linear-gradient(45deg, #34a853, #166534)',
    icon: '⌈',
    category: 'Activation'
  },
  GELU: {
    color: '#34a853',
    gradient: 'linear-gradient(45deg, #34a853, #166534)',
    icon: '∿',
    category: 'Activation'
  },
  Sigmoid: {
    color: '#34a853',
    gradient: 'linear-gradient(45deg, #34a853, #166534)',
    icon: 'σ',
    category: 'Activation'
  },
  Tanh: {
    color: '#34a853',
    gradient: 'linear-gradient(45deg, #34a853, #166534)',
    icon: '∫',
    category: 'Activation'
  },
  
  // Normalization & Regularization
  BatchNormalization: {
    color: '#009688',
    gradient: 'linear-gradient(45deg, #009688, #047481)',
    icon: 'β',
    category: 'Normalization'
  },
  LayerNorm: {
    color: '#009688',
    gradient: 'linear-gradient(45deg, #009688, #047481)',
    icon: 'λ',
    category: 'Normalization'
  },
  GroupNorm: {
    color: '#009688',
    gradient: 'linear-gradient(45deg, #009688, #047481)',
    icon: 'γ',
    category: 'Normalization'
  },
  Dropout: {
    color: '#009688',
    gradient: 'linear-gradient(45deg, #009688, #047481)',
    icon: '⊘',
    category: 'Normalization'
  },

  // Shape Operations
  Reshape: {
    color: '#9c27b0',
    gradient: 'linear-gradient(45deg, #9c27b0, #6b46c1)',
    icon: '⇄',
    category: 'Shape'
  },
  Transpose: {
    color: '#9c27b0',
    gradient: 'linear-gradient(45deg, #9c27b0, #6b46c1)',
    icon: '⇄',
    category: 'Shape'
  },
  Flatten: {
    color: '#9c27b0',
    gradient: 'linear-gradient(45deg, #9c27b0, #6b46c1)',
    icon: '⇒',
    category: 'Shape'
  },
  Squeeze: {
    color: '#9c27b0',
    gradient: 'linear-gradient(45deg, #9c27b0, #6b46c1)',
    icon: '⇒',
    category: 'Shape'
  },
  
  // Element-wise Operations
  Add: {
    color: '#673ab7',
    gradient: 'linear-gradient(45deg, #673ab7, #4c51bf)',
    icon: '+',
    category: 'Element-wise'
  },
  Mul: {
    color: '#673ab7',
    gradient: 'linear-gradient(45deg, #673ab7, #4c51bf)',
    icon: '×',
    category: 'Element-wise'
  },
  Div: {
    color: '#673ab7',
    gradient: 'linear-gradient(45deg, #673ab7, #4c51bf)',
    icon: '÷',
    category: 'Element-wise'
  },
  Sub: {
    color: '#673ab7',
    gradient: 'linear-gradient(45deg, #673ab7, #4c51bf)',
    icon: '−',
    category: 'Element-wise'
  },
  
  // Reduction Operations
  ReduceMean: {
    color: '#64748b',
    gradient: 'linear-gradient(45deg, #64748b, #475569)',
    icon: 'μ',
    category: 'Reduction'
  },
  ReduceSum: {
    color: '#64748b',
    gradient: 'linear-gradient(45deg, #64748b, #475569)',
    icon: 'Σ',
    category: 'Reduction'
  },
  ReduceMax: {
    color: '#64748b',
    gradient: 'linear-gradient(45deg, #64748b, #475569)',
    icon: '∨',
    category: 'Reduction'
  },
  ReduceMin: {
    color: '#64748b',
    gradient: 'linear-gradient(45deg, #64748b, #475569)',
    icon: '∧',
    category: 'Reduction'
  },

  // Constants & Initialization
  Constant: {
    color: '#0ea5e9',
    gradient: 'linear-gradient(45deg, #0ea5e9, #0284c7)',
    icon: '∁',
    category: 'Constants'
  },
  Identity: {
    color: '#0ea5e9',
    gradient: 'linear-gradient(45deg, #0ea5e9, #0284c7)',
    icon: '≡',
    category: 'Constants'
  },
  
  // Default style for unknown types
  default: {
    color: '#737373',
    gradient: 'linear-gradient(45deg, #737373, #404040)',
    icon: '◆',
    category: 'Other'
  },
};

// Helper function for type-safe node style access
const getNodeStyle = (nodeType: keyof typeof nodeStyles | string): NodeStyle => {
  return nodeStyles[nodeType as keyof typeof nodeStyles] || nodeStyles.default;
};

// Custom node component with input and output handles
const CustomNode = ({ data, id, selected }: NodeProps<NodeData>) => {
  const style = getNodeStyle(data.type);
  
  return (
    <div
      className={`shadow-lg rounded-lg border-2 transition-all hover:shadow-xl ${
        selected ? 'border-primary ring-2 ring-primary ring-opacity-50 scale-105' : 'border-border'
      }`}
      style={{
        background: style.gradient,
        minWidth: '220px',
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-2 h-2 !bg-background"
      />
      <div className="flex items-center p-3 gap-3">
        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
          <span className="text-2xl text-white">{style.icon}</span>
        </div>
        <div className="flex flex-col min-w-0">
          <div className="text-sm font-bold text-white truncate">
            {data.type}
          </div>
          <div className="text-[11px] text-white/80 truncate">
            {data.label}
          </div>
          <div className="text-[10px] text-white/60 mt-0.5 flex items-center gap-1">
            <span className="inline-flex items-center rounded-sm bg-white/20 px-1.5 py-0.5">
              {style.category}
            </span>
          </div>
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-2 h-2 !bg-background"
      />
    </div>
  );
};

const nodeTypes = {
  custom: CustomNode,
};

const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'TB') => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({
    rankdir: direction,
    nodesep: isHorizontal ? 80 : 40,
    ranksep: isHorizontal ? 200 : 80,
    edgesep: 30,
    ranker: 'network-simplex',
    align: 'DL',
  });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { 
      width: 220,
      height: 80,
    });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - 110,
        y: nodeWithPosition.y - 40,
      },
    };
  });

  return {
    nodes: layoutedNodes,
    edges,
  };
};

const NetworkGraph: React.FC<NetworkGraphProps> = ({ onNodeClick, data }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<FlowNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);
  const [showGrid, setShowGrid] = useState(true);
  const [showMinimap, setShowMinimap] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [layout, setLayout] = useState<'TB' | 'LR'>('TB');
  
  const { zoomIn, zoomOut, fitView } = useReactFlow();

  const updateLayout = useCallback((direction: 'TB' | 'LR') => {
    setLayout(direction);
    if (!data) return;

    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      nodes,
      edges,
      direction
    );

    setNodes([...layoutedNodes]);
    setEdges([...layoutedEdges]);
    
    setTimeout(() => {
      fitView({ padding: 0.2 });
    }, 0);
  }, [nodes, edges, setNodes, setEdges, fitView, data]);

  useEffect(() => {
    if (!data) return;

    const flowNodes: FlowNode[] = data.nodes.map((node) => ({
      id: node.id,
      type: 'custom',
      position: { x: 0, y: 0 },
      data: {
        label: node.label,
        type: node.type as keyof typeof nodeStyles,
        input: node.data.input,
        output: node.data.output,
        attributes: node.data.attributes,
      },
    }));

    console.log('Processed nodes for Legend:', flowNodes);

    const flowEdges: Edge[] = data.edges.map((edge, index) => ({
      id: `e${index}`,
      source: edge.source as string,
      target: edge.target as string,
      type: 'smoothstep',
      animated: true,
      style: { 
        stroke: 'rgba(148, 163, 184, 0.6)', 
        strokeWidth: 2,
      },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: 'rgba(148, 163, 184, 0.6)',
        width: 20,
        height: 20,
      },
      label: showLabels ? edge.data?.tensor_name : undefined,
      labelStyle: { 
        fill: '#64748b', 
        fontSize: 11, 
        fontWeight: 500,
      },
      labelBgStyle: { 
        fill: 'rgba(255, 255, 255, 0.95)', 
        rx: 4, 
        padding: 4,
      },
    }));

    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      flowNodes,
      flowEdges,
      layout
    );

    setNodes(layoutedNodes);
    setEdges(layoutedEdges);

    // Add a small delay to ensure the graph is rendered before fitting view
    setTimeout(() => {
      fitView({
        padding: 0.2,
        minZoom: 0.5,
        maxZoom: 1.5,
        duration: 800,
        nodes: layoutedNodes.slice(0, Math.min(5, layoutedNodes.length)) // Focus on first few nodes
      });
    }, 100);
  }, [data, setNodes, setEdges, layout, showLabels, fitView]);

  const handleNodeClick = useCallback((event: React.MouseEvent, node: FlowNode) => {
    onNodeClick(node.id);
  }, [onNodeClick]);

  // Debug log with type safety
  console.log('NetworkGraph Initial Data:', {
    nodesCount: nodes.length,
    edgesCount: edges.length,
    nodes: nodes.map((node) => ({
      id: node.id,
      type: node.data?.type || 'default',
      style: getNodeStyle(node.data?.type || 'default')
    }))
  });

  return (
    <div className="flex gap-4 w-full h-full">
      <div className="relative flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={handleNodeClick}
          nodeTypes={nodeTypes}
          fitView={false}
          minZoom={0.1}
          maxZoom={2}
          defaultViewport={{ 
            x: 0,
            y: 0,
            zoom: 1.2
          }}
          defaultEdgeOptions={{
            type: 'smoothstep',
            animated: true,
          }}
          proOptions={{ hideAttribution: true }}
          className="bg-background/50 backdrop-blur-sm rounded-lg border"
        >
          {showGrid && <Background gap={12} size={1} />}
          <Controls />
          {showMinimap && (
            <MiniMap 
              nodeColor={(node) => getNodeStyle(node.data.type).color}
              maskColor="rgb(0, 0, 0, 0.1)"
              className="bg-card/50 rounded-lg"
            />
          )}
        </ReactFlow>

        <GraphToolbar
          onZoomIn={() => zoomIn()}
          onZoomOut={() => zoomOut()}
          onFitView={() => fitView({ padding: 0.2 })}
          onToggleGrid={() => setShowGrid(!showGrid)}
          onToggleMinimap={() => setShowMinimap(!showMinimap)}
          onToggleLabels={() => setShowLabels(!showLabels)}
          onChangeLayout={updateLayout}
          showGrid={showGrid}
          showMinimap={showMinimap}
          showLabels={showLabels}
          currentLayout={layout}
        />
      </div>

      <div className="w-80 flex-shrink-0">
        <Card className="sticky top-4">
          <CardContent>
            <Legend nodes={nodes} nodeStyles={nodeStyles} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Wrap the main component with ReactFlowProvider
const NetworkGraphWrapper: React.FC<NetworkGraphProps> = (props) => {
  return (
    <ReactFlowProvider>
      <NetworkGraph {...props} />
    </ReactFlowProvider>
  );
};

export default NetworkGraphWrapper; 