import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * Custom Futuristic Magnetic Cursor
 * Dot + trailing ring that reacts to links and interactive buttons.
 * Automatically disabled on touch screens.
 */
export function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [cursorState, setCursorState] = useState('default'); // 'default' | 'hover' | 'text' | 'hidden'
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only enable custom cursor on devices that support true hover
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const onMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const onMouseEnter = () => setIsVisible(true);
    const onMouseLeave = () => setIsVisible(false);

    // Detect hover over interactive elements
    const handleMouseOver = (e) => {
      const target = e.target;
      if (
        target.closest('a') ||
        target.closest('button') ||
        target.closest('[role="button"]') ||
        target.closest('.interactive-hover')
      ) {
        setCursorState('hover');
      } else if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA'
      ) {
        setCursorState('text');
      } else {
        setCursorState('default');
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseenter', onMouseEnter);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseenter', onMouseEnter);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  const isHovered = cursorState === 'hover';
  const isText = cursorState === 'text';

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden="true">
      {/* Outer Follower Ring */}
      <motion.div
        className="absolute top-0 left-0 rounded-full border border-cyan-400/60"
        animate={{
          x: mousePosition.x - (isHovered ? 24 : isText ? 12 : 16),
          y: mousePosition.y - (isHovered ? 24 : isText ? 12 : 16),
          width: isHovered ? 48 : isText ? 24 : 32,
          height: isHovered ? 48 : isText ? 24 : 32,
          backgroundColor: isHovered ? 'rgba(34, 211, 238, 0.15)' : 'transparent',
          borderColor: isHovered ? '#22d3ee' : 'rgba(168, 85, 247, 0.5)',
          scale: isHovered ? 1.2 : 1,
        }}
        transition={{
          type: 'spring',
          damping: 25,
          stiffness: 300,
          mass: 0.5,
        }}
      />

      {/* Center Precise Dot */}
      <motion.div
        className="absolute top-0 left-0 h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_8px_#22d3ee]"
        animate={{
          x: mousePosition.x - 4,
          y: mousePosition.y - 4,
          scale: isHovered ? 0 : 1,
        }}
        transition={{
          type: 'spring',
          damping: 35,
          stiffness: 600,
        }}
      />
    </div>
  );
}
