import {test, expect} from "@playwright/test";
import {heading, prayerText} from "./helpers.js";

test.describe("Prayer page", () => {
  test("shows the title and text of a prayer", async ({page}) => {
    await page.goto("/prayer/view/en/ourFather");

    await expect(heading(page)).toHaveText("Our Father");
    await expect(prayerText(page)).toContainText("Our Father, Who art in heaven");
    await expect(prayerText(page)).toContainText("Amen.");
    // Markdown paragraphs are rendered as HTML
    await expect(prayerText(page).locator("p").first()).toBeVisible();
  });

  test("a prayer with one version has no version headings", async ({page}) => {
    await page.goto("/prayer/view/en/ourFather");

    await expect(page.locator("h3")).toHaveCount(0);
  });

  test("a prayer with several versions shows each one under its name", async ({page}) => {
    await page.goto("/prayer/view/en/hailMary");

    await expect(heading(page)).toHaveText("Hail Mary");
    await expect(page.locator("h3")).toHaveText(["Traditional", "Modern", "Our Lady of Sorrows"]);
    await expect(prayerText(page)).toHaveCount(3);
  });

  test("litany responses are rendered in italics", async ({page}) => {
    await page.goto("/prayer/view/en/litanyHumility");

    await expect(prayerText(page).locator("em", {hasText: "Deliver me, Jesus."}).first()).toBeVisible();
  });

  test("built-in prayers cannot be edited or deleted", async ({page}) => {
    await page.goto("/prayer/view/en/ourFather");

    await expect(page.getByRole("button", {name: "Bookmark"})).toBeVisible();
    await expect(page.getByRole("button", {name: "Edit"})).toHaveCount(0);
    await expect(page.getByRole("button", {name: "Delete"})).toHaveCount(0);
  });

  test("prayers are available in other languages via the URL", async ({page}) => {
    await page.goto("/prayer/view/la/ourFather");

    await expect(heading(page)).toHaveText("Pater Noster");
  });

  test("the browser back button returns to the category", async ({page}) => {
    await page.goto("/category/basic");
    await page.getByRole("button", {name: "Glory Be"}).click();
    await expect(heading(page)).toHaveText("Glory Be");

    await page.goBack();

    await expect(page).toHaveURL("/category/basic");
    await expect(heading(page)).toHaveText("Basic");
  });
});
