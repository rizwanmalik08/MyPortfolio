import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Ambient Luminous Space Dust
 * Subtle, elegant drifting particles in deep space.
 * 100% unobtrusive — enhances depth without visual clutter.
 */
export function AmbientDust({ count = 180, isMobile = false }) {
  const pointsRef = useRef();
  const particleCount = isMobile ? 80 : count;

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const col = new Float32Array(particleCount * 3);

    const colorSky = new THREE.Color('#38bdf8');
    const colorIndigo = new THREE.Color('#818cf8');
    const colorWhite = new THREE.Color('#ffffff');

    for (let i = 0; i < particleCount; i++) {
      // Distribute in deep background sphere
      const x = (Math.random() - 0.5) * 20;
      const y = (Math.random() - 0.5) * 16;
      const z = -2 - Math.random() * 8; // Deep behind foreground

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      const r = Math.random();
      const c = r < 0.5 ? colorSky : r < 0.85 ? colorIndigo : colorWhite;

      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }

    return [pos, col];
  }, [particleCount]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    const clampedDelta = Math.min(delta, 0.05);

    // Very gentle slow rotation
    pointsRef.current.rotation.y += clampedDelta * 0.02;
    pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.15) * 0.02;

    // Subtle parallax
    const targetX = state.pointer.x * 0.15;
    const targetY = state.pointer.y * 0.1;
    pointsRef.current.position.x = THREE.MathUtils.damp(pointsRef.current.position.x, targetX, 2, clampedDelta);
    pointsRef.current.position.y = THREE.MathUtils.damp(pointsRef.current.position.y, targetY, 2, clampedDelta);
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleCount}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={isMobile ? 0.045 : 0.055}
        vertexColors
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
