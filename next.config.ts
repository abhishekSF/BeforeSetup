import type { NextConfig } from "next";

/**
 * GitHub Pages serves this repo at /BeforeSetup/. Local `next dev` / `next build`
 * stay unprefixed. The Pages workflow sets GITHUB_PAGES=true for the export.
 */
const githubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = githubPages
  ? {
      output: "export",
      trailingSlash: true,
      basePath: "/BeforeSetup",
      images: { unoptimized: true },
    }
  : {};

export default nextConfig;
