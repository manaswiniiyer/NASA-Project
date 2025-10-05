# 🐙 GitHub Setup Guide - Share Your Project

## 📤 Upload to GitHub (Step-by-Step)

### Method 1: Using GitHub Desktop (Easiest)

#### Step 1: Install GitHub Desktop
1. Download from: https://desktop.github.com/
2. Install and sign in with your GitHub account

#### Step 2: Create Repository
1. Open GitHub Desktop
2. Click **File** → **Add Local Repository**
3. Browse to: `C:\Users\MANASWINI R IYER\Desktop\New folder\Nasa project`
4. Click **Create Repository**
5. Name it: `pulse-of-the-ocean` (or any name you like)
6. Click **Create Repository**

#### Step 3: Publish to GitHub
1. Click **Publish repository** button
2. Choose:
   - ✅ Name: `pulse-of-the-ocean`
   - ✅ Description: "NASA Space Apps Challenge 2025 - Ocean VR Experience"
   - ✅ Keep code private (uncheck for public)
3. Click **Publish repository**

#### Step 4: Share with Friends
1. Go to your GitHub repository page
2. Click **Settings** → **Collaborators**
3. Click **Add people**
4. Enter your friend's GitHub username
5. They'll receive an invitation email

---

### Method 2: Using Command Line (Git)

#### Step 1: Install Git
Download from: https://git-scm.com/download/win

#### Step 2: Open Terminal in Project Folder
```bash
cd "C:\Users\MANASWINI R IYER\Desktop\New folder\Nasa project"
```

#### Step 3: Initialize Git Repository
```bash
git init
git add .
git commit -m "Initial commit: Pulse of the Ocean VR Experience"
```

#### Step 4: Create GitHub Repository
1. Go to: https://github.com/new
2. Repository name: `pulse-of-the-ocean`
3. Description: "NASA Space Apps Challenge 2025 - Ocean VR Experience"
4. Choose Public or Private
5. **Don't** initialize with README (we already have files)
6. Click **Create repository**

#### Step 5: Push to GitHub
```bash
# Replace YOUR_USERNAME with your GitHub username
git remote add origin https://github.com/YOUR_USERNAME/pulse-of-the-ocean.git
git branch -M main
git push -u origin main
```

---

## 👥 Share with Friends

### Option 1: Public Repository
If your repo is **public**, just share the URL:
```
https://github.com/YOUR_USERNAME/pulse-of-the-ocean
```

Your friends can clone it:
```bash
git clone https://github.com/YOUR_USERNAME/pulse-of-the-ocean.git
cd pulse-of-the-ocean
npm install
npm run dev
```

### Option 2: Private Repository (Add Collaborators)
1. Go to your repository on GitHub
2. Click **Settings** tab
3. Click **Collaborators** in left sidebar
4. Click **Add people** button
5. Enter friend's GitHub username or email
6. Click **Add [username] to this repository**
7. They'll receive an invitation email

### Option 3: Share as ZIP (No GitHub Account Needed)
1. Go to your repository on GitHub
2. Click green **Code** button
3. Click **Download ZIP**
4. Send ZIP file to friends via email/drive

---

## 📋 What to Include in README

Your friends will need to know:

### System Requirements
```markdown
## Requirements
- Node.js 18+ (https://nodejs.org/)
- Modern browser (Chrome, Edge, Firefox)
- VR headset (optional): Quest 2/3, PCVR
```

### Installation Steps
```markdown
## Installation
1. Clone the repository
2. Install dependencies: `npm install`
3. Start dev server: `npm run dev`
4. Open browser: http://localhost:5173
```

### Usage
```markdown
## How to Use
- Click hotspots to explore ocean data
- Press 'A' to toggle analytics charts
- Click "Enter VR" for immersive mode
- Drag time slider to see changes over 12 months
```

---

## 🔒 .gitignore File

Make sure you have a `.gitignore` file to exclude unnecessary files:

```
# Dependencies
node_modules/

# Build output
dist/

# Environment variables
.env
.env.local

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*
```

This file already exists in your project! ✅

---

## 📝 Update README.md

Add your GitHub repository URL to the README:

```markdown
## 🔗 Links
- **GitHub**: https://github.com/YOUR_USERNAME/pulse-of-the-ocean
- **Live Demo**: (add if you deploy)
- **Documentation**: See all .md files in repository
```

---

## 🚀 Deploy Online (Optional)

### Deploy to Vercel (Free)
1. Go to: https://vercel.com/
2. Sign in with GitHub
3. Click **Import Project**
4. Select your repository
5. Click **Deploy**
6. Share the live URL with friends!

### Deploy to Netlify (Free)
1. Go to: https://www.netlify.com/
2. Sign in with GitHub
3. Click **Add new site** → **Import existing project**
4. Select your repository
5. Build command: `npm run build`
6. Publish directory: `dist`
7. Click **Deploy**

---

## 📧 Invite Friends (Summary)

### If Repository is Public:
```
Hey! Check out my NASA project:
https://github.com/YOUR_USERNAME/pulse-of-the-ocean

To run it:
1. Clone: git clone https://github.com/YOUR_USERNAME/pulse-of-the-ocean.git
2. Install: npm install
3. Run: npm run dev
4. Open: http://localhost:5173
```

### If Repository is Private:
```
Hey! I've added you as a collaborator to my NASA project.
Check your email for the GitHub invitation.

After accepting:
1. Clone: git clone https://github.com/YOUR_USERNAME/pulse-of-the-ocean.git
2. Install: npm install
3. Run: npm run dev
4. Open: http://localhost:5173
```

---

## 🔄 Update Your Code Later

When you make changes:

```bash
# Save changes
git add .
git commit -m "Description of changes"
git push

# Friends can update their copy
git pull
```

---

## ✅ Quick Checklist

Before sharing:
- [ ] Create GitHub repository
- [ ] Push all code to GitHub
- [ ] Add collaborators (if private)
- [ ] Update README with GitHub URL
- [ ] Test that friends can clone and run
- [ ] Share repository URL or invite

---

## 🎯 Recommended Repository Settings

### Description
```
🌊 Pulse of the Ocean - An immersive WebXR experience exploring ocean climate data using NASA/NOAA APIs. Built for NASA Space Apps Challenge 2025.
```

### Topics (Tags)
```
webxr, threejs, nasa, ocean, climate-change, vr, typescript, data-visualization
```

### Features to Enable
- ✅ Issues (for bug reports)
- ✅ Discussions (for Q&A)
- ✅ Wiki (for documentation)

---

## 📞 Need Help?

If you get stuck:
1. Check GitHub's help: https://docs.github.com/
2. Watch tutorial: https://www.youtube.com/watch?v=RGOj5yH7evk
3. Ask in GitHub Discussions

---

**Your project is ready to share!** 🎉

Just follow the steps above and your friends will be able to access and run the code.
