// playwright.config.js
require("dotenv").config();
/** @type {import('@playwright/test').PlaywrightTestConfig} */
const config = {
  testDir: "./tests/ui",
  timeout: 30 * 1000,
  retries: 0,
  use: {
    baseURL: process.env.BASE_URL || "https://winplay.co/",
    headless: true,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    video: "on",
    screenshot: "on",
  },
  reporter: [["list"], ["html", { open: "never" }]],
};

module.exports = config;
