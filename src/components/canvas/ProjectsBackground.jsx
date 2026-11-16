import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * 3D Horizon Grid and Project Wireframe Planes
 */
export function ProjectsBackground({ scrollProgress = 0 }) {
  const gridRef = useRef();

  useFrame((state, delta) => {
    if (!gridRef.current) return;
    // Slow crawl forward to feel alive
    gridRef.current.position.z = (state.clock.elapsedTime * 0.15) % 1;
  });

  const inView = scrollProgress >= 0.45 && scrollProgress <= 0.75;
  const opacity = inView ? 0.35 : 0.08;

  return (
    <group position={[0, -5.2, 0]}>
      {/* Perspective horizon grid */}
      <group ref={gridRef} rotation={[-Math.PI / 2.3, 0, 0]} position={[0, 0, -2]}>
        <gridHelper
          args={[30, 30, '#7c3aed', '#1e1b4b']}
          position={[0, 0, 0]}
        />
      </group>

      {/* Floating holographic accent rings */}
      <mesh position={[-2.5, 0.5, -1]} rotation={[0.4, 0.6, 0]}>
        <ringGeometry args={[0.8, 0.85, 32]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={opacity} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[2.5, -0.2, -1.5]} rotation={[-0.3, -0.4, 0]}>
        <ringGeometry args={[1.1, 1.15, 32]} />
        <meshBasicMaterial color="#ec4899" transparent opacity={opacity} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}
