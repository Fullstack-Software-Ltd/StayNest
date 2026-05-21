const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env.local') });

async function testGroq() {
  const apiKey = process.env.GROQ_API_KEY;
  console.log('Using API key:', apiKey ? apiKey.substring(0, 10) + '...' : 'undefined');

  const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
  const MODEL = 'llama-3.3-70b-versatile';

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.7,
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: 'Hello, this is a test of the API.' }
        ]
      })
    });

    console.log('Status:', response.status);
    const data = await response.json();
    console.log('Response data:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error during fetch:', error);
  }
}

testGroq();
