import { useRef } from 'react';

/**
 * Clean Skills Lighting Layer
 * Zero floating objects, zero clutter — pure subtle dynamic ambient illumination.
 */
export function SkillsCloud({ scrollProgress = 0 }) {
  const inRange = scrollProgress >= 0.25 && scrollProgress <= 0.6;
  const intensity = inRange ? 1.5 : 0.3;

  return (
    <group position={[0, -2.6, -1.5]}>
      {/* Soft chromatic illumination for the skills & services zone */}
      <pointLight color="#38bdf8" intensity={intensity} distance={10} position={[-2, 0, 0]} />
      <pointLight color="#818cf8" intensity={intensity * 0.8} distance={10} position={[2, 0, 0]} />
    </group>
  );
}
