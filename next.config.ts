import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @irion/sdk is installed as a real local copy (an npm pack tarball, not a
  // symlink) so Turbopack resolves it natively; transpilePackages keeps its
  // compiled dist compiling cleanly.
  transpilePackages: ["@irion/sdk"],
};

export default nextConfig;
