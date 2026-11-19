import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * 3D Projects Depth Horizon
 * Clean, modern chromatic ambient glow for the projects section — zero wireframes
 */
export function ProjectsBackground({ scrollRef, scrollProgress = 0 }) {
  const lightRef = useRef();
  const light2Ref = useRef();

  useFrame((state) => {
    const p = scrollRef ? scrollRef.current : scrollProgress;
    const inView = p >= 0.45 && p <= 0.78;
    const targetIntensity = inView ? 2.2 : 0.6;

    if (lightRef.current) {
      const t = state.clock.elapsedTime * 0.5;
      lightRef.current.position.x = Math.sin(t) * 1.5;
      lightRef.current.position.y = -5.2 + Math.cos(t * 0.8) * 0.5;
      lightRef.current.intensity = THREE.MathUtils.lerp(lightRef.current.intensity, targetIntensity, 0.1);
    }
    if (light2Ref.current) {
      light2Ref.current.intensity = THREE.MathUtils.lerp(light2Ref.current.intensity, targetIntensity * 0.8, 0.1);
    }
  });

  return (
    <group position={[0, -5.2, -1.5]}>
      {/* Soft moving dynamic point light casting subtle violet/cyan radiance on projects */}
      <pointLight
        ref={lightRef}
        color="#38bdf8"
        intensity={0.6}
        distance={12}
      />
      <pointLight
        ref={light2Ref}
        position={[2, -5.5, -2]}
        color="#818cf8"
        intensity={0.48}
        distance={10}
      />
    </group>
  );
}
