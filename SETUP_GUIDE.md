# 🚀 Pulse of the Ocean - Setup Guide

## ✅ Installation Complete!

All dependencies have been installed successfully in the **Nasa project** folder.

---

## 📁 Project Location

```
C:\Users\MANASWINI R IYER\Desktop\New folder\Nasa project\
```

---

## 🎯 Quick Start

### 1. Open Terminal in Project Folder
```bash
cd "C:\Users\MANASWINI R IYER\Desktop\New folder\Nasa project"
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Open Browser
Navigate to: **http://localhost:5173** (or the port shown in terminal)

---

## 🎮 How to Use

### Desktop Mode
1. **Explore hotspots**: Click on glowing spheres
2. **View data**: Info cards appear with statistics
3. **Change time**: Drag the time slider (12 months)
4. **Toggle analytics**: Press **'A'** key for 3D charts
5. **Start story**: Click "▶ Start Story" for narration

### VR Mode
1. **Click "Enter VR"** button
2. **Put on VR headset** (Quest 2/3, PCVR)
3. **Point at hotspots** with controller
4. **Press trigger** to select
5. **Squeeze grip** to toggle analytics
6. **Left controller** to teleport

---

## 📦 Installed Dependencies

### Core
- ✅ **three** (^0.160.0) - 3D graphics library
- ✅ **vite** (^7.1.9) - Build tool & dev server
- ✅ **typescript** (^5.3.3) - Type safety

### Types
- ✅ **@types/three** (^0.160.0) - TypeScript definitions

---

## 🌟 Features Available

### Core VR Experience
- ✅ Rotating Earth with atmosphere
- ✅ 5 interactive hotspots
- ✅ Time slider (12 months)
- ✅ WebXR VR support

### Audio & Narration
- ✅ Spatial audio system
- ✅ Voice narration (Web Speech API)
- ✅ Procedural ocean sounds

### Data & Analytics
- ✅ Real NASA/NOAA data integration
- ✅ 3D floating charts (press 'A')
- ✅ Interactive info cards
- ✅ Historical trends & projections

### VR Features
- ✅ VR controllers + hand tracking
- ✅ Laser pointers
- ✅ Teleportation system
- ✅ Haptic feedback
- ✅ 3D VR UI panels

---

## 🎯 Available Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm preview

# Type checking
npm run type-check
```

---

## 🔧 Troubleshooting

### Port Already in Use
If port 5173 is busy:
```bash
npm run dev -- --port 3000
```

### Module Not Found Errors
Re-install dependencies:
```bash
npm install
```

### VR Not Working
1. Use Chrome or Edge browser
2. Enable WebXR flags: `chrome://flags/#webxr`
3. Connect VR headset
4. Click "Enter VR" button

---

## 📊 Project Structure

```
Nasa project/
├── src/
│   ├── main.ts              # Entry point
│   ├── globe.ts             # Earth visualization
│   ├── audio.ts             # Spatial audio
│   ├── hotspots.ts          # Interactive markers
│   ├── narrative.ts         # Storytelling
│   ├── ui.ts                # User interface
│   ├── dataService.ts       # NASA/NOAA APIs
│   ├── analytics.ts         # 3D charts
│   ├── voiceNarration.ts    # Text-to-speech
│   ├── infoCards.ts         # Info overlays
│   ├── vrController.ts      # VR controllers
│   └── vrUI.ts              # VR UI panels
├── index.html               # Main HTML
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript config
├── vite.config.ts           # Build config
└── node_modules/            # Installed packages
```

---

## 🌐 Browser Requirements

### Desktop
- ✅ Chrome (latest)
- ✅ Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)

### VR
- ✅ Quest Browser (Quest 2/3)
- ✅ Chrome with WebXR
- ✅ Firefox Reality
- ✅ PCVR browsers

---

## 🎓 Educational Content

### Key Statistics
- **93%** of excess heat absorbed by oceans
- **50%** of coral reefs lost since 1995
- **3.4mm/year** sea level rise rate
- **200M** people at risk by 2100

### Learning Resources
- NASA Sea Level: https://sealevel.nasa.gov/
- NOAA Coral Watch: https://coralreefwatch.noaa.gov/
- UN Ocean SDG: https://www.un.org/sustainabledevelopment/oceans/

---

## 📝 Documentation Files

Read these for detailed information:

- **README.md** - Project overview
- **COMPLETE_SUMMARY.md** - Full feature list
- **VR_FEATURES.md** - VR capabilities guide
- **ENHANCEMENTS.md** - Enhanced features
- **QUICK_REFERENCE.md** - One-page cheat sheet
- **ERROR_FIXES.md** - Error resolutions

---

## 🚀 Next Steps

1. ✅ **Dependencies installed** - Ready to run!
2. ▶️ **Run `npm run dev`** - Start the server
3. 🌐 **Open browser** - Visit localhost
4. 🥽 **Try VR mode** - Click "Enter VR"
5. 📊 **Explore data** - Click hotspots, press 'A' for charts

---

## 🎉 You're All Set!

The project is fully configured and ready to use. Just run:

```bash
npm run dev
```

Then open your browser to explore the ocean! 🌊

---

**Built for NASA Space Apps Challenge 2025** 🚀
**Status**: ✅ Production-Ready
**Version**: 2.0.0 (VR Enhanced)
