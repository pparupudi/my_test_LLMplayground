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