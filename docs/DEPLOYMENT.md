# Muse Dating App - Deployment Guide

## Option 1: Vercel (Recommended)

### Step 1: Install Vercel CLI
```bash
npm i -g vercel
```

### Step 2: Deploy
```bash
cd /Users/hritik/muse-dating
vercel
```

### Step 3: Follow prompts
- Set up and deploy? **Yes**
- Which scope? **Your Vercel account**
- Link to existing project? **No**
- Project name: **muse-dating** (or your choice)
- Directory? **./**
- Want to modify settings? **No**

### Step 4: Environment Variables (if needed)
Go to Vercel Dashboard → Your Project → Settings → Environment Variables

Add these if you want to customize:
```
VITE_APP_NAME=Muse
VITE_APP_VERSION=1.0.0
```

---

## Option 2: Netlify

### Step 1: Install Netlify CLI
```bash
npm i -g netlify-cli
```

### Step 2: Build first
```bash
cd /Users/hritik/muse-dating
npm run build
```

### Step 3: Deploy
```bash
netlify deploy --prod --dir=dist
```

### Step 4: Follow prompts
- Connect to GitHub? **Yes** (if deploying from repo)
- Site name: **muse-dating**

---

## Option 3: GitHub Pages

### Step 1: Add to package.json
```json
{
  "homepage": "https://yourusername.github.io/muse-dating",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

### Step 2: Install gh-pages
```bash
npm i -D gh-pages
```

### Step 3: Deploy
```bash
npm run deploy
```

---

## Environment Variables to Add (Optional)

### For Vercel/Netlify:
```
No environment variables required!
```

This app uses:
- **localStorage** for data persistence (no backend needed)
- **Mock data** for profiles
- **No external APIs** that require keys

---

## Firebase Integration (Optional - Only if you want real backend)

If you want to connect to your existing Firebase from `/Users/hritik/Projects/muse`:

### Step 1: Install Firebase
```bash
cd /Users/hritik/muse-dating
npm i firebase
```

### Step 2: Create `src/firebase/config.js`
```javascript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  // YOUR FIREBASE CONFIG HERE
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
```

### Step 3: Get Firebase Config from Firebase Console
1. Go to https://console.firebase.google.com/
2. Select your project
3. Project Settings → General
4. Copy the config values

---

## Current App Architecture

### Data Storage
- **User data**: localStorage (via Zustand persist)
- **Profiles**: Mock data generated in store
- **Matches/Chats**: localStorage
- **Moments**: localStorage

### No Backend Required
This app works completely offline with mock data. To make it production:
1. Connect Firebase for real user auth
2. Connect Firestore for real data
3. Connect Storage for real image uploads

---

## Quick Deploy Commands

### Vercel (Fastest)
```bash
npm i -g vercel
vercel
```

### Netlify
```bash
npm run build
netlify deploy --prod --dir=dist
```

---

## Build Output
After `npm run build`, the `dist` folder contains:
- `index.html`
- `assets/` (CSS, JS files)

This can be deployed to any static hosting:
- Vercel ✅
- Netlify ✅
- GitHub Pages ✅
- Firebase Hosting ✅
- AWS S3 ✅
- Any web server ✅
