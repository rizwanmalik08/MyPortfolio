import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Futuristic 3D Experience Preloader
 * Shows real asset load progression and smooth cinematic exit
 */
export function Preloader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Initializing 3D Viewport...');
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const statuses = [
      { threshold: 15, text: 'Initializing 3D Engine...' },
      { threshold: 45, text: 'Compiling Neural Shaders & Materials...' },
      { threshold: 75, text: 'Loading Geometry & Portfolios...' },
      { threshold: 95, text: 'Syncing Audio-Visual Pipelines...' },
      { threshold: 100, text: 'Experience Ready' },
    ];

    let current = 0;
    const interval = setInterval(() => {
      // Smooth non-linear progress jump
      current += Math.floor(Math.random() * 8) + 4;
      if (current >= 100) {
        current = 100;
        setProgress(100);
        setStatusText('Welcome to Rizwan 3D');
        clearInterval(interval);
        setTimeout(() => {
          setIsFinished(true);
          setTimeout(() => {
            if (onComplete) onComplete();
          }, 600);
        }, 300);
      } else {
        setProgress(current);
        const match = statuses.find((s) => current <= s.threshold);
        if (match) setStatusText(match.text);
      }
    }, 45);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isFinished && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0a0a12] text-white"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -40, filter: 'blur(10px)' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Ambient Glow Orbs */}
          <div className="absolute top-1/3 left-1/3 h-72 w-72 rounded-full bg-violet-600/20 blur-[100px] pointer-events-none" />
          <div className="absolute bottom-1/3 right-1/3 h-72 w-72 rounded-full bg-cyan-500/20 blur-[100px] pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center max-w-sm w-full px-6 text-center">
            {/* Holographic Logo Monogram */}
            <motion.div
              className="relative mb-8 flex h-20 w-20 items-center justify-center rounded-2xl border border-white/20 bg-white/5 backdrop-blur-md shadow-[0_0_40px_rgba(124,58,237,0.3)]"
              animate={{
                rotateY: [0, 180, 360],
                boxShadow: [
                  '0 0 20px rgba(124,58,237,0.3)',
                  '0 0 50px rgba(34,211,238,0.5)',
                  '0 0 20px rgba(124,58,237,0.3)',
                ],
              }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            >
              <span className="text-2xl font-bold tracking-widest bg-gradient-to-tr from-cyan-400 via-violet-300 to-white bg-clip-text text-transparent">
                R
              </span>
            </motion.div>

            {/* Percentage Display */}
            <div className="flex items-baseline gap-1 font-mono">
              <span className="text-6xl font-bold tracking-tight text-white">
                {progress}
              </span>
              <span className="text-xl font-semibold text-cyan-400">%</span>
            </div>

            {/* Progress Track */}
            <div className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-white/10 p-[1px] border border-white/10">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-violet-500 via-cyan-400 to-rose-400 shadow-[0_0_12px_#22d3ee]"
                style={{ width: `${progress}%` }}
                transition={{ ease: 'easeOut', duration: 0.1 }}
              />
            </div>

            {/* Status Text Ticker */}
            <p className="mt-4 text-xs font-mono uppercase tracking-[0.25em] text-slate-400">
              {statusText}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
