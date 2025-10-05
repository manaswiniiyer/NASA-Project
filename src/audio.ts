import * as THREE from 'three';

export interface AudioEvent {
  type: 'whale' | 'current' | 'storm' | 'coral' | 'narration';
  position?: THREE.Vector3;
  intensity?: number;
}

export class AudioManager {
  private listener: THREE.AudioListener;
  private ambientSound?: THREE.Audio;
  private spatialSounds: Map<string, THREE.PositionalAudio> = new Map();
  private audioLoader: THREE.AudioLoader;
  private isInitialized: boolean = false;
  private scene: THREE.Scene;

  constructor(camera: THREE.Camera, scene: THREE.Scene) {
    this.listener = new THREE.AudioListener();
    camera.add(this.listener);
    this.audioLoader = new THREE.AudioLoader();
    this.scene = scene;
  }

  /**
   * Initialize audio with user interaction (required by browsers)
   */
  public async initialize(): Promise<void> {
    if (this.isInitialized) return;
    
    try {
      // Create procedural ambient underwater sound
      this.createProceduralAmbient();
      this.isInitialized = true;
      console.log('🔊 Audio system initialized');
    } catch (error) {
      console.warn('Audio initialization failed:', error);
    }
  }

  /**
   * Create procedural underwater ambient using Web Audio API
   */
  private createProceduralAmbient(): void {
    const audioContext = this.listener.context;
    
    // Create buffer for ambient loop (5 seconds)
    const sampleRate = audioContext.sampleRate;
    const duration = 5;
    const buffer = audioContext.createBuffer(2, sampleRate * duration, sampleRate);
    
    // Generate underwater ambient noise
    for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
      const data = buffer.getChannelData(channel);
      for (let i = 0; i < data.length; i++) {
        // Low-frequency rumble + filtered noise
        const t = i / sampleRate;
        const lowFreq = Math.sin(2 * Math.PI * 0.5 * t) * 0.1;
        const noise = (Math.random() * 2 - 1) * 0.05;
        data[i] = lowFreq + noise;
      }
    }
    
    this.ambientSound = new THREE.Audio(this.listener);
    this.ambientSound.setBuffer(buffer);
    this.ambientSound.setLoop(true);
    this.ambientSound.setVolume(0.3);
    this.ambientSound.play();
  }

  /**
   * Play spatial audio event at a specific 3D position
   */
  public playSpatialEvent(event: AudioEvent): void {
    if (!this.isInitialized) return;

    const id = `${event.type}_${Date.now()}`;
    const sound = new THREE.PositionalAudio(this.listener);
    
    // Create procedural sound based on event type
    const buffer = this.generateEventSound(event.type, event.intensity || 1.0);
    sound.setBuffer(buffer);
    sound.setRefDistance(0.5);
    sound.setVolume(0.7);
    
    // Position sound in 3D space
    if (event.position) {
      const soundMesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.01),
        new THREE.MeshBasicMaterial({ visible: false })
      );
      soundMesh.position.copy(event.position);
      soundMesh.add(sound);
      this.scene.add(soundMesh);
      
      sound.play();
      
      // Cleanup after sound finishes
      setTimeout(() => {
        this.scene.remove(soundMesh);
        this.spatialSounds.delete(id);
      }, buffer.duration * 1000);
      
      this.spatialSounds.set(id, sound);
    }
  }

  /**
   * Generate procedural sound for different event types
   */
  private generateEventSound(type: AudioEvent['type'], intensity: number): AudioBuffer {
    const audioContext = this.listener.context;
    const sampleRate = audioContext.sampleRate;
    let duration = 2;
    
    switch (type) {
      case 'whale':
        duration = 3;
        break;
      case 'current':
        duration = 1.5;
        break;
      case 'storm':
        duration = 2.5;
        break;
      case 'coral':
        duration = 1;
        break;
    }
    
    const buffer = audioContext.createBuffer(2, sampleRate * duration, sampleRate);
    
    for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
      const data = buffer.getChannelData(channel);
      
      for (let i = 0; i < data.length; i++) {
        const t = i / sampleRate;
        const envelope = Math.exp(-t * 2); // Decay envelope
        
        let sample = 0;
        
        switch (type) {
          case 'whale':
            // Low-frequency sweep (whale call)
            sample = Math.sin(2 * Math.PI * (200 + t * 100) * t) * envelope * intensity;
            break;
            
          case 'current':
            // Whoosh (filtered noise sweep)
            sample = (Math.random() * 2 - 1) * envelope * intensity * 0.5;
            break;
            
          case 'storm':
            // Thunder rumble
            sample = (Math.random() * 2 - 1) * envelope * intensity * 0.8;
            sample += Math.sin(2 * Math.PI * 50 * t) * envelope * 0.3;
            break;
            
          case 'coral':
            // High-frequency clicks (coral bleaching stress)
            sample = Math.sin(2 * Math.PI * 1000 * t) * envelope * intensity * 0.3;
            break;
            
          case 'narration':
            // Placeholder for voice
            sample = 0;
            break;
        }
        
        data[i] = sample;
      }
    }
    
    return buffer;
  }

  /**
   * Play ocean current whoosh when time slider moves
   */
  public playCurrentWhoosh(intensity: number = 1.0): void {
    this.playSpatialEvent({
      type: 'current',
      position: new THREE.Vector3(0, 0, 0),
      intensity
    });
  }

  /**
   * Play whale call at specific location
   */
  public playWhaleCall(position: THREE.Vector3): void {
    this.playSpatialEvent({
      type: 'whale',
      position,
      intensity: 1.0
    });
  }

  /**
   * Play storm surge audio
   */
  public playStormSurge(position: THREE.Vector3, intensity: number): void {
    this.playSpatialEvent({
      type: 'storm',
      position,
      intensity
    });
  }

  /**
   * Play coral bleaching stress sound
   */
  public playCoralStress(position: THREE.Vector3): void {
    this.playSpatialEvent({
      type: 'coral',
      position,
      intensity: 0.8
    });
  }

  /**
   * Adjust ambient volume (e.g., fade during narration)
   */
  public setAmbientVolume(volume: number): void {
    if (this.ambientSound) {
      this.ambientSound.setVolume(Math.max(0, Math.min(1, volume)));
    }
  }

  /**
   * Stop all spatial sounds
   */
  public stopAllSpatial(): void {
    this.spatialSounds.forEach(sound => {
      if (sound.isPlaying) {
        sound.stop();
      }
    });
    this.spatialSounds.clear();
  }

  /**
   * Cleanup
   */
  public dispose(): void {
    this.stopAllSpatial();
    if (this.ambientSound?.isPlaying) {
      this.ambientSound.stop();
    }
  }
}
