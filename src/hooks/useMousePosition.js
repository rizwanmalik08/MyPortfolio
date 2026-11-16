import { useState, useEffect } from 'react';

/**
 * Tracks mouse position normalized from -1 to 1 for parallax
 */
export function useMousePosition() {
  const [mouse, setMouse] = useState({ x: 0, y: 0, clientX: 0, clientY: 0, isHovering: false });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      setMouse({
        x,
        y,
        clientX: e.clientX,
        clientY: e.clientY,
        isHovering: true
      });
    };

    const handleMouseLeave = () => {
      setMouse((prev) => ({ ...prev, isHovering: false }));
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return mouse;
}
