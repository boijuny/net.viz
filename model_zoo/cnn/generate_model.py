import onnx
from onnx import helper
from onnx import TensorProto

def create_simple_cnn():
    # Create input (ValueInfoProto)
    X = helper.make_tensor_value_info('input', TensorProto.FLOAT, [1, 3, 224, 224])
    
    # Create weights for conv1
    conv1_w = helper.make_tensor_value_info('conv1_w', TensorProto.FLOAT, [16, 3, 3, 3])
    conv1_b = helper.make_tensor_value_info('conv1_b', TensorProto.FLOAT, [16])
    
    # Create weights for conv2
    conv2_w = helper.make_tensor_value_info('conv2_w', TensorProto.FLOAT, [32, 16, 3, 3])
    conv2_b = helper.make_tensor_value_info('conv2_b', TensorProto.FLOAT, [32])
    
    # Create weights for fc
    fc_w = helper.make_tensor_value_info('fc_w', TensorProto.FLOAT, [10, 32 * 56 * 56])
    fc_b = helper.make_tensor_value_info('fc_b', TensorProto.FLOAT, [10])
    
    # Create output (ValueInfoProto)
    Y = helper.make_tensor_value_info('output', TensorProto.FLOAT, [1, 10])

    # Create nodes (NodeProto)
    conv1 = helper.make_node(
        'Conv',
        inputs=['input', 'conv1_w', 'conv1_b'],
        outputs=['conv1_output'],
        kernel_shape=[3, 3],
        pads=[1, 1, 1, 1],
        name='conv1'
    )

    relu1 = helper.make_node(
        'Relu',
        inputs=['conv1_output'],
        outputs=['relu1_output'],
        name='relu1'
    )

    conv2 = helper.make_node(
        'Conv',
        inputs=['relu1_output', 'conv2_w', 'conv2_b'],
        outputs=['conv2_output'],
        kernel_shape=[3, 3],
        pads=[1, 1, 1, 1],
        name='conv2'
    )

    relu2 = helper.make_node(
        'Relu',
        inputs=['conv2_output'],
        outputs=['relu2_output'],
        name='relu2'
    )

    flatten = helper.make_node(
        'Flatten',
        inputs=['relu2_output'],
        outputs=['flatten_output'],
        name='flatten'
    )

    fc = helper.make_node(
        'Gemm',
        inputs=['flatten_output', 'fc_w', 'fc_b'],
        outputs=['output'],
        name='fc'
    )

    # Create graph (GraphProto)
    graph_def = helper.make_graph(
        [conv1, relu1, conv2, relu2, flatten, fc],
        'simple-cnn',
        [X, conv1_w, conv1_b, conv2_w, conv2_b, fc_w, fc_b],
        [Y],
        doc_string='A simple CNN model'
    )

    # Create model (ModelProto)
    model_def = helper.make_model(graph_def, producer_name='onnx-example')
    model_def.opset_import[0].version = 13

    return model_def

if __name__ == '__main__':
    model = create_simple_cnn()
    
    # Save the model
    onnx.save(model, 'simple_cnn.onnx')
    print("Model saved as 'simple_cnn.onnx'") 