# lexio.ai - Advanced AI Assistant System

lexio.ai is a powerful AI assistant system that leverages GPT models to understand and execute tasks based on natural language instructions.

## Features

- Natural language processing for user interaction
- Automatic task analysis, tool selection, execution, and result reporting
- Web browsing and API-based information gathering
- Program execution and result presentation
- File management (read/write/search/replace)
- Linux command execution
- Temporary and persistent deployment of applications and websites

## Prerequisites

- Node.js 20.x or higher
- Python 3.10 or higher
- OpenAI API key

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/lexio-ai.git
   cd lexio-ai
   ```

2. Install dependencies:
   ```bash
   npm install
   pip install -r requirements.txt
   ```

3. Create a `.env` file based on `.env.example` and add your OpenAI API key:
   ```bash
   cp .env.example .env
   # Edit .env and add your OpenAI API key
   ```

## Running the Application

### Development Mode

To run both the frontend and backend in development mode:

```bash
npm run start-all
```

This will start:
- The FastAPI backend on http://localhost:8000
- The Next.js frontend on http://localhost:3000

### Production Mode

Build the frontend:

```bash
npm run build
```

Start the production server:

```bash
npm run start
```

### Using Docker

Build the Docker image:

```bash
docker build -t lexio-ai .
```

Run the container:

```bash
docker run -p 3000:3000 -p 8000:8000 -e OPENAI_API_KEY=your_key_here lexio-ai
```

## API Endpoints

- `POST /query`: Send a query to the AI assistant
- `POST /execute_tool`: Execute a specific tool

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.