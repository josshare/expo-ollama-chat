# 🦙 Expo Ollama Chat

A production-ready Expo app that runs a fully offline LLM using Ollama. Chat with AI models running locally on your machine - no internet required after setup!

## 🚀 One-Command Setup

```bash
npm start
```

That's it! This single command will:
- ✅ Check if Ollama is installed
- ✅ Install all dependencies  
- ✅ Download a fast AI model (llama3.2:1b)
- ✅ Start the Expo development server

## 📋 Prerequisites

You need **Ollama** installed on your system:

### Install Ollama:
```bash
# macOS/Linux
curl -fsSL https://ollama.ai/install.sh | sh

# Windows
# Download from https://ollama.ai/download
```

### Start Ollama (if not auto-started):
```bash
ollama serve
```

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
# 1. Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# 2. Start Ollama server
ollama serve

# 3. Pull a model
ollama pull llama3.2:1b

# 4. Install dependencies
npm install

# 5. Start Expo
npx expo start --clear
```

## 🤖 Using Different Models

You can use any Ollama-compatible model:

```bash
# Larger models (better quality, slower)
ollama pull llama3.2:3b
ollama pull mistral
ollama pull codellama

# Smaller models (faster, less capable)  
ollama pull phi3:mini
ollama pull tinyllama

# List available models
ollama list
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
ollama serve
```

### "Model not found" error:
```bash
ollama pull llama3.2:1b
ollama list
```

### Connection issues:
- Make sure Ollama is running on `localhost:11434`
- Check firewall settings
- Try restarting Ollama: `pkill ollama && ollama serve`

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
└── package.json           # Dependencies & scripts
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