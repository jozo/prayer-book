import {test, expect} from "@playwright/test";
import {getPreference, heading, prayerList} from "./helpers.js";

test.describe("Home page", () => {
  test("shows the app title, search and language picker", async ({page}) => {
    await page.goto("/");

    await expect(page).toHaveTitle("Prayer Book");
    await expect(heading(page)).toHaveText("Prayer Book");
    await expect(page.getByPlaceholder("Search…")).toBeVisible();
    await expect(page.getByRole("combobox")).toHaveValue("en");
  });

  test("language picker lists every supported language", async ({page}) => {
    await page.goto("/");

    const options = page.getByRole("combobox").locator("option");
    await expect(options).toHaveText([
      "English", "French", "Italian", "Latin", "Polish",
      "Portuguese", "Romanian", "Slovak", "Spanish", "Swahili"
    ]);
  });

  test("clicking the search field opens the list of all prayers", async ({page}) => {
    await page.goto("/");

    await page.getByPlaceholder("Search…").click();

    await expect(page).toHaveURL(/\/category\/all\/?$/);
    await expect(heading(page)).toHaveText("All");
    await expect(prayerList(page).first()).toBeVisible();
  });

  test("changing the language translates the UI and is remembered", async ({page}) => {
    await page.goto("/");

    await page.getByRole("combobox").selectOption("sk");

    await expect(heading(page)).toHaveText("Modlitebná knižka");
    await expect(page.getByPlaceholder("Hľadať…")).toBeVisible();
    await expect.poll(() => getPreference(page, "language")).toBe("sk");

    await page.reload();
    await expect(heading(page)).toHaveText("Modlitebná knižka");
    await expect(page.getByRole("combobox")).toHaveValue("sk");
  });
});
