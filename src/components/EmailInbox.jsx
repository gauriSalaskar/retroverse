import { useState } from 'react';
import { SPAM_EMAILS } from '../utils/constants';

/**
 * EmailInbox
 * Outlook Express-style two-pane inbox (message list + reading pane)
 * full of classic mid-2000s spam. Opening an email fires onRead() once
 * to unlock the "Read Spam Email" achievement.
 */
export default function EmailInbox({ onRead }) {
  const [selected, setSelected] = useState(null);
  const [readIds, setReadIds] = useState([]);

  const openEmail = (email) => {
    setSelected(email);
    if (!readIds.includes(email.id)) {
      setReadIds((prev) => [...prev, email.id]);
      onRead?.();
    }
  };

  return (
    <div className="flex font-tahoma text-xs h-72">
      {/* Message list */}
      <div className="w-1/2 border-r border-gray-300 overflow-y-auto bg-white">
        {SPAM_EMAILS.map((email) => (
          <button
            key={email.id}
            onClick={() => openEmail(email)}
            className={`w-full text-left px-2 py-2 border-b border-gray-200 ${
              selected?.id === email.id ? 'bg-blue-100' : readIds.includes(email.id) ? 'bg-white' : 'bg-yellow-50'
            } hover:bg-blue-50`}
          >
            <p className={`truncate ${readIds.includes(email.id) ? 'font-normal' : 'font-bold'}`}>{email.subject}</p>
            <p className="text-gray-500 truncate">{email.from}</p>
          </button>
        ))}
      </div>

      {/* Reading pane */}
      <div className="w-1/2 p-2 bg-gray-50 overflow-y-auto">
        {selected ? (
          <>
            <p className="font-bold text-xpDarkBlue mb-1">{selected.subject}</p>
            <p className="text-gray-500 mb-2">From: {selected.from}</p>
            <p className="whitespace-pre-line text-gray-700">{selected.body}</p>
          </>
        ) : (
          <p className="text-gray-400 italic">Select an email to read it</p>
        )}
      </div>
    </div>
  );
}
