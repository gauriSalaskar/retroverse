import { useState } from 'react';
import { motion } from 'framer-motion';
import { FAKE_FRIENDS, YM_STATUSES } from '../utils/constants';
import useSound from '../hooks/useSound';

const CANNED_REPLIES = [
  'lol yeah totally',
  'brb mom needs the pc',
  'did you do the homework??',
  'omg no way 😱',
  'add me on orkut!',
  'ttyl gtg',
];

/**
 * Messenger
 * Yahoo/MSN Messenger-style chat client: friend list with status icons,
 * a conversation panel with a typing indicator, canned auto-replies, and
 * the legendary "Buzz" button that shakes the whole screen.
 */
export default function Messenger() {
  const [activeFriend, setActiveFriend] = useState(FAKE_FRIENDS[0]);
  const [messages, setMessages] = useState({});
  const [draft, setDraft] = useState('');
  const [typing, setTyping] = useState(false);
  const [shake, setShake] = useState(false);
  const { play: playBuzz } = useSound('/src/assets/sounds/buzz.mp3', { volume: 0.4 });
  const { play: playNotify } = useSound('/src/assets/sounds/notify.mp3', { volume: 0.3 });

  const thread = messages[activeFriend.name] ?? [];

  const send = () => {
    if (!draft.trim()) return;
    const text = draft.trim();
    setMessages((prev) => ({
      ...prev,
      [activeFriend.name]: [...(prev[activeFriend.name] ?? []), { from: 'me', text }],
    }));
    setDraft('');
    setTyping(true);
    setTimeout(() => {
      const reply = CANNED_REPLIES[Math.floor(Math.random() * CANNED_REPLIES.length)];
      setMessages((prev) => ({
        ...prev,
        [activeFriend.name]: [...(prev[activeFriend.name] ?? []), { from: activeFriend.name, text: reply }],
      }));
      setTyping(false);
      playNotify();
    }, 1200);
  };

  const buzz = () => {
    playBuzz();
    setShake(true);
    // Buzz shakes the ENTIRE screen (per spec), not just this chat panel -
    // Messenger doesn't have a reference to the desktop root, so it asks
    // for a screen-wide shake via a custom window event that Desktop
    // listens for (see Desktop.jsx).
    window.dispatchEvent(new CustomEvent('retroverse:buzz'));
    setTimeout(() => setShake(false), 500);
  };

  return (
    <motion.div
      animate={shake ? { x: [0, -12, 12, -12, 12, 0] } : { x: 0 }}
      transition={{ duration: 0.5 }}
      className="flex font-tahoma text-sm h-72"
    >
      {/* Friend list */}
      <div className="w-32 bg-white border-r border-purpleNeon/30 overflow-y-auto">
        {FAKE_FRIENDS.map((f, i) => (
          <button
            key={f.name}
            onClick={() => setActiveFriend(f)}
            className={`w-full text-left px-2 py-2 flex items-center gap-1 border-b border-gray-100 ${
              activeFriend.name === f.name ? 'bg-yellow-100' : 'hover:bg-gray-50'
            }`}
          >
            <span className="text-lg">{f.avatar}</span>
            <div className="overflow-hidden">
              <p className="text-xs font-bold truncate">{f.name}</p>
              <p className="text-[10px] text-gray-500 truncate">{YM_STATUSES[i % YM_STATUSES.length]}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Chat panel */}
      <div className="flex-1 flex flex-col bg-yellow-50">
        <div className="bg-purpleNeon text-white px-2 py-1 flex justify-between items-center text-xs font-bold">
          <span>
            {activeFriend.avatar} {activeFriend.name}
          </span>
          <button onClick={buzz} className="bg-orangeHighlight text-white px-2 py-0.5 rounded text-[10px]">
            ⚡ BUZZ!
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {thread.map((m, i) => (
            <p key={i} className={m.from === 'me' ? 'text-right' : 'text-left'}>
              <span
                className={`inline-block px-2 py-1 rounded text-xs ${
                  m.from === 'me' ? 'bg-skyBlue text-white' : 'bg-white border border-gray-300'
                }`}
              >
                {m.text}
              </span>
            </p>
          ))}
          {typing && <p className="text-[10px] text-gray-500 italic">{activeFriend.name} is typing...</p>}
        </div>
        <div className="flex border-t border-gray-300">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
            placeholder="Type a message... :)"
            className="flex-1 px-2 py-1.5 text-xs focus:outline-none"
          />
          <button onClick={send} className="bg-xpBlue text-white px-3 text-xs font-bold">
            Send
          </button>
        </div>
      </div>
    </motion.div>
  );
}
