import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '4000',
        pathname: '/**',
      },
      {
        hostname: 'placehold.com',
        pathname: '/**',
      }
    ],
    dangerouslyAllowSVG: true,
    unoptimized: process.env.NODE_ENV === 'development',
    qualities: [100, 75],
  },
  // experimental: ({ allowPrivateIPs: true } as any),
};

export default nextConfig;
