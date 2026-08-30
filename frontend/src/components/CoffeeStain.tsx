import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Props = {
  id: string;
  positionClass: string;
  secretMessage: React.ReactNode;
  alignSpill?: 'left' | 'right' | 'center' | 'bottom';
};

const TOTAL_STAINS = 8;

export default function CoffeeStain({ id, positionClass, secretMessage, alignSpill = 'center' }: Props) {
  const [spilled, setSpilled] = useState(false);
  const [foundCount, setFoundCount] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const foundStains = JSON.parse(localStorage.getItem('foundStains') || '[]');
    setFoundCount(foundStains.length);
    if (foundStains.includes(id)) {
      setIsVisible(false);
    }
  }, [id]);

  const handleSpill = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!spilled) {
      setSpilled(true);
      const foundStains = JSON.parse(localStorage.getItem('foundStains') || '[]');
      if (!foundStains.includes(id)) {
        foundStains.push(id);
        localStorage.setItem('foundStains', JSON.stringify(foundStains));
      }
      setFoundCount(foundStains.length);
    }
  };

  const alignmentClasses =
    alignSpill === 'right' ? 'right-0 top-1/2 -translate-y-1/2 origin-right' :
      alignSpill === 'left' ? 'left-0 top-1/2 -translate-y-1/2 origin-left' :
        alignSpill === 'bottom' ? 'left-1/2 -translate-x-1/2 top-0 origin-top' :
          'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 origin-center';

  if (!isVisible) return null;

  return (
    <div
      className={`absolute z-30 cursor-pointer no-print group ${positionClass}`}
      onClick={handleSpill}
      title="What's this?"
    >
      {/* The initial coffee ring */}
      <motion.div
        className="w-20 h-20 border-[3px] border-[#5c4033] dark:border-[#8b6b55] opacity-20 group-hover:opacity-40 transition-opacity duration-300 mix-blend-multiply dark:mix-blend-normal"
        style={{ borderRadius: '45% 55% 40% 60% / 55% 45% 60% 40%' }}
      />
      {/* Inner droplet */}
      <div
        className="absolute top-4 left-6 w-3 h-3 bg-[#5c4033] dark:bg-[#8b6b55] opacity-20 group-hover:opacity-40 rounded-full mix-blend-multiply dark:mix-blend-normal"
      />
      <div
        className="absolute bottom-2 right-4 w-2 h-2 bg-[#5c4033] dark:bg-[#8b6b55] opacity-10 group-hover:opacity-30 rounded-full mix-blend-multiply dark:mix-blend-normal"
      />

      {/* The Spill */}
      <AnimatePresence onExitComplete={() => setIsVisible(false)}>
        {spilled && (
          <motion.div
            initial={{ scale: 0, opacity: 0, rotate: -20 }}
            animate={{ scale: 1, opacity: 0.95, rotate: 0 }}
            className={`absolute ${alignmentClasses} w-72 h-64 bg-[#3a261c] dark:bg-[#2a1a12] flex items-center justify-center p-8 pointer-events-auto`}
            style={{
              borderRadius: '63% 37% 54% 46% / 47% 55% 45% 53%',
              boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)'
            }}
            onClick={(e) => {
              e.stopPropagation();
              setSpilled(false);
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-[#e8dfc8] font-serif text-center flex flex-col gap-3"
            >
              <div className="text-xl font-bold italic">Oops!</div>
              <div className="font-fell text-sm leading-relaxed text-[#c8bea6]">
                {secretMessage}
              </div>

              <div className="mt-2 pt-3 border-t border-[#8b6b55]/30">
                <div className="text-[9px] tracking-widest uppercase text-[#e8dfc8]">
                  Stain {foundCount} of {TOTAL_STAINS} found
                </div>
                {foundCount === TOTAL_STAINS && (
                  <div className="text-[10px] italic mt-1 text-[#e8dfc8]">
                    You've found all the secrets. True detective!
                  </div>
                )}
              </div>

              <div className="text-[9px] tracking-widest uppercase mt-1 opacity-50 cursor-pointer hover:opacity-100 transition-opacity">
                [ Click to clean up ]
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
