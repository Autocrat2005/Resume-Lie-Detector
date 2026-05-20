import { AIProvider } from './types';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface AIResponse {
  content: string;
  provider: AIProvider;
}

// Free tier — Anthropic-compatible proxy (Haiku)
const FREE_BASE_URL = process.env.VERITAS_LLM_BASE_URL || 'https://cc.freemodel.dev';
const FREE_API_KEY = process.env.VERITAS_LLM_API_KEY || '';
const FREE_MODEL = process.env.VERITAS_LLM_MODEL || 'claude-sonnet-4-6';
const FREE_MAX_TOKENS = parseInt(process.env.VERITAS_LLM_MAX_TOKENS || '4096', 10);
const FREE_TEMPERATURE = parseFloat(process.env.VERITAS_LLM_TEMPERATURE || '0.2');

// Direct GROQ API configuration
const GROQ_API_KEY = process.env.GROQ_API_KEY || '';
const GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

// Pro tier — Direct Anthropic (Claude Sonnet)
const PRO_API_KEY = process.env.ANTHROPIC_API_KEY || '';
const PRO_MODEL = 'claude-sonnet-4-20250514';
const PRO_BASE_URL = 'https://api.anthropic.com';

/**
 * Unified AI caller. Both tiers use the Anthropic messages format.
 * Free tier hits a proxy or Groq directly; Pro tier hits Anthropic directly.
 */
export async function callAI(
  messages: ChatMessage[],
  provider: AIProvider = 'groq' // 'groq' = free tier label kept for UI compat
): Promise<AIResponse> {
  // If Free tier is requested and we have a GROQ key, use direct Groq integration
  if (provider === 'groq' && GROQ_API_KEY) {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Groq API error [${GROQ_MODEL}]:`, response.status, errorText);
      
      if (response.status === 503 || response.status === 429 || response.status === 502 || response.status === 504) {
        throw new Error('The AI server is temporarily busy processing other resumes. Please wait 15 seconds and try again (this is a temporary server delay and does not count towards your daily analysis limit).');
      }
      
      throw new Error(`Groq API error (${response.status}): ${errorText.substring(0, 200)}`);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || '';

    if (!text) {
      throw new Error('Empty response from Groq');
    }

    return {
      content: text,
      provider: 'groq',
    };
  }

  // Fallback / standard path (Anthropic proxy or direct Anthropic)
  const isFree = provider !== 'claude';
  
  // For Pro plan ('claude'), use direct Anthropic if key is supplied. Otherwise, fall back to Veritas (Claude Sonnet).
  const useDirectAnthropic = !isFree && !!PRO_API_KEY;
  
  const baseUrl = useDirectAnthropic ? PRO_BASE_URL : FREE_BASE_URL;
  const apiKey = useDirectAnthropic ? PRO_API_KEY : FREE_API_KEY;
  const model = useDirectAnthropic ? PRO_MODEL : FREE_MODEL;
  const maxTokens = useDirectAnthropic ? 4096 : FREE_MAX_TOKENS;
  const temperature = useDirectAnthropic ? 0.7 : FREE_TEMPERATURE;

  if (!apiKey) {
    throw new Error(
      useDirectAnthropic
        ? 'Pro tier API key (ANTHROPIC_API_KEY) is not configured'
        : 'Veritas API key (VERITAS_LLM_API_KEY) is not configured'
    );
  }

  // Split system message from conversation messages (Anthropic format)
  const systemMessage = messages.find((m) => m.role === 'system');
  const nonSystemMessages = messages.filter((m) => m.role !== 'system');

  const body: Record<string, unknown> = {
    model,
    max_tokens: maxTokens,
    temperature,
    messages: nonSystemMessages.map((m) => ({
      role: m.role,
      content: m.content,
    })),
  };

  if (systemMessage) {
    body.system = systemMessage.content;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 18000);

    const response = await fetch(`${baseUrl}/v1/messages`, {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`AI API error [${provider}/${model}]:`, response.status, errorText);
      throw new Error(`AI API error (${response.status}): ${errorText.substring(0, 200)}`);
    }

    const data = await response.json();

    // Anthropic messages format: data.content[0].text
    const text =
      data.content?.[0]?.text ||
      data.choices?.[0]?.message?.content || // OpenAI compat fallback
      '';

    if (!text) {
      throw new Error('Empty response from AI');
    }

    return {
      content: text,
      provider: isFree ? 'groq' : 'claude',
    };
  } catch (err: unknown) {
    if (provider === 'groq') {
      throw err;
    }

    console.warn('[AI client] Claude Sonnet request failed or timed out after 18s. Falling back to Groq Llama 3.3...', err);
    
    if (GROQ_API_KEY) {
      try {
        return await callAI(messages, 'groq');
      } catch (fallbackErr) {
        console.error('[AI client] Groq fallback failed as well:', fallbackErr);
        throw fallbackErr;
      }
    }
    
    throw err;
  }
}

export function getAvailableProviders(): AIProvider[] {
  const providers: AIProvider[] = [];
  if (FREE_API_KEY) providers.push('groq');
  if (PRO_API_KEY) providers.push('claude');
  return providers;
}

export function getDefaultProvider(): AIProvider {
  if (FREE_API_KEY) return 'groq';
  if (PRO_API_KEY) return 'claude';
  return 'groq';
}
