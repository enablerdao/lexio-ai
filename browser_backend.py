#!/usr/bin/env python3
"""
Browser backend for lexio.ai using browser-use library
"""

import os
import json
import asyncio
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from browser_use import Agent

# Load environment variables
load_dotenv()

# Create FastAPI app
app = FastAPI(title="lexio.ai Browser Backend")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict this to your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define request models
class BrowserTaskRequest(BaseModel):
    task: str
    model: str = "gpt-4o"  # Default model

# Define response models
class BrowserTaskResponse(BaseModel):
    success: bool
    result: dict = None
    error: str = None

@app.post("/query", response_model=BrowserTaskResponse)
async def execute_browser_task(request: BrowserTaskRequest):
    """
    Execute a browser task using browser-use
    """
    try:
        # Create LLM based on requested model
        llm = ChatOpenAI(model=request.model)
        
        # Create browser agent
        agent = Agent(
            task=request.task,
            llm=llm,
            headless=True,  # Run browser in headless mode
        )
        
        # Execute the task
        result = await agent.run()
        
        # Process and return the result
        return BrowserTaskResponse(
            success=True,
            result={
                "task": request.task,
                "summary": result.get("summary", "Task completed"),
                "details": result.get("details", {}),
                "screenshots": result.get("screenshots", []),
            }
        )
    except Exception as e:
        return BrowserTaskResponse(
            success=False,
            error=str(e)
        )

@app.get("/health")
async def health_check():
    """
    Health check endpoint
    """
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    # Run the server on port 54728 (matching the port in next.config.js)
    uvicorn.run(app, host="0.0.0.0", port=54728)