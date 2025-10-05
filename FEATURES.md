# 🌊 Pulse of the Ocean – Feature Documentation

## ✨ Implemented Features

### 1. 🔊 Spatial Audio System

**File**: `src/audio.ts`

#### Capabilities
- **Procedural Underwater Ambient**: Low-frequency rumble + filtered noise loop
- **Positional Audio**: 3D spatial sound tied to hotspot locations
- **Event-Based Sounds**:
  - 🐋 **Whale Calls**: Low-frequency sweep (200-300 Hz)
  - 🌊 **Ocean Currents**: Whoosh effect with filtered noise
  - ⛈️ **Storm Surges**: Thunder rumble with low-frequency bass
  - 🪸 **Coral Stress**: High-frequency clicks (1000 Hz)

#### Usage
```typescript
// Initialize on user interaction (browser requirement)
await audio.initialize();

// Play spatial events
audio.playWhaleCall(new THREE.Vector3(1, 0, 0));
audio.playCurrentWhoosh(1.5); // intensity parameter
audio.playStormSurge(position, 0.8);
audio.playCoralStress(reefPosition);

// Control ambient volume (e.g., fade during narration)
audio.setAmbientVolume(0.15);
```

#### Technical Details
- Uses Web Audio API for procedural sound generation
- `PositionalAudio` for 3D spatialization
- Automatic cleanup after sound finishes
- Decay envelopes for natural sound falloff

---

### 2. 🎯 Interactive Hotspots

**File**: `src/hotspots.ts`

#### Features
- **5 Pre-configured Hotspots**:
  1. 🪸 **Great Barrier Reef** (Critical) – 93% bleaching trend
  2. 🏝️ **Maldives** (Critical) – 18cm sea level rise
  3. 🌊 **Gulf Stream Current** (High) – Slowing circulation
  4. 🐋 **Humpback Whale Route** (Medium) – Shifting migration
  5. 🪸 **Caribbean Coral Triangle** (Critical) – 90% bleaching

#### Visual Design
- **Pulsing Spheres**: Animated scale based on urgency
- **Color-Coded**:
  - 🔴 Critical: Red
  - 🟠 High: Orange
  - 🟡 Medium: Yellow
  - 🟢 Low: Green
- **Glow Rings**: Rotating halos for visibility

#### Interaction
- **Hover**: Highlights hotspot, changes cursor
- **Click**: Opens detail panel with:
  - Location name
  - Scientific description
  - Time-series chart (bleaching/temperature/sea level)
  - Audio feedback (type-specific)

#### Data Structure
```typescript
interface HotspotData {
  id: string;
  name: string;
  position: THREE.Vector3; // Lat/lon converted to 3D
  type: 'reef' | 'coastline' | 'current' | 'whale';
  data: {
    bleachingTrend?: number[];
    seaLevelRise?: number[];
    temperature?: number[];
    description: string;
    urgency: 'low' | 'medium' | 'high' | 'critical';
  };
}
```

---

### 3. 📖 Narrative Storytelling

**File**: `src/narrative.ts`

#### Three Themes
1. **"The Vanishing Coastline"** – Sea level rise, coastal erosion
2. **"Currents of Change"** – Ocean circulation, climate regulation
3. **"Voices from the Deep"** – Marine life, ecosystem disruption

#### 8 Narrative Chapters
1. **The Pulse Begins** (8s) – Introduction
2. **Rising Temperatures** (10s) – Ocean heat absorption
3. **Silent Reefs** (12s) – Coral bleaching crisis
4. **The Vanishing Coastline** (12s) – Sea level rise impacts
5. **Currents of Change** (14s) – Gulf Stream weakening
6. **Voices from the Deep** (12s) – Marine migration shifts
7. **A Choice** (10s) – Hope and agency
8. **What You Can Do** (10s) – Call to action

#### Features
- **Auto-progression**: Chapters advance automatically
- **Timed Display**: Each chapter shows for its duration
- **Audio Integration**: Triggers whale calls, storms, currents
- **Camera Hints**: Optional camera positions per chapter
- **Ambient Fade**: Reduces background audio during narration

#### Usage
```typescript
narrative.startNarrative(); // Begin story
narrative.stopNarrative();  // Pause/stop
narrative.skipToChapter(3); // Jump to specific chapter
```

---

### 4. 🎨 Enhanced UI

**File**: `index.html`, `src/ui.ts`

#### Panels
1. **Info Panel** (Top-left)
   - Project title
   - Description
   - Data sources

2. **Time Controls** (Bottom-center)
   - Slider: 12 months (2024)
   - Audio feedback on scrub
   - Month label display

3. **Hotspot Detail Panel** (Right-side, slide-in)
   - Location title
   - Scientific description
   - Animated bar chart (color-coded by severity)
   - Close button

4. **Narrative Panel** (Center overlay)
   - Chapter theme badge
   - Gradient title
   - Poetic text
   - Auto-hide after duration

5. **Instructions** (Bottom, pulsing)
   - "Click on glowing hotspots to explore ocean data 🎯"

