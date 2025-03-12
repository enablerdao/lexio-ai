import os
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import openai
import logging
from typing import List, Dict, Any, Optional
import json
from tools import ToolExecutor
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="lexio.ai API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

# Get OpenAI API key from environment variable
openai_api_key = os.getenv("OPENAI_API_KEY")
if not openai_api_key:
    # Try to read from .env file directly as a fallback
    try:
        with open('.env', 'r') as f:
            for line in f:
                if line.startswith('OPENAI_API_KEY='):
                    openai_api_key = line.strip().split('=', 1)[1]
                    break
    except Exception as e:
        logger.error(f"Error reading .env file: {e}")

if not openai_api_key:
    logger.warning("OPENAI_API_KEY not set. Using demo mode with limited functionality.")
else:
    logger.info("OPENAI_API_KEY is set.")

# Initialize OpenAI client if API key is available
client = None
if openai_api_key:
    client = openai.OpenAI(api_key=openai_api_key)

# Initialize tool executor
tool_executor = ToolExecutor()

class QueryRequest(BaseModel):
    prompt: str
    history: Optional[List[Dict[str, str]]] = []

class ToolRequest(BaseModel):
    tool_name: str
    parameters: Dict[str, Any]

class QueryResponse(BaseModel):
    response: str
    tools_used: Optional[List[str]] = None
    
@app.get("/")
async def root():
    return {"message": "Welcome to lexio.ai API"}

@app.post("/query", response_model=QueryResponse)
async def query_agent(request: QueryRequest):
    try:
        # Prepare messages for OpenAI
        system_message = """
        You are lexio, an advanced AI assistant capable of understanding and executing complex tasks.
        You have access to various tools that can help you complete tasks:
        
        1. execute_bash: Execute bash commands on the system
        2. browse_web: Fetch content from a URL
        3. read_file: Read content from a file
        4. write_file: Write content to a file
        5. search_replace: Search and replace text in a file
        6. api_request: Make API requests
        
        When a user asks you to perform a task that requires one of these tools, 
        analyze what needs to be done and use the appropriate tool.
        """
        
        messages = [{"role": "system", "content": system_message}]
        
        # Add conversation history if provided
        if request.history:
            messages.extend(request.history)
        
        # Add the current user prompt
        messages.append({"role": "user", "content": request.prompt})
        
        # Call OpenAI API
        if client:
            response = client.chat.completions.create(
                model="gpt-4o",
                messages=messages,
                temperature=0.7,
            )
            response_text = response.choices[0].message.content
            
            # Check if the response contains tool usage instructions
            tools_used = []
            
            # This is a simple heuristic to detect if the AI is suggesting tool usage
            # In a production system, you would use function calling or a more robust approach
            tool_indicators = [
                "execute_bash", "browse_web", "read_file", 
                "write_file", "search_replace", "api_request"
            ]
            
            for tool in tool_indicators:
                if tool in response_text:
                    tools_used.append(tool)
        else:
            # Demo mode response
            response_text = "I'm running in demo mode without an OpenAI API key. Please set the OPENAI_API_KEY environment variable for full functionality."
            tools_used = []
        
        return {"response": response_text, "tools_used": tools_used}
    
    except Exception as e:
        logger.error(f"Error processing query: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing query: {str(e)}")

@app.post("/execute_tool")
async def execute_tool(request: ToolRequest):
    """
    Execute a specific tool based on the request.
    """
    try:
        tool_name = request.tool_name
        parameters = request.parameters
        
        # Execute the tool using our ToolExecutor
        result = tool_executor.execute_tool(tool_name, parameters)
        
        return {"result": result}
    
    except Exception as e:
        logger.error(f"Error executing tool: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error executing tool: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=54728)