import {test, expect} from "@playwright/test";
import {bookmarksList, heading, prayerText, seedStorage} from "./helpers.js";

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

  test("built-in prayers cannot be edited", async ({page}) => {
    await page.goto("/prayer/view/en/ourFather");

    await expect(page.getByRole("button", {name: "Bookmark"})).toBeVisible();
    await expect(page.getByRole("button", {name: "Edit"})).toHaveCount(0);
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

test.describe("Prayer translations", () => {
  const languageButton = page => page.getByRole("button", {name: /^Translations:/});
  const sheet = page => page.getByRole("dialog", {name: "Translations"});

  test("the language button shows the current language", async ({page}) => {
    await page.goto("/prayer/view/en/ourFather");

    await expect(languageButton(page)).toHaveText("English");
    await expect(languageButton(page)).toHaveAccessibleName("Translations: English");
    await expect(sheet(page)).toBeHidden();
  });

  test("prayers in one language only and custom prayers have no language button", async ({page}) => {
    await seedStorage(page, {preferences: {customPrayers: {
      "custom-0": {id: "custom-0", title: "Mine", categories: ["custom"], versions: [{name: "", content: "Amen."}], lang: "custom"}
    }}});
    await page.goto("/prayer/view/sk/sixChiefTruths");
    await expect(prayerText(page).first()).toBeVisible();
    await expect(languageButton(page)).toHaveCount(0);

    await page.goto("/prayer/view/custom/custom-0");
    await expect(heading(page)).toHaveText("Mine");
    await expect(languageButton(page)).toHaveCount(0);
  });

  test("the sheet lists every translation with its title and marks the current one", async ({page}) => {
    await page.goto("/prayer/view/en/ourFather");

    await languageButton(page).click();

    const options = sheet(page).getByRole("button");
    await expect(options).toHaveCount(10);
    await expect(options.first()).toHaveText("EnglishOur Father");
    await expect(sheet(page).getByRole("button", {name: "Latin Pater Noster"})).toBeVisible();
    await expect(sheet(page).getByRole("button", {name: "Slovak Otčenáš"})).toBeVisible();
    await expect(sheet(page).locator("[aria-current=true]")).toHaveText("EnglishOur Father");
  });

  test("choosing a translation shows it and Back returns to the previous one", async ({page}) => {
    await seedStorage(page, {preferences: {lists: [bookmarksList(["la/ourFather"])]}});
    await page.goto("/prayer/view/en/ourFather");
    await expect(page.getByRole("button", {name: "Bookmark", exact: true})).toBeVisible();

    await languageButton(page).click();
    await sheet(page).getByRole("button", {name: /^Latin/}).click();

    await expect(page).toHaveURL("/prayer/view/la/ourFather");
    await expect(sheet(page)).toBeHidden();
    await expect(heading(page)).toHaveText("Pater Noster");
    await expect(prayerText(page)).toContainText("Pater noster, qui es in caelis");
    await expect(languageButton(page)).toHaveText("Latin");
    // Bookmarks are per translation
    await expect(page.getByRole("button", {name: "Unbookmark"})).toBeVisible();

    await page.goBack();

    await expect(page).toHaveURL("/prayer/view/en/ourFather");
    await expect(heading(page)).toHaveText("Our Father");
    await expect(prayerText(page)).toContainText("Our Father, Who art in heaven");
    await expect(page.getByRole("button", {name: "Bookmark", exact: true})).toBeVisible();
  });

  test("the sheet closes without switching on Escape, the backdrop or the current language", async ({page}) => {
    await page.goto("/prayer/view/en/ourFather");

    await languageButton(page).click();
    await page.keyboard.press("Escape");
    await expect(sheet(page)).toBeHidden();

    await languageButton(page).click();
    // The backdrop is the part of the dialog above the sheet
    await page.mouse.click(200, 20);
    await expect(sheet(page)).toBeHidden();

    await languageButton(page).click();
    await sheet(page).getByRole("button", {name: /^English/}).click();
    await expect(sheet(page)).toBeHidden();

    await expect(page).toHaveURL("/prayer/view/en/ourFather");
  });
});
