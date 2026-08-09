import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE_URL } from '../config';
import CoffeeStain from './CoffeeStain';

interface GuestbookEntry {
  id: string;
  name: string;
  message: string;
  createdAt: string;
}

interface GuestbookDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GuestbookDrawer({ isOpen, onClose }: GuestbookDrawerProps) {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchEntries();
    }
  }, [isOpen]);

  const fetchEntries = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/guestbook`);
      if (response.ok) {
        const data = await response.json();
        setEntries(data);
      }
    } catch (error) {
      console.error('Failed to fetch guestbook entries:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/guestbook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, message }),
      });

      if (response.ok) {
        setName('');
        setMessage('');
        fetchEntries();
      }
    } catch (error) {
      console.error('Failed to submit entry:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[var(--ink)]/20 backdrop-blur-sm z-40"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full md:w-[450px] bg-[var(--paper)] border-l border-[var(--rule)] shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            <CoffeeStain 
              id="stain-guestbook"
              positionClass="right-8 md:right-16 top-[40vh]"
              alignSpill="right"
              secretMessage={<span className="text-[#e8dfc8] font-bold">Please stop reading my diary.</span>}
            />
            {/* Header */}
            <div className="p-6 border-b-[3px] border-double border-[var(--rule)] flex justify-between items-center bg-[var(--paper)]">
              <div>
                <h2 className="font-serif font-black text-2xl tracking-tight text-[var(--ink)]">
                  Letters to the Editor
                </h2>
                <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-[var(--muted)] mt-1">
                  The Public Ledger
                </div>
              </div>
              <button 
                onClick={onClose}
                className="font-mono text-xs uppercase tracking-widest hover:text-[var(--accent)] transition-colors p-2"
              >
                [Close]
              </button>
            </div>

            {/* Content (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8">
              
              {/* Form */}
              <div className="border border-[var(--rule)] p-5 bg-[var(--paper2)]">
                <h3 className="font-serif font-bold text-lg mb-4 border-b border-[var(--ghost)] pb-2">
                  Pen a Letter
                </h3>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-widest text-[var(--muted)] mb-1">
                      Signatory Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full bg-transparent border-b border-dotted border-[var(--ink)] p-2 font-fell focus:outline-none focus:border-solid text-[1.1rem]"
                      placeholder="e.g. A Reader from London"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-widest text-[var(--muted)] mb-1">
                      Your Missive
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      rows={4}
                      className="w-full bg-transparent border border-dotted border-[var(--ink)] p-3 font-fell focus:outline-none focus:border-solid text-[1.1rem] resize-none"
                      placeholder="Share your thoughts upon these pages..."
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="self-start font-mono text-xs uppercase tracking-widest border border-[var(--rule)] px-4 py-2 hover:bg-[var(--ink)] hover:text-[var(--paper)] transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? 'Sending...' : 'Dispatch Letter'}
                  </button>
                </form>
              </div>

              {/* Entries */}
              <div className="flex flex-col gap-6">
                <h3 className="font-serif font-bold text-lg border-b-[3px] border-double border-[var(--rule)] pb-2 mb-2">
                  Recent Correspondence
                </h3>
                {entries.length === 0 ? (
                  <p className="font-fell italic text-[var(--muted)] text-center py-8">
                    The ledger is presently empty. Be the first to write.
                  </p>
                ) : (
                  entries.map((entry) => (
                    <div key={entry.id} className="flex flex-col gap-2">
                      <p className="font-fell text-[1.1rem] leading-relaxed text-[var(--ink)] whitespace-pre-wrap">
                        &ldquo;{entry.message}&rdquo;
                      </p>
                      <div className="flex justify-between items-end border-b border-dotted border-[var(--ghost)] pb-2">
                        <span className="font-serif font-bold italic text-sm text-[var(--muted)]">
                          — {entry.name}
                        </span>
                        <span className="font-mono text-[9px] uppercase tracking-widest text-[var(--ghost)]">
                          {new Date(entry.createdAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
