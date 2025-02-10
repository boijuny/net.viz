import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { getGraph, getNodeDetails } from '../services/api';
import { NodeDetails, ModelSummary, GraphData } from '../types/models';
import NetworkGraph from './NetworkGraph';

const formatBytes = (bytes: number): string => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Byte';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${Math.round((bytes / Math.pow(1024, i)) * 100) / 100} ${sizes[i]}`;
};

const getDataTypeName = (dataType: number): string => {
  // ONNX data type mapping
  const dataTypes: Record<number, string> = {
    1: 'FLOAT',
    2: 'UINT8',
    3: 'INT8',
    4: 'UINT16',
    5: 'INT16',
    6: 'INT32',
    7: 'INT64',
    8: 'STRING',
    9: 'BOOL',
    10: 'FLOAT16',
    11: 'DOUBLE',
    12: 'UINT32',
    13: 'UINT64',
    14: 'COMPLEX64',
    15: 'COMPLEX128',
  };
  return dataTypes[dataType] || `Unknown (${dataType})`;
};

const ModelViewer: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<NodeDetails | null>(null);
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [modelSummary] = useState<ModelSummary | null>(() => {
    const stored = localStorage.getItem('modelSummary');
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    const fetchGraph = async () => {
      try {
        const data = await getGraph();
        setGraphData(data);
      } catch (err) {
        setError('Failed to load graph data');
        console.error(err);
        toast.error('Failed to load graph data');
      } finally {
        setLoading(false);
      }
    };

    fetchGraph();
  }, []);

  const handleNodeClick = async (nodeId: string) => {
    try {
      const details = await getNodeDetails(nodeId);
      setSelectedNode(details);
    } catch (err) {
      toast.error('Failed to load node details');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <div className="animate-spin">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-200px)] relative flex">
      <div className={`flex-1 transition-all duration-300 ${selectedNode ? 'mr-80' : ''}`}>
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Model Summary</CardTitle>
          </CardHeader>
          <CardContent>
            {modelSummary && (
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium">Nodes</p>
                  <p className="text-2xl">{modelSummary.num_nodes}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Producer</p>
                  <p className="text-2xl">{modelSummary.producer_name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Version</p>
                  <p className="text-2xl">{modelSummary.model_version}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <div className="flex gap-4 h-[calc(100%-100px)]">
          <div className="flex-1 border rounded-lg overflow-hidden">
            {graphData && (
              <NetworkGraph 
                onNodeClick={handleNodeClick} 
                data={graphData}
              />
            )}
          </div>
        </div>
      </div>

      {selectedNode && (
        <div className="fixed right-0 top-0 bottom-0 w-80 border-l bg-background/95 backdrop-blur-sm shadow-lg p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Node Details</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedNode(null)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-medium mb-2">Name</h4>
              <p className="text-sm text-muted-foreground">{selectedNode.name}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-2">Type</h4>
              <p className="text-sm text-muted-foreground">{selectedNode.op_type}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-2">Inputs</h4>
              <div className="space-y-1">
                {selectedNode.input.map((input, i) => (
                  <div key={i} className="text-sm">
                    <p className="text-muted-foreground">{input}</p>
                    {selectedNode.weights[input] && (
                      <div className="mt-1 ml-4 p-2 rounded bg-muted/50 space-y-1">
                        <p className="text-xs">
                          <span className="font-medium">Shape:</span>{' '}
                          <span className="text-muted-foreground">
                            [{selectedNode.weights[input].dims.join(', ')}]
                          </span>
                        </p>
                        <p className="text-xs">
                          <span className="font-medium">Type:</span>{' '}
                          <span className="text-muted-foreground">
                            {getDataTypeName(selectedNode.weights[input].data_type)}
                          </span>
                        </p>
                        <p className="text-xs">
                          <span className="font-medium">Size:</span>{' '}
                          <span className="text-muted-foreground">
                            {formatBytes(selectedNode.weights[input].size)}
                          </span>
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-2">Outputs</h4>
              <div className="space-y-1">
                {selectedNode.output.map((output, i) => (
                  <p key={i} className="text-sm text-muted-foreground">{output}</p>
                ))}
              </div>
            </div>
            {Object.keys(selectedNode.attributes).length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Attributes</h4>
                <div className="space-y-1">
                  {Object.entries(selectedNode.attributes).map(([key, value]) => (
                    <div key={key} className="text-sm">
                      <span className="font-medium">{key}:</span>{' '}
                      <span className="text-muted-foreground">
                        {JSON.stringify(value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelViewer; 