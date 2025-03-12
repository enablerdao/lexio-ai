import requests
import json
import sys

def test_api(base_url="http://localhost:54728"):
    """
    Test the lexio.ai API endpoints.
    
    Args:
        base_url: The base URL of the API
    """
    print(f"Testing lexio.ai API at {base_url}...")
    
    # Test the root endpoint
    try:
        response = requests.get(f"{base_url}/")
        print(f"Root endpoint: {response.status_code}")
        print(f"Response: {response.json()}")
    except Exception as e:
        print(f"Error testing root endpoint: {str(e)}")
        return False
    
    # Test the query endpoint
    try:
        data = {
            "prompt": "Hello, what can you do?",
            "history": []
        }
        response = requests.post(
            f"{base_url}/query",
            headers={"Content-Type": "application/json"},
            data=json.dumps(data)
        )
        print(f"Query endpoint: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print(f"Response: {result['response'][:100]}...")  # Show first 100 chars
            print(f"Tools used: {result.get('tools_used', [])}")
        else:
            print(f"Error: {response.text}")
            return False
    except Exception as e:
        print(f"Error testing query endpoint: {str(e)}")
        return False
    
    # Test the execute_tool endpoint
    try:
        data = {
            "tool_name": "execute_bash",
            "parameters": {
                "command": "echo 'Hello from lexio.ai!'"
            }
        }
        response = requests.post(
            f"{base_url}/execute_tool",
            headers={"Content-Type": "application/json"},
            data=json.dumps(data)
        )
        print(f"Execute tool endpoint: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print(f"Result: {result}")
        else:
            print(f"Error: {response.text}")
            return False
    except Exception as e:
        print(f"Error testing execute_tool endpoint: {str(e)}")
        return False
    
    print("All tests passed!")
    return True

if __name__ == "__main__":
    base_url = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:54728"
    success = test_api(base_url)
    if not success:
        sys.exit(1)