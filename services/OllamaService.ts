import axios, { AxiosResponse } from 'axios';

export interface OllamaMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface OllamaGenerateRequest {
  model: string;
  prompt?: string;
  messages?: OllamaMessage[];
  stream?: boolean;
  options?: {
    temperature?: number;
    max_tokens?: number;
    top_p?: number;
  };
}

export interface OllamaGenerateResponse {
  response: string;
  done: boolean;
  model: string;
  created_at: string;
}

export interface OllamaModelInfo {
  name: string;
  size: number;
  digest: string;
  modified_at: string;
}

export class OllamaService {
  private baseUrl: string;
  private defaultModel: string;

  constructor(baseUrl: string = 'http://localhost:11434', defaultModel: string = 'llama3.2:1b') {
    this.baseUrl = baseUrl;
    this.defaultModel = defaultModel;
  }

  async checkConnection(): Promise<boolean> {
    try {
      const response = await axios.get(`${this.baseUrl}/api/tags`, {
        timeout: 3000,
      });
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }

  async getAvailableModels(): Promise<OllamaModelInfo[]> {
    try {
      const response: AxiosResponse<{ models: OllamaModelInfo[] }> = await axios.get(
        `${this.baseUrl}/api/tags`,
        { timeout: 5000 }
      );
      return response.data.models || [];
    } catch (error) {
      console.error('Failed to fetch models:', error);
      return [];
    }
  }

  async generateResponse(prompt: string, model?: string): Promise<string> {
    try {
      const requestData: OllamaGenerateRequest = {
        model: model || this.defaultModel,
        prompt,
        stream: false,
        options: {
          temperature: 0.7,
          max_tokens: 500,
        },
      };

      const response: AxiosResponse<OllamaGenerateResponse> = await axios.post(
        `${this.baseUrl}/api/generate`,
        requestData,
        {
          timeout: 30000, // 30 second timeout for generation
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data.response?.trim() || 'No response generated';
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNREFUSED') {
          throw new Error('Ollama server is not running. Please start Ollama first.');
        }
        if (error.response?.status === 404) {
          throw new Error(`Model "${model || this.defaultModel}" not found. Please pull the model first.`);
        }
        throw new Error(`Request failed: ${error.message}`);
      }
      throw new Error('Unknown error occurred while generating response');
    }
  }

  async generateChatResponse(messages: OllamaMessage[], model?: string): Promise<string> {
    try {
      const requestData = {
        model: model || this.defaultModel,
        messages,
        stream: false,
        options: {
          temperature: 0.7,
          max_tokens: 500,
        },
      };

      const response = await axios.post(
        `${this.baseUrl}/api/chat`,
        requestData,
        {
          timeout: 30000,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data.message?.content?.trim() || 'No response generated';
    } catch (error) {
      // Fallback to generate API if chat API fails
      const conversationText = messages
        .map(msg => `${msg.role}: ${msg.content}`)
        .join('\n') + '\nassistant:';
      
      return this.generateResponse(conversationText, model);
    }
  }

  setDefaultModel(model: string) {
    this.defaultModel = model;
  }

  getDefaultModel(): string {
    return this.defaultModel;
  }

  getBaseUrl(): string {
    return this.baseUrl;
  }
}