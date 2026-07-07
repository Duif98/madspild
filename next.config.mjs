/** @type {import('next').NextConfig} */

// GitHub Pages serves a project site from /<repo>; the deploy workflow sets
// NEXT_PUBLIC_BASE_PATH automatically. Empty locally so it runs from root.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig = {
  output: "export",
  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
