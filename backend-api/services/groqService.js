import axios from 'axios';
import { AppError } from '../middleware/errorHandler.js';

class GroqService {
  constructor() {
    this.baseURL = 'https://api.groq.com/openai/v1';
    this.apiKey = process.env.GROQ_API_KEY;
  }

  /**
   * Generate completion using Groq API
   * @param {Object} params - Parameters for the API call
   * @param {string} params.prompt - The user prompt
   * @param {number} params.temperature - Temperature setting (0-2)
   * @param {number} params.max_tokens - Maximum tokens to generate
   * @param {number} params.top_p - Top P setting (0-1)
   * @param {string} params.model - Model to use (optional)
   * @returns {Promise<Object>} API response
   */
  async generateCompletion({ prompt, temperature = 0.7, max_tokens = 1000, top_p = 1, model = 'llama3-8b-8192' }) {
    try {
      // Validate parameters
      this.validateParameters({ temperature, max_tokens, top_p });

      const response = await axios.post(
        `${this.baseURL}/chat/completions`,
        {
          model: model,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: Math.max(0, Math.min(2, temperature)),
          max_tokens: Math.max(1, Math.min(8000, max_tokens)),
          top_p: Math.max(0, Math.min(1, top_p)),
          stream: false
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 30000 // 30 second timeout
        }
      );

      return {
        success: true,
        data: {
          content: response.data.choices[0]?.message?.content || '',
          model: response.data.model,
          usage: {
            prompt_tokens: response.data.usage?.prompt_tokens || 0,
            completion_tokens: response.data.usage?.completion_tokens || 0,
            total_tokens: response.data.usage?.total_tokens || 0
          },
          finish_reason: response.data.choices[0]?.finish_reason || 'unknown'
        },
        provider: 'groq',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Groq API Error:', error);
      
      if (error.response?.status === 401) {
        throw new AppError('Invalid Groq API key', 401);
      } else if (error.response?.status === 429) {
        throw new AppError('Groq API rate limit exceeded', 429);
      } else if (error.response?.status === 400) {
        throw new AppError(`Groq API error: ${error.response.data?.error?.message || error.message}`, 400);
      } else if (error.response?.status >= 500) {
        throw new AppError('Groq service temporarily unavailable', 503);
      } else if (error.code === 'ECONNABORTED') {
        throw new AppError('Request timeout - Groq API took too long to respond', 408);
      }
      
      throw new AppError(`Groq API error: ${error.message}`, error.response?.status || 500);
    }
  }

  /**
   * List available models
   * @returns {Promise<Array>} List of available models
   */
  async listModels() {
    try {
      const response = await axios.get(`${this.baseURL}/models`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data.data.map(model => ({
        id: model.id,
        name: model.id,
        provider: 'groq'
      }));
    } catch (error) {
      console.error('Error fetching Groq models:', error);
      // Return default models if API call fails
      return [
        { id: 'llama3-8b-8192', name: 'Llama 3 8B', provider: 'groq' },
        { id: 'llama3-70b-8192', name: 'Llama 3 70B', provider: 'groq' },
        { id: 'mixtral-8x7b-32768', name: 'Mixtral 8x7B', provider: 'groq' },
        { id: 'gemma-7b-it', name: 'Gemma 7B IT', provider: 'groq' }
      ];
    }
  }

  /**
   * Validate API parameters
   * @param {Object} params - Parameters to validate
   */
  validateParameters({ temperature, max_tokens, top_p }) {
    if (temperature < 0 || temperature > 2) {
      throw new AppError('Temperature must be between 0 and 2', 400);
    }
    if (max_tokens < 1 || max_tokens > 8000) {
      throw new AppError('Max tokens must be between 1 and 8000 for Groq', 400);
    }
    if (top_p < 0 || top_p > 1) {
      throw new AppError('Top P must be between 0 and 1', 400);
    }
  }
}

export default new GroqService();