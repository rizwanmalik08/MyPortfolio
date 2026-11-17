import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Zap, Activity } from 'lucide-react';
import { AvatarScene } from './AvatarScene';
import { useHeadTarget } from './useHeadTarget';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/**
 * AvatarPortal Component
 * 
 * High-performance circular 3D avatar hero portal matching the screenshot layout:
 * - 420–520px circular portal widget (responsive on mobile)
 * - Rotating conic gradient ring (blue → violet → pink/red) + independent white light-arc
 * - Dotted orbit ring & corner HUD markers ([+], // 001, // 2026)
 * - Top dynamic status pill (Idle vs Cursor Tracking)
 * - Top-right glass card (animated count-up "4+", sparkle, progress bar)
 * - Bottom-left glass card (pulsing green dot, ping fluctuating 12-40ms every 2s)
 * - Bottom pill ("REACT • THREE.JS • C++")
 * - Real DOM glassmorphism cards with staggered floating animations
 * - Full WebGL & rigged GLB support with Plan B volumetric fallback
 */
export function AvatarPortal({
  modelUrl = '/models/avatar.glb',
  idleInterval = [1.5, 3.5],
  maxYaw = 30 * (Math.PI / 180),
  maxPitch = 15 * (Math.PI / 180),
  maxRoll = 4 * (Math.PI / 180),
  followStrength = 1.0,
}) {
  const portalRef = useRef(null);
  const reducedMotion = useReducedMotion();

  // Head Target calculation & tracking hook
  const {
    targetRef,
    trackingMode,
    onPointerEnter,
    onPointerMove,
    onPointerLeave,
  } = useHeadTarget({
    idleInterval,
    maxYaw,
    maxPitch,
    maxRoll,
    followStrength,
    reducedMotion,
  });

  // State for normalized mouse position (-1 to 1) for static fallback tilt
  const [mouseNorm, setMouseNorm] = useState({ x: 0, y: 0 });

  // Animated Experience Count-up on load (0 -> 4)
  const [expCount, setExpCount] = useState(0);
  useEffect(() => {
    let current = 0;
    const target = 4;
    const timer = setInterval(() => {
      current += 1;
      setExpCount(current);
      if (current >= target) clearInterval(timer);
    }, 220);
    return () => clearInterval(timer);
  }, []);

  // Fluctuating network ping (12–40ms every 2s as specified)
  const [ping, setPing] = useState(17);
  useEffect(() => {
    const interval = setInterval(() => {
      setPing(Math.floor(12 + Math.random() * 29));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Pointer event handlers
  const handlePointerEnter = () => {
    onPointerEnter();
  };

  const handlePointerMove = (e) => {
    if (!portalRef.current) return;
    const rect = portalRef.current.getBoundingClientRect();
    const clientX = e.clientX ?? e.touches?.[0]?.clientX;
    const clientY = e.clientY ?? e.touches?.[0]?.clientY;

    if (clientX === undefined || clientY === undefined) return;

    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const normX = Math.max(-1, Math.min(1, (x - centerX) / centerX));
    const normY = Math.max(-1, Math.min(1, (y - centerY) / centerY));

    setMouseNorm({ x: normX, y: normY });
    onPointerMove(normX, normY);
  };

  const handlePointerLeave = () => {
    setMouseNorm({ x: 0, y: 0 });
    onPointerLeave();
  };

  return (
    <div
      ref={portalRef}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onTouchStart={handlePointerEnter}
      onTouchMove={handlePointerMove}
      onTouchEnd={handlePointerLeave}
      className="relative flex items-center justify-center select-none w-full max-w-[420px] sm:max-w-[480px] lg:max-w-[510px] aspect-square mx-auto p-4 sm:p-6"
      role="region"
      aria-label="Interactive 3D Avatar Console"
    >
      <span className="sr-only">
        Animated 3D avatar of Rizwan with live head tracking and autonomous idle movement.
      </span>

      {/* ========================================================= */}
      {/* 1. OUTER DOTTED ORBIT RING & HUD BRACKETS */}
      {/* ========================================================= */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        {/* Dotted Orbit Ring */}
        <div
          className={`absolute inset-1 sm:inset-0 rounded-full border border-dashed border-cyan-500/25 ${
            reducedMotion ? '' : 'animate-[spin_60s_linear_infinite]'
          }`}
        />

        {/* Outer Orbit Tracker Spheres */}
        <div className="absolute -top-1 left-1/4 h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]" />
        <div className="absolute top-1/3 -right-2 h-1.5 w-1.5 rounded-full bg-violet-400 shadow-[0_0_8px_#a78bfa]" />
        <div className="absolute bottom-10 -left-2 h-2 w-2 rounded-full border border-cyan-400/80 bg-slate-950" />

        {/* HUD Brackets: [+] on Left & Right */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 font-mono text-xs text-cyan-400/80 tracking-widest">
          [+]
        </div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 font-mono text-xs text-cyan-400/80 tracking-widest">
          [+]
        </div>

        {/* Micro Labels: // 001 Top & // 2026 Bottom */}
        <div className="absolute top-1 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-[0.25em] text-cyan-400/60">
          // 001
        </div>
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-[0.25em] text-cyan-400/60">
          // 2026
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. ROTATING CONIC GRADIENT RING + INDEPENDENT LIGHT ARC */}
      {/* ========================================================= */}
      <div className="relative flex items-center justify-center h-full w-full rounded-full p-[4px] sm:p-[5px] overflow-hidden shadow-[0_0_50px_rgba(34,211,238,0.2)]">
        {/* Base Rotating Conic Gradient (Blue -> Violet -> Pink/Red, ~20s) */}
        <div
          className={`absolute -inset-[50%] bg-[conic-gradient(from_0deg,#2563eb_0%,#7c3aed_35%,#ec4899_70%,#f43f5e_85%,#2563eb_100%)] ${
            reducedMotion ? '' : 'animate-[spin_20s_linear_infinite]'
          }`}
        />

        {/* Independent Sweeping White Light-Arc (~5s rotation) */}
        {!reducedMotion && (
          <div className="pointer-events-none absolute -inset-[50%] animate-[spin_5.2s_linear_infinite]">
            <div className="h-full w-full bg-[conic-gradient(from_0deg,transparent_0deg,transparent_310deg,rgba(255,255,255,0.95)_350deg,transparent_360deg)]" />
          </div>
        )}

        {/* Inner Mask Container (clips to circle) */}
        <div className="relative h-full w-full rounded-full overflow-hidden bg-slate-950">
          {/* Dark Teal Radial Gradient Background */}
          <div
            className="absolute inset-0 -z-10"
            style={{
              background:
                'radial-gradient(circle at 50% 45%, #083344 0%, #041c2c 55%, #020912 100%)',
            }}
          />

          {/* Soft Glow Behind Head */}
          <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 h-56 w-56 rounded-full bg-cyan-400/20 blur-[55px]" />
          <div className="pointer-events-none absolute bottom-1/4 right-1/4 h-48 w-48 rounded-full bg-violet-600/15 blur-[65px]" />

          {/* Transparent Canvas with Rigged 3D Character */}
          <div className="relative h-full w-full">
            <AvatarScene
              targetRef={targetRef}
              modelUrl={modelUrl}
              reducedMotion={reducedMotion}
              mouseNorm={mouseNorm}
            />
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. TOP STATUS PILL (Changes with State) */}
      {/* ========================================================= */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="pointer-events-none absolute -top-4 sm:-top-5 left-1/2 -translate-x-1/2 z-30"
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-slate-950/85 px-4 py-1.5 shadow-[0_4px_20px_rgba(0,0,0,0.5),0_0_15px_rgba(34,211,238,0.2)] backdrop-blur-md">
          {/* Status Dot */}
          <span className="relative flex h-2 w-2">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                trackingMode === 'tracking' ? 'bg-emerald-400' : 'bg-cyan-400'
              }`}
            />
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                trackingMode === 'tracking' ? 'bg-emerald-400' : 'bg-cyan-400'
              }`}
            />
          </span>

          {/* Dynamic Status Text */}
          <span className="font-mono text-[10px] sm:text-[11px] font-semibold tracking-wider text-slate-200">
            {trackingMode === 'tracking'
              ? 'TRACKING CURSOR // LOCKED'
              : 'AUTONOMOUS IDLE // OBSERVING SCENE'}
          </span>
        </div>
      </motion.div>

      {/* ========================================================= */}
      {/* 4. TOP-RIGHT GLASS CARD (4+ YEARS EXP) */}
      {/* ========================================================= */}
      <motion.div
        initial={{ opacity: 0, x: 20, y: -15 }}
        animate={{
          opacity: 1,
          x: 0,
          y: reducedMotion ? 0 : [0, -6, 0],
        }}
        transition={{
          y: {
            duration: 4.2,
            repeat: Infinity,
            ease: 'easeInOut',
          },
          opacity: { duration: 0.6, delay: 0.3 },
          x: { duration: 0.6, delay: 0.3 },
        }}
        className="absolute top-2 -right-3 sm:top-4 sm:-right-4 z-30 w-32 sm:w-36 rounded-2xl border border-cyan-400/30 bg-slate-950/70 p-3 sm:p-3.5 shadow-[0_8px_32px_rgba(0,0,0,0.5),0_0_15px_rgba(34,211,238,0.15)] backdrop-blur-md"
        aria-label="4 plus years of experience"
      >
        <div className="flex items-center justify-between">
          <span className="text-xl sm:text-2xl font-black tracking-tight text-white font-mono">
            {expCount}+
          </span>
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-300">
            <Sparkles className="h-3.5 w-3.5 animate-pulse" />
          </div>
        </div>

        <p className="mt-1 font-mono text-[9px] sm:text-[10px] font-medium tracking-wider text-slate-400 uppercase">
          YEARS EXP
        </p>

        {/* Animated Gradient Progress Bar */}
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: '85%' }}
            transition={{ duration: 1.2, delay: 0.5, ease: 'easeOut' }}
            className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-500 shadow-[0_0_8px_#22d3ee]"
          />
        </div>
      </motion.div>

      {/* ========================================================= */}
      {/* 5. BOTTOM-LEFT GLASS CARD (AVAILABLE FOR WORK & PING) */}
      {/* ========================================================= */}
      <motion.div
        initial={{ opacity: 0, x: -20, y: 15 }}
        animate={{
          opacity: 1,
          x: 0,
          y: reducedMotion ? 0 : [0, 6, 0],
        }}
        transition={{
          y: {
            duration: 4.8,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.8,
          },
          opacity: { duration: 0.6, delay: 0.4 },
          x: { duration: 0.6, delay: 0.4 },
        }}
        className="absolute bottom-2 -left-3 sm:bottom-4 sm:-left-4 z-30 min-w-[190px] sm:min-w-[210px] rounded-2xl border border-cyan-400/30 bg-slate-950/75 p-3 sm:p-3.5 shadow-[0_8px_32px_rgba(0,0,0,0.5),0_0_15px_rgba(34,211,238,0.15)] backdrop-blur-md"
        aria-label="Available for work status"
      >
        <div className="flex items-center gap-2.5">
          {/* Pulsing Green Dot */}
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400 shadow-[0_0_8px_#34d399]" />
          </span>

          <span className="font-mono text-[10px] sm:text-[11px] font-bold tracking-wider text-white">
            AVAILABLE FOR WORK
          </span>
        </div>

        {/* Fluctuating Ping & Ready status */}
        <div className="mt-1 flex items-center gap-2 font-mono text-[9px] sm:text-[10px] text-cyan-300/90">
          <span>PING: {ping}ms</span>
          <span className="text-slate-500">•</span>
          <span className="text-emerald-400 font-semibold">READY</span>
        </div>
      </motion.div>

      {/* ========================================================= */}
      {/* 6. BOTTOM TECH PILL ("REACT • THREE.JS • C++") */}
      {/* ========================================================= */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{
          opacity: 1,
          y: reducedMotion ? 0 : [0, -4, 0],
        }}
        transition={{
          y: {
            duration: 3.8,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1.2,
          },
          opacity: { duration: 0.5, delay: 0.5 },
        }}
        className="absolute -bottom-3 sm:-bottom-4 right-4 sm:right-6 z-30"
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/35 bg-slate-950/85 px-3.5 py-1.5 shadow-[0_4px_20px_rgba(0,0,0,0.5),0_0_15px_rgba(139,92,246,0.2)] backdrop-blur-md">
          <Zap className="h-3 w-3 text-cyan-400 fill-cyan-400/20" />
          <span className="font-mono text-[9px] sm:text-[10px] font-medium tracking-widest text-slate-300">
            REACT • THREE.JS • C++
          </span>
        </div>
      </motion.div>
    </div>
  );
}

export default AvatarPortal;
