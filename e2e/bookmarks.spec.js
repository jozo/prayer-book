import {test, expect} from "@playwright/test";
import {bookmarksList, getListItems, heading, prayerList, seedStorage, touchDrag} from "./helpers.js";

test.describe("Bookmarks", () => {
  test("shows a message when there are no bookmarks", async ({page}) => {
    await page.goto("/list/bookmarks");

    await expect(heading(page)).toHaveText("Bookmarks");
    await expect(page.getByText("This list is empty…")).toBeVisible();
  });

  test("the old bookmarks address opens the bookmarks", async ({page}) => {
    await page.goto("/category/bookmarks");

    await expect(page).toHaveURL("/list/bookmarks");
    await expect(heading(page)).toHaveText("Bookmarks");
  });

  test("bookmarking a prayer adds it to the bookmarks and persists it", async ({page}) => {
    await page.goto("/prayer/view/en/ourFather");

    await page.getByRole("button", {name: "Bookmark"}).click();

    await expect(page.getByRole("button", {name: "Unbookmark"})).toBeVisible();
    await expect.poll(() => getListItems(page, "bookmarks")).toEqual(["en/ourFather"]);

    await page.goto("/list/bookmarks");
    await expect(prayerList(page)).toHaveText(["Our Father"]);

    await page.reload();
    await expect(prayerList(page)).toHaveText(["Our Father"]);
  });

  test("unbookmarking a prayer removes it from the bookmarks", async ({page}) => {
    await seedStorage(page, {preferences: {lists: [bookmarksList(["en/ourFather", "en/gloryBe"])]}});
    await page.goto("/prayer/view/en/ourFather");

    await page.getByRole("button", {name: "Unbookmark"}).click();

    await expect(page.getByRole("button", {name: "Bookmark", exact: true})).toBeVisible();
    await expect.poll(() => getListItems(page, "bookmarks")).toEqual(["en/gloryBe"]);

    await page.goto("/list/bookmarks");
    await expect(prayerList(page)).toHaveText(["Glory Be"]);
  });

  test("new bookmarks are added at the end", async ({page}) => {
    await seedStorage(page, {preferences: {lists: [bookmarksList(["en/ourFather"])]}});
    await page.goto("/prayer/view/en/angelus");

    await page.getByRole("button", {name: "Bookmark"}).click();

    await page.goto("/list/bookmarks");
    await expect(prayerList(page)).toHaveText(["Our Father", "Angelus"]);
  });

  test("bookmarked prayers open in their own language", async ({page}) => {
    await seedStorage(page, {preferences: {lists: [bookmarksList(["la/ourFather"])]}});
    await page.goto("/list/bookmarks");

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
    await page.goto("/list/bookmarks");

    await expect(heading(page)).toHaveText("Obľúbené");
    await expect(prayerList(page)).toHaveText(["Our Father", "Otčenáš"]);
  });

  test("bookmarks of prayers that no longer exist are skipped", async ({page}) => {
    await seedStorage(page, {preferences: {lists: [
      bookmarksList(["en/ourFather", "en/removedPrayer", "xx/unknownLanguage", "custom/custom-9"])
    ]}});
    await page.goto("/list/bookmarks");

    await expect(prayerList(page)).toHaveText(["Our Father"]);
  });

  test("bookmarks can be reordered and removed", async ({page}) => {
    await seedStorage(page, {preferences: {lists: [bookmarksList(["en/ourFather", "en/gloryBe", "en/hailMary"])]}});
    await page.goto("/list/bookmarks");

    await page.getByRole("button", {name: "Edit"}).click();
    // The bookmarks cannot be renamed or deleted
    await expect(page.getByPlaceholder("Name of the list")).toBeHidden();
    await expect(page.getByRole("button", {name: "Delete list"})).toBeHidden();

    const handles = page.getByLabel("Drag to reorder");
    await touchDrag(page, handles.nth(2), handles.nth(0));
    await page.getByRole("button", {name: "Remove from list"}).nth(1).click();

    await expect.poll(() => getListItems(page, "bookmarks")).toEqual(["en/hailMary", "en/gloryBe"]);
    await page.getByRole("button", {name: "Done"}).click();
    await expect(prayerList(page)).toHaveText(["Hail Mary", "Glory Be"]);
  });

  test.describe("from the format before lists", () => {
    test("are migrated sorted by title", async ({page}) => {
      await seedStorage(page, {preferences: {bookmarks: {
        en: {ourFather: true, angelus: true},
        la: {gloryBe: true}
      }}});
      await page.goto("/list/bookmarks");

      await expect(prayerList(page)).toHaveText(["Angelus", "Gloria Patri", "Our Father"]);
      await expect.poll(() => getListItems(page, "bookmarks"))
        .toEqual(["en/angelus", "la/gloryBe", "en/ourFather"]);
    });

    test("skip prayers that no longer exist", async ({page}) => {
      await seedStorage(page, {preferences: {bookmarks: {
        en: {ourFather: true, removedPrayer: true},
        xx: {unknownLanguage: true},
        custom: {"custom-9": true}
      }}});
      await page.goto("/list/bookmarks");

      await expect(prayerList(page)).toHaveText(["Our Father"]);
    });
  });
});
