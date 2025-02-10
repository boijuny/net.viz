import React from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize, 
  Grid, 
  Eye, 
  EyeOff,
  LayoutGrid,
  ArrowDownUp,
  ArrowLeftRight
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface GraphToolbarProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitView: () => void;
  onToggleGrid: () => void;
  onToggleMinimap: () => void;
  onToggleLabels: () => void;
  onChangeLayout: (direction: 'TB' | 'LR') => void;
  showGrid: boolean;
  showMinimap: boolean;
  showLabels: boolean;
  currentLayout: 'TB' | 'LR';
}

const GraphToolbar: React.FC<GraphToolbarProps> = ({
  onZoomIn,
  onZoomOut,
  onFitView,
  onToggleGrid,
  onToggleMinimap,
  onToggleLabels,
  onChangeLayout,
  showGrid,
  showMinimap,
  showLabels,
  currentLayout,
}) => {
  return (
    <Card className="absolute top-4 left-4 bg-card/95 backdrop-blur-sm shadow-lg">
      <TooltipProvider>
        <div className="p-1.5 flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onZoomIn}>
                <ZoomIn className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Zoom In</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onZoomOut}>
                <ZoomOut className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Zoom Out</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onFitView}>
                <Maximize className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Fit View</TooltipContent>
          </Tooltip>

          <div className="w-px h-4 bg-border mx-1" />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant={showGrid ? "secondary" : "ghost"} 
                size="icon" 
                onClick={onToggleGrid}
              >
                <Grid className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Toggle Grid</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant={showMinimap ? "secondary" : "ghost"} 
                size="icon" 
                onClick={onToggleMinimap}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Toggle Minimap</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant={showLabels ? "secondary" : "ghost"} 
                size="icon" 
                onClick={onToggleLabels}
              >
                {showLabels ? (
                  <Eye className="h-4 w-4" />
                ) : (
                  <EyeOff className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Toggle Labels</TooltipContent>
          </Tooltip>

          <div className="w-px h-4 bg-border mx-1" />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant={currentLayout === 'TB' ? "secondary" : "ghost"} 
                size="icon" 
                onClick={() => onChangeLayout('TB')}
              >
                <ArrowDownUp className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Vertical Layout</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant={currentLayout === 'LR' ? "secondary" : "ghost"} 
                size="icon" 
                onClick={() => onChangeLayout('LR')}
              >
                <ArrowLeftRight className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Horizontal Layout</TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </Card>
  );
};

export default GraphToolbar; 