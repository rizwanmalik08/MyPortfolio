import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { FluidAurora } from './FluidAurora';
import { ParticleWave } from './ParticleWave';
import { ArchitecturalConstellation } from './ArchitecturalConstellation';
import { AmbientDust } from './AmbientDust';
import { SkillsCloud } from './SkillsCloud';
import { ProjectsBackground } from './ProjectsBackground';
import { ContactPortal } from './ContactPortal';
import { CanvasErrorBoundary } from './CanvasErrorBoundary';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/**
 * Dynamic Section Mood Lighting
 * Shifts accent lighting smoothly between section themes on scroll
 */
function DynamicSectionLighting({ scrollRef, scrollProgress = 0 }) {
  const light1Ref = useRef();
  const light2Ref = useRef();

  useFrame(() => {
    if (!light1Ref.current || !light2Ref.current) return;
    const p = scrollRef ? scrollRef.current : scrollProgress;

    // Smooth section-aware chromatic mood transitions
    if (p < 0.25) {
      // Hero: Celestial Indigo & Cyan
      light1Ref.current.color.lerp(new THREE.Color('#6366f1'), 0.05);
      light2Ref.current.color.lerp(new THREE.Color('#06b6d4'), 0.05);
    } else if (p < 0.5) {
      // About & SMM: Tech Emerald & Cyan
      light1Ref.current.color.lerp(new THREE.Color('#10b981'), 0.05);
      light2Ref.current.color.lerp(new THREE.Color('#0ea5e9'), 0.05);
    } else if (p < 0.75) {
      // Services & Skills: Electric Violet & Sky Cyan
      light1Ref.current.color.lerp(new THREE.Color('#8b5cf6'), 0.05);
      light2Ref.current.color.lerp(new THREE.Color('#38bdf8'), 0.05);
    } else {
      // Contact: Celestial Rose & Royal Amethyst
      light1Ref.current.color.lerp(new THREE.Color('#f43f5e'), 0.05);
      light2Ref.current.color.lerp(new THREE.Color('#a855f7'), 0.05);
    }
  });

  return (
    <>
      <ambientLight intensity={0.88} />
      <directionalLight position={[5, 8, 5]} intensity={1.1} color="#ffffff" />
      <pointLight ref={light1Ref} position={[-4, 3, 3]} intensity={1.9} color="#6366f1" distance={14} />
      <pointLight ref={light2Ref} position={[4, -2, 3]} intensity={1.7} color="#06b6d4" distance={14} />
    </>
  );
}

/**
 * Camera Controller
 * Smooth cinematic camera glide through 3D space linked to user scroll
 */
function CameraController({ scrollRef, scrollProgress = 0, prefersReducedMotion }) {
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((state, delta) => {
    const clampedDelta = Math.min(delta, 0.05);
    const p = scrollRef ? scrollRef.current : scrollProgress;

    if (prefersReducedMotion) {
      const targetY = -p * 2.2;
      state.camera.position.x = THREE.MathUtils.damp(state.camera.position.x, 0, 2, clampedDelta);
      state.camera.position.y = THREE.MathUtils.damp(state.camera.position.y, targetY, 2, clampedDelta);
      state.camera.position.z = THREE.MathUtils.damp(state.camera.position.z, 5.8, 2, clampedDelta);
      state.camera.lookAt(0, targetY, 0);
      return;
    }

    let targetX = 0;
    let targetY = 0;
    let targetZ = 5.5;
    let lookX = 0;
    let lookY = 0;

    if (p < 0.18) {
      // Hero: Head-on view
      const t = p / 0.18;
      targetX = THREE.MathUtils.lerp(0, 0.3, t);
      targetY = THREE.MathUtils.lerp(0, -0.6, t);
      targetZ = THREE.MathUtils.lerp(5.5, 5.2, t);
      lookY = targetY;
    } else if (p < 0.36) {
      // About: Pan right to frame profile card
      const t = (p - 0.18) / 0.18;
      targetX = THREE.MathUtils.lerp(0.3, 0.8, t);
      targetY = THREE.MathUtils.lerp(-0.6, -1.8, t);
      targetZ = THREE.MathUtils.lerp(5.2, 5.0, t);
      lookX = 0.2;
      lookY = targetY;
    } else if (p < 0.54) {
      // Skills: Sweep left
      const t = (p - 0.36) / 0.18;
      targetX = THREE.MathUtils.lerp(0.8, -0.8, t);
      targetY = THREE.MathUtils.lerp(-1.8, -3.2, t);
      targetZ = THREE.MathUtils.lerp(5.0, 4.8, t);
      lookX = -0.15;
      lookY = targetY;
    } else if (p < 0.72) {
      // Projects: Depth horizon
      const t = (p - 0.54) / 0.18;
      targetX = THREE.MathUtils.lerp(-0.8, 0, t);
      targetY = THREE.MathUtils.lerp(-3.2, -5.2, t);
      targetZ = THREE.MathUtils.lerp(4.8, 5.3, t);
      lookX = 0;
      lookY = targetY - 0.3;
    } else if (p < 0.86) {
      // Services & Certs
      const t = (p - 0.72) / 0.14;
      targetX = THREE.MathUtils.lerp(0, 0.4, t);
      targetY = THREE.MathUtils.lerp(-5.2, -6.8, t);
      targetZ = THREE.MathUtils.lerp(5.3, 5.0, t);
      lookX = 0.1;
      lookY = targetY;
    } else {
      // Contact: Portal gateway
      const t = (p - 0.86) / 0.14;
      targetX = THREE.MathUtils.lerp(0.4, 0, t);
      targetY = THREE.MathUtils.lerp(-6.8, -8.0, t);
      targetZ = THREE.MathUtils.lerp(5.0, 5.2, t);
      lookX = 0;
      lookY = -8.0;
    }

    // Parallax damping
    targetX += state.pointer.x * 0.15;
    targetY += state.pointer.y * 0.12;

    state.camera.position.x = THREE.MathUtils.damp(state.camera.position.x, targetX, 2.5, clampedDelta);
    state.camera.position.y = THREE.MathUtils.damp(state.camera.position.y, targetY, 2.5, clampedDelta);
    state.camera.position.z = THREE.MathUtils.damp(state.camera.position.z, targetZ, 2.5, clampedDelta);

    currentLookAt.current.x = THREE.MathUtils.damp(currentLookAt.current.x, lookX, 2.5, clampedDelta);
    currentLookAt.current.y = THREE.MathUtils.damp(currentLookAt.current.y, lookY, 2.5, clampedDelta);
    currentLookAt.current.z = THREE.MathUtils.damp(currentLookAt.current.z, 0, 2.5, clampedDelta);

    state.camera.lookAt(currentLookAt.current);
  });

  return null;
}

