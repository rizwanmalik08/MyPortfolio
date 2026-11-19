import { useRef } from 'react';

/**
 * Clean Contact Ambient Illumination Layer
 * Pure subtle atmospheric lighting — zero floating rings, zero clutter.
 */
export function ContactPortal({ scrollProgress = 0 }) {
  const inView = scrollProgress >= 0.72;
  const intensity = inView ? 2.0 : 0.4;

  return (
    <group position={[0, -8.0, -1.8]}>
      {/* Soft atmospheric gradient backlighting */}
      <pointLight color="#38bdf8" intensity={intensity} distance={10} position={[-1.5, 0, 0]} />
      <pointLight color="#a855f7" intensity={intensity * 1.1} distance={10} position={[1.5, 0, 0]} />
    </group>
  );
}
