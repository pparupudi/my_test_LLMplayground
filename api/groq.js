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
        id: 'llama3-8b-8192',
        name: 'Llama 3 8B',
        description: 'Fast and efficient Llama 3 model',
        provider: 'groq'
      },
      {
        id: 'llama3-70b-8192',
        name: 'Llama 3 70B',
        description: 'Larger Llama 3 model with enhanced capabilities',
        provider: 'groq'
      },
      {
        id: 'mixtral-8x7b-32768',
        name: 'Mixtral 8x7B',
        description: 'Mixture of experts model for complex tasks',
        provider: 'groq'
      },
      {
        id: 'gemma-7b-it',
        name: 'Gemma 7B',
        description: 'Google Gemma instruction-tuned model',
        provider: 'groq'
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
      model = 'llama3-8b-8192'
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

    if (typeof max_tokens !== 'number' || max_tokens < 1 || max_tokens > 8000) {
      return res.status(400).json({
        success: false,
        error: 'max_tokens must be a number between 1 and 8000',
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
    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({
        success: false,
        error: 'Groq API key not configured',
        timestamp: new Date().toISOString()
      });
    }

    // Make API call to Groq
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: Math.max(0, Math.min(2, temperature)),
        max_tokens: Math.max(1, Math.min(8000, max_tokens)),
        top_p: Math.max(0, Math.min(1, top_p)),
        stream: false
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    return res.status(200).json({
      success: true,
      data: {
        content: data.choices[0]?.message?.content || '',
        model: model,
        usage: {
          prompt_tokens: data.usage?.prompt_tokens || 0,
          completion_tokens: data.usage?.completion_tokens || 0,
          total_tokens: data.usage?.total_tokens || 0
        },
        finish_reason: data.choices[0]?.finish_reason || 'stop'
      },
      provider: 'groq',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Groq API Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
      timestamp: new Date().toISOString()
    });
  }
}