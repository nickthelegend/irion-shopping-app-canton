import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @xorr-finance/irion-sdk is a published npm package (built ESM/CJS dist with
  // proper `exports`), so Turbopack resolves it natively. transpilePackages is
  // belt-and-suspenders for the scoped dep.
  transpilePackages: ["@xorr-finance/irion-sdk"],
};

export default nextConfig;
