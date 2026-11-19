import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import fs from 'fs';
import path from 'path';

// Node.js web standard polyfills for GLTFExporter
if (typeof globalThis.FileReader === 'undefined') {
  globalThis.FileReader = class FileReader {
    readAsArrayBuffer(blob) {
      blob.arrayBuffer().then(buf => {
        this.result = buf;
        if (this.onload) this.onload({ target: this });
        if (this.onloadend) this.onloadend({ target: this });
      }).catch(err => {
        if (this.onerror) this.onerror(err);
      });
    }
    readAsDataURL(blob) {
      blob.arrayBuffer().then(buf => {
        this.result = 'data:' + (blob.type || 'application/octet-stream') + ';base64,' + Buffer.from(buf).toString('base64');
        if (this.onload) this.onload({ target: this });
        if (this.onloadend) this.onloadend({ target: this });
      }).catch(err => {
        if (this.onerror) this.onerror(err);
      });
    }
  };
}

const modelsDir = path.resolve('nova-store/public/assets/models');
if (!fs.existsSync(modelsDir)) {
  fs.mkdirSync(modelsDir, { recursive: true });
}

// ----------------------------------------------------------------------
// 1. GENERATE LUXURY OVER-EAR WIRELESS HEADPHONES (KANSO AUDIO APEX)
// ----------------------------------------------------------------------
function buildHeadphones() {
  const root = new THREE.Group();
  root.name = 'KansoHeadphones';

  // Materials
  const bodyMaterial = new THREE.MeshStandardMaterial({
    color: 0x111319,
    metalness: 0.85,
    roughness: 0.22,
    name: 'BodyMaterial',
  });

  const cushionMaterial = new THREE.MeshStandardMaterial({
    color: 0x1a1c24,
    metalness: 0.1,
    roughness: 0.75,
    name: 'CushionMaterial',
  });

  const metalAccentMaterial = new THREE.MeshStandardMaterial({
    color: 0xd4af37, // Royal gold accent
    metalness: 0.95,
    roughness: 0.15,
    name: 'AccentMaterial',
  });

  const headbandPaddedMaterial = new THREE.MeshStandardMaterial({
    color: 0x181920,
    metalness: 0.2,
    roughness: 0.65,
    name: 'HeadbandMaterial',
  });

  // 1. Continuous Symmetric Headband Arch
  const archPoints = [
    new THREE.Vector3(-1.32, -0.15, 0),
    new THREE.Vector3(-1.30, 0.35, 0),
    new THREE.Vector3(-1.18, 0.90, 0),
    new THREE.Vector3(-0.72, 1.38, 0),
    new THREE.Vector3(0.00, 1.48, 0),
    new THREE.Vector3(0.72, 1.38, 0),
    new THREE.Vector3(1.18, 0.90, 0),
    new THREE.Vector3(1.30, 0.35, 0),
    new THREE.Vector3(1.32, -0.15, 0)
  ];
  const archCurve = new THREE.CatmullRomCurve3(archPoints);
  const archGeo = new THREE.TubeGeometry(archCurve, 64, 0.065, 20, false);
  const headband = new THREE.Mesh(archGeo, bodyMaterial);
  headband.name = 'headband_arch';
  root.add(headband);

  // 2. Headband Cushion (Padded Crown Section)
  const cushionPoints = [
    new THREE.Vector3(-0.85, 1.32, 0),
    new THREE.Vector3(-0.45, 1.46, 0),
    new THREE.Vector3(0.00, 1.50, 0),
    new THREE.Vector3(0.45, 1.46, 0),
    new THREE.Vector3(0.85, 1.32, 0)
  ];
  const cushionCurve = new THREE.CatmullRomCurve3(cushionPoints);
  const cushionGeo = new THREE.TubeGeometry(cushionCurve, 36, 0.11, 20, false);
  const headPad = new THREE.Mesh(cushionGeo, headbandPaddedMaterial);
  headPad.name = 'headband_cushion';
  root.add(headPad);

  // 3. Earcup assemblies (Left and Right)
  function createEarcup(side) {
    const earcupGroup = new THREE.Group();
    earcupGroup.name = `earcup_${side}`;
    const sign = side === 'left' ? -1 : 1;
    earcupGroup.position.set(sign * 1.32, -0.45, 0);

    // Stem Slider Collar (Connecting Headband to Gimbal)
    const collarGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.22, 24);
    const collar = new THREE.Mesh(collarGeo, metalAccentMaterial);
    collar.name = `collar_${side}`;
    collar.position.set(0, 0.32, 0);
    earcupGroup.add(collar);

    // Gimbal Yoke Pivot (Machined disc holding the cup)
    const pivotGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.08, 24);
    const pivot = new THREE.Mesh(pivotGeo, metalAccentMaterial);
    pivot.name = `pivot_${side}`;
    pivot.rotation.z = Math.PI / 2;
    pivot.position.set(sign * 0.16, 0.12, 0);
    earcupGroup.add(pivot);

    // Outer Acoustic Shell
    const shellGeo = new THREE.CylinderGeometry(0.64, 0.62, 0.28, 48);
    const shell = new THREE.Mesh(shellGeo, bodyMaterial);
    shell.name = `shell_${side}`;
    shell.rotation.z = Math.PI / 2;
    shell.position.x = sign * 0.05;
    earcupGroup.add(shell);

    // Outer Decorative Faceplate Disc
    const faceplateGeo = new THREE.CylinderGeometry(0.58, 0.58, 0.04, 48);
    const faceplate = new THREE.Mesh(faceplateGeo, bodyMaterial);
    faceplate.name = `faceplate_${side}`;
    faceplate.rotation.z = Math.PI / 2;
    faceplate.position.x = sign * 0.20;
    earcupGroup.add(faceplate);

    // Polished Metallic Chamfer Accent Ring
    const ringGeo = new THREE.TorusGeometry(0.62, 0.026, 20, 48);
    const ring = new THREE.Mesh(ringGeo, metalAccentMaterial);
    ring.name = `accent_ring_${side}`;
    ring.rotation.y = Math.PI / 2;
    ring.position.x = sign * 0.18;
    earcupGroup.add(ring);

    // Inner Memory Foam Ear Cushion (Faces inwards towards head)
    const padTorusGeo = new THREE.TorusGeometry(0.55, 0.20, 24, 48);
    const cushion = new THREE.Mesh(padTorusGeo, cushionMaterial);
    cushion.name = `cushion_${side}`;
    cushion.rotation.y = Math.PI / 2;
    cushion.position.x = -sign * 0.08;
    earcupGroup.add(cushion);

    // Speaker Grille Cloth
    const grilleGeo = new THREE.CircleGeometry(0.48, 32);
    const grilleMat = new THREE.MeshStandardMaterial({
      color: 0x08080a,
      metalness: 0.6,
      roughness: 0.4,
      name: 'GrilleMaterial'
    });
    const grille = new THREE.Mesh(grilleGeo, grilleMat);
    grille.name = `grille_${side}`;
    grille.rotation.y = -sign * (Math.PI / 2);
    grille.position.x = -sign * 0.13;
    earcupGroup.add(grille);

    // Rotary Dial and Controls on Right Cup
    if (side === 'right') {
      const dialGeo = new THREE.CylinderGeometry(0.11, 0.11, 0.08, 24);
      const dial = new THREE.Mesh(dialGeo, metalAccentMaterial);
      dial.name = 'volume_dial';
      dial.rotation.z = Math.PI / 2;
      dial.position.set(0.24, -0.20, 0.32);
      earcupGroup.add(dial);

      const btnGeo = new THREE.BoxGeometry(0.05, 0.14, 0.06);
      const btn = new THREE.Mesh(btnGeo, metalAccentMaterial);
      btn.name = 'power_btn';
      btn.position.set(0.22, 0.16, 0.34);
      earcupGroup.add(btn);
    }

    return earcupGroup;
  }

  root.add(createEarcup('left'));
  root.add(createEarcup('right'));

  return root;
}

