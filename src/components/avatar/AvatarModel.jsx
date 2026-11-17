import React, { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useTexture } from '@react-three/drei';
import { easing } from 'maath';
import * as THREE from 'three';
import rizwan3dAvatarImg from '../../assets/rizwan-3d-avatar.jpg';

/**
 * Traverses GLB scene to find skeleton bones and morph targets.
 * Logs full hierarchy so user can inspect bone naming.
 */
function inspectAndFindBones(scene, modelUrl) {
  const bones = {
    neck: null,
    head: null,
    leftEye: null,
    rightEye: null,
    spine: null,
    blinkMeshes: [],
  };

  const boneList = [];

  scene.traverse((child) => {
    if (child.isBone) {
      boneList.push(child.name);
      const name = child.name.toLowerCase();

      if (!bones.neck && (name.includes('neck') || name.includes('cervical'))) {
        bones.neck = child;
      } else if (!bones.head && name.includes('head')) {
        bones.head = child;
      } else if (!bones.leftEye && (name.includes('lefteye') || name.includes('eye_l') || name.includes('eye.l'))) {
        bones.leftEye = child;
      } else if (!bones.rightEye && (name.includes('righteye') || name.includes('eye_r') || name.includes('eye.r'))) {
        bones.rightEye = child;
      } else if (!bones.spine && (name.includes('spine') || name.includes('chest'))) {
        bones.spine = child;
      }
    }

    // Check for eyelid/blink morph targets
    if (child.morphTargetDictionary) {
      const keys = Object.keys(child.morphTargetDictionary);
      const blinkKey = keys.find((k) =>
        /blink|eyeblink|eyesclosed/i.test(k)
      );
      if (blinkKey) {
        bones.blinkMeshes.push({
          mesh: child,
          index: child.morphTargetDictionary[blinkKey],
        });
      }
    }
  });

  // Developer logging (for user inspection)
  if (process.env.NODE_ENV !== 'production' || true) {
    console.groupCollapsed(`[AvatarModel] 3D Rig Analysis: ${modelUrl}`);
    console.log('Total bones found:', boneList.length, boneList);
    console.log('Neck bone:', bones.neck ? bones.neck.name : 'Not found (fallback: root rotation)');
    console.log('Head bone:', bones.head ? bones.head.name : 'Not found');
    console.log('Left Eye:', bones.leftEye ? bones.leftEye.name : 'None');
    console.log('Right Eye:', bones.rightEye ? bones.rightEye.name : 'None');
    console.log('Morph blink meshes:', bones.blinkMeshes.length);
    console.groupEnd();
  }

  return bones;
}

/**
 * Rigged GLB 3D Character
 * - Fixed body/shoulders/suit/tie
 * - Only Neck, Head, and Eyes bones rotate
 * - Delta-time damped easing via maath
 * - Morph-target blinking & breathing oscillation
 */
