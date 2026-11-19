import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Clean Contact Ambient Illumination Layer
 * Pure subtle atmospheric lighting — zero floating rings, zero clutter.
 */
export function ContactPortal({ scrollRef, scrollProgress = 0 }) {
  const light1Ref = useRef();
  const light2Ref = useRef();

  useFrame(() => {
    const p = scrollRef ? scrollRef.current : scrollProgress;
    const inView = p >= 0.72;
    const target = inView ? 2.0 : 0.4;
    if (light1Ref.current) {
      light1Ref.current.intensity = THREE.MathUtils.lerp(light1Ref.current.intensity, target, 0.1);
    }
    if (light2Ref.current) {
      light2Ref.current.intensity = THREE.MathUtils.lerp(light2Ref.current.intensity, target * 1.1, 0.1);
    }
  });

  return (
    <group position={[0, -8.0, -1.8]}>
      {/* Soft atmospheric gradient backlighting */}
      <pointLight ref={light1Ref} color="#38bdf8" intensity={0.4} distance={10} position={[-1.5, 0, 0]} />
      <pointLight ref={light2Ref} color="#a855f7" intensity={0.44} distance={10} position={[1.5, 0, 0]} />
    </group>
  );
}
