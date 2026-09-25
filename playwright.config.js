import {defineConfig, devices} from "@playwright/test";

const PORT = 4173;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
    // Pin the browser language so the app starts in English regardless of the host machine
    locale: "en-US",
    trace: "on-first-retry"
  },
  projects: [
    {
      // The app ships as a phone app, so test it with a phone-sized viewport
      name: "mobile-chrome",
      use: {...devices["Pixel 7"], locale: "en-US"}
    }
  ],
  webServer: {
    // "npm run build" compiles the prayers first, so the tests run against the shipped web assets
    command: `npm run build && npx vite preview --port ${PORT} --strictPort`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000
  }
});
