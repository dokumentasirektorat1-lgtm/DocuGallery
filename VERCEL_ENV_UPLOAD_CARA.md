# 🚀 Cara Upload Environment Variables ke Vercel

## ⚡ Cara Tercepat: Upload File .env

Vercel bisa import file `.env` langsung!

### Step-by-Step:

1. **Buka Vercel Dashboard**
   ```
   https://vercel.com/dashboard
   ```

2. **Pilih Project** → DocuGallery

3. **Go to Settings**
   - Klik tab "Settings" di menu atas

4. **Scroll ke "Environment Variables"**

5. **Klik tombol "Add New" atau "Import .env"**
   - Pilih file: `.env.vercel`
   - Atau copy-paste isi dari file `.env.vercel`

6. **Upload File atau Paste Content**
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDZ7Y5Tg0nRttdAZGUdW8uOzRG-4XbA5Ns
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=docugallery-app-8d54a.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=docugallery-app-8d54a
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=docugallery-app-8d54a.firebasestorage.app
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=387632739364
   NEXT_PUBLIC_FIREBASE_APP_ID=1:387632739364:web:8d71a74ed15dd6104e54b1
   NEXT_PUBLIC_GOOGLE_DRIVE_API_KEY=AIzaSyBVHW-uZK018Q5V6fhaejE3rulA9QRx-ko
   ```

7. **Pilih Environment**
   - ✅ Production
   - ✅ Preview  
   - ✅ Development

8. **Save**

9. **Redeploy**
   - Go to "Deployments" tab
   - Klik "..." menu di deployment terakhir
   - Pilih "Redeploy"

---

## 📋 Alternative: Add Manual (Satu-satu)

Jika import tidak tersedia, tambahkan manual:

### Variable 1:
```
Name: NEXT_PUBLIC_FIREBASE_API_KEY
Value: AIzaSyDZ7Y5Tg0nRttdAZGUdW8uOzRG-4XbA5Ns
```

### Variable 2:
```
Name: NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
Value: docugallery-app-8d54a.firebaseapp.com
```

### Variable 3:
```
Name: NEXT_PUBLIC_FIREBASE_PROJECT_ID
Value: docugallery-app-8d54a
```

### Variable 4:
```
Name: NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
Value: docugallery-app-8d54a.firebasestorage.app
```

### Variable 5:
```
Name: NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
Value: 387632739364
```

### Variable 6:
```
Name: NEXT_PUBLIC_FIREBASE_APP_ID
Value: 1:387632739364:web:8d71a74ed15dd6104e54b1
```

### Variable 7:
```
Name: NEXT_PUBLIC_GOOGLE_DRIVE_API_KEY
Value: AIzaSyBVHW-uZK018Q5V6fhaejE3rulA9QRx-ko
```

---

## ✅ Verification

Setelah add dan redeploy, build harus sukses:

```
✓ Compiled successfully
✓ Finished TypeScript
✓ Generating static pages (8/8)
✓ Finalizing page optimization
```

---

## 🎉 Done!

Aplikasi akan online di:
```
https://your-project.vercel.app
```

**File Ready**: `.env.vercel` sudah siap untuk di-upload!
