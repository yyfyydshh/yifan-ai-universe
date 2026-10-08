import { defineConfig } from "@playwright/test";
import base from "../../playwright.config";

// Use the already-running development server without starting a stale build.
export default defineConfig({
  ...base,
  testDir: ".",
  outputDir: "../../qa/world/dev-test-results",
  use: { ...base.use, baseURL: "http://127.0.0.1:3010" },
  webServer: [],
  reporter: [["list"], ["html", { outputFolder: "qa/world/dev-test-report", open: "never" }]],
});
