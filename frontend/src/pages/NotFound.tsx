import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import SEO from '../components/SEO';
import CoffeeStain from '../components/CoffeeStain';

export default function NotFound() {
  const location = useLocation();

  return (
    <>
      <SEO 
        title="404 — Edition Not Found" 
        description="The requested broadsheet edition cannot be found in the archives." 
      />
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className="container mx-auto px-4 md:px-8 py-8 relative"
      >
        <CoffeeStain 
          id="stain-404"
          positionClass="right-4 md:right-16 top-32"
          alignSpill="left"
          secretMessage={<span className="text-[#e8dfc8] font-bold">Nothing to see here... keep moving, detective.</span>}
        />

        {/* Top Wire Notice */}
        <div className="border-b-[3px] border-double border-[var(--rule)] pb-6 mb-8 text-center">
          <div className="font-mono text-[10px] md:text-xs tracking-[0.25em] uppercase text-[var(--accent)] font-bold mb-2">
            ★ Special Bulletin · Gazette Telegraph Office · Dispatch No. 404 ★
          </div>
          <h1 className="font-serif font-black text-4xl md:text-7xl lg:text-8xl tracking-[-0.03em] uppercase text-[var(--ink)] my-3 leading-none">
            The Missing Edition
          </h1>
          <div className="font-fell italic text-base md:text-xl text-[var(--muted)] border-y border-[var(--ghost)] py-2 max-w-2xl mx-auto">
            Typesetters baffled as sought broadsheet vanishes without a trace from the printing archives.
          </div>
        </div>

        {/* Main Broadsheet Article & Notice */}
        <div className="grid grid-cols-1 md:grid-cols-[1.6fr_1fr] gap-8 md:gap-12 pb-12 border-b-2 border-[var(--rule)]">
          
          {/* Editorial Column */}
          <div className="flex flex-col gap-4 md:border-r md:border-[var(--rule)] md:pr-12">
            <div className="text-[10px] tracking-[0.15em] uppercase text-[var(--muted)] font-mono pb-2 border-b border-[var(--ghost)]">
              From the Desk of the Chief Archivist &nbsp;·&nbsp; Morning Edition
            </div>
            
            <p className="font-fell text-[1.1rem] leading-[1.8] text-justify text-[var(--ink)]">
              <span className="font-serif font-black text-6xl leading-[0.8] float-left mr-2 mt-1 text-[var(--accent)]">W</span>
              e deeply regret to inform our readership that the folio, communique, or dispatch you have requisitioned cannot be produced. Rumours circulating through the editorial offices suggest it may have fallen prey to a rogue compositor, been suppressed by editorial decree, or perhaps never existed beyond the ink-stained dreams of the midnight staff.
            </p>

            <p className="font-fell text-[1.05rem] leading-[1.8] text-[var(--muted)]">
              The wire service confirms no surviving copies bear the path you sought. Readers are earnestly advised to double-check their coordinates or retreat to verified editions before darkness overtakes the printing house.
            </p>

            <div className="mt-4 p-4 border border-dashed border-[var(--rule)] bg-[var(--paper2)] font-mono text-xs text-[var(--muted)]">
              <span className="text-[var(--ink)] font-bold uppercase tracking-wider block mb-1">
                // Last Recorded Transmission:
              </span>
              <code className="text-[var(--accent)] break-all select-all font-bold">
                {location.pathname}
              </code>
            </div>
          </div>

          {/* Public Notice & Navigation Box */}
          <div className="flex flex-col gap-6">
            <div className="border-[3px] border-double border-[var(--rule)] p-6 bg-[var(--paper2)]">
              <h3 className="font-serif font-bold text-xl uppercase tracking-widest text-[var(--ink)] border-b border-[var(--ghost)] pb-2 mb-4 text-center">
                Public Inquest & Wayfinding
              </h3>
              
              <p className="font-fell text-sm text-[var(--muted)] leading-relaxed mb-6">
                Lest you remain adrift among the misplaced archives, choose from the authorized branches of the Gazette below:
              </p>

              <div className="flex flex-col gap-3 font-mono text-xs">
                <Link 
                  to="/" 
                  className="btn-action primary text-center py-3 tracking-widest text-[11px]"
                >
                  ← Return to the Front Page
                </Link>

                <div className="grid grid-cols-2 gap-2 mt-2">
                  <Link 
                    to="/press" 
                    className="btn-action text-center py-2 text-[10px] tracking-wider"
                  >
                    The Press Room
                  </Link>
                  <Link 
                    to="/gallery" 
                    className="btn-action text-center py-2 text-[10px] tracking-wider"
                  >
                    Sketch Gallery
                  </Link>
                  <Link 
                    to="/books" 
                    className="btn-action text-center py-2 text-[10px] tracking-wider"
                  >
                    The Library
                  </Link>
                  <Link 
                    to="/contact" 
                    className="btn-action text-center py-2 text-[10px] tracking-wider"
                  >
                    Send Dispatch
                  </Link>
                </div>
              </div>
            </div>

            {/* Vintage Classified Snippet */}
            <div className="border border-[var(--rule)] p-4 text-center font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--ghost)]">
              Lost & Found: Item #404-NF · Contact the Telegraph desk if found.
            </div>
          </div>

        </div>
      </motion.div>
    </>
  );
}