function RiggedGLBAvatar({
  modelUrl,
  targetRef,
  reducedMotion,
}) {
  const gltf = useGLTF(modelUrl);
  const groupRef = useRef();

  // Inspect bones once on model load
  const bones = useMemo(() => {
    return inspectAndFindBones(gltf.scene, modelUrl);
  }, [gltf, modelUrl]);

  // Keep original base transforms so rotations don't drift
  const baseTransforms = useMemo(() => {
    return {
      neck: bones.neck ? bones.neck.rotation.clone() : new THREE.Euler(),
      head: bones.head ? bones.head.rotation.clone() : new THREE.Euler(),
      leftEye: bones.leftEye ? bones.leftEye.rotation.clone() : new THREE.Euler(),
      rightEye: bones.rightEye ? bones.rightEye.rotation.clone() : new THREE.Euler(),
    };
  }, [bones]);

  // Blink timing state (held in ref for useFrame)
  const blinkState = useRef({
    nextBlinkTime: 2.0,
    isBlinking: false,
    blinkProgress: 0,
  });

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;
    const targets = targetRef.current;
    const isHovered = targets.isHovered;

    // Smooth damping speeds: fast & snappy on hover, gentle & lifelike during autonomous idle
    const smoothNeck = isHovered ? 0.14 : 0.35;
    const smoothHead = isHovered ? 0.12 : 0.30;
    const smoothEyes = 0.08; // Eyes reach target ~100ms before head

    // 1. ROTATE NECK BONE (40% distribution)
    if (bones.neck) {
      const targetNeckEuler = [
        baseTransforms.neck.x + targets.neckTarget[0],
        baseTransforms.neck.y + targets.neckTarget[1],
        baseTransforms.neck.z + targets.neckTarget[2],
      ];
      easing.dampE(bones.neck.rotation, targetNeckEuler, smoothNeck, delta);
    }

    // 2. ROTATE HEAD BONE (60% distribution)
    if (bones.head) {
      const targetHeadEuler = [
        baseTransforms.head.x + targets.headTarget[0],
        baseTransforms.head.y + targets.headTarget[1],
        baseTransforms.head.z + targets.headTarget[2],
      ];
      easing.dampE(bones.head.rotation, targetHeadEuler, smoothHead, delta);
    }

    // 3. ROTATE EYE BONES (leading slightly)
    if (bones.leftEye) {
      const targetLeftEyeEuler = [
        baseTransforms.leftEye.x + targets.eyesTarget[0],
        baseTransforms.leftEye.y + targets.eyesTarget[1],
        baseTransforms.leftEye.z,
      ];
      easing.dampE(bones.leftEye.rotation, targetLeftEyeEuler, smoothEyes, delta);
    }
    if (bones.rightEye) {
      const targetRightEyeEuler = [
        baseTransforms.rightEye.x + targets.eyesTarget[0],
        baseTransforms.rightEye.y + targets.eyesTarget[1],
        baseTransforms.rightEye.z,
      ];
      easing.dampE(bones.rightEye.rotation, targetRightEyeEuler, smoothEyes, delta);
    }

    // 4. SUBTLE BREATHING OSCILLATION (shoulders/chest oscillate gently without body translation)
    if (!reducedMotion && groupRef.current) {
      const breath = Math.sin(time * 2.2) * 0.004;
      groupRef.current.position.y = -1.35 + breath;
    }

    // 5. NATURAL BLINKING (Every 2–5 seconds, ~140ms duration)
    if (bones.blinkMeshes.length > 0 && !reducedMotion) {
      const bs = blinkState.current;
      if (!bs.isBlinking && time >= bs.nextBlinkTime) {
        bs.isBlinking = true;
        bs.blinkProgress = 0;
      }

      if (bs.isBlinking) {
        bs.blinkProgress += delta * 7.5; // ~133ms complete blink cycle
        const weight = Math.sin(Math.min(bs.blinkProgress, 1) * Math.PI);

        bones.blinkMeshes.forEach(({ mesh, index }) => {
          mesh.morphTargetInfluences[index] = weight;
        });

        if (bs.blinkProgress >= 1) {
          bs.isBlinking = false;
          bs.nextBlinkTime = time + 2.0 + Math.random() * 3.0; // Random interval 2-5s
        }
      }
    }
  });

  return (
    <group ref={groupRef} position={[0, -1.35, 0]} scale={[1.8, 1.8, 1.8]}>
      <primitive object={gltf.scene} />
    </group>
  );
}

/**
 * PLAN B: High-Fidelity 3D Volumetric Displaced Bust & Parallax Avatar
 * 
 * Used if no rigged GLB is supplied or if loading fails.
 * - Man in black suit, white shirt, dark tie, styled short dark hair & trimmed beard
 * - Fixed body/suit base: only the head and neck turn and tilt
 * - Cylindrical 3D face curvature + facial feature depth protrusion via vertex shader
 * - Specular cyan and magenta rim lighting highlights on jawline & hair
 */
