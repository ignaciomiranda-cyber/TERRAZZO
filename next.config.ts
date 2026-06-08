import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // GitHub Pages serves from a subdirectory when repo name != username.github.io
  // Set basePath to "/instone" if the repo is not username.github.io, otherwise leave empty.
  // basePath: "/instone",
  images: { unoptimized: true },
};

export default nextConfig;
