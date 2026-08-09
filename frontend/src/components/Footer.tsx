
export default function Footer() {
  return (
    <footer className="border-t-[3px] border-double border-[var(--rule)] pt-8 md:pt-12 pb-6 mt-16 px-4 md:px-8 container mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-8 md:mb-12">
        
        {/* Column 1: The Publisher */}
        <div className="flex flex-col gap-3 md:gap-4 text-center md:text-left">
          <h4 className="font-serif font-black text-2xl tracking-tight text-[var(--ink)]">
            The Marok Gazette
          </h4>
          <p className="font-fell text-[1rem] text-[var(--muted)] leading-relaxed">
            A personal chronicle of art, code, and ambition. Published independently by Jagnoor Singh Marok. Dedicated to the pursuit of aesthetic and technical excellence.
          </p>
        </div>

        {/* Column 2: The Colophon */}
        <div className="flex flex-col gap-3 md:gap-4 text-center md:text-left">
          <h4 className="font-serif font-bold text-lg uppercase tracking-widest text-[var(--ink)] border-b border-[var(--ghost)] pb-2 inline-block mx-auto md:mx-0">
            Colophon
          </h4>
          <p className="font-fell text-[1rem] text-[var(--muted)] leading-relaxed">
            Typeset in <span className="text-[var(--ink)]">Playfair Display</span> and <span className="text-[var(--ink)]">IM Fell English</span>. 
            Engineered with modern web technologies, yet inspired by the ink and broadsheets of the 19th century. 
          </p>
        </div>

        {/* Column 3: Telegraph / Socials */}
        <div className="flex flex-col gap-3 md:gap-4 text-center md:text-left">
          <h4 className="font-serif font-bold text-lg uppercase tracking-widest text-[var(--ink)] border-b border-[var(--ghost)] pb-2 inline-block mx-auto md:mx-0">
            Telegraph
          </h4>
          <ul className="font-mono text-xs uppercase tracking-widest text-[var(--muted)] flex flex-col gap-4 mt-2">
            <li>
              <a href="https://github.com/JagnoorMarok" target="_blank" rel="noreferrer" className="hover:text-[var(--accent)] transition-colors flex justify-between border-b border-dotted border-[var(--ghost)] pb-1">
                <span>GitHub</span>
                <span>// Source</span>
              </a>
            </li>
            <li>
              <a href="https://linkedin.com/in/jagnoormarok" target="_blank" rel="noreferrer" className="hover:text-[var(--accent)] transition-colors flex justify-between border-b border-dotted border-[var(--ghost)] pb-1">
                <span>LinkedIn</span>
                <span>// Network</span>
              </a>
            </li>
            <li>
              <a href="https://instagram.com/jagnoormarok" target="_blank" rel="noreferrer" className="hover:text-[var(--accent)] transition-colors flex justify-between border-b border-dotted border-[var(--ghost)] pb-1">
                <span>Instagram</span>
                <span>// Visuals</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[var(--rule)] pt-6 flex flex-col md:flex-row justify-between items-center gap-2 md:gap-4 text-center md:text-left">
        <p className="font-mono text-[9px] md:text-[10px] tracking-[0.2em] uppercase text-[var(--ghost)]">
          Volume I — Established MMXXVI
        </p>
        <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-[var(--ghost)]">
          All Works © Jagnoor Singh Marok. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
