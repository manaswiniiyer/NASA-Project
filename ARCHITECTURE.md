# 🏗️ Architecture Diagram – Pulse of the Ocean

## 📊 System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                             │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                      index.html                            │  │
│  │  ┌─────────────┐  ┌──────────────┐  ┌─────────────────┐  │  │
│  │  │ Info Panel  │  │ VR Button    │  │ Narrative Btn   │  │  │
│  │  └─────────────┘  └──────────────┘  └─────────────────┘  │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │          Time Slider (12 months)                    │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  │  ┌──────────────┐                    ┌─────────────────┐  │  │
│  │  │ Hotspot      │                    │ Narrative       │  │  │
│  │  │ Detail Panel │                    │ Overlay Panel   │  │  │
│  │  └──────────────┘                    └─────────────────┘  │  │
│  └───────────────────────────────────────────────────────────┘  │
│                              ▲                                   │
│                              │ DOM Updates                       │
│                              │                                   │
│  ┌───────────────────────────┴───────────────────────────────┐  │
│  │                       src/ui.ts                            │  │
│  │  • Event listeners (click, hover, slider)                 │  │
│  │  • Panel visibility control                               │  │
│  │  • Chart generation (bar graphs)                          │  │
│  │  • Callbacks to/from managers                             │  │
│  └───────────────────────────────────────────────────────────┘  │
│         ▲              ▲              ▲              ▲           │
│         │              │              │              │           │
│  ┌──────┴──────┐ ┌────┴─────┐ ┌──────┴──────┐ ┌────┴──────┐   │
│  │ Globe       │ │ Audio    │ │ Hotspots    │ │ Narrative │   │
│  │ Manager     │ │ Manager  │ │ Manager     │ │ Manager   │   │
│  └──────┬──────┘ └────┬─────┘ └──────┬──────┘ └────┬──────┘   │
│         │              │              │              │           │
│         └──────────────┴──────────────┴──────────────┘           │
│                              │                                   │
│                              ▼                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    src/main.ts                             │  │
│  │  • OceanVRExperience class                                │  │
│  │  • Scene, Camera, Renderer setup                          │  │
│  │  • Animation loop (60 FPS)                                │  │
│  │  • WebXR initialization                                   │  │
│  └───────────────────────────────────────────────────────────┘  │
│                              │                                   │
│                              ▼                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                   THREE.JS SCENE                           │  │
│  │  ┌─────────────┐  ┌──────────────┐  ┌─────────────────┐  │  │
│  │  │ Earth Mesh  │  │ Starfield    │  │ Atmosphere      │  │  │
│  │  │ (Phong)     │  │ (10k points) │  │ (Shader)        │  │  │
│  │  └─────────────┘  └──────────────┘  └─────────────────┘  │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │ Ocean Overlay (SST Textures, 12 months)             │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐          │  │
│  │  │ 🪸   │ │ 🏝️  │ │ 🌊   │ │ 🐋   │ │ 🪸   │          │  │
│  │  │ GBR  │ │ Mald │ │ Gulf │ │ Whale│ │ Carib│ Hotspots│  │
│  │  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘          │  │
│  └───────────────────────────────────────────────────────────┘  │
│                              │                                   │
│                              ▼                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                  WEB AUDIO API                             │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │ AudioContext (48kHz sample rate)                    │  │  │
│  │  │  ┌──────────────┐  ┌──────────────┐                │  │  │
│  │  │  │ Ambient Loop │  │ Spatial      │                │  │  │
│  │  │  │ (5s, looping)│  │ Sounds       │                │  │  │
│  │  │  └──────────────┘  └──────────────┘                │  │  │
│  │  │  ┌──────────────────────────────────────────────┐  │  │  │
│  │  │  │ PositionalAudio (3D spatialization)          │  │  │  │
│  │  │  │  • Whale calls (3s)                          │  │  │  │
│  │  │  │  • Currents (1.5s)                           │  │  │  │
│  │  │  │  • Storms (2.5s)                             │  │  │  │
│  │  │  │  • Coral stress (1s)                         │  │  │  │
│  │  │  └──────────────────────────────────────────────┘  │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Data Flow

### 1. Hotspot Click Flow

```
User clicks hotspot
        │
        ▼
┌───────────────────┐
│ Mouse Event       │
│ (clientX, clientY)│
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│ Raycaster         │
│ • Convert to NDC  │
│ • Cast ray        │
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│ HotspotManager    │
│ • Find intersect  │
│ • Get hotspot data│
└────────┬──────────┘
         │
         ├─────────────────────┐
         │                     │
         ▼                     ▼
┌───────────────────┐  ┌──────────────────┐
│ AudioManager      │  │ UI               │
│ • playCoralStress │  │ • Show panel     │
│ • Position at     │  │ • Render chart   │
│   hotspot coords  │  │ • Display text   │
└───────────────────┘  └──────────────────┘
```

### 2. Time Slider Flow

