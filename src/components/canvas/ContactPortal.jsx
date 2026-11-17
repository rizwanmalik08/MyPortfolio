import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

/**
 * 3D Contact Section Glowing Ambient Portal
 * Soft, elegant light halo behind the contact console — smooth and professional
 */
export function ContactPortal({ scrollProgress = 0, isMobile = false }) {
  const portalRef = useRef();

  useFrame((state, delta) => {
    if (!portalRef.current) return;
    portalRef.current.rotation.z += delta * 0.12;
  });

  const inView = scrollProgress >= 0.78;
  const scale = (inView ? 1 : 0.4) * (isMobile ? 0.7 : 1);

  return (
    <group position={[0, -8.0, -1.8]} scale={scale}>
      <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.5}>
        {/* Soft, smooth glowing ring with heavy blur feel */}
        <mesh ref={portalRef}>
          <ringGeometry args={[1.8, 1.88, 64]} />
          <meshBasicMaterial
            color="#38bdf8"
            transparent
            opacity={0.35}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Ambient point lights illuminating the contact backdrop */}
        <pointLight color="#38bdf8" intensity={1.8} distance={8} />
        <pointLight color="#a855f7" intensity={2.0} distance={8} position={[0, 0, 0.5]} />
      </Float>
    </group>
  );
}
