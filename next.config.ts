import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: { ignoreBuildErrors: false },
  serverExternalPackages: ["@prisma/client", "bcryptjs", "@react-pdf/renderer", "qrcode"],
};

export default nextConfig;
