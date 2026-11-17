import { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

/**
 * High-End Interactive 3D Cyber Character / Developer Avatar
 * Fully procedural, stylized 3D android developer bust with:
 * - Dynamic mouse head-tracking & eye focus
 * - Blinking cybernetic visor & glowing power core
 * - Articulated neck pistons & futuristic carbon armor
 * - Floating holographic code deck & orbiting data particles
 * - Zero external model downloads: 100% instant load, 60/120 FPS
 */
export function CyberCharacter({ mouseNorm = { x: 0, y: 0 }, theme = 'cyber' }) {
  const rootGroupRef = useRef();
  const headGroupRef = useRef();
  const leftEyeRef = useRef();
  const rightEyeRef = useRef();
  const coreLightRef = useRef();
  const holoDeckRef = useRef();
  const [blink, setBlink] = useState(false);

  // Periodic eye blink simulation
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    // Blink every ~4 seconds for 150ms
    const isBlinking = (Math.sin(t * 1.5) > 0.96) && (Math.cos(t * 3) > 0.5);
    if (isBlinking !== blink) setBlink(isBlinking);
  });

  // Palette selection based on active theme
  const colors = useMemo(() => {
    if (theme === 'studio') {
      return {
        armor: '#0a0d18',
        accent1: '#38bdf8', // Sky Cyan
        accent2: '#818cf8', // Indigo
        core: '#38bdf8',
        metal: '#1e2438',
        glow: '#38bdf8',
      };
    }
    if (theme === 'matrix') {
      return {
        armor: '#07120e',
        accent1: '#10b981', // Emerald
        accent2: '#06b6d4', // Cyan
        core: '#10b981',
        metal: '#132820',
        glow: '#10b981',
      };
    }
    // Default Cyber Neon
    return {
      armor: '#0b0c1c',
      accent1: '#22d3ee', // Cyan
      accent2: '#7c3aed', // Violet
      core: '#06b6d4',
      metal: '#181b33',
      glow: '#22d3ee',
    };
  }, [theme]);

  // Floating ambient code bits / bits particles in 3D
  const particles = useMemo(() => {
    const count = 35;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = 1.1 + (i % 3) * 0.35;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = -0.5 + (i % 7) * 0.25;
      pos[i * 3 + 2] = Math.sin(angle) * radius * 0.7;
    }
    return pos;
  }, []);

  useFrame((state, delta) => {
    const clampedDelta = Math.min(delta, 0.05);

    // 1. Interactive Head & Neck Rotation (Tracks cursor in real 3D)
    if (headGroupRef.current) {
      const targetRotX = mouseNorm.y * -0.45;
      const targetRotY = mouseNorm.x * 0.6;
      const targetRotZ = mouseNorm.x * -0.12;

      headGroupRef.current.rotation.x = THREE.MathUtils.damp(headGroupRef.current.rotation.x, targetRotX, 3.5, clampedDelta);
      headGroupRef.current.rotation.y = THREE.MathUtils.damp(headGroupRef.current.rotation.y, targetRotY, 3.5, clampedDelta);
      headGroupRef.current.rotation.z = THREE.MathUtils.damp(headGroupRef.current.rotation.z, targetRotZ, 3.5, clampedDelta);
    }

    // 2. Subtle Body Lean
    if (rootGroupRef.current) {
      const bodyRotY = mouseNorm.x * 0.25;
      const bodyRotX = mouseNorm.y * -0.15;
      rootGroupRef.current.rotation.y = THREE.MathUtils.damp(rootGroupRef.current.rotation.y, bodyRotY, 2.5, clampedDelta);
      rootGroupRef.current.rotation.x = THREE.MathUtils.damp(rootGroupRef.current.rotation.x, bodyRotX, 2.5, clampedDelta);
    }

    // 3. Heartbeat / Core Pulse
    if (coreLightRef.current) {
      const pulse = 1.8 + Math.sin(state.clock.elapsedTime * 3) * 0.6;
      coreLightRef.current.intensity = pulse;
    }

    // 4. Floating Holographic Deck Hover
    if (holoDeckRef.current) {
      holoDeckRef.current.position.y = -0.85 + Math.sin(state.clock.elapsedTime * 1.8) * 0.03;
      holoDeckRef.current.rotation.z = mouseNorm.x * -0.08;
    }
  });

  return (
    <group ref={rootGroupRef} position={[0, -0.15, 0]}>
      
      {/* Dynamic Lighting framing the character */}
      <pointLight position={[2, 2, 2.5]} intensity={2.2} color="#ffffff" />
      <pointLight position={[-2, 1, 2]} intensity={2.5} color={colors.accent1} distance={6} />
      <pointLight position={[0, -1, 2]} intensity={2.0} color={colors.accent2} distance={5} />
      <pointLight position={[0, 2.5, -1.5]} intensity={2.8} color={colors.accent1} distance={5} />

      {/* FLOAT ANIMATION WRAPPER */}
      <Float speed={2.2} rotationIntensity={0.15} floatIntensity={0.35}>

        {/* ======================================================== */}
        {/* 1. HEAD & HELMET ASSEMBLY (TRACKS MOUSE)                 */}
        {/* ======================================================== */}
        <group ref={headGroupRef} position={[0, 0.52, 0]}>

          {/* Cranium / Main Helmet Shell */}
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.52, 32, 32]} />
            <meshStandardMaterial
              color={colors.armor}
              roughness={0.2}
              metalness={0.85}
              envMapIntensity={1.5}
            />
          </mesh>

          {/* Carbon Fiber Chin / Jaw Guard */}
          <mesh position={[0, -0.22, 0.22]} rotation={[0.3, 0, 0]}>
            <boxGeometry args={[0.42, 0.32, 0.38]} />
            <meshStandardMaterial
              color={colors.metal}
              roughness={0.3}
              metalness={0.9}
            />
          </mesh>

          {/* Glowing Respirator Intake Vents */}
          <mesh position={[-0.1, -0.28, 0.38]} rotation={[0.2, -0.3, 0]}>
            <boxGeometry args={[0.08, 0.05, 0.06]} />
            <meshBasicMaterial color={colors.accent1} />
          </mesh>
          <mesh position={[0.1, -0.28, 0.38]} rotation={[0.2, 0.3, 0]}>
            <boxGeometry args={[0.08, 0.05, 0.06]} />
            <meshBasicMaterial color={colors.accent1} />
          </mesh>

          {/* ======================================================== */}
          {/* CYBER VISOR & EYES                                       */}
          {/* ======================================================== */}
          {/* Dark Glass Visor Shield */}
          <mesh position={[0, 0.04, 0.38]} rotation={[-0.05, 0, 0]}>
            <boxGeometry args={[0.62, 0.24, 0.28]} />
            <meshStandardMaterial
              color="#04060d"
              roughness={0.1}
              metalness={0.95}
              transparent
              opacity={0.88}
            />
          </mesh>

          {/* Visor Neon Frame Bevel */}
          <mesh position={[0, 0.16, 0.44]}>
            <boxGeometry args={[0.64, 0.02, 0.1]} />
            <meshBasicMaterial color={colors.accent1} />
          </mesh>

          {/* Left Glowing Cyber Eye */}
          <mesh
            ref={leftEyeRef}
            position={[-0.15, 0.04, 0.48]}
            scale={[1, blink ? 0.1 : 1, 1]}
          >
            <capsuleGeometry args={[0.035, 0.08, 8, 16]} />
            <meshBasicMaterial color={colors.accent1} />
          </mesh>

          {/* Right Glowing Cyber Eye */}
          <mesh
            ref={rightEyeRef}
            position={[0.15, 0.04, 0.48]}
            scale={[1, blink ? 0.1 : 1, 1]}
          >
            <capsuleGeometry args={[0.035, 0.08, 8, 16]} />
            <meshBasicMaterial color={colors.accent1} />
          </mesh>

          {/* Eye Reticle Pupils */}
          {!blink && (
            <>
              <mesh position={[-0.15 + mouseNorm.x * 0.02, 0.04 + mouseNorm.y * 0.015, 0.52]}>
                <sphereGeometry args={[0.016, 16, 16]} />
                <meshBasicMaterial color="#ffffff" />
              </mesh>
              <mesh position={[0.15 + mouseNorm.x * 0.02, 0.04 + mouseNorm.y * 0.015, 0.52]}>
                <sphereGeometry args={[0.016, 16, 16]} />
                <meshBasicMaterial color="#ffffff" />
              </mesh>
            </>
          )}

          {/* ======================================================== */}
          {/* CYBER HEADPHONES / AUDIO CANS                           */}
          {/* ======================================================== */}
          {/* Left Earphone Can */}
          <group position={[-0.52, 0, 0]}>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.18, 0.2, 0.14, 24]} />
              <meshStandardMaterial color={colors.metal} metalness={0.9} roughness={0.2} />
            </mesh>
            {/* Pulsing Ear Neon Ring */}
            <mesh position={[-0.08, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
              <ringGeometry args={[0.1, 0.13, 24]} />
              <meshBasicMaterial color={colors.accent1} side={THREE.DoubleSide} />
            </mesh>
          </group>

          {/* Right Earphone Can */}
          <group position={[0.52, 0, 0]}>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.18, 0.2, 0.14, 24]} />
              <meshStandardMaterial color={colors.metal} metalness={0.9} roughness={0.2} />
            </mesh>
            {/* Pulsing Ear Neon Ring */}
            <mesh position={[0.08, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
              <ringGeometry args={[0.1, 0.13, 24]} />
              <meshBasicMaterial color={colors.accent2} side={THREE.DoubleSide} />
            </mesh>
          </group>

          {/* Comms Antenna Fin */}
          <mesh position={[-0.52, 0.25, -0.05]} rotation={[0.4, 0, 0.2]}>
            <cylinderGeometry args={[0.01, 0.02, 0.35, 12]} />
            <meshStandardMaterial color={colors.metal} metalness={0.8} />
          </mesh>
          <mesh position={[-0.56, 0.42, 0.02]}>
            <sphereGeometry args={[0.022, 12, 12]} />
            <meshBasicMaterial color={colors.accent1} />
          </mesh>

          {/* Top Head Aerodynamic Crest */}
          <mesh position={[0, 0.52, -0.05]} rotation={[-0.2, 0, 0]}>
            <boxGeometry args={[0.1, 0.08, 0.45]} />
            <meshStandardMaterial color={colors.metal} metalness={0.9} />
          </mesh>
          <mesh position={[0, 0.56, -0.05]} rotation={[-0.2, 0, 0]}>
            <boxGeometry args={[0.03, 0.02, 0.42]} />
            <meshBasicMaterial color={colors.accent2} />
          </mesh>

          {/* Segmented Hydraulic Neck */}
          <group position={[0, -0.42, 0]}>
            <mesh>
              <cylinderGeometry args={[0.2, 0.24, 0.22, 20]} />
              <meshStandardMaterial color="#05070e" metalness={0.9} roughness={0.3} />
            </mesh>
            {/* Neck Rings */}
            <mesh position={[0, 0.04, 0]}>
              <torusGeometry args={[0.22, 0.018, 12, 32]} />
              <meshStandardMaterial color={colors.metal} metalness={0.9} />
            </mesh>
            <mesh position={[0, -0.05, 0]}>
              <torusGeometry args={[0.23, 0.016, 12, 32]} />
              <meshBasicMaterial color={colors.accent2} />
            </mesh>
          </group>

        </group>

        {/* ======================================================== */}
        {/* 2. TORSO & CYBERNETIC ARMOR SUIT                         */}
        {/* ======================================================== */}
        <group position={[0, -0.45, 0]}>

          {/* Main Chest Armor Core Block */}
          <mesh position={[0, 0.05, 0]}>
            <boxGeometry args={[0.95, 0.75, 0.58]} />
            <meshStandardMaterial
              color={colors.armor}
              roughness={0.25}
              metalness={0.85}
            />
          </mesh>

          {/* Angular Chest Plates (Pectoral Armor) */}
          <mesh position={[-0.26, 0.16, 0.26]} rotation={[0.1, 0.2, -0.08]}>
            <boxGeometry args={[0.38, 0.32, 0.12]} />
            <meshStandardMaterial color={colors.metal} metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[0.26, 0.16, 0.26]} rotation={[0.1, -0.2, 0.08]}>
            <boxGeometry args={[0.38, 0.32, 0.12]} />
            <meshStandardMaterial color={colors.metal} metalness={0.9} roughness={0.2} />
          </mesh>

          {/* ======================================================== */}
          {/* HEART ARC REACTOR / POWER CORE                          */}
          {/* ======================================================== */}
          <group position={[0, 0.14, 0.31]}>
            {/* Outer Core Rim */}
            <mesh>
              <ringGeometry args={[0.08, 0.12, 32]} />
              <meshStandardMaterial color={colors.metal} metalness={0.95} />
            </mesh>
            {/* Inner Glowing Arc Crystal */}
            <mesh>
              <circleGeometry args={[0.075, 32]} />
              <meshBasicMaterial color={colors.core} />
            </mesh>
            {/* Internal Core Point Light */}
            <pointLight ref={coreLightRef} color={colors.core} intensity={2.2} distance={3} />
          </group>

          {/* Left Shoulder Pauldron */}
          <group position={[-0.64, 0.28, 0]}>
            <mesh rotation={[0, 0, -0.3]}>
              <boxGeometry args={[0.36, 0.24, 0.44]} />
              <meshStandardMaterial color={colors.armor} metalness={0.85} roughness={0.2} />
            </mesh>
            {/* Shoulder Edge Light */}
            <mesh position={[-0.14, 0.08, 0]} rotation={[0, 0, -0.3]}>
              <boxGeometry args={[0.04, 0.02, 0.42]} />
              <meshBasicMaterial color={colors.accent1} />
            </mesh>
          </group>

          {/* Right Shoulder Pauldron */}
          <group position={[0.64, 0.28, 0]}>
            <mesh rotation={[0, 0, 0.3]}>
              <boxGeometry args={[0.36, 0.24, 0.44]} />
              <meshStandardMaterial color={colors.armor} metalness={0.85} roughness={0.2} />
            </mesh>
            {/* Shoulder Edge Light */}
            <mesh position={[0.14, 0.08, 0]} rotation={[0, 0, 0.3]}>
              <boxGeometry args={[0.04, 0.02, 0.42]} />
              <meshBasicMaterial color={colors.accent2} />
            </mesh>
          </group>

          {/* Spine & Back Heat Vents */}
          <mesh position={[0, 0.08, -0.32]}>
            <boxGeometry args={[0.32, 0.65, 0.08]} />
            <meshStandardMaterial color={colors.metal} metalness={0.9} />
          </mesh>
          <mesh position={[0, 0.22, -0.36]}>
            <boxGeometry args={[0.22, 0.04, 0.02]} />
            <meshBasicMaterial color={colors.accent2} />
          </mesh>
          <mesh position={[0, 0.08, -0.36]}>
            <boxGeometry args={[0.22, 0.04, 0.02]} />
            <meshBasicMaterial color={colors.accent1} />
          </mesh>

        </group>

        {/* ======================================================== */}
        {/* 3. FLOATING HOLOGRAPHIC CODE DECK (DEVELOPER MOTIF)      */}
        {/* ======================================================== */}
        <group ref={holoDeckRef} position={[0, -0.85, 0.55]} rotation={[-0.45, 0, 0]}>
          {/* Hologram Glass Console Surface */}
          <mesh>
            <planeGeometry args={[1.25, 0.45]} />
            <meshStandardMaterial
              color="#040816"
              roughness={0.1}
              metalness={0.95}
              transparent
              opacity={0.7}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Neon Perimeter Rim */}
          <mesh position={[0, 0, 0.01]}>
            <planeGeometry args={[1.27, 0.47]} />
            <meshBasicMaterial color={colors.accent1} wireframe />
          </mesh>

          {/* Floating Neon Key Grid Rows */}
          {[-0.12, -0.04, 0.04, 0.12].map((y, rowIdx) => (
            <mesh key={rowIdx} position={[0, y, 0.02]}>
              <planeGeometry args={[1.05, 0.045]} />
              <meshBasicMaterial
                color={rowIdx % 2 === 0 ? colors.accent1 : colors.accent2}
                transparent
                opacity={0.4}
              />
            </mesh>
          ))}
        </group>

        {/* ======================================================== */}
        {/* 4. HOLOGRAPHIC PEDESTAL / BASE PROJECTOR                */}
        {/* ======================================================== */}
        <group position={[0, -1.15, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          {/* Outer Ring */}
          <mesh>
            <ringGeometry args={[0.95, 1.05, 48]} />
            <meshBasicMaterial color={colors.accent1} transparent opacity={0.65} side={THREE.DoubleSide} />
          </mesh>
          {/* Inner Counter Ring */}
          <mesh>
            <ringGeometry args={[0.7, 0.78, 36]} />
            <meshBasicMaterial color={colors.accent2} transparent opacity={0.5} side={THREE.DoubleSide} />
          </mesh>
          {/* Base Glow Disc */}
          <mesh position={[0, 0, -0.05]}>
            <circleGeometry args={[1.1, 32]} />
            <meshBasicMaterial color="#040714" transparent opacity={0.75} side={THREE.DoubleSide} />
          </mesh>
        </group>

        {/* ======================================================== */}
        {/* 5. FLOATING 3D DATA PARTICLES                           */}
        {/* ======================================================== */}
        <points>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={35}
              array={particles}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.038}
            color={colors.accent1}
            transparent
            opacity={0.75}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </points>

      </Float>
    </group>
  );
}
