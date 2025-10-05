# 🚀 How to Share Your Project on GitHub

## 🎯 Easiest Method: GitHub Desktop (Recommended)

### Step 1: Install GitHub Desktop
1. **Download**: https://desktop.github.com/
2. **Install** the application
3. **Sign in** with your GitHub account (or create one at https://github.com/signup)

### Step 2: Add Your Project
1. Open **GitHub Desktop**
2. Click **File** → **Add Local Repository**
3. Click **Choose...** button
4. Navigate to: `C:\Users\MANASWINI R IYER\Desktop\New folder\Nasa project`
5. Click **Select Folder**
6. If it says "not a git repository", click **Create a repository**

### Step 3: Create Repository
1. **Name**: `pulse-of-the-ocean` (or any name you like)
2. **Description**: "NASA Space Apps Challenge 2025 - Ocean VR Experience"
3. **Git Ignore**: None (we already have .gitignore)
4. **License**: MIT (optional)
5. Click **Create Repository**

### Step 4: Make First Commit
1. You'll see all your files listed
2. **Summary**: Type "Initial commit - Pulse of the Ocean"
3. **Description**: "Complete VR ocean exploration experience with NASA data"
4. Click **Commit to main**

### Step 5: Publish to GitHub
1. Click the **Publish repository** button (top right)
2. Choose:
   - ✅ **Name**: pulse-of-the-ocean
   - ✅ **Description**: NASA Space Apps Challenge 2025 - Ocean VR Experience
   - ✅ **Keep this code private** (uncheck for public repo)
   - ✅ **Organization**: None (use your personal account)
3. Click **Publish repository**
4. Wait for upload to complete (may take 1-2 minutes)

### Step 6: View on GitHub
1. Click **View on GitHub** button
2. Your repository is now online! 🎉
3. Copy the URL (e.g., `https://github.com/YOUR_USERNAME/pulse-of-the-ocean`)

---

## 👥 Add Your Friends as Collaborators

### Method A: Add Collaborators (Private Repo)
1. Go to your repository on GitHub
2. Click **Settings** tab
3. Click **Collaborators** in the left sidebar
4. Click **Add people** button
5. Enter your friend's **GitHub username** or **email**
6. Click **Add [username] to this repository**
7. They'll receive an **invitation email**
8. Once they accept, they can access the code

### Method B: Make Repository Public
1. Go to your repository on GitHub
2. Click **Settings** tab
3. Scroll to bottom → **Danger Zone**
4. Click **Change visibility**
5. Select **Make public**
6. Type repository name to confirm
7. Click **I understand, change repository visibility**
8. Now anyone can access with the URL!

---

## 📤 Share with Your Friends

### If Public Repository:
Send them this message:
```
Hey! Check out my NASA ocean project:
https://github.com/YOUR_USERNAME/pulse-of-the-ocean

To run it on your computer:
1. Install Node.js from https://nodejs.org/
2. Open terminal and run:
   git clone https://github.com/YOUR_USERNAME/pulse-of-the-ocean.git
   cd pulse-of-the-ocean
   npm install
   npm run dev
3. Open browser: http://localhost:5173
```

### If Private Repository:
Send them this message:
```
Hey! I've invited you to collaborate on my NASA project.
1. Check your email for GitHub invitation
2. Accept the invitation
3. Install Node.js from https://nodejs.org/
4. Clone the repo:
   git clone https://github.com/YOUR_USERNAME/pulse-of-the-ocean.git
   cd pulse-of-the-ocean
   npm install
   npm run dev
5. Open browser: http://localhost:5173
```

---

## 💻 Alternative: Share as ZIP (No GitHub Needed)

If your friends don't have GitHub:

### Option 1: GitHub Download
1. Go to your repository on GitHub
2. Click green **Code** button
3. Click **Download ZIP**
4. Send ZIP file via email/Google Drive/OneDrive

### Option 2: Direct ZIP
1. Right-click the `Nasa project` folder
2. Select **Send to** → **Compressed (zipped) folder**
3. Share the ZIP file

Your friends can then:
1. Extract the ZIP
2. Open terminal in extracted folder
3. Run: `npm install`
4. Run: `npm run dev`

---

## 🌐 Deploy Online (Optional - Free!)

### Deploy to Vercel (Easiest)
1. Go to https://vercel.com/
2. Click **Sign Up** → **Continue with GitHub**
3. Click **Import Project**
4. Select `pulse-of-the-ocean` repository
5. Click **Deploy**
6. Wait 1-2 minutes
7. Get your live URL: `https://pulse-of-the-ocean.vercel.app`
8. Share this URL - friends can use it without installing anything!

### Deploy to Netlify
1. Go to https://www.netlify.com/
2. Sign up with GitHub
3. Click **Add new site** → **Import an existing project**
4. Select your repository
5. Build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
6. Click **Deploy site**
7. Get your live URL: `https://pulse-of-the-ocean.netlify.app`

---

## 🔄 Update Your Code Later

When you make changes:

### Using GitHub Desktop:
1. Make changes to your code
2. Open GitHub Desktop
3. You'll see changed files
4. Add commit message: "Fixed bug" or "Added feature"
5. Click **Commit to main**
6. Click **Push origin** button

### Your Friends Update Their Copy:
1. Open GitHub Desktop
2. Select the repository
3. Click **Fetch origin**
4. If updates available, click **Pull origin**

---

## 📋 Quick Reference

### Your Repository URL Format:
```
https://github.com/YOUR_USERNAME/pulse-of-the-ocean
```

### Clone Command for Friends:
```bash
git clone https://github.com/YOUR_USERNAME/pulse-of-the-ocean.git
```

### Installation Commands:
```bash
cd pulse-of-the-ocean
npm install
npm run dev
```

---

## ✅ Checklist

Before sharing with friends:

- [ ] Install GitHub Desktop
- [ ] Create GitHub account (if needed)
- [ ] Add project to GitHub Desktop
- [ ] Commit all files
- [ ] Publish to GitHub
- [ ] Add friends as collaborators (if private)
- [ ] Test the repository URL works
- [ ] Share URL or invitation with friends

---

## 🎓 Video Tutorials

If you prefer video guides:

1. **GitHub Desktop Tutorial**: https://www.youtube.com/watch?v=8Dd7KRpKeaE
2. **Git & GitHub Crash Course**: https://www.youtube.com/watch?v=RGOj5yH7evk
3. **Deploy to Vercel**: https://www.youtube.com/watch?v=2HBIzEx6IZA

---

## 🆘 Troubleshooting

### "Repository not found"
- Make sure you've published the repository
- Check if it's private and friends are added as collaborators

### "Permission denied"
- Friends need to accept collaborator invitation
- Or make repository public

### "npm install fails"
- Make sure Node.js is installed
- Run: `npm cache clean --force`
- Try again: `npm install`

---

## 📞 Need Help?

1. **GitHub Docs**: https://docs.github.com/
2. **GitHub Support**: https://support.github.com/
3. **Stack Overflow**: https://stackoverflow.com/questions/tagged/github

---

## 🎉 You're Ready!

Follow the steps above and your friends will be able to:
- ✅ Access your code
- ✅ Run it on their computers
- ✅ Make changes (if collaborators)
- ✅ Contribute to the project

**Your NASA project is ready to share with the world!** 🌊🚀

---

**Pro Tip**: After uploading to GitHub, add a nice README with screenshots and a demo video to make it more impressive!
