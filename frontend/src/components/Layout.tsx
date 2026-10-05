import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect, Suspense, type TouchEvent } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const ROUTES = ['/', '/gallery', '/blog', '/press', '/books', '/classifieds', '/playground', '/contact'];

function PageLoader() {
  return (
    <div className="container mx-auto px-8 min-h-[60vh] flex flex-col items-center justify-center font-mono text-xs uppercase tracking-widest text-[var(--muted)]">
      <div className="border border-[var(--ghost)] p-6 md:p-8 bg-[var(--paper2)] flex flex-col items-center gap-3 text-center">
        <span className="font-serif italic text-base md:text-lg text-[var(--ink)]">Typesetting Broadsheet...</span>
        <div className="w-16 h-[2px] bg-[var(--ink)] animate-pulse" />
        <span className="text-[9px] tracking-[0.2em] text-[var(--ghost)]">Please stand by</span>
      </div>
    </div>
  );
}

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [touchStart, setTouchStart] = useState<{ x: number, y: number } | null>(null);
  const [touchEnd, setTouchEnd] = useState<{ x: number, y: number } | null>(null);

  // Global shortcut to open Editor's Room (Ctrl + Shift + E or Cmd + Shift + E)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'e') {
        e.preventDefault();
        navigate('/admin');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  const minSwipeDistance = 75; 

  const onTouchStart = (e: TouchEvent) => {
    setTouchEnd(null);
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    });
  };

  const onTouchMove = (e: TouchEvent) => {
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    });
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const xDistance = touchStart.x - touchEnd.x;
    const yDistance = touchStart.y - touchEnd.y;
    
    // Ensure horizontal swipe is intentional (not just messy vertical scrolling)
    if (Math.abs(xDistance) > Math.abs(yDistance)) {
      const isLeftSwipe = xDistance > minSwipeDistance;
      const isRightSwipe = xDistance < -minSwipeDistance;
      
      if (isLeftSwipe || isRightSwipe) {
        const currentIndex = ROUTES.indexOf(location.pathname);
        if (currentIndex === -1) return;

        if (isLeftSwipe && currentIndex < ROUTES.length - 1) {
          navigate(ROUTES[currentIndex + 1]);
          window.scrollTo(0, 0);
        } else if (isRightSwipe && currentIndex > 0) {
          navigate(ROUTES[currentIndex - 1]);
          window.scrollTo(0, 0);
        }
      }
    }
  };

  return (
    <>
      <Navbar />
      <main 
        className="pt-[90px] min-h-screen"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
