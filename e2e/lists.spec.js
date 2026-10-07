import {test, expect} from "@playwright/test";
import {bookmarksList, getListItems, getPreference, heading, list, prayerList, seedStorage, touchDrag} from "./helpers.js";

function customPrayer(id, title, content) {
  return {id, title, categories: ["custom"], versions: [{name: "", content}], lang: "custom"};
}

// The rows of the prayer picker; their accessible names include the count and check mark
function pickerRow(page, title) {
  return page.locator("button").filter({has: page.locator("span.grow", {hasText: new RegExp(`^${title}$`)})});
}

test.describe("Lists", () => {
  test("shows a message when there are no lists", async ({page}) => {
    await page.goto("/lists");

    await expect(heading(page)).toHaveText("Lists");
    await expect(page.getByText("You have no lists yet…")).toBeVisible();
    await expect(page.getByRole("button", {name: "New list"})).toBeDisabled();
  });

  test("the bookmarks are not shown among the lists", async ({page}) => {
    await seedStorage(page, {preferences: {lists: [bookmarksList(["en/ourFather"]), list("list-1", "Meeting")]}});
    await page.goto("/lists");

    await expect(page.getByRole("button", {name: "Bookmarks"})).toBeHidden();
    await expect(page.getByRole("button", {name: "Meeting"})).toBeVisible();
  });

  test("a new list opens in edit mode and prayers can be added to it", async ({page}) => {
    await seedStorage(page, {preferences: {customPrayers: {
      "custom-0": customPrayer("custom-0", "Morning Offering", "Text")
    }}});
    await page.goto("/lists");

    await page.getByPlaceholder("Name of the list").fill("  Thursday group ");
    await page.getByRole("button", {name: "New list"}).click();

    await expect(page).toHaveURL(/\/list\/list-[a-z0-9]+$/);
    await expect(heading(page)).toHaveText("Thursday group");
    await expect(page.getByText("This list is empty…")).toBeVisible();

    await page.getByRole("button", {name: "Add prayers"}).click();
    await expect(heading(page)).toHaveText("Add prayers");
    await pickerRow(page, "Our Father").click();
    await pickerRow(page, "Morning Offering").click();
    // A prayer can be added more than once
    await pickerRow(page, "Glory Be").click();
    await pickerRow(page, "Glory Be").click();
    await expect(pickerRow(page, "Glory Be")).toContainText("2×");
    await page.getByRole("button", {name: "Done"}).click();

    // Back on the list, still in edit mode
    await expect(page.getByRole("button", {name: "Add prayers"})).toBeVisible();
    await page.getByRole("button", {name: "Done"}).click();
    await expect(prayerList(page)).toHaveText(["Our Father", "Morning Offering", "Glory Be", "Glory Be"]);

    const lists = await getPreference(page, "lists");
    expect(lists.map(l => l.name)).toEqual([null, "Thursday group"]);
    await expect.poll(() => getListItems(page, lists[1].id))
      .toEqual(["en/ourFather", "custom/custom-0", "en/gloryBe", "en/gloryBe"]);

    await page.reload();
    await expect(prayerList(page)).toHaveText(["Our Father", "Morning Offering", "Glory Be", "Glory Be"]);
  });

  test("searching the picker ignores diacritics", async ({page}) => {
    await seedStorage(page, {preferences: {lists: [bookmarksList(), list("list-1", "Meeting")]}});
    await page.goto("/list/list-1/add");

    await page.getByPlaceholder("Search…").fill("glory");

    await expect(page.locator("span.grow")).toHaveText(["Glory Be"]);
  });

  test("adding to the bookmarks from the picker toggles the bookmark", async ({page}) => {
    await seedStorage(page, {preferences: {lists: [bookmarksList(["en/ourFather"])]}});
    await page.goto("/list/bookmarks/add");

    await pickerRow(page, "Glory Be").click();
    await pickerRow(page, "Our Father").click();

    await expect.poll(() => getListItems(page, "bookmarks")).toEqual(["en/gloryBe"]);
  });

  test("a list keeps prayers of other languages", async ({page}) => {
    await seedStorage(page, {preferences: {lists: [bookmarksList(), list("list-1", "Meeting", ["la/ourFather", "en/ourFather"])]}});
    await page.goto("/list/list-1");

    await expect(prayerList(page)).toHaveText(["Pater Noster", "Our Father"]);
    await page.getByRole("button", {name: "Pater Noster"}).click();
    await expect(page).toHaveURL("/prayer/view/la/ourFather");
  });

  test("prayers can be reordered and removed", async ({page}) => {
    await seedStorage(page, {preferences: {lists: [
      bookmarksList(),
      list("list-1", "Meeting", ["en/ourFather", "en/removedPrayer", "en/hailMary", "en/gloryBe"])
    ]}});
    await page.goto("/list/list-1");
    await page.getByRole("button", {name: "Edit"}).click();

    const handles = page.getByLabel("Drag to reorder");
    await touchDrag(page, handles.nth(0), handles.nth(2));
    await expect.poll(() => getListItems(page, "list-1"))
      .toEqual(["en/removedPrayer", "en/hailMary", "en/gloryBe", "en/ourFather"]);

    await page.getByRole("button", {name: "Remove from list"}).nth(0).click();
    await page.getByRole("button", {name: "Done"}).click();

    await expect(prayerList(page)).toHaveText(["Glory Be", "Our Father"]);
    // The missing prayer is kept, it may come back with an app update
    await expect.poll(() => getListItems(page, "list-1")).toEqual(["en/removedPrayer", "en/gloryBe", "en/ourFather"]);
  });

  test("a list can be renamed", async ({page}) => {
    await seedStorage(page, {preferences: {lists: [bookmarksList(), list("list-1", "Meeting")]}});
    await page.goto("/list/list-1");
    await page.getByRole("button", {name: "Edit"}).click();

    await page.getByPlaceholder("Name of the list").fill("Evening prayer");
    await page.getByPlaceholder("Name of the list").press("Enter");

    await expect(heading(page)).toHaveText("Evening prayer");
    await expect.poll(async () => (await getPreference(page, "lists"))[1].name).toBe("Evening prayer");
  });

  test("a list cannot be renamed to an empty name", async ({page}) => {
    await seedStorage(page, {preferences: {lists: [bookmarksList(), list("list-1", "Meeting")]}});
    await page.goto("/list/list-1");
    await page.getByRole("button", {name: "Edit"}).click();

    await page.getByPlaceholder("Name of the list").fill("  ");
    await page.getByPlaceholder("Name of the list").press("Enter");

    await expect(page.getByPlaceholder("Name of the list")).toHaveValue("Meeting");
    await expect(heading(page)).toHaveText("Meeting");
  });

  test("deleting a list asks for confirmation", async ({page}) => {
    await seedStorage(page, {preferences: {lists: [bookmarksList(), list("list-1", "Meeting"), list("list-2", "Other")]}});
    await page.goto("/list/list-1");
    await page.getByRole("button", {name: "Edit"}).click();

    page.once("dialog", dialog => dialog.dismiss());
    await page.getByRole("button", {name: "Delete list"}).click();
    await expect(heading(page)).toHaveText("Meeting");

    page.once("dialog", dialog => dialog.accept());
    await page.getByRole("button", {name: "Delete list"}).click();

    await expect(page).toHaveURL("/lists");
    await expect(page.getByRole("button", {name: "Meeting"})).toBeHidden();
    await expect.poll(async () => (await getPreference(page, "lists")).map(l => l.id))
      .toEqual(["bookmarks", "list-2"]);
  });

  test("an unknown list redirects to the lists", async ({page}) => {
    await page.goto("/list/list-404");

    await expect(page).toHaveURL("/lists");
  });
});
