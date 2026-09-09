import type { NextConfig } from "next";

const exportingForGitHubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = exportingForGitHubPages
  ? {
      output: "export",
      trailingSlash: true,
      basePath: "/BeforeSetup",
      images: { unoptimized: true },
    }
  : {};

export default nextConfig;
