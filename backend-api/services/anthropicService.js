import Anthropic from '@anthropic-ai/sdk';
import { AppError } from '../middleware/errorHandler.js';
import { DEFAULT_CLAUDE_MODEL, getClaudeModelList } from '../constants/models.js';

class AnthropicService {
  constructor() {
    this.client = null;
  }

  getClient() {
    if (!this.client) {
      // Validate API key exists
      if (!process.env.ANTHROPIC_API_KEY) {
        throw new AppError('Anthropic API key not configured. Please set ANTHROPIC_API_KEY in your .env file.', 500);
      }
      
      this.client = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
      });
    }
    return this.client;
  }

  /**
   * Generate completion using Anthropic Claude API
   * @param {Object} params - Parameters for the API call
   * @param {string} params.prompt - The user prompt
   * @param {number} params.temperature - Temperature setting (0-1)
   * @param {number} params.max_tokens - Maximum tokens to generate
   * @param {number} params.top_p - Top P setting (0-1)
   * @param {string} params.model - Model to use (optional)
   * @returns {Promise<Object>} API response
   */
  async generateCompletion({ prompt, temperature = 0.7, max_tokens = 1000, top_p = 1, model = DEFAULT_CLAUDE_MODEL }) {
    try {
      // Validate parameters
      this.validateParameters({ temperature, max_tokens, top_p });

      const response = await this.getClient().messages.create({
        model: model,
        max_tokens: Math.max(1, Math.min(4000, max_tokens)),
        temperature: Math.max(0, Math.min(1, temperature)),
        top_p: Math.max(0, Math.min(1, top_p)),
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      });

      return {
        success: true,
        data: {
          content: response.content[0]?.text || '',
          model: response.model,
          usage: {
            prompt_tokens: response.usage?.input_tokens || 0,
            completion_tokens: response.usage?.output_tokens || 0,
            total_tokens: (response.usage?.input_tokens || 0) + (response.usage?.output_tokens || 0)
          },
          finish_reason: response.stop_reason || 'unknown'
        },
        provider: 'anthropic',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Anthropic API Error:', error);
      
      if (error.status === 401) {
        throw new AppError('Invalid Anthropic API key', 401);
      } else if (error.status === 429) {
        throw new AppError('Anthropic API rate limit exceeded', 429);
      } else if (error.status === 400) {
        throw new AppError(`Anthropic API error: ${error.message}`, 400);
      } else if (error.status >= 500) {
        throw new AppError('Anthropic service temporarily unavailable', 503);
      }
      
      throw new AppError(`Anthropic API error: ${error.message}`, error.status || 500);
    }
  }

  /**
   * List available models
   * @returns {Promise<Array>} List of available models
   */
  async listModels() {
    // Anthropic doesn't have a models endpoint, so we return the known models
    // Using centralized model list from constants for consistency
    return getClaudeModelList().map(model => ({
      ...model,
      provider: 'anthropic'
    }));
  }

  /**
   * Validate API parameters
   * @param {Object} params - Parameters to validate
   */
  validateParameters({ temperature, max_tokens, top_p }) {
    if (temperature < 0 || temperature > 1) {
      throw new AppError('Temperature must be between 0 and 1 for Anthropic', 400);
    }
    if (max_tokens < 1 || max_tokens > 4000) {
      throw new AppError('Max tokens must be between 1 and 4000', 400);
    }
    if (top_p < 0 || top_p > 1) {
      throw new AppError('Top P must be between 0 and 1', 400);
    }
  }
}

export default new AnthropicService();