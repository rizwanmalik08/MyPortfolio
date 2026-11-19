/**
 * NOVA STORE — Three.js Interactive 3D Product Customizer Engine
 * High-performance PBR renderer with real-time material swapping, OrbitControls & shadows.
 */

import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.160.0/examples/jsm/loaders/GLTFLoader.js';

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
    this.autoRotate = true;

    // Color definitions
    this.colorPalettes = {
      obsidian: { color: 0x111319, metalness: 0.85, roughness: 0.22 },
      silver:   { color: 0xd1d5db, metalness: 0.95, roughness: 0.15 },
      gold:     { color: 0xd4af37, metalness: 0.92, roughness: 0.18 },
      cyan:     { color: 0x06b6d4, metalness: 0.88, roughness: 0.25 },
      emerald:  { color: 0x10b981, metalness: 0.88, roughness: 0.25 }
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

    // 2. Camera
    this.camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    this.camera.position.set(0, 0.4, 4.2);

    // 3. Renderer with PBR tone mapping
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.25;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const canvas = this.renderer.domElement;
    canvas.className = 'three-canvas';
    this.container.appendChild(canvas);

    // 4. OrbitControls
    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.minDistance = 2.2;
    this.controls.maxDistance = 6.5;
    this.controls.maxPolarAngle = Math.PI / 2 + 0.15; // Don't flip below horizon
    this.controls.autoRotate = this.autoRotate;
    this.controls.autoRotateSpeed = 1.5;

    // 5. Studio 3-Point Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    this.scene.add(ambientLight);

    // Key Light
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(4, 6, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.001;
    this.scene.add(keyLight);

    // Fill Light (Cool tint)
    const fillLight = new THREE.DirectionalLight(0x38bdf8, 1.4);
    fillLight.position.set(-5, 2, -3);
    this.scene.add(fillLight);

    // Rim Light (Warm Gold/Rose highlight)
    const rimLight = new THREE.DirectionalLight(0xd4af37, 1.6);
    rimLight.position.set(0, 5, -5);
    this.scene.add(rimLight);

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

    // 6. Load Genuine 3D Model
    this.loadModel(this.modelUrl);

    // 7. Event Listeners
    window.addEventListener('resize', this.onResize.bind(this));
    this.animate();
  }

  loadModel(url) {
    const loader = new GLTFLoader();
    loader.load(
      url,
      (gltf) => {
        if (this.modelGroup) {
          this.scene.remove(this.modelGroup);
        }

        this.modelGroup = gltf.scene;
        this.modelGroup.position.set(0, 0, 0);

        // Center and scale model
        const box = new THREE.Box3().setFromObject(this.modelGroup);
        const center = box.getCenter(new THREE.Vector3());
        this.modelGroup.position.sub(center);

        // Enable shadows across all meshes
        this.modelGroup.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        this.scene.add(this.modelGroup);

        if (this.onLoadComplete) {
          this.onLoadComplete(this);
        }
      },
      undefined,
      (error) => {
        console.warn('Failed to load 3D GLB, falling back to gallery:', error);
        if (this.fallbackGallery) {
          this.fallbackGallery.style.display = 'block';
        }
      }
    );
  }

  setColor(paletteKey) {
    if (!this.modelGroup) return;
    const palette = this.colorPalettes[paletteKey] || this.colorPalettes.obsidian;

    this.modelGroup.traverse((child) => {
      if (child.isMesh) {
        // Change color on main outer shells, bezels, and body
        if (
          child.name.includes('shell') ||
          child.name.includes('watch_case') ||
          child.name.includes('headband_arch') ||
          child.material?.name === 'BodyMaterial' ||
          child.material?.name === 'WatchCaseMaterial'
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
    this.camera.position.set(0, 0.4, 4.2);
    this.controls.target.set(0, 0, 0);
    this.controls.update();
  }

  onResize() {
    if (!this.container || !this.renderer || !this.camera) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
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
    if (this.renderer) {
      this.renderer.dispose();
      this.renderer.domElement.remove();
    }
  }
}
