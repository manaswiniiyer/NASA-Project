# 🌊 Pulse of the Ocean – WebXR Experience

An immersive VR experience exploring ocean data from NASA, built with Three.js and WebXR.

> *"Beneath the surface, the ocean breathes. A rhythm older than humanity, now racing toward an uncertain future."*

## 🚀 Features

### 🔊 Spatial Audio System
- **Procedural underwater ambience** (low-frequency rumble + filtered noise)
- **3D positional audio** tied to hotspot locations
- **Event-based sounds**: Whale calls, ocean currents, storm surges, coral stress
- **Dynamic mixing**: Ambient fade during narration

### 🎯 Interactive Hotspots
- **5 critical locations**: Great Barrier Reef, Maldives, Gulf Stream, Pacific whale routes, Caribbean reefs
- **Click to explore**: Scientific data, time-series charts, bleaching trends
- **Color-coded urgency**: Red (critical) → Green (low)
- **Pulsing animations**: Visual feedback for interaction

### 📖 Narrative Storytelling
- **8 chapters** across 3 themes:
  - "The Vanishing Coastline"
  - "Currents of Change"
  - "Voices from the Deep"
- **Auto-progression**: Timed chapters with audio cues
- **Poetic overlays**: Emotional engagement with data
- **Call to action**: Empowering users to make a difference

### 🎨 Modern UI
- **Glassmorphism design**: Backdrop blur, semi-transparent panels
- **Animated charts**: Color-coded bar graphs with hover tooltips
- **Smooth transitions**: Fade-in, slide-in effects
- **VR-ready**: Full WebXR compatibility for Quest, PCVR, browser VR

## 📦 Installation

```bash
npm install
```

## 🛠️ Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

For VR testing:
- **Quest**: Use Oculus Browser or Firefox Reality
- **PCVR**: Chrome/Edge with SteamVR or Oculus Link
- **Desktop**: Click "Enter VR" (requires WebXR-compatible browser)

## 🏗️ Build

```bash
npm run build
```

Output will be in `dist/` directory.

## 📊 Data Sources

### Current (MVP)
- **Sea Surface Temperature**: NASA NEO MODIS/VIIRS monthly averages (placeholder procedural textures)

### Planned
- **Coral Bleaching**: NOAA Coral Reef Watch DHW (Degree Heating Weeks)
- **Sea Level Anomalies**: NASA PO.DAAC altimetry (Jason-3, Sentinel-6)
- **Chlorophyll Concentration**: NASA NEO MODIS Aqua
- **Salinity**: NASA SMAP/SMOS

## 🎨 Project Structure

```
pulse-of-the-ocean-webxr/
├── src/
│   ├── main.ts          # Entry point, scene setup
│   ├── globe.ts         # Globe mesh, SST overlay, atmosphere
│   ├── ui.ts            # Time slider, controls
│   └── audio.ts         # Spatial audio manager
├── assets/              # Textures, audio, data (to be added)
├── index.html           # UI overlay, VR button
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🎮 How to Use

### Exploration Mode
1. **Hover over glowing hotspots** to highlight them
2. **Click hotspots** to view detailed data panels
3. **Drag the time slider** to see temperature changes over 12 months
4. **Listen** for spatial audio cues (whale calls, currents, storms)

### Narrative Mode
1. **Click "▶ Start Story"** to begin the guided experience
2. **Watch chapters auto-advance** with poetic overlays
3. **Experience audio events** synchronized to the narrative
4. **Learn about ocean change** through data-driven storytelling

### VR Mode
1. **Click "Enter VR"** (requires WebXR-compatible browser)
2. **Look around** for 360° immersion
3. **Point and click** hotspots with VR controllers
4. **Hear spatial audio** positioned in 3D space

---

## 🔧 Next Steps for Production

### 1. Real NASA Data
- Download **NASA NEO SST monthly PNGs** for 2024
- Replace procedural textures in `globe.ts`
- Add **NOAA Coral Reef Watch DHW** data for bleaching
- Integrate **PO.DAAC sea level anomalies** (Jason-3, Sentinel-6)

### 2. Professional Audio
- Record **voice narration** for chapters (ElevenLabs, voice actor)
- Source **real whale calls** from NOAA Sound Library
- Add **underwater ambience** from freesound.org or Epidemic Sound
- Mix spatial audio for VR headphones

### 3. 3D Assets (Blender)
- Model **coral reef structures** with bpy scripting
- Animate **bleaching effects** (color shift over time)
- Create **coastline erosion** animations
- Export as GLTF and load with `GLTFLoader`

### 4. Performance Optimization
- **Texture streaming** for large datasets
- **LOD (Level of Detail)** for globe geometry
- **Occlusion culling** for hotspots
- Target **72 Hz** for Quest 2, **90 Hz** for Quest 3

### 5. Accessibility
- **Subtitles** for narrative chapters
- **Screen reader support** for UI panels
- **Keyboard navigation** for non-VR users
- **Multi-language support** (i18n)

## 📚 Resources

- [NASA Earthdata Search](https://search.earthdata.nasa.gov/)
- [NASA Earth Observations (NEO)](https://neo.gsfc.nasa.gov/)
- [Three.js WebXR Docs](https://threejs.org/docs/#manual/en/introduction/How-to-create-VR-content)
- [NOAA Coral Reef Watch](https://coralreefwatch.noaa.gov/)

## 📝 License

MIT

---

**Built for NASA Space Apps Challenge 2025** 🚀
