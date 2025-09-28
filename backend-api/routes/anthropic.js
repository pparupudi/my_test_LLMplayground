import express from 'express';
import anthropicService from '../services/anthropicService.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { isValidClaudeModel, DEFAULT_CLAUDE_MODEL, VALID_CLAUDE_MODELS } from '../constants/models.js';

const router = express.Router();

/**
 * POST /api/anthropic
 * Generate completion using Anthropic Claude API
 * 
 * Required: prompt
 * Optional: temperature, max_tokens, top_p, model
 * 
 * Model validation: Only accepts models from the VALID_CLAUDE_MODELS array
 */
router.post('/', asyncHandler(async (req, res) => {
  const {
    prompt,
    temperature = 0.7,
    max_tokens = 1000,
    top_p = 1,
    model = DEFAULT_CLAUDE_MODEL
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
  if (!isValidClaudeModel(model)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid model. Please select from available models.',
      availableModels: VALID_CLAUDE_MODELS,
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

  if (typeof max_tokens !== 'number' || max_tokens < 1 || max_tokens > 4000) {
    return res.status(400).json({
      success: false,
      error: 'max_tokens must be a number between 1 and 4000',
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

  const result = await anthropicService.generateCompletion({
    prompt,
    temperature,
    max_tokens,
    top_p,
    model
  });

  res.status(200).json(result);
}));

/**
 * GET /api/anthropic/models
 * List available Anthropic models
 */
router.get('/models', asyncHandler(async (req, res) => {
  const models = await anthropicService.listModels();
  res.status(200).json({
    success: true,
    data: models,
    provider: 'anthropic',
    timestamp: new Date().toISOString()
  });
}));

export default router;