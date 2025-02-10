import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { Upload, FileUp } from 'lucide-react';
import { toast } from 'sonner';
import { uploadModel } from '../services/api';

const ModelUpload: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (!file.name.endsWith('.onnx')) {
      toast.error('Please upload an ONNX file');
      return;
    }

    setLoading(true);

    try {
      const summary = await uploadModel(file);
      localStorage.setItem('modelSummary', JSON.stringify(summary));
      navigate('/viewer');
      toast.success('Model uploaded successfully');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to upload model');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/octet-stream': ['.onnx']
    },
    maxFiles: 1,
  });

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>ONNX Model Visualizer</CardTitle>
          <CardDescription>
            Upload your ONNX model to visualize its architecture
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`
              p-12 border-2 border-dashed rounded-lg cursor-pointer
              transition-colors duration-200 ease-in-out
              ${isDragActive 
                ? 'border-primary bg-primary/5' 
                : 'border-border hover:border-primary hover:bg-accent'
              }
            `}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              {loading ? (
                <div className="animate-spin">
                  <Upload className="h-12 w-12 text-muted-foreground" />
                </div>
              ) : (
                <>
                  <FileUp className="h-12 w-12 text-muted-foreground" />
                  <div className="space-y-2">
                    <p className="text-sm font-medium">
                      {isDragActive
                        ? 'Drop the ONNX file here'
                        : 'Drag and drop an ONNX file here, or click to select'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Only .onnx files are supported
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center space-y-4">
            <Separator className="w-full" />
            <p className="text-sm text-muted-foreground">OR</p>
            <Button
              variant="outline"
              onClick={() => navigate('/zoo')}
              className="w-full max-w-xs"
            >
              Browse Sample Models
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ModelUpload; 