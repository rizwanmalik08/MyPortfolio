/**
 * Kanso Collective — Three.js Interactive 3D Product Customizer Engine
 * High-performance PBR renderer with real-time material swapping, OrbitControls & shadows.
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export class ProductViewer3D {
  constructor(options = {}) {
    this.container = options.container;
    this.modelUrl = options.modelUrl || '/assets/models/nova-headphones.glb';
    this.fallbackGallery = options.fallbackGallery;
    this.onLoadComplete = options.onLoadComplete;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.modelGroup = null;
    this.animId = null;
    this.resizeObserver = null;
    this.autoRotate = true;
    this.activeColorKey = 'obsidian';

    // Color definitions
    this.colorPalettes = {
      obsidian: { color: 0x111319, metalness: 0.85, roughness: 0.22 },
      silver: { color: 0xd1d5db, metalness: 0.95, roughness: 0.15 },
      gold: { color: 0xd4af37, metalness: 0.92, roughness: 0.18 },
      cyan: { color: 0x06b6d4, metalness: 0.88, roughness: 0.25 },
      emerald: { color: 0x10b981, metalness: 0.88, roughness: 0.25 }
    };

    this.init();
  }

  isWebGLAvailable() {
    try {
      const canvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (_) {
      return false;
    }
  }

  init() {
    if (!this.container || !this.isWebGLAvailable()) {
      if (this.fallbackGallery) {
        this.fallbackGallery.style.display = 'block';
      }
      return;
    }

    const width = this.container.clientWidth || 600;
    const height = this.container.clientHeight || 500;

    // 1. Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x060810);

    // 2. Camera (Wide, comfortable field of view)
    this.camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    this.camera.position.set(0, 0.4, 4.4);

    // 3. Renderer with PBR tone mapping & antialiasing
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.35;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap || THREE.PCFShadowMap;

    const canvas = this.renderer.domElement;
    canvas.className = 'three-canvas';
    this.container.appendChild(canvas);

    // 4. OrbitControls
    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.minDistance = 2.0;
    this.controls.maxDistance = 7.5;
    this.controls.maxPolarAngle = Math.PI / 2 + 0.1;
    this.controls.autoRotate = this.autoRotate;
    this.controls.autoRotateSpeed = 1.6;

    // 5. Studio 4-Point Lighting & Ambient Wrap
    const hemiLight = new THREE.HemisphereLight(0x60a5fa, 0x1e1b4b, 1.4);
    this.scene.add(hemiLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    this.scene.add(ambientLight);

    // Key Light
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    keyLight.position.set(4, 6, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.001;
    this.scene.add(keyLight);

    // Fill Light (Cool cyan tint)
    const fillLight = new THREE.DirectionalLight(0x38bdf8, 1.8);
    fillLight.position.set(-5, 2, -3);
    this.scene.add(fillLight);

    // Rim Light (Warm Gold highlight)
    const rimLight = new THREE.DirectionalLight(0xf59e0b, 2.0);
    rimLight.position.set(0, 5, -5);
    this.scene.add(rimLight);

    // Front Light (Illuminates front face and prevents pitch-black surfaces)
    const frontLight = new THREE.DirectionalLight(0xffffff, 1.2);
    frontLight.position.set(0, 0.5, 5);
    this.scene.add(frontLight);

    // Contact Shadow Ground Disc
    const shadowGeo = new THREE.PlaneGeometry(6, 6);
    const shadowMat = new THREE.ShadowMaterial({ opacity: 0.45 });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -1.5;
    shadowPlane.receiveShadow = true;
    this.scene.add(shadowPlane);

    // Subtle Architectural Grid Floor
    const grid = new THREE.GridHelper(10, 20, 0x1e293b, 0x0f172a);
    grid.position.y = -1.51;
    this.scene.add(grid);

    // 6. Loading Overlay
    this.createLoaderOverlay();

    // 7. Load Genuine 3D Model with Instant Procedural Fallback
    this.loadModel(this.modelUrl);

    // 8. Auto-Resize Listener + ResizeObserver (fixes tab switches and hidden states)
    window.addEventListener('resize', this.onResize.bind(this));
    if (window.ResizeObserver) {
      this.resizeObserver = new ResizeObserver(() => this.onResize());
      this.resizeObserver.observe(this.container);
    }

    this.animate();
  }

  createLoaderOverlay() {
    let loader = this.container.querySelector('.three-loader-overlay');
    if (!loader) {
      loader = document.createElement('div');
      loader.className = 'three-loader-overlay';
      loader.innerHTML = `
        <div class="three-spinner"></div>
        <span style="margin-top: 14px; font-family: var(--font-mono); font-size: 11px; color: var(--accent-cyan); letter-spacing: 0.12em; text-transform: uppercase;">
          Streaming 3D Experience...
        </span>
      `;
      this.container.appendChild(loader);
    }
    this.loaderEl = loader;
  }

  hideLoaderOverlay() {
    if (this.loaderEl) {
      this.loaderEl.style.opacity = '0';
      this.loaderEl.style.pointerEvents = 'none';
      setTimeout(() => {
        if (this.loaderEl) this.loaderEl.remove();
        this.loaderEl = null;
      }, 350);
    }
  }

  // Auto-scales and centers any model (GLTF or procedural)
  fitAndMountModel(rawObject, targetSize = 1.9) {
    if (this.modelGroup) {
      this.scene.remove(this.modelGroup);
    }

    const pivot = new THREE.Group();
    pivot.name = 'ModelPivot';
    pivot.add(rawObject);

    rawObject.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(rawObject);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    // Center model at pivot origin
    rawObject.position.x = -center.x;
    rawObject.position.y = -center.y;
    rawObject.position.z = -center.z;

    // Normalize scale so longest dimension is targetSize
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const scaleFactor = targetSize / maxDim;
    pivot.scale.setScalar(scaleFactor);

    // Enable shadows across all meshes
    pivot.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    this.scene.add(pivot);
    this.modelGroup = pivot;

    // Apply active color palette
    this.setColor(this.activeColorKey);

    this.hideLoaderOverlay();
    this.resetCamera();

    if (this.onLoadComplete) {
      this.onLoadComplete(this);
    }
  }

  loadModel(url) {
    const isWatch = url && url.includes('smartwatch');

    // 1. Set fallback timer: If network / parse hangs for > 2s, mount procedural model
    const fallbackTimer = setTimeout(() => {
      if (!this.modelGroup) {
        console.log('[3D Engine] Network delay: Mounting procedural 3D model immediately.');
        const procModel = isWatch ? this.buildProceduralSmartwatch() : this.buildProceduralHeadphones();
        this.fitAndMountModel(procModel);
      }
    }, 2000);

    // 2. Load GLB via standard GLTFLoader
    const loader = new GLTFLoader();
    loader.load(
      url,
      (gltf) => {
        clearTimeout(fallbackTimer);
        this.fitAndMountModel(gltf.scene);
      },
      undefined,
      (error) => {
        clearTimeout(fallbackTimer);
        console.warn('[3D Engine] GLB fetch failed. Falling back to high-fidelity procedural 3D mesh:', error);
        const procModel = isWatch ? this.buildProceduralSmartwatch() : this.buildProceduralHeadphones();
        this.fitAndMountModel(procModel);
      }
    );
  }

  // High-fidelity procedural headphones
  buildProceduralHeadphones() {
    const root = new THREE.Group();
    root.name = 'KansoHeadphonesProcedural';

    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x111319,
      metalness: 0.85,
      roughness: 0.22,
      name: 'BodyMaterial'
    });

    const cushionMat = new THREE.MeshStandardMaterial({
      color: 0x1a1c24,
      metalness: 0.1,
      roughness: 0.75,
      name: 'CushionMaterial'
    });

    const accentMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.95,
      roughness: 0.15,
      name: 'AccentMaterial'
    });

    const headbandPaddedMat = new THREE.MeshStandardMaterial({
      color: 0x181920,
      metalness: 0.2,
      roughness: 0.65,
      name: 'HeadbandMaterial'
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
    const headband = new THREE.Mesh(archGeo, bodyMat);
    headband.name = 'headband_arch';
    root.add(headband);

    // 2. Headband Cushion Padding
    const cushionPoints = [
      new THREE.Vector3(-0.85, 1.32, 0),
      new THREE.Vector3(-0.45, 1.46, 0),
      new THREE.Vector3(0.00, 1.50, 0),
      new THREE.Vector3(0.45, 1.46, 0),
      new THREE.Vector3(0.85, 1.32, 0)
    ];
    const cushionCurve = new THREE.CatmullRomCurve3(cushionPoints);
    const cushionGeo = new THREE.TubeGeometry(cushionCurve, 36, 0.11, 20, false);
    const headPad = new THREE.Mesh(cushionGeo, headbandPaddedMat);
    headPad.name = 'headband_cushion';
    root.add(headPad);

    // 3. Earcups (Symmetric & Fully Connected)
    ['left', 'right'].forEach(side => {
      const earcup = new THREE.Group();
      earcup.name = `earcup_${side}`;
      const sign = side === 'left' ? -1 : 1;
      earcup.position.set(sign * 1.32, -0.45, 0);

      // Connecting Stem / Collar
      const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.22, 24), accentMat);
      collar.name = `collar_${side}`;
      collar.position.set(0, 0.32, 0);
      earcup.add(collar);

      // Gimbal Pivot Hub
      const pivot = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.08, 24), accentMat);
      pivot.name = `pivot_${side}`;
      pivot.rotation.z = Math.PI / 2;
      pivot.position.set(sign * 0.16, 0.12, 0);
      earcup.add(pivot);

      // Outer Acoustic Shell
      const shell = new THREE.Mesh(new THREE.CylinderGeometry(0.64, 0.62, 0.28, 48), bodyMat);
      shell.name = `shell_${side}`;
      shell.rotation.z = Math.PI / 2;
      shell.position.x = sign * 0.05;
      earcup.add(shell);

      // Outer Decorative Faceplate Disc
      const faceplate = new THREE.Mesh(new THREE.CylinderGeometry(0.58, 0.58, 0.04, 48), bodyMat);
      faceplate.name = `faceplate_${side}`;
      faceplate.rotation.z = Math.PI / 2;
      faceplate.position.x = sign * 0.20;
      earcup.add(faceplate);

      // Metallic Accent Ring
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.026, 20, 48), accentMat);
      ring.name = `accent_ring_${side}`;
      ring.rotation.y = Math.PI / 2;
      ring.position.x = sign * 0.18;
      earcup.add(ring);

      // Inner Ear Cushion (Facing Inwards towards Head)
      const cushion = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.20, 24, 48), cushionMat);
      cushion.name = `cushion_${side}`;
      cushion.rotation.y = Math.PI / 2;
      cushion.position.x = -sign * 0.08;
      earcup.add(cushion);

      // Speaker Grille Cloth
      const grilleMat = new THREE.MeshStandardMaterial({ color: 0x08080a, metalness: 0.6, roughness: 0.4 });
      const grille = new THREE.Mesh(new THREE.CircleGeometry(0.48, 32), grilleMat);
      grille.name = `grille_${side}`;
      grille.rotation.y = -sign * (Math.PI / 2);
      grille.position.x = -sign * 0.13;
      earcup.add(grille);

      // Controls on right cup
      if (side === 'right') {
        const dial = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.08, 24), accentMat);
        dial.name = 'volume_dial';
        dial.rotation.z = Math.PI / 2;
        dial.position.set(0.24, -0.20, 0.32);
        earcup.add(dial);

        const btn = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.14, 0.06), accentMat);
        btn.name = 'power_btn';
        btn.position.set(0.22, 0.16, 0.34);
        earcup.add(btn);
      }

      root.add(earcup);
    });

    return root;
  }

  // High-fidelity procedural smartwatch
  buildProceduralSmartwatch() {
    const root = new THREE.Group();
    root.name = 'KansoSmartwatchProcedural';

    const caseMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.9,
      roughness: 0.2,
      name: 'WatchCaseMaterial'
    });

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x0284c7,
      metalness: 0.1,
      roughness: 0.05,
      transmission: 0.9,
      thickness: 0.5
    });

    const strapMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.1,
      roughness: 0.8
    });

    // Case
    const caseMesh = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.0, 0.28, 48), caseMat);
    caseMesh.name = 'watch_case';
    root.add(caseMesh);

    // Bezel Ring
    const bezel = new THREE.Mesh(new THREE.TorusGeometry(0.98, 0.05, 16, 48), caseMat);
    bezel.rotation.x = Math.PI / 2;
    bezel.position.y = 0.14;
    root.add(bezel);

    // Glass Display
    const glass = new THREE.Mesh(new THREE.CylinderGeometry(0.92, 0.92, 0.02, 48), glassMat);
    glass.position.y = 0.145;
    root.add(glass);

    // Straps (Top and Bottom)
    const strapTop = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.12, 1.5), strapMat);
    strapTop.position.set(0, -0.04, 1.5);
    root.add(strapTop);

    const strapBottom = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.12, 1.5), strapMat);
    strapBottom.position.set(0, -0.04, -1.5);
    root.add(strapBottom);

    return root;
  }

  setColor(paletteKey) {
    if (!this.modelGroup) return;
    this.activeColorKey = paletteKey;
    const palette = this.colorPalettes[paletteKey] || this.colorPalettes.obsidian;

    this.modelGroup.traverse((child) => {
      if (child.isMesh && child.material) {
        const name = (child.name || '').toLowerCase();
        const matName = (child.material.name || '').toLowerCase();

        if (
          name.includes('shell') ||
          name.includes('faceplate') ||
          name.includes('watch_case') ||
          name.includes('headband_arch') ||
          matName.includes('bodymaterial') ||
          matName.includes('watchcasematerial')
        ) {
          child.material.color.setHex(palette.color);
          child.material.metalness = palette.metalness;
          child.material.roughness = palette.roughness;
          child.material.needsUpdate = true;
        }
      }
    });
  }

  toggleAutoRotate() {
    this.autoRotate = !this.autoRotate;
    if (this.controls) {
      this.controls.autoRotate = this.autoRotate;
    }
    return this.autoRotate;
  }

  resetCamera() {
    if (!this.camera || !this.controls) return;
    this.camera.position.set(0, 0.4, 4.4);
    this.controls.target.set(0, 0, 0);
    this.controls.update();
  }

  onResize() {
    if (!this.container || !this.renderer || !this.camera) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    if (width > 0 && height > 0) {
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
    }
  }

  animate() {
    this.animId = requestAnimationFrame(this.animate.bind(this));
    if (this.controls) {
      this.controls.update();
    }
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }

  destroy() {
    if (this.animId) cancelAnimationFrame(this.animId);
    window.removeEventListener('resize', this.onResize.bind(this));
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
    if (this.renderer) {
      this.renderer.dispose();
      this.renderer.domElement.remove();
    }
  }
}
