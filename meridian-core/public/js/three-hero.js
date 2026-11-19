/**
 * Three.js Interactive 3D Architectural Geometric Sculpture & Particle Constellation
 * Cinematic WebGL scene responding to cursor parallax, scroll momentum, and ambient physics.
 */
export class MarcusThreeBackground {
  constructor(containerId = 'three-sculpture-container') {
    this.container = document.getElementById(containerId) || document.getElementById('three-canvas-container');
    if (!this.container || !window.THREE) return;

    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.scrollProgress = 0;
    this.targetScroll = 0;
    this.isVisible = true;

    this.init();
  }

  init() {
    const THREE = window.THREE;
    const width = window.innerWidth;
    const height = window.innerHeight;

    // 1. Scene & Camera
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    this.camera.position.set(0, 0, 16);

    // 2. High-Performance WebGL Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;
    this.container.appendChild(this.renderer.domElement);

    // 3. Central Architectural Sculpture Group
    this.sculptureGroup = new THREE.Group();
    // Position slightly offset behind hero portrait
    this.sculptureGroup.position.set(0, 0, -2);
    this.scene.add(this.sculptureGroup);

    // Core Geometry: Faceted Icosahedron with Wireframe Accent
    const coreGeo = new THREE.IcosahedronGeometry(2.4, 0);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0x111114,
      metalness: 0.95,
      roughness: 0.15,
      reflectivity: 0.9,
      clearcoat: 0.8,
      clearcoatRoughness: 0.1,
      wireframe: false
    });
    this.coreMesh = new THREE.Mesh(coreGeo, coreMat);
    this.sculptureGroup.add(this.coreMesh);

    // Emissive Edge Wireframe Overlay
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xff3b1d,
      wireframe: true,
      transparent: true,
      opacity: 0.22
    });
    this.wireMesh = new THREE.Mesh(coreGeo, wireMat);
    this.wireMesh.scale.setScalar(1.002);
    this.sculptureGroup.add(this.wireMesh);

    // Concentric Gimbal Rings
    this.rings = [];
    const ringConfigs = [
      { radius: 3.5, tube: 0.035, color: 0x444450, rotX: 0.4, rotY: 0.6, speed: 0.003 },
      { radius: 4.6, tube: 0.025, color: 0xff3b1d, rotX: -0.5, rotY: 0.2, speed: -0.0025 },
      { radius: 5.8, tube: 0.02, color: 0x282830, rotX: 0.8, rotY: -0.4, speed: 0.0018 }
    ];

    ringConfigs.forEach(cfg => {
      const ringGeo = new THREE.TorusGeometry(cfg.radius, cfg.tube, 16, 100);
      const ringMat = new THREE.MeshStandardMaterial({
        color: cfg.color,
        metalness: 0.9,
        roughness: 0.2,
        emissive: cfg.color === 0xff3b1d ? 0x330b05 : 0x000000
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.set(cfg.rotX, cfg.rotY, 0);
      ringMesh.userData = { speed: cfg.speed };
      this.sculptureGroup.add(ringMesh);
      this.rings.push(ringMesh);
    });

    // 4. Ambient Particle Constellation (Floating embers)
    const particleCount = 180;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const colorRed = new THREE.Color('#ff3b1d');
    const colorWhite = new THREE.Color('#f3f1ea');
    const colorOrange = new THREE.Color('#ff6a3d');

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 36;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 26;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 16;

      const mixed = i % 3 === 0 ? colorRed : (i % 3 === 1 ? colorOrange : colorWhite);
      colors[i * 3] = mixed.r;
      colors[i * 3 + 1] = mixed.g;
      colors[i * 3 + 2] = mixed.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Canvas particle texture
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.3, 'rgba(255,255,255,0.7)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(16, 16, 16, 0, Math.PI * 2);
    ctx.fill();

    const particleTexture = new THREE.CanvasTexture(canvas);

    const pMaterial = new THREE.PointsMaterial({
      size: 0.18,
      vertexColors: true,
      map: particleTexture,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.particles = new THREE.Points(geometry, pMaterial);
    this.scene.add(this.particles);

    // 5. Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(ambientLight);

    this.keyLight = new THREE.DirectionalLight(0xff3b1d, 2.2);
    this.keyLight.position.set(6, 8, 8);
    this.scene.add(this.keyLight);

    this.fillLight = new THREE.DirectionalLight(0xf3f1ea, 1.2);
    this.fillLight.position.set(-6, -4, 4);
    this.scene.add(this.fillLight);

    this.cursorLight = new THREE.PointLight(0xff3b1d, 1.5, 25);
    this.cursorLight.position.set(0, 0, 6);
    this.scene.add(this.cursorLight);

    // 6. Listeners
    window.addEventListener('resize', this.onResize.bind(this));
    window.addEventListener('mousemove', this.onMouseMove.bind(this), { passive: true });
    window.addEventListener('scroll', this.onScroll.bind(this), { passive: true });
    document.addEventListener('visibilitychange', () => {
      this.isVisible = (document.visibilityState === 'visible');
    });

    // 7. Loop
    this.clock = new THREE.Clock();
    this.animate();
  }

  onMouseMove(e) {
    this.mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
    this.mouse.targetY = -(e.clientY / window.innerHeight - 0.5) * 2;
  }

  onScroll() {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    this.targetScroll = maxScroll > 0 ? (window.scrollY / maxScroll) : 0;
  }

  onResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));

    if (!this.isVisible) return;

    const delta = this.clock.getDelta();

    // Damping
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.045;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.045;
    this.scrollProgress += (this.targetScroll - this.scrollProgress) * 0.05;

    // Rotate core sculpture
    if (this.sculptureGroup) {
      this.sculptureGroup.rotation.y += 0.004;
      this.sculptureGroup.rotation.x = this.mouse.y * 0.25 + (this.scrollProgress * 1.5);
      this.sculptureGroup.rotation.z = this.mouse.x * 0.15;

      this.sculptureGroup.position.x = this.mouse.x * 0.8;
      this.sculptureGroup.position.y = this.mouse.y * 0.6 - (this.scrollProgress * 3.5);
    }

    // Gimbal ring independent rotations
    if (this.rings && this.rings.length) {
      this.rings.forEach((ring, idx) => {
        ring.rotation.z += ring.userData.speed;
        ring.rotation.x += ring.userData.speed * (idx % 2 === 0 ? 0.7 : -0.7);
      });
    }

    // Particle constellation rotation
    if (this.particles) {
      this.particles.rotation.y += 0.0005;
      this.particles.position.x = this.mouse.x * 0.4;
      this.particles.position.y = this.mouse.y * 0.3;
    }

    // Cursor light tracking
    if (this.cursorLight) {
      this.cursorLight.position.x = this.mouse.x * 8;
      this.cursorLight.position.y = this.mouse.y * 6;
    }

    this.renderer.render(this.scene, this.camera);
  }
}
