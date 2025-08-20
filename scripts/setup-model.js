#!/usr/bin/env node

const { execSync, spawn } = require('child_process');
const http = require('http');

const RECOMMENDED_MODEL = 'llama3.2:1b'; // Fast, small model perfect for chat

console.log('🤖 Setting up Ollama model...');

function checkModelExists(modelName) {
  try {
    const output = execSync('ollama list', { encoding: 'utf8' });
    return output.includes(modelName.split(':')[0]);
  } catch (error) {
    return false;
  }
}

async function pullModel(modelName) {
  return new Promise((resolve, reject) => {
    console.log(`📥 Downloading ${modelName}... (this may take a few minutes)`);
    
    const process = spawn('ollama', ['pull', modelName], { 
      stdio: ['inherit', 'pipe', 'pipe'] 
    });

    process.stdout.on('data', (data) => {
      // Show download progress
      process.stdout.write(data.toString());
    });

    process.stderr.on('data', (data) => {
      process.stderr.write(data.toString());
    });

    process.on('close', (code) => {
      if (code === 0) {
        console.log(`✅ Successfully downloaded ${modelName}`);
        resolve();
      } else {
        console.log(`❌ Failed to download ${modelName}`);
        reject(new Error(`Process exited with code ${code}`));
      }
    });
  });
}

async function testModel(modelName) {
  return new Promise((resolve, reject) => {
    const testPrompt = JSON.stringify({
      model: modelName,
      prompt: 'Hello! Please respond with just "AI ready" and nothing else.',
      stream: false
    });

    const req = http.request({
      hostname: 'localhost',
      port: 11434,
      path: '/api/generate',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(testPrompt)
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (response.response) {
            console.log(`✅ Model test successful: ${response.response.trim()}`);
            resolve();
          } else {
            reject(new Error('No response from model'));
          }
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', reject);
    req.write(testPrompt);
    req.end();
  });
}

async function main() {
  try {
    if (checkModelExists(RECOMMENDED_MODEL)) {
      console.log(`✅ Model ${RECOMMENDED_MODEL} already exists`);
    } else {
      console.log(`📋 Recommended model: ${RECOMMENDED_MODEL} (1.3GB, fast responses)`);
      console.log('💡 You can change this later by running: ollama pull <other-model>');
      console.log('   Popular alternatives: llama3.2:3b, mistral, codellama');
      console.log('');
      
      await pullModel(RECOMMENDED_MODEL);
    }

    // Test the model
    console.log('🧪 Testing model...');
    await testModel(RECOMMENDED_MODEL);
    
    console.log('');
    console.log('🎉 Setup complete! Your model is ready.');
    console.log(`📱 The app will connect to: http://localhost:11434`);
    console.log(`🤖 Using model: ${RECOMMENDED_MODEL}`);
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    console.log('');
    console.log('🔧 Troubleshooting:');
    console.log('   1. Make sure Ollama is running: ollama serve');
    console.log('   2. Try manually: ollama pull ' + RECOMMENDED_MODEL);
    console.log('   3. Check available models: ollama list');
    process.exit(1);
  }
}

main();