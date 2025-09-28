import Anthropic from '@anthropic-ai/sdk';

// Valid Claude models
const VALID_CLAUDE_MODELS = [
  'claude-3-opus-20240229',
  'claude-3-sonnet-20240229',
  'claude-3-haiku-20240307',
  'claude-3-5-sonnet-20240620',
  'claude-3-5-haiku-20241022'
];

const DEFAULT_CLAUDE_MODEL = 'claude-3-haiku-20240307';

function isValidClaudeModel(model) {
  return VALID_CLAUDE_MODELS.includes(model);
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    // Return available models
    const models = VALID_CLAUDE_MODELS.map(modelId => ({
      id: modelId,
      name: modelId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      description: `Anthropic ${modelId.includes('opus') ? 'Opus' : modelId.includes('sonnet') ? 'Sonnet' : 'Haiku'} model`,
      provider: 'anthropic'
    }));

    return res.status(200).json({
      success: true,
      data: models,
      timestamp: new Date().toISOString()
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
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

    // Check for API key
    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(500).json({
        success: false,
        error: 'Anthropic API key not configured',
        timestamp: new Date().toISOString()
      });
    }

    // Initialize Anthropic client
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    // Make API call
    const response = await anthropic.messages.create({
      model: model,
      max_tokens: max_tokens,
      temperature: temperature,
      top_p: top_p,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    return res.status(200).json({
      success: true,
      data: {
        content: response.content[0].text,
        model: model,
        usage: {
          prompt_tokens: response.usage.input_tokens,
          completion_tokens: response.usage.output_tokens,
          total_tokens: response.usage.input_tokens + response.usage.output_tokens
        },
        finish_reason: response.stop_reason
      },
      provider: 'anthropic',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Anthropic API Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
      timestamp: new Date().toISOString()
    });
  }
}