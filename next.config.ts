import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      process.env.NEXT_PUBLIC_API_GATEWAY_URL?.includes('localhost')
        ? 'localhost'
        : process.env.NEXT_PUBLIC_API_GATEWAY_URL?.slice(8) || 'localhost',
    ],
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has TypeScript errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