#### Buttons
- **Enter VR** (Top-right) – Blue gradient
- **▶ Start Story** (Top-right) – Pink/purple gradient

#### Styling
- **Glassmorphism**: Backdrop blur, semi-transparent panels
- **Smooth Animations**: Fade-in, slide-in, pulse effects
- **Responsive Charts**: Dynamic bar heights, hover tooltips
- **Gradient Text**: Multi-color gradients for titles

---

## 🎮 User Experience Flow

### Initial Load
1. User sees rotating Earth with pulsing hotspots
2. Instructions hint at interaction
3. Audio initializes on first click

### Exploration Mode
1. **Hover hotspots** → Highlight + cursor change
2. **Click hotspot** → Detail panel slides in + audio plays
3. **Drag time slider** → SST textures change + whoosh sound
4. **Close panel** → Return to exploration

### Narrative Mode
1. **Click "Start Story"** → Narrative begins
2. **Chapters auto-advance** → Text overlays + audio cues
3. **Ambient fades** → Focus on narration
4. **Story ends** → Return to exploration

### VR Mode
1. **Click "Enter VR"** → WebXR session starts
2. **Look around** → 360° immersion
3. **Point & click** → Hotspot interaction (VR controllers)
4. **Spatial audio** → 3D sound positioning

---

## 📊 Data Visualization

### Time-Series Charts
- **12 data points** (monthly)
- **Color gradient**: Blue (low) → Red (high)
- **Hover tooltips**: Month + value
- **Responsive height**: Normalized to panel

### SST Textures
- **Procedural gradients** (placeholder)
- **Hue shift**: 200-260 (blue-cyan range)
- **12 unique textures** (one per month)
- **Smooth transitions**: Material updates on slider change

---

## 🔧 Technical Architecture

### Module Structure
```
src/
├── main.ts          # Entry point, scene setup
├── globe.ts         # Earth mesh, SST overlay, atmosphere
├── audio.ts         # Spatial audio, procedural sounds
├── hotspots.ts      # Interactive markers, raycasting
├── narrative.ts     # Story chapters, timing
└── ui.ts            # DOM manipulation, event handlers
```

### Dependencies
- **Three.js**: 3D rendering, WebXR
- **Web Audio API**: Procedural sound generation
- **TypeScript**: Type safety, modern syntax
- **Vite**: Fast dev server, HMR

### Performance
- **Procedural audio**: No file loading, instant playback
- **Canvas textures**: Lightweight, no HTTP requests
- **Raycasting**: Efficient click detection
- **Delta time**: Smooth animations at any framerate

---

## 🚀 Next Steps

### Data Integration
1. **Download NASA NEO SST PNGs**:
   ```bash
   # Example URL structure
   https://neo.gsfc.nasa.gov/archive/rgb/MODAL2_M_SST/2024-01.PNG
   ```
2. **Place in** `assets/textures/sst/`
3. **Update** `globe.ts` to load real textures:
   ```typescript
   const loader = new THREE.TextureLoader();
   loader.load('assets/textures/sst/2024-01.PNG', (texture) => {
     this.sstTextures.push(texture);
   });
   ```

### Audio Assets
1. **Source underwater ambience**: freesound.org, epidemic sound
2. **Record narration**: Voice actor or TTS (ElevenLabs, Azure)
3. **Add whale calls**: Real recordings from NOAA
4. **Place in** `assets/audio/`

### Blender Integration (Optional)
1. **Model coral reefs** with bpy scripting
2. **Animate bleaching**: Color shift over time
3. **Export GLTF**: Load with `GLTFLoader`
4. **Overlay on globe**: Position at hotspot locations

### Advanced Features
- **VR Controllers**: Laser pointer for hotspot selection
- **Particle Systems**: Underwater bubbles, plankton
- **Shader Effects**: Caustics, god rays
- **Real-time Data**: Fetch live SST from NASA APIs
- **Multi-language**: i18n for global audience

---

## 📝 Credits

**Data Sources**:
- NASA Earth Observations (NEO)
- NOAA Coral Reef Watch
- NASA PO.DAAC (Physical Oceanography)
- IPCC Sea Level Rise Projections

**Inspiration**:
- "The Vanishing Coastline" – Climate Central
- "Chasing Coral" – Netflix Documentary
- "Ocean Acidification" – NOAA Education

---

## 🎓 Educational Context

### Key Messages
1. **Ocean Heat**: 93% of excess heat absorbed since 1970
2. **Coral Crisis**: 50% of reefs lost, bleaching accelerating
3. **Sea Level Rise**: 3.4mm/year, 200M people at risk by 2100
4. **Circulation Slowdown**: Gulf Stream weakening 15% since 1950
5. **Ecosystem Shifts**: Marine life migrating poleward

### Call to Action
- Reduce carbon footprint
- Support ocean conservation (Coral Restoration Foundation, Ocean Conservancy)
- Advocate for climate policy
- Share the story

---

**Built with ❤️ for NASA Space Apps Challenge 2025**