/**
 * Main 3D Canvas Scene
 * Ultra-modern, executive, high-end background inspired by Linear, Stripe & Apple Pro.
 * Zero wireframes, zero clutter — pure silky liquid aurora, ambient stardust, and depth.
 * Frameloop paused when preloader is visible for instant 120 FPS load.
 */
export function Scene({ loading = false, scrollRef: propScrollRef, scrollProgress = 0 }) {
  const prefersReducedMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);
  const internalScrollRef = useRef(scrollProgress);
  const scrollRef = propScrollRef || internalScrollRef;

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (propScrollRef) return;
    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      scrollRef.current = total > 0 ? Math.min(Math.max(window.scrollY / total, 0), 1) : 0;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [propScrollRef, scrollRef]);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#05060f]"
      aria-hidden="true"
    >
      <CanvasErrorBoundary>
        <Canvas
          frameloop={loading ? 'never' : 'always'}
          dpr={[1, 1.25]}
          camera={{ position: [0, 0, 5.5], fov: 45, near: 0.1, far: 50 }}
          gl={{
            antialias: true,
            powerPreference: 'high-performance',
            alpha: true,
            depth: true,
            stencil: false,
          }}
          fallback={
            <div className="absolute inset-0 bg-gradient-to-b from-[#05060f] via-[#0b0d1e] to-[#05060f]" />
          }
        >
          {/* Dynamic Section Mood Lighting */}
          <DynamicSectionLighting scrollRef={scrollRef} scrollProgress={scrollProgress} />

          {/* Camera Motion Glide */}
          <CameraController
            scrollRef={scrollRef}
            scrollProgress={scrollProgress}
            prefersReducedMotion={prefersReducedMotion}
          />

          {/* 1. Silky GLSL Fluid Aurora (Liquid Obsidian Silk with Chromatic Refraction) */}
          <FluidAurora scrollRef={scrollRef} scrollProgress={scrollProgress} isMobile={isMobile} />

          {/* 2. Topographic Kinetic Horizon Grid (Undulating mathematical contour wave) */}
          <ParticleWave scrollRef={scrollRef} scrollProgress={scrollProgress} isMobile={isMobile} />

          {/* 3. Architectural Constellation Lattice (Deep space network of disciplines) */}
          <ArchitecturalConstellation scrollRef={scrollRef} scrollProgress={scrollProgress} isMobile={isMobile} />

          {/* 4. Section Accent Lighting */}
          <SkillsCloud scrollRef={scrollRef} scrollProgress={scrollProgress} />
          <ProjectsBackground scrollRef={scrollRef} scrollProgress={scrollProgress} />
          <ContactPortal scrollRef={scrollRef} scrollProgress={scrollProgress} isMobile={isMobile} />

          {/* 5. Ambient Luminous Cosmic Stardust */}
          <AmbientDust scrollRef={scrollRef} scrollProgress={scrollProgress} count={isMobile ? 70 : 150} isMobile={isMobile} />
        </Canvas>
      </CanvasErrorBoundary>
    </div>
  );
}
