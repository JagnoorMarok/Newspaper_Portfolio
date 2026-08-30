import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useState, type TouchEvent } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const ROUTES = ['/', '/gallery', '/blog', '/books', '/contact', '/admin'];

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [touchStart, setTouchStart] = useState<{ x: number, y: number } | null>(null);
  const [touchEnd, setTouchEnd] = useState<{ x: number, y: number } | null>(null);

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
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
