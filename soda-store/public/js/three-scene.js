import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/DRACOLoader.js';

export class SodaScene {
  constructor(containerId, onLoadedCallback) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      console.error(`Container #${containerId} not found`);
      return;
    }

    this.onLoadedCallback = onLoadedCallback;
    this.isSwitching = false;
    this.currentFlavor = 'diet-classic';

    // Mouse coordinates (normalized -1 to 1)
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.clock = new THREE.Clock();

    // Scene collections
    this.canGroup = new THREE.Group();
    this.canMesh = null;
    this.canMaterial = null;
    this.floatingObjects = [];
    this.cherriesGroup = new THREE.Group();
    this.blueberriesGroup = new THREE.Group();
    this.leavesGroup = new THREE.Group();

    // Textures map
    this.textures = {};

    this.init();
  }

  init() {
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;

    // 1. Scene
    this.scene = new THREE.Scene();

    // 2. Camera
    this.camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    this.updateCameraPosition();

    // 3. Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.container.appendChild(this.renderer.domElement);

    // 4. Studio Lighting
    this.setupLighting();

    // 5. Add Groups
    this.scene.add(this.canGroup);
    this.scene.add(this.cherriesGroup);
    this.scene.add(this.blueberriesGroup);
    this.scene.add(this.leavesGroup);

    // Default: Cherries visible, Blueberries hidden
    this.blueberriesGroup.visible = false;

    // 6. Load Assets
    this.loadAssets();

    // Safety fallback: Dismiss preloader after 2.5s regardless
    setTimeout(() => {
      if (typeof this.onLoadedCallback === 'function') {
        this.onLoadedCallback();
      }
    }, 2500);

    // 7. Event Listeners
    window.addEventListener('resize', this.onResize.bind(this));
    window.addEventListener('mousemove', this.onMouseMove.bind(this));
    window.addEventListener('touchmove', this.onTouchMove.bind(this), { passive: true });

    // 8. Start Render Loop
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  updateCameraPosition() {
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
    
    if (isMobile) {
      this.camera.position.set(0, 0, 7.8);
      this.canGroup.position.set(0, 0.2, 0);
    } else if (isTablet) {
      this.camera.position.set(0, 0, 7.0);
      this.canGroup.position.set(0, 0, 0);
    } else {
      this.camera.position.set(0, 0, 6.4);
      this.canGroup.position.set(0, -0.05, 0);
    }
  }

  setupLighting() {
    // Ambient Light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    this.scene.add(ambientLight);

    // Key Light (Main soft light from top-left front)
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
    keyLight.position.set(-3, 4, 4);
    this.scene.add(keyLight);

    // Fill Light (Teal/Cyan bounce from bottom right)
    const fillLight = new THREE.DirectionalLight(0x38bdf8, 1.5);
    fillLight.position.set(4, -2, 3);
    this.scene.add(fillLight);

    // Rim/Back Light (Separates can from dark background with pink/white rim)
    const rimLight = new THREE.DirectionalLight(0xfbcfe8, 2.6);
    rimLight.position.set(0, 4, -4);
    this.scene.add(rimLight);

    // Top Rim Light
    const topLight = new THREE.DirectionalLight(0xffffff, 1.2);
    topLight.position.set(0, 6, 0);
    this.scene.add(topLight);

    // Subtle Ground Shadow Plate
    const shadowGeo = new THREE.PlaneGeometry(6, 6);
    const shadowMat = new THREE.ShadowMaterial({ opacity: 0.25 });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -2.2;
    this.scene.add(shadowMesh);
  }

  loadAssets() {
    let assetsLoadedCount = 0;
    const totalAssets = 6;
    const checkAllLoaded = () => {
      assetsLoadedCount++;
      if (assetsLoadedCount >= totalAssets && typeof this.onLoadedCallback === 'function') {
        this.onLoadedCallback();
      }
    };

    const textureLoader = new THREE.TextureLoader();

    // Setup DRACOLoader
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/vendor/draco/');

    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);

    // Load Textures
    textureLoader.load('/assets/textures/green_base_color.jpg', (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.flipY = false;
      this.textures['diet-classic'] = tex;
      if (this.canMaterial && this.currentFlavor === 'diet-classic') {
        this.canMaterial.map = tex;
        this.canMaterial.needsUpdate = true;
      }
      checkAllLoaded();
    });

    textureLoader.load('/assets/textures/blue_base_color.jpg', (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.flipY = false;
      this.textures['zero-lime'] = tex;
      checkAllLoaded();
    });

    // 1. Load Main Soda Can Model
    gltfLoader.load(
      '/assets/models/deit_soda2.glb',
      (gltf) => {
        const root = gltf.scene;

        root.traverse((child) => {
          if (child.isMesh) {
            this.canMesh = child;
            this.canMaterial = new THREE.MeshStandardMaterial({
              map: this.textures['diet-classic'] || child.material?.map,
              metalness: 0.85,
              roughness: 0.22,
              envMapIntensity: 1.2
            });
            child.material = this.canMaterial;
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        // Center and normalize size
        const box = new THREE.Box3().setFromObject(root);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        root.position.sub(center);

        const targetHeight = 3.25;
        const scaleFactor = targetHeight / (size.y || 1);
        root.scale.set(scaleFactor, scaleFactor, scaleFactor);

        // Orient main product logo facing forward
        root.rotation.y = 0;

        // Base diagonal tilt matching reference image
        this.baseTiltZ = -0.42; // ~ -24 degrees
        this.baseTiltX = 0.16;  // tilt forward slightly to see rim
        this.baseTiltY = 0.05;
        this.canGroup.position.set(0.12, -0.05, 0);
        this.canGroup.rotation.set(this.baseTiltX, this.baseTiltY, this.baseTiltZ);

        this.canGroup.add(root);
        checkAllLoaded();
      },
      undefined,
      (err) => {
        console.warn('Fallback: Creating procedural soda can model.', err);
        this.createProceduralCanFallback();
        checkAllLoaded();
      }
    );

    // Berry positions matching reference image layout
    const berryPositions = [
      { pos: [-0.22, 1.45, 0.9], targetSize: 0.44, rot: [0.3, 0.5, 0.1], speed: 1.1 },
      { pos: [-0.75, 1.90, 0.35], targetSize: 0.38, rot: [0.5, 0.2, -0.4], speed: 0.85 },
      { pos: [-1.48, 0.35, 1.05], targetSize: 0.68, rot: [0.2, 0.6, 0.2], speed: 1.15 },
      { pos: [1.38, 0.38, 1.25], targetSize: 0.78, rot: [-0.4, 0.5, -0.2], speed: 1.1 },
      { pos: [-0.45, -1.25, 0.95], targetSize: 0.48, rot: [0.6, -0.4, 0.3], speed: 0.95 },
      { pos: [1.42, -0.75, 0.8], targetSize: 0.65, rot: [0.3, -0.6, 0.4], speed: 1.3 },
      { pos: [-1.68, -1.85, 0.6], targetSize: 0.42, rot: [-0.5, 0.3, 0.5], speed: 0.9 }
    ];

    // 2. Load Cherries Model
    gltfLoader.load('/assets/models/cherry.glb', (gltf) => {
      this.createFloatingClusters(gltf.scene, this.cherriesGroup, berryPositions);
      checkAllLoaded();
    }, undefined, () => checkAllLoaded());

    // 3. Load Blueberries Model
    gltfLoader.load('/assets/models/blueberry.glb', (gltf) => {
      this.createFloatingClusters(gltf.scene, this.blueberriesGroup, berryPositions);
      checkAllLoaded();
    }, undefined, () => checkAllLoaded());

    // 4. Load Leaves Model
    gltfLoader.load('/assets/models/leaves.glb', (gltf) => {
      this.createFloatingClusters(gltf.scene, this.leavesGroup, [
        { pos: [1.6, 0.9, -0.2], targetSize: 0.58, rot: [0.3, 0.8, 0.2], speed: 0.7 },
        { pos: [-2.1, -0.4, 0.2], targetSize: 0.60, rot: [-0.5, -0.4, 0.5], speed: 0.8 },
        { pos: [1.7, -1.4, 0.1], targetSize: 0.52, rot: [0.2, 1.1, -0.3], speed: 0.65 }
      ]);
      checkAllLoaded();
    }, undefined, () => checkAllLoaded());
  }

  createFloatingClusters(sourceScene, parentGroup, configurations) {
    const box = new THREE.Box3().setFromObject(sourceScene);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z) || 1;

    configurations.forEach((cfg) => {
      const clone = sourceScene.clone(true);
      clone.position.set(...cfg.pos);

      const targetScale = (cfg.targetSize || 0.5) / maxDim;
      clone.scale.set(targetScale, targetScale, targetScale);
      clone.rotation.set(...cfg.rot);

      clone.userData = {
        baseX: cfg.pos[0],
        baseY: cfg.pos[1],
        baseZ: cfg.pos[2],
        speed: cfg.speed,
        phase: Math.random() * Math.PI * 2,
        rotSpeedX: (Math.random() - 0.5) * 0.02,
        rotSpeedY: (Math.random() - 0.5) * 0.025,
        rotSpeedZ: (Math.random() - 0.5) * 0.015,
        targetRepelX: 0,
        targetRepelY: 0
      };

      parentGroup.add(clone);
      this.floatingObjects.push(clone);
    });
  }

  createProceduralCanFallback() {
    const geo = new THREE.CylinderGeometry(0.85, 0.85, 2.9, 48);
    const mat = new THREE.MeshStandardMaterial({
      color: 0x0b8a78,
      metalness: 0.85,
      roughness: 0.25
    });
    this.canMesh = new THREE.Mesh(geo, mat);
    this.canMaterial = mat;
    this.canGroup.add(this.canMesh);
  }

  onResize() {
    if (!this.container || !this.renderer || !this.camera) return;
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
    this.updateCameraPosition();
  }

  onMouseMove(e) {
    this.mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
    this.mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
  }

  onTouchMove(e) {
    if (e.touches && e.touches[0]) {
      this.mouse.targetX = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
      this.mouse.targetY = -(e.touches[0].clientY / window.innerHeight) * 2 + 1;
    }
  }

  /**
   * Core Interaction: 720-Degree Flavor Switcher
   */
  switchFlavor(flavorKey) {
    if (this.isSwitching || this.currentFlavor === flavorKey) return;
    this.isSwitching = true;
    this.currentFlavor = flavorKey;

    const isLime = flavorKey === 'zero-lime';
    const targetTexture = this.textures[flavorKey];
    const incomingBerries = isLime ? this.blueberriesGroup : this.cherriesGroup;
    const outgoingBerries = isLime ? this.cherriesGroup : this.blueberriesGroup;

    // Background Gradient Themes
    const themes = {
      'diet-classic': { inner: '#0b8a78', middle: '#044e3b', outer: '#011411' },
      'zero-lime': { inner: '#0b4f8a', middle: '#04294e', outer: '#010c14' }
    };
    const targetTheme = themes[flavorKey];

    // GSAP Timeline
    if (window.gsap) {
      const tl = window.gsap.timeline({
        onComplete: () => {
          this.canGroup.rotation.y = this.baseTiltY || 0.05;
          this.isSwitching = false;
        }
      });

      // 1. Can Spin 720° (Math.PI * 4) with dramatic momentum
      tl.to(this.canGroup.rotation, {
        y: this.canGroup.rotation.y + Math.PI * 4,
        duration: 1.15,
        ease: 'power3.inOut'
      }, 0);

      // 2. Berries shrink and suck inwards towards center
      tl.to(outgoingBerries.scale, {
        x: 0.05,
        y: 0.05,
        z: 0.05,
        duration: 0.45,
        ease: 'power2.in'
      }, 0);

      // 3. Texture Swap at Mid-Spin (halfway through the 720° rotation)
      tl.add(() => {
        if (this.canMaterial && targetTexture) {
          this.canMaterial.map = targetTexture;
          this.canMaterial.needsUpdate = true;
        } else if (this.canMaterial) {
          this.canMaterial.color.set(isLime ? 0x0b4f8a : 0x0b8a78);
        }

        outgoingBerries.visible = false;
        incomingBerries.visible = true;
        incomingBerries.scale.set(0.05, 0.05, 0.05);
      }, 0.5);

      // 4. Incoming Berries burst outward into new floating orbits
      tl.to(incomingBerries.scale, {
        x: 1.0,
        y: 1.0,
        z: 1.0,
        duration: 0.65,
        ease: 'back.out(1.8)'
      }, 0.55);

      // 5. Restore Can gentle tilt
      tl.to(this.canGroup.rotation, {
        x: this.baseTiltX || 0.16,
        z: this.baseTiltZ || -0.42,
        duration: 0.4,
        ease: 'power1.out'
      }, 1.0);

      // 6. Smooth Background Theme Transition via CSS Variables
      const bgContainer = document.getElementById('soda-bg-canvas');
      if (bgContainer) {
        tl.to(bgContainer, {
          '--bg-inner': targetTheme.inner,
          '--bg-middle': targetTheme.middle,
          '--bg-outer': targetTheme.outer,
          duration: 0.9,
          ease: 'power2.inOut'
        }, 0);
      }
    } else {
      if (this.canMaterial && targetTexture) {
        this.canMaterial.map = targetTexture;
        this.canMaterial.needsUpdate = true;
      }
      outgoingBerries.visible = false;
      incomingBerries.visible = true;
      this.isSwitching = false;
    }
  }

  animate() {
    requestAnimationFrame(this.animate);

    const elapsedTime = this.clock.getElapsedTime();

    // 1. Smooth Mouse Interpolation (Damping)
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;

    // 2. Can Floating & Cursor Tilt (when not mid-spin)
    if (!this.isSwitching) {
      const floatY = Math.sin(elapsedTime * 1.5) * 0.1;
      this.canGroup.position.y = (window.innerWidth < 768 ? 0.2 : -0.05) + floatY;

      // Mouse-driven tilt and rotation relative to base tilted pose
      const bTiltX = this.baseTiltX || 0.16;
      const bTiltY = this.baseTiltY || 0.05;
      const bTiltZ = this.baseTiltZ || -0.42;

      const targetRotY = bTiltY + this.mouse.x * 0.35;
      const targetRotX = bTiltX + -this.mouse.y * 0.2;
      const targetRotZ = bTiltZ + Math.sin(elapsedTime * 1.2) * 0.03;

      this.canGroup.rotation.y += (targetRotY - this.canGroup.rotation.y) * 0.06;
      this.canGroup.rotation.x += (targetRotX - this.canGroup.rotation.x) * 0.06;
      this.canGroup.rotation.z += (targetRotZ - this.canGroup.rotation.z) * 0.06;
    }

    // 3. Floating Berries & Leaves Animation with Cursor Repulsion
    this.floatingObjects.forEach((obj) => {
      const ud = obj.userData;
      if (!ud) return;

      const floatOffset = Math.sin(elapsedTime * ud.speed + ud.phase) * 0.18;
      const sideOffset = Math.cos(elapsedTime * (ud.speed * 0.8) + ud.phase) * 0.12;

      // Cursor Repulsion calculation in normalized 3D space
      const screenPos = obj.position.clone().project(this.camera);
      const dx = screenPos.x - this.mouse.x;
      const dy = screenPos.y - this.mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      const repelRadius = 0.55;
      if (dist < repelRadius && dist > 0.001) {
        const force = (1.0 - dist / repelRadius) * 0.35;
        ud.targetRepelX = (dx / dist) * force;
        ud.targetRepelY = (dy / dist) * force;
      } else {
        ud.targetRepelX *= 0.92;
        ud.targetRepelY *= 0.92;
      }

      obj.position.x = ud.baseX + sideOffset + ud.targetRepelX;
      obj.position.y = ud.baseY + floatOffset + ud.targetRepelY;

      obj.rotation.x += ud.rotSpeedX;
      obj.rotation.y += ud.rotSpeedY;
      obj.rotation.z += ud.rotSpeedZ;
    });

    // 4. Render
    this.renderer.render(this.scene, this.camera);
  }
}
