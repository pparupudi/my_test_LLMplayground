// Valid Claude models
const VALID_CLAUDE_MODELS = [
  'claude-3-opus-20240229',
  'claude-3-sonnet-20240229', 
  'claude-3-haiku-20240307',
  'claude-3-5-sonnet-20240620',
  'claude-3-5-haiku-20241022'
];

const CLAUDE_MODEL_INFO = {
  'claude-3-opus-20240229': {
    name: 'Claude 3 Opus',
    description: 'Most powerful model for highly complex tasks'
  },
  'claude-3-sonnet-20240229': {
    name: 'Claude 3 Sonnet', 
    description: 'Balanced performance and speed for most tasks'
  },
  'claude-3-haiku-20240307': {
    name: 'Claude 3 Haiku',
    description: 'Fastest model for simple tasks and quick responses'
  },
  'claude-3-5-sonnet-20240620': {
    name: 'Claude 3.5 Sonnet',
    description: 'Enhanced version with improved capabilities'
  },
  'claude-3-5-haiku-20241022': {
    name: 'Claude 3.5 Haiku',
    description: 'Latest fast model with improved performance'
  }
};

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const models = VALID_CLAUDE_MODELS.map(modelId => ({
      id: modelId,
      name: CLAUDE_MODEL_INFO[modelId]?.name || modelId,
      description: CLAUDE_MODEL_INFO[modelId]?.description || 'Anthropic Claude model',
      provider: 'anthropic'
    }));

    return res.status(200).json({
      success: true,
      data: models,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Models API Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve models',
      timestamp: new Date().toISOString()
    });
  }
}