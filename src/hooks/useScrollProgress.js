import { useState, useEffect } from 'react';

const SECTIONS = [
  'home',
  'about',
  'websites',
  'social-media',
  'services',
  'skills',
  'certificates',
  'experience',
  'testimonials',
  'contact'
];

/**
 * High-Performance Active Section Tracker
 * ONLY triggers a React re-render when the active section ID actually changes.
 * Zero re-renders during continuous scrolling.
 */
export function useActiveSection() {
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollPos = window.scrollY + 200;
          let current = 'home';

          for (let i = SECTIONS.length - 1; i >= 0; i--) {
            const el = document.getElementById(SECTIONS[i]);
            if (el && el.offsetTop <= scrollPos) {
              current = SECTIONS[i];
              break;
            }
          }

          setActiveSection((prev) => (prev !== current ? current : prev));
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return activeSection;
}

/**
 * Hook to track overall scroll progress (0.0 to 1.0)
 */
export function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  const activeSection = useActiveSection();

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
          const currentProgress = totalHeight > 0 ? Math.min(Math.max(window.scrollY / totalHeight, 0), 1) : 0;
          setProgress(currentProgress);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return { progress, activeSection };
}

