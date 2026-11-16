import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { HeroObject } from './HeroObject';
import { ParticleWave } from './ParticleWave';
import { AmbientDust } from './AmbientDust';
import { SkillsCloud } from './SkillsCloud';
import { ProjectsBackground } from './ProjectsBackground';
import { ContactPortal } from './ContactPortal';
import { CanvasErrorBoundary } from './CanvasErrorBoundary';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/**
 * Click Shockwave Ripple Effect in 3D Space
 */
function ClickShockwave() {
  const meshRef = useRef();
  const [active, setActive] = useState(false);
  const scaleRef = useRef(0.1);

  useEffect(() => {
    const handleClick = () => {
      scaleRef.current = 0.1;
      setActive(true);
    };
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  useFrame((state, delta) => {
    if (!active || !meshRef.current) return;
    scaleRef.current += delta * 6;
    meshRef.current.scale.setScalar(scaleRef.current);
    meshRef.current.material.opacity = Math.max(0, 1 - scaleRef.current / 4);

    if (scaleRef.current > 4) {
      setActive(false);
    }
  });

  if (!active) return null;

  return (
    <mesh ref={meshRef} position={[0, 0, 1.2]}>
      <ringGeometry args={[0.9, 0.98, 48]} />
      <meshBasicMaterial
        color="#38bdf8"
        transparent
        opacity={0.6}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

/**
 * Camera Controller
 * Smooth cinematic camera glide through 3D space linked to user scroll
 */
function CameraController({ scrollProgress, prefersReducedMotion }) {
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((state, delta) => {
    const clampedDelta = Math.min(delta, 0.05);

    if (prefersReducedMotion) {
      const targetY = -scrollProgress * 2.2;
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

    const p = scrollProgress;

    if (p < 0.18) {
      // Hero: Head-on view
      const t = p / 0.18;
      targetX = THREE.MathUtils.lerp(0, 0.4, t);
      targetY = THREE.MathUtils.lerp(0, -0.6, t);
      targetZ = THREE.MathUtils.lerp(5.5, 5.2, t);
      lookY = targetY;
    } else if (p < 0.36) {
      // About: Pan right to frame profile card
      const t = (p - 0.18) / 0.18;
      targetX = THREE.MathUtils.lerp(0.4, 1.1, t);
      targetY = THREE.MathUtils.lerp(-0.6, -1.8, t);
      targetZ = THREE.MathUtils.lerp(5.2, 5.0, t);
      lookX = 0.3;
      lookY = targetY;
    } else if (p < 0.54) {
      // Skills: Sweep left
      const t = (p - 0.36) / 0.18;
      targetX = THREE.MathUtils.lerp(1.1, -1.0, t);
      targetY = THREE.MathUtils.lerp(-1.8, -3.2, t);
      targetZ = THREE.MathUtils.lerp(5.0, 4.8, t);
      lookX = -0.2;
      lookY = targetY;
    } else if (p < 0.72) {
      // Projects: Depth horizon
      const t = (p - 0.54) / 0.18;
      targetX = THREE.MathUtils.lerp(-1.0, 0, t);
      targetY = THREE.MathUtils.lerp(-3.2, -5.2, t);
      targetZ = THREE.MathUtils.lerp(4.8, 5.3, t);
      lookX = 0;
      lookY = targetY - 0.3;
    } else if (p < 0.86) {
      // Services & Certs
      const t = (p - 0.72) / 0.14;
      targetX = THREE.MathUtils.lerp(0, 0.5, t);
      targetY = THREE.MathUtils.lerp(-5.2, -6.8, t);
      targetZ = THREE.MathUtils.lerp(5.3, 5.0, t);
      lookX = 0.15;
      lookY = targetY;
    } else {
      // Contact: Portal gateway
      const t = (p - 0.86) / 0.14;
      targetX = THREE.MathUtils.lerp(0.5, 0, t);
      targetY = THREE.MathUtils.lerp(-6.8, -8.0, t);
      targetZ = THREE.MathUtils.lerp(5.0, 5.2, t);
      lookX = 0;
      lookY = -8.0;
    }

    // Parallax damping
    targetX += state.pointer.x * 0.18;
    targetY += state.pointer.y * 0.14;

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
 * Clean, modern, professional background that never obstructs text or UI
 */
export function Scene({ scrollProgress = 0 }) {
  const prefersReducedMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#05060f]"
      aria-hidden="true"
    >
      <CanvasErrorBoundary>
        <Canvas
          dpr={[1, 1.5]}
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
          {/* Subtle Studio Lighting */}
          <ambientLight intensity={0.8} />
          <directionalLight position={[5, 8, 5]} intensity={1.3} color="#ffffff" />
          <pointLight position={[-4, 3, 3]} intensity={2.0} color="#6366f1" distance={10} />
          <pointLight position={[4, -2, 3]} intensity={1.8} color="#06b6d4" distance={10} />

          {/* Camera Motion */}
          <CameraController
            scrollProgress={scrollProgress}
            prefersReducedMotion={prefersReducedMotion}
          />

          {/* 1. Iconic 3D Interactive Particle Wave (Positioned safely at lower horizon) */}
          <ParticleWave scrollProgress={scrollProgress} isMobile={isMobile} />

          {/* 2. Delicate Gyroscopic Accent Framing the Avatar (Positioned safely on right) */}
          <HeroObject scrollProgress={scrollProgress} isMobile={isMobile} />

          {/* 3. Section Backdrops */}
          <SkillsCloud scrollProgress={scrollProgress} />
          <ProjectsBackground scrollProgress={scrollProgress} />
          <ContactPortal scrollProgress={scrollProgress} isMobile={isMobile} />

          {/* 4. Ambient Luminous Space Dust */}
          <AmbientDust count={isMobile ? 80 : 180} isMobile={isMobile} />

          {/* 5. Interactive Click Shockwave */}
          <ClickShockwave />
        </Canvas>
      </CanvasErrorBoundary>
    </div>
  );
}
