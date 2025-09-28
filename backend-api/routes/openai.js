import express from 'express';
import openaiService from '../services/openaiService.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { validateRequestBody } from '../middleware/validateApiKeys.js';

const router = express.Router();

/**
 * POST /api/openai
 * Generate completion using OpenAI API
 */
router.post('/', validateRequestBody, asyncHandler(async (req, res) => {
  const {
    prompt,
    temperature = 0.7,
    max_tokens = 1000,
    top_p = 1,
    model = 'gpt-3.5-turbo'
  } = req.body;

  const result = await openaiService.generateCompletion({
    prompt,
    temperature,
    max_tokens,
    top_p,
    model
  });

  res.status(200).json(result);
}));

/**
 * GET /api/openai/models
 * List available OpenAI models
 */
router.get('/models', asyncHandler(async (req, res) => {
  const models = await openaiService.listModels();
  res.status(200).json({
    success: true,
    data: models,
    provider: 'openai',
    timestamp: new Date().toISOString()
  });
}));

export default router;