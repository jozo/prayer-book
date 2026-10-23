import {test, expect} from "@playwright/test";
import {readFileSync} from "node:fs";
import {bookmarksList, heading, list, openMenu, prayerList, prayerText, recentPrayers, seedStorage} from "../e2e/helpers.js";

// App Store Connect tells the devices apart by the image size
const OUTPUT_DIR = "fastlane/screenshots/en-US";
// Used by Google Play, F-Droid and the README
const ANDROID_OUTPUT_DIR = "fastlane/metadata/android/en-US/images/phoneScreenshots";

// Android shows the app in Roboto, its system font. The Linux browser taking the screenshots has another
// one, so load Roboto from @fontsource/roboto. The captions use it on every device.
const ROBOTO_FACES = [400, 700].map((weight) => {
  const font = readFileSync(`node_modules/@fontsource/roboto/files/roboto-latin-${weight}-normal.woff2`);
  return `@font-face {font-family: Roboto; font-weight: ${weight};
    src: url(data:font/woff2;base64,${font.toString("base64")}) format("woff2");}`;
}).join("\n");
const ROBOTO_CSS = ROBOTO_FACES + "\n:root {--font-sans: Roboto, sans-serif;}";

// The caption and the screenshot are put together in this page
const FRAME_HTML = readFileSync("screenshots/frame.html", "utf8");

const CUSTOM_PRAYER = {
  id: "custom-0",
  title: "Prayer for My Family",
  categories: ["custom"],
  versions: [{name: "", content: "Lord Jesus, bless my family.\n\n"
    + "Keep us close to You and to one another, give us patience and joy in our days, "
    + "and guide us safely home to You.\n\n"
    + "Mary, our Mother, pray for us.\n\n"
    + "Amen."}],
  lang: "custom"
};

// In the order the stores show them: the first ones are seen the most
const SCREENS = [
  {
    name: "home",
    caption: "Offline. No ads. No tracking.",
    path: "/",
    preferences: {recentPrayers: recentPrayers([
      "en/rosaryGlorious", "en/angelus", "en/ourFather", "en/litanySacredHeartJesus", "en/memorare"
    ])},
    ready: page => expect(heading(page)).toHaveText("Prayer Book")
  },
  {
    name: "glorious-mysteries",
    caption: "Pray the Rosary anywhere",
    path: "/prayer/view/en/rosaryGlorious",
    ready: page => expect(prayerText(page)).toBeVisible()
  },
  {
    name: "search",
    caption: "Find any prayer in seconds",
    path: "/category/all",
    ready: async (page) => {
      await page.getByPlaceholder("Search…").fill("st.");
      await expect(prayerList(page).first()).toBeVisible();
      // Hide the text cursor
      await page.getByPlaceholder("Search…").blur();
    }
  },
  {
    name: "menu",
    caption: "Prayers, litanies and saints, sorted for you",
    // A top-level page, prayers have a back button in place of the menu button
    path: "/category/basic",
    ready: async (page) => {
      await expect(page.getByText("Our Father")).toBeVisible();
      await openMenu(page);
    }
  },
  {
    name: "translations",
    caption: "Pray in 10 languages",
    path: "/prayer/view/en/ourFather",
    ready: async (page) => {
      await page.getByRole("button", {name: /^Translations:/}).click();
      await expect(page.getByRole("dialog", {name: "Translations"})).toBeVisible();
    }
  },
  {
    name: "list",
    caption: "Make your own prayer lists",
    path: "/list/morning",
    preferences: {lists: [
      bookmarksList(["en/memorare"]),
      list("morning", "Morning prayers", [
        "en/apostlesCreed", "en/ourFather", "en/hailMary", "en/gloryBe", "en/guardianAngelPrayer",
        "en/stMichaelPrayer", "en/angelus"
      ])
    ]},
    ready: page => expect(page.getByText("Guardian Angel")).toBeVisible()
  },
  {
    name: "custom-prayer",
    caption: "Add your own prayers",
    path: "/prayer/view/custom/custom-0",
    preferences: {customPrayers: {"custom-0": CUSTOM_PRAYER}},
    ready: page => expect(prayerText(page)).toBeVisible()
  },
  {
    name: "litany-dark",
    caption: "Easy on the eyes, day and night",
    path: "/prayer/view/en/litanyLoreto",
    colorScheme: "dark",
    preferences: {prayerFontScale: "1.15"},
    ready: page => expect(prayerText(page)).toBeVisible()
  }
];

for (const [index, screen] of SCREENS.entries()) {
  const colorScheme = screen.colorScheme ?? "light";

  test.describe(() => {
    test.use({colorScheme});

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
      const appScreenshot = await page.screenshot();

      // The frame has the device's viewport and scale, so the result has the store's size
      await page.setContent(FRAME_HTML);
      await page.addStyleTag({content: ROBOTO_FACES});
      await page.evaluate(([caption, image, dark]) => {
        document.querySelector("h1").textContent = caption;
        document.querySelector("img").src = image;
        document.body.classList.toggle("dark", dark);
      }, [screen.caption, `data:image/png;base64,${appScreenshot.toString("base64")}`, colorScheme === "dark"]);
      await page.evaluate(() => Promise.all([document.fonts.ready, document.querySelector("img").decode()]));

      const number = index + 1;
      const path = android
        ? `${ANDROID_OUTPUT_DIR}/${number}.png`
        : `${OUTPUT_DIR}/${testInfo.project.name}_${number}_${screen.name}.png`;
      await page.screenshot({path});
    });
  });
}
