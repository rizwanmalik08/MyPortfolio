import { useEffect, useRef } from 'react';

/**
 * High-Performance 120 FPS Magnetic Cursor
 * Uses direct DOM manipulation via requestAnimationFrame and transforms.
 * ZERO React re-renders during mouse movement, eliminating CPU/GPU scroll lag.
 */
export function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const posRef = useRef({ x: -100, y: -100, targetX: -100, targetY: -100 });
  const isHoveredRef = useRef(false);
  const isClickingRef = useRef(false);

  useEffect(() => {
    // Disable completely on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let animId;

    const handleMouseMove = (e) => {
      posRef.current.targetX = e.clientX;
      posRef.current.targetY = e.clientY;

      // First move: snap to cursor
      if (posRef.current.x < 0) {
        posRef.current.x = e.clientX;
        posRef.current.y = e.clientY;
      }
    };

    const handleMouseDown = () => {
      isClickingRef.current = true;
    };

    const handleMouseUp = () => {
      isClickingRef.current = false;
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      if (
        target.closest('a') ||
        target.closest('button') ||
        target.closest('[role="button"]') ||
        target.closest('.interactive') ||
        target.closest('input') ||
        target.closest('textarea')
      ) {
        isHoveredRef.current = true;
      } else {
        isHoveredRef.current = false;
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    window.addEventListener('mouseup', handleMouseUp, { passive: true });
    document.addEventListener('mouseover', handleMouseOver, { passive: true });

    // Smooth physics loop with RAF
    const updateCursor = () => {
      const pos = posRef.current;

      // Center dot follows instantly
      dot.style.transform = `translate3d(${pos.targetX}px, ${pos.targetY}px, 0)`;

      // Trailing ring lerps smoothly
      const speed = 0.18;
      pos.x += (pos.targetX - pos.x) * speed;
      pos.y += (pos.targetY - pos.y) * speed;

      const scale = isClickingRef.current ? 0.75 : isHoveredRef.current ? 1.5 : 1;
      ring.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) scale(${scale})`;

      if (isHoveredRef.current) {
        ring.classList.add('cursor-hovered');
      } else {
        ring.classList.remove('cursor-hovered');
      }

      animId = requestAnimationFrame(updateCursor);
    };

    animId = requestAnimationFrame(updateCursor);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden="true">
      {/* Outer Follower Ring */}
      <div
        ref={ringRef}
        className="absolute -top-4 -left-4 h-8 w-8 rounded-full border border-cyan-400/50 transition-colors duration-200 will-change-transform"
        style={{ transform: 'translate3d(-100px, -100px, 0)' }}
      />

      {/* Center Precise Dot */}
      <div
        ref={dotRef}
        className="absolute -top-1 -left-1 h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_10px_#22d3ee] will-change-transform"
        style={{ transform: 'translate3d(-100px, -100px, 0)' }}
      />
    </div>
  );
}
