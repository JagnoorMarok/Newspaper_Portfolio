import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE_URL } from '../config';
import SEO from '../components/SEO';

// Example Mock SVG
const MockSketch = () => (
  <svg viewBox="0 0 200 260" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto block">
    <defs>
      <filter id="sk"><feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale="1.5" xChannelSelector="R" yChannelSelector="G"/></filter>
    </defs>
    <g filter="url(#sk)" fill="none" stroke="#1a1008" strokeWidth="1.2" strokeLinecap="round">
      <ellipse cx="100" cy="95" rx="52" ry="68"/>
      <ellipse cx="100" cy="95" rx="52" ry="68" strokeWidth="0.4" stroke="#6b5f4a"/>
      <line x1="100" y1="163" x2="100" y2="195" strokeWidth="1.5"/>
      <ellipse cx="100" cy="220" rx="55" ry="42" strokeWidth="1.5"/>
      <circle cx="80" cy="82" r="4" fill="#1a1008" stroke="none"/>
      <circle cx="120" cy="82" r="4" fill="#1a1008" stroke="none"/>
      <path d="M87,108 Q100,118 113,108" strokeWidth="1"/>
    </g>
  </svg>
);

type Sketch = {
  id: string;
  title: string;
  category: string;
  description: string;
  medium: string;
  year: string;
  imageUrl: string;
  purchaseUrl: string;
}

