#!/usr/bin/env node

/**
 * Universal 24/7 Multi-Provider Free-Tier AI Dispatcher
 * 
 * Automatically routes AI completion requests across free-tier providers:
 *   1. Google AI Studio (Gemini 2.5 Flash / Pro)
 *   2. Groq (Llama 3.3 70B / DeepSeek R1 at 800 tok/s)
 *   3. OpenRouter Free Endpoints (:free)
 *   4. Cerebras (Llama 3.3 at 2000 tok/s)
 * 
 * If a model hits a 429 rate limit or 503 spike, it seamlessly and
 * silently rotates to the next healthy free model. Your agents run 24/7.
 */

import fs from 'fs';
import path from 'path';

function loadEnv() {
  const envPaths = [
    path.join(process.cwd(), '.env'),
    'C:\\agent-second-brain\\.env',
    path.join(process.env.USERPROFILE || '', '.env')
  ];
  for (const envPath of envPaths) {
    if (fs.existsSync(envPath)) {
      const lines = fs.readFileSync(envPath, 'utf8').split('\n');
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const eqIdx = trimmed.indexOf('=');
        if (eqIdx !== -1) {
          const key = trimmed.substring(0, eqIdx).trim();
          const val = trimmed.substring(eqIdx + 1).trim();
          if (!process.env[key]) process.env[key] = val;
        }
      }
    }
  }
}

loadEnv();

const REGISTRY_PATH = path.join(process.cwd(), 'config', 'model-registry.json');

function getRegistry() {
  if (fs.existsSync(REGISTRY_PATH)) {
    try { return JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8')); } catch (e) {}
  }
  return null;
}

async function callGoogle(model, prompt, options = {}) {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY missing');

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: options.temperature || 0.2,
        maxOutputTokens: options.maxTokens || 2048
      }
    })
  });

  if (!res.ok) {
    throw new Error(`Google API error ${res.status}: ${await res.text()}`);
  }

  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

async function callOpenAiCompatible(baseUrl, apiKey, model, prompt, options = {}) {
  const endpoint = `${baseUrl.replace(/\/$/, '')}/chat/completions`;
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: prompt }],
      temperature: options.temperature || 0.2,
      max_tokens: options.maxTokens || 2048
    })
  });

  if (!res.ok) {
    throw new Error(`Provider API error ${res.status}: ${await res.text()}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || '';
}

export async function queryAiWithFallback(prompt, options = {}) {
  const tierName = options.tier || 'balanced';
  const registry = getRegistry();

  const tier = registry?.tiers?.[tierName] || {
    primary: { provider: 'google', model: 'gemini-2.5-flash' },
    fallbacks: [
      { provider: 'google', model: 'gemini-flash-latest' },
      { provider: 'google', model: 'gemini-2.5-flash-lite' },
      { provider: 'groq', model: 'llama-3.3-70b-versatile' }
    ]
  };

  const candidateChain = [tier.primary, ...(tier.fallbacks || [])];

  for (const candidate of candidateChain) {
    const { provider, model } = candidate;
    try {
      if (provider === 'google' && (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY)) {
        return await callGoogle(model, prompt, options);
      } else if (provider === 'groq' && process.env.GROQ_API_KEY) {
        return await callOpenAiCompatible('https://api.groq.com/openai/v1', process.env.GROQ_API_KEY, model, prompt, options);
      } else if (provider === 'openrouter' && process.env.OPENROUTER_API_KEY) {
        return await callOpenAiCompatible('https://openrouter.ai/api/v1', process.env.OPENROUTER_API_KEY, model, prompt, options);
      } else if (provider === 'cerebras' && process.env.CEREBRAS_API_KEY) {
        return await callOpenAiCompatible('https://api.cerebras.ai/v1', process.env.CEREBRAS_API_KEY, model, prompt, options);
      }
    } catch (err) {
      console.warn(`⚠️ [AI BATTERY] ${provider}/${model} failed: ${err.message}. Rotating to next candidate...`);
    }
  }

  throw new Error(`All candidate AI models in tier '${tierName}' failed or credentials missing.`);
}

// CLI Test
if (process.argv[1]?.endsWith('ai-provider-battery.mjs')) {
  console.log('\n🔋 Testing 24/7 Multi-Provider Free-Tier Battery...');
  queryAiWithFallback('Say "24/7 Free AI Battery Operational" in 5 words', { tier: 'balanced' })
    .then(res => {
      console.log('✅ Response:', res.trim());
      console.log('✨ Battery test passed!\n');
    })
    .catch(err => {
      console.error('❌ Battery test failed:', err.message);
    });
}
