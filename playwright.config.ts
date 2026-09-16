import { defineConfig, devices } from "@playwright/test";

const isCI = !!process.env.CI;

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 2 : undefined,
  reporter: [
    ["list"],
    ["html", { open: "never", outputFolder: "playwright-report" }],
  ],
  timeout: 45_000,
  expect: {
    timeout: 8_000,
  },
  use: {
    testIdAttribute: "data-test",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "off",
  },
  projects: [
    {
      name: "web",
      testDir: "./tests/web",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: process.env.WEB_BASE_URL ?? "https://www.saucedemo.com",
      },
    },
    {
      name: "api",
      testDir: "./tests/api",
      use: {
        baseURL:
          process.env.API_BASE_URL ?? "https://jsonplaceholder.typicode.com",
        extraHTTPHeaders: {
          Accept: "application/json",
        },
      },
    },
  ],
});
