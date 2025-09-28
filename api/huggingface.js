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
        id: 'microsoft/DialoGPT-large',
        name: 'DialoGPT Large',
        description: 'Conversational AI model by Microsoft',
        provider: 'huggingface'
      },
      {
        id: 'microsoft/DialoGPT-medium',
        name: 'DialoGPT Medium',
        description: 'Medium-sized conversational AI model',
        provider: 'huggingface'
      },
      {
        id: 'gpt2',
        name: 'GPT-2',
        description: 'OpenAI GPT-2 text generation model',
        provider: 'huggingface'
      },
      {
        id: 'distilgpt2',
        name: 'DistilGPT-2',
        description: 'Distilled version of GPT-2',
        provider: 'huggingface'
      },
      {
        id: 'EleutherAI/gpt-neo-2.7B',
        name: 'GPT-Neo 2.7B',
        description: 'EleutherAI GPT-Neo model',
        provider: 'huggingface'
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
      model = 'microsoft/DialoGPT-large'
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
    if (typeof temperature !== 'number' || temperature < 0.1 || temperature > 1) {
      return res.status(400).json({
        success: false,
        error: 'Temperature must be a number between 0.1 and 1',
        timestamp: new Date().toISOString()
      });
    }

    if (typeof max_tokens !== 'number' || max_tokens < 1 || max_tokens > 1000) {
      return res.status(400).json({
        success: false,
        error: 'max_tokens must be a number between 1 and 1000',
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
    if (!process.env.HUGGINGFACE_API_KEY) {
      return res.status(500).json({
        success: false,
        error: 'HuggingFace API key not configured',
        timestamp: new Date().toISOString()
      });
    }

    // Make API call to HuggingFace
    const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          temperature: Math.max(0.1, Math.min(1, temperature)),
          max_new_tokens: Math.max(1, Math.min(1000, max_tokens)),
          top_p: Math.max(0, Math.min(1, top_p)),
          do_sample: true,
          return_full_text: false
        },
        options: {
          wait_for_model: true,
          use_cache: false
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorData}`);
    }

    const data = await response.json();

    // Handle different response formats from HuggingFace
    let content = '';
    let estimatedTokens = 0;

    if (Array.isArray(data) && data.length > 0) {
      if (data[0].generated_text) {
        content = data[0].generated_text;
      } else if (data[0].text) {
        content = data[0].text;
      } else {
        content = JSON.stringify(data[0]);
      }
    } else if (data.generated_text) {
      content = data.generated_text;
    } else if (data.text) {
      content = data.text;
    } else {
      content = JSON.stringify(data);
    }

    // Estimate tokens (rough approximation: 1 token ≈ 4 characters)
    estimatedTokens = Math.ceil(content.length / 4);

    return res.status(200).json({
      success: true,
      data: {
        content: content,
        model: model,
        usage: {
          prompt_tokens: Math.ceil(prompt.length / 4),
          completion_tokens: estimatedTokens,
          total_tokens: Math.ceil(prompt.length / 4) + estimatedTokens
        },
        finish_reason: 'stop'
      },
      provider: 'huggingface',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('HuggingFace API Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
      timestamp: new Date().toISOString()
    });
  }
}