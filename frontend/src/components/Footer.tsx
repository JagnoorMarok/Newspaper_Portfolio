import { Link } from 'react-router-dom';
import CoffeeStain from './CoffeeStain';
import { Coffee, Lock } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export default function Footer() {
  const { settings } = useSettings();

  const formatUrl = (url: string) => {
    if (!url) return '';
    return /^https?:\/\//i.test(url) ? url : `https://${url}`;
  };

  const githubUrl = formatUrl(settings.github) || 'https://github.com/JagnoorMarok';
  const linkedinUrl = formatUrl(settings.linkedin) || 'https://linkedin.com/in/jagnoormarok';
  const instagramUrl = formatUrl(settings.instagram) || 'https://instagram.com/jagnoormarok';

  return (
    <footer className="border-t-[3px] border-double border-[var(--rule)] pt-8 md:pt-12 pb-6 mt-16 px-4 md:px-8 container mx-auto relative">
      <CoffeeStain 
        id="stain-footer"
        positionClass="left-8 md:left-32 bottom-20"
        alignSpill="left"
        secretMessage={<span className="text-[#e8dfc8] font-bold">I buried the treasure under the...</span>}
      />
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
              <a href={githubUrl} target="_blank" rel="noreferrer" className="hover:text-[var(--accent)] transition-colors flex justify-between border-b border-dotted border-[var(--ghost)] pb-1">
                <span>GitHub</span>
                <span>// Source</span>
              </a>
            </li>
            <li>
              <a href={linkedinUrl} target="_blank" rel="noreferrer" className="hover:text-[var(--accent)] transition-colors flex justify-between border-b border-dotted border-[var(--ghost)] pb-1">
                <span>LinkedIn</span>
                <span>// Network</span>
              </a>
            </li>
            <li>
              <a href={instagramUrl} target="_blank" rel="noreferrer" className="hover:text-[var(--accent)] transition-colors flex justify-between border-b border-dotted border-[var(--ghost)] pb-1">
                <span>Instagram</span>
                <span>// Visuals</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[var(--rule)] pt-6 flex flex-col md:flex-row justify-between items-center gap-2 md:gap-4 text-center md:text-left relative">
        <p className="font-mono text-[9px] md:text-[10px] tracking-[0.2em] uppercase text-[var(--ghost)]">
          Volume I — Established MMXXVI
        </p>
        <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-[var(--ghost)]">
          All Works © Jagnoor Singh Marok. All Rights Reserved.
        </p>

        <div className="flex md:absolute md:right-0 md:-top-4 items-center gap-2 mt-4 md:mt-0">
          <Link
            to="/admin"
            title="Editor's Desk (Ctrl + Shift + E)"
            aria-label="Editor's Desk"
            className="w-8 h-8 rounded-full border border-[var(--rule)] flex items-center justify-center text-[var(--ghost)] hover:text-[var(--ink)] hover:border-[var(--ink)] hover:bg-[var(--paper2)] transition-colors bg-[var(--paper)]"
          >
            <Lock size={12} />
          </Link>
          <button
            onClick={() => {
              localStorage.removeItem('foundStains');
              window.location.reload();
            }}
            title="Clean up all coffee stains"
            className="w-8 h-8 rounded-full border border-[var(--rule)] flex items-center justify-center text-[var(--ghost)] hover:text-[var(--ink)] hover:border-[var(--ink)] hover:bg-[var(--paper2)] transition-colors bg-[var(--paper)]"
          >
            <Coffee size={14} />
          </button>
        </div>
      </div>
    </footer>
  );
}
