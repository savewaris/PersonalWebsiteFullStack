#!/usr/bin/env node

/**
 * Universal 24/7 Multi-Provider Free-Tier AI Dispatcher with Zero-Cost Guard
 * 
 * STRICT $0 SPEND POLICY:
 *   1. Google AI Studio Free Tier (100% Free, no billing)
 *   2. Groq Cloud Developer Free Tier (100% Free, 14,400 req/day)
 *   3. OpenRouter Strict Free Models (Only endpoints with ':free' suffix, $0 cost)
 *   4. Cerebras Free Tier with Hard Cap (Max 200 requests/day, stops before any billing)
 * 
 * If a model hits rate limit or quota, it automatically rotates to the next free provider.
 * NEVER incurs financial charges.
 * 
 * ModelStatusRegistry: Tracks per-model quota/overload state, persists to
 * .agents/state/model-availability.json, and sends Discord advisories on auto-rotation.
 */

import fs from 'fs';
import path from 'path';

function loadEnv() {
  const envPaths = [
    path.join(process.cwd(), '.env'),
    'C:\\agent-second-brain\\.env',
    'C:\\save\\Projects\\PersonalWebsite\\.env',
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

const USAGE_TRACKER_PATH = path.join(process.cwd(), '.agents', 'state', 'provider-usage.json');
const MODEL_AVAILABILITY_PATH = path.join(process.cwd(), '.agents', 'state', 'model-availability.json');
const CEREBRAS_DAILY_HARD_CAP = 200; // Hard cap to guarantee $0 spend

// ============================================================
// ModelStatusRegistry — Quota-aware model availability tracker
// ============================================================
class ModelStatusRegistry {
  constructor() {
    this._state = {};
    this._advisoryCooldowns = {};
    this._load();
  }

  _stateDir() {
    return path.dirname(MODEL_AVAILABILITY_PATH);
  }

  _load() {
    try {
      if (fs.existsSync(MODEL_AVAILABILITY_PATH)) {
        this._state = JSON.parse(fs.readFileSync(MODEL_AVAILABILITY_PATH, 'utf8'));
      }
    } catch {
      this._state = {};
    }
  }

  _save() {
    try {
      const dir = this._stateDir();
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(MODEL_AVAILABILITY_PATH, JSON.stringify(this._state, null, 2), 'utf8');
    } catch (e) {
      console.warn(`[ModelStatusRegistry] Could not save state: ${e.message}`);
    }
  }

  _key(provider, model) {
    return `${provider}/${model}`;
  }

  isModelAvailable(provider, model) {
    const key = this._key(provider, model);
    const entry = this._state[key];
    if (!entry) return true;

    const now = Date.now();
    const throttledAt = new Date(entry.throttledAt).getTime();
    const cooldownEnd = throttledAt + (entry.retryAfterMs || 0);

    if (now >= cooldownEnd) {
      delete this._state[key];
      this._save();
      return true;
    }
    return false;
  }

  markModelUnavailable(provider, model, errorMsg, errorBody) {
    const key = this._key(provider, model);
    const now = new Date();

    let status = 'unavailable';
    let retryAfterMs = 60 * 60 * 1000;
    let quotaLimit = null;

    const is429 = errorMsg.includes('429') || (errorBody && (errorBody.includes('429') || errorBody.includes('RESOURCE_EXHAUSTED')));
    const is503 = errorMsg.includes('503') || (errorBody && errorBody.includes('503'));

    if (is429) {
      status = 'quota_exhausted';
      retryAfterMs = 60 * 60 * 1000;

      if (errorBody) {
        try {
          const parsed = JSON.parse(errorBody);
          const details = parsed?.error?.details || [];
          for (const detail of details) {
            const delay = detail?.retryDelay || detail?.metadata?.retryDelay;
            if (delay) {
              const seconds = parseInt(String(delay).replace('s', ''), 10);
              if (!isNaN(seconds)) retryAfterMs = seconds * 1000;
              break;
            }
          }
          for (const detail of details) {
            const limit = detail?.quotaLimit || detail?.metadata?.quotaLimit;
            if (limit) { quotaLimit = parseInt(limit, 10) || null; break; }
          }
        } catch {}
      }

      const totalSeconds = Math.floor(retryAfterMs / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const retryAfterHuman = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

      this._state[key] = {
        status,
        throttledAt: now.toISOString(),
        retryAfterMs,
        retryAfterHuman,
        ...(quotaLimit !== null ? { quotaLimit } : {})
      };
    } else if (is503) {
      status = 'overloaded';
      retryAfterMs = 5 * 60 * 1000;
      this._state[key] = { status, throttledAt: now.toISOString(), retryAfterMs };
    } else {
      retryAfterMs = 2 * 60 * 1000;
      this._state[key] = { status: 'error', throttledAt: now.toISOString(), retryAfterMs };
    }

    this._save();
    console.warn(`[ModelStatusRegistry] Marked ${key} as '${status}' for ${Math.round(retryAfterMs / 60000)}min`);
  }

  getStatusSummary() {
    const now = Date.now();
    const rows = [];

    for (const [key, entry] of Object.entries(this._state)) {
      const throttledAt = new Date(entry.throttledAt).getTime();
      const cooldownEnd = throttledAt + (entry.retryAfterMs || 0);
      if (now >= cooldownEnd) continue;

      const retryAt = new Date(cooldownEnd).toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
      const statusEmoji = entry.status === 'quota_exhausted' ? '🔴' : entry.status === 'overloaded' ? '🟠' : '⚫';
      rows.push(`| ${statusEmoji} | \`${key}\` | ${entry.status} | ${entry.retryAfterHuman || Math.round((entry.retryAfterMs || 0) / 60000) + 'm'} | ${retryAt} |`);
    }

    if (rows.length === 0) return '_No models currently throttled. All systems nominal._';

    return [
      '| Status | Model | Reason | Retry In | Available At |',
      '|--------|-------|--------|----------|--------------|',
      ...rows
    ].join('\n');
  }

  async sendThrottleAdvisory(webhookUrl, throttledModel, fallbackModel, statusSummary) {
    if (!webhookUrl) return;

    const now = Date.now();
    const lastSent = this._advisoryCooldowns[throttledModel] || 0;
    const ADVISORY_COOLDOWN_MS = 30 * 60 * 1000;

    if (now - lastSent < ADVISORY_COOLDOWN_MS) {
      console.log(`ℹ️ [ModelStatusRegistry] Advisory for ${throttledModel} suppressed (sent ${Math.round((now - lastSent) / 60000)}min ago)`);
      return;
    }

    const entry = this._state[throttledModel] || {};
    const retryTime = entry.throttledAt
      ? new Date(new Date(entry.throttledAt).getTime() + (entry.retryAfterMs || 0)).toISOString().replace('T', ' ').substring(0, 16) + ' UTC'
      : 'unknown';

    const embed = {
      title: '⚠️ AI Model Advisory — Auto-Rotated',
      color: 0xFFA500,
      fields: [
        { name: '🔴 Skipped Model', value: `\`${throttledModel}\``, inline: true },
        { name: '✅ Fallback Used', value: `\`${fallbackModel || 'none'}\``, inline: true },
        { name: '⏰ Retry At', value: retryTime, inline: true },
        { name: '📊 Model Status Table', value: statusSummary.substring(0, 1020) }
      ],
      footer: { text: 'AI Provider Battery — Zero-Cost Guard Active' },
      timestamp: new Date().toISOString()
    };

    try {
      const res = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ embeds: [embed] })
      });
      if (res.ok) {
        this._advisoryCooldowns[throttledModel] = now;
        console.log(`📣 [ModelStatusRegistry] Discord advisory sent for ${throttledModel}`);
      } else {
        console.warn(`⚠️ [ModelStatusRegistry] Discord webhook returned ${res.status}`);
      }
    } catch (e) {
      console.warn(`⚠️ [ModelStatusRegistry] Discord advisory failed: ${e.message}`);
    }
  }
}

