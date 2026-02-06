# 🚀 Vercel Deployment Guide

## Environment Variables untuk Vercel

Saat deploy ke Vercel, tambahkan environment variables berikut di dashboard:

### 1. Buka Vercel Dashboard
```
https://vercel.com/dashboard
```

### 2. Go to Project → Settings → Environment Variables

### 3. Tambahkan Variables Berikut:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDZ7Y5Tg0nRttdAZGUdW8uOzRG-4XbA5Ns
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=docugallery-app-8d54a.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=docugallery-app-8d54a
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=docugallery-app-8d54a.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=387632739364
NEXT_PUBLIC_FIREBASE_APP_ID=1:387632739364:web:8d71a74ed15dd6104e54b1

# Google Drive API
NEXT_PUBLIC_GOOGLE_DRIVE_API_KEY=AIzaSyBVHW-uZK018Q5V6fhaejE3rulA9QRx-ko
```

### 4. Set untuk All Environments
- ✅ Production
- ✅ Preview
- ✅ Development

---

## 📋 Quick Deploy Checklist

- [ ] Push code to GitHub
- [ ] Import project di Vercel
- [ ] Add environment variables
- [ ] Deploy
- [ ] Test Firebase Auth
- [ ] Test Drive API auto-thumbnails
- [ ] Verify favicon loads

---

## 🔒 Security Notes

✅ **Safe for GitHub**: 
- No hardcoded credentials in code
- All secrets in `.env.local` (git-ignored)
- `.env.example` shows template only

✅ **Safe for Vercel**:
- Environment variables encrypted by Vercel
- Only accessible during build/runtime
- Not exposed in client bundle (except `NEXT_PUBLIC_*`)

---

## 🛠️ Manual Deploy Steps

### Option 1: Vercel CLI
```bash
npm i -g vercel
vercel login
vercel --prod
```

### Option 2: Vercel Dashboard
1. Connect GitHub repository
2. Import project
3. Add environment variables
4. Click "Deploy"

---

**Status**: ✅ Ready for deployment!
