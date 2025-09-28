import express from 'express';
import huggingfaceService from '../services/huggingfaceService.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { validateRequestBody } from '../middleware/validateApiKeys.js';

const router = express.Router();

/**
 * POST /api/huggingface
 * Generate completion using Hugging Face API
 */
router.post('/', validateRequestBody, asyncHandler(async (req, res) => {
  const {
    prompt,
    temperature = 0.7,
    max_tokens = 1000,
    top_p = 1,
    model = 'microsoft/DialoGPT-large'
  } = req.body;

  const result = await huggingfaceService.generateCompletion({
    prompt,
    temperature,
    max_tokens,
    top_p,
    model
  });

  res.status(200).json(result);
}));

/**
 * GET /api/huggingface/models
 * List available Hugging Face models
 */
router.get('/models', asyncHandler(async (req, res) => {
  const models = await huggingfaceService.listModels();
  res.status(200).json({
    success: true,
    data: models,
    provider: 'huggingface',
    timestamp: new Date().toISOString()
  });
}));

export default router;