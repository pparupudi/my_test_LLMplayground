import OpenAI from 'openai';
import { AppError } from '../middleware/errorHandler.js';

class OpenAIService {
  constructor() {
    this.client = null;
  }

  getClient() {
    if (!this.client) {
      this.client = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
    }
    return this.client;
  }

  /**
   * Generate completion using OpenAI API
   * @param {Object} params - Parameters for the API call
   * @param {string} params.prompt - The user prompt
   * @param {number} params.temperature - Temperature setting (0-2)
   * @param {number} params.max_tokens - Maximum tokens to generate
   * @param {number} params.top_p - Top P setting (0-1)
   * @param {string} params.model - Model to use (optional)
   * @returns {Promise<Object>} API response
   */
  async generateCompletion({ prompt, temperature = 0.7, max_tokens = 1000, top_p = 1, model = 'gpt-3.5-turbo' }) {
    try {
      // Validate parameters
      this.validateParameters({ temperature, max_tokens, top_p });

      const response = await this.getClient().chat.completions.create({
        model: model,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: Math.max(0, Math.min(2, temperature)),
        max_tokens: Math.max(1, Math.min(4000, max_tokens)),
        top_p: Math.max(0, Math.min(1, top_p)),
        stream: false
      });

      return {
        success: true,
        data: {
          content: response.choices[0]?.message?.content || '',
          model: response.model,
          usage: {
            prompt_tokens: response.usage?.prompt_tokens || 0,
            completion_tokens: response.usage?.completion_tokens || 0,
            total_tokens: response.usage?.total_tokens || 0
          },
          finish_reason: response.choices[0]?.finish_reason || 'unknown'
        },
        provider: 'openai',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('OpenAI API Error:', error);
      
      // Handle specific error types
      if (error.code === 'insufficient_quota') {
        throw new AppError('OpenAI quota exceeded. Please check your billing and usage limits at https://platform.openai.com/account/billing', 429);
      } else if (error.status === 401) {
        throw new AppError('Invalid OpenAI API key. Please check your API key configuration.', 401);
      } else if (error.status === 429) {
        throw new AppError('OpenAI API rate limit exceeded. Please try again in a moment.', 429);
      } else if (error.status === 400) {
        throw new AppError(`OpenAI API error: ${error.message}`, 400);
      } else if (error.status >= 500) {
        throw new AppError('OpenAI service temporarily unavailable. Please try again later.', 503);
      }
      
      // Fallback error message
      const message = error.message || 'Unknown OpenAI API error';
      throw new AppError(`OpenAI API error: ${message}`, error.status || 500);
    }
  }

  /**
   * List available models
   * @returns {Promise<Array>} List of available models
   */
  async listModels() {
    try {
      const response = await this.getClient().models.list();
      return response.data
        .filter(model => model.id.includes('gpt'))
        .map(model => ({
          id: model.id,
          name: model.id,
          provider: 'openai'
        }));
    } catch (error) {
      console.error('Error fetching OpenAI models:', error);
      // Return default models if API call fails
      return [
        { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'openai' }
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
    if (max_tokens < 1 || max_tokens > 4000) {
      throw new AppError('Max tokens must be between 1 and 4000', 400);
    }
    if (top_p < 0 || top_p > 1) {
      throw new AppError('Top P must be between 0 and 1', 400);
    }
  }
}

export default new OpenAIService();