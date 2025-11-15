import { GoogleGenerativeAI } from '@google/generative-ai';
import { ERROR_MESSAGES } from '../utils/constants';

// ----------------------
// Config / globals
// ----------------------
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
let genAI = null;
let model = null;
let selectedModelName = null;

// Preferred model candidates (order = preferred -> fallback)
const PREFERRED_MODELS = [
  'gemini-2.5-pro',
  'gemini-2.5-flash',
  'gemini-1.5-pro',
  'gemini-1.5',
];

// Rate limiting (simple client-side)
let lastCallTime = 0;
const RATE_LIMIT_MS = 2000; // 2s between calls
const checkRateLimit = () => {
  const now = Date.now();
  if (now - lastCallTime < RATE_LIMIT_MS) return false;
  lastCallTime = now;
  return true;
};

// ----------------------
// Basic utilities
// ----------------------
const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

/**
 * requestWithRetry
 * Generic wrapper to run an async function with retries, exponential backoff + jitter, and per-attempt timeout.
 * fn is called as fn({ signal }) so callers can support AbortSignal (if SDK supports it).
 */
async function requestWithRetry(fn, {
  retries = 3,
  baseDelay = 500,
  maxDelay = 8000,
  timeoutMs = 12000,
  onRetry = () => {}
} = {}) {
  let attempt = 0;

  while (attempt <= retries) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const result = await fn({ signal: controller.signal });
      clearTimeout(timeoutId);
      return result;
    } catch (err) {
      clearTimeout(timeoutId);

      const msg = String(err?.message || err);
      const status = err?.status || err?.code || (err?.response && err.response.status);
      const retriable = /503|overload|temporar|timeout|ETIMEDOUT/i.test(msg) || status === 503 || status === 429;

      if (!retriable) throw err;

      if (attempt === retries) throw err;

      attempt += 1;
      try { onRetry(attempt, err); } catch (_) {}

      // exponential backoff + jitter
      const exp = Math.min(maxDelay, baseDelay * (2 ** (attempt - 1)));
      const jitter = Math.floor(Math.random() * baseDelay);
      const delay = exp + jitter;
      await sleep(delay);
      // continue loop
    }
  }
}

// ----------------------
// Initialization
// ----------------------
if (apiKey && apiKey !== 'your_api_key_here') {
  try {
    genAI = new GoogleGenerativeAI(apiKey);
    // We'll defer selecting the exact model until runtime (ensureModel)
  } catch (err) {
    console.error('Failed to initialize GoogleGenerativeAI:', err);
  }
}

/**
 * List available models via REST ListModels (falls back if SDK does not expose it).
 * Returns array of model names (strings) or [] on failure.
 */