// ----------------------------------------------------------------------
// 2. GENERATE LUXURY SMARTWATCH (NOVA CHRONO HORIZON)
// ----------------------------------------------------------------------
function buildSmartwatch() {
  const root = new THREE.Group();
  root.name = 'NovaSmartwatch';

  const caseMaterial = new THREE.MeshStandardMaterial({
    color: 0x1e2129,
    metalness: 0.92,
    roughness: 0.18,
    name: 'WatchCaseMaterial',
  });

  const bezelMaterial = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    metalness: 0.95,
    roughness: 0.12,
    name: 'WatchBezelMaterial',
  });

  const glassMaterial = new THREE.MeshStandardMaterial({
    color: 0x050810,
    metalness: 0.3,
    roughness: 0.05,
    name: 'WatchGlassMaterial',
  });

  const strapMaterial = new THREE.MeshStandardMaterial({
    color: 0x12141a,
    metalness: 0.1,
    roughness: 0.8,
    name: 'WatchStrapMaterial',
  });

  // Watch Main Body
  const caseGeo = new THREE.CylinderGeometry(1.1, 1.1, 0.28, 48);
  const watchCase = new THREE.Mesh(caseGeo, caseMaterial);
  watchCase.name = 'watch_case';
  root.add(watchCase);

  // Bezel Ring
  const bezelGeo = new THREE.TorusGeometry(1.08, 0.04, 16, 48);
  const bezel = new THREE.Mesh(bezelGeo, bezelMaterial);
  bezel.name = 'watch_bezel';
  bezel.rotation.x = Math.PI / 2;
  bezel.position.y = 0.14;
  root.add(bezel);

  // Screen Glass
  const screenGeo = new THREE.CylinderGeometry(1.02, 1.02, 0.05, 48);
  const screen = new THREE.Mesh(screenGeo, glassMaterial);
  screen.name = 'watch_screen';
  screen.position.y = 0.15;
  root.add(screen);

  // Crown Dial (Right side)
  const crownGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.16, 24);
  const crown = new THREE.Mesh(crownGeo, bezelMaterial);
  crown.name = 'watch_crown';
  crown.rotation.z = Math.PI / 2;
  crown.position.set(1.18, 0, 0);
  root.add(crown);

  // Straps (Top and Bottom)
  const strapGeo = new THREE.BoxGeometry(1.05, 0.12, 1.6);
  const topStrap = new THREE.Mesh(strapGeo, strapMaterial);
  topStrap.name = 'watch_strap_top';
  topStrap.position.set(0, -0.05, -1.5);
  root.add(topStrap);

  const bottomStrap = new THREE.Mesh(strapGeo, strapMaterial);
  bottomStrap.name = 'watch_strap_bottom';
  bottomStrap.position.set(0, -0.05, 1.5);
  root.add(bottomStrap);

  return root;
}

// ----------------------------------------------------------------------
// EXPORT BOTH TO GLB
// ----------------------------------------------------------------------
async function exportModel(scene, filename) {
  const exporter = new GLTFExporter();
  const gltf = await exporter.parseAsync(scene, { binary: true });
  const outPath = path.join(modelsDir, filename);
  fs.writeFileSync(outPath, Buffer.from(gltf));
  console.log(`Exported 3D model to: ${outPath} (${fs.statSync(outPath).size} bytes)`);
  return outPath;
}

(async () => {
  try {
    const headphones = buildHeadphones();
    await exportModel(headphones, 'nova-headphones.glb');

    const smartwatch = buildSmartwatch();
    await exportModel(smartwatch, 'nova-smartwatch.glb');

    console.log('All 3D models generated successfully!');
  } catch (err) {
    console.error('Error generating 3D models:', err);
    process.exit(1);
  }
})();