```
User drags slider
        │
        ▼
┌───────────────────┐
│ Input Event       │
│ (value: 0-11)     │
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│ UI.onTimeChange() │
│ • Parse index     │
│ • Update label    │
└────────┬──────────┘
         │
         ├─────────────────────┐
         │                     │
         ▼                     ▼
┌───────────────────┐  ┌──────────────────┐
│ Globe             │  │ AudioManager     │
│ • setTimeIndex()  │  │ • playCurrentWhoosh│
│ • Swap texture    │  │ • Intensity based│
│ • Update material │  │   on delta       │
└───────────────────┘  └──────────────────┘
```

### 3. Narrative Flow

```
User clicks "Start Story"
        │
        ▼
┌───────────────────┐
│ NarrativeManager  │
│ • startNarrative()│
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│ Chapter 0         │
│ • Display text    │
│ • Set timer (8s)  │
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│ UI.displayChapter │
│ • Show panel      │
│ • Fade in         │
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│ setTimeout(8000)  │
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│ Chapter 1         │
│ • Audio event     │
│ • playCurrentWhoosh│
└────────┬──────────┘
         │
         ▼
      (repeat)
```

---

## 🧩 Module Dependencies

```
main.ts
  ├─→ globe.ts
  ├─→ audio.ts
  │     └─→ THREE.Audio
  │     └─→ THREE.PositionalAudio
  ├─→ hotspots.ts
  │     ├─→ audio.ts
  │     └─→ THREE.Raycaster
  ├─→ narrative.ts
  │     └─→ audio.ts
  └─→ ui.ts
        ├─→ globe.ts
        ├─→ audio.ts
        ├─→ hotspots.ts
        └─→ narrative.ts
```

**Dependency Graph**:
- `main.ts` is the root (no dependencies on other modules)
- `globe.ts` is independent (only Three.js)
- `audio.ts` is independent (only Three.js + Web Audio)
- `hotspots.ts` depends on `audio.ts`
- `narrative.ts` depends on `audio.ts`
- `ui.ts` depends on all managers

---

## 🎯 Class Relationships

```
┌─────────────────────────────────────────────────────────┐
│                  OceanVRExperience                      │
│  ┌───────────────────────────────────────────────────┐ │
│  │ Properties:                                        │ │
│  │  • scene: THREE.Scene                             │ │
│  │  • camera: THREE.PerspectiveCamera                │ │
│  │  • renderer: THREE.WebGLRenderer                  │ │
│  │  • globe: Globe                                   │ │
│  │  • audio: AudioManager                            │ │
│  │  • hotspots: HotspotManager                       │ │
│  │  • narrative: NarrativeManager                    │ │
│  │  • ui: UI                                         │ │
│  │  • clock: THREE.Clock                             │ │
│  └───────────────────────────────────────────────────┘ │
│  ┌───────────────────────────────────────────────────┐ │
│  │ Methods:                                           │ │
│  │  • constructor()                                  │ │
│  │  • setupAudioInitialization()                     │ │
│  │  • addStarfield()                                 │ │
│  │  • onWindowResize()                               │ │
│  │  • animate() ← Animation loop                     │ │
│  └───────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

---

## 🔊 Audio Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    AudioManager                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │ AudioListener (attached to camera)                │ │
│  │       │                                            │ │
│  │       ├─→ Audio (ambient loop)                    │ │
│  │       │     • Buffer: 5s procedural               │ │
│  │       │     • Loop: true                          │ │
│  │       │     • Volume: 0.3                         │ │
│  │       │                                            │ │
│  │       └─→ PositionalAudio (spatial events)        │ │
│  │             • Attached to invisible mesh          │ │
│  │             • Position: hotspot coords            │ │
│  │             • RefDistance: 0.5                    │ │
│  │             • Auto-cleanup after duration         │ │
│  └───────────────────────────────────────────────────┘ │
│  ┌───────────────────────────────────────────────────┐ │
│  │ Sound Generation (Web Audio API)                  │ │
│  │  • createBuffer(channels, samples, sampleRate)   │ │
│  │  • Fill with procedural waveforms:               │ │
│  │    - Sine waves (whale, coral)                   │ │
│  │    - Noise (current, storm)                      │ │
│  │    - Envelopes (exponential decay)               │ │
│  └───────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 Hotspot Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  HotspotManager                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │ Hotspot[] (5 instances)                           │ │
│  │  ┌─────────────────────────────────────────────┐ │ │
│  │  │ Hotspot                                      │ │ │
│  │  │  • mesh: THREE.Mesh (sphere + ring)         │ │ │
│  │  │  • data: HotspotData                        │ │ │
│  │  │  • pulsePhase: number                       │ │ │
│  │  │  • update(deltaTime)                        │ │ │
│  │  │  • highlight() / unhighlight()              │ │ │
│  │  └─────────────────────────────────────────────┘ │ │
│  └───────────────────────────────────────────────────┘ │
│  ┌───────────────────────────────────────────────────┐ │
│  │ Raycaster                                          │ │
│  │  • setFromCamera(mouse, camera)                  │ │
│  │  • intersectObjects(hotspot.meshes)              │ │
│  │  • Returns: [{ object, distance, point }]        │ │
│  └───────────────────────────────────────────────────┘ │
│  ┌───────────────────────────────────────────────────┐ │
│  │ Event Handlers                                     │ │
│  │  • onMouseMove() → Hover detection               │ │
│  │  • onMouseClick() → Selection                    │ │
│  │  • selectHotspot() → Audio + UI callback         │ │
│  └───────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

---

## 📖 Narrative Architecture

```
┌─────────────────────────────────────────────────────────┐
│                 NarrativeManager                        │
│  ┌───────────────────────────────────────────────────┐ │
│  │ NarrativeChapter[] (8 chapters)                   │ │
│  │  ┌─────────────────────────────────────────────┐ │ │
│  │  │ Chapter                                      │ │ │
│  │  │  • id: string                                │ │ │
│  │  │  • title: string                             │ │ │
│  │  │  • theme: 'vanishing' | 'currents' | 'voices'│ │ │
│  │  │  • text: string (poetic description)         │ │ │
│  │  │  • duration: number (seconds)                │ │ │
│  │  │  • audioEvent?: 'whale' | 'storm' | 'current'│ │ │
│  │  └─────────────────────────────────────────────┘ │ │
│  └───────────────────────────────────────────────────┘ │
│  ┌───────────────────────────────────────────────────┐ │
│  │ State Machine                                      │ │
│  │  • currentChapterIndex: number                   │ │
│  │  • isPlaying: boolean                            │ │
│  │  • chapterTimeout: number                        │ │
│  │                                                    │ │
│  │  Flow:                                             │ │
│  │    startNarrative()                               │ │
│  │         ↓                                          │ │
│  │    nextChapter()                                  │ │
│  │         ↓                                          │ │
│  │    displayChapter()                               │ │
│  │         ↓                                          │ │
│  │    setTimeout(duration)                           │ │
│  │         ↓                                          │ │
│  │    nextChapter() (loop)                           │ │
│  └───────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

