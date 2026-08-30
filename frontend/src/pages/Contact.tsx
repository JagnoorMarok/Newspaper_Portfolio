import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { API_BASE_URL } from '../config';
import SEO from '../components/SEO';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', type: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [links, setLinks] = useState({ instagram: '', linkedin: '', github: '' });

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/settings`)
      .then(res => res.json())
      .then(data => setLinks(data))
      .catch(err => console.error(err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    
    try {
      const res = await fetch(`${API_BASE_URL}/api/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: formData.name, 
          email: formData.email, 
          type: formData.type || 'General Inquiry', 
          content: formData.message 
        })
      });
      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', type: '', message: '' });
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <>
      <SEO title="Contact" description="Get in touch with Jagnoor Singh Marok." />
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className="container mx-auto px-8"
      >
        <div className="py-8 border-b-[3px] border-double border-[var(--ink)] mb-8">
          <h1 className="font-serif font-black text-4xl md:text-6xl lg:text-8xl tracking-[-0.03em] text-center uppercase">The Dispatch</h1>
          <div className="text-xs md:text-sm tracking-[0.2em] uppercase text-[var(--ink)] mt-4 text-center border-y border-[var(--ghost)] py-2 font-mono">
            Correspondence is welcomed. All enquiries receive a considered reply.
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-12 py-12">
          <div className="flex flex-col">
            <h2 className="font-serif font-bold text-3xl mb-8 border-b-2 border-[var(--rule)] pb-4">Submit a Correspondence</h2>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="text-[10px] tracking-[0.15em] uppercase font-bold">Full Name</label>
                <input 
                  type="text" 
                  id="name"
                  required
                  placeholder="Your name, as you would like to be addressed"
                  className="bg-[var(--paper)] border border-[var(--ghost)] p-3 font-mono text-sm outline-none focus:border-[var(--accent)] transition-colors duration-200"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-[10px] tracking-[0.15em] uppercase font-bold">Electronic Address</label>
                <input 
                  type="email" 
                  id="email"
                  required
                  placeholder="your@email.com"
                  className="bg-[var(--paper)] border border-[var(--ghost)] p-3 font-mono text-sm outline-none focus:border-[var(--accent)] transition-colors duration-200"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="type" className="text-[10px] tracking-[0.15em] uppercase font-bold">Nature of Enquiry</label>
                <select 
                  id="type"
                  required
                  className="bg-[var(--paper)] border border-[var(--ghost)] p-3 font-mono text-sm outline-none focus:border-[var(--accent)] transition-colors duration-200"
                  value={formData.type}
                  onChange={e => setFormData({ ...formData, type: e.target.value })}
                >
                  <option value="">— Please select —</option>
                  <option value="General Enquiry">General Enquiry</option>
                  <option value="Portrait Commission Request">Portrait Commission Request</option>
                  <option value="Collaboration Proposal">Collaboration Proposal</option>
                  <option value="Artwork Purchase / Auction">Artwork Purchase / Auction</option>
                  <option value="Academic / Technical">Academic / Technical</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="message" className="text-[10px] tracking-[0.15em] uppercase font-bold">Your Message</label>
                <textarea 
                  id="message"
                  required
                  rows={6}
                  placeholder="Please state your enquiry with as much detail as you deem necessary."
                  className="bg-[var(--paper)] border border-[var(--ghost)] p-3 font-mono text-sm outline-none focus:border-[var(--accent)] transition-colors duration-200 resize-y"
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={status === 'submitting'}
                className="btn-action primary self-start mt-4 px-8 py-3 tracking-widest text-[11px]"
              >
                {status === 'submitting' ? 'Transmitting...' : 'Transmit Correspondence →'}
              </button>
              
              {status === 'success' && (
                <div className="mt-4 p-4 border border-[var(--accent)] text-center text-sm font-fell text-[var(--accent)] bg-[var(--paper2)] animate-pulse">
                  Your message has been received and recorded. A reply shall be forthcoming in due course.
                </div>
              )}
            </form>
          </div>

          <div className="flex flex-col gap-0 border-t-2 md:border-t-0 md:border-l-2 border-[var(--rule)] md:pl-12 pt-8 md:pt-0">
            <h3 className="font-serif font-bold text-xl mb-4 border-b border-[var(--ghost)] pb-2">Points of Contact</h3>
            <p className="font-fell text-[0.95rem] leading-[1.6] text-[var(--muted)] mb-6">
              For matters requiring immediate attention, the following channels are available. All correspondence is treated with discretion.
            </p>
            
            <div className="text-[10px] tracking-[0.15em] uppercase text-[var(--ink)] font-bold mb-1">Institution:</div>
            <div className="font-fell text-[0.95rem] text-[var(--muted)] mb-4">Dr. B.R. Ambedkar NIT Jalandhar, Punjab</div>
            
            <div className="text-[10px] tracking-[0.15em] uppercase text-[var(--ink)] font-bold mb-1">Commission Turnaround:</div>
            <div className="font-fell text-[0.95rem] text-[var(--muted)] mb-4">Typically 2–4 weeks for portrait works</div>
            
            <div className="text-[10px] tracking-[0.15em] uppercase text-[var(--ink)] font-bold mb-1">External Profiles:</div>
            <div className="flex gap-3 mb-8 text-[0.8rem] tracking-wider text-[var(--accent)] font-bold underline decoration-[var(--ghost)] underline-offset-4">
              {links.instagram && <a href={links.instagram} target="_blank" rel="noreferrer" className="hover:text-[var(--ink)]">Instagram</a>}
              {links.linkedin && <a href={links.linkedin} target="_blank" rel="noreferrer" className="hover:text-[var(--ink)]">LinkedIn</a>}
              {links.github && <a href={links.github} target="_blank" rel="noreferrer" className="hover:text-[var(--ink)]">GitHub</a>}
            </div>
            
            <div className="border border-[var(--rule)] p-4 bg-[var(--paper2)]">
              <h3 className="font-serif font-bold text-base mb-2 border-b border-[var(--ghost)] pb-1">Note on Commissions</h3>
              <p className="font-fell text-[0.85rem] leading-[1.6] text-[var(--muted)]">
                Portrait commissions are accepted on a selective basis. References and prior work samples are available upon request. Pricing is determined by complexity and medium.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
