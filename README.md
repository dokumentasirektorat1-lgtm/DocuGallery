# DocuGallery - Enterprise Documentation & Gallery Platform

Production-ready Next.js application for managing and displaying documentation galleries with Firebase integration.

## 🚀 Features

- **Authentication System** - Firebase Auth with role-based access (Admin/User)
- **Gallery Management** - Display projects with filtering, search, and pagination
- **Auto-Thumbnail** - Intelligent image selection from Google Drive folders
- **Admin Dashboard** - Manage projects, users, and settings
- **CSV Import** - Bulk import projects from CSV files
- **Dynamic Branding** - Customizable logo, favicon, and footer
- **Dark Mode** - Full dark mode support
- **Responsive Design** - Mobile-first responsive UI

## 📋 Prerequisites

- Node.js 18+ 
- Firebase project
- Google Drive API key (for auto-thumbnails)

## 🛠️ Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd DisplayDokumentasi
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your actual credentials:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_GOOGLE_DRIVE_API_KEY=your_drive_api_key
```

4. **Run development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📦 Build for Production

```bash
npm run build
npm start
```

## 🌐 Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone)

### Environment Variables for Vercel

Add these in Vercel dashboard → Settings → Environment Variables:

```
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
NEXT_PUBLIC_GOOGLE_DRIVE_API_KEY
```

## 📚 Documentation

- [Pagination Guide](PAGINATION_GUIDE.md)
- [Visual Optimization](VISUAL_OPTIMIZATION_GUIDE.md)
- [Auto-Thumbnail Guide](AUTO_THUMBNAIL_GUIDE.md)
- [Bug Fixes Summary](BUGFIX_FOOTER_SUMMARY.md)

## 🔒 Security

- All sensitive credentials use environment variables
- Firebase security rules enforce authentication
- Admin routes protected with role-based access
- `.env.local` excluded from git

## 📄 License

MIT License

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

Built with ❤️ using Next.js, Firebase, and TypeScript