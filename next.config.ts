import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-c3c5765215d14e3d882d51123be2ba44.r2.dev",
      },
      {
        protocol: "https",
        hostname: "thetravelhunters.fra1.digitaloceanspaces.com",
      },
      {
        protocol: "https",
        hostname: "img.icons8.com",
      },
    ],
  },
};

export default nextConfig;