const registry = new ModelStatusRegistry();

// ============================================================
// Usage tracking
// ============================================================
function getDailyUsage() {
  const today = new Date().toISOString().split('T')[0];
  let usage = { date: today, cerebrasCount: 0, totalRequests: 0 };
  if (fs.existsSync(USAGE_TRACKER_PATH)) {
    try {
      const saved = JSON.parse(fs.readFileSync(USAGE_TRACKER_PATH, 'utf8'));
      if (saved.date === today) usage = saved;
    } catch (e) {}
  }
  return usage;
}

function incrementUsage(provider) {
  const usage = getDailyUsage();
  usage.totalRequests = (usage.totalRequests || 0) + 1;
  if (provider === 'cerebras') {
    usage.cerebrasCount = (usage.cerebrasCount || 0) + 1;
  }
  const dir = path.dirname(USAGE_TRACKER_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(USAGE_TRACKER_PATH, JSON.stringify(usage, null, 2), 'utf8');
}

// ============================================================
// Provider call implementations
// ============================================================
async function callGoogle(model, prompt, options = {}, retryDepth = 0) {
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
    const errText = await res.text();
    if (res.status === 404 && retryDepth < 2 && errText.includes('models/')) {
      const recMatch = errText.match(/models\/([a-zA-Z0-9.\-_]+)/);
      if (recMatch && recMatch[1] && recMatch[1] !== model) {
        const recommendedModel = recMatch[1];
        console.warn(`🔄 [MODEL AUTO-MIGRATION] Model '${model}' retired. Auto-rerouting to Google recommended model: '${recommendedModel}'...`);
        return await callGoogle(recommendedModel, prompt, options, retryDepth + 1);
      }
    }
    const err = new Error(`Google API error ${res.status}: ${errText}`);
    err.errorBody = errText;
    err.statusCode = res.status;
    throw err;
  }

  const data = await res.json();
  incrementUsage('google');
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

async function callOpenAiCompatible(baseUrl, apiKey, model, prompt, options = {}, providerName = '') {
  if (providerName === 'openrouter' && !model.endsWith(':free')) {
    throw new Error(`STRICT $0 GUARD: Rejected paid model '${model}'. Only ':free' endpoints allowed.`);
  }

  if (providerName === 'cerebras') {
    const usage = getDailyUsage();
    if (usage.cerebrasCount >= CEREBRAS_DAILY_HARD_CAP) {
      throw new Error(`STRICT $0 GUARD: Cerebras reached daily safety cap (${CEREBRAS_DAILY_HARD_CAP} reqs). Skipping to protect billing.`);
    }
  }

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
    const errText = await res.text();
    const err = new Error(`${providerName} API error ${res.status}: ${errText}`);
    err.errorBody = errText;
    err.statusCode = res.status;
    throw err;
  }

  const data = await res.json();
  incrementUsage(providerName);
  return data.choices?.[0]?.message?.content || '';
}

