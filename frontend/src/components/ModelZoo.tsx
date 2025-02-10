import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { uploadModel } from '../services/api';

interface ModelInfo {
  name: string;
  description: string;
  architecture: string[];
  filename: string;
}

const sampleModels: ModelInfo[] = [
  {
    name: 'Simple CNN',
    description: 'A basic convolutional neural network for image classification',
    architecture: [
      'Input: 224x224x3 image',
      'Conv1: 3x3 kernel, 16 filters',
      'ReLU',
      'Conv2: 3x3 kernel, 32 filters',
      'ReLU',
      'Flatten',
      'Fully Connected: 10 outputs',
    ],
    filename: 'simple_cnn.onnx',
  },
  {
    name: 'LeNet-5',
    description: 'Classic CNN architecture for MNIST digit classification',
    architecture: [
      'Input: 32x32x1 grayscale image',
      'Conv1: 5x5 kernel, 6 filters',
      'ReLU + MaxPool 2x2',
      'Conv2: 5x5 kernel, 16 filters',
      'ReLU + MaxPool 2x2',
      'Flatten',
      'FC1: 120 units + ReLU',
      'FC2: 84 units + ReLU',
      'FC3: 10 units (output)',
    ],
    filename: 'lenet5.onnx',
  },
];

const ModelZoo: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<string | null>(null);

  const loadSampleModel = async (filename: string) => {
    try {
      setLoading(filename);

      const response = await fetch(`http://localhost:8000/api/v1/zoo/${filename}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch model: ${response.statusText}`);
      }

      const blob = await response.blob();
      const file = new File([blob], filename, { type: 'application/octet-stream' });
      
      const summary = await uploadModel(file);
      localStorage.setItem('modelSummary', JSON.stringify(summary));
      navigate('/viewer');
      toast.success('Model loaded successfully');
    } catch (error) {
      console.error('Failed to load sample model:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to load model');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Model Zoo</h1>
          <p className="text-muted-foreground">
            Sample ONNX models for testing the visualizer
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sampleModels.map((model) => (
            <Card key={model.name}>
              <CardHeader>
                <CardTitle>{model.name}</CardTitle>
                <CardDescription>{model.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <h4 className="font-medium">Architecture:</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    {model.architecture.map((layer, index) => (
                      <li key={index} className="list-disc ml-4">
                        {layer}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={() => loadSampleModel(model.filename)}
                  disabled={loading !== null}
                >
                  {loading === model.filename ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    'Load Model'
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModelZoo; 