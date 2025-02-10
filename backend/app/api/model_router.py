from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse, FileResponse
from ..core.model_handler import ONNXModelHandler
from ..models.graph import GraphData, ModelSummary, NodeDetails
import tempfile
import os
from typing import Dict, Any
from pathlib import Path

router = APIRouter()
model_handler = ONNXModelHandler()

# Get the project root directory
PROJECT_ROOT = Path(__file__).parent.parent.parent.parent
MODEL_ZOO_PATH = PROJECT_ROOT / "model_zoo" / "cnn"

@router.get("/zoo/{model_name}")
async def get_model_from_zoo(model_name: str):
    """Get a model file from the model zoo."""
    model_path = MODEL_ZOO_PATH / model_name
    if not model_path.exists():
        raise HTTPException(status_code=404, detail=f"Model {model_name} not found")
    
    return FileResponse(
        path=model_path,
        filename=model_name,
        media_type="application/octet-stream"
    )

@router.post("/upload", response_model=ModelSummary)
async def upload_model(file: UploadFile = File(...)):
    """Upload and parse an ONNX model file."""
    if not file.filename.endswith('.onnx'):
        raise HTTPException(status_code=400, detail="File must be an ONNX model")
    
    try:
        # Create a temporary file to store the uploaded model
        with tempfile.NamedTemporaryFile(delete=False) as temp_file:
            content = await file.read()
            temp_file.write(content)
            temp_file.flush()
            
            # Load the model
            model_handler.load_model(temp_file.name)
            
            # Get model summary
            summary = model_handler.get_model_summary()
            
            # Clean up
            os.unlink(temp_file.name)
            
            return summary
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/graph", response_model=GraphData)
async def get_graph():
    """Get the graph representation of the loaded model."""
    try:
        return model_handler.get_graph_data()
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/node/{node_name}", response_model=NodeDetails)
async def get_node_details(node_name: str):
    """Get detailed information about a specific node."""
    try:
        return model_handler.get_node_details(node_name)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get("/summary", response_model=ModelSummary)
async def get_model_summary():
    """Get a summary of the loaded model."""
    try:
        return model_handler.get_model_summary()
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) 