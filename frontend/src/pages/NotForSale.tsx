import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

export default function NotForSale() {
  return (
    <>
      <SEO title="Not For Sale" description="This drawing is not available for sale." />
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className="container mx-auto px-8 min-h-[60vh] flex flex-col items-center justify-center text-center"
      >
        <div className="max-w-2xl mx-auto py-12 border-y-2 border-[var(--rule)]">
          <h1 className="font-serif font-black text-5xl md:text-6xl tracking-[-0.03em] mb-6 text-[var(--accent)]">
            Not Available
          </h1>
          <p className="font-fell text-xl text-[var(--muted)] mb-8 leading-relaxed">
            The artwork you are attempting to acquire is currently held in a private collection or has been retained by the artist, and is thus not available for sale.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/gallery" className="btn-action primary">
              ← Return to Gallery
            </Link>
            <Link to="/contact" className="btn-action">
              Request a Commission
            </Link>
          </div>
        </div>
      </motion.div>
    </>
  );
}
