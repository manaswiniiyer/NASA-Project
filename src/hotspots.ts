import * as THREE from 'three';
import { AudioManager } from './audio';

export interface HotspotData {
  id: string;
  name: string;
  position: THREE.Vector3; // On globe surface
  type: 'reef' | 'coastline' | 'current' | 'whale';
  data: {
    bleachingTrend?: number[]; // Percentage over time
    seaLevelRise?: number[]; // Meters over time
    temperature?: number[]; // Celsius over time
    description: string;
    urgency: 'low' | 'medium' | 'high' | 'critical';
  };
}

export class Hotspot {
  public mesh: THREE.Mesh;
  public data: HotspotData;
  private pulsePhase: number = 0;
  private originalScale: number;

  constructor(data: HotspotData) {
    this.data = data;
    
    // Create visual marker
    const geometry = new THREE.SphereGeometry(0.02, 16, 16);
    const color = this.getColorByUrgency(data.data.urgency);
    const material = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.8,
    });
    
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.copy(data.position);
    this.mesh.userData = { hotspot: this };
    
    this.originalScale = 1.0;
    
    // Add glow ring
    this.addGlowRing(color);
  }

  private addGlowRing(color: number): void {
    const ringGeometry = new THREE.RingGeometry(0.025, 0.035, 32);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.5,
      side: THREE.DoubleSide,
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.lookAt(new THREE.Vector3(0, 0, 0)); // Face camera
    this.mesh.add(ring);
  }

  private getColorByUrgency(urgency: string): number {
    switch (urgency) {
      case 'critical': return 0xff0000; // Red
      case 'high': return 0xff6600;     // Orange
      case 'medium': return 0xffcc00;   // Yellow
      case 'low': return 0x00ff00;      // Green
      default: return 0xffffff;
    }
  }

  public update(deltaTime: number): void {
    // Pulsing animation
    this.pulsePhase += deltaTime * 2;
    const pulse = Math.sin(this.pulsePhase) * 0.2 + 1.0;
    this.mesh.scale.setScalar(this.originalScale * pulse);
  }

  public highlight(): void {
    (this.mesh.material as THREE.MeshBasicMaterial).opacity = 1.0;
    this.originalScale = 1.5;
  }

  public unhighlight(): void {
    (this.mesh.material as THREE.MeshBasicMaterial).opacity = 0.8;
    this.originalScale = 1.0;
  }
}

export class HotspotManager {
  private hotspots: Hotspot[] = [];
  private scene: THREE.Scene;
  private camera: THREE.Camera;
  private raycaster: THREE.Raycaster;
  private mouse: THREE.Vector2;
  private selectedHotspot: Hotspot | null = null;
  private audio: AudioManager;
  private onHotspotClick?: (hotspot: Hotspot) => void;

  /**
   * Get all hotspots (for VR controller registration)
   */
  public getHotspots(): Hotspot[] {
    return this.hotspots;
  }

  constructor(scene: THREE.Scene, camera: THREE.Camera, audio: AudioManager) {
    this.scene = scene;
    this.camera = camera;
    this.audio = audio;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    
    this.setupEventListeners();
    this.createDefaultHotspots();
  }

  private setupEventListeners(): void {
    window.addEventListener('click', this.onMouseClick.bind(this));
    window.addEventListener('mousemove', this.onMouseMove.bind(this));
  }

  private onMouseMove(event: MouseEvent): void {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(
      this.hotspots.map(h => h.mesh)
    );
    
    // Highlight hovered hotspot
    this.hotspots.forEach(h => h.unhighlight());
    if (intersects.length > 0) {
      const hotspot = intersects[0].object.userData.hotspot as Hotspot;
      hotspot.highlight();
      document.body.style.cursor = 'pointer';
    } else {
      document.body.style.cursor = 'default';
    }
  }

  private onMouseClick(event: MouseEvent): void {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(
      this.hotspots.map(h => h.mesh)
    );
    
    if (intersects.length > 0) {
      const hotspot = intersects[0].object.userData.hotspot as Hotspot;
      this.selectHotspot(hotspot);
    }
  }