function PlanBAvatarBust({ targetRef, reducedMotion }) {
  const meshRef = useRef();
  const materialRef = useRef();
  const texture = useTexture(rizwan3dAvatarImg);

  // Set texture color space
  useEffect(() => {
    if (texture) {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.needsUpdate = true;
    }
  }, [texture]);

  // Shader Uniforms for 3D depth protrusion & specular lighting
  const uniforms = useMemo(
    () => ({
      uMap: { value: texture },
      uDisplacement: { value: 0.32 }, // Extrusion for nose, brow, chin, tie
      uCurve: { value: 0.28 },       // Cylindrical head curvature
      uLightPos: { value: new THREE.Vector3(0, 0, 3) },
      uCyanRim: { value: new THREE.Color('#22d3ee') },
      uMagentaRim: { value: new THREE.Color('#f43f5e') },
      uTime: { value: 0 },
    }),
    [texture]
  );

  const vertexShader = `
    uniform sampler2D uMap;
    uniform float uDisplacement;
    uniform float uCurve;
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vWorldPosition;

    void main() {
      vUv = uv;
      vec4 texColor = texture2D(uMap, uv);

      // Radial circular boundary mask
      float d = length(uv - vec2(0.5, 0.5));
      float rimMask = smoothstep(0.495, 0.12, d);

      // 3D cylindrical skull curvature (center bows forward, sides recede)
      float headCurve = cos(clamp((uv.x - 0.5) * 3.14159, -1.57, 1.57)) * uCurve;

      // Facial luminance displacement (nose/cheeks/brow pop forward)
      float luma = dot(texColor.rgb, vec3(0.299, 0.587, 0.114));
      float featureExtrusion = luma * uDisplacement;

      vec3 pos = position;
      pos.z += (headCurve + featureExtrusion) * rimMask;

      vWorldPosition = (modelMatrix * vec4(pos, 1.0)).xyz;
      vNormal = normalize(normalMatrix * normal + vec3(0.0, 0.0, (headCurve + featureExtrusion) * 0.4));

      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `;

  const fragmentShader = `
    uniform sampler2D uMap;
    uniform vec3 uCyanRim;
    uniform vec3 uMagentaRim;
    uniform float uTime;
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vWorldPosition;

    void main() {
      vec4 baseColor = texture2D(uMap, vUv);

      // Circular clip with smooth anti-aliased edge
      float dist = length(vUv - vec2(0.5, 0.5));
      if (dist > 0.498) discard;

      // Camera view direction
      vec3 viewDir = normalize(cameraPosition - vWorldPosition);
      float NdotV = max(dot(vNormal, viewDir), 0.0);

      // Cyan rim light on left edge
      float leftRim = pow(1.0 - NdotV, 2.5) * max(-vNormal.x * 1.2, 0.0);
      // Magenta rim light on right edge
      float rightRim = pow(1.0 - NdotV, 2.5) * max(vNormal.x * 1.2, 0.0);

      vec3 finalColor = baseColor.rgb;
      finalColor += uCyanRim * leftRim * 1.1;
      finalColor += uMagentaRim * rightRim * 0.9;

      gl_FragColor = vec4(finalColor, baseColor.a);
    }
  `;

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const targets = targetRef.current;
    const isHovered = targets.isHovered;

    // Smooth damping using maath
    const smoothHead = isHovered ? 0.12 : 0.32;

    // Combined neck + head target for the Plan B bust
    const combinedTarget = [
      targets.neckTarget[0] + targets.headTarget[0],
      targets.neckTarget[1] + targets.headTarget[1],
      targets.neckTarget[2] + targets.headTarget[2],
    ];

    easing.dampE(meshRef.current.rotation, combinedTarget, smoothHead, delta);

    // Subtle breathing motion
    if (!reducedMotion) {
      const breath = Math.sin(state.clock.elapsedTime * 2.2) * 0.005;
      meshRef.current.position.y = breath;
    }

    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      {/* High-density grid for smooth 3D displacement */}
      <planeGeometry args={[2.55, 2.55, 96, 96]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

/**
 * Model Error Boundary
 * Automatically catches missing GLB files (e.g. 404 on /models/avatar.glb)
 * and falls back to Plan B volumetric 3D avatar bust.
 */
class ModelErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.info(
      `[AvatarModel] Model not found or unrigged at '${this.props.modelUrl}'. Activating Plan B volumetric 3D avatar.`
    );
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

/**
 * AvatarModel Component
 * Renders either the Rigged GLB Character or Plan B Fallback
 */
export function AvatarModel({
  modelUrl = '/models/avatar.glb',
  targetRef,
  reducedMotion = false,
}) {
  return (
    <ModelErrorBoundary
      modelUrl={modelUrl}
      fallback={<PlanBAvatarBust targetRef={targetRef} reducedMotion={reducedMotion} />}
    >
      <React.Suspense fallback={<PlanBAvatarBust targetRef={targetRef} reducedMotion={reducedMotion} />}>
        <RiggedAvatarGLB
          modelUrl={modelUrl}
          targetRef={targetRef}
          reducedMotion={reducedMotion}
        />
      </React.Suspense>
    </ModelErrorBoundary>
  );
}