async function listAvailableModels() {
  if (!apiKey) return [];
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(apiKey)}`;
    const res = await fetch(url, { method: 'GET', headers: { Accept: 'application/json' } });
    if (!res.ok) {
      // Non-fatal: return empty and let ensureModel try preferred names
      console.warn('ListModels failed:', res.status, await res.text());
      return [];
    }
    const json = await res.json();
    const models = json?.models || [];
    // Normalize to simple names
    return models.map(m => m.name || m.model || '').filter(Boolean);
  } catch (err) {
    console.warn('Failed to call ListModels:', err);
    return [];
  }
}

/**
 * Probe a model quickly to confirm it supports generateContent and is available.
 * Returns true if probe succeeded, false otherwise.
 */
async function probeModel(modelInstance) {
  try {
    const probe = await requestWithRetry(
      ({ signal }) => modelInstance.generateContent('Hi.', { signal }),
      { retries: 1, baseDelay: 300, timeoutMs: 5000 }
    );
    return !!probe?.response;
  } catch (err) {
    return false;
  }
}

/**
 * Ensure we have a usable model instance stored in `model`.
 * Tries preferred candidates first, then ListModels as a fallback.
 */
export async function ensureModel() {
  if (model && selectedModelName) return model;
  if (!genAI) throw new Error('AI not initialized (missing API key?)');

  // Try preferred models first (cheap, avoids external list call)
  for (const candidate of PREFERRED_MODELS) {
    try {
      const inst = genAI.getGenerativeModel({ model: candidate });
      const ok = await probeModel(inst);
      if (ok) {
        model = inst;
        selectedModelName = candidate;
        return model;
      }
    } catch (err) {
      // ignore and try next
      console.info(`Model candidate ${candidate} probe failed:`, err?.message || err);
    }
  }

  // Fallback: call ListModels and try to find a matching model
  const available = await listAvailableModels();
  if (available.length) {
    for (const pref of PREFERRED_MODELS) {
      const found = available.find(n => n.includes(pref));
      if (found) {
        try {
          const inst = genAI.getGenerativeModel({ model: found });
          const ok = await probeModel(inst);
          if (ok) {
            model = inst;
            selectedModelName = found;
            return model;
          }
        } catch (err) {
          console.info(`Probe failed for listed model ${found}:`, err?.message || err);
        }
      }
    }

    // As a last resort, try whichever model name appears first in the list
    for (const name of available) {
      try {
        const inst = genAI.getGenerativeModel({ model: name });
        const ok = await probeModel(inst);
        if (ok) {
          model = inst;
          selectedModelName = name;
          return model;
        }
      } catch (err) {
        // continue
      }
    }
  }

  throw new Error('No available models found that support generateContent for this API key/account.');
}

// ----------------------
// Helpers to safely extract text from SDK response
// ----------------------
function extractTextFromResult(result) {
  try {
    const response = result?.response;
    if (!response) return '';
    if (typeof response.text === 'function') return response.text().trim();
    // some SDKs may provide response.outputText or similar
    if (typeof response.outputText === 'string') return response.outputText.trim();
    if (typeof result?.output === 'string') return result.output.trim();
    return String(response || '').trim();
  } catch (err) {
    return '';
  }
}

// ----------------------
// Core exported functions (suggestSkills, generateSummary, improveBullet)
// Each uses ensureModel + requestWithRetry and handles 503/429 with retries.
// ----------------------
export const suggestSkills = async (targetRole, existingSkills = []) => {
  if (!apiKey) {
    return { success: false, error: 'AI service not configured. Please add your Gemini API key to the .env file.' };
  }

  if (!targetRole || !targetRole.trim()) {
    return { success: false, error: ERROR_MESSAGES.AI.NO_TARGET_ROLE };
  }

  if (!checkRateLimit()) {
    return { success: false, error: ERROR_MESSAGES.AI.RATE_LIMIT };
  }

  try {
    await ensureModel();

    const existingSkillsList = existingSkills.flatMap(cat => cat.items || []).join(', ');

    const prompt = `Generate a list of 10-15 relevant technical and professional skills for a ${targetRole} position.\n` +
      `Focus on current industry-standard skills, tools, and technologies.\n` +
      `${existingSkillsList ? `Exclude these skills already present: ${existingSkillsList}` : ''}\n` +
      `Return ONLY a valid JSON array of skill names, no explanation or additional text.\n` +
      `Format: ["skill1", "skill2", "skill3"]`;

    const genResult = await requestWithRetry(
      ({ signal }) => model.generateContent(prompt, { signal }),
      { retries: 4, baseDelay: 600, timeoutMs: 12000, onRetry: (a, e) => console.warn('generateSummary retry', a, e?.message || e) }
    );

    const text = extractTextFromResult(genResult);
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return { success: false, error: ERROR_MESSAGES.AI.INVALID_RESPONSE };

    let skills;
    try { skills = JSON.parse(jsonMatch[0]); } catch (err) { return { success: false, error: ERROR_MESSAGES.AI.INVALID_RESPONSE }; }

    if (!Array.isArray(skills) || skills.length === 0) return { success: false, error: ERROR_MESSAGES.AI.INVALID_RESPONSE };

    return { success: true, skills: skills.map(s => (typeof s === 'string' ? s.trim() : String(s))).filter(Boolean) };
  } catch (err) {
    console.error('Error generating skill suggestions:', err);
    return { success: false, error: ERROR_MESSAGES.AI.FAILED };
  }
};

export const generateSummary = async (personalInfo, experience, education, targetRole) => {
  if (!apiKey) {
    return { success: false, error: 'AI service not configured. Please add your Gemini API key to the .env file.' };
  }

  if (!targetRole || !targetRole.trim()) return { success: false, error: ERROR_MESSAGES.AI.NO_TARGET_ROLE };
  if ((!experience || experience.length === 0) && (!education || education.length === 0)) return { success: false, error: 'Please add at least one experience or education entry first' };
  if (!checkRateLimit()) return { success: false, error: ERROR_MESSAGES.AI.RATE_LIMIT };

  try {
    await ensureModel();

    let experienceContext = '';
    if (experience && experience.length) {
      experienceContext = experience.map(exp => `- ${exp.position} at ${exp.company} (${exp.startDate} to ${exp.endDate || 'present'})`).join('\n');
    }

    let educationContext = '';
    if (education && education.length) {
      educationContext = education.map(edu => `- ${edu.degree} in ${edu.field} from ${edu.institution}`).join('\n');
    }

    const prompt = `Write a professional resume summary (3-4 sentences) for a ${targetRole} with the following background:\n` +
      `${experienceContext ? `Experience:\n${experienceContext}\n` : ''}` +
      `${educationContext ? `Education:\n${educationContext}\n` : ''}` +
      `The summary should:\n- Highlight years of experience and key expertise\n- Emphasize relevant achievements and strengths\n- Target the ${targetRole} position\n- Be concise and impactful (max 500 characters)\n- Use strong action verbs\n- Sound professional and confident\n`;

    const genResult = await requestWithRetry(
      ({ signal }) => model.generateContent(prompt, { signal }),
      { retries: 4, baseDelay: 600, timeoutMs: 12000, onRetry: (a, e) => console.warn('generateSummary retry', a, e?.message || e) }
    );

    const text = extractTextFromResult(genResult);
    const cleanSummary = text.replace(/^['"]|['"]$/g, '').trim();
    if (!cleanSummary || cleanSummary.length < 30) return { success: false, error: ERROR_MESSAGES.AI.INVALID_RESPONSE };

    return { success: true, summary: cleanSummary };
  } catch (err) {
    console.error('Error generating summary:', err);

    // If it's a 404 for a model, provide clearer message
    const msg = String(err?.message || err);
    if (/404|not found/i.test(msg)) return { success: false, error: 'Requested model not found for your account/API version.' };
    if (/503|overload|temporar/i.test(msg)) return { success: false, error: 'Model is busy. Please try again later.' };

    return { success: false, error: ERROR_MESSAGES.AI.FAILED };
  }
};

// export const improveBullet = async (bulletText, position, targetRole) => {
//   if (!apiKey) return { success: false, error: 'AI service not configured. Please add your Gemini API key to the .env file.' };
//   if (!bulletText || !bulletText.trim()) return { success: false, error: 'Bullet point text is required' };
//   if (!checkRateLimit()) return { success: false, error: ERROR_MESSAGES.AI.RATE_LIMIT };

//   try {
//     await ensureModel();

//     const prompt = `Improve this resume bullet point for a ${position || 'professional'} targeting a ${targetRole || 'similar'} role:\n\n` +
//       `Original: "${bulletText}"\n\n` +
//       `Make it more impactful by:\n- Starting with a strong action verb\n- Adding quantifiable metrics if implied (use realistic estimates like percentages, numbers, timeframes)\n- Highlighting the impact/result\n- Keeping it concise (max 150 characters)\n- Making it ATS-friendly with relevant keywords\n- Using professional language\n\nReturn ONLY the improved bullet point, no explanation, quotation marks, or additional text.`;

//     const genResult = await requestWithRetry(
//       ({ signal }) => model.generateContent(prompt, { signal }),
//       { retries: 4, baseDelay: 600, timeoutMs: 12000, onRetry: (a, e) => console.warn('improveBullet retry', a, e?.message || e) }
//     );

//     const text = extractTextFromResult(genResult);
//     // const cleanText = text.replace(/^['"]|['"]$/g, '').trim();
//     if (!text || text.length < 10) return { success: false, error: ERROR_MESSAGES.AI.INVALID_RESPONSE };

//     return { success: true, improvedText: text };
//   } catch (err) {
//     console.error('Error improving bullet point:', err);

//     const msg = String(err?.message || err);
//     if (/404|not found/i.test(msg)) return { success: false, error: 'Requested model not found for your account/API version.' };
//     if (/503|overload|temporar/i.test(msg)) return { success: false, error: 'Model is busy. Please try again later.' };

//     return { success: false, error: ERROR_MESSAGES.AI.FAILED };
//   }
// };

export const isAIConfigured = () => !!apiKey && !!genAI;
