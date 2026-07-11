// ============================================================
// Grok API integration for ChronoAI
// ============================================================
// RetroVerse calls a small serverless proxy at /api/chronoai instead
// of talking to x.ai directly from the browser. The Grok API key lives
// server-side only (env var GROK_API_KEY, no VITE_ prefix), so it never
// ships in the client bundle. See api/chronoai.js for the proxy itself.
//
// Local dev note: plain `npm run dev` (vite only) does not run /api
// functions. Use `vercel dev` locally, or deploy to Vercel, to actually
// exercise the proxy. Without it, ChronoAI just shows its offline line.
// ============================================================

const CHRONOAI_ENDPOINT = '/api/chronoai';

/**
 * Sends the conversation to Grok (via the serverless proxy) and returns
 * ChronoAI's reply text.
 * @param {Array<{role: 'user'|'assistant', content: string}>} messages
 * @returns {Promise<string>}
 */
export async function askChronoAI(messages) {
  try {
    const response = await fetch(CHRONOAI_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      throw new Error(`ChronoAI proxy error: ${response.status}`);
    }

    const data = await response.json();
    return data.reply ?? 'Transmission lost...';
  } catch (err) {
    console.error('ChronoAI transmission failed:', err);
    return "*static crackles* ...signal too weak to reach 2026. (Couldn't reach the /api/chronoai proxy — make sure it's deployed and GROK_API_KEY is set.)";
  }
}
