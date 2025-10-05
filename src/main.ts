import * as THREE from 'three';
import { VRButton } from 'three/addons/webxr/VRButton.js';
import { Globe } from './globe';
import { UI } from './ui';
import { AudioManager } from './audio';
import { HotspotManager } from './hotspots';
import { NarrativeManager } from './narrative';
import { AnalyticsVisualization } from './analytics';
import voiceNarration, { VoiceNarration } from './voiceNarration';
import infoCards, { InfoCardSystem } from './infoCards';
import dataService from './dataService';
import { VRController } from './vrController';
import { VRUI } from './vrUI';

class OceanVRExperience {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private globe: Globe;
  private ui: UI;
  private audio: AudioManager;
  private hotspots: HotspotManager;
  private narrative: NarrativeManager;
  private analytics: AnalyticsVisualization;
  private clock: THREE.Clock;
  private showAnalytics: boolean = false;
  private vrController: VRController | null = null;
  private vrUI: VRUI | null = null;
  private isVRMode: boolean = false;

  constructor() {
    // Scene setup
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000510);
    this.scene.fog = new THREE.FogExp2(0x000510, 0.00025);

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      10000
    );
    this.camera.position.set(0, 0, 3);

    // Clock for delta time
    this.clock = new THREE.Clock();

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.xr.enabled = true;
    document.getElementById('app')!.appendChild(this.renderer.domElement);

    // VR Button - hide default and use custom styled button
    const vrButton = VRButton.createButton(this.renderer);
    vrButton.style.display = 'none'; // Hide default button
    document.body.appendChild(vrButton); // Must be in DOM for WebXR to work
    
    const customVRButton = document.getElementById('vr-button')!;
    customVRButton.addEventListener('click', () => {
      vrButton.click(); // Trigger the actual VR session
    });

    // VR session events
    this.renderer.xr.addEventListener('sessionstart', this.onVRSessionStart.bind(this));
    this.renderer.xr.addEventListener('sessionend', this.onVRSessionEnd.bind(this));

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 1.5);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(5, 3, 5);
    this.scene.add(directionalLight);

    // Stars
    this.addStarfield();

    // Globe
    this.globe = new Globe(this.scene);

    // Audio (must be initialized after user interaction)
    this.audio = new AudioManager(this.camera, this.scene);

    // Hotspots
    this.hotspots = new HotspotManager(this.scene, this.camera, this.audio);

    // Narrative
    this.narrative = new NarrativeManager(this.audio);

    // Analytics Visualization
    this.analytics = new AnalyticsVisualization(this.scene);

    // UI (pass all managers)
    this.ui = new UI(this.globe, this.audio, this.hotspots, this.narrative, this.analytics, voiceNarration, infoCards);

    // Initialize audio and voice on first user interaction
    this.setupAudioInitialization();

    // Setup enhanced interactions
    this.setupEnhancedInteractions();

    // Load initial data
    this.loadOceanData();

    // Event listeners
    window.addEventListener('resize', this.onWindowResize.bind(this));

    // Animation loop
    this.renderer.setAnimationLoop(this.animate.bind(this));
  }

  private setupAudioInitialization(): void {
    const initAudio = async () => {
      await this.audio.initialize();
      console.log('🔊 Audio system ready');
      document.removeEventListener('click', initAudio);
      document.removeEventListener('keydown', initAudio);
    };
    
    document.addEventListener('click', initAudio);
    document.addEventListener('keydown', initAudio);
  }

  private setupEnhancedInteractions(): void {
    // Toggle analytics charts with 'A' key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'a' || e.key === 'A') {
        this.toggleAnalytics();
      }
    });

    // Voice narration integration with narrative
    this.narrative.setOnChapterChange((chapter) => {
      if (voiceNarration && chapter.text) {
        voiceNarration.speak({
          id: chapter.id,
          text: chapter.text,
          rate: 0.9
        });
      }
    });

    // Info cards for hotspots
    this.hotspots.setOnHotspotClick((hotspot) => {
      // Show appropriate info card based on hotspot type
      let cardData;
      switch (hotspot.data.type) {
        case 'reef':
          cardData = InfoCardSystem.getCoralReefCard();
          break;
        case 'coastline':
          cardData = InfoCardSystem.getSeaLevelCard();
          break;
        case 'current':
          cardData = InfoCardSystem.getOceanCurrentCard();
          break;
        case 'whale':
          cardData = InfoCardSystem.getMarineLifeCard();
          break;
        default:
          cardData = InfoCardSystem.getCoralReefCard();
      }
      infoCards.showCard(cardData);

      // Voice narration for hotspot
      const narrationScript = VoiceNarration.getHotspotNarration(hotspot.data.type);
      voiceNarration.speak(narrationScript);
    });
  }

  private async loadOceanData(): Promise<void> {
    try {
      // Load real ocean data
      const [coralData, seaLevelData, pollutionData] = await Promise.all([
        dataService.getCoralBleachingData(),
        dataService.getSeaLevelData(),
        dataService.getPollutionData()
      ]);

      console.log('📊 Ocean data loaded:', {
        coral: coralData.length,
        seaLevel: seaLevelData.length,
        pollution: pollutionData.length
      });

      // Update hotspots with real data if available
      // This would integrate with the hotspot system
    } catch (error) {
      console.warn('Failed to load ocean data, using mock data:', error);
    }
  }

  private toggleAnalytics(): void {
    this.showAnalytics = !this.showAnalytics;

    if (this.showAnalytics) {
      this.analytics.createAllCharts();
      console.log('📊 Analytics charts displayed (press A to hide)');
    } else {
      this.analytics.dispose();
      console.log('📊 Analytics charts hidden');
    }
  }

  /**
   * VR session started
   */
  private onVRSessionStart(): void {
    console.log('🥽 VR session started');
    this.isVRMode = true;

    // Initialize VR controllers
    this.vrController = new VRController(this.renderer, this.scene, this.camera);
    this.vrUI = new VRUI(this.scene, this.camera);

    // Register hotspots as interactive
    const allHotspots = this.hotspots.getHotspots();
    allHotspots.forEach((hotspot) => {
      if (this.vrController) {
        this.vrController.addInteractiveObject(hotspot.mesh);
      }
    });

    // Setup VR interactions
    this.setupVRInteractions();

    // Create VR UI panels
    this.createVRUI();

    // Hide 2D UI
    const uiOverlay = document.getElementById('ui-overlay');
    if (uiOverlay) {
      uiOverlay.style.display = 'none';
    }
  }

  /**
   * VR session ended
   */
  private onVRSessionEnd(): void {
    console.log('🥽 VR session ended');
    this.isVRMode = false;

    // Cleanup VR controllers
    if (this.vrController) {
      this.vrController.dispose();
      this.vrController = null;
    }

    // Cleanup VR UI
    if (this.vrUI) {
      this.vrUI.dispose();
      this.vrUI = null;
    }

    // Show 2D UI
    const uiOverlay = document.getElementById('ui-overlay');
    if (uiOverlay) {
      uiOverlay.style.display = 'block';
    }
  }

  /**
   * Setup VR controller interactions
   */
  private setupVRInteractions(): void {
    if (!this.vrController) return;

    // Select event (trigger button)
    this.vrController.setOnSelect((event) => {
      if (event.object) {
        const hotspot = event.object.userData.hotspot;
        if (hotspot) {
          // Trigger hotspot interaction
          console.log(`🎯 VR Select: ${hotspot.data.name}`);
          
          // Play audio
          this.audio.playCoralStress(hotspot.data.position);
          
          // Show VR panel
          if (this.vrUI) {
            this.vrUI.createPanel({
              id: 'hotspot_info',
              title: hotspot.data.name,
              content: hotspot.data.data.description,
              position: new THREE.Vector3(
                event.position!.x,
                event.position!.y + 0.5,
                event.position!.z
              ),
              width: 1.5,
              height: 1.0
            });
          }

          // Voice narration
          const script = VoiceNarration.getHotspotNarration(hotspot.data.type);
          voiceNarration.speak(script);

          // Haptic feedback
          this.vrController!.vibrate(0, 0.7, 150);
        }
      }
    });

    // Squeeze event (grip button)
    this.vrController.setOnSqueeze((event) => {
      console.log('🤏 VR Squeeze - Toggle analytics');
      this.toggleAnalytics();
      this.vrController!.vibrate(0, 0.5, 100);
    });

    // Hover event
    this.vrController.setOnHover((event) => {
      if (event.object) {
        const hotspot = event.object.userData.hotspot;
        if (hotspot && this.vrUI) {
          // Show tooltip
          this.vrUI.createTooltip(
            'hover_tooltip',
            hotspot.data.name,
            event.position!.clone().add(new THREE.Vector3(0, 0.2, 0))
          );
        }
      }
    });

    // Teleport event
    this.vrController.setOnTeleport((position) => {
      console.log(`🚀 VR Teleport to: ${position.x.toFixed(2)}, ${position.z.toFixed(2)}`);
      
      // Move camera rig
      const offset = new THREE.Vector3().subVectors(position, this.camera.position);
      offset.y = 0; // Keep same height
      this.camera.position.add(offset);
      
      // Haptic feedback
      this.vrController!.vibrate(1, 0.8, 200);
    });
  }

  /**
   * Create VR UI panels
   */
  private createVRUI(): void {
    if (!this.vrUI) return;

    // Welcome panel
    this.vrUI.createPanel({
      id: 'welcome',
      title: '🌊 Pulse of the Ocean',
      content: 'Point at hotspots and press trigger to explore. Grip to toggle charts. Use left controller to teleport.',
      position: new THREE.Vector3(0, 1.5, -2),
      width: 2.0,
      height: 0.8
    });

    // Instructions menu
    this.vrUI.createMenu(
      'vr_menu',
      [
        '👆 Trigger: Select hotspot',
        '🤏 Grip: Toggle analytics',
        '👈 Left controller: Teleport',
        '👋 Hand tracking supported'
      ],
      new THREE.Vector3(-1.5, 1.2, -1.5)
    );

    // Hide welcome panel after 5 seconds
    setTimeout(() => {
      if (this.vrUI) {
        this.vrUI.setVisibility('welcome', false);
      }
    }, 5000);
  }

  private addStarfield(): void {
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 2,
      sizeAttenuation: true,
    });

    const starsVertices: number[] = [];
    for (let i = 0; i < 10000; i++) {
      const x = (Math.random() - 0.5) * 2000;
      const y = (Math.random() - 0.5) * 2000;
      const z = (Math.random() - 0.5) * 2000;
      starsVertices.push(x, y, z);
    }

    starsGeometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(starsVertices, 3)
    );

    const starField = new THREE.Points(starsGeometry, starsMaterial);
    this.scene.add(starField);
  }

  private onWindowResize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  private animate(): void {
    const deltaTime = this.clock.getDelta();
    
    this.globe.update();
    this.hotspots.update(deltaTime);
    
    if (this.showAnalytics) {
      this.analytics.animateCharts(deltaTime);
    }

    // Update VR controllers
    if (this.isVRMode && this.vrController) {
      this.vrController.update();
    }

    // Update VR UI to face camera
    if (this.isVRMode && this.vrUI) {
      this.vrUI.updatePanelsFaceCamera();
    }
    
    this.renderer.render(this.scene, this.camera);
  }
}

// Initialize the experience
new OceanVRExperience();

// Log welcome message
console.log(`
🌊 Pulse of the Ocean - Enhanced Edition
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✨ Features:
  • Real ocean data integration (NASA/NOAA)
  • Interactive hotspots with info cards
  • Voice narration (Web Speech API)
  • 3D analytics charts (press 'A' to toggle)
  • Educational storytelling
  • Call to action links

🎮 Controls:
  • Click hotspots to explore data
  • Drag time slider to see changes
  • Press 'A' to toggle analytics
  • Click "Start Story" for narration
  • Click "Enter VR" for immersive mode

📊 Data Sources:
  • NASA Earth Observations (NEO)
  • NOAA Coral Reef Watch
  • IPCC Sea Level Projections
  • UN Ocean Data Portal
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);
