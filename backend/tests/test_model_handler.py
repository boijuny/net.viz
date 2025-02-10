import pytest
import onnx
from app.core.model_handler import ONNXModelHandler
import numpy as np
import os

@pytest.fixture
def sample_model_path(tmp_path):
    """Create a simple ONNX model for testing."""
    # Create a simple model
    input = onnx.helper.make_tensor_value_info('input', onnx.TensorProto.FLOAT, [1, 3, 224, 224])
    output = onnx.helper.make_tensor_value_info('output', onnx.TensorProto.FLOAT, [1, 1000])
    
    # Create a node
    node_def = onnx.helper.make_node(
        'Conv',
        inputs=['input', 'weight'],
        outputs=['output'],
        kernel_shape=[3, 3],
        pads=[1, 1, 1, 1]
    )
    
    # Create the graph
    graph_def = onnx.helper.make_graph(
        [node_def],
        'test-model',
        [input],
        [output]
    )
    
    # Create the model
    model_def = onnx.helper.make_model(graph_def, producer_name='test')
    
    # Save the model
    model_path = os.path.join(tmp_path, "test_model.onnx")
    onnx.save(model_def, model_path)
    
    return model_path

def test_load_model(sample_model_path):
    """Test loading an ONNX model."""
    handler = ONNXModelHandler()
    handler.load_model(sample_model_path)
    assert handler.model is not None
    assert handler.graph is not None

def test_get_model_summary(sample_model_path):
    """Test getting model summary."""
    handler = ONNXModelHandler()
    handler.load_model(sample_model_path)
    
    summary = handler.get_model_summary()
    assert summary['num_nodes'] == 1
    assert len(summary['input_info']) == 1
    assert len(summary['output_info']) == 1
    assert 'Conv' in summary['op_types']
    assert summary['producer_name'] == 'test'

def test_get_graph_data(sample_model_path):
    """Test getting graph data for visualization."""
    handler = ONNXModelHandler()
    handler.load_model(sample_model_path)
    
    graph_data = handler.get_graph_data()
    assert len(graph_data.nodes) > 0
    assert len(graph_data.edges) > 0
    
    # Check node attributes
    node = graph_data.nodes[0]
    assert node.type == 'Conv'
    assert 'kernel_shape' in node.data['attributes']

def test_get_node_details(sample_model_path):
    """Test getting detailed information about a node."""
    handler = ONNXModelHandler()
    handler.load_model(sample_model_path)
    
    # Get the first node's name
    node_name = list(handler.graph.nodes())[0]
    details = handler.get_node_details(node_name)
    
    assert details['op_type'] == 'Conv'
    assert 'input' in details
    assert 'output' in details
    assert 'attributes' in details

def test_invalid_model():
    """Test handling invalid model file."""
    handler = ONNXModelHandler()
    with pytest.raises(ValueError):
        handler.load_model("nonexistent_model.onnx") 