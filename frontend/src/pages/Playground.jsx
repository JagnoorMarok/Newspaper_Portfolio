import React, { useState, useEffect, useMemo } from 'react';
import './Playground.css';
import SEO from '@/components/SEO';
import LandingPage from '@/components/LandingPage';
import ImageSpring from '@/components/ImageSpring';
import ButtonShowcase from '@/components/ButtonShowcase';
import Magazine from '@/components/Magazine';
import FocusSliceCarousel from '@/components/FocusSliceCarousel';
import GrainyCarousel from '@/components/GrainyCarousel';
import ThreeDCardRing from '@/components/ThreeDCardRing';
import AnimatedCardCollage from '@/components/AnimatedCardCollage';
import VideoReferenceCollage from '@/components/VideoReferenceCollage';
import CardToss from '@/components/CardToss';
import CardTunnel from '@/components/CardTunnel';
import CardGlobe from '@/components/CardGlobe';
import ImageTrail from '@/components/ImageTrail';
import WebcamPixelGridDemo from '@/components/WebcamPixelGridDemo';
import FloatingDockDemo from '@/components/floating-dock-demo.jsx';
import WisprFlowDemo from '@/components/WisprFlowDemo.jsx';
import InterfaceCraftsDemo from '@/components/InterfaceCraftsDemo.jsx';
import ConstellationFieldDemo from '@/components/ConstellationFieldDemo.jsx';
import StackTowerDemo from '@/components/StackTowerDemo.jsx';
import MorphGalleryDemo from '@/components/MorphGalleryDemo.jsx';
import WaterRippleImageDemo from '@/components/WaterRippleImageDemo.jsx';
import ImageStackDemo from '@/components/ImageStackDemo.jsx';
import InkRevealDemo from '@/components/InkRevealDemo.jsx';
import CursorParticlesTypographyDemo from '@/components/CursorParticlesTypographyDemo.jsx';
import KineticTextDemo from '@/components/KineticTextDemo.jsx';
import TextLoopDemo from '@/components/TextLoopDemo.jsx';
import AsciiRippleDemo from '@/components/AsciiRippleDemo.jsx';
import GlitchTextDemo from '@/components/GlitchTextDemo.jsx';
import EclipseDemo from '@/components/EclipseDemo.jsx';
import ComponentCodeExplainer from '@/components/ComponentCodeExplainer.jsx';

const COMPONENT_TITLES = {
  'home': 'Overview',
  'eclipse': 'Eclipse',
  'glitch-text': 'Glitch Text',
  'ascii-ripple': 'ASCII Ripple',
  'text-loop': 'Text Loop',
  'kinetic-text': 'Kinetic Text',
  'cursor-particles-typography': 'Cursor Particles Typography',
  'ink-reveal': 'Ink Reveal',
  'image-stack': 'Image Stack',
  'water-ripple-image': 'Water Ripple Image',
  'morph-gallery': 'Morph Gallery',
  'stack-tower': 'Stack Tower',
  'constellation-field': 'Constellation Field',
  'interface-crafts': 'Interface Crafts Cards',
  'wispr-flow': 'Wispr Flow Animation',
  'floating-dock': 'Floating Dock',
  'image-spring': 'Image Spring 3D',
  'webcam-pixel-grid': 'Webcam Pixel Grid',
  'image-trail': 'Image Trail',
  'card-globe': 'Card Globe 3D',
  'card-tunnel': 'Card Tunnel',
  'card-toss': 'Card Toss',
  'video-collage': 'Video Moodboard',
  'card-collage': 'Animated Card Collage',
  'threed-card-ring': '3D Card Ring',
  'grainy-carousel': 'Grainy Carousel',
  'focus-slice': 'Focus Slice',
  'magazine': 'Magazine 3D Flip',
  'buttons': 'Modern Buttons',
};

const COMPONENT_KEYS = Object.keys(COMPONENT_TITLES).filter((k) => k !== 'home');

