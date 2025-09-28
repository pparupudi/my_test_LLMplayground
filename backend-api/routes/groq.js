import express from 'express';
import groqService from '../services/groqService.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { validateRequestBody } from '../middleware/validateApiKeys.js';

const router = express.Router();

/**
 * POST /api/groq
 * Generate completion using Groq API
 */
router.post('/', validateRequestBody, asyncHandler(async (req, res) => {
  const {
    prompt,
    temperature = 0.7,
    max_tokens = 1000,
    top_p = 1,
    model = 'llama3-8b-8192'
  } = req.body;

  const result = await groqService.generateCompletion({
    prompt,
    temperature,
    max_tokens,
    top_p,
    model
  });

  res.status(200).json(result);
}));

/**
 * GET /api/groq/models
 * List available Groq models
 */
router.get('/models', asyncHandler(async (req, res) => {
  const models = await groqService.listModels();
  res.status(200).json({
    success: true,
    data: models,
    provider: 'groq',
    timestamp: new Date().toISOString()
  });
}));

export default router;