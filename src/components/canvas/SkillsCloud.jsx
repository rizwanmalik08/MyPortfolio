import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

const NODES = [
  { pos: [-2.4, -2.6, -0.5], rot: [0.2, 0.4, 0], color: '#38bdf8', scale: 0.28 },
  { pos: [2.2, -2.4, -0.8], rot: [-0.3, 0.2, 0], color: '#818cf8', scale: 0.32 },
  { pos: [-1.6, -3.4, -1.0], rot: [0.5, -0.2, 0], color: '#c084fc', scale: 0.25 },
  { pos: [1.8, -3.6, -0.4], rot: [-0.1, -0.5, 0], color: '#2dd4bf', scale: 0.26 },
  { pos: [0, -3.1, -1.5], rot: [0.3, 0.3, 0], color: '#a855f7', scale: 0.35 },
];

/**
 * 3D Skills Floating Luminous Light Orbs
 * Premium glowing frosted spheres in 3D depth — ZERO wireframes
 */
export function SkillsCloud({ scrollProgress = 0 }) {
  const groupRef = useRef();

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.08;

    // React to scroll progress: gracefully illuminates in skills zone (0.3 - 0.55)
    const inRange = scrollProgress >= 0.25 && scrollProgress <= 0.6;
    const targetScale = inRange ? 1 : 0.3;
    groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 2.5);
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {NODES.map((node, i) => (
        <Float key={i} speed={1.8 + i * 0.4} rotationIntensity={0.4} floatIntensity={0.8}>
          <mesh position={node.pos} rotation={node.rot} scale={node.scale}>
            {/* Smooth sphere with glowing rim light */}
            <sphereGeometry args={[0.9, 32, 32]} />
            <meshStandardMaterial
              color={node.color}
              emissive={node.color}
              emissiveIntensity={0.65}
              roughness={0.15}
              metalness={0.85}
              transparent
              opacity={0.7}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}
