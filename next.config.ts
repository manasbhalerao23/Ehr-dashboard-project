import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.modmed.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
