import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../components/SEO';
import CoffeeStain from '../components/CoffeeStain';
import { API_BASE_URL } from '../config';

// Mock Book SVG for placeholder covers
const MockBookCover = ({ title }: { title: string }) => (
  <svg viewBox="0 0 200 300" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto block bg-[#e8dfc8]">
    <defs>
      <filter id="bookNoise"><feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale="2" xChannelSelector="R" yChannelSelector="G"/></filter>
    </defs>
    <rect width="200" height="300" fill="var(--paper2)" filter="url(#bookNoise)" />
    <rect x="10" y="10" width="180" height="280" fill="none" stroke="var(--ink)" strokeWidth="2" strokeDasharray="5,5" />
    <text x="100" y="150" fontFamily="serif" fontSize="20" fontWeight="bold" fill="var(--ink)" textAnchor="middle" dominantBaseline="middle" transform="rotate(-15, 100, 150)">
      {title.length > 15 ? title.substring(0, 15) + '...' : title}
    </text>
  </svg>
);

type Book = {
  id: string;
  title: string;
  author: string;
  yearRead: string;
  rating: string;
  review: string;
  category: 'fiction' | 'non-fiction' | 'philosophy' | 'tech';
  imageUrl: string;
};

export default function Books() {
  const [filter, setFilter] = useState('all');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/books?limit=5`)
      .then(res => res.json())
      .then(res => {
        setBooks(res.data || []);
        setHasMore(res.hasMore || false);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch books", err);
        setLoading(false);
      });
  }, []);

  const loadMore = () => {
    if (!books.length) return;
    const lastBook = books[books.length - 1];
    fetch(`${API_BASE_URL}/api/books?limit=5&cursor=${lastBook.id}`)
      .then(res => res.json())
      .then(res => {
        setBooks(prev => [...prev, ...(res.data || [])]);
        setHasMore(res.hasMore || false);
      })
      .catch(err => console.error('Error fetching more books:', err));
  };

  const filtered = books.filter(b => filter === 'all' || b.category === filter);

  return (
    <>
      <SEO title="The Library" description="A collection of literary explorations and critical reviews by Jagnoor Singh Marok." />
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className="container mx-auto relative"
      >
        <CoffeeStain 
          id="stain-books"
          positionClass="-left-8 md:left-12 top-[20vh]"
          alignSpill="left"
          secretMessage={
            <>
              <span className="text-[#e8dfc8] font-bold">A mind needs books...</span>
            </>
          }
        />
        
        <div className="py-8 border-b-[3px] border-double border-[var(--ink)]">
          <h1 className="font-serif font-black text-4xl md:text-6xl lg:text-8xl tracking-[-0.03em] text-center uppercase">The Library</h1>
          <div className="text-xs md:text-sm tracking-[0.2em] uppercase text-[var(--ink)] mt-4 text-center border-y border-[var(--ghost)] py-2 font-mono">
            Literary Explorations · Critical Reviews · Continually Updated
          </div>
        </div>
        
        <div className="flex overflow-x-auto no-scrollbar border-b border-[var(--rule)] w-full mb-8">
          {['all', 'tech', 'philosophy', 'fiction', 'non-fiction'].map(cat => (
            <button 
              key={cat}
              onClick={() => setFilter(cat)}
              className={`whitespace-nowrap bg-transparent border-none border-r border-[var(--ghost)] px-4 md:px-6 py-3 font-mono text-[9px] md:text-[10px] tracking-[0.15em] uppercase cursor-pointer transition-colors duration-150 first:border-l hover:bg-[var(--ink)] hover:text-[var(--paper)] ${filter === cat ? 'bg-[var(--ink)] text-[var(--paper)]' : 'text-[var(--muted)]'}`}
            >
              {cat === 'all' ? 'Complete Catalog' : cat.replace('-', ' ')}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4 md:px-8 pb-12 pt-8">
          {loading ? (
            <div className="col-span-full py-12 flex flex-col items-center justify-center text-[var(--muted)]">
              <div className="w-8 h-8 border-[3px] border-[var(--ghost)] border-t-[var(--ink)] rounded-full animate-spin mb-4"></div>
              <span className="font-mono text-xs uppercase tracking-widest">Searching the archives...</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="col-span-full py-12 text-center text-[var(--muted)] border-y border-dashed border-[var(--ghost)]">
              <p className="font-serif italic text-lg mb-2">The shelves are empty here.</p>
              <p className="font-mono text-[10px] uppercase tracking-widest">Select another category or check back later.</p>
            </div>
          ) : (
            filtered.map(book => (
              <div 
                key={book.id} 
                className="bg-paper cursor-pointer relative group flex flex-col h-full border border-[var(--ghost)] hover:border-[var(--ink)] transition-colors duration-300 rounded-md overflow-hidden"
                onClick={() => setSelectedBook(book)}
              >
                <div className="w-full overflow-hidden bg-[var(--paper2)] flex items-center justify-center aspect-[2/3] border-b border-[var(--ghost)]">
                  {book.imageUrl === 'mock' ? (
                    <MockBookCover title={book.title} />
                  ) : (
                    <img src={book.imageUrl} alt={book.title} loading="lazy" className="w-full h-full object-cover grayscale contrast-[1.1] transition-all duration-300 group-hover:grayscale-0" />
                  )}
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <h4 className="font-serif font-bold text-lg leading-tight mb-1 group-hover:text-[var(--accent)] transition-colors">{book.title}</h4>
                  <p className="text-[11px] font-fell italic text-[var(--muted)] mb-3 flex-grow">by {book.author}</p>
                  <div className="flex justify-between items-center border-t border-[var(--ghost)] pt-2 mt-auto">
                    <span className="text-[9px] tracking-[0.1em] uppercase font-mono text-[var(--ink)]">Read: {book.yearRead}</span>
                    <span className="text-[10px] font-serif font-bold text-[var(--accent)]">{book.rating}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="text-center p-8 border-t border-[var(--rule)]">
          <div className="text-[10px] tracking-[0.15em] uppercase text-[var(--muted)] mb-3">
            Showing {filtered.length} volumes
          </div>
          {hasMore && filter === 'all' && (
            <button onClick={loadMore} className="btn-action mx-auto">Load More Volumes</button>
          )}
        </div>

        <div className="rule-ornament">— ✦ ✦ ✦ —</div>

        <AnimatePresence>
          {selectedBook && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 z-[2000] flex items-center justify-center p-4"
              onClick={() => setSelectedBook(null)}
            >
              <motion.div 
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                onClick={e => e.stopPropagation()}
                className="bg-paper max-w-[800px] w-full max-h-[90vh] overflow-auto border-[4px] border-[var(--ink)] flex flex-col rounded-md"
              >
                <div className="p-4 md:p-6 border-b-[3px] border-double border-[var(--rule)] flex justify-between items-start">
                  <div>
                    <div className="text-[9px] tracking-[0.15em] uppercase text-[var(--muted)] mb-2">
                      Literary Review · Vol. I
                    </div>
                    <h2 className="font-serif font-black text-3xl leading-none mb-1">{selectedBook.title}</h2>
                    <div className="font-fell italic text-lg text-[var(--muted)]">by {selectedBook.author}</div>
                  </div>
                  <button 
                    className="bg-transparent border-none text-2xl cursor-pointer text-[var(--ink)] font-mono hover:text-[var(--accent)] transition-colors p-2 -mr-2 -mt-2"
                    onClick={() => setSelectedBook(null)}
                  >✕</button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr]">
                  <div className="p-6 md:border-r border-[var(--rule)] flex flex-col items-center justify-start bg-[var(--paper2)]">
                    <div className="w-full max-w-[200px] aspect-[2/3] shadow-lg mb-6 border border-[var(--ghost)]">
                      {selectedBook.imageUrl === 'mock' ? (
                        <MockBookCover title={selectedBook.title} />
                      ) : (
                        <img src={selectedBook.imageUrl} className="w-full h-full object-cover contrast-[1.1]" />
                      )}
                    </div>
                    <div className="w-full border-t border-[var(--ghost)] pt-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[9px] tracking-[0.12em] uppercase text-[var(--muted)]">Rating</span>
                        <span className="font-serif font-bold text-lg text-[var(--accent)]">{selectedBook.rating}</span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[9px] tracking-[0.12em] uppercase text-[var(--muted)]">Read In</span>
                        <span className="font-mono text-[10px] text-[var(--ink)]">{selectedBook.yearRead}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] tracking-[0.12em] uppercase text-[var(--muted)]">Genre</span>
                        <span className="font-mono text-[10px] text-[var(--ink)] capitalize">{selectedBook.category.replace('-', ' ')}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 md:p-8 flex flex-col">
                    <h3 className="font-serif font-bold text-xl mb-4 border-b border-[var(--ghost)] pb-2">Editorial Review</h3>
                    <p className="font-fell text-[1.1rem] leading-[1.8] text-[var(--ink)] text-justify first-letter:text-5xl first-letter:font-serif first-letter:font-black first-letter:mr-2 first-letter:float-left first-letter:text-[var(--accent)]">
                      {selectedBook.review}
                    </p>
                    
                    <div className="mt-auto pt-8 flex justify-end">
                       <button 
                        className="bg-transparent border border-[var(--ink)] text-[var(--ink)] font-mono text-[10px] px-4 py-2 uppercase tracking-[0.1em] hover:bg-[var(--ink)] hover:text-[var(--paper)] transition-colors"
                        onClick={() => setSelectedBook(null)}
                      >
                        Close Volume
                      </button>
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