  private selectHotspot(hotspot: Hotspot): void {
    this.selectedHotspot = hotspot;
    
    // Play audio based on hotspot type
    switch (hotspot.data.type) {
      case 'reef':
        this.audio.playCoralStress(hotspot.data.position);
        break;
      case 'whale':
        this.audio.playWhaleCall(hotspot.data.position);
        break;
      case 'current':
        this.audio.playCurrentWhoosh(1.5);
        break;
      case 'coastline':
        this.audio.playStormSurge(hotspot.data.position, 0.8);
        break;
    }
    
    // Trigger callback
    if (this.onHotspotClick) {
      this.onHotspotClick(hotspot);
    }
    
    console.log(`🎯 Selected: ${hotspot.data.name}`);
  }

  private createDefaultHotspots(): void {
    const hotspotsData: HotspotData[] = [
      {
        id: 'great-barrier-reef',
        name: 'Great Barrier Reef',
        position: this.latLonToVector3(-18.2871, 147.6992, 1.02),
        type: 'reef',
        data: {
          bleachingTrend: [10, 15, 25, 35, 50, 60, 70, 75, 80, 85, 90, 93],
          temperature: [26.5, 26.8, 27.1, 27.5, 28.0, 28.3, 28.7, 29.0, 29.2, 29.5, 29.8, 30.1],
          description: 'The Great Barrier Reef has lost over 50% of its coral cover since 1995. Rising sea temperatures trigger mass bleaching events, threatening the world\'s largest living structure.',
          urgency: 'critical'
        }
      },
      {
        id: 'maldives-coastline',
        name: 'Maldives',
        position: this.latLonToVector3(3.2028, 73.2207, 1.02),
        type: 'coastline',
        data: {
          seaLevelRise: [0, 0.5, 1.2, 2.0, 3.1, 4.5, 6.2, 8.0, 10.1, 12.5, 15.2, 18.0],
          description: 'The Maldives faces an existential threat. With 80% of its land less than 1 meter above sea level, rising oceans could submerge entire islands by 2100.',
          urgency: 'critical'
        }
      },
      {
        id: 'gulf-stream',
        name: 'Gulf Stream Current',
        position: this.latLonToVector3(35.0, -75.0, 1.02),
        type: 'current',
        data: {
          temperature: [18.5, 18.7, 19.0, 19.3, 19.6, 19.9, 20.2, 20.5, 20.8, 21.1, 21.4, 21.7],
          description: 'The Gulf Stream, Earth\'s climate conveyor belt, is slowing. This weakening could disrupt weather patterns across Europe and North America.',
          urgency: 'high'
        }
      },
      {
        id: 'pacific-whale-migration',
        name: 'Humpback Whale Route',
        position: this.latLonToVector3(-20.0, -170.0, 1.02),
        type: 'whale',
        data: {
          temperature: [24.0, 24.2, 24.5, 24.8, 25.1, 25.4, 25.7, 26.0, 26.3, 26.6, 26.9, 27.2],
          description: 'Warming oceans alter krill distribution, forcing whales to travel further for food. Migration patterns are shifting, threatening breeding cycles.',
          urgency: 'medium'
        }
      },
      {
        id: 'caribbean-reefs',
        name: 'Caribbean Coral Triangle',
        position: this.latLonToVector3(18.0, -77.0, 1.02),
        type: 'reef',
        data: {
          bleachingTrend: [8, 12, 18, 28, 40, 52, 65, 72, 78, 82, 87, 90],
          temperature: [27.0, 27.2, 27.5, 27.9, 28.3, 28.7, 29.1, 29.4, 29.7, 30.0, 30.3, 30.6],
          description: 'Caribbean reefs support 100 million people. Bleaching events now occur annually, leaving corals no time to recover.',
          urgency: 'critical'
        }
      }
    ];

    hotspotsData.forEach(data => {
      const hotspot = new Hotspot(data);
      this.hotspots.push(hotspot);
      this.scene.add(hotspot.mesh);
    });
  }

  /**
   * Convert lat/lon to 3D position on sphere
   */
  private latLonToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);
    
    return new THREE.Vector3(x, y, z);
  }

  public setOnHotspotClick(callback: (hotspot: Hotspot) => void): void {
    this.onHotspotClick = callback;
  }

  public update(deltaTime: number): void {
    this.hotspots.forEach(hotspot => hotspot.update(deltaTime));
  }

  public getSelectedHotspot(): Hotspot | null {
    return this.selectedHotspot;
  }

  public dispose(): void {
    this.hotspots.forEach(hotspot => {
      this.scene.remove(hotspot.mesh);
    });
    this.hotspots = [];
  }
}
