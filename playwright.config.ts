import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e", fullyParallel: true, retries: 1,
  reporter: [["list"], ["html", { open: "never" }]],
  use: { baseURL: "http://127.0.0.1:4780", trace: "retain-on-failure" },
  projects: [
    { name: "mobile-320", use: { viewport: { width: 320, height: 740 }, isMobile: true, hasTouch: true } },
    { name: "mobile-375", use: { viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true } },
    { name: "tablet", use: { viewport: { width: 768, height: 1024 } } },
    { name: "desktop", use: { viewport: { width: 1440, height: 1000 } } },
  ],
  webServer: { command: "npm run start -- --hostname 127.0.0.1 --port 4780", url: "http://127.0.0.1:4780", reuseExistingServer: !process.env.CI },
});
