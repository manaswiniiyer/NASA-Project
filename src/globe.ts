import * as THREE from 'three';

export class Globe {
  private mesh: THREE.Mesh;
  private oceanMesh: THREE.Mesh;
  private currentTimeIndex: number = 0;
  private sstTextures: THREE.Texture[] = [];

  constructor(scene: THREE.Scene) {
    // Earth base
    const geometry = new THREE.SphereGeometry(1, 64, 64);
    
    // Base material (land/ocean)
    const material = new THREE.MeshPhongMaterial({
      color: 0x1a4d6f,
      emissive: 0x0a1f2f,
      shininess: 25,
      specular: 0x333333,
    });

    this.mesh = new THREE.Mesh(geometry, material);
    scene.add(this.mesh);

    // Ocean overlay for SST data
    const oceanGeometry = new THREE.SphereGeometry(1.005, 64, 64);
    const oceanMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });

    this.oceanMesh = new THREE.Mesh(oceanGeometry, oceanMaterial);
    scene.add(this.oceanMesh);

    // Load placeholder SST textures (will be replaced with real NASA data)
    this.loadSSTTextures();

    // Add atmosphere glow
    this.addAtmosphere(scene);
  }

  private loadSSTTextures(): void {
    // Placeholder: Generate procedural heatmap textures
    // In production, these will be NASA NEO SST monthly PNGs
    
    for (let i = 0; i < 12; i++) {
      // Create a new canvas for each texture to avoid reference issues
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 256;
      const ctx = canvas.getContext('2d')!;
      
      const gradient = ctx.createLinearGradient(0, 0, 512, 0);
      const hue = (i / 12) * 60 + 200; // Blue to cyan range
      gradient.addColorStop(0, `hsl(${hue}, 70%, 30%)`);
      gradient.addColorStop(0.5, `hsl(${hue}, 80%, 50%)`);
      gradient.addColorStop(1, `hsl(${hue + 20}, 90%, 60%)`);
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 512, 256);
      
      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      this.sstTextures.push(texture);
    }

    // Apply first texture
    (this.oceanMesh.material as THREE.MeshBasicMaterial).map = this.sstTextures[0];
  }

  private addAtmosphere(scene: THREE.Scene): void {
    const atmosphereGeometry = new THREE.SphereGeometry(1.15, 64, 64);
    const atmosphereMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.6 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
          gl_FragColor = vec4(0.3, 0.6, 1.0, 1.0) * intensity;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
    });

    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    scene.add(atmosphere);
  }

  public setTimeIndex(index: number): void {
    this.currentTimeIndex = Math.max(0, Math.min(index, this.sstTextures.length - 1));
    (this.oceanMesh.material as THREE.MeshBasicMaterial).map = this.sstTextures[this.currentTimeIndex];
    (this.oceanMesh.material as THREE.MeshBasicMaterial).needsUpdate = true;
  }

  public update(): void {
    // Slow rotation
    this.mesh.rotation.y += 0.0005;
    this.oceanMesh.rotation.y += 0.0005;
  }

  public getMesh(): THREE.Mesh {
    return this.mesh;
  }
}
