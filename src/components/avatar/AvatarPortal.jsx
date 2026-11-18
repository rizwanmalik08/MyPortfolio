import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Zap } from 'lucide-react';
import { Avatar3DPortrait } from './Avatar3DPortrait';
import { useHeadTarget } from './useHeadTarget';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export function AvatarPortal({
  idleInterval = [1.5, 3.5],
  maxYaw = 32 * (Math.PI / 180),
  maxPitch = 16 * (Math.PI / 180),
  maxRoll = 4 * (Math.PI / 180),
  followStrength = 1.0,
}) {
  const portalRef = useRef(null);
  const reducedMotion = useReducedMotion();

  const [isHovered, setIsHovered] = useState(false);
  const [cursorCoords, setCursorCoords] = useState({ normX: 0, normY: 0 });

  const {
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

  // Experience Count-up on load (0 -> 4)
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

  // Fluctuating network ping (12–40ms every 2s)
  const [ping, setPing] = useState(17);
  useEffect(() => {
    const interval = setInterval(() => {
      setPing(Math.floor(12 + Math.random() * 29));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handlePointerEnter = () => {
    setIsHovered(true);
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

    setCursorCoords({ normX, normY });
    onPointerMove(normX, normY);
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    setCursorCoords({ normX: 0, normY: 0 });
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
      className="relative flex items-center justify-center select-none w-[340px] h-[340px] sm:w-[420px] sm:h-[420px] lg:w-[470px] lg:h-[470px] aspect-square mx-auto"
      role="region"
      aria-label="Interactive 3D Avatar Console"
    >
      <span className="sr-only">
        Interactive 3D portrait of Rizwan in a tailored black suit with cursor-tracking lighting and motion.
      </span>

      {/* CLOCKWISE & COUNTER-CLOCKWISE DECORATIVE ORBITS & HUD BRACKETS */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        {/* Outer Clockwise Dotted Ring */}
        <div
          className={`absolute inset-2 sm:inset-0 rounded-full border border-dashed border-cyan-500/25 ${
            reducedMotion ? '' : 'animate-[spin_60s_linear_infinite]'
          }`}
        />
        {/* Inner Counter-Clockwise Orbit Ring */}
        <div
          className={`absolute inset-5 sm:inset-3 rounded-full border border-dotted border-violet-500/20 ${
            reducedMotion ? '' : 'animate-[spin_42s_linear_infinite_reverse]'
          }`}
        />

        {/* Orbiting Satellite Nodes */}
        <div className="absolute -top-1 left-1/4 h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_12px_#22d3ee]" />
        <div className="absolute top-1/3 -right-2 h-1.5 w-1.5 rounded-full bg-violet-400 shadow-[0_0_10px_#a78bfa]" />
        <div className="absolute bottom-10 -left-2 h-2 w-2 rounded-full border border-cyan-400/80 bg-slate-950 shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
        <div className="absolute bottom-4 right-1/4 h-1.5 w-1.5 rounded-full bg-pink-400 shadow-[0_0_8px_#f43f5e]" />

        {/* HUD Markers */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 font-mono text-xs text-cyan-400/80 tracking-widest">[+]</div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 font-mono text-xs text-cyan-400/80 tracking-widest">[+]</div>
        <div className="absolute top-1 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-[0.25em] text-cyan-400/60">// 001</div>
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-[0.25em] text-cyan-400/60">// 2026</div>
      </div>

      {/* ROTATING CONIC GRADIENT RING + SWEPT LIGHT ARC */}
      <div className="relative flex items-center justify-center w-full h-full rounded-full p-[4px] sm:p-[5px] overflow-hidden shadow-[0_0_60px_rgba(124,58,237,0.35),0_0_30px_rgba(34,211,238,0.25)]">
        {/* Conic Gradient (Blue -> Violet -> Pink/Red, ~20s) */}
        <div
          className={`absolute -inset-[50%] bg-[conic-gradient(from_0deg,#2563eb_0%,#7c3aed_35%,#ec4899_70%,#f43f5e_85%,#2563eb_100%)] ${
            reducedMotion ? '' : 'animate-[spin_20s_linear_infinite]'
          }`}
        />

        {/* Sweeping White Light-Arc (~5.2s) */}
        {!reducedMotion && (
          <div className="pointer-events-none absolute -inset-[50%] animate-[spin_5.2s_linear_infinite]">
            <div className="h-full w-full bg-[conic-gradient(from_0deg,transparent_0deg,transparent_310deg,rgba(255,255,255,0.95)_350deg,transparent_360deg)]" />
          </div>
        )}

        {/* Inner Mask Container (clips image cleanly to circle) */}
        <div className="relative w-full h-full rounded-full overflow-hidden bg-slate-950 flex items-center justify-center">
          {/* Dark Space Radial Glow Background */}
          <div
            className="absolute inset-0 -z-10"
            style={{
              background: 'radial-gradient(circle at 50% 42%, #0e122b 0%, #060918 55%, #02050f 100%)',
            }}
          />

          <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 h-56 w-56 rounded-full bg-cyan-500/15 blur-[50px]" />
          <div className="pointer-events-none absolute bottom-1/4 right-1/4 h-48 w-48 rounded-full bg-violet-600/20 blur-[60px]" />

          {/* HIGH-DEFINITION 3D CHARACTER PORTRAIT */}
          <div className="relative w-full h-full">
            <Avatar3DPortrait
              isHovered={isHovered}
              normX={cursorCoords.normX}
              normY={cursorCoords.normY}
              reducedMotion={reducedMotion}
            />
          </div>
        </div>
      </div>

      {/* TOP STATUS PILL */}
      <div className="absolute -top-4 sm:-top-5 left-1/2 -translate-x-1/2 z-30">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-slate-950/85 px-4 py-1.5 shadow-[0_4px_20px_rgba(0,0,0,0.5),0_0_15px_rgba(34,211,238,0.2)] backdrop-blur-md">
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
            <span className="font-mono text-[10px] sm:text-[11px] font-semibold tracking-wider text-slate-200">
              {trackingMode === 'tracking'
                ? 'TRACKING CURSOR // LOCKED'
                : 'AUTONOMOUS IDLE // OBSERVING SCENE'}
            </span>
          </div>
        </motion.div>
      </div>

      {/* TOP-RIGHT GLASS CARD: 4+ YEARS EXP */}
      <motion.div
        initial={{ opacity: 0, x: 20, y: -15 }}
        animate={{
          opacity: 1,
          x: 0,
          y: reducedMotion ? 0 : [0, -6, 0],
        }}
        transition={{
          y: { duration: 4.2, repeat: Infinity, ease: 'easeInOut' },
          opacity: { duration: 0.6, delay: 0.3 },
          x: { duration: 0.6, delay: 0.3 },
        }}
        className="absolute -top-2 -right-4 sm:-right-8 z-20 pointer-events-none"
      >
        <div className="relative rounded-2xl border border-cyan-500/30 bg-slate-950/75 p-3 sm:p-4 shadow-[0_8px_32px_rgba(0,0,0,0.6),0_0_20px_rgba(6,182,212,0.15)] backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div>
              <div className="flex items-baseline gap-1">
                <span className="font-mono text-xl sm:text-2xl font-black text-cyan-400">
                  {expCount}+
                </span>
                <span className="text-[10px] font-mono text-cyan-300/70 tracking-widest uppercase">
                  Years
                </span>
              </div>
              <div className="text-[9px] font-mono text-slate-400 tracking-wider">
                Full-Stack & 3D
              </div>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-400/30">
              <Sparkles className="h-4 w-4 text-cyan-300" />
            </div>
          </div>
          {/* Mini Progress Bar */}
          <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-slate-800/80">
            <div className="h-full w-[90%] rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 shadow-[0_0_8px_#22d3ee]" />
          </div>
        </div>
      </motion.div>

      {/* BOTTOM-LEFT GLASS CARD: AVAILABLE FOR WORK */}
      <motion.div
        initial={{ opacity: 0, x: -20, y: 15 }}
        animate={{
          opacity: 1,
          x: 0,
          y: reducedMotion ? 0 : [0, 6, 0],
        }}
        transition={{
          y: { duration: 4.6, repeat: Infinity, ease: 'easeInOut', delay: 0.4 },
          opacity: { duration: 0.6, delay: 0.4 },
          x: { duration: 0.6, delay: 0.4 },
        }}
        className="absolute -bottom-2 -left-4 sm:-left-8 z-20 pointer-events-none"
      >
        <div className="relative rounded-2xl border border-emerald-500/30 bg-slate-950/75 p-3 sm:p-3.5 shadow-[0_8px_32px_rgba(0,0,0,0.6),0_0_20px_rgba(16,185,129,0.15)] backdrop-blur-xl">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
            </span>
            <div>
              <div className="font-mono text-[11px] sm:text-xs font-bold tracking-wider text-emerald-300">
                AVAILABLE FOR WORK
              </div>
              <div className="font-mono text-[9px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                <span>PING: {ping}ms</span>
                <span>•</span>
                <span className="text-emerald-400/90 font-semibold">ONLINE</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* BOTTOM-RIGHT TECH PILL */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="absolute -bottom-4 sm:-bottom-5 right-2 sm:right-6 z-20 pointer-events-none"
      >
        <div className="inline-flex items-center gap-1.5 rounded-full border border-violet-500/40 bg-slate-950/85 px-3 py-1 text-[9px] sm:text-[10px] font-mono tracking-wider text-violet-300 shadow-[0_0_15px_rgba(139,92,246,0.25)] backdrop-blur-md">
          <Zap className="h-3 w-3 text-cyan-400" />
          <span>REACT • THREE.JS • 3D WEB</span>
        </div>
      </motion.div>
    </div>
  );
}

export default AvatarPortal;
