import { SimulationNodeDatum } from 'd3';

export interface Node extends SimulationNodeDatum {
    id: string;
    label: string;
    type: string;
    data: {
        input: string[];
        output: string[];
        attributes: Record<string, any>;
    };
    x?: number;
    y?: number;
    vx?: number;
    vy?: number;
    fx?: number | null;
    fy?: number | null;
}

export interface Edge {
    source: string | Node;
    target: string | Node;
    data?: Record<string, any>;
}

export interface GraphData {
    nodes: Node[];
    edges: Edge[];
}

export interface ModelSummary {
    num_nodes: number;
    input_info: Array<{
        name: string;
        shape: (number | null)[];
    }>;
    output_info: Array<{
        name: string;
        shape: (number | null)[];
    }>;
    op_types: Record<string, number>;
    producer_name: string;
    model_version: number;
}

export interface WeightInfo {
    dims: number[];
    data_type: number;
    size: number;
}

export interface NodeDetails {
    name: string;
    op_type: string;
    input: string[];
    output: string[];
    attributes: Record<string, any>;
    weights: Record<string, WeightInfo>;
} 