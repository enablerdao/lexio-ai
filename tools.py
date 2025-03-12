import subprocess
import os
import json
import logging
from typing import Dict, Any, List, Optional
import requests

logger = logging.getLogger(__name__)

class ToolExecutor:
    """
    A class to handle execution of various tools requested by the AI assistant.
    """
    
    def __init__(self):
        self.available_tools = {
            "execute_bash": self.execute_bash,
            "browse_web": self.browse_web,
            "read_file": self.read_file,
            "write_file": self.write_file,
            "search_replace": self.search_replace,
            "api_request": self.api_request,
        }
    
    def execute_tool(self, tool_name: str, parameters: Dict[str, Any]) -> Dict[str, Any]:
        """
        Execute a tool based on its name and parameters.
        
        Args:
            tool_name: The name of the tool to execute
            parameters: The parameters for the tool
            
        Returns:
            A dictionary containing the result of the tool execution
        """
        if tool_name not in self.available_tools:
            return {"error": f"Tool '{tool_name}' not found"}
        
        try:
            return self.available_tools[tool_name](**parameters)
        except Exception as e:
            logger.error(f"Error executing tool {tool_name}: {str(e)}")
            return {"error": f"Error executing tool: {str(e)}"}
    
    def execute_bash(self, command: str) -> Dict[str, Any]:
        """
        Execute a bash command and return the result.
        
        Args:
            command: The bash command to execute
            
        Returns:
            A dictionary containing stdout, stderr, and return code
        """
        try:
            process = subprocess.Popen(
                command,
                shell=True,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True
            )
            stdout, stderr = process.communicate()
            return {
                "stdout": stdout,
                "stderr": stderr,
                "returncode": process.returncode
            }
        except Exception as e:
            return {"error": f"Failed to execute command: {str(e)}"}
    
    def browse_web(self, url: str = None, query: str = None) -> Dict[str, Any]:
        """
        Fetch content from a URL or perform a web search.
        
        Args:
            url: The URL to fetch (optional)
            query: The search query (optional)
            
        Returns:
            A dictionary containing the response content and status
        """
        try:
            if query and not url:
                # If only query is provided, perform a search
                search_url = f"https://www.google.com/search?q={requests.utils.quote(query)}"
                response = requests.get(
                    search_url,
                    headers={
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
                    }
                )
                return {
                    "content": response.text,
                    "status_code": response.status_code,
                    "headers": dict(response.headers),
                    "search_query": query,
                    "search_url": search_url
                }
            elif url:
                # If URL is provided, fetch the content
                response = requests.get(
                    url,
                    headers={
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
                    }
                )
                return {
                    "content": response.text,
                    "status_code": response.status_code,
                    "headers": dict(response.headers),
                    "url": url
                }
            else:
                return {"error": "Either url or query parameter must be provided"}
        except Exception as e:
            return {"error": f"Failed to fetch URL or perform search: {str(e)}"}
    
    def read_file(self, path: str) -> Dict[str, Any]:
        """
        Read content from a file.
        
        Args:
            path: The path to the file
            
        Returns:
            A dictionary containing the file content
        """
        try:
            if not os.path.exists(path):
                return {"error": f"File not found: {path}"}
            
            with open(path, 'r') as file:
                content = file.read()
            
            return {"content": content}
        except Exception as e:
            return {"error": f"Failed to read file: {str(e)}"}
    
    def write_file(self, path: str, content: str) -> Dict[str, Any]:
        """
        Write content to a file.
        
        Args:
            path: The path to the file
            content: The content to write
            
        Returns:
            A dictionary indicating success or failure
        """
        try:
            directory = os.path.dirname(path)
            if directory and not os.path.exists(directory):
                os.makedirs(directory)
            
            with open(path, 'w') as file:
                file.write(content)
            
            return {"success": True, "message": f"File written successfully: {path}"}
        except Exception as e:
            return {"error": f"Failed to write file: {str(e)}"}
    
    def search_replace(self, path: str, search: str, replace: str) -> Dict[str, Any]:
        """
        Search and replace text in a file.
        
        Args:
            path: The path to the file
            search: The text to search for
            replace: The text to replace with
            
        Returns:
            A dictionary indicating success or failure and the number of replacements
        """
        try:
            if not os.path.exists(path):
                return {"error": f"File not found: {path}"}
            
            with open(path, 'r') as file:
                content = file.read()
            
            new_content = content.replace(search, replace)
            count = content.count(search)
            
            with open(path, 'w') as file:
                file.write(new_content)
            
            return {
                "success": True,
                "replacements": count,
                "message": f"Replaced {count} occurrences in {path}"
            }
        except Exception as e:
            return {"error": f"Failed to search and replace: {str(e)}"}
    
    def api_request(self, url: str, method: str = "GET", headers: Optional[Dict[str, str]] = None, 
                   data: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Make an API request.
        
        Args:
            url: The URL to request
            method: The HTTP method (GET, POST, PUT, DELETE)
            headers: Optional headers for the request
            data: Optional data for the request
            
        Returns:
            A dictionary containing the response
        """
        try:
            headers = headers or {}
            method = method.upper()
            
            if method == "GET":
                response = requests.get(url, headers=headers)
            elif method == "POST":
                response = requests.post(url, headers=headers, json=data)
            elif method == "PUT":
                response = requests.put(url, headers=headers, json=data)
            elif method == "DELETE":
                response = requests.delete(url, headers=headers)
            else:
                return {"error": f"Unsupported HTTP method: {method}"}
            
            try:
                response_data = response.json()
            except:
                response_data = response.text
            
            return {
                "status_code": response.status_code,
                "headers": dict(response.headers),
                "data": response_data
            }
        except Exception as e:
            return {"error": f"API request failed: {str(e)}"}