import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import SEO from '../components/SEO';

export default function NotFound() {
  const location = useLocation();

  return (
    <>
      <SEO 
        title="404 — Page Not Found" 
        description="The requested page cannot be found in the archives." 
      />
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className="container mx-auto px-4 min-h-[65vh] flex flex-col items-center justify-center text-center"
      >
        <div className="max-w-xl w-full mx-auto py-10 md:py-14 border-y-2 border-[var(--rule)]">
          <div className="font-mono text-[10px] md:text-xs tracking-[0.25em] uppercase text-[var(--muted)] mb-3">
            Special Bulletin · Dispatch No. 404
          </div>

          <div className="font-serif font-black text-8xl md:text-9xl text-[var(--accent)] tracking-tighter leading-none mb-3">
            404
          </div>

          <h1 className="font-serif font-bold text-2xl md:text-3xl tracking-tight text-[var(--ink)] uppercase mb-4">
            Edition Not Found
          </h1>

          <p className="font-fell text-lg md:text-xl text-[var(--muted)] leading-relaxed max-w-md mx-auto mb-4">
            The chronicle you requested cannot be located in the archives. It may have been retracted or never existed.
          </p>

          <div className="font-mono text-xs text-[var(--ink)] bg-[var(--paper2)] px-3 py-1.5 border border-[var(--ghost)] inline-block max-w-full break-all mb-8">
            <span className="text-[var(--muted)]">Missing folio: </span>
            <span className="text-[var(--accent)] font-semibold">{location.pathname}</span>
          </div>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/" className="btn-action primary px-6 py-2.5 text-xs tracking-wider">
              ← Return to Front Page
            </Link>
            <Link to="/press" className="btn-action px-6 py-2.5 text-xs tracking-wider">
              The Press Room
            </Link>
            <Link to="/contact" className="btn-action px-6 py-2.5 text-xs tracking-wider">
              Send Dispatch
            </Link>
          </div>
        </div>
      </motion.div>
    </>
  );
}
