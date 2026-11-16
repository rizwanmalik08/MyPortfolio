import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

const NODES = [
  { pos: [-2.2, -2.6, 0.5], rot: [0.2, 0.4, 0], color: '#22d3ee', scale: 0.35 },
  { pos: [2.0, -2.4, -0.4], rot: [-0.3, 0.2, 0], color: '#7c3aed', scale: 0.38 },
  { pos: [-1.4, -3.4, -0.8], rot: [0.5, -0.2, 0], color: '#ec4899', scale: 0.3 },
  { pos: [1.6, -3.6, 0.6], rot: [-0.1, -0.5, 0], color: '#38bdf8', scale: 0.32 },
  { pos: [0, -3.1, -1.2], rot: [0.3, 0.3, 0], color: '#a855f7', scale: 0.4 },
];

/**
 * 3D Skills Floating Geometric Nodes
 * Floating reflective crystals in the skills zone
 */
export function SkillsCloud({ scrollProgress = 0 }) {
  const groupRef = useRef();

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.12;

    // React to scroll progress: illuminate when in skills view (0.3 - 0.55)
    const inRange = scrollProgress >= 0.25 && scrollProgress <= 0.6;
    const targetScale = inRange ? 1 : 0.4;
    groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 2);
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {NODES.map((node, i) => (
        <Float key={i} speed={2 + i * 0.5} rotationIntensity={0.8} floatIntensity={1}>
          <mesh position={node.pos} rotation={node.rot} scale={node.scale}>
            <octahedronGeometry args={[1, 0]} />
            <meshStandardMaterial
              color={node.color}
              emissive={node.color}
              emissiveIntensity={0.8}
              roughness={0.2}
              metalness={0.8}
              wireframe={i % 2 === 1}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}
