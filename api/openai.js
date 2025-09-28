import OpenAI from 'openai';

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
    const models = [
      {
        id: 'gpt-4',
        name: 'GPT-4',
        description: 'Most capable GPT-4 model',
        provider: 'openai'
      },
      {
        id: 'gpt-4-turbo',
        name: 'GPT-4 Turbo',
        description: 'Latest GPT-4 model with improved performance',
        provider: 'openai'
      },
      {
        id: 'gpt-3.5-turbo',
        name: 'GPT-3.5 Turbo',
        description: 'Fast and efficient model for most tasks',
        provider: 'openai'
      }
    ];

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
      model = 'gpt-3.5-turbo'
    } = req.body;

    // Validate required fields
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Prompt is required and must be a non-empty string',
        timestamp: new Date().toISOString()
      });
    }

    // Validate numeric parameters
    if (typeof temperature !== 'number' || temperature < 0 || temperature > 2) {
      return res.status(400).json({
        success: false,
        error: 'Temperature must be a number between 0 and 2',
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
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        success: false,
        error: 'OpenAI API key not configured',
        timestamp: new Date().toISOString()
      });
    }

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Make API call
    const response = await openai.chat.completions.create({
      model: model,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: Math.max(0, Math.min(2, temperature)),
      max_tokens: Math.max(1, Math.min(4000, max_tokens)),
      top_p: Math.max(0, Math.min(1, top_p)),
      stream: false
    });

    return res.status(200).json({
      success: true,
      data: {
        content: response.choices[0]?.message?.content || '',
        model: model,
        usage: {
          prompt_tokens: response.usage?.prompt_tokens || 0,
          completion_tokens: response.usage?.completion_tokens || 0,
          total_tokens: response.usage?.total_tokens || 0
        },
        finish_reason: response.choices[0]?.finish_reason || 'stop'
      },
      provider: 'openai',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('OpenAI API Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
      timestamp: new Date().toISOString()
    });
  }
}