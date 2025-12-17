import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,

  productionBrowserSourceMaps: false,
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
