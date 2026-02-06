import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'drive.google.com',
      },
      {
        protocol: 'https',
        hostname: '**.univetbantara.ac.id', // Allow all subdomains
      },
      {
        protocol: 'https',
        hostname: '**', // Allow all HTTPS domains (permissive for user uploads)
      }
    ],
    // Allow unoptimized images for external sources
    unoptimized: false,
  },
};

export default nextConfig;
