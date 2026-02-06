# Akun Testing DocuGallery V12

## 🔐 Cara Membuat Akun Testing

### Opsi 1: Register Langsung di App (RECOMMENDED)

1. **Buka aplikasi** → `/login`
2. **Klik "Register"**
3. **Isi form:**
   - Username: `testadmin`
   - Email: `admin@test.com`
   - Password: `admin123`
4. **Submit** → Akun dibuat dengan status "pending"

5. **Manual Approval di Firestore Console:**
   - Buka Firebase Console → Firestore Database
   - Collection: `users`
   - Cari user dengan email `admin@test.com`
   - Edit dokumen:
     ```json
     {
       "role": "admin",
       "status": "approved"
     }
     ```

---

### Opsi 2: Buat Multiple Test Accounts

**Admin Account:**
- Email: `admin@docugallery.com`
- Password: `Admin123!`
- Username: `Administrator`

**Regular User (Approved):**
- Email: `user@docugallery.com`
- Password: `User123!`
- Username: `Regular User`

**Pending User:**
- Email: `pending@docugallery.com`
- Password: `Pending123!`
- Username: `Pending User`

---

## 🛠️ Quick Fix Script

Jika error `auth/invalid-credential` terus muncul, kemungkinan:

1. **Password salah** - Firebase Auth strict dengan password
2. **User tidak ada di Auth** - Hanya ada di Firestore
3. **Email tidak verified** - Tergantung Firebase config

### Solusi Cepat:

1. **Reset semua dan buat baru:**
   ```bash
   # Di browser, buka console
   # Lalu register akun baru
   ```

2. **Atau gunakan Firebase Console:**
   - Authentication → Users → Add User
   - Email: `admin@test.com`
   - Password: `admin123`
   
3. **Lalu set role di Firestore:**
   - Firestore → `users` → tambah dokumen
   - Document ID: (sama dengan UID dari Auth)
   ```json
   {
     "email": "admin@test.com",
     "displayName": "Test Admin",
     "role": "admin",
     "status": "approved",
     "createdAt": "2024-02-06T15:00:00.000Z"
   }
   ```

---

## ✅ Recommended Test Account Setup

**STEP 1: Register via App**
```
Username: testadmin
Email: testadmin@local.dev
Password: Test@1234
```

**STEP 2: Approve via Firestore Console**
- Find user doc → Edit
- Set `role: "admin"`
- Set `status: "approved"`

**STEP 3: Login**
- Email: `testadmin@local.dev`
- Password: `Test@1234`

---

## 🚨 Common Errors & Fixes

### Error: `auth/invalid-credential`
**Cause**: Email/password tidak match dengan Auth
**Fix**: 
1. Check typo di email/password
2. Register ulang akun baru
3. Check Firebase Auth console untuk verify user exists

### Error: `auth/user-not-found`
**Cause**: User belum di-register
**Fix**: Klik "Register" dan buat akun baru

### Error: Redirect ke home setelah login
**Cause**: User role bukan "admin" atau status "pending"
**Fix**: Update Firestore user document

---

## 💡 Testing Checklist

Setelah punya akun:

**Test sebagai Admin:**
- [ ] Login → Akses `/admin` → Berhasil
- [ ] Buat project baru
- [ ] Edit & delete project
- [ ] Approve pending users

**Test sebagai User:**
- [ ] Login → Akses `/admin` → Blocked (toast error)
- [ ] View public content
- [ ] Cannot view private content

**Test sebagai Guest:**
- [ ] Akses `/admin` → Redirect ke login
- [ ] View public content only
