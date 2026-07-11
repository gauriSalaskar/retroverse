import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { askChronoAI } from '../utils/grokApi';
import { FUTURE_TIMELINE } from '../utils/constants';

const SUGGESTED_QUESTIONS = [
  'Will Orkut survive?',
  'Will phones become smarter?',
  'Will cyber cafés still exist?',
  'What happens after 2020?',
];

// The three primary action buttons from the spec. Each sends a distinct
// kind of prompt to Grok rather than just repeating a suggested question.
const ACTION_BUTTONS = [
  {
    label: '🔮 Predict Future',
    prompt: 'Predict one specific, personal thing about how everyday life will change for someone living in 2006.',
  },
  {
    label: '❓ Ask About Future',
    prompt: () => SUGGESTED_QUESTIONS[Math.floor(Math.random() * SUGGESTED_QUESTIONS.length)],
  },
  {
    label: '⚙️ Generate Future Technology',
    prompt: 'Describe one piece of technology from your time (2026) that does not exist yet in 2006, in a way that would sound like science fiction to someone here.',
  },
];

const ENDING_TEXT = `Temporal instability detected.\n\nPlease do not reveal my existence.\n\nReturning user to 2006...`;

const INTRO_TEXT = `Hello.\n\nI am ChronoAI.\n\nI am an Artificial Intelligence from the year 2026.\n\nCurrent year detected:\n2006.`;

/**
 * ChronoAI
 * The desktop's "AI_2026.exe" wow-factor section. Completely swaps the
 * visual language to a neon cyberpunk theme (see .chrono-mode /
 * .chrono-panel / .chrono-glow in index.css) and lets the user chat with
 * an AI claiming to be from 2026, powered by the Grok API (src/utils/grokApi.js).
 *
 * After a handful of exchanges, onEnding() is called so the parent can
 * trigger the glitch-out transition back to the desktop.
 */
export default function ChronoAI({ onEnding, onOpenAchievement }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [ending, setEnding] = useState(false);
  const exchangeCount = useRef(0);
  const scrollRef = useRef(null);

  useEffect(() => {
    onOpenAchievement?.();
    const timeout = setTimeout(() => setShowIntro(false), 3200);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  const send = async (text) => {
    const question = (text ?? input).trim();
    if (!question || loading || ending) return;

    const nextMessages = [...messages, { role: 'user', content: question }];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);

    const reply = await askChronoAI(nextMessages);
    setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    setLoading(false);

    exchangeCount.current += 1;
    if (exchangeCount.current >= 5) {
      // Show the exact spec ending text for a beat before the parent's
      // glitch-transition closes this window and returns to the desktop.
      setEnding(true);
      setTimeout(() => onEnding?.(), 2600);
    }
  };

  const runAction = (action) => {
    const prompt = typeof action.prompt === 'function' ? action.prompt() : action.prompt;
    send(prompt);
  };

  return (
    <div className="chrono-mode font-trebuchet p-4 min-h-[420px]">
      {showIntro ? (
        <motion.pre
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="chrono-glow whitespace-pre-wrap text-center text-lg py-16 font-trebuchet"
        >
          {INTRO_TEXT}
        </motion.pre>
      ) : ending ? (
        <motion.pre
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0.4, 1] }}
          transition={{ duration: 1.2 }}
          className="chrono-glow whitespace-pre-wrap text-center text-lg py-16 font-trebuchet text-red-400"
        >
          {ENDING_TEXT}
        </motion.pre>
      ) : (
        <>
          {/* Future timeline strip */}
          <div className="chrono-panel p-2 mb-3 flex flex-wrap gap-3 justify-center text-xs">
            {FUTURE_TIMELINE.map((t) => (
              <div key={t.year} className="text-center">
                <p className="chrono-glow font-bold">{t.year}</p>
                <p className="text-chronoNeon/70 max-w-[110px]">{t.event}</p>
              </div>
            ))}
          </div>

          {/* Chat log */}
          <div ref={scrollRef} className="chrono-panel p-3 h-56 overflow-y-auto mb-3 space-y-2 text-sm">
            {messages.length === 0 && (
              <p className="text-chronoNeon/60 italic text-center mt-16">
                Ask me about the future. I probably shouldn't answer, but I will.
              </p>
            )}
            {messages.map((m, i) => (
              <p key={i} className={m.role === 'user' ? 'text-right' : 'text-left'}>
                <span
                  className={`inline-block px-3 py-1.5 rounded-lg max-w-[80%] ${
                    m.role === 'user' ? 'bg-chronoPurple/30 text-white' : 'chrono-glow bg-black/30'
                  }`}
                >
                  {m.content}
                </span>
              </p>
            ))}
            {loading && <p className="text-chronoNeon/60 text-xs italic">ChronoAI is transmitting across time...</p>}
          </div>

          {/* Primary action buttons */}
          <div className="grid grid-cols-3 gap-2 mb-2">
            {ACTION_BUTTONS.map((action) => (
              <button
                key={action.label}
                onClick={() => runAction(action)}
                disabled={loading}
                className="chrono-panel px-2 py-1.5 text-chronoNeon text-[11px] font-bold hover:bg-white/10 disabled:opacity-40"
              >
                {action.label}
              </button>
            ))}
          </div>

          {/* Suggested questions */}
          <div className="flex flex-wrap gap-2 mb-3">
            {SUGGESTED_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => send(q)}
                className="text-[11px] chrono-panel px-2 py-1 text-chronoNeon hover:bg-white/10"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              placeholder="Ask ChronoAI about the future..."
              className="flex-1 bg-black/40 border border-chronoNeon/40 rounded px-3 py-2 text-chronoNeon text-sm focus:outline-none focus:border-chronoNeon"
            />
            <button
              onClick={() => send()}
              className="chrono-panel px-4 text-chronoNeon font-bold text-sm hover:bg-white/10"
            >
              Transmit
            </button>
          </div>
        </>
      )}
    </div>
  );
}
