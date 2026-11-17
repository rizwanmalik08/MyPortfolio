import { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, useTexture, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import rizwan3dAvatarImg from '../../assets/rizwan-3d-avatar.jpg';

/**
 * Volumetric 3D Model of Rizwan
 * - Interactive 3D click & drag rotation (OrbitControls with smooth damping)
 * - 3D Volumetric Depth Displacement Shader (curves the face, extrudes nose/jaw/collar in real 3D space)
 * - Dynamic 3D lighting that reacts physically to the displaced normals
 * - 3D Gyroscopic neon rings with orbiting satellites
 * - Auto-rotation turntable mode toggle
 */
export function CyberCharacter({
  mouseNorm = { x: 0, y: 0 },
  theme = 'cyber',
  autoRotate = false,
  isDragging = false,
  onDragChange = () => {},
}) {
  const controlsRef = useRef();
  const meshRef = useRef();
  const materialRef = useRef();
  const ring1Ref = useRef();
  const ring2Ref = useRef();
  const lightRef = useRef();

  // Load the stylized 3D avatar image
  const texture = useTexture(rizwan3dAvatarImg);

  // Palette based on theme
  const colors = useMemo(() => {
    if (theme === 'studio') {
      return {
        accent1: new THREE.Color('#38bdf8'),
        accent2: new THREE.Color('#818cf8'),
        hex1: '#38bdf8',
        hex2: '#818cf8',
      };
    }
    if (theme === 'matrix') {
      return {
        accent1: new THREE.Color('#10b981'),
        accent2: new THREE.Color('#06b6d4'),
        hex1: '#10b981',
        hex2: '#06b6d4',
      };
    }
    return {
      accent1: new THREE.Color('#22d3ee'),
      accent2: new THREE.Color('#7c3aed'),
      hex1: '#22d3ee',
      hex2: '#7c3aed',
    };
  }, [theme]);

  // Custom 3D Volumetric Displacement Shader
  const shaderUniforms = useMemo(
    () => ({
      uMap: { value: texture },
      uDisplacement: { value: 0.32 }, // Physical forward pop for facial features
      uCurve: { value: 0.28 },       // 3D Cylindrical head curvature
      uLightPos: { value: new THREE.Vector3(0, 0, 3) },
      uAccentColor: { value: colors.accent1 },
      uTime: { value: 0 },
    }),
    [texture, colors]
  );

  const vertexShader = `
    uniform sampler2D uMap;
    uniform float uDisplacement;
    uniform float uCurve;
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;

    void main() {
      vUv = uv;
      vec4 texColor = texture2D(uMap, uv);
      
      // Radial mask so the circular edge stays cleanly anchored
      float d = length(uv - vec2(0.5, 0.5));
      float rimMask = smoothstep(0.495, 0.08, d);
      
      // Cylindrical head curvature: center bows forward in 3D, ears and sides curve back
      float headCurve = cos(clamp((uv.x - 0.5) * 3.14159, -1.57, 1.57)) * uCurve;
      
      // Luminance-based facial feature extrusion (nose, brow, chin, tie protrude forward)
      float luma = dot(texColor.rgb, vec3(0.299, 0.587, 0.114));
      float featureExtrusion = luma * uDisplacement;
      
      vec3 pos = position;
      // Displace Z coordinate physically in true 3D space
      pos.z += (headCurve + featureExtrusion) * rimMask;
      
      vPosition = pos;
      // Recompute displaced surface normal
      vNormal = normalize(normalMatrix * normal + vec3(0.0, 0.0, (headCurve + featureExtrusion) * 0.4));
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `;

  const fragmentShader = `
    uniform sampler2D uMap;
    uniform vec3 uLightPos;
    uniform vec3 uAccentColor;
    uniform float uTime;
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;

    void main() {
      vec4 color = texture2D(uMap, vUv);
      
      // Circular silhouette cut
      float d = length(vUv - vec2(0.5, 0.5));
      if (d > 0.498) discard;
      
      // Dynamic 3D lighting calculation with physical normals
      vec3 lightDir = normalize(uLightPos - vPosition);
      float diff = max(dot(vNormal, lightDir), 0.0);
      
      // Specular rim reflection
      vec3 viewDir = vec3(0.0, 0.0, 1.0);
      vec3 halfDir = normalize(lightDir + viewDir);
      float spec = pow(max(dot(vNormal, halfDir), 0.0), 28.0);
      
      // Diffuse + Specular Lighting Integration
      vec3 finalColor = color.rgb * (0.85 + diff * 0.35) + uAccentColor * spec * 0.65;
      
      // Edge vignette softening
      float alpha = smoothstep(0.498, 0.47, d);
      
      gl_FragColor = vec4(finalColor, alpha);
    }
  `;

  // 40 Floating 3D Data Particles
  const [particlesPos, particlesColor] = useMemo(() => {
    const count = 40;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = 1.15 + (i % 4) * 0.22;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = -0.7 + (i % 8) * 0.2;
      pos[i * 3 + 2] = Math.sin(angle) * radius * 0.7;

      const c = i % 2 === 0 ? colors.accent1 : colors.accent2;
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return [pos, col];
  }, [colors]);

  useFrame((state, delta) => {
    const clampedDelta = Math.min(delta, 0.05);

    // Update shader uniforms
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      materialRef.current.uniforms.uAccentColor.value = colors.accent1;
      
      // Light moves dynamically with cursor
      const lx = mouseNorm.x * 2.5;
      const ly = mouseNorm.y * 2.5;
      materialRef.current.uniforms.uLightPos.value.set(lx, ly, 2.5);
    }

    if (lightRef.current) {
      lightRef.current.position.x = mouseNorm.x * 2.5;
      lightRef.current.position.y = mouseNorm.y * 2.5;
    }

    // Gyro Rings rotate continuously
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z += clampedDelta * 0.25;
      ring1Ref.current.rotation.x = THREE.MathUtils.damp(ring1Ref.current.rotation.x, 1.2 + mouseNorm.y * -0.2, 3, clampedDelta);
    }

    if (ring2Ref.current) {
      ring2Ref.current.rotation.z -= clampedDelta * 0.2;
      ring2Ref.current.rotation.x = THREE.MathUtils.damp(ring2Ref.current.rotation.x, -0.9 + mouseNorm.y * -0.15, 3, clampedDelta);
    }
  });

  return (
    <>
      {/* 3D ORBIT & DRAG CONTROLS: Allows user to click & drag the 3D model */}
      <OrbitControls
        ref={controlsRef}
        enableZoom={false}
        enablePan={false}
        dampingFactor={0.08}
        rotateSpeed={0.85}
        autoRotate={autoRotate}
        autoRotateSpeed={2.5}
        minPolarAngle={Math.PI / 3.5}
        maxPolarAngle={Math.PI / 1.7}
        minAzimuthAngle={-Math.PI / 2}
        maxAzimuthAngle={Math.PI / 2}
        onStart={() => onDragChange(true)}
        onEnd={() => onDragChange(false)}
      />

      <group position={[0, -0.05, 0]}>
        
        {/* Dynamic Studio Lighting */}
        <ambientLight intensity={0.9} />
        <directionalLight position={[3, 4, 3]} intensity={1.8} color="#ffffff" />
        <directionalLight position={[-3, 2, -1]} intensity={1.5} color={colors.hex2} />
        <pointLight
          ref={lightRef}
          position={[0, 0, 2.5]}
          intensity={3.0}
          color={colors.hex1}
          distance={5}
        />

        {/* GENTLE HOVER / FLOAT */}
        <Float speed={2.0} rotationIntensity={0.08} floatIntensity={0.25}>

          {/* 1. VOLUMETRIC 3D DISPLACED MESH OF RIZWAN */}
          <mesh ref={meshRef} position={[0, 0.05, 0]}>
            {/* 96x96 Subdivided Grid for smooth 3D displacement */}
            <planeGeometry args={[2.45, 2.45, 96, 96]} />
            <shaderMaterial
              ref={materialRef}
              vertexShader={vertexShader}
              fragmentShader={fragmentShader}
              uniforms={shaderUniforms}
              transparent
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* 2. 3D GYROSCOPIC HOLOGRAPHIC RING 1 */}
          <mesh ref={ring1Ref} position={[0, 0, 0.1]}>
            <torusGeometry args={[1.34, 0.008, 16, 64]} />
            <meshStandardMaterial
              color={colors.hex1}
              emissive={colors.hex1}
              emissiveIntensity={2.2}
              transparent
              opacity={0.65}
            />
          </mesh>

          {/* Satellite Node on Ring 1 */}
          <mesh position={[1.34, 0, 0.1]}>
            <sphereGeometry args={[0.032, 16, 16]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>

          {/* 3. 3D GYROSCOPIC HOLOGRAPHIC RING 2 */}
          <mesh ref={ring2Ref} position={[0, 0, 0.05]}>
            <torusGeometry args={[1.22, 0.006, 16, 64]} />
            <meshStandardMaterial
              color={colors.hex2}
              emissive={colors.hex2}
              emissiveIntensity={1.8}
              transparent
              opacity={0.5}
            />
          </mesh>

          {/* 4. BASE HOLOGRAPHIC PROJECTOR PEDESTAL */}
          <group position={[0, -1.25, 0]} rotation={[-Math.PI / 2.2, 0, 0]}>
            <mesh>
              <ringGeometry args={[1.1, 1.25, 48]} />
              <meshBasicMaterial color={colors.hex1} transparent opacity={0.6} side={THREE.DoubleSide} />
            </mesh>
            <mesh>
              <ringGeometry args={[0.8, 0.9, 36]} />
              <meshBasicMaterial color={colors.hex2} transparent opacity={0.45} side={THREE.DoubleSide} />
            </mesh>
            <mesh position={[0, 0, -0.05]}>
              <circleGeometry args={[1.28, 32]} />
              <meshBasicMaterial color="#040714" transparent opacity={0.8} side={THREE.DoubleSide} />
            </mesh>
          </group>

          {/* 5. FLOATING 3D DATA PARTICLES */}
          <points>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={40}
                array={particlesPos}
                itemSize={3}
              />
              <bufferAttribute
                attach="attributes-color"
                count={40}
                array={particlesColor}
                itemSize={3}
              />
            </bufferGeometry>
            <pointsMaterial
              size={0.038}
              vertexColors
              transparent
              opacity={0.8}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </points>

        </Float>
      </group>
    </>
  );
}
