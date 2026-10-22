import {defineConfig} from "@playwright/test";
import baseConfig from "./playwright.config.mjs";

// The App Store screenshot sizes of the latest devices. App Store Connect requires the medium iPhone
// with Dynamic Island and the 13" iPad, and uses the large iPhone for Pro Max and Plus models.
// https://developer.apple.com/help/app-store-connect/reference/app-information/screenshot-specifications/
// Google Play allows at most a 2:1 aspect ratio, which the iPhones exceed, so Android has its own size.
// Its screenshots are also used by F-Droid and the README.
const DEVICES = {
  "iphone-18-pro-max": {width: 440, height: 956, scale: 3}, // 1320x2868
  "iphone-18-pro": {width: 402, height: 874, scale: 3}, // 1206x2622
  "ipad-pro-13-m5": {width: 1032, height: 1376, scale: 2}, // 2064x2752
  "android-phone": {width: 360, height: 720, scale: 3, android: true} // 1080x2160
};

export default defineConfig({
  ...baseConfig,
  testDir: "./screenshots",
  fullyParallel: false,
  retries: 0,
  reporter: "list",
  projects: Object.entries(DEVICES).map(([name, {width, height, scale, android = false}]) => ({
    name,
    metadata: {android},
    use: {
      browserName: "chromium",
      viewport: {width, height},
      deviceScaleFactor: scale,
      isMobile: true,
      hasTouch: true,
      locale: "en-US"
    }
  }))
});
