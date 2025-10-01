import { GoogleGenerativeAI } from '@google/generative-ai';
import { AppError } from '../middleware/errorHandler.js';
import { DEFAULT_GEMINI_MODEL, getGeminiModelList } from '../constants/models.js';

class GeminiService {
  constructor() {
    this.client = null;
  }

  getClient() {
    if (!this.client) {
      // Validate API key exists
      if (!process.env.GEMINI_API_KEY) {
        throw new AppError('Gemini API key not configured. Please set GEMINI_API_KEY in your .env file.', 500);
      }
      
      this.client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    }
    return this.client;
  }

  /**
   * Generate completion using Google Gemini API
   * @param {Object} params - Parameters for the API call
   * @param {string} params.prompt - The user prompt
   * @param {number} params.temperature - Temperature setting (0-1)
   * @param {number} params.max_tokens - Maximum tokens to generate
   * @param {number} params.top_p - Top P setting (0-1)
   * @param {string} params.model - Model to use (optional)
   * @returns {Promise<Object>} API response
   */
  async generateCompletion({ prompt, temperature = 0.7, max_tokens = 1000, top_p = 1, model = DEFAULT_GEMINI_MODEL }) {
    try {
      // Validate parameters
      this.validateParameters({ temperature, max_tokens, top_p });

      const genAI = this.getClient();
      const geminiModel = genAI.getGenerativeModel({ 
        model: model,
        generationConfig: {
          temperature: Math.max(0, Math.min(1, temperature)),
          topP: Math.max(0, Math.min(1, top_p)),
          maxOutputTokens: Math.max(1, Math.min(8192, max_tokens)),
        }
      });

      const result = await geminiModel.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Format response to match other providers
      return {
        content: text,
        model: model,
        usage: {
          prompt_tokens: response.usageMetadata?.promptTokenCount || 0,
          completion_tokens: response.usageMetadata?.candidatesTokenCount || 0,
          total_tokens: response.usageMetadata?.totalTokenCount || 0
        },
        finish_reason: response.candidates?.[0]?.finishReason || 'stop'
      };

    } catch (error) {
      console.error('Gemini API Error:', error);
      
      // Handle specific Gemini API errors
      if (error.message?.includes('API_KEY_INVALID')) {
        throw new AppError('Invalid Gemini API key. Please check your GEMINI_API_KEY environment variable.', 401);
      } else if (error.message?.includes('QUOTA_EXCEEDED')) {
        throw new AppError('Gemini API quota exceeded. Please check your billing and usage limits.', 429);
      } else if (error.message?.includes('RATE_LIMIT_EXCEEDED')) {
        throw new AppError('Gemini API rate limit exceeded. Please try again later.', 429);
      } else if (error.message?.includes('MODEL_NOT_FOUND')) {
        throw new AppError(`Gemini model '${model}' not found. Please use a valid model.`, 400);
      } else if (error.message?.includes('SAFETY')) {
        throw new AppError('Content was blocked by Gemini safety filters. Please try a different prompt.', 400);
      }
      
      // Generic error handling
      throw new AppError(`Gemini API error: ${error.message}`, 500);
    }
  }

  /**
   * Validate API parameters
   * @param {Object} params - Parameters to validate
   */
  validateParameters({ temperature, max_tokens, top_p }) {
    if (typeof temperature !== 'number' || temperature < 0 || temperature > 1) {
      throw new AppError('Temperature must be a number between 0 and 1', 400);
    }
    
    if (typeof max_tokens !== 'number' || max_tokens < 1 || max_tokens > 8192) {
      throw new AppError('max_tokens must be a number between 1 and 8192', 400);
    }
    
    if (typeof top_p !== 'number' || top_p < 0 || top_p > 1) {
      throw new AppError('top_p must be a number between 0 and 1', 400);
    }
  }

  /**
   * Get available models
   * @returns {Promise<Object>} Available models
   */
  async getModels() {
    try {
      return {
        models: getGeminiModelList(),
        default: DEFAULT_GEMINI_MODEL
      };
    } catch (error) {
      console.error('Error fetching Gemini models:', error);
      throw new AppError('Failed to fetch Gemini models', 500);
    }
  }

  /**
   * Test API connection
   * @returns {Promise<Object>} Connection test result
   */
  async testConnection() {
    try {
      const response = await this.generateCompletion({
        prompt: 'Hello, this is a test message. Please respond with "Hello from Gemini!"',
        temperature: 0.1,
        max_tokens: 50
      });
      
      return {
        success: true,
        message: 'Gemini API connection successful',
        model: response.model,
        response: response.content
      };
    } catch (error) {
      return {
        success: false,
        message: `Gemini API connection failed: ${error.message}`,
        error: error.message
      };
    }
  }
}

// Export singleton instance
const geminiService = new GeminiService();
export default geminiService;