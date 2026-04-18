import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: [
    '10.157.23.91',
  ],
   typescript: {
    ignoreBuildErrors: true, // ← add this line
  },
};

export default nextConfig;
