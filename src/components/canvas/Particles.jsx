import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * 3D Cyber Particle Starfield
 * Lightweight single-draw-call buffer points drifting in space with parallax
 */
export function Particles({ count = 400, isMobile = false }) {
  const pointsRef = useRef();
  const particleCount = isMobile ? Math.floor(count * 0.4) : count;

  // Generate particles positioned in a 3D cylindrical volume along the scroll corridor
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const col = new Float32Array(particleCount * 3);

    const colorViolet = new THREE.Color('#7c3aed');
    const colorCyan = new THREE.Color('#22d3ee');
    const colorPink = new THREE.Color('#f43f5e');
    const colorWhite = new THREE.Color('#ffffff');

    for (let i = 0; i < particleCount; i++) {
      // Cylinder distribution along Y: from +4 down to -12
      const radius = 2.5 + Math.random() * 6.5;
      const angle = Math.random() * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const y = (Math.random() - 0.5) * 20 - 4; // span across sections
      const z = (Math.random() - 0.5) * 8 - 1;

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      // Color variation
      const r = Math.random();
      let chosenColor = colorViolet;
      if (r < 0.35) chosenColor = colorCyan;
      else if (r < 0.6) chosenColor = colorPink;
      else if (r < 0.8) chosenColor = colorWhite;

      col[i * 3] = chosenColor.r;
      col[i * 3 + 1] = chosenColor.g;
      col[i * 3 + 2] = chosenColor.b;
    }

    return [pos, col];
  }, [particleCount]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    
    // Slow atmospheric rotation
    pointsRef.current.rotation.y += delta * 0.03;
    
    // Mouse subtle parallax
    const targetX = state.pointer.x * 0.15;
    const targetY = state.pointer.y * 0.1;
    pointsRef.current.position.x = THREE.MathUtils.damp(pointsRef.current.position.x, targetX, 2, delta);
    pointsRef.current.position.y = THREE.MathUtils.damp(pointsRef.current.position.y, targetY, 2, delta);
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
        size={isMobile ? 0.05 : 0.065}
        vertexColors
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
