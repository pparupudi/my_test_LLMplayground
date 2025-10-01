import express from 'express';
import geminiService from '../services/geminiService.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { isValidGeminiModel, DEFAULT_GEMINI_MODEL, VALID_GEMINI_MODELS } from '../constants/models.js';

const router = express.Router();

/**
 * POST /api/gemini
 * Generate completion using Google Gemini API
 * 
 * Required: prompt
 * Optional: temperature, max_tokens, top_p, model
 * 
 * Model validation: Only accepts models from the VALID_GEMINI_MODELS array
 */
router.post('/', asyncHandler(async (req, res) => {
  const {
    prompt,
    temperature = 0.7,
    max_tokens = 1000,
    top_p = 1,
    model = DEFAULT_GEMINI_MODEL
  } = req.body;

  // Validate required fields
  if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Prompt is required and must be a non-empty string',
      timestamp: new Date().toISOString()
    });
  }

  // Validate model selection
  if (!isValidGeminiModel(model)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid model. Please select from available models.',
      availableModels: VALID_GEMINI_MODELS,
      providedModel: model,
      timestamp: new Date().toISOString()
    });
  }

  // Validate numeric parameters
  if (typeof temperature !== 'number' || temperature < 0 || temperature > 1) {
    return res.status(400).json({
      success: false,
      error: 'Temperature must be a number between 0 and 1',
      timestamp: new Date().toISOString()
    });
  }

  if (typeof max_tokens !== 'number' || max_tokens < 1 || max_tokens > 8192) {
    return res.status(400).json({
      success: false,
      error: 'max_tokens must be a number between 1 and 8192',
      timestamp: new Date().toISOString()
    });
  }

  if (typeof top_p !== 'number' || top_p < 0 || top_p > 1) {
    return res.status(400).json({
      success: false,
      error: 'top_p must be a number between 0 and 1',
      timestamp: new Date().toISOString()
    });
  }

  try {
    const response = await geminiService.generateCompletion({
      prompt: prompt.trim(),
      temperature,
      max_tokens,
      top_p,
      model
    });

    res.json({
      success: true,
      data: {
        content: response.content,
        model: response.model,
        usage: response.usage,
        finish_reason: response.finish_reason
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    // Error is already handled by the service and middleware
    throw error;
  }
}));

/**
 * GET /api/gemini/models
 * Get available Gemini models
 */
router.get('/models', asyncHandler(async (req, res) => {
  try {
    const models = await geminiService.getModels();
    res.json({
      success: true,
      data: models,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    throw error;
  }
}));

/**
 * GET /api/gemini/test
 * Test Gemini API connection
 */
router.get('/test', asyncHandler(async (req, res) => {
  try {
    const result = await geminiService.testConnection();
    res.json({
      success: result.success,
      data: result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    throw error;
  }
}));

export default router;