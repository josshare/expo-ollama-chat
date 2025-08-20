# 🦙 Expo Ollama Chat

A production-ready Expo app that runs a fully offline LLM using Ollama in Docker. Chat with AI models running locally on your machine - no complex setup required!

## 🚀 One-Command Setup

```bash
npm start
```

That's it! This single command will:
- ✅ Start Ollama in Docker automatically
- ✅ Install all dependencies  
- ✅ Download a fast AI model (llama3.2:1b)
- ✅ Start the Expo development server

## 📋 Prerequisites

You only need **Docker** installed on your system:

### Install Docker:
```bash
# Visit: https://docs.docker.com/get-docker/
# Docker Desktop includes Docker Compose
```

That's all! No need to install Ollama separately - it runs in Docker.

## 🎯 Features

- 🔥 **Fully Offline** - No API keys or internet required
- ⚡ **Fast Setup** - One command to run everything
- 🤖 **Smart AI** - Uses Llama 3.2 1B model (1.3GB)
- 📱 **Native Feel** - Smooth chat UI with React Native
- 🔒 **Private** - All conversations stay on your device
- 🎨 **Beautiful UI** - Modern chat interface
- 📱 **Cross Platform** - iOS, Android, Web support

## 🛠 Manual Setup (if needed)

If the automatic setup fails:

```bash
# 1. Start Ollama in Docker
docker-compose up -d

# 2. Pull a model
docker exec ollama-server ollama pull llama3.2:1b

# 3. Install dependencies
npm install

# 4. Start Expo
npx expo start --clear
```

## 🤖 Using Different Models

You can use any Ollama-compatible model:

```bash
# Larger models (better quality, slower)
docker exec ollama-server ollama pull llama3.2:3b
docker exec ollama-server ollama pull mistral
docker exec ollama-server ollama pull codellama

# Smaller models (faster, less capable)  
docker exec ollama-server ollama pull phi3:mini
docker exec ollama-server ollama pull tinyllama

# List available models
docker exec ollama-server ollama list
```

The app will automatically detect and use available models.

## 📱 Running the App

### Development:
```bash
npm run dev           # Start Expo dev server
npm run ios           # Run on iOS simulator
npm run android       # Run on Android emulator
npm run web           # Run in web browser
```

### Scripts:
```bash
npm run setup         # Full setup (check Ollama + install + model)
npm run check-ollama  # Check if Ollama is running
npm run setup-model   # Download AI model
```

## 🔧 Troubleshooting

### "Ollama not running" error:
```bash
docker-compose up -d
```

### "Model not found" error:
```bash
docker exec ollama-server ollama pull llama3.2:1b
docker exec ollama-server ollama list
```

### Connection issues:
- Make sure Docker is running
- Check if container is up: `docker ps`
- Try restarting: `docker-compose restart`
- View logs: `docker logs ollama-server`

### Performance tips:
- Use smaller models for faster responses: `phi3:mini`, `tinyllama`
- Close other applications to free up RAM
- Use SSD storage for better model loading

## 🏗 Project Structure

```
├── App.tsx                 # Main React Native app
├── services/
│   └── OllamaService.ts   # Ollama API client
├── scripts/
│   ├── check-ollama.js    # Ollama installation check
│   └── setup-model.js     # Model download script
├── docker-compose.yml     # Docker configuration
├── start.sh              # One-command startup script
└── package.json          # Dependencies & scripts
```

## 🔒 Privacy & Security

- 🛡 **100% Local** - No data leaves your device
- 🚫 **No Tracking** - No analytics or telemetry  
- 🔐 **No API Keys** - No external services
- 💾 **Local Storage** - Conversations stored locally

## 📊 System Requirements

- **RAM**: 4GB+ (8GB+ recommended)
- **Storage**: 2GB+ free space
- **OS**: macOS, Linux, Windows  
- **Node.js**: 18+
- **Expo CLI**: Latest

## 🚀 Model Performance

| Model | Size | Speed | Quality | Memory |
|-------|------|-------|---------|--------|
| llama3.2:1b | 1.3GB | ⚡⚡⚡ | ⭐⭐⭐ | 2GB |
| llama3.2:3b | 2.0GB | ⚡⚡ | ⭐⭐⭐⭐ | 4GB |
| mistral | 4.1GB | ⚡ | ⭐⭐⭐⭐⭐ | 6GB |

## 🤝 Contributing

This is a complete, production-ready example. Feel free to:
- Add new features
- Improve the UI
- Support more models  
- Add voice input/output
- Create themes

## 📄 License

MIT License - Use this code however you want!

---

**Built with ❤️ using Expo + Ollama**

*Chat with AI, completely offline, right from your phone!*