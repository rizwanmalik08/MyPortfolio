import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Ultra-Fast & Snappy Preloader
 * High-performance reveal in ~250ms so the user is never kept waiting
 */
export function Preloader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    let current = 0;
    // Rapid progression to 100% in ~200ms
    const interval = setInterval(() => {
      current += 25;
      if (current >= 100) {
        setProgress(100);
        clearInterval(interval);
        setTimeout(() => {
          setIsFinished(true);
          if (onComplete) onComplete();
        }, 80);
      } else {
        setProgress(current);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isFinished && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#070814] text-white"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          {/* Ambient Glow */}
          <div className="absolute top-1/3 left-1/3 h-64 w-64 rounded-full bg-violet-600/20 blur-[90px] pointer-events-none" />
          <div className="absolute bottom-1/3 right-1/3 h-64 w-64 rounded-full bg-cyan-500/20 blur-[90px] pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center max-w-sm w-full px-6 text-center">
            {/* Elegant Monogram Emblem (No flip or backwards rotation) */}
            <motion.div
              className="relative mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-slate-900/80 p-3 shadow-[0_0_25px_rgba(56,189,248,0.3)] backdrop-blur-md"
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
            >
              <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="preloaderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#38bdf8" />
                    <stop offset="55%" stopColor="#818cf8" />
                    <stop offset="100%" stopColor="#c084fc" />
                  </linearGradient>
                </defs>
                <path
                  d="M4.5 4C4.5 3.17 5.17 2.5 6 2.5H13C16.59 2.5 19.5 5.41 19.5 9C19.5 11.96 17.52 14.47 14.8 15.26L19.42 21.04C19.88 21.61 19.47 22.5 18.74 22.5H15.18C14.75 22.5 14.35 22.3 14.1 21.95L9.5 15.5H7.5V21.5C7.5 22.05 7.05 22.5 6.5 22.5H5.5C4.95 22.5 4.5 22.05 4.5 21.5V4ZM7.5 5.5V12.5H13C14.93 12.5 16.5 10.93 16.5 9C16.5 7.07 14.93 5.5 13 5.5H7.5Z"
                  fill="url(#preloaderGrad)"
                />
              </svg>
            </motion.div>

            {/* Percentage Display */}
            <div className="flex items-baseline gap-1 font-mono">
              <span className="text-4xl font-extrabold tracking-tight text-white">
                {progress}
              </span>
              <span className="text-base font-semibold text-cyan-400">%</span>
            </div>

            {/* Fast Progress Track */}
            <div className="mt-3.5 h-1.5 w-full max-w-[220px] overflow-hidden rounded-full bg-white/10 p-[1px] border border-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-500 via-cyan-400 to-emerald-400 shadow-[0_0_12px_#22d3ee] transition-all duration-75"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Clean Brand Title */}
            <p className="mt-3 text-[11px] font-mono uppercase tracking-[0.2em] text-slate-400">
              Rizwan Malik • Portfolio
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
