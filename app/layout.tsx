import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./scrollbar.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/context/AuthContext";
import { SettingsProvider } from "@/context/SettingsContext";
import { DataProvider } from "@/context/DataContext";
import { Navbar } from "@/components/Navbar";
import { Toaster } from "react-hot-toast";
import { DynamicHead } from "@/components/DynamicHead";
import { DynamicBranding } from "@/components/DynamicBranding";
import { Footer } from "@/components/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://display-dokumentasi.vercel.app'),
  title: {
    default: "DocuGallery Hub",
    template: "%s | DocuGallery Hub"
  },
  description: "Enterprise documentation and gallery platform for managing media content and campaigns.",
  openGraph: {
    title: "DocuGallery Hub",
    description: "Enterprise documentation and gallery platform for managing media content and campaigns.",
    url: '/',
    siteName: 'DocuGallery Hub',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'DocuGallery Hub Preview',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DocuGallery Hub',
    description: "Enterprise documentation and gallery platform.",
    images: ['/opengraph-image'],
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=block" />
        {/* Hardcoded Favicon - Google Drive Thumbnail */}
        <link rel="icon" href="https://drive.google.com/thumbnail?id=1XqYHNYhV6iQonUzomAdJpCdxjjiy8W3I&sz=w64" />
      </head>
      <body
        className={`${inter.variable} font-sans antialiased bg-background text-foreground flex flex-col min-h-screen`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <SettingsProvider>
              <DataProvider>
                <DynamicHead />
                <DynamicBranding />
                <Navbar />
                <main className="flex-1 transition-colors duration-300">
                  {children}
                </main>
                <Footer />
                <Toaster
                  position="top-right"
                  toastOptions={{
                    duration: 3000,
                    style: {
                      background: 'var(--background)',
                      color: 'var(--foreground)',
                      border: '1px solid var(--border)',
                    },
                    success: {
                      iconTheme: {
                        primary: '#06B6D4',
                        secondary: '#ffffff',
                      },
                    },
                  }}
                />
              </DataProvider>
            </SettingsProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
