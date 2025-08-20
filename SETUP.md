# 🎯 Quick Start Guide

## Single Command Setup:
```bash
npm start
```

## What happens when you run `npm start`:

1. **✅ Checks Ollama Installation**
   - Verifies Ollama is installed
   - Shows installation instructions if missing

2. **📦 Installs Dependencies** 
   - Creates Expo app with TypeScript
   - Installs all required packages

3. **🤖 Downloads AI Model**
   - Pulls `llama3.2:1b` (1.3GB, fast model)
   - Tests model connection
   - Shows progress and status

4. **🚀 Starts Development Server**
   - Launches Expo with cleared cache
   - Ready for iOS/Android/Web testing

## Manual Steps (if needed):

```bash
# 1. Install Ollama first
curl -fsSL https://ollama.ai/install.sh | sh

# 2. Then run the project
npm start
```

## After Setup:

- 📱 Scan QR code with Expo Go app
- 💬 Start chatting with your offline AI
- 🔒 100% private - no internet needed!

## File Structure:
```
expo-ollama-chat/
├── App.tsx              # Main chat interface
├── services/
│   └── OllamaService.ts # API client
├── scripts/
│   ├── check-ollama.js  # Installation checker  
│   └── setup-model.js   # Model downloader
└── package.json         # One-line setup
```

**🎉 That's it! Your offline AI chat app is ready!**