import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * 3D Cyber Particle Starfield with Dynamic Mouse Parallax & Twinkle
 */
export function Particles({ count = 450, isMobile = false }) {
  const pointsRef = useRef();
  const particleCount = isMobile ? Math.floor(count * 0.45) : count;

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const col = new Float32Array(particleCount * 3);

    const colorCyan = new THREE.Color('#22d3ee');
    const colorViolet = new THREE.Color('#a855f7');
    const colorPink = new THREE.Color('#f43f5e');
    const colorWhite = new THREE.Color('#ffffff');

    for (let i = 0; i < particleCount; i++) {
      const radius = 2.0 + Math.random() * 8.5;
      const angle = Math.random() * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const y = (Math.random() - 0.5) * 22 - 3;
      const z = (Math.random() - 0.5) * 10 - 1;

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      const r = Math.random();
      let chosen = colorCyan;
      if (r < 0.4) chosen = colorViolet;
      else if (r < 0.7) chosen = colorPink;
      else if (r < 0.9) chosen = colorWhite;

      col[i * 3] = chosen.r;
      col[i * 3 + 1] = chosen.g;
      col[i * 3 + 2] = chosen.b;
    }

    return [pos, col];
  }, [particleCount]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    const clampedDelta = Math.min(delta, 0.05);

    // Continuous orbital drift
    pointsRef.current.rotation.y += clampedDelta * 0.04;
    pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.05;

    // Mouse parallax reaction
    const targetX = state.pointer.x * 0.35;
    const targetY = state.pointer.y * 0.25;
    pointsRef.current.position.x = THREE.MathUtils.damp(pointsRef.current.position.x, targetX, 2.5, clampedDelta);
    pointsRef.current.position.y = THREE.MathUtils.damp(pointsRef.current.position.y, targetY, 2.5, clampedDelta);
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={isMobile ? 0.06 : 0.075}
        vertexColors
        transparent
        opacity={0.88}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
