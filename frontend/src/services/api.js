import axios from 'axios';

// Determine if we're in production (deployed) or development
const isProduction = window.location.hostname.includes('vercel.app') || 
                    window.location.hostname.includes('netlify.app') ||
                    window.location.hostname !== 'localhost';

// Base URL for the backend API
const BASE_URL = isProduction ? '/api' : 'http://localhost:3001';

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('Response error:', error);
    
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      throw new Error(data?.message || `HTTP ${status}: ${error.message}`);
    } else if (error.request) {
      // Request was made but no response received
      throw new Error('No response from server. Please check if the backend is running.');
    } else {
      // Something else happened
      throw new Error(error.message || 'An unexpected error occurred');
    }
  }
);

// API service methods
export const apiService = {
  // Health check
  async checkHealth() {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      throw new Error(`Health check failed: ${error.message}`);
    }
  },

  // Get available models for a provider (simplified for serverless)
  async getModels(provider = 'anthropic') {
    // Return static models since we don't have a models endpoint in serverless
    const providerModels = {
      openai: ['gpt-3.5-turbo', 'gpt-4'],
      anthropic: ['claude-3-haiku-20240307', 'claude-3-sonnet-20240229'],
      groq: ['llama-3.1-8b-instant', 'llama-3.1-70b-versatile', 'mixtral-8x7b-32768'],
      gemini: ['gemini-2.5-flash', 'gemini-1.5-pro']
    };
    return { models: providerModels[provider] || [] };
  },

  // Send chat message to OpenAI
  async chatWithOpenAI(prompt, model = 'gpt-3.5-turbo', options = {}) {
    try {
      const response = await api.post('/chat', {
        provider: 'openai',
        prompt,
        model,
        ...options
      });
      return response.data;
    } catch (error) {
      throw new Error(`OpenAI chat failed: ${error.message}`);
    }
  },

  // Send chat message to Anthropic
  async chatWithAnthropic(prompt, model = 'claude-3-haiku-20240307', options = {}) {
    try {
      const response = await api.post('/chat', {
        provider: 'anthropic',
        prompt,
        model,
        ...options
      });
      return response.data;
    } catch (error) {
      throw new Error(`Anthropic chat failed: ${error.message}`);
    }
  },

  // Send chat message to Groq
  async chatWithGroq(prompt, model = 'llama-3.1-8b-instant', options = {}) {
    try {
      const response = await api.post('/chat', {
        provider: 'groq',
        prompt,
        model,
        temperature: 0.7,
        max_tokens: 1000,
        ...options
      });
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Send chat message to Gemini
  async chatWithGemini(prompt, model = 'gemini-2.5-flash', options = {}) {
    try {
      const response = await api.post('/chat', {
        provider: 'gemini',
        prompt,
        model,
        temperature: 0.7,
        max_tokens: 1000,
        ...options
      });
      
      return response.data;
    } catch (error) {
      throw new Error(`Gemini chat failed: ${error.message}`);
    }
  },



  // Generic chat method that routes to the appropriate provider
  async chat(provider, prompt, model, options = {}) {
    // Use serverless function in production, individual endpoints in development
    if (isProduction) {
      try {
        const response = await api.post('/chat', {
          provider: provider.toLowerCase(),
          prompt,
          model,
          ...options
        });
        
        return {
          data: {
            content: response.data.content,
            model: response.data.model,
            provider: response.data.provider
          }
        };
      } catch (error) {
        throw new Error(`Chat failed: ${error.response?.data?.error || error.message}`);
      }
    } else {
      // Development mode - use individual provider methods
      switch (provider.toLowerCase()) {
        case 'openai':
          return this.chatWithOpenAI(prompt, model, options);
        case 'anthropic':
          return this.chatWithAnthropic(prompt, model, options);
        case 'groq':
          return this.chatWithGroq(prompt, model, options);
        case 'gemini':
          return this.chatWithGemini(prompt, model, options);
        default:
          throw new Error(`Unsupported provider: ${provider}`);
      }
    }
  }
};

// Provider configurations
export const PROVIDERS = {
  openai: {
    name: 'OpenAI',
    models: ['gpt-3.5-turbo'],
    defaultModel: 'gpt-3.5-turbo',
    color: 'green'
  },
  anthropic: {
    name: 'Anthropic',
    models: [], // Will be fetched dynamically
    defaultModel: 'claude-3-haiku-20240307',
    color: 'orange'
  },
  groq: {
    name: 'Groq',
    models: ['llama-3.1-8b-instant', 'llama-3.1-70b-versatile', 'mixtral-8x7b-32768'],
    defaultModel: 'llama-3.1-8b-instant',
    color: 'purple'
  },
  gemini: {
    name: 'Gemini',
    models: [], // Will be fetched dynamically
    defaultModel: 'gemini-2.5-flash',
    color: 'blue'
  }
};

export default api;