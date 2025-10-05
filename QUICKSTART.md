# 🚀 Quick Start

## 1. Install Dependencies

```bash
cd "C:\Users\MANASWINI R IYER\CascadeProjects\pulse-of-the-ocean-webxr"
npm install
```

## 2. Run Development Server

```bash
npm run dev
```

The app will open at [http://localhost:3000](http://localhost:3000).

## 3. Test in VR

### Browser (Desktop Preview)
- Click "Enter VR" button
- Use mouse to orbit the globe
- Drag the time slider to change months

### Quest 2/3
1. Open Oculus Browser on your headset
2. Navigate to your local IP (e.g., `http://192.168.1.x:3000`)
3. Click "Enter VR"

### PCVR (SteamVR/Oculus Link)
1. Start SteamVR or Oculus Link
2. Open Chrome/Edge with WebXR flags enabled
3. Navigate to `http://localhost:3000`
4. Click "Enter VR"

## 4. What You'll See

- **Rotating Earth globe** with atmosphere glow
- **Time slider** (bottom center) to scrub through 12 months
- **SST overlay** (placeholder procedural heatmap, will be replaced with NASA data)
- **Info panel** (top left) with project description
- **VR button** (top right) to enter immersive mode

## 5. Next: Add Real NASA Data

See `README.md` section "Next Steps" for data integration instructions.

---

**Tip**: For Quest testing over Wi-Fi, find your PC's local IP with `ipconfig` (Windows) or `ifconfig` (Mac/Linux), then access `http://<YOUR_IP>:3000` from the headset browser.
