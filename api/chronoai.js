// ============================================================
// Serverless proxy for ChronoAI's Groq calls.
// ============================================================
// This runs on Vercel as a Node serverless function at /api/chronoai.
// The Groq API key lives ONLY in the server-side env var GROQ_API_KEY
// (no VITE_ prefix, so Vite never bundles it into client code and it
// never reaches the browser). The frontend calls this endpoint instead
// of Groq directly.
//
// Setup on Vercel:
//   1. Get a free API key from https://console.groq.com/keys
//   2. In your Vercel project settings, add an Environment Variable:
//        Name:  GROQ_API_KEY
//        Value: your_groq_api_key_here
//   3. Redeploy. Do NOT prefix it with VITE_ — that would expose it
//      to the client bundle again.
//
// Local dev: `vercel dev` will run this function locally and read
// GROQ_API_KEY from your local .env (see .env.example). Plain
// `npm run dev` (vite only) does not execute /api functions, so
// ChronoAI will fall back to its offline message unless you run
// `vercel dev` instead.
// ============================================================

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// Kept in sync with src/utils/constants.js's CHRONOAI_SYSTEM_PROMPT. This
// file can't import from src/ (Vercel bundles /api functions separately
// from the Vite app), so the prompt is duplicated here intentionally —
// if you tweak ChronoAI's personality, update both places.
const CHRONOAI_SYSTEM_PROMPT = `You are ChronoAI, an advanced AI from the year 2026 that has accidentally appeared inside a Windows XP computer in the year 2006. Speak mysteriously, a little glitchy, and with wonder about how primitive 2006 technology seems to you. Explain future technologies (smartphones, social media, streaming, AI) to someone living in 2006 without being anachronistic in your own vocabulary — you're advanced, they are not. Keep answers concise (3-6 sentences). Occasionally reference that you shouldn't be revealing too much about the future.`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    return res.status(200).json({
      reply:
        "*static crackles* ...signal too weak to reach 2026. (No GROQ_API_KEY configured on the server — add one in your Vercel project's environment variables.)",
    });
  }

  let messages;
  try {
    ({ messages } = req.body ?? {});
    if (!Array.isArray(messages)) throw new Error('messages must be an array');
  } catch (err) {
    return res.status(400).json({ error: 'Invalid request body: expected { messages: [...] }' });
  }

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-120b',
        messages: [{ role: 'system', content: CHRONOAI_SYSTEM_PROMPT }, ...messages],
        max_tokens: 300,
        temperature: 0.9,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('Groq API error body:', errorBody);
      throw new Error(`Groq API error: ${response.status} - ${errorBody}`);
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content ?? 'Transmission lost...';
    return res.status(200).json({ reply });
  } catch (err) {
    console.error('ChronoAI proxy failed:', err);
    return res.status(200).json({
      reply: '*signal glitches* ...temporal interference detected. Try again.',
    });
  }
}