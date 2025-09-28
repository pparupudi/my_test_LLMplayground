import express from 'express';
import { getClaudeModelList } from '../constants/models.js';

const router = express.Router();

/**
 * GET /api/models/anthropic
 * Returns the list of available Anthropic Claude models
 * 
 * Response format:
 * {
 *   "success": true,
 *   "data": [
 *     {
 *       "id": "claude-3-opus-20240229",
 *       "name": "Claude 3 Opus", 
 *       "description": "Most capable model, best for complex tasks"
 *     },
 *     ...
 *   ],
 *   "count": 5
 * }
 */
router.get('/anthropic', (req, res) => {
  try {
    const models = getClaudeModelList();
    
    res.json({
      success: true,
      data: models,
      count: models.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching Anthropic models:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch available models',
      timestamp: new Date().toISOString()
    });
  }
});

export default router;