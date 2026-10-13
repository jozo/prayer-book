import {readFile} from "node:fs/promises";
import {test, expect} from "@playwright/test";
import {bookmarksList, getListItems, getPreference, list, seedStorage} from "./helpers.js";

function customPrayer(id, title, content) {
  return {id, title, categories: ["custom"], versions: [{name: "", content}], lang: "custom"};
}

function backup(customPrayers, lists) {
  return {app: "prayer-book", version: 1, exportedAt: "2026-10-13T12:00:00.000Z", customPrayers, lists};
}

async function importFile(page, content) {
  const text = typeof content === "string" ? content : JSON.stringify(content);
  await page.locator("input[type=file]").setInputFiles({
    name: "backup.json",
    mimeType: "application/json",
    buffer: Buffer.from(text)
  });
}

function status(page) {
  return page.getByRole("status");
}

test.describe("Backup", () => {
  test("export downloads the custom prayers and lists", async ({page}) => {
    const customPrayers = {"custom-0": customPrayer("custom-0", "Morning Offering", "O Jesus…")};
    const lists = [bookmarksList(["en/ourFather"]), list("list-a", "Evening", ["custom/custom-0", "en/hailMary"])];
    await seedStorage(page, {preferences: {customPrayers, lists}});
    await page.goto("/settings");

    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", {name: "Export"}).click();
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toMatch(/^prayer-book-backup-\d{4}-\d{2}-\d{2}\.json$/);
    const data = JSON.parse(await readFile(await download.path(), "utf8"));
    expect(data).toMatchObject({app: "prayer-book", version: 1, customPrayers, lists});
  });

  test("import adds prayers and lists to the existing ones", async ({page}) => {
    await seedStorage(page, {preferences: {
      customPrayers: {"custom-0": customPrayer("custom-0", "Mine", "My text")},
      lists: [bookmarksList(["en/ourFather"]), list("list-mine", "Mine", ["custom/custom-0"])]
    }});
    await page.goto("/settings");

    // The backup's custom-0 clashes with the existing prayer, so it gets a new ID
    await importFile(page, backup(
      {"custom-0": customPrayer("custom-0", "Imported", "Imported text")},
      [
        bookmarksList(["en/ourFather", "en/hailMary", "custom/custom-0"]),
        list("list-x", "Evening", ["custom/custom-0", "en/angelus", "custom/missing"])
      ]
    ));

    await expect(status(page)).toHaveText("Imported custom prayers: 1, lists: 1, bookmarks: 2.");
    expect(await getPreference(page, "customPrayers")).toEqual({
      "custom-0": customPrayer("custom-0", "Mine", "My text"),
      "custom-1": customPrayer("custom-1", "Imported", "Imported text")
    });
    expect(await getListItems(page, "bookmarks")).toEqual(["en/ourFather", "en/hailMary", "custom/custom-1"]);
    const lists = await getPreference(page, "lists");
    expect(lists.map(l => l.name)).toEqual([null, "Mine", "Evening"]);
    expect(await getListItems(page, lists[2].id)).toEqual(["custom/custom-1", "en/angelus"]);

    await page.goto("/lists");
    await expect(page.getByRole("button", {name: "Evening"})).toBeVisible();
    await page.goto("/category/custom");
    await expect(page.getByRole("button", {name: "Imported"})).toBeVisible();
  });

  test("importing the same backup twice does not duplicate anything", async ({page}) => {
    await page.goto("/settings");
    const data = backup(
      {"custom-5": customPrayer("custom-5", "Imported", "Imported text")},
      [bookmarksList(["custom/custom-5"]), list("list-x", "Evening", ["custom/custom-5"])]
    );

    await importFile(page, data);
    await expect(status(page)).toHaveText("Imported custom prayers: 1, lists: 1, bookmarks: 1.");
    await importFile(page, data);
    await expect(status(page)).toHaveText("Imported custom prayers: 0, lists: 0, bookmarks: 0.");

    expect(Object.keys(await getPreference(page, "customPrayers"))).toEqual(["custom-0"]);
    expect((await getPreference(page, "lists")).map(l => l.name)).toEqual([null, "Evening"]);
  });

  test("an export can be imported back", async ({page}) => {
    await seedStorage(page, {preferences: {
      customPrayers: {"custom-0": customPrayer("custom-0", "Mine", "My text")},
      lists: [bookmarksList(["custom/custom-0"]), list("list-a", "Morning", ["en/ourFather"])]
    }});
    await page.goto("/settings");
    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", {name: "Export"}).click();
    const file = await (await downloadPromise).path();

    await page.locator("input[type=file]").setInputFiles(file);

    await expect(status(page)).toHaveText("Imported custom prayers: 0, lists: 0, bookmarks: 0.");
  });

  test("a file that is not a backup changes nothing", async ({page}) => {
    const lists = [bookmarksList(["en/ourFather"])];
    await seedStorage(page, {preferences: {lists}});
    await page.goto("/settings");

    await importFile(page, "not json");
    await expect(status(page)).toHaveText("This file is not a Prayer Book backup.");

    await importFile(page, {customPrayers: {}, lists: []});
    await expect(status(page)).toHaveText("This file is not a Prayer Book backup.");

    expect(await getPreference(page, "lists")).toEqual(lists);
  });
});
