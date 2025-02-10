# ONNX Model Visualizer Architecture

This document provides a detailed overview of the ONNX Model Visualizer's architecture and technical design decisions.

## System Overview

The ONNX Model Visualizer is built using a modern client-server architecture:

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│                 │         │                 │         │                 │
│  React Frontend │ ←─────► │  FastAPI Backend│ ←─────► │   ONNX Runtime  │
│                 │   REST  │                 │   ONNX  │                 │
└─────────────────┘   API   └─────────────────┘  Utils  └─────────────────┘
```

## Frontend Architecture

### Core Technologies
- React 18 with TypeScript
- React Flow for graph visualization
- TailwindCSS + shadcn/ui for styling
- React Query for API state management

### Component Structure
```
src/
├── components/
│   ├── ui/              # Reusable UI components
│   ├── NetworkGraph/    # Graph visualization
│   ├── ModelViewer/     # Main model viewing interface
│   └── ModelAnalysis/   # Model analysis tools
├── services/
│   └── api.ts          # API client
├── types/
│   └── models.ts       # TypeScript types
└── utils/
    └── graph.ts        # Graph utilities
```

### State Management
- React Query for server state
- React Context for theme and settings
- Local state for UI components

## Backend Architecture

### Core Technologies
- FastAPI for REST API
- ONNX Runtime for model processing
- NetworkX for graph operations
- Pydantic for data validation

### Module Structure
```
app/
├── api/
│   ├── model.py        # Model endpoints
│   └── analysis.py     # Analysis endpoints
├── core/
│   ├── model.py        # Model processing
│   └── graph.py        # Graph operations
├── models/
│   └── graph.py        # Data models
└── utils/
    └── onnx.py         # ONNX utilities
```

### Data Flow
1. Model Upload
   ```mermaid
   graph LR
   A[Upload] --> B[Parse ONNX]
   B --> C[Extract Graph]
   C --> D[Generate Layout]
   D --> E[Return JSON]
   ```

2. Model Analysis
   ```mermaid
   graph LR
   A[Request] --> B[Load Model]
   B --> C[Analyze]
   C --> D[Generate Stats]
   D --> E[Return JSON]
   ```

## Key Features Implementation

### Graph Visualization
- Uses React Flow for rendering
- Custom node components for ONNX operations
- Force-directed layout algorithm
- Interactive zoom and pan

### Model Analysis
- Parameter counting
- Memory usage estimation
- Operation type analysis
- Layer dependency tracking

### Performance Optimizations
- Lazy loading for large models
- Virtualized graph rendering
- Caching of computed layouts
- Background processing for analysis

## API Endpoints

### Model Management
```
POST /api/v1/upload      # Upload ONNX model
GET  /api/v1/graph       # Get model graph
GET  /api/v1/summary     # Get model summary
GET  /api/v1/node/{id}   # Get node details
```

### Analysis
```
GET  /api/v1/analysis/memory      # Memory analysis
GET  /api/v1/analysis/compute     # Compute analysis
GET  /api/v1/analysis/structure   # Structure analysis
```

## Security Considerations

- Input validation using Pydantic
- File size limits for uploads
- CORS configuration
- Rate limiting
- Error handling

## Future Improvements

1. **Performance**
   - WebAssembly for graph layout
   - Worker threads for analysis
   - Incremental graph loading

2. **Features**
   - Custom layout algorithms
   - More analysis tools
   - Comparison tools
   - Export capabilities

3. **Infrastructure**
   - Docker containerization
   - CI/CD pipeline
   - Monitoring and logging
   - Load balancing

## Development Guidelines

See [CONTRIBUTING.md](../CONTRIBUTING.md) for detailed development guidelines and setup instructions. 