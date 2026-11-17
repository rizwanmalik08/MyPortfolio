import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * 3D Projects Depth Horizon
 * Clean, modern chromatic ambient glow for the projects section — zero wireframes
 */
export function ProjectsBackground({ scrollProgress = 0 }) {
  const lightRef = useRef();

  useFrame((state) => {
    if (!lightRef.current) return;
    const t = state.clock.elapsedTime * 0.5;
    lightRef.current.position.x = Math.sin(t) * 1.5;
    lightRef.current.position.y = -5.2 + Math.cos(t * 0.8) * 0.5;
  });

  const inView = scrollProgress >= 0.45 && scrollProgress <= 0.78;
  const intensity = inView ? 2.2 : 0.6;

  return (
    <group position={[0, -5.2, -1.5]}>
      {/* Soft moving dynamic point light casting subtle violet/cyan radiance on projects */}
      <pointLight
        ref={lightRef}
        color="#38bdf8"
        intensity={intensity}
        distance={12}
      />
      <pointLight
        position={[2, -5.5, -2]}
        color="#818cf8"
        intensity={intensity * 0.8}
        distance={10}
      />
    </group>
  );
}
