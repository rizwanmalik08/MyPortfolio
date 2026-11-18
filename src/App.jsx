import { useState, useEffect, lazy, Suspense } from 'react';
import Lenis from 'lenis';
import { CustomCursor } from './components/ui/CustomCursor';
import { Preloader } from './components/ui/Preloader';
import { Navbar } from './components/sections/Navbar';
import { Hero } from './components/sections/Hero';
import { About } from './components/sections/About';
import { Skills } from './components/sections/Skills';
import { SocialMediaMarketing } from './components/sections/SocialMediaMarketing';
import { Services } from './components/sections/Services';
import { Certificates } from './components/sections/Certificates';
import { Experience } from './components/sections/Experience';
import { Testimonials } from './components/sections/Testimonials';
import { Contact } from './components/sections/Contact';
import { Footer } from './components/sections/Footer';
import { useScrollProgress } from './hooks/useScrollProgress';
import { soundManager } from './utils/audioFX';
import { ArrowUp } from 'lucide-react';

// Lazy load the 3D scene
const Scene = lazy(() =>
  import('./components/canvas/Scene').then((mod) => ({ default: mod.Scene }))
);

export default function App() {
  const [loading, setLoading] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { progress, activeSection } = useScrollProgress();

  // High-performance Lenis Smooth Scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.1,
      touchMultiplier: 1.0,
      syncTouch: false,
    });

    let animId;
    function raf(time) {
      lenis.raf(time);
      animId = requestAnimationFrame(raf);
    }
    animId = requestAnimationFrame(raf);

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      cancelAnimationFrame(animId);
      lenis.destroy();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleScrollTop = () => {
    soundManager.playClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen bg-[#05060f] text-slate-100 selection:bg-cyan-500 selection:text-black">
      {/* Fast Preloader Screen */}
      <Preloader onComplete={() => setLoading(false)} />

      {/* 120 FPS Magnetic Cursor */}
      <CustomCursor />

      {/* Architectural Dot Grid Overlay */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-dot-grid opacity-60" aria-hidden="true" />

      {/* Fixed Persistent 3D Canvas */}
      <Suspense
        fallback={
          <div className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-b from-[#05060f] via-[#0b0d1e] to-[#05060f]" />
        }
      >
        <Scene scrollProgress={progress} />
      </Suspense>

      {/* Navigation Header with Sound FX toggle */}
      <div className={`transition-opacity duration-700 ${loading ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <Navbar activeSection={activeSection} />
      </div>

      {/* Main Accessible DOM Content */}
      <main className={`relative z-10 transition-opacity duration-700 ${loading ? 'opacity-0' : 'opacity-100'}`}>
        <Hero />
        <About />
        <SocialMediaMarketing />
        <Services />
        <Skills />
        <Certificates />
        <Experience />
        <Testimonials />
        <Contact />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Back to Top Button */}
      <button
        type="button"
        onClick={handleScrollTop}
        className={`fixed bottom-6 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-cyan-400/40 bg-slate-900/90 text-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.3)] backdrop-blur-xl transition-all duration-300 hover:scale-110 hover:border-cyan-300 hover:text-white ${
          showScrollTop
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
        aria-label="Scroll to top of page"
      >
        <ArrowUp className="h-5 w-5" />
      </button>
    </div>
  );
}
