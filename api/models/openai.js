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
      id: 'gpt-4',
      name: 'GPT-4',
      description: 'Most capable GPT-4 model',
      provider: 'openai'
    },
    {
      id: 'gpt-4-turbo-preview',
      name: 'GPT-4 Turbo',
      description: 'Latest GPT-4 Turbo model',
      provider: 'openai'
    },
    {
      id: 'gpt-3.5-turbo',
      name: 'GPT-3.5 Turbo',
      description: 'Fast and efficient GPT-3.5 model',
      provider: 'openai'
    },
    {
      id: 'gpt-3.5-turbo-16k',
      name: 'GPT-3.5 Turbo 16K',
      description: 'GPT-3.5 with extended context window',
      provider: 'openai'
    }
  ];

  return res.status(200).json({
    success: true,
    data: models,
    timestamp: new Date().toISOString()
  });
}