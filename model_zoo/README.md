# ONNX Model Zoo

This directory contains sample ONNX models for testing the ONNX Model Visualizer.

## Models

### Simple CNN
Location: `cnn/simple_cnn.onnx`

A basic convolutional neural network with the following architecture:
- Input: 224x224x3 image
- Conv1: 3x3 kernel, 16 filters
- ReLU
- Conv2: 3x3 kernel, 32 filters
- ReLU
- Flatten
- Fully Connected: 10 outputs (for classification)

To generate the model:
```bash
cd cnn
python generate_model.py 
```

### LeNet-5
Location: `cnn/lenet5.onnx`

The classic LeNet-5 architecture for MNIST digit classification:
- Input: 32x32x1 grayscale image
- Conv1: 5x5 kernel, 6 filters
- ReLU
- MaxPool: 2x2
- Conv2: 5x5 kernel, 16 filters
- ReLU
- MaxPool: 2x2
- Flatten
- FC1: 120 units
- ReLU
- FC2: 84 units
- ReLU
- FC3: 10 units (output)

To generate the model:
```bash
cd cnn
python generate_lenet.py 