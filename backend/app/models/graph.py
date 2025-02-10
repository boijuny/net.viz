from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class Node(BaseModel):
    id: str
    label: str
    type: str
    data: Dict[str, Any]

class Edge(BaseModel):
    source: str
    target: str
    data: Optional[Dict[str, Any]] = None

class GraphData(BaseModel):
    nodes: List[Node]
    edges: List[Edge]

class ModelSummary(BaseModel):
    num_nodes: int
    input_info: List[Dict[str, Any]]
    output_info: List[Dict[str, Any]]
    op_types: Dict[str, int]
    producer_name: str
    model_version: int

class WeightInfo(BaseModel):
    dims: List[int]
    data_type: int
    size: int

class NodeDetails(BaseModel):
    name: str
    op_type: str
    input: List[str]
    output: List[str]
    attributes: Dict[str, Any]
    weights: Dict[str, WeightInfo] 