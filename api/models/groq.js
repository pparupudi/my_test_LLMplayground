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