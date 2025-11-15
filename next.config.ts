import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Configure allowed image quality presets used with next/image `quality` prop
    // Include both 100 (used by some components) and the default 75
    qualities: [100, 75]
  }
};

export default nextConfig;
