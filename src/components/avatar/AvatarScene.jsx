import React, { useRef, useEffect, useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useProgress, Environment } from '@react-three/drei';
import { AvatarModel } from './AvatarModel';
import * as THREE from 'three';

/**
 * Scene Floating Particles
 * Faint ambient dust particles around the 3D character (scaled down on mobile)
 */
function PortalParticles({ reducedMotion }) {
  const pointsRef = useRef();
  const count = typeof window !== 'undefined' && window.innerWidth < 640 ? 30 : 65;

  const [positions] = useState(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * 2.8;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 2.8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 1.5;
    }
    return pos;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color="#38bdf8"
        transparent
        opacity={0.45}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

/**
 * Loading state with pulsing ring and percentage from useProgress
 */
function LoaderOverlay() {
  const { active, progress } = useProgress();
  if (!active) return null;

  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-full bg-slate-950/80 backdrop-blur-sm">
      <div className="relative flex h-16 w-16 items-center justify-center">
        <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-cyan-400 border-r-violet-500" />
        <span className="font-mono text-xs font-bold text-cyan-300">
          {Math.round(progress)}%
        </span>
      </div>
      <span className="mt-2 font-mono text-[11px] tracking-wider text-slate-400">
        LOADING 3D AVATAR...
      </span>
    </div>
  );
}

/**
 * Static 2D WebGL Fallback
 * Used when WebGL is unavailable or fails completely.
 */
function StaticFallback({ fallbackImg, mouseNorm }) {
  const tiltX = (mouseNorm?.y || 0) * 12;
  const tiltY = (mouseNorm?.x || 0) * -14;

  return (
    <div
      className="relative h-full w-full overflow-hidden rounded-full transition-transform duration-200 ease-out"
      style={{
        transform: `perspective(600px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
      }}
    >
      <img
        src={fallbackImg}
        alt="Avatar fallback portrait"
        className="h-full w-full object-cover"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-cyan-900/20" />
    </div>
  );
}

/**
 * AvatarScene
 * 
 * - Fixed PerspectiveCamera (fov ~30)
 * - 3 Lights: Soft Key + Cyan Rim + Magenta Rim
 * - alpha: true (transparent canvas so radial teal background & glow show through)
 * - IntersectionObserver pauses frameloop when off-screen
 * - Accessible aria-hidden canvas
 */
export function AvatarScene({
  targetRef,
  modelUrl = '/models/avatar.glb',
  reducedMotion = false,
  fallbackImg = '/rizwan-3d-avatar.jpg',
  mouseNorm = { x: 0, y: 0 },
}) {
  const containerRef = useRef();
  const [isVisible, setIsVisible] = useState(true);
  const [hasWebGLError, setHasWebGLError] = useState(false);

  // Pause frameloop when off-screen
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  if (hasWebGLError) {
    return <StaticFallback fallbackImg={fallbackImg} mouseNorm={mouseNorm} />;
  }

  return (
    <div ref={containerRef} className="relative h-full w-full">
      <LoaderOverlay />

      <Canvas
        dpr={[1, 1.5]}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
        }}
        camera={{ position: [0, 0, 2.7], fov: 30 }}
        frameloop={isVisible ? 'always' : 'never'}
        fallback={<StaticFallback fallbackImg={fallbackImg} mouseNorm={mouseNorm} />}
        aria-hidden="true"
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0); // Transparent background
        }}
        onError={() => setHasWebGLError(true)}
      >
        {/* 3 LIGHTS ONLY (Max 3 lights as specified) */}
        
        {/* 1. Soft Key Light (warm neutral frontal-angled illumination) */}
        <directionalLight
          position={[1.5, 2.0, 2.2]}
          intensity={1.25}
          color="#f8fafc"
        />

        {/* 2. Cyan Rim Light (from left-behind to highlight cheek & jawline) */}
        <directionalLight
          position={[-2.4, 0.6, -1.2]}
          intensity={2.4}
          color="#22d3ee"
        />

        {/* 3. Magenta Rim Light (from right-behind to highlight hair & shoulder edge) */}
        <directionalLight
          position={[2.4, -0.4, -1.2]}
          intensity={2.0}
          color="#f43f5e"
        />

        {/* Subtle Ambient Reflections */}
        <ambientLight intensity={0.45} color="#0f172a" />

        {/* Floating background particles */}
        {!reducedMotion && <PortalParticles reducedMotion={reducedMotion} />}

        {/* The 3D Avatar (Rigged GLB with Neck/Head rotation or Plan B bust) */}
        <Suspense fallback={null}>
          <AvatarModel
            modelUrl={modelUrl}
            targetRef={targetRef}
            reducedMotion={reducedMotion}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
