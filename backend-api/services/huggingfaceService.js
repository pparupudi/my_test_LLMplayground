import axios from 'axios';
import { AppError } from '../middleware/errorHandler.js';

class HuggingFaceService {
  constructor() {
    this.baseURL = 'https://api-inference.huggingface.co/models';
    this.apiKey = process.env.HUGGINGFACE_API_KEY;
  }

  /**
   * Generate completion using Hugging Face API
   * @param {Object} params - Parameters for the API call
   * @param {string} params.prompt - The user prompt
   * @param {number} params.temperature - Temperature setting (0-1)
   * @param {number} params.max_tokens - Maximum tokens to generate
   * @param {number} params.top_p - Top P setting (0-1)
   * @param {string} params.model - Model to use (optional)
   * @returns {Promise<Object>} API response
   */
  async generateCompletion({ prompt, temperature = 0.7, max_tokens = 1000, top_p = 1, model = 'microsoft/DialoGPT-large' }) {
    try {
      // Validate parameters
      this.validateParameters({ temperature, max_tokens, top_p });

      const response = await axios.post(
        `${this.baseURL}/${model}`,
        {
          inputs: prompt,
          parameters: {
            temperature: Math.max(0.1, Math.min(1, temperature)),
            max_new_tokens: Math.max(1, Math.min(1000, max_tokens)),
            top_p: Math.max(0, Math.min(1, top_p)),
            do_sample: true,
            return_full_text: false
          },
          options: {
            wait_for_model: true,
            use_cache: false
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 30000 // 30 second timeout
        }
      );

      // Handle different response formats from Hugging Face
      let content = '';
      if (Array.isArray(response.data) && response.data.length > 0) {
        if (response.data[0].generated_text) {
          content = response.data[0].generated_text;
        } else if (response.data[0].translation_text) {
          content = response.data[0].translation_text;
        } else if (response.data[0].summary_text) {
          content = response.data[0].summary_text;
        } else {
          content = JSON.stringify(response.data[0]);
        }
      } else if (typeof response.data === 'string') {
        content = response.data;
      } else {
        content = JSON.stringify(response.data);
      }

      return {
        success: true,
        data: {
          content: content,
          model: model,
          usage: {
            prompt_tokens: this.estimateTokens(prompt),
            completion_tokens: this.estimateTokens(content),
            total_tokens: this.estimateTokens(prompt + content)
          },
          finish_reason: 'stop'
        },
        provider: 'huggingface',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Hugging Face API Error:', error);
      
      if (error.response?.status === 401) {
        throw new AppError('Invalid Hugging Face API key', 401);
      } else if (error.response?.status === 429) {
        throw new AppError('Hugging Face API rate limit exceeded', 429);
      } else if (error.response?.status === 400) {
        throw new AppError(`Hugging Face API error: ${error.response.data?.error || error.message}`, 400);
      } else if (error.response?.status === 503) {
        throw new AppError('Hugging Face model is loading, please try again in a few moments', 503);
      } else if (error.response?.status >= 500) {
        throw new AppError('Hugging Face service temporarily unavailable', 503);
      } else if (error.code === 'ECONNABORTED') {
        throw new AppError('Request timeout - Hugging Face API took too long to respond', 408);
      }
      
      throw new AppError(`Hugging Face API error: ${error.message}`, error.response?.status || 500);
    }
  }

  /**
   * List available models
   * @returns {Promise<Array>} List of available models
   */
  async listModels() {
    // Return popular text generation models from Hugging Face
    return [
      { id: 'microsoft/DialoGPT-large', name: 'DialoGPT Large', provider: 'huggingface' },
      { id: 'microsoft/DialoGPT-medium', name: 'DialoGPT Medium', provider: 'huggingface' },
      { id: 'gpt2', name: 'GPT-2', provider: 'huggingface' },
      { id: 'gpt2-medium', name: 'GPT-2 Medium', provider: 'huggingface' },
      { id: 'gpt2-large', name: 'GPT-2 Large', provider: 'huggingface' },
      { id: 'EleutherAI/gpt-neo-2.7B', name: 'GPT-Neo 2.7B', provider: 'huggingface' },
      { id: 'EleutherAI/gpt-j-6B', name: 'GPT-J 6B', provider: 'huggingface' },
      { id: 'facebook/blenderbot-400M-distill', name: 'BlenderBot 400M', provider: 'huggingface' },
      { id: 'facebook/bart-large-cnn', name: 'BART Large CNN', provider: 'huggingface' },
      { id: 't5-base', name: 'T5 Base', provider: 'huggingface' }
    ];
  }

  /**
   * Validate API parameters
   * @param {Object} params - Parameters to validate
   */
  validateParameters({ temperature, max_tokens, top_p }) {
    if (temperature < 0.1 || temperature > 1) {
      throw new AppError('Temperature must be between 0.1 and 1 for Hugging Face', 400);
    }
    if (max_tokens < 1 || max_tokens > 1000) {
      throw new AppError('Max tokens must be between 1 and 1000 for Hugging Face', 400);
    }
    if (top_p < 0 || top_p > 1) {
      throw new AppError('Top P must be between 0 and 1', 400);
    }
  }

  /**
   * Estimate token count (rough approximation)
   * @param {string} text - Text to estimate tokens for
   * @returns {number} Estimated token count
   */
  estimateTokens(text) {
    if (!text) return 0;
    // Rough estimation: 1 token ≈ 4 characters for English text
    return Math.ceil(text.length / 4);
  }
}

export default new HuggingFaceService();