import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 45_000,
  expect: { timeout: 8_000 },
  fullyParallel: false,
  retries: 0,
  reporter: [["list"], ["html", { outputFolder: "qa/playwright-report", open: "never" }]],
  use: {
    baseURL: "http://127.0.0.1:3091",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "pnpm start --hostname 127.0.0.1 --port 3091",
    url: "http://127.0.0.1:3091",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
