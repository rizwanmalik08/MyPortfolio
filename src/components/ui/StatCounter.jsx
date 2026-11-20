import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

/**
 * Animated number counter for stats that triggers when scrolled into view
 * Supports integers, decimals, prefixes, suffixes, and custom easing
 */
export function StatCounter({
  value,
  prefix = '',
  suffix = '',
  duration = 1.8,
  decimals = null
}) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  // Auto-detect decimals if not explicitly provided
  const numDecimals = decimals !== null
    ? decimals
    : (value.toString().includes('.') ? value.toString().split('.')[1]?.length || 0 : 0);

  useEffect(() => {
    if (!isInView) return;

    let startTime = null;
    let animationFrame = null;
    const target = typeof value === 'number' ? value : parseFloat(value) || 0;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);

      // Easing: easeOutExpo (smooth exponential ease out)
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = easeProgress * target;

      if (numDecimals > 0) {
        setDisplayValue(current.toFixed(numDecimals));
      } else {
        setDisplayValue(Math.floor(current));
      }

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setDisplayValue(numDecimals > 0 ? target.toFixed(numDecimals) : target);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [isInView, value, duration, numDecimals]);

  return (
    <span ref={ref} className="tabular-nums font-inherit">
      {prefix}
      {displayValue}
      {suffix}
    </span>
  );
}
