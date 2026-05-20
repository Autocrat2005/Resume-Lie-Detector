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

async function checkModels() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  console.log('=== Fetching Available Anthropic Models ===');
  
  if (!apiKey) {
    console.error('Error: ANTHROPIC_API_KEY is not defined in environment variables.');
    return;
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/models', {
      method: 'GET',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
    });

    const text = await response.text();
    console.log(`HTTP Status: ${response.status} ${response.statusText}`);
    console.log('Response payload:', text);
  } catch (error) {
    console.error('Error during models fetch:', error);
  }
}

checkModels();