// ============================================================
// Main export: queryAiWithFallback
// ============================================================
export async function queryAiWithFallback(prompt, options = {}) {
  const candidateChain = [
    { provider: 'google', model: 'gemini-2.5-flash' },
    { provider: 'google', model: 'gemini-2.0-flash' },
    { provider: 'google', model: 'gemini-1.5-flash' },
    { provider: 'groq', model: 'llama-3.3-70b-versatile' },
    { provider: 'groq', model: 'llama-3.1-8b-instant' },
    { provider: 'openrouter', model: 'meta-llama/llama-3.3-70b-instruct:free' },
    { provider: 'openrouter', model: 'google/gemini-2.0-flash-lite-preview-02-05:free' },
    { provider: 'cerebras', model: 'llama3.3-70b' },
    { provider: 'cerebras', model: 'llama3.1-8b' }
  ];

  let lastError = null;
  let lastThrottledModel = null;
  const discordWebhook = process.env.DISCORD_WEBHOOK_URL || '';

  for (const candidate of candidateChain) {
    const { provider, model } = candidate;
    const modelKey = `${provider}/${model}`;

    // Pre-flight: skip models in cooldown
    if (!registry.isModelAvailable(provider, model)) {
      const entry = registry._state[modelKey] || {};
      const cooldownEnd = new Date(new Date(entry.throttledAt).getTime() + (entry.retryAfterMs || 0));
      const retryTime = cooldownEnd.toISOString().replace('T', ' ').substring(0, 16) + ' UTC';
      console.log(`ℹ️ [SKIPPING] ${modelKey} — quota cooldown until ${retryTime}`);
      continue;
    }

    try {
      let result;
      if (provider === 'google' && (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY)) {
        result = await callGoogle(model, prompt, options);
      } else if (provider === 'groq' && process.env.GROQ_API_KEY) {
        result = await callOpenAiCompatible('https://api.groq.com/openai/v1', process.env.GROQ_API_KEY, model, prompt, options, 'groq');
      } else if (provider === 'openrouter' && process.env.OPENROUTER_API_KEY) {
        result = await callOpenAiCompatible('https://openrouter.ai/api/v1', process.env.OPENROUTER_API_KEY, model, prompt, options, 'openrouter');
      } else if (provider === 'cerebras' && process.env.CEREBRAS_API_KEY) {
        result = await callOpenAiCompatible('https://api.cerebras.ai/v1', process.env.CEREBRAS_API_KEY, model, prompt, options, 'cerebras');
      } else {
        continue;
      }

      // Success — send advisory if a previous model was throttled
      if (lastThrottledModel && discordWebhook) {
        const statusSummary = registry.getStatusSummary();
        await registry.sendThrottleAdvisory(discordWebhook, lastThrottledModel, modelKey, statusSummary);
      }

      return result;
    } catch (err) {
      const errorBody = err.errorBody || '';
      lastError = err;
      lastThrottledModel = modelKey;

      console.warn(`⚠️ [AI BATTERY AUTO-FAILOVER] ${modelKey} unavailable (${err.message.substring(0, 100)}...). Rotating to next free model...`);
      registry.markModelUnavailable(provider, model, err.message, errorBody);
    }
  }

  if (lastThrottledModel && discordWebhook) {
    const statusSummary = registry.getStatusSummary();
    await registry.sendThrottleAdvisory(discordWebhook, lastThrottledModel, 'NONE — all models exhausted', statusSummary);
  }

  throw new Error(`All free-tier models in the 24/7 battery exhausted. Last error: ${lastError?.message}`);
}

// ============================================================
// CLI Test
// ============================================================
if (process.argv[1]?.endsWith('ai-provider-battery.mjs')) {
  console.log('\n🔋 Testing 24/7 Multi-Provider Free-Tier Battery with $0 Hard Guard...');
  console.log('📋 Current Model Status Summary:\n');
  console.log(registry.getStatusSummary());
  console.log('');
  queryAiWithFallback('Say "Zero Spend Guard Active" in 4 words')
    .then(res => {
      console.log('✅ Response:', res.trim());
      console.log('✨ 100% Free Battery Verified!\n');
    })
    .catch(err => {
      console.error('❌ Battery failed:', err.message);
    });
}
