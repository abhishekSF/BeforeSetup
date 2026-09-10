import type { NextConfig } from "next";

const exportingForGitHubPages = process.env.GITHUB_PAGES === "true";
const configuredBasePath = process.env.GITHUB_PAGES_BASE_PATH?.trim();
const pagesBasePath =
  !configuredBasePath || configuredBasePath === "/"
    ? "/BeforeSetup"
    : configuredBasePath.replace(/\/$/, "");

const nextConfig: NextConfig = exportingForGitHubPages
  ? {
      output: "export",
      trailingSlash: true,
      basePath: pagesBasePath,
      images: { unoptimized: true },
    }
  : {};

export default nextConfig;
