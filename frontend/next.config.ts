import type { NextConfig } from "next";

const inferenceBackendUrl = (
  process.env.INFERENCE_BACKEND_URL ?? "http://127.0.0.1:8000"
).replace(/\/$/, "");

const nextConfig: NextConfig = {
  reactCompiler: true,
  async rewrites() {
    return [
      {
        source: "/infer",
        destination: `${inferenceBackendUrl}/infer`,
      },
    ];
  },
};

export default nextConfig;
