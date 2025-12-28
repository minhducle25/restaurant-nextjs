import {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

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
    // Tắt image optimization khi dùng localhost backend
    unoptimized: true,
    qualities: [100, 75],
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);