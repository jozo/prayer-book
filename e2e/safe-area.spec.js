import {test, expect, devices} from "@playwright/test";
import {
  LANDSCAPE_INSETS,
  PORTRAIT_INSETS,
  emulateSafeArea,
  openMenu,
  safeAreaViolations,
  scrollTo,
  seedStorage
} from "./helpers.js";

// The Android app is drawn edge to edge, so the web content has to keep itself out of the status bar,
// the gesture bar and the camera cutout by using env(safe-area-inset-*).

const customPrayer = {
  id: "custom-0",
  title: "My prayer",
  categories: ["custom"],
  versions: [{name: "", content: "Amen."}],
  lang: "custom"
};

const pages = [
  {name: "home", url: "/"},
  {name: "category", url: "/category/basic"},
  {name: "search", url: "/category/all"},
  {name: "prayer", url: "/prayer/view/en/litanySaints"},
  {name: "custom prayer", url: "/prayer/view/custom/custom-0"},
  {name: "settings", url: "/settings"},
  {name: "add prayer", url: "/prayer/add"},
  {name: "edit prayer", url: "/prayer/edit/custom-0"}
];

const landscape = devices["Pixel 7 landscape"];

for (const orientation of [
  {name: "portrait", insets: PORTRAIT_INSETS, use: {}},
  {name: "landscape", insets: LANDSCAPE_INSETS, use: {viewport: landscape.viewport, screen: landscape.screen}}
]) {
  const {insets} = orientation;

  test.describe(`Safe area in ${orientation.name}`, () => {
    test.use(orientation.use);

    test.beforeEach(async ({page}) => {
      await seedStorage(page, {preferences: {customPrayers: {[customPrayer.id]: customPrayer}}});
      await emulateSafeArea(page, insets);
    });

    for (const {name, url} of pages) {
      test(`${name} page keeps its content inside the safe area`, async ({page}) => {
        await page.goto(url);
        await expect(page.locator("h1")).toBeVisible();

        await scrollTo(page, "start");
        expect(await safeAreaViolations(page, insets, {edges: ["top", "left", "right"]})).toEqual([]);

        await scrollTo(page, "end");
        expect(await safeAreaViolations(page, insets, {edges: ["bottom", "left", "right"]})).toEqual([]);
      });
    }

    test("menu keeps its content inside the safe area", async ({page}) => {
      await page.goto("/");
      await openMenu(page);

      await scrollTo(page, "start", "nav");
      expect(await safeAreaViolations(page, insets, {root: "nav", edges: ["top", "left", "right"]})).toEqual([]);

      await scrollTo(page, "end", "nav");
      expect(await safeAreaViolations(page, insets, {root: "nav", edges: ["bottom", "left", "right"]})).toEqual([]);
    });
  });
}

test.describe("Status bar", () => {
  // Pages whose headers differ in height, so the gradient under the status bar is sized differently
  const headerPages = pages.filter(({name}) => ["home", "category", "add prayer"].includes(name));

  test.beforeEach(async ({page}) => {
    await emulateSafeArea(page, PORTRAIT_INSETS);
  });

  for (const {name, url} of headerPages) {
    test(`${name} page continues its header gradient under the status bar`, async ({page}) => {
      await page.goto(url);
      await expect(page.locator("h1")).toBeVisible();

      // At the top of the page the status bar background has to be indistinguishable from the header
      // under it: the same gradient, stretched over the same height
      const [statusBar, header] = await page.evaluate(() => {
        const [bar, ...below] = document.elementsFromPoint(window.innerWidth / 2, 1);
        const headerElement = below.find(element => getComputedStyle(element).backgroundImage !== "none");
        const describe = (element, height) => ({
          top: element.getBoundingClientRect().top,
          gradient: getComputedStyle(element).backgroundImage,
          height
        });
        return [
          describe(bar, parseFloat(getComputedStyle(bar).backgroundSize.split(" ")[1])),
          describe(headerElement, headerElement.getBoundingClientRect().height)
        ];
      });
      expect(statusBar.gradient).toContain("linear-gradient");
      expect(statusBar.top).toBe(header.top);
      expect(statusBar.gradient).toBe(header.gradient);
      expect(statusBar.height).toBeCloseTo(header.height, 1);
    });
  }

  test("the header background stays in place while the title and content scroll", async ({page}) => {
    await page.goto("/prayer/view/en/litanySaints");
    await expect(page.locator("h1")).toBeVisible();
    const positions = () => page.evaluate(() => ({
      background: document.querySelector("#header-background").getBoundingClientRect().top,
      title: document.querySelector("h1").getBoundingClientRect().top
    }));
    const before = await positions();

    await page.evaluate(() => window.scrollTo(0, 200));

    const after = await positions();
    expect(after.background).toBe(before.background);
    expect(after.title).toBe(before.title - 200);
  });

  test("the fade below the status bar grows only as the page scrolls", async ({page}) => {
    await page.goto("/prayer/view/en/litanySaints");
    await expect(page.locator("h1")).toBeVisible();
    const statusBar = page.locator("#status-bar");

    // At the top of the page nothing covers the menu button below the status bar
    await expect(statusBar).toHaveCSS("height", `${PORTRAIT_INSETS.top}px`);

    await page.evaluate(() => window.scrollTo(0, 10));
    await expect(statusBar).toHaveCSS("height", `${PORTRAIT_INSETS.top + 10}px`);

    await scrollTo(page, "end");
    await expect(statusBar).toHaveCSS("height", `${PORTRAIT_INSETS.top + 32}px`);
  });

  test("scrolled content does not show under the status bar", async ({page}) => {
    await page.goto("/category/all");
    await expect(page.locator("h1")).toBeVisible();

    await scrollTo(page, "end");

    // Sample a few points across the status bar; each has to hit its background, not page content
    const width = page.viewportSize().width;
    const hits = await page.evaluate(([y, xs]) => xs.map(x => document.elementFromPoint(x, y)?.id),
      [PORTRAIT_INSETS.top / 2, [10, width / 2, width - 10]]);
    expect(hits).toEqual(["status-bar", "status-bar", "status-bar"]);
  });

  test("the status bar takes no space without insets", async ({page}) => {
    await emulateSafeArea(page, {top: 0, right: 0, bottom: 0, left: 0});
    await page.goto("/");

    await expect(page.locator("#status-bar")).toHaveCSS("height", "0px");
  });
});
