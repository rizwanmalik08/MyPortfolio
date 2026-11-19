/**
 * Three.js Interactive 3D Background Atmosphere & Particle Physics
 * High-performance WebGL scene responding to cursor parallax
 */
export class MarcusThreeBackground {
  constructor(containerId = 'three-canvas-container') {
    this.container = document.getElementById(containerId);
    if (!this.container || !window.THREE) return;

    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.init();
  }

  init() {
    const THREE = window.THREE;
    const width = window.innerWidth;
    const height = window.innerHeight;

    // 1. Scene & Camera
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    this.camera.position.z = 15;

    // 2. Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.container.appendChild(this.renderer.domElement);

    // 3. Ambient Particle Constellation (Floating deep red & ivory embers)
    const particleCount = 140;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const color1 = new THREE.Color('#ff3b1d'); // Vibrant Red
    const color2 = new THREE.Color('#f3f1ea'); // Warm White
    const color3 = new THREE.Color('#ff6a3d'); // Orange-Red

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 35;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 25;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 15;

      const mixed = i % 3 === 0 ? color1 : (i % 3 === 1 ? color3 : color2);
      colors[i * 3] = mixed.r;
      colors[i * 3 + 1] = mixed.g;
      colors[i * 3 + 2] = mixed.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Custom Canvas Texture for smooth circular particles
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

    const material = new THREE.PointsMaterial({
      size: 0.16,
      vertexColors: true,
      map: particleTexture,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);

    // 4. Subtle Dynamic Point Light
    this.pointLight = new THREE.PointLight(0xff3b1d, 1.2, 20);
    this.pointLight.position.set(0, 0, 5);
    this.scene.add(this.pointLight);

    // 5. Event Listeners
    window.addEventListener('resize', this.onResize.bind(this));
    window.addEventListener('mousemove', this.onMouseMove.bind(this), { passive: true });

    // 6. Start Loop
    this.animate();
  }

  onMouseMove(e) {
    this.mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
    this.mouse.targetY = -(e.clientY / window.innerHeight - 0.5) * 2;
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

    // Smooth damping
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;

    // Slowly rotate particle field
    if (this.particles) {
      this.particles.rotation.y += 0.0006;
      this.particles.rotation.x = this.mouse.y * 0.15;
      this.particles.position.x = this.mouse.x * 0.6;
    }

    if (this.pointLight) {
      this.pointLight.position.x = this.mouse.x * 6;
      this.pointLight.position.y = this.mouse.y * 4;
    }

    this.renderer.render(this.scene, this.camera);
  }
}
