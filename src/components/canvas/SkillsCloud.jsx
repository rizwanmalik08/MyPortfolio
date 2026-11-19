import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Clean Skills Lighting Layer
 * Zero floating objects, zero clutter — pure subtle dynamic ambient illumination.
 */
export function SkillsCloud({ scrollRef, scrollProgress = 0 }) {
  const light1Ref = useRef();
  const light2Ref = useRef();

  useFrame(() => {
    const p = scrollRef ? scrollRef.current : scrollProgress;
    const inRange = p >= 0.25 && p <= 0.6;
    const target = inRange ? 1.5 : 0.3;
    if (light1Ref.current) {
      light1Ref.current.intensity = THREE.MathUtils.lerp(light1Ref.current.intensity, target, 0.1);
    }
    if (light2Ref.current) {
      light2Ref.current.intensity = THREE.MathUtils.lerp(light2Ref.current.intensity, target * 0.8, 0.1);
    }
  });

  return (
    <group position={[0, -2.6, -1.5]}>
      {/* Soft chromatic illumination for the skills & services zone */}
      <pointLight ref={light1Ref} color="#38bdf8" intensity={0.3} distance={10} position={[-2, 0, 0]} />
      <pointLight ref={light2Ref} color="#818cf8" intensity={0.24} distance={10} position={[2, 0, 0]} />
    </group>
  );
}
