#!/usr/bin/env node

const { execSync } = require('child_process');
const https = require('http');

console.log('🔍 Checking Ollama installation...');

function checkOllamaInstalled() {
  try {
    execSync('ollama --version', { stdio: 'pipe' });
    console.log('✅ Ollama is installed');
    return true;
  } catch (error) {
    console.log('❌ Ollama is not installed');
    console.log('');
    console.log('📋 To install Ollama:');
    console.log('   macOS/Linux: curl -fsSL https://ollama.ai/install.sh | sh');
    console.log('   Windows: Download from https://ollama.ai/download');
    console.log('');
    process.exit(1);
  }
}

function checkOllamaRunning() {
  return new Promise((resolve, reject) => {
    const req = https.get('http://localhost:11434/api/tags', (res) => {
      console.log('✅ Ollama server is running');
      resolve(true);
    });

    req.on('error', (err) => {
      console.log('❌ Ollama server is not running');
      console.log('💡 Start Ollama with: ollama serve');
      console.log('   Or just run: ollama list (this starts the server automatically)');
      console.log('');
      reject(false);
    });

    req.setTimeout(3000, () => {
      req.destroy();
      console.log('❌ Ollama server is not responding');
      console.log('💡 Start Ollama with: ollama serve');
      reject(false);
    });
  });
}

async function main() {
  checkOllamaInstalled();
  
  try {
    await checkOllamaRunning();
    console.log('🎉 Ollama is ready!');
  } catch (error) {
    process.exit(1);
  }
}

main();