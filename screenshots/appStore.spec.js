import {test, expect} from "@playwright/test";
import {heading, openMenu, prayerText} from "../e2e/helpers.js";

// The same screens as the Android screenshots in fastlane/metadata/android/en-US/images/phoneScreenshots.
// App Store Connect tells the devices apart by the image size.
const OUTPUT_DIR = "fastlane/screenshots/en-US";

const SCREENS = [
  {
    name: "home",
    path: "/",
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
    path: "/prayer/view/en/ourFather",
    ready: async (page) => {
      await expect(prayerText(page)).toBeVisible();
      await openMenu(page);
    }
  }
];

for (const [themeIndex, colorScheme] of ["light", "dark"].entries()) {
  test.describe(`${colorScheme} theme`, () => {
    test.use({colorScheme});

    for (const [index, screen] of SCREENS.entries()) {
      test(screen.name, async ({page}, testInfo) => {
        await page.goto(screen.path);
        await screen.ready(page);
        // Let transitions and fonts settle
        await page.evaluate(() => document.fonts.ready);
        await page.waitForTimeout(500);

        const number = themeIndex * SCREENS.length + index + 1;
        await page.screenshot({path: `${OUTPUT_DIR}/${testInfo.project.name}_${number}_${screen.name}_${colorScheme}.png`});
      });
    }
  });
}
