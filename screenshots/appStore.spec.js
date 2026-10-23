import {test, expect} from "@playwright/test";
import {readFileSync} from "node:fs";
import {heading, openMenu, prayerText, recentPrayers, seedStorage} from "../e2e/helpers.js";

// App Store Connect tells the devices apart by the image size
const OUTPUT_DIR = "fastlane/screenshots/en-US";
// Used by Google Play, F-Droid and the README
const ANDROID_OUTPUT_DIR = "fastlane/metadata/android/en-US/images/phoneScreenshots";

// Android shows the app in Roboto, its system font. The Linux browser taking the screenshots has another
// one, so load Roboto from @fontsource/roboto.
const ROBOTO_CSS = [400, 700].map((weight) => {
  const font = readFileSync(`node_modules/@fontsource/roboto/files/roboto-latin-${weight}-normal.woff2`);
  return `@font-face {font-family: Roboto; font-weight: ${weight};
    src: url(data:font/woff2;base64,${font.toString("base64")}) format("woff2");}`;
}).join("\n") + "\n:root {--font-sans: Roboto, sans-serif;}";

const SCREENS = [
  {
    name: "home",
    path: "/",
    preferences: {recentPrayers: recentPrayers([
      "en/rosaryGlorious", "en/angelus", "en/ourFather", "en/litanySacredHeartJesus", "en/memorare"
    ])},
    ready: page => expect(heading(page)).toHaveText("Prayer Book")
  },
  {
    name: "rosary",
    path: "/category/rosary",
    ready: page => expect(page.getByText("Glorious Mysteries")).toBeVisible()
  },
  {
    name: "glorious-mysteries",
    path: "/prayer/view/en/rosaryGlorious",
    ready: page => expect(prayerText(page)).toBeVisible()
  },
  {
    name: "menu",
    // A top-level page, prayers have a back button in place of the menu button
    path: "/category/basic",
    ready: async (page) => {
      await expect(page.getByText("Our Father")).toBeVisible();
      await openMenu(page);
    }
  }
];

for (const [themeIndex, colorScheme] of ["light", "dark"].entries()) {
  test.describe(`${colorScheme} theme`, () => {
    test.use({colorScheme});

    for (const [index, screen] of SCREENS.entries()) {
      test(screen.name, async ({page}, testInfo) => {
        const {android} = testInfo.project.metadata;
        if (screen.preferences) {
          await seedStorage(page, {preferences: screen.preferences});
        }
        await page.goto(screen.path);
        if (android) {
          await page.addStyleTag({content: ROBOTO_CSS});
        }
        await screen.ready(page);
        // Let transitions and fonts settle
        await page.evaluate(() => document.fonts.ready);
        await page.waitForTimeout(500);

        const number = themeIndex * SCREENS.length + index + 1;
        const path = android
          ? `${ANDROID_OUTPUT_DIR}/${number}.png`
          : `${OUTPUT_DIR}/${testInfo.project.name}_${number}_${screen.name}_${colorScheme}.png`;
        await page.screenshot({path});
      });
    }
  });
}
