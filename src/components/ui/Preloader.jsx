import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { soundManager } from '../../utils/audioFX';
import { Sparkles, ArrowRight, Volume2, VolumeX } from 'lucide-react';

/**
 * Interactive 3D Gravitational Wormhole & Black Hole Accretion Disk
 * Perfectly balanced cinematic composition:
 * - Top: Refined brand title & disciplines (unobstructed)
 * - Center: Pure, majestic 3D Singularity & Accretion Disk
 * - Bottom: Magnetic "Enter Wormhole" CTA & telemetry
 */
export function Preloader({ onComplete }) {
  const canvasRef = useRef(null);
  const [isWarping, setIsWarping] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const warpStateRef = useRef({ active: false, speedMult: 1.0, pull: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Mouse 3D tilt tracking
    let targetTiltX = 0.55;
    let targetTiltY = 0;
    let currentTiltX = 0.55;
    let currentTiltY = 0;

    const handleMouseMove = (e) => {
      const normX = (e.clientX / width - 0.5) * 2;
      const normY = (e.clientY / height - 0.5) * 2;
      targetTiltY = normX * 0.45;
      targetTiltX = 0.55 + normY * 0.25;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Initialize Accretion Disk Particles
    const PARTICLE_COUNT = 900;
    // Calibrated radius so the accretion disk sits harmoniously between the header and footer
    const MIN_RADIUS = Math.min(width, height) * 0.11;
    const MAX_RADIUS = Math.min(width, height) * 0.38;

    const particles = Array.from({ length: PARTICLE_COUNT }, () => {
      const radius = MIN_RADIUS + Math.random() * (MAX_RADIUS - MIN_RADIUS);
      const baseSpeed = 0.018 * Math.sqrt(MIN_RADIUS / radius);
      return {
        radius,
        angle: Math.random() * Math.PI * 2,
        speed: baseSpeed * (0.8 + Math.random() * 0.4),
        elevation: (Math.random() - 0.5) * 24 * (radius / MAX_RADIUS),
        size: Math.random() * 2.2 + 0.8,
        t: (radius - MIN_RADIUS) / (MAX_RADIUS - MIN_RADIUS),
        twinkle: Math.random() * Math.PI * 2,
      };
    });

    const render = () => {
      currentTiltX += (targetTiltX - currentTiltX) * 0.05;
      currentTiltY += (targetTiltY - currentTiltY) * 0.05;

      const isWarp = warpStateRef.current.active;
      if (isWarp) {
        warpStateRef.current.speedMult = Math.min(24, warpStateRef.current.speedMult * 1.12);
        warpStateRef.current.pull += 1.8;
      }

      ctx.fillStyle = isWarp ? 'rgba(2, 3, 7, 0.25)' : 'rgba(2, 3, 7, 0.4)';
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const cosX = Math.cos(currentTiltX);
      const sinX = Math.sin(currentTiltX);
      const cosY = Math.cos(currentTiltY);
      const sinY = Math.sin(currentTiltY);

      // 1. Background Gravitational Lensing Aura
      const auraGrad = ctx.createRadialGradient(cx, cy, MIN_RADIUS * 0.8, cx, cy, MAX_RADIUS * 1.25);
      auraGrad.addColorStop(0, 'rgba(34, 211, 238, 0.22)');
      auraGrad.addColorStop(0.35, 'rgba(168, 85, 247, 0.14)');
      auraGrad.addColorStop(1, 'rgba(2, 3, 7, 0)');
      ctx.fillStyle = auraGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, MAX_RADIUS * 1.25, 0, Math.PI * 2);
      ctx.fill();

      // 2. Render 3D Accretion Disk Particles
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const p = particles[i];
        p.angle += p.speed * warpStateRef.current.speedMult;
        p.twinkle += 0.08;

        if (isWarp) {
          p.radius = Math.max(0, p.radius - warpStateRef.current.pull * 2);
        }

        const rawX = Math.cos(p.angle) * p.radius;
        const rawZ = Math.sin(p.angle) * p.radius;
        const rawY = p.elevation + Math.sin(p.angle * 2) * 5;

        const rotY_X = rawX * cosY - rawZ * sinY;
        const rotY_Z = rawX * sinY + rawZ * cosY;

        const rotX_Y = rawY * cosX - rotY_Z * sinX;
        const rotX_Z = rawY * sinX + rotY_Z * cosX;

        const cameraDist = 850;
        const scale = cameraDist / (cameraDist + rotX_Z);
        const screenX = cx + rotY_X * scale;
        const screenY = cy + rotX_Y * scale;

        const doppler = Math.max(0.2, (1 + Math.sin(p.angle)) * 0.6);
        const alpha = Math.min(1, Math.max(0.1, (1 - p.t * 0.7) * doppler * (0.8 + Math.sin(p.twinkle) * 0.2)));

        let color;
        if (p.t < 0.25) {
          color = `rgba(255, 255, 255, ${alpha})`;
        } else if (p.t < 0.65) {
          color = `rgba(56, 189, 248, ${alpha})`;
        } else {
          color = `rgba(192, 132, 252, ${alpha * 0.85})`;
        }

        ctx.beginPath();
        if (isWarp) {
          const streakLen = p.speed * 40 * warpStateRef.current.speedMult;
          ctx.strokeStyle = color;
          ctx.lineWidth = p.size * scale * 1.5;
          ctx.moveTo(screenX, screenY);
          ctx.lineTo(screenX - Math.sin(p.angle) * streakLen, screenY + Math.cos(p.angle) * streakLen * sinX);
          ctx.stroke();
        } else {
          ctx.fillStyle = color;
          ctx.arc(screenX, screenY, Math.max(0.8, p.size * scale), 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 3. Central Event Horizon (Obsidian Singularity)
      const horizonRadius = MIN_RADIUS * 0.82;
      ctx.beginPath();
      ctx.arc(cx, cy, horizonRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#020306';
      ctx.fill();

      // Einstein Ring Photon Sphere
      ctx.beginPath();
      ctx.arc(cx, cy, horizonRadius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.9)';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 35;
      ctx.stroke();
      ctx.shadowBlur = 0;

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleWarp = () => {
    if (isWarping) return;
    setIsWarping(true);
    warpStateRef.current.active = true;

    if (!isMuted) {
      try {
        soundManager.playEnterSwell();
      } catch (_) {}
    }

    setTimeout(() => {
      setIsFinished(true);
      if (onComplete) onComplete();
    }, 950);
  };

  const toggleSound = (e) => {
    e.stopPropagation();
    const state = soundManager.toggleSound();
    setIsMuted(!state);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        handleWarp();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <AnimatePresence>
      {!isFinished && (
        <motion.div
          className="fixed inset-0 z-[99999] flex flex-col justify-between bg-[#020306] text-white select-none overflow-hidden font-sans p-6 sm:p-10"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.2,
            filter: 'blur(12px)',
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
          }}
        >
          {/* Interactive 3D WebGL Canvas */}
          <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />

          {/* Relativistic Flash Flare on Warp */}
          {isWarping && (
            <motion.div
              className="absolute inset-0 z-30 pointer-events-none bg-gradient-to-r from-cyan-400/40 via-white/70 to-violet-500/40 backdrop-blur-[2px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.95, 0] }}
              transition={{ duration: 0.9 }}
            />
          )}

          {/* Top HUD: Status & Audio Controls */}
          <div className="relative z-20 w-full max-w-7xl mx-auto flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2.5">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
              </span>
              <span className="tracking-[0.25em] uppercase text-slate-300 text-[11px]">
                3D SINGULARITY // 2026
              </span>
            </div>

            <button
              onClick={toggleSound}
              className="flex items-center gap-2 rounded-full border border-white/15 bg-black/60 px-3.5 py-1.5 text-[11px] font-mono tracking-wider text-slate-300 hover:text-white hover:border-cyan-400/50 hover:bg-white/10 transition-all cursor-pointer backdrop-blur-md"
            >
              {isMuted ? (
                <>
                  <VolumeX className="h-3.5 w-3.5 text-rose-400" />
                  <span>AUDIO MUTED</span>
                </>
              ) : (
                <>
                  <Volume2 className="h-3.5 w-3.5 text-cyan-400" />
                  <span className="flex items-center gap-1.5">
                    <span>AUDIO ON</span>
                    <span className="flex items-end gap-0.5 h-2.5">
                      <span className="w-0.5 h-1.5 bg-cyan-400 animate-pulse" />
                      <span className="w-0.5 h-2.5 bg-cyan-400 animate-pulse delay-75" />
                      <span className="w-0.5 h-1 bg-cyan-400 animate-pulse delay-150" />
                    </span>
                  </span>
                </>
              )}
            </button>
          </div>

          {/* Upper Third: Refined Identity Header (Placed cleanly ABOVE the singularity) */}
          <motion.div
            className="relative z-20 flex flex-col items-center text-center mt-4 sm:mt-6"
            animate={{
              opacity: isWarping ? 0 : 1,
              y: isWarping ? -30 : 0,
            }}
            transition={{ duration: 0.5 }}
          >
            {/* Ambient Title Aura */}
            <div className="absolute -inset-4 bg-cyan-500/10 blur-xl pointer-events-none rounded-full" />

            <h1 className="relative text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-wider text-white select-none whitespace-nowrap drop-shadow-[0_0_30px_rgba(56,189,248,0.5)]">
              Rizwan{' '}
              <span className="bg-gradient-to-r from-cyan-300 via-sky-300 to-violet-400 bg-clip-text text-transparent">
                Malik
              </span>
            </h1>

            {/* Handcrafted Editorial Disciplines */}
            <div className="mt-2.5 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-[11px] sm:text-xs font-mono tracking-[0.25em] uppercase text-cyan-200/90">
              <span>Visual Designer</span>
              <span className="text-violet-400">•</span>
              <span>Full-Stack Developer</span>
              <span className="text-cyan-400">•</span>
              <span>Growth Strategist</span>
            </div>
          </motion.div>

          {/* Lower Third: Magnetic Launch CTA & Interaction Hint (Placed cleanly BELOW the singularity) */}
          <motion.div
            className="relative z-20 flex flex-col items-center text-center mb-2 sm:mb-4"
            animate={{
              opacity: isWarping ? 0 : 1,
              y: isWarping ? 30 : 0,
            }}
            transition={{ duration: 0.5 }}
          >
            <motion.button
              onClick={handleWarp}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.96 }}
              className="group relative inline-flex items-center gap-3 rounded-full px-8 sm:px-10 py-3.5 sm:py-4 text-xs sm:text-sm font-bold tracking-widest uppercase text-white bg-gradient-to-r from-cyan-500 via-indigo-600 to-violet-600 shadow-[0_0_40px_rgba(34,211,238,0.5)] hover:shadow-[0_0_60px_rgba(129,140,248,0.8)] transition-all cursor-pointer overflow-hidden border border-white/30 backdrop-blur-xl"
            >
              <span className="relative z-10 flex items-center gap-2.5">
                <Sparkles className="h-4 w-4 text-cyan-200 animate-spin" />
                <span>Enter Wormhole</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1.5" />
              </span>

              {/* Shimmer sweep */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            </motion.button>

            <p className="mt-3.5 text-[10.5px] font-mono tracking-widest uppercase text-slate-400">
              Move cursor to tilt 3D disk in space • Press <span className="text-cyan-400 font-bold">[ Space ]</span> to enter
            </p>
          </motion.div>

          {/* Bottom Telemetry Bar */}
          <div className="relative z-20 w-full max-w-7xl mx-auto flex items-center justify-between text-[11px] font-mono text-slate-400 uppercase tracking-widest">
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>REAL-TIME 3D PARTICLE ACCRETION DISK (900 PARTICLES)</span>
            </span>
            <span className="hidden sm:inline">LAHORE, PK</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}