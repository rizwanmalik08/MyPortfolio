import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Architectural Constellation Lattice
 * 
 * Concept:
 * - A refined spatial network of geometric node beacons in deep space (z: -5.5 to -9.0)
 * - Embodying the 3 pillars of Rizwan's work: Visual Design, Full-Stack Architecture & Growth
 * - Hairline laser filaments connecting proximate nodes with smooth traveling energy packets
 * - 100% subtle and unobtrusive: stays strictly behind text and cards without visual clutter
 */
export function ArchitecturalConstellation({ scrollRef, scrollProgress = 0, isMobile = false }) {
  const groupRef = useRef();
  const linesMeshRef = useRef();
  const nodesMeshRef = useRef();
  const pulsesMeshRef = useRef();

  const nodeCount = isMobile ? 14 : 26;

  // Generate deterministic 3D constellation nodes in deep background
  const [nodes, connections] = useMemo(() => {
    const rawNodes = [];
    const spreadX = isMobile ? 12 : 22;
    const spreadY = 18;
    const spreadZ = 3.5;
    const baseZ = -8.2;

    // Deterministic pseudo-random seed
    let seed = 42;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };

    for (let i = 0; i < nodeCount; i++) {
      rawNodes.push({
        x: (rand() - 0.5) * spreadX,
        y: (rand() - 0.5) * spreadY,
        z: baseZ + (rand() - 0.5) * spreadZ,
        originY: 0,
        speed: 0.2 + rand() * 0.4,
        phase: rand() * Math.PI * 2,
        colorType: i % 3, // 0: Cyan (Code), 1: Violet (Design), 2: Emerald (Growth)
      });
      rawNodes[i].originY = rawNodes[i].y;
    }

    // Connect nodes that are within optimal distance (hairline filaments)
    const conns = [];
    const maxDist = isMobile ? 5.2 : 5.8;

    for (let i = 0; i < rawNodes.length; i++) {
      let nodeConns = 0;
      for (let j = i + 1; j < rawNodes.length; j++) {
        const dx = rawNodes[i].x - rawNodes[j].x;
        const dy = rawNodes[i].y - rawNodes[j].y;
        const dz = rawNodes[i].z - rawNodes[j].z;
        const d = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (d < maxDist && nodeConns < 3) {
          conns.push({ from: i, to: j, dist: d });
          nodeConns++;
        }
      }
    }

    return [rawNodes, conns];
  }, [nodeCount, isMobile]);

  // Buffer geometries for lines and nodes
  const [linePositions, lineColors] = useMemo(() => {
    const pos = new Float32Array(connections.length * 2 * 3);
    const col = new Float32Array(connections.length * 2 * 3);

    const cCyan = new THREE.Color('#38bdf8');
    const cViolet = new THREE.Color('#818cf8');
    const cTeal = new THREE.Color('#2dd4bf');

    connections.forEach((conn, idx) => {
      const n1 = nodes[conn.from];
      const n2 = nodes[conn.to];

      pos[idx * 6 + 0] = n1.x;
      pos[idx * 6 + 1] = n1.y;
      pos[idx * 6 + 2] = n1.z;
      pos[idx * 6 + 3] = n2.x;
      pos[idx * 6 + 4] = n2.y;
      pos[idx * 6 + 5] = n2.z;

      const c1 = n1.colorType === 0 ? cCyan : n1.colorType === 1 ? cViolet : cTeal;
      const c2 = n2.colorType === 0 ? cCyan : n2.colorType === 1 ? cViolet : cTeal;

      col[idx * 6 + 0] = c1.r;
      col[idx * 6 + 1] = c1.g;
      col[idx * 6 + 2] = c1.b;
      col[idx * 6 + 3] = c2.r;
      col[idx * 6 + 4] = c2.g;
      col[idx * 6 + 5] = c2.b;
    });

    return [pos, col];
  }, [connections, nodes]);

  // Node vertices buffer
  const [nodePositions, nodeColors] = useMemo(() => {
    const pos = new Float32Array(nodeCount * 3);
    const col = new Float32Array(nodeCount * 3);

    const cCyan = new THREE.Color('#38bdf8');
    const cViolet = new THREE.Color('#a78bfa');
    const cEmerald = new THREE.Color('#34d399');

    nodes.forEach((n, idx) => {
      pos[idx * 3 + 0] = n.x;
      pos[idx * 3 + 1] = n.y;
      pos[idx * 3 + 2] = n.z;

      const c = n.colorType === 0 ? cCyan : n.colorType === 1 ? cViolet : cEmerald;
      col[idx * 3 + 0] = c.r;
      col[idx * 3 + 1] = c.g;
      col[idx * 3 + 2] = c.b;
    });

    return [pos, col];
  }, [nodeCount, nodes]);

  // Dynamic light pulses running on filaments
  const pulseCount = Math.min(connections.length, 16);
  const pulsePositions = useMemo(() => new Float32Array(pulseCount * 3), [pulseCount]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const clampedDelta = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;
    const p = scrollRef ? scrollRef.current : scrollProgress;

    // 1. Subtle vertical drift for nodes
    const nodePosAttr = nodesMeshRef.current?.geometry?.attributes?.position;
    const linePosAttr = linesMeshRef.current?.geometry?.attributes?.position;

    if (nodePosAttr && linePosAttr) {
      nodes.forEach((n, idx) => {
        const floatY = n.originY + Math.sin(t * n.speed + n.phase) * 0.25;
        nodePosAttr.setY(idx, floatY);
      });
      nodePosAttr.needsUpdate = true;

      connections.forEach((conn, idx) => {
        const n1 = nodes[conn.from];
        const n2 = nodes[conn.to];
        const floatY1 = n1.originY + Math.sin(t * n1.speed + n1.phase) * 0.25;
        const floatY2 = n2.originY + Math.sin(t * n2.speed + n2.phase) * 0.25;

        linePosAttr.setY(idx * 2, floatY1);
        linePosAttr.setY(idx * 2 + 1, floatY2);
      });
      linePosAttr.needsUpdate = true;
    }

    // 2. Traveling pulses along filaments
    const pulsePosAttr = pulsesMeshRef.current?.geometry?.attributes?.position;
    if (pulsePosAttr && connections.length > 0) {
      for (let i = 0; i < pulseCount; i++) {
        const conn = connections[i % connections.length];
        const n1 = nodes[conn.from];
        const n2 = nodes[conn.to];

        const progressT = (t * 0.45 + i * (1.0 / pulseCount)) % 1.0;
        const y1 = n1.originY + Math.sin(t * n1.speed + n1.phase) * 0.25;
        const y2 = n2.originY + Math.sin(t * n2.speed + n2.phase) * 0.25;

        pulsePosAttr.setXYZ(
          i,
          THREE.MathUtils.lerp(n1.x, n2.x, progressT),
          THREE.MathUtils.lerp(y1, y2, progressT),
          THREE.MathUtils.lerp(n1.z, n2.z, progressT)
        );
      }
      pulsePosAttr.needsUpdate = true;
    }

    // 3. Scroll and mouse parallax
    const targetX = state.pointer.x * 0.35;
    const targetY = -p * 3.5 + state.pointer.y * 0.25;

    groupRef.current.position.x = THREE.MathUtils.damp(groupRef.current.position.x, targetX, 2, clampedDelta);
    groupRef.current.position.y = THREE.MathUtils.damp(groupRef.current.position.y, targetY, 2, clampedDelta);
  });

  return (
    <group ref={groupRef}>
      {/* 1. Hairline Laser Filaments */}
      <lineSegments ref={linesMeshRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={connections.length * 2}
            array={linePositions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={connections.length * 2}
            array={lineColors}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          vertexColors
          transparent
          opacity={0.09}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>

      {/* 2. Geometric Node Beacons */}
      <points ref={nodesMeshRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={nodeCount}
            array={nodePositions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={nodeCount}
            array={nodeColors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={isMobile ? 0.05 : 0.07}
          vertexColors
          transparent
          opacity={0.55}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* 3. Luminous Traveling Data Pulses */}
      <points ref={pulsesMeshRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={pulseCount}
            array={pulsePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={isMobile ? 0.06 : 0.08}
          color="#ffffff"
          transparent
          opacity={0.7}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}
