import React, { useRef, useEffect, useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { AvatarModel } from './AvatarModel';
import * as THREE from 'three';

function PortalParticles({ reducedMotion }) {
  const count = typeof window !== 'undefined' && window.innerWidth < 640 ? 25 : 55;

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
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
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

export function AvatarScene({
  targetRef,
  reducedMotion = false,
}) {
  const containerRef = useRef();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="relative h-full w-full">
      <Canvas
        dpr={[1, 2]} // High-DPI crystal clear pixel resolution
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.25,
        }}
        camera={{ position: [0, 0.1, 2.75], fov: 34 }}
        frameloop={isVisible ? 'always' : 'never'}
        aria-hidden="true"
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0); // Transparent canvas so background radial glow shows through
        }}
      >
        {/* Soft, crisp key light from front-right (defines cheekbones & nose depth) */}
        <directionalLight position={[1.4, 1.8, 2.2]} intensity={2.2} color="#ffffff" />

        {/* Dynamic Cyan Rim Light from left-behind (sharp cyber edge glow on hair & jaw) */}
        <directionalLight position={[-2.6, 0.9, -1.0]} intensity={4.5} color="#22d3ee" />

        {/* Dynamic Magenta Rim Light from right-behind */}
        <directionalLight position={[2.6, -0.4, -1.0]} intensity={3.5} color="#f43f5e" />

        {/* Subtle Ambient light (balanced to prevent washed out blur) */}
        <ambientLight intensity={0.38} color="#0f172a" />

        {/* Eye catchlight (specular sparkle in the pupils) */}
        <pointLight position={[0, 0.35, 1.7]} intensity={1.4} color="#e0f2fe" distance={3.2} />

        {/* Floating cyber particles */}
        {!reducedMotion && <PortalParticles reducedMotion={reducedMotion} />}

        {/* Real Rigged 3D Character with Moving Head, Eyes & Neck */}
        <Suspense fallback={null}>
          <AvatarModel
            targetRef={targetRef}
            reducedMotion={reducedMotion}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default AvatarScene;
