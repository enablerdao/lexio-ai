#!/bin/bash

# Check if OPENAI_API_KEY is set
if [ -z "$OPENAI_API_KEY" ]; then
    echo "Warning: OPENAI_API_KEY is not set. Running in demo mode with limited functionality."
    echo "To set the API key, run: export OPENAI_API_KEY=your_api_key_here"
fi

# Create data directory if it doesn't exist
mkdir -p data

# Start the application in development mode
npm run start-all