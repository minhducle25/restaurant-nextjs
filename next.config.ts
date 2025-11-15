import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Configure allowed image quality presets used with next/image `quality` prop
    // Include both 100 (used by some components) and the default 75
    qualities: [100, 75],
    // Allow loading images from ImageKit hostname used in the project
    domains: ['ik.imagekit.io'],
    // Also allow any path on the hostname via remotePatterns
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
        port: '',
        pathname: '/**'
      }
    ]
  }
};

export default nextConfig;
