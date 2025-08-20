#!/bin/bash

set -e

echo "🚀 Starting Ollama Chat App..."
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first:"
    echo "   Visit: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Start Ollama in Docker
echo "🐳 Starting Ollama server in Docker..."
if command -v docker-compose &> /dev/null; then
    docker-compose up -d ollama
else
    docker compose up -d ollama
fi

# Wait for Ollama to be ready
echo "⏳ Waiting for Ollama server to be ready..."
for i in {1..30}; do
    if curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
        echo "✅ Ollama server is ready!"
        break
    fi
    if [ $i -eq 30 ]; then
        echo "❌ Ollama server failed to start. Check Docker logs:"
        echo "   docker logs ollama-server"
        exit 1
    fi
    echo "   Waiting... ($i/30)"
    sleep 2
done

# Pull the model if not already available
echo "📦 Checking for llama3.2:1b model..."
if ! docker exec ollama-server ollama list | grep -q "llama3.2:1b"; then
    echo "⬇️  Pulling llama3.2:1b model (this may take a few minutes)..."
    docker exec ollama-server ollama pull llama3.2:1b
    echo "✅ Model downloaded successfully!"
else
    echo "✅ Model already available!"
fi

# Install Node.js dependencies
echo "📦 Installing dependencies..."
npm install

# Start the React Native app
echo "🎯 Starting the React Native app..."
echo ""
echo "🌐 The app will be available at:"
echo "   • Press 'w' for web browser"
echo "   • Press 'a' for Android emulator"
echo "   • Press 'i' for iOS simulator"
echo ""

npm run dev