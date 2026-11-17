import { useState, useRef, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Sparkles, Activity, CheckCircle2, Zap, Bot, User, Eye, RotateCcw, Move3d } from 'lucide-react';
import { soundManager } from '../../utils/audioFX';
import { CyberCharacter } from '../canvas/CyberCharacter';
import rizwanPhoto from '../../assets/rizwan.jpg.png';

// Theme Presets for Image & Character Lighting
const THEMES = {
  cyber: {
    id: 'cyber',
    label: 'Cyber Neon',
    accent1: '#7c3aed', // Violet
    accent2: '#22d3ee', // Cyan
    accent3: '#f43f5e', // Rose
    glow: 'from-violet-600/40 via-cyan-500/30 to-pink-500/25',
    border: 'border-cyan-400/50',
    beam: 'bg-[conic-gradient(from_0deg,#7c3aed,#22d3ee,#f43f5e,#7c3aed)]',
    photoFilter: 'contrast(1.08) brightness(1.02)',
    overlayGrad: 'from-violet-950/40 via-transparent to-cyan-950/30',
    specular: 'rgba(34, 211, 238, 0.25)',
  },
  studio: {
    id: 'studio',
    label: 'Executive Studio',
    accent1: '#38bdf8', // Sky
    accent2: '#818cf8', // Indigo
    accent3: '#e2e8f0', // Platinum
    glow: 'from-sky-600/35 via-indigo-500/25 to-slate-400/20',
    border: 'border-sky-400/45',
    beam: 'bg-[conic-gradient(from_0deg,#38bdf8,#818cf8,#c084fc,#38bdf8)]',
    photoFilter: 'contrast(1.12) brightness(0.98)',
    overlayGrad: 'from-slate-950/50 via-transparent to-sky-950/35',
    specular: 'rgba(56, 189, 248, 0.22)',
  },
  matrix: {
    id: 'matrix',
    label: 'Emerald Matrix',
    accent1: '#10b981', // Emerald
    accent2: '#06b6d4', // Cyan
    accent3: '#2dd4bf', // Teal
    glow: 'from-emerald-600/35 via-teal-500/25 to-cyan-400/20',
    border: 'border-emerald-400/45',
    beam: 'bg-[conic-gradient(from_0deg,#10b981,#06b6d4,#2dd4bf,#10b981)]',
    photoFilter: 'contrast(1.06) brightness(1.0)',
    overlayGrad: 'from-emerald-950/40 via-transparent to-teal-950/35',
    specular: 'rgba(16, 185, 129, 0.22)',
  },
};

export function CyberAvatar() {
  const containerRef = useRef(null);
  const [viewMode, setViewMode] = useState('character'); // 'character' | 'portrait'
  const [themeKey, setThemeKey] = useState('cyber');
  const [autoRotate, setAutoRotate] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [mouseNorm, setMouseNorm] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [ping, setPing] = useState(16);

  const theme = THEMES[themeKey];

  // Random subtle ping jitter
  useEffect(() => {
    const interval = setInterval(() => {
      setPing(Math.floor(14 + Math.random() * 8));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // 3D Parallax Mouse Tracking
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const normX = (x - centerX) / centerX;
    const normY = (y - centerY) / centerY;

    setMouseNorm({ x: normX, y: -normY });
    
    // Only apply card tilt when user is not directly dragging the 3D model
    if (!isDragging) {
      setTilt({
        x: normY * -8,
        y: normX * 8,
      });
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    soundManager.playHover();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
    setMouseNorm({ x: 0, y: 0 });
  };

  const handleThemeChange = (key) => {
    soundManager.playClick();
    setThemeKey(key);
  };

  const handleModeSwitch = (mode) => {
    soundManager.playClick();
    setViewMode(mode);
  };

  return (
    <div className="relative flex flex-col items-center justify-center">

      {/* MODE SELECTOR TOGGLE (3D Character vs Real Portrait) */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-3 flex items-center gap-1.5 rounded-full border border-white/15 bg-slate-900/90 p-1.5 backdrop-blur-xl shadow-xl z-20"
      >
        <button
          onClick={() => handleModeSwitch('character')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold transition-all duration-300 ${
            viewMode === 'character'
              ? 'bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow-lg shadow-cyan-500/25 scale-105'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Bot className="h-3.5 w-3.5 text-cyan-300" />
          <span>3D Avatar Model</span>
        </button>

        <button
          onClick={() => handleModeSwitch('portrait')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold transition-all duration-300 ${
            viewMode === 'portrait'
              ? 'bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow-lg shadow-cyan-500/25 scale-105'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <User className="h-3.5 w-3.5 text-violet-300" />
          <span>Real Portrait</span>
        </button>
      </motion.div>

      {/* 3D INTERACTION CONTROLS BAR (DRAG TO ROTATE & 360 SPIN) */}
      {viewMode === 'character' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-3 flex items-center gap-2 z-20"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-[10px] font-mono text-cyan-300 backdrop-blur-md shadow-sm">
            <Move3d className="h-3 w-3 text-cyan-400 animate-pulse" />
            <span>DRAG TO ROTATE 3D</span>
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              setAutoRotate((prev) => !prev);
            }}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold transition-all duration-300 ${
              autoRotate
                ? 'bg-gradient-to-r from-cyan-500 to-violet-600 text-white shadow-md shadow-cyan-500/30'
                : 'bg-slate-900/80 border border-white/15 text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <RotateCcw className={`h-3 w-3 ${autoRotate ? 'animate-spin' : ''}`} />
            <span>360° SPIN</span>
          </button>
        </motion.div>
      )}
      
      {/* 3D PERSPECTIVE WRAPPER */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="relative w-80 h-80 sm:w-96 sm:h-96 select-none cursor-grab active:cursor-grabbing"
        style={{
          perspective: '1200px',
        }}
      >
        {/* INTERACTIVE 3D GIMBAL LAYER */}
        <div
          className="relative w-full h-full transition-transform duration-300 ease-out"
          style={{
            transformStyle: 'preserve-3d',
            transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${isHovered ? 1.02 : 1})`,
          }}
        >

          {/* 1. DEEP AMBIENT VOLUMETRIC GLOW */}
          <div
            className={`absolute -inset-6 rounded-full bg-gradient-to-tr ${theme.glow} blur-3xl opacity-75 transition-all duration-700 pointer-events-none`}
            style={{ transform: 'translateZ(-40px)' }}
          />

          {/* 2. OUTER PRECISION RADAR ORBIT RINGS */}
          <div
            className="pointer-events-none absolute -inset-8 rounded-full border border-cyan-400/20 border-dashed animate-[spin_40s_linear_infinite]"
            style={{ transform: 'translateZ(-15px)' }}
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
              <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_12px_#38bdf8] animate-ping" />
              <span className="h-1.5 w-1.5 rounded-full bg-white absolute" />
            </div>
          </div>

          <div
            className="pointer-events-none absolute -inset-14 rounded-full border border-violet-500/20 border-dotted animate-[spin_60s_linear_infinite_reverse]"
            style={{ transform: 'translateZ(-25px)' }}
          >
            <div className="absolute bottom-0 right-1/4 flex items-center justify-center">
              <span className="h-2 w-2 rounded-full bg-violet-400 shadow-[0_0_12px_#a855f7]" />
            </div>
          </div>

          {/* 3. PRECISION HUD CORNER BRACKETS */}
          <div
            className="pointer-events-none absolute -inset-3 flex items-center justify-between text-[11px] font-mono text-cyan-400/40 px-1"
            style={{ transform: 'translateZ(10px)' }}
          >
            <span>[+]</span>
            <span>[+]</span>
          </div>
          <div
            className="pointer-events-none absolute -inset-3 flex flex-col items-center justify-between text-[11px] font-mono text-cyan-400/40 py-1"
            style={{ transform: 'translateZ(10px)' }}
          >
            <span>// 001</span>
            <span>// 2026</span>
          </div>

          {/* 4. MAIN AVATAR CONTAINER WITH CONIC GRADIENT BORDER BEAM */}
          <div
            className="relative h-full w-full rounded-full p-[3px] overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.85)]"
            style={{ transform: 'translateZ(0px)' }}
          >
            {/* Animated Conic Gradient Beam */}
            <div
              className={`absolute inset-[-200%] animate-[spin_4s_linear_infinite] ${theme.beam}`}
            />

            {/* Inner Dark Bevel Disc */}
            <div className="relative h-full w-full rounded-full bg-[#070916] p-2 overflow-hidden backdrop-blur-2xl">
              
              {/* STAGE CONTAINER */}
              <div
                className="relative h-full w-full rounded-full overflow-hidden bg-slate-950 flex items-center justify-center"
                style={{ transformStyle: 'preserve-3d' }}
              >
                
                {/* MODE A: MOVABLE 3D AVATAR MODEL (Interactive OrbitControls & Depth Mesh) */}
                {viewMode === 'character' ? (
                  <div className="relative w-full h-full cursor-grab active:cursor-grabbing">
                    {/* Background Tech Grid */}
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(56,189,248,0.12)_1px,transparent_1px)] [background-size:18px_18px]" />

                    {/* Dedicated Three.js 3D Avatar Canvas with OrbitControls */}
                    <Canvas
                      camera={{ position: [0, 0, 3.1], fov: 44 }}
                      gl={{
                        alpha: true,
                        antialias: true,
                        powerPreference: 'high-performance',
                      }}
                      className="w-full h-full"
                    >
                      <Suspense fallback={null}>
                        <CyberCharacter
                          mouseNorm={mouseNorm}
                          theme={themeKey}
                          autoRotate={autoRotate}
                          isDragging={isDragging}
                          onDragChange={setIsDragging}
                        />
                      </Suspense>
                    </Canvas>

                    {/* Model Telemetry Footer */}
                    <div className="pointer-events-none absolute bottom-2.5 inset-x-0 flex items-center justify-between px-6 text-[8px] font-mono text-cyan-300/70 uppercase tracking-widest">
                      <span>3D MODEL: RIZWAN</span>
                      <span>ORBIT: ACTIVE</span>
                    </div>
                  </div>
                ) : (
                  /* MODE B: REAL PORTRAIT (Clean, stylish, zero rings over tie) */
                  <div className="relative w-full h-full">
                    {/* Portrait Photo */}
                    <img
                      src={rizwanPhoto}
                      alt="Rizwan"
                      className="h-full w-full rounded-full object-cover transition-all duration-700"
                      style={{
                        filter: theme.photoFilter,
                      }}
                      width="600"
                      height="600"
                      loading="eager"
                    />

                    {/* Theme Color Grading */}
                    <div
                      className={`pointer-events-none absolute inset-0 bg-gradient-to-tr ${theme.overlayGrad} mix-blend-soft-light transition-all duration-700`}
                    />

                    {/* Specular Rim Highlight */}
                    <div
                      className="pointer-events-none absolute inset-0 rounded-full"
                      style={{
                        background: `radial-gradient(circle at 65% 30%, ${theme.specular} 0%, transparent 65%)`,
                        mixBlendMode: 'screen',
                      }}
                    />

                    {/* Edge Vignette */}
                    <div
                      className="pointer-events-none absolute inset-0 rounded-full"
                      style={{
                        background: 'radial-gradient(circle at center, transparent 60%, rgba(5, 6, 15, 0.85) 100%)',
                      }}
                    />

                    {/* Laser Shimmer Scan */}
                    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
                      <div className="h-full w-full bg-gradient-to-r from-transparent via-cyan-400/25 to-transparent animate-shimmer" />
                    </div>
                  </div>
                )}

                {/* 3D Convex Glass Lens Reflection (Works on both modes) */}
                <div
                  className="pointer-events-none absolute inset-0 rounded-full transition-opacity duration-300"
                  style={{
                    background: `linear-gradient(${125 + mouseNorm.x * 25}deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.02) 40%, transparent 60%)`,
                    opacity: isHovered ? 0.85 : 0.4,
                  }}
                />

              </div>

            </div>
          </div>

          {/* 5. FLOATING TELEMETRY CHIP 1: EXPERIENCE MATRIX */}
          <motion.div
            className="absolute -top-3 -right-3 sm:top-2 sm:-right-4 rounded-2xl border border-cyan-400/40 bg-slate-900/90 p-3.5 backdrop-blur-xl shadow-[0_15px_35px_rgba(0,0,0,0.7)] text-center min-w-[96px] transition-all duration-300 hover:border-cyan-300 hover:scale-105 pointer-events-auto"
            style={{ transform: 'translateZ(55px)' }}
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
          >
            <div className="flex items-center justify-center gap-1">
              <span className="block text-2xl font-black text-cyan-300 font-mono tracking-tight">4+</span>
              <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
            </div>
            <span className="text-[9px] uppercase tracking-widest text-slate-400 font-mono block">
              YEARS EXP
            </span>
            {/* Live Progress Bar with Shimmer */}
            <div className="mt-2 h-1.5 w-full rounded-full bg-white/10 overflow-hidden relative">
              <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500 w-4/5 relative">
                <span className="absolute inset-0 bg-white/40 animate-pulse" />
              </div>
            </div>
          </motion.div>

          {/* 6. FLOATING TELEMETRY CHIP 2: LIVE AVAILABILITY BEACON */}
          <motion.div
            className="absolute -bottom-3 -left-3 sm:bottom-2 sm:-left-4 rounded-2xl border border-emerald-400/40 bg-slate-900/90 p-3.5 backdrop-blur-xl shadow-[0_15px_35px_rgba(0,0,0,0.7)] flex items-center gap-3 transition-all duration-300 hover:border-emerald-300 hover:scale-105 pointer-events-auto"
            style={{ transform: 'translateZ(60px)' }}
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut', delay: 0.3 }}
          >
            <div className="flex h-3.5 w-3.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 shadow-[0_0_12px_#10b981]" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
                <span>AVAILABLE FOR WORK</span>
                <CheckCircle2 className="h-3 w-3 text-emerald-400" />
              </p>
              <p className="text-[10px] text-cyan-300 font-mono flex items-center gap-2">
                <span>PING: {ping}ms</span>
                <span className="text-slate-500">•</span>
                <span className="text-emerald-400">READY</span>
              </p>
            </div>
          </motion.div>

          {/* 7. FLOATING TELEMETRY CHIP 3: TECH CORE PILL */}
          <motion.div
            className="absolute -bottom-5 right-4 rounded-xl border border-violet-500/40 bg-slate-950/90 px-3.5 py-1.5 backdrop-blur-xl shadow-xl transition-all duration-300 hover:border-violet-400 hover:scale-105 pointer-events-auto"
            style={{ transform: 'translateZ(50px)' }}
            animate={{ y: [0, -4, 0] }}
            transition={{ repeat: Infinity, duration: 3.8, ease: 'easeInOut', delay: 0.7 }}
          >
            <div className="flex items-center gap-2 text-[10px] font-mono text-violet-300">
              <Zap className="h-3 w-3 text-violet-400" />
              <span>REACT • THREE.JS • C++</span>
            </div>
          </motion.div>

        </div>
      </div>

      {/* 8. INTERACTIVE AESTHETIC THEME PRESET SWITCHER */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="mt-6 flex items-center gap-1.5 rounded-full border border-white/10 bg-slate-900/80 p-1 backdrop-blur-xl shadow-lg"
      >
        <span className="pl-3 pr-2 text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Eye className="h-3 w-3 text-cyan-400" />
          <span>Aesthetic:</span>
        </span>
        {Object.values(THEMES).map((t) => {
          const active = themeKey === t.id;
          return (
            <button
              key={t.id}
              onClick={() => handleThemeChange(t.id)}
              className={`px-3 py-1 rounded-full text-[11px] font-mono transition-all duration-300 ${
                active
                  ? 'bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-bold shadow-md shadow-cyan-500/25 scale-105'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </motion.div>

    </div>
  );
}
