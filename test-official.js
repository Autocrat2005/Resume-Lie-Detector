const path = require('path');
const fs = require('fs');

// Simple native .env loader
function loadEnv(filePath) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf-8');
  content.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const parts = trimmed.split('=');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      let val = parts.slice(1).join('=').trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.substring(1, val.length - 1);
      }
      process.env[key] = val;
    }
  });
}

loadEnv(path.resolve(__dirname, '.env'));
loadEnv(path.resolve(__dirname, '.env.local'));

async function runSmokeTest() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  console.log('=== Official Anthropic API Smoke Test ===');
  
  if (!apiKey) {
    console.error('Error: ANTHROPIC_API_KEY is not defined in environment variables.');
    return;
  }

  const maskedKey = apiKey.substring(0, 15) + '...' + apiKey.substring(apiKey.length - 8);
  console.log(`Using API Key: ${maskedKey}`);
  console.log(`Key Length: ${apiKey.length} characters`);

  // We will try three different models:
  // 1. Claude 3.5 Sonnet v2 (recommended)
  // 2. Claude 3.5 Sonnet v1 (original)
  // 3. Claude 3.5 Haiku
  const modelsToTest = [
    'claude-sonnet-4-6',
    'claude-3-5-sonnet-20241022',
  ];

  for (const model of modelsToTest) {
    console.log(`\n--- Testing Model: ${model} ---`);
    try {
      const start = Date.now();
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model,
          max_tokens: 50,
          messages: [{ role: 'user', content: 'Respond with exactly: Hello World' }],
        }),
      });

      const duration = ((Date.now() - start) / 1000).toFixed(2);
      const text = await response.text();
      
      console.log(`HTTP Status: ${response.status} ${response.statusText}`);
      console.log(`Response time: ${duration}s`);
      
      if (response.ok) {
        const data = JSON.parse(text);
        console.log(`Success! Response: "${data.content?.[0]?.text}"`);
        console.log(`Token Usage: Input=${data.usage?.input_tokens}, Output=${data.usage?.output_tokens}`);
        return; // Success, stop testing other models
      } else {
        console.error(`Failure: ${text}`);
      }
    } catch (error) {
      console.error(`Error during fetch for ${model}:`, error);
    }
  }

  console.log('\n=========================================');
  console.log('Smoke test complete. All tested models failed.');
}

runSmokeTest();
