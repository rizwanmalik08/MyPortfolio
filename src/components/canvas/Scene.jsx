import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { HeroObject } from './HeroObject';
import { Particles } from './Particles';
import { SkillsCloud } from './SkillsCloud';
import { ProjectsBackground } from './ProjectsBackground';
import { ContactPortal } from './ContactPortal';
import { CanvasErrorBoundary } from './CanvasErrorBoundary';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/**
 * Camera Controller
 * Glides smoothly through 3D space linked to user scroll progress
 */
function CameraController({ scrollProgress, prefersReducedMotion }) {
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((state, delta) => {
    if (prefersReducedMotion) {
      // Gentle, stationary view with minimal scroll drift
      const targetY = -scrollProgress * 2.5;
      state.camera.position.x = THREE.MathUtils.damp(state.camera.position.x, 0, 2, delta);
      state.camera.position.y = THREE.MathUtils.damp(state.camera.position.y, targetY, 2, delta);
      state.camera.position.z = THREE.MathUtils.damp(state.camera.position.z, 6, 2, delta);
      state.camera.lookAt(0, targetY, 0);
      return;
    }

    // Dynamic cinematic camera flight path
    let targetX = 0;
    let targetY = 0;
    let targetZ = 5.5;
    let lookX = 0;
    let lookY = 0;
    let lookZ = 0;

    const p = scrollProgress;

    if (p < 0.18) {
      // Hero: centered, head-on view
      const t = p / 0.18;
      targetX = THREE.MathUtils.lerp(0, 0.8, t);
      targetY = THREE.MathUtils.lerp(0, -0.6, t);
      targetZ = THREE.MathUtils.lerp(5.5, 5.2, t);
      lookY = targetY;
    } else if (p < 0.36) {
      // About: shifted right, inspecting profile
      const t = (p - 0.18) / 0.18;
      targetX = THREE.MathUtils.lerp(0.8, 1.4, t);
      targetY = THREE.MathUtils.lerp(-0.6, -1.8, t);
      targetZ = THREE.MathUtils.lerp(5.2, 5.0, t);
      lookX = 0.4;
      lookY = targetY;
    } else if (p < 0.54) {
      // Skills: sweep left, angled upward toward floating badges
      const t = (p - 0.36) / 0.18;
      targetX = THREE.MathUtils.lerp(1.4, -1.2, t);
      targetY = THREE.MathUtils.lerp(-1.8, -3.2, t);
      targetZ = THREE.MathUtils.lerp(5.0, 4.8, t);
      lookX = -0.3;
      lookY = targetY;
    } else if (p < 0.72) {
      // Projects: center high-angle looking down at horizon grid
      const t = (p - 0.54) / 0.18;
      targetX = THREE.MathUtils.lerp(-1.2, 0, t);
      targetY = THREE.MathUtils.lerp(-3.2, -5.2, t);
      targetZ = THREE.MathUtils.lerp(4.8, 5.4, t);
      lookX = 0;
      lookY = targetY - 0.4;
    } else if (p < 0.86) {
      // Services & Certs: subtle pan
      const t = (p - 0.72) / 0.14;
      targetX = THREE.MathUtils.lerp(0, 0.7, t);
      targetY = THREE.MathUtils.lerp(-5.2, -6.8, t);
      targetZ = THREE.MathUtils.lerp(5.4, 5.0, t);
      lookX = 0.2;
      lookY = targetY;
    } else {
      // Contact: framed directly on glowing energy portal
      const t = (p - 0.86) / 0.14;
      targetX = THREE.MathUtils.lerp(0.7, 0, t);
      targetY = THREE.MathUtils.lerp(-6.8, -8.0, t);
      targetZ = THREE.MathUtils.lerp(5.0, 5.2, t);
      lookX = 0;
      lookY = -8.0;
    }

    // Add mouse parallax to camera
    targetX += state.pointer.x * 0.25;
    targetY += state.pointer.y * 0.18;

    // Smoothly damp camera position
    state.camera.position.x = THREE.MathUtils.damp(state.camera.position.x, targetX, 2.5, delta);
    state.camera.position.y = THREE.MathUtils.damp(state.camera.position.y, targetY, 2.5, delta);
    state.camera.position.z = THREE.MathUtils.damp(state.camera.position.z, targetZ, 2.5, delta);

    // Smoothly damp lookAt target
    currentLookAt.current.x = THREE.MathUtils.damp(currentLookAt.current.x, lookX, 2.5, delta);
    currentLookAt.current.y = THREE.MathUtils.damp(currentLookAt.current.y, lookY, 2.5, delta);
    currentLookAt.current.z = THREE.MathUtils.damp(currentLookAt.current.z, lookZ, 2.5, delta);

    state.camera.lookAt(currentLookAt.current);
  });

  return null;
}

/**
 * Main 3D Canvas Scene
 * Persistent backdrop with zero scroll hijacking
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
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-[#0a0a12]"
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
          }}
          fallback={
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a12] via-[#0f1123] to-[#0a0a12]" />
          }
        >
          {/* Subtle Studio Lighting */}
          <ambientLight intensity={0.65} />
          <directionalLight position={[5, 8, 5]} intensity={1.2} color="#ffffff" />
          <pointLight position={[-4, 2, 3]} intensity={2.2} color="#7c3aed" distance={10} />
          <pointLight position={[4, -3, 2]} intensity={2.0} color="#22d3ee" distance={10} />
          <pointLight position={[0, -7, 3]} intensity={2.5} color="#ec4899" distance={8} />

          {/* Camera Motion */}
          <CameraController
            scrollProgress={scrollProgress}
            prefersReducedMotion={prefersReducedMotion}
          />

          {/* 3D Scene Assets */}
          <HeroObject scrollProgress={scrollProgress} isMobile={isMobile} />
          <SkillsCloud scrollProgress={scrollProgress} />
          <ProjectsBackground scrollProgress={scrollProgress} />
          <ContactPortal scrollProgress={scrollProgress} isMobile={isMobile} />
          <Particles count={isMobile ? 200 : 550} isMobile={isMobile} />
        </Canvas>
      </CanvasErrorBoundary>
    </div>
  );
}
