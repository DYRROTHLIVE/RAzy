# 🎮 RAzy Universal Game Launcher

Universal Game Launcher, UI/UX, Authentication & Landscape Game System with player profile, unique UIDs, game library, match preparation, and 3D arcade gameplay.

---

## 📲 Android Downloads (Standalone & Google Play)

| Artifact | File Name | Format | Status | Description |
|:---|:---|:---|:---|:---|
| **Direct APK** | `razy-launcher.apk` | Signed APK (v1, v2, v3) | ✅ Ready (~20 MB) | Sideloadable standalone Android app with embedded local offline server and hardware acceleration. No AI Studio redirection or 403 errors. |
| **Play Store Bundle** | `razy-launcher.aab` | Signed Android App Bundle | ✅ Ready (~19 MB) | Google Play Store publication bundle supporting dynamic resource delivery. |

---

## 🛠️ How to Push to GitHub Releases & Remote

To push this repository to your GitHub account (`https://github.com/DYRROTHLIVE/RAzy`):

```bash
# 1. Add your GitHub remote repository
git remote add origin https://github.com/DYRROTHLIVE/RAzy.git

# 2. Push source code and artifacts to main
git branch -M main
git push -u origin main
```

### Creating GitHub Release with the APK & AAB:
1. Go to `https://github.com/DYRROTHLIVE/RAzy/releases/new`
2. Set Tag version: `v1.0.2`
3. Release title: `RAzy Universal Game Launcher v1.0.2 (Release APK & AAB)`
4. Drag and attach:
   - `public/downloads/razy-launcher.apk`
   - `public/downloads/razy-launcher.aab`
5. Click **Publish release**.

---

## 🏗️ Building Locally

```bash
# Install dependencies
npm install

# Build web frontend
npm run build

# Compile, assemble and sign Android APK and AAB
npm run build:android
```
