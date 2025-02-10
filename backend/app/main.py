from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from .api import model_router

app = FastAPI(
    title="net.viz API",
    description="Modern neural network visualization for the AI era",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(model_router.router, prefix="/api/v1", tags=["model"])

@app.get("/")
async def root():
    return JSONResponse(
        content={
            "message": "Welcome to ONNX Model Visualizer API",
            "docs_url": "/docs",
            "version": "1.0.0"
        }
    ) 