export default function Playground() {
  const [activeTab, setActiveTab] = useState('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    return typeof window !== 'undefined' ? window.innerWidth > 768 : true;
  });
  const [sidebarSearch, setSidebarSearch] = useState('');

  // Lock mobile body scroll when drawer is open
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth <= 768) {
      if (isSidebarOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isSidebarOpen]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (typeof window !== 'undefined' && window.innerWidth <= 768) {
      setIsSidebarOpen(false);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Previous and next component navigation
  const currentIndex = COMPONENT_KEYS.indexOf(activeTab);
  const prevComponent = currentIndex > 0 
    ? COMPONENT_KEYS[currentIndex - 1] 
    : COMPONENT_KEYS[COMPONENT_KEYS.length - 1];
  const nextComponent = currentIndex >= 0 && currentIndex < COMPONENT_KEYS.length - 1 
    ? COMPONENT_KEYS[currentIndex + 1] 
    : COMPONENT_KEYS[0];

  // Filtered sidebar items
  const filteredSidebarKeys = useMemo(() => {
    if (!sidebarSearch.trim()) return COMPONENT_KEYS;
    const q = sidebarSearch.toLowerCase();
    return COMPONENT_KEYS.filter((k) => 
      k.toLowerCase().includes(q) || COMPONENT_TITLES[k].toLowerCase().includes(q)
    );
  }, [sidebarSearch]);

  return (
    <div className="playground-root">
      <SEO 
        title="Playground — Interactive Components" 
        description="An interactive laboratory of modern UI components, animations, WebGL shaders, and creative physics experiments by Jagnoor Singh Marok." 
      />
      <div className="app-layout">
        {/* Mobile Backdrop Overlay */}
        {isSidebarOpen && (
          <div 
            className="sidebar-backdrop" 
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Close Sidebar"
          />
        )}

        {/* Sidebar Navigation */}
        <aside className={`sidebar ${!isSidebarOpen ? 'closed' : ''}`}>
          <div className="sidebar-header">
            <div className="brand-logo" onClick={() => handleTabClick('home')} style={{ cursor: 'pointer' }}>
              <h1>The Workshop</h1>
              <span className="brand-badge">FOLIO IV // 28 APPARATUS</span>
            </div>
            <button 
              className="close-btn" 
              onClick={() => setIsSidebarOpen(false)} 
              aria-label="Close Navigation"
            >
              &times;
            </button>
          </div>

          {/* Quick Drawer Filter for Mobile & Desktop */}
          <div className="sidebar-search-box">
            <input 
              type="text" 
              placeholder="Filter apparatus..." 
              value={sidebarSearch}
              onChange={(e) => setSidebarSearch(e.target.value)}
              className="sidebar-search-input"
            />
            {sidebarSearch && (
              <button 
                className="sidebar-search-clear" 
                onClick={() => setSidebarSearch('')}
                aria-label="Clear filter"
              >
                &times;
              </button>
            )}
          </div>

          <nav className="nav-links">
            <div 
              className={`nav-link nav-link-overview ${activeTab === 'home' ? 'active' : ''}`}
              onClick={() => handleTabClick('home')}
            >
              <span className="nav-icon">✦</span> Section Index
            </div>
            <div className="nav-divider" />
            
            {filteredSidebarKeys.map((key) => (
              <div 
                key={key}
                className={`nav-link ${activeTab === key ? 'active' : ''}`}
                onClick={() => handleTabClick(key)}
              >
                {COMPONENT_TITLES[key]}
              </div>
            ))}

            {filteredSidebarKeys.length === 0 && (
              <div className="sidebar-no-results">
                No apparatus matches "{sidebarSearch}"
              </div>
            )}
          </nav>

          <div className="sidebar-footer">
            <span className="sidebar-footer-folio">FOLIO IV // THE MAROK GAZETTE</span>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className={`main-wrapper ${!isSidebarOpen ? 'expanded' : ''}`}>
          <div className="top-bar">
            {activeTab === 'home' ? (
              <div className="top-bar-home-layout">
                <button 
                  className="toggle-btn" 
                  onClick={() => setIsSidebarOpen(true)} 
                  aria-label="Open Navigation Index"
                >
                  <span className="toggle-icon">☰</span> 
                  <span className="toggle-text">Index</span>
                </button>
                <div className="top-bar-home-brand">
                  <span className="home-status-tag">✦ SECTION IV · THE WORKSHOP</span>
                </div>
              </div>
            ) : (
              <div className="top-bar-nav">
                <div className="top-bar-nav-left">
                  <button 
                    className="toggle-btn" 
                    onClick={() => setIsSidebarOpen(true)} 
                    aria-label="Open Navigation Index"
                    title="Open Component Index"
                  >
                    <span>☰</span> <span className="toggle-btn-label">Index</span>
                  </button>

                  <button 
                    className="back-showcase-btn" 
                    onClick={() => handleTabClick('home')}
                    title="Return to Workshop Index"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="19" y1="12" x2="5" y2="12"></line>
                      <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                    <span>Home</span>
                  </button>
                </div>

                <div className="top-bar-nav-middle">
                  <span className="breadcrumb-current" title={COMPONENT_TITLES[activeTab]}>
                    {COMPONENT_TITLES[activeTab] || 'Experiment'}
                  </span>
                </div>

                <div className="top-bar-nav-right">
                  <div className="prev-next-desktop-group">
                    <button 
                      className="prev-next-btn"
                      onClick={() => handleTabClick(prevComponent)}
                      title={`Previous: ${COMPONENT_TITLES[prevComponent]}`}
                      aria-label="Previous component"
                    >
                      ←
                    </button>
                    <button 
                      className="prev-next-btn"
                      onClick={() => handleTabClick(nextComponent)}
                      title={`Next: ${COMPONENT_TITLES[nextComponent]}`}
                      aria-label="Next component"
                    >
                      →
                    </button>
                  </div>

                  <button
                    className="cce-jump-pill"
                    onClick={() => {
                      const el = document.getElementById('component-code-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    title="Scroll down to inspect source code and architecture"
                  >
                    <span>Notes ↓</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {activeTab !== 'home' && (
            <div className="specimen-masthead">
              <div className="specimen-title-group">
                <span className="specimen-title">{COMPONENT_TITLES[activeTab] || 'APPARATUS'}</span>
                <span className="specimen-folio-tag">// SPECIMEN {activeTab.toUpperCase()}</span>
              </div>
              <div className="specimen-runtime-tag">
                <span>BROADSHEET FOLIO · LIVE RUNTIME</span>
              </div>
            </div>
          )}

          {/* Viewport content */}
          {activeTab === 'home' && (
            <LandingPage onSelectComponent={(tab) => handleTabClick(tab)} />
          )}

          {activeTab === 'eclipse' && (
            <div className="playground-demo-stage stage-flow eclipse-stage">
              <EclipseDemo />
            </div>
          )}

          {activeTab === 'glitch-text' && (
            <div className="playground-demo-stage stage-flow glitch-text-stage">
              <GlitchTextDemo />
            </div>
          )}

          {activeTab === 'ascii-ripple' && (
            <div className="playground-demo-stage stage-flow ascii-ripple-stage">
              <AsciiRippleDemo />
            </div>
          )}

          {activeTab === 'text-loop' && (
            <div className="playground-demo-stage stage-flow text-loop-stage">
              <TextLoopDemo />
            </div>
          )}

          {activeTab === 'kinetic-text' && (
            <div className="playground-demo-stage stage-flow kinetic-text-stage">
              <KineticTextDemo />
            </div>
          )}

          {activeTab === 'cursor-particles-typography' && (
            <div className="playground-demo-stage stage-flow cursor-particles-stage">
              <CursorParticlesTypographyDemo />
            </div>
          )}

          {activeTab === 'ink-reveal' && (
            <div className="playground-demo-stage stage-flow ink-reveal-stage">
              <InkRevealDemo />
            </div>
          )}

          {activeTab === 'image-stack' && (
            <div className="playground-demo-stage stage-flow image-stack-stage">
              <ImageStackDemo />
            </div>
          )}

          {activeTab === 'water-ripple-image' && (
            <div className="playground-demo-stage stage-flow water-ripple-stage">
              <WaterRippleImageDemo />
            </div>
          )}

          {activeTab === 'morph-gallery' && (
            <div className="playground-demo-stage stage-flow morph-gallery-stage">
              <MorphGalleryDemo />
            </div>
          )}

          {activeTab === 'stack-tower' && (
            <div className="playground-demo-stage stage-flow stack-tower-stage">
              <StackTowerDemo />
            </div>
          )}

          {activeTab === 'constellation-field' && (
            <div className="playground-demo-stage stage-flow constellation-field-stage">
              <ConstellationFieldDemo />
            </div>
          )}

          {activeTab === 'interface-crafts' && (
            <div className="playground-demo-stage stage-spatial interface-crafts-stage">
              <InterfaceCraftsDemo />
            </div>
          )}

          {activeTab === 'wispr-flow' && (
            <div className="playground-demo-stage stage-spatial wispr-flow-stage">
              <WisprFlowDemo />
            </div>
          )}

          {activeTab === 'floating-dock' && (
            <div className="playground-demo-stage stage-spatial floating-dock-stage">
              <FloatingDockDemo />
            </div>
          )}

          {activeTab === 'image-spring' && (
            <div className="playground-demo-stage stage-spatial image-spring-stage">
              <ImageSpring />
            </div>
          )}

          {activeTab === 'webcam-pixel-grid' && (
            <div className="playground-demo-stage stage-spatial webcam-pixel-grid-stage">
              <WebcamPixelGridDemo />
            </div>
          )}

          {activeTab === 'image-trail' && (
            <div className="playground-demo-stage stage-spatial image-trail-stage">
              <ImageTrail />
            </div>
          )}

          {activeTab === 'card-globe' && (
            <div className="playground-demo-stage stage-spatial card-globe-stage">
              <CardGlobe />
            </div>
          )}

          {activeTab === 'card-tunnel' && (
            <div className="playground-demo-stage stage-spatial card-tunnel-stage">
              <CardTunnel />
            </div>
          )}

          {activeTab === 'card-toss' && (
            <div className="playground-demo-stage stage-spatial card-toss-stage">
              <CardToss />
            </div>
          )}

          {activeTab === 'video-collage' && (
            <div className="playground-demo-stage stage-spatial video-collage-stage">
              <VideoReferenceCollage />
            </div>
          )}

          {activeTab === 'card-collage' && (
            <div className="playground-demo-stage stage-spatial card-collage-stage">
              <AnimatedCardCollage />
            </div>
          )}

          {activeTab === 'threed-card-ring' && (
            <div className="playground-demo-stage stage-spatial threed-card-ring-stage">
              <ThreeDCardRing />
            </div>
          )}

          {activeTab === 'grainy-carousel' && (
            <div className="playground-demo-stage stage-spatial grainy-carousel-stage">
              <GrainyCarousel />
            </div>
          )}

          {activeTab === 'focus-slice' && (
            <div className="playground-demo-stage stage-spatial focus-slice-stage">
              <FocusSliceCarousel />
            </div>
          )}

          {activeTab === 'magazine' && (
            <div className="playground-demo-stage stage-spatial magazine-stage">
              <Magazine />
            </div>
          )}

          {activeTab === 'buttons' && (
            <div className="playground-demo-stage stage-flow buttons-stage">
              <main className="main-content">
                <header className="showcase-header">
                  <h2>Buttons</h2>
                  <p>Minimal, accessible button components.</p>
                </header>
                <section className="showcase-area">
                  <ButtonShowcase />
                </section>
              </main>
            </div>
          )}

          {/* Code & Architecture Breakdown Section for Every Component */}
          {activeTab !== 'home' && (
            <ComponentCodeExplainer componentId={activeTab} />
          )}

          {/* Sticky Mobile Floating Navigation Controller */}
          {activeTab !== 'home' && (
            <div className="mobile-bottom-bar" aria-label="Mobile Apparatus Navigation">
              <button 
                className="mobile-bar-btn"
                onClick={() => handleTabClick(prevComponent)}
                title={`Previous: ${COMPONENT_TITLES[prevComponent]}`}
                aria-label="Previous component"
              >
                <span>← Prev</span>
              </button>

              <button 
                className="mobile-bar-btn mobile-bar-index"
                onClick={() => setIsSidebarOpen(true)}
                title="Open Index of all 28 Apparatus"
                aria-label="Open index drawer"
              >
                <span>☰ 28 APPARATUS</span>
              </button>

              <button 
                className="mobile-bar-btn"
                onClick={() => handleTabClick(nextComponent)}
                title={`Next: ${COMPONENT_TITLES[nextComponent]}`}
                aria-label="Next component"
              >
                <span>Next →</span>
              </button>

              <button 
                className="mobile-bar-btn mobile-bar-notes"
                onClick={() => {
                  const el = document.getElementById('component-code-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                title="Scroll down to inspect source code and architecture"
                aria-label="Scroll to architecture notes"
              >
                <span>Notes ↓</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
