import {test, expect} from "@playwright/test";
import {getPreference, heading, prayerList, seedStorage} from "./helpers.js";

test.describe("Bookmarks", () => {
  test("shows a message when there are no bookmarks", async ({page}) => {
    await page.goto("/category/bookmarks");

    await expect(heading(page)).toHaveText("Bookmarks");
    await expect(page.getByText("Prayers not found…")).toBeVisible();
  });

  test("bookmarking a prayer adds it to the bookmarks and persists it", async ({page}) => {
    await page.goto("/prayer/view/en/ourFather");

    await page.getByRole("button", {name: "Bookmark"}).click();

    await expect(page.getByRole("button", {name: "Unbookmark"})).toBeVisible();
    await expect.poll(() => getPreference(page, "bookmarks")).toEqual({en: {ourFather: true}});

    await page.goto("/category/bookmarks");
    await expect(prayerList(page)).toHaveText(["Our Father"]);

    await page.reload();
    await expect(prayerList(page)).toHaveText(["Our Father"]);
  });

  test("unbookmarking a prayer removes it from the bookmarks", async ({page}) => {
    await seedStorage(page, {preferences: {bookmarks: {en: {ourFather: true, gloryBe: true}}}});
    await page.goto("/prayer/view/en/ourFather");

    await page.getByRole("button", {name: "Unbookmark"}).click();

    await expect(page.getByRole("button", {name: "Bookmark", exact: true})).toBeVisible();
    await expect.poll(() => getPreference(page, "bookmarks")).toEqual({en: {gloryBe: true}});

    await page.goto("/category/bookmarks");
    await expect(prayerList(page)).toHaveText(["Glory Be"]);
  });

  test("bookmarked prayers open in their own language", async ({page}) => {
    await seedStorage(page, {preferences: {bookmarks: {la: {ourFather: true}}}});
    await page.goto("/category/bookmarks");

    await page.getByRole("button", {name: "Pater Noster"}).click();

    await expect(page).toHaveURL("/prayer/view/la/ourFather");
    await expect(heading(page)).toHaveText("Pater Noster");
  });

  test("bookmarks from several languages are shown together", async ({page}) => {
    await page.goto("/prayer/view/en/ourFather");
    await page.getByRole("button", {name: "Bookmark"}).click();
    await page.goto("/prayer/view/sk/ourFather");
    await page.getByRole("button", {name: "Bookmark"}).click();

    // Switch the UI to Slovak; the English bookmark must stay visible
    await page.goto("/");
    await page.getByRole("combobox").selectOption("sk");
    await page.goto("/category/bookmarks");

    await expect(heading(page)).toHaveText("Obľúbené");
    await expect(prayerList(page)).toHaveText(["Otčenáš", "Our Father"]);
  });

  test("bookmarks can be searched", async ({page}) => {
    await seedStorage(page, {preferences: {bookmarks: {en: {ourFather: true, gloryBe: true, hailMary: true}}}});
    await page.goto("/category/bookmarks");
    await expect(prayerList(page)).toHaveCount(3);

    await page.getByPlaceholder("Search…").fill("glory");

    await expect(prayerList(page)).toHaveText(["Glory Be"]);
  });
});
