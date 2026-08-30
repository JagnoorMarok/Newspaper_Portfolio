import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';
import CoffeeStain from './CoffeeStain';

export default function Navbar() {
  const [date, setDate] = useState('');
  const [isDark, setIsDark] = useState(false);
  const [weather, setWeather] = useState('PUNJAB, IN — ...');
  const [volume, setVolume] = useState('Vol. I, No. 1');

  useEffect(() => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    setDate(today.toLocaleDateString('en-GB', options).toUpperCase());

    const start = new Date(today.getFullYear(), 0, 0);
    const diff = (today.getTime() - start.getTime()) + ((start.getTimezoneOffset() - today.getTimezoneOffset()) * 60 * 1000);
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    setVolume(`Vol. I, No. ${dayOfYear}`);

    fetch('https://api.open-meteo.com/v1/forecast?latitude=30.7333&longitude=76.7794&current=temperature_2m,weather_code&timezone=auto')
      .then(res => res.json())
      .then(data => {
        const temp = Math.round(data.current.temperature_2m);
        const code = data.current.weather_code;
        let conditions = 'Clear';
        if (code > 0 && code <= 3) conditions = 'Cloudy';
        if (code === 45 || code === 48) conditions = 'Hazy';
        if (code >= 51 && code <= 67) conditions = 'Rain';
        if (code >= 71 && code <= 77) conditions = 'Snow';
        if (code >= 95) conditions = 'Storms';
        setWeather(`PUNJAB, IN — ${conditions}, ${temp}°C`);
      })
      .catch(() => setWeather('PUNJAB, IN'));

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
      <CoffeeStain
        id="stain-nav"
        positionClass="left-1/2 md:left-1/3 top-2"
        alignSpill="bottom"
        secretMessage={<span className="text-[#e8dfc8] font-bold">Why is the rum gone?</span>}
      />
      <div className="flex items-center justify-between px-4 md:px-8 py-2 border-b border-[var(--ghost)] relative min-h-[48px]">
        <div className="hidden md:flex flex-col text-[10px] tracking-[0.15em] uppercase text-[var(--muted)] font-mono flex-1">
          <span>{date}</span>
          <span className="text-[9px] tracking-widest">{weather} &bull; {volume}</span>
        </div>
        <span className="font-serif font-black text-lg tracking-[-0.02em] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap">
          The Marok Gazette
        </span>
        <div className="flex gap-4 items-center flex-1 justify-end">
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
        <NavButton to="/press">Press Room</NavButton>
        <NavButton to="/books">Library</NavButton>
        <NavButton to="/classifieds">Classifieds</NavButton>
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