---

## 🎨 UI Architecture

```
┌─────────────────────────────────────────────────────────┐
│                         UI                              │
│  ┌───────────────────────────────────────────────────┐ │
│  │ DOM References                                     │ │
│  │  • timeSlider: HTMLInputElement                   │ │
│  │  • timeLabel: HTMLSpanElement                     │ │
│  │  • hotspotPanel: HTMLElement                      │ │
│  │  • narrativePanel: HTMLElement                    │ │
│  └───────────────────────────────────────────────────┘ │
│  ┌───────────────────────────────────────────────────┐ │
│  │ Event Listeners                                    │ │
│  │  • timeSlider.input → onTimeChange()              │ │
│  │  • narrativeBtn.click → start/stop                │ │
│  │  • closeBtn.click → hide panel                    │ │
│  └───────────────────────────────────────────────────┘ │
│  ┌───────────────────────────────────────────────────┐ │
│  │ Callbacks from Managers                            │ │
│  │  • hotspots.setOnHotspotClick(displayHotspotData) │ │
│  │  • narrative.setOnChapterChange(displayChapter)   │ │
│  └───────────────────────────────────────────────────┘ │
│  ┌───────────────────────────────────────────────────┐ │
│  │ Chart Generation                                   │ │
│  │  • generateChart(label, data[])                   │ │
│  │    → HTML string with <div class="chart-bar">     │ │
│  │    → Color gradient (blue → red)                  │ │
│  │    → Height normalized to 100%                    │ │
│  └───────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

---

## 🔄 Animation Loop

```
renderer.setAnimationLoop(animate)
        │
        ▼
┌───────────────────┐
│ animate()         │
│  • Get deltaTime  │
└────────┬──────────┘
         │
         ├─────────────────────┐
         │                     │
         ▼                     ▼
┌───────────────────┐  ┌──────────────────┐
│ globe.update()    │  │ hotspots.update()│
│  • Rotate Earth   │  │  • Pulse scale   │
│  • Rotate ocean   │  │  • Sin wave      │
└───────────────────┘  └──────────────────┘
         │
         ▼
┌───────────────────┐
│ renderer.render() │
│  • Draw scene     │
│  • 60 FPS target  │
└───────────────────┘
```

---

## 🎯 Key Design Patterns

### 1. Manager Pattern
Each subsystem (audio, hotspots, narrative) is encapsulated in a manager class with clear responsibilities.

### 2. Observer Pattern
UI registers callbacks with managers to receive updates (hotspot clicks, chapter changes).

### 3. Factory Pattern
Hotspots are created from data objects, allowing easy addition of new locations.

### 4. State Machine
Narrative manager tracks current chapter and playing state, auto-advancing through chapters.

### 5. Singleton
`OceanVRExperience` is instantiated once, managing all subsystems.

---

**Architecture Status**: ✅ Clean, modular, extensible