export default function Gallery() {
  const [sketches, setSketches] = useState<Sketch[]>([]);
  const [filter, setFilter] = useState('all');
  const [selectedSketch, setSelectedSketch] = useState<Sketch | null>(null);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/sketches?limit=12`)
      .then(res => res.json())
      .then(res => {
        setSketches(res.data || []);
        setHasMore(res.hasMore || false);
      })
      .catch(err => console.error('Error fetching sketches:', err));
  }, []);

  const loadMore = () => {
    if (!sketches.length) return;
    const lastSketch = sketches[sketches.length - 1];
    fetch(`${API_BASE_URL}/api/sketches?limit=12&cursor=${lastSketch.id}`)
      .then(res => res.json())
      .then(res => {
        setSketches(prev => [...prev, ...(res.data || [])]);
        setHasMore(res.hasMore || false);
      })
      .catch(err => console.error('Error fetching more sketches:', err));
  };

  const filtered = sketches.filter(s => filter === 'all' || s.category === filter);

  return (
    <>
      <SEO title="Gallery" description="Explore the sketches and artwork of Jagnoor Singh Marok." />
      <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto"
    >
      <div className="p-8 border-b-2 border-[var(--rule)]">
        <h1 className="font-serif font-black text-5xl tracking-[-0.03em]">The Sketchbook</h1>
        <div className="text-[10px] tracking-[0.15em] uppercase text-[var(--muted)] mt-2">
          Original Pencil Works · Available for Acquisition · Updated Periodically
        </div>
      </div>
      
      <div className="flex overflow-x-auto no-scrollbar border-b border-[var(--rule)] px-4 md:px-8 w-full -mx-4 md:mx-0">
        {['all', 'portrait', 'landscape', 'figure'].map(cat => (
          <button 
            key={cat}
            onClick={() => setFilter(cat)}
            className={`whitespace-nowrap bg-transparent border-none border-r border-[var(--ghost)] px-4 md:px-6 py-3 font-mono text-[9px] md:text-[10px] tracking-[0.15em] uppercase cursor-pointer transition-colors duration-150 first:border-l hover:bg-[var(--ink)] hover:text-[var(--paper)] ${filter === cat ? 'bg-[var(--ink)] text-[var(--paper)]' : 'text-[var(--muted)]'}`}
          >
            {cat === 'all' ? 'All Works' : cat.charAt(0).toUpperCase() + cat.slice(1) + (cat === 'portrait' ? 's' : cat === 'landscape' ? 's' : ' Studies')}
          </button>
        ))}
      </div>

      <div className="columns-2 md:columns-3 gap-[1px] p-[1px] bg-[var(--rule)]">
        {filtered.map(sketch => (
          <div 
            key={sketch.id} 
            className="break-inside-avoid bg-[var(--paper)] mb-[1px] cursor-pointer relative overflow-hidden group"
            onClick={() => setSelectedSketch(sketch)}
          >
            <div className="w-full overflow-hidden bg-[var(--paper2)] flex items-center justify-center">
              {sketch.imageUrl === 'mock' ? <MockSketch /> : <img src={sketch.imageUrl} alt={sketch.title} loading="lazy" className="w-full block grayscale-[20%] contrast-[1.05] transition-all duration-300 group-hover:scale-105 group-hover:grayscale-0 group-hover:contrast-110 object-cover" />}
            </div>
            <div className="p-3 border-t border-[var(--ghost)]">
              <h4 className="font-serif font-bold text-sm mb-1">{sketch.title}</h4>
              <p className="text-[9px] tracking-[0.1em] uppercase text-[var(--muted)]">{sketch.medium} · {sketch.year}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="text-center p-8 border-t border-[var(--rule)]">
        <div className="text-[10px] tracking-[0.15em] uppercase text-[var(--muted)] mb-3">
          Showing {filtered.length} works
        </div>
        {hasMore && (
          <button onClick={loadMore} className="btn-action mx-auto">Load More Works</button>
        )}
      </div>

      <AnimatePresence>
        {selectedSketch && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-[2000] flex items-center justify-center"
            onClick={() => setSelectedSketch(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, rotate: -0.5 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0.95, rotate: -0.5 }}
              onClick={e => e.stopPropagation()}
              className="bg-[var(--paper)] max-w-[900px] w-[90vw] max-h-[90vh] overflow-auto border-[4px] border-[var(--ink)] flex flex-col"
            >
              <div className="p-4 md:p-6 border-b-[3px] border-double border-[var(--rule)] flex justify-between items-center">
                <div>
                  <div className="text-[9px] tracking-[0.15em] uppercase text-[var(--muted)] mb-1">
                    Original Work · From The Sketchbook
                  </div>
                  <h2 className="font-serif font-bold text-2xl">{selectedSketch.title}</h2>
                </div>
                <button 
                  className="bg-transparent border-none text-2xl cursor-pointer text-[var(--ink)] font-mono"
                  onClick={() => setSelectedSketch(null)}
                >✕</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr]">
                <div className="p-6 md:border-r border-[var(--rule)] flex items-center justify-center bg-[var(--paper2)]">
                  {selectedSketch.imageUrl === 'mock' ? <MockSketch /> : <img src={selectedSketch.imageUrl} className="w-full max-h-[500px] object-contain grayscale-[10%] contrast-[1.05]" />}
                </div>
                <div className="p-6">
                  <h3 className="font-serif italic text-lg mb-3 border-b border-[var(--ghost)] pb-2">{selectedSketch.title}</h3>
                  
                  <div className="text-[9px] tracking-[0.12em] uppercase text-[var(--ghost)] mb-1">Description</div>
                  <div className="font-fell italic text-sm text-[var(--muted)] mb-3">{selectedSketch.description || '—'}</div>
                  
                  <div className="text-[9px] tracking-[0.12em] uppercase text-[var(--ghost)] mb-1">Medium</div>
                  <div className="text-sm text-[var(--ink)] mb-3">{selectedSketch.medium || '—'}</div>
                  
                  <div className="text-[9px] tracking-[0.12em] uppercase text-[var(--ghost)] mb-1">Year</div>
                  <div className="text-sm text-[var(--ink)] mb-3">{selectedSketch.year || '—'}</div>
                  
                  <div className="flex flex-col gap-2 mt-4">
                    <a className="btn-action primary" href="#">↓ Download Image</a>
                    {selectedSketch.purchaseUrl && (
                      <a className="btn-action accent" href={selectedSketch.purchaseUrl} target="_blank">Enquire / Purchase ↗</a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
    </>
  );
}
