import onnx
from onnx import helper
from onnx import TensorProto
import numpy as np

def create_lenet():
    # Create input (ValueInfoProto)
    X = helper.make_tensor_value_info('input', TensorProto.FLOAT, [1, 1, 32, 32])
    
    # Create weights and biases
    conv1_w = helper.make_tensor_value_info('conv1_w', TensorProto.FLOAT, [6, 1, 5, 5])
    conv1_b = helper.make_tensor_value_info('conv1_b', TensorProto.FLOAT, [6])
    
    conv2_w = helper.make_tensor_value_info('conv2_w', TensorProto.FLOAT, [16, 6, 5, 5])
    conv2_b = helper.make_tensor_value_info('conv2_b', TensorProto.FLOAT, [16])
    
    fc1_w = helper.make_tensor_value_info('fc1_w', TensorProto.FLOAT, [120, 16 * 5 * 5])
    fc1_b = helper.make_tensor_value_info('fc1_b', TensorProto.FLOAT, [120])
    
    fc2_w = helper.make_tensor_value_info('fc2_w', TensorProto.FLOAT, [84, 120])
    fc2_b = helper.make_tensor_value_info('fc2_b', TensorProto.FLOAT, [84])
    
    fc3_w = helper.make_tensor_value_info('fc3_w', TensorProto.FLOAT, [10, 84])
    fc3_b = helper.make_tensor_value_info('fc3_b', TensorProto.FLOAT, [10])
    
    # Create output (ValueInfoProto)
    Y = helper.make_tensor_value_info('output', TensorProto.FLOAT, [1, 10])

    # Create nodes (NodeProto)
    conv1 = helper.make_node(
        'Conv',
        inputs=['input', 'conv1_w', 'conv1_b'],
        outputs=['conv1_output'],
        kernel_shape=[5, 5],
        name='conv1'
    )

    relu1 = helper.make_node(
        'Relu',
        inputs=['conv1_output'],
        outputs=['relu1_output'],
        name='relu1'
    )

    pool1 = helper.make_node(
        'MaxPool',
        inputs=['relu1_output'],
        outputs=['pool1_output'],
        kernel_shape=[2, 2],
        strides=[2, 2],
        name='pool1'
    )

    conv2 = helper.make_node(
        'Conv',
        inputs=['pool1_output', 'conv2_w', 'conv2_b'],
        outputs=['conv2_output'],
        kernel_shape=[5, 5],
        name='conv2'
    )

    relu2 = helper.make_node(
        'Relu',
        inputs=['conv2_output'],
        outputs=['relu2_output'],
        name='relu2'
    )

    pool2 = helper.make_node(
        'MaxPool',
        inputs=['relu2_output'],
        outputs=['pool2_output'],
        kernel_shape=[2, 2],
        strides=[2, 2],
        name='pool2'
    )

    flatten = helper.make_node(
        'Flatten',
        inputs=['pool2_output'],
        outputs=['flatten_output'],
        name='flatten'
    )

    fc1 = helper.make_node(
        'Gemm',
        inputs=['flatten_output', 'fc1_w', 'fc1_b'],
        outputs=['fc1_output'],
        name='fc1'
    )

    relu3 = helper.make_node(
        'Relu',
        inputs=['fc1_output'],
        outputs=['relu3_output'],
        name='relu3'
    )

    fc2 = helper.make_node(
        'Gemm',
        inputs=['relu3_output', 'fc2_w', 'fc2_b'],
        outputs=['fc2_output'],
        name='fc2'
    )

    relu4 = helper.make_node(
        'Relu',
        inputs=['fc2_output'],
        outputs=['relu4_output'],
        name='relu4'
    )

    fc3 = helper.make_node(
        'Gemm',
        inputs=['relu4_output', 'fc3_w', 'fc3_b'],
        outputs=['output'],
        name='fc3'
    )

    # Create graph (GraphProto)
    graph_def = helper.make_graph(
        [conv1, relu1, pool1, conv2, relu2, pool2, flatten, fc1, relu3, fc2, relu4, fc3],
        'lenet-5',
        [X, conv1_w, conv1_b, conv2_w, conv2_b, fc1_w, fc1_b, fc2_w, fc2_b, fc3_w, fc3_b],
        [Y],
        doc_string='LeNet-5 model for MNIST digit classification'
    )

    # Create model (ModelProto)
    model_def = helper.make_model(graph_def, producer_name='onnx-example')
    model_def.opset_import[0].version = 13

    return model_def

if __name__ == '__main__':
    model = create_lenet()
    
    # Save the model
    onnx.save(model, 'lenet5.onnx')
    print("Model saved as 'lenet5.onnx'") 