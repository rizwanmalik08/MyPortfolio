import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Sparkles, Activity, CheckCircle2, Zap, Target, Eye } from 'lucide-react';
import { soundManager } from '../../utils/audioFX';
import rizwanPhoto from '../../assets/rizwan.jpg.png';

// Theme Presets for Image & Lighting Grading
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

/**
 * 3D Scene Running INSIDE the Image Frame Lens
 * Renders an interactive 3D Gyroscopic Halo Ring, 3D Orbiting Stardust,
 * and a 3D Cursor Tracking Target Reticle right inside the portrait portal!
 */
function InsidePortal3D({ mouseNorm, theme }) {
  const ringRef = useRef();
  const ring2Ref = useRef();
  const targetRef = useRef();
  const particlesRef = useRef();

  // Generate 42 floating stardust particles in 3D volume
  const [particlePos, particleColors] = useMemo(() => {
    const count = 42;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const c1 = new THREE.Color(theme.accent2);
    const c2 = new THREE.Color(theme.accent1);

    for (let i = 0; i < count; i++) {
      // Cylindrical/spherical distribution inside the circular frame
      const radius = 0.2 + Math.random() * 0.95;
      const angle = Math.random() * Math.PI * 2;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = Math.sin(angle) * radius;
      pos[i * 3 + 2] = -0.3 + Math.random() * 0.9; // Z depth: some behind (z<0), some in front (z>0)

      const c = Math.random() > 0.4 ? c1 : c2;
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return [pos, col];
  }, [theme]);

  useFrame((state, delta) => {
    const clampedDelta = Math.min(delta, 0.05);

    // 1. Smooth 3D tilt reaction from mouse
    const targetRotX = mouseNorm.y * -0.55;
    const targetRotY = mouseNorm.x * 0.55;

    // 2. Gyroscopic 3D Ring 1 (Electric Cyan / Accent 2)
    if (ringRef.current) {
      ringRef.current.rotation.z += clampedDelta * 0.35;
      ringRef.current.rotation.x = THREE.MathUtils.damp(ringRef.current.rotation.x, 1.1 + targetRotX, 3, clampedDelta);
      ringRef.current.rotation.y = THREE.MathUtils.damp(ringRef.current.rotation.y, targetRotY, 3, clampedDelta);
    }

    // 3. Gyroscopic 3D Ring 2 (Violet / Accent 1)
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z -= clampedDelta * 0.25;
      ring2Ref.current.rotation.x = THREE.MathUtils.damp(ring2Ref.current.rotation.x, -0.8 + targetRotX, 3, clampedDelta);
      ring2Ref.current.rotation.y = THREE.MathUtils.damp(ring2Ref.current.rotation.y, targetRotY, 3, clampedDelta);
    }

    // 4. 3D Floating Target Reticle: Tracks mouse inside lens with spring lag
    if (targetRef.current) {
      const tx = mouseNorm.x * 0.85;
      const ty = mouseNorm.y * 0.85;
      targetRef.current.position.x = THREE.MathUtils.damp(targetRef.current.position.x, tx, 4, clampedDelta);
      targetRef.current.position.y = THREE.MathUtils.damp(targetRef.current.position.y, ty, 4, clampedDelta);
      targetRef.current.rotation.z += clampedDelta * 0.8;
    }

    // 5. Floating 3D Stardust Drift
    if (particlesRef.current) {
      particlesRef.current.rotation.z += clampedDelta * 0.05;
      particlesRef.current.rotation.x = THREE.MathUtils.damp(particlesRef.current.rotation.x, targetRotX * 0.5, 2, clampedDelta);
      particlesRef.current.rotation.y = THREE.MathUtils.damp(particlesRef.current.rotation.y, targetRotY * 0.5, 2, clampedDelta);
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* 3D Dynamic Point Light: Moves with cursor and casts real specular glow inside lens */}
      <pointLight
        position={[mouseNorm.x * 1.5, mouseNorm.y * 1.5, 1.2]}
        intensity={2.8}
        color={theme.accent2}
        distance={4}
      />
      <ambientLight intensity={0.5} />

      {/* 3D Primary Hologram Halo Ring (Orbiting inside the frame) */}
      <mesh ref={ringRef} position={[0, 0, 0.15]}>
        <torusGeometry args={[0.92, 0.007, 16, 64]} />
        <meshStandardMaterial
          color={theme.accent2}
          emissive={theme.accent2}
          emissiveIntensity={2.0}
          transparent
          opacity={0.65}
        />
      </mesh>

      {/* 3D Secondary Tilted Ring */}
      <mesh ref={ring2Ref} position={[0, 0, 0.05]}>
        <torusGeometry args={[0.82, 0.005, 16, 64]} />
        <meshStandardMaterial
          color={theme.accent1}
          emissive={theme.accent1}
          emissiveIntensity={1.8}
          transparent
          opacity={0.5}
        />
      </mesh>

      {/* 3D Orbiting Satellite Node on Ring 1 */}
      <mesh position={[0.92, 0, 0.15]}>
        <sphereGeometry args={[0.028, 16, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* 3D Cursor Target Reticle floating at depth */}
      <group ref={targetRef} position={[0.2, 0.3, 0.4]}>
        {/* Reticle Outer Ring */}
        <mesh>
          <ringGeometry args={[0.075, 0.09, 32]} />
          <meshBasicMaterial color={theme.accent2} transparent opacity={0.8} side={THREE.DoubleSide} />
        </mesh>
        {/* Reticle Center Dot */}
        <mesh>
          <circleGeometry args={[0.02, 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        {/* Reticle Crosshair Ticks */}
        <mesh position={[0.11, 0, 0]}>
          <planeGeometry args={[0.04, 0.008]} />
          <meshBasicMaterial color={theme.accent2} />
        </mesh>
        <mesh position={[-0.11, 0, 0]}>
          <planeGeometry args={[0.04, 0.008]} />
          <meshBasicMaterial color={theme.accent2} />
        </mesh>
        <mesh position={[0, 0.11, 0]}>
          <planeGeometry args={[0.008, 0.04]} />
          <meshBasicMaterial color={theme.accent2} />
        </mesh>
        <mesh position={[0, -0.11, 0]}>
          <planeGeometry args={[0.008, 0.04]} />
          <meshBasicMaterial color={theme.accent2} />
        </mesh>
      </group>

      {/* 3D Floating Stardust Particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={42}
            array={particlePos}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={42}
            array={particleColors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.038}
          vertexColors
          transparent
          opacity={0.75}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}

export function CyberAvatar() {
  const containerRef = useRef(null);
  const [themeKey, setThemeKey] = useState('cyber');
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [mouseNorm, setMouseNorm] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [ping, setPing] = useState(16);

  const theme = THEMES[themeKey];

  // Random subtle ping jitter for high-tech alive feeling
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

    // Normalised between -1 and 1
    const normX = (x - centerX) / centerX;
    const normY = (y - centerY) / centerY;

    setMouseNorm({ x: normX, y: -normY });
    setTilt({
      x: normY * -15, // Tilt up/down
      y: normX * 15,  // Tilt left/right
    });
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

  return (
    <div className="relative flex flex-col items-center justify-center">
      
      {/* 3D PERSPECTIVE WRAPPER */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="relative w-80 h-80 sm:w-96 sm:h-96 select-none cursor-pointer"
        style={{
          perspective: '1200px',
        }}
      >
        {/* INTERACTIVE 3D GIMBAL LAYER */}
        <div
          className="relative w-full h-full transition-transform duration-300 ease-out"
          style={{
            transformStyle: 'preserve-3d',
            transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${isHovered ? 1.03 : 1})`,
          }}
        >

          {/* 1. DEEP AMBIENT VOLUMETRIC GLOW (Pulsing back aura) */}
          <div
            className={`absolute -inset-6 rounded-full bg-gradient-to-tr ${theme.glow} blur-3xl opacity-75 transition-all duration-700 pointer-events-none`}
            style={{ transform: 'translateZ(-40px)' }}
          />

          {/* 2. OUTER PRECISION RADAR ORBIT RINGS */}
          <div
            className="pointer-events-none absolute -inset-8 rounded-full border border-cyan-400/20 border-dashed animate-[spin_40s_linear_infinite]"
            style={{ transform: 'translateZ(-15px)' }}
          >
            {/* Traveling Satellite Pulse Node */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
              <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_12px_#38bdf8] animate-ping" />
              <span className="h-1.5 w-1.5 rounded-full bg-white absolute" />
            </div>
          </div>

          <div
            className="pointer-events-none absolute -inset-14 rounded-full border border-violet-500/20 border-dotted animate-[spin_60s_linear_infinite_reverse]"
            style={{ transform: 'translateZ(-25px)' }}
          >
            {/* Second Counter-Orbit Node */}
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
            <div className="relative h-full w-full rounded-full bg-[#0a0c1a] p-2 overflow-hidden backdrop-blur-2xl">
              
              {/* IMAGE PORTAL: MULTI-PLANE 3D CONTAINER */}
              <div
                className="relative h-full w-full rounded-full overflow-hidden bg-slate-950"
                style={{ transformStyle: 'preserve-3d' }}
              >
                
                {/* A. DEEP 3D BACKGROUND VOID MATRIX (Shifts opposite to mouse for depth) */}
                <div
                  className="pointer-events-none absolute inset-[-15%] bg-[radial-gradient(rgba(56,189,248,0.12)_1px,transparent_1px)] [background-size:20px_20px] transition-transform duration-200"
                  style={{
                    transform: `translate3d(${mouseNorm.x * -14}px, ${mouseNorm.y * 14}px, -20px)`,
                  }}
                />

                {/* B. REAL USER PHOTO (Layer 0 on Z-axis with subtle parallax) */}
                <div
                  className="relative h-full w-full transition-transform duration-200"
                  style={{
                    transform: `translate3d(${mouseNorm.x * 6}px, ${mouseNorm.y * -6}px, 0px) scale(1.05)`,
                  }}
                >
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
                </div>

                {/* C. THEME GRADING LAYER (Blends image seamlessly into dark theme) */}
                <div
                  className={`pointer-events-none absolute inset-0 bg-gradient-to-tr ${theme.overlayGrad} mix-blend-soft-light transition-all duration-700`}
                />

                {/* D. SPECULAR RIM LIGHTING CONTOUR */}
                <div
                  className="pointer-events-none absolute inset-0 rounded-full transition-transform duration-200"
                  style={{
                    background: `radial-gradient(circle at ${50 + mouseNorm.x * 20}% ${40 - mouseNorm.y * 20}%, ${theme.specular} 0%, transparent 65%)`,
                    mixBlendMode: 'screen',
                  }}
                />

                {/* E. VIGNETTE EDGE FALLOFF */}
                <div
                  className="pointer-events-none absolute inset-0 rounded-full"
                  style={{
                    background: 'radial-gradient(circle at center, transparent 58%, rgba(5, 6, 15, 0.85) 100%)',
                  }}
                />

                {/* F. GENUINE 3D THREE.JS WEBGL CANVAS RUNNING INSIDE THE LENS */}
                <div className="pointer-events-none absolute inset-0 rounded-full overflow-hidden">
                  <Canvas
                    camera={{ position: [0, 0, 2.5], fov: 45 }}
                    gl={{
                      alpha: true,
                      antialias: true,
                      powerPreference: 'high-performance',
                    }}
                    className="w-full h-full"
                  >
                    <InsidePortal3D mouseNorm={mouseNorm} theme={theme} />
                  </Canvas>
                </div>

                {/* G. HOLOGRAPHIC LIGHT SHIMMER SCAN (Sweeps across photo every 5s) */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
                  <div className="h-full w-full bg-gradient-to-r from-transparent via-cyan-400/25 to-transparent animate-shimmer" />
                </div>

                {/* H. 3D CONVEX GLASS LENS SPECULAR GLARE (Moves dynamically with cursor) */}
                <div
                  className="pointer-events-none absolute inset-0 rounded-full transition-opacity duration-300"
                  style={{
                    background: `linear-gradient(${125 + mouseNorm.x * 30}deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.03) 40%, transparent 60%)`,
                    opacity: isHovered ? 0.9 : 0.45,
                  }}
                />

                {/* I. HUD TELEMETRY METERS INSIDE LENS */}
                <div className="pointer-events-none absolute bottom-3 inset-x-0 flex items-center justify-between px-6 text-[8px] font-mono text-cyan-300/60 uppercase tracking-widest">
                  <span>DEPTH: 3D PORTAL</span>
                  <span>Z: +{(32 + mouseNorm.x * 8).toFixed(1)}mm</span>
                </div>

              </div>

            </div>
          </div>

          {/* 5. FLOATING TELEMETRY CHIP 1: EXPERIENCE MATRIX */}
          <motion.div
            className="absolute -top-3 -right-3 sm:top-2 sm:-right-4 rounded-2xl border border-cyan-400/40 bg-slate-900/90 p-3.5 backdrop-blur-xl shadow-[0_15px_35px_rgba(0,0,0,0.7)] text-center min-w-[96px] transition-all duration-300 hover:border-cyan-300 hover:scale-105"
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
            className="absolute -bottom-3 -left-3 sm:bottom-2 sm:-left-4 rounded-2xl border border-emerald-400/40 bg-slate-900/90 p-3.5 backdrop-blur-xl shadow-[0_15px_35px_rgba(0,0,0,0.7)] flex items-center gap-3 transition-all duration-300 hover:border-emerald-300 hover:scale-105"
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
            className="absolute -bottom-5 right-4 rounded-xl border border-violet-500/40 bg-slate-950/90 px-3.5 py-1.5 backdrop-blur-xl shadow-xl transition-all duration-300 hover:border-violet-400 hover:scale-105"
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
        className="mt-8 flex items-center gap-1.5 rounded-full border border-white/10 bg-slate-900/80 p-1 backdrop-blur-xl shadow-lg"
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
