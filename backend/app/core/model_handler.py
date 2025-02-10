import onnx
import networkx as nx
from typing import Dict, List, Any, Tuple
import numpy as np
from ..models.graph import Node, Edge, GraphData

class ONNXModelHandler:
    def __init__(self):
        self.model = None
        self.graph = None
        self.node_map = {}  # Map to store node name to node id mapping
        self.initializers = {}  # Map to store initializers (weights)

    def load_model(self, model_path: str) -> None:
        """Load an ONNX model from file."""
        try:
            self.model = onnx.load(model_path)
            # Store initializers in a map for quick access
            self.initializers = {
                init.name: {
                    'dims': list(init.dims),
                    'data_type': init.data_type,
                    'size': init.raw_data.__sizeof__(),
                } for init in self.model.graph.initializer
            }
            self._build_graph()
        except Exception as e:
            raise ValueError(f"Error loading ONNX model: {str(e)}")

    def _build_graph(self) -> None:
        """Build a NetworkX graph from the ONNX model."""
        self.graph = nx.DiGraph()
        self.node_map = {}
        
        # First pass: Add all nodes and build the node map
        for idx, node in enumerate(self.model.graph.node):
            node_attrs = {
                'name': node.name or f'node_{idx}',  # Use index if name is empty
                'op_type': node.op_type,
                'input': list(node.input),
                'output': list(node.output),
                'attributes': {attr.name: self._get_attribute_value(attr) for attr in node.attribute}
            }
            self.graph.add_node(node.name or f'node_{idx}', **node_attrs)
            
            # Map each output to its producing node
            for output in node.output:
                self.node_map[output] = node.name or f'node_{idx}'

        # Second pass: Add edges based on input/output relationships
        for node in self.model.graph.node:
            node_id = node.name or f'node_{idx}'
            
            # Add edges from input to this node
            for input_name in node.input:
                if input_name in self.node_map:  # If the input comes from another node
                    source_node = self.node_map[input_name]
                    self.graph.add_edge(source_node, node_id, tensor_name=input_name)

    def _get_attribute_value(self, attr: onnx.AttributeProto) -> Any:
        """Extract value from an ONNX attribute."""
        if attr.type == onnx.AttributeProto.FLOAT:
            return float(attr.f)
        elif attr.type == onnx.AttributeProto.INT:
            return int(attr.i)
        elif attr.type == onnx.AttributeProto.STRING:
            return attr.s.decode('utf-8')
        elif attr.type == onnx.AttributeProto.FLOATS:
            return list(map(float, attr.floats))
        elif attr.type == onnx.AttributeProto.INTS:
            return list(map(int, attr.ints))
        elif attr.type == onnx.AttributeProto.STRINGS:
            return [s.decode('utf-8') for s in attr.strings]
        return None

    def get_model_summary(self) -> Dict[str, Any]:
        """Get a summary of the model."""
        if not self.model:
            raise ValueError("No model loaded")

        input_info = []
        for input_proto in self.model.graph.input:
            shape = [dim.dim_value if dim.dim_value != 0 else None 
                    for dim in input_proto.type.tensor_type.shape.dim]
            input_info.append({
                'name': input_proto.name,
                'shape': shape
            })

        output_info = []
        for output_proto in self.model.graph.output:
            shape = [dim.dim_value if dim.dim_value != 0 else None 
                    for dim in output_proto.type.tensor_type.shape.dim]
            output_info.append({
                'name': output_proto.name,
                'shape': shape
            })

        op_types = {}
        for node in self.model.graph.node:
            op_types[node.op_type] = op_types.get(node.op_type, 0) + 1

        return {
            'num_nodes': len(self.model.graph.node),
            'input_info': input_info,
            'output_info': output_info,
            'op_types': op_types,
            'producer_name': self.model.producer_name,
            'model_version': self.model.model_version
        }

    def get_graph_data(self) -> GraphData:
        """Convert the NetworkX graph to a format suitable for visualization."""
        if not self.graph:
            raise ValueError("No graph available")

        nodes: List[Node] = []
        edges: List[Edge] = []

        # Convert nodes
        for node_id in self.graph.nodes():
            node_data = self.graph.nodes[node_id]
            nodes.append(Node(
                id=node_id,
                label=node_data.get('name', ''),
                type=node_data.get('op_type', ''),
                data={
                    'input': node_data.get('input', []),
                    'output': node_data.get('output', []),
                    'attributes': node_data.get('attributes', {})
                }
            ))

        # Convert edges with tensor information
        for source, target, data in self.graph.edges(data=True):
            edges.append(Edge(
                source=source,
                target=target,
                data={'tensor_name': data.get('tensor_name', '')}
            ))

        return GraphData(nodes=nodes, edges=edges)

    def get_node_details(self, node_name: str) -> Dict[str, Any]:
        """Get detailed information about a specific node."""
        if not self.graph or node_name not in self.graph:
            raise ValueError(f"Node {node_name} not found")

        node_data = self.graph.nodes[node_name]
        
        # Get weight information for inputs that are initializers
        weights_info = {}
        for input_name in node_data['input']:
            if input_name in self.initializers:
                weights_info[input_name] = self.initializers[input_name]

        return {
            'name': node_data['name'],
            'op_type': node_data['op_type'],
            'input': node_data['input'],
            'output': node_data['output'],
            'attributes': node_data['attributes'],
            'weights': weights_info
        } 