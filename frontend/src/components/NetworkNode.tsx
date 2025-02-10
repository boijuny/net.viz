import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { HoverCard, HoverCardContent, HoverCardTrigger } from './ui/hover-card';
import { Card } from './ui/card';

interface NodeData {
  label: string;
  input: string[];
  output: string[];
  attributes: Record<string, any>;
}

const NetworkNode = ({ data, isConnectable }: NodeProps<NodeData>) => {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Card className="px-4 py-2 min-w-[172px]">
          <Handle
            type="target"
            position={Position.Left}
            isConnectable={isConnectable}
          />
          <div className="text-sm font-medium">{data.label}</div>
          <Handle
            type="source"
            position={Position.Right}
            isConnectable={isConnectable}
          />
        </Card>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">{data.label}</h4>
          
          <div className="text-xs">
            <div className="font-medium text-muted-foreground">Inputs:</div>
            <div className="pl-2">
              {data.input.map((input, i) => (
                <div key={i}>{input}</div>
              ))}
            </div>
          </div>

          <div className="text-xs">
            <div className="font-medium text-muted-foreground">Outputs:</div>
            <div className="pl-2">
              {data.output.map((output, i) => (
                <div key={i}>{output}</div>
              ))}
            </div>
          </div>

          {Object.keys(data.attributes).length > 0 && (
            <div className="text-xs">
              <div className="font-medium text-muted-foreground">Attributes:</div>
              <div className="pl-2">
                {Object.entries(data.attributes).map(([key, value]) => (
                  <div key={key}>
                    <span className="font-medium">{key}:</span>{' '}
                    {JSON.stringify(value)}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default memo(NetworkNode); 