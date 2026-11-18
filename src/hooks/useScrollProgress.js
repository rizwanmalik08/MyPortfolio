import { useState, useEffect } from 'react';

/**
 * Hook to track overall scroll progress (0.0 to 1.0) and active section ID
 */
export function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
          const currentProgress = totalHeight > 0 ? Math.min(Math.max(window.scrollY / totalHeight, 0), 1) : 0;
          setProgress(currentProgress);

          // Find current active section
          const sections = [
            'home',
            'about',
            'websites',
            'projects',
            'social-media',
            'skills',
            'services',
            'certificates',
            'experience',
            'contact'
          ];
          const scrollPos = window.scrollY + 200;

          for (let i = sections.length - 1; i >= 0; i--) {
            const el = document.getElementById(sections[i]);
            if (el && el.offsetTop <= scrollPos) {
              setActiveSection(sections[i]);
              break;
            }
          }

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
