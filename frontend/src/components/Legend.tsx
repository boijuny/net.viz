import React, { useMemo } from 'react';
import { Node } from 'reactflow';
import { ChevronRight } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './ui/collapsible';
import { ScrollArea } from './ui/scroll-area';
import { cn } from '../lib/utils';

interface LegendProps {
  nodes: Node[];
  nodeStyles: Record<string, {
    color: string;
    gradient: string;
    icon: string;
    category: string;
  }>;
}

interface CategoryStats {
  count: number;
  percentage: number;
  types: {
    type: string;
    count: number;
    icon: string;
    gradient: string;
  }[];
}

const Legend: React.FC<LegendProps> = ({ nodes, nodeStyles }) => {
  const categories = useMemo(() => {
    const stats: Record<string, CategoryStats> = {};
    const totalNodes = nodes.length;

    // Count nodes by category and type
    nodes.forEach((node) => {
      const nodeType = node.data?.type || 'default';
      const style = nodeStyles[nodeType] || nodeStyles.default;
      const category = style.category;

      if (!stats[category]) {
        stats[category] = {
          count: 0,
          percentage: 0,
          types: []
        };
      }

      stats[category].count++;
      
      const existingType = stats[category].types.find(t => t.type === nodeType);
      if (existingType) {
        existingType.count++;
      } else {
        stats[category].types.push({
          type: nodeType,
          count: 1,
          icon: style.icon,
          gradient: style.gradient
        });
      }
    });

    // Calculate percentages and sort categories by count
    Object.values(stats).forEach(stat => {
      stat.percentage = (stat.count / totalNodes) * 100;
      stat.types.sort((a, b) => b.count - a.count);
    });

    return Object.entries(stats)
      .sort(([, a], [, b]) => b.count - a.count)
      .map(([category, stat]) => ({
        category,
        ...stat
      }));
  }, [nodes, nodeStyles]);

  if (nodes.length === 0) {
    return (
      <div className="p-4 text-center text-sm text-muted-foreground">
        No nodes to display
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">Network Structure</h3>
        <span className="text-xs text-muted-foreground">
          {nodes.length} nodes
        </span>
      </div>

      <ScrollArea className="h-[calc(100vh-240px)]">
        <div className="space-y-3 pr-4">
          {categories.map(({ category, count, percentage, types }) => (
            <Collapsible key={category}>
              <CollapsibleTrigger className="flex items-center w-full group hover:bg-muted/50 rounded-lg p-2 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium truncate">{category}</span>
                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                      {count} ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500 ease-out"
                      style={{
                        background: types[0]?.gradient || 'var(--primary)',
                        width: `${percentage}%`
                      }}
                    />
                  </div>
                </div>
                <div className="w-6 h-6 flex items-center justify-center text-muted-foreground ml-2">
                  <ChevronRight className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-90" />
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="pl-4 pt-2 space-y-1">
                  {types.map(({ type, count: typeCount, icon, gradient }) => (
                    <div
                      key={type}
                      className={cn(
                        "flex items-center justify-between",
                        "py-1.5 px-2 rounded-md",
                        "hover:bg-muted/50 transition-colors",
                        "group cursor-default"
                      )}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div
                          className="w-6 h-6 rounded flex items-center justify-center text-white shrink-0"
                          style={{ background: gradient }}
                        >
                          <span className="text-sm">{icon}</span>
                        </div>
                        <span className="text-sm truncate">{type}</span>
                      </div>
                      <span className="text-xs text-muted-foreground ml-2 group-hover:text-foreground transition-colors">
                        {typeCount}
                      </span>
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default Legend; 