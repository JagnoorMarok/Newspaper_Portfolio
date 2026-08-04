import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';

export default function Navbar() {
  const [date, setDate] = useState('');
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    setDate(today.toLocaleDateString('en-GB', options).toUpperCase());
    
    // Check initial theme
    if (document.body.classList.contains('dark')) {
      setIsDark(true);
    }
  }, []);

  const toggleDark = () => {
    document.body.classList.toggle('dark');
    setIsDark(!isDark);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b-2 border-[var(--rule)] bg-[var(--paper)] transition-colors duration-300">
      <div className="flex items-center justify-between px-4 md:px-8 py-2 border-b border-[var(--ghost)]">
        <span className="text-[10px] tracking-[0.15em] uppercase text-[var(--muted)] hidden md:block">
          {date}
        </span>
        <span className="font-serif font-black text-lg tracking-[-0.02em]">
          The Marok Gazette
        </span>
        <div className="flex gap-4 items-center">
          <button 
            onClick={toggleDark}
            className="bg-transparent border border-[var(--ink)] text-[var(--ink)] font-mono text-[10px] px-2.5 py-1 cursor-pointer tracking-[0.1em] uppercase transition-all duration-200 hover:bg-[var(--ink)] hover:text-[var(--paper)] flex items-center gap-1"
          >
            {isDark ? <Sun size={12} /> : <Moon size={12} />}
            {isDark ? 'Light' : 'Dark'}
          </button>
        </div>
      </div>
      <div className="flex justify-start md:justify-center overflow-x-auto border-t border-[var(--ghost)] no-scrollbar w-full">
        <NavButton to="/">Front Page</NavButton>
        <NavButton to="/gallery">Gallery</NavButton>
        <NavButton to="/blog">Bulletin</NavButton>
        <NavButton to="/contact">Dispatch</NavButton>
        <NavButton to="/admin">Editor's Room</NavButton>
      </div>
    </nav>
  );
}

function NavButton({ to, children }: { to: string, children: React.ReactNode }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => 
        `text-[9px] md:text-[10px] tracking-[0.1em] md:tracking-[0.18em] whitespace-nowrap uppercase text-[var(--ink)] no-underline px-4 md:px-6 py-2 border-r border-[var(--ghost)] transition-colors duration-150 font-mono first:border-l hover:bg-[var(--ink)] hover:text-[var(--paper)] flex-shrink-0 ${isActive ? 'bg-[var(--ink)] text-[var(--paper)]' : ''}`
      }
    >
      {children}
    </NavLink>
  );
}
