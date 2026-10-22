import {test, expect} from "@playwright/test";
import {bookmarksList, getListItems, getPreference, heading, list, prayerList, prayerText, seedStorage} from "./helpers.js";

function customPrayer(id, title, content) {
  return {id, title, categories: ["custom"], versions: [{name: "", content}], lang: "custom"};
}

test.describe("Custom prayers", () => {
  test("the custom category is empty at first and offers to add a prayer", async ({page}) => {
    await page.goto("/category/custom");

    await expect(heading(page)).toHaveText("Custom");
    await expect(page.getByText("Prayers not found…")).toBeVisible();

    await page.getByRole("button", {name: "Add prayer"}).click();

    await expect(page).toHaveURL(/\/prayer\/add\/?$/);
    await expect(heading(page)).toHaveText("Add prayer");
  });

  test("saving is disabled until both title and text are filled in", async ({page}) => {
    await page.goto("/prayer/add/");
    const save = page.getByRole("button", {name: "Save"});

    await expect(save).toBeDisabled();

    await page.getByPlaceholder("Title").fill("My prayer");
    await expect(save).toBeDisabled();

    await page.getByPlaceholder("Text of the prayer (use Markdown for formatting)").fill("Amen.");
    await expect(save).toBeEnabled();

    await page.getByPlaceholder("Title").fill("");
    await expect(save).toBeDisabled();
  });

  test("adding a prayer saves it and lists it in the custom category", async ({page}) => {
    await page.goto("/category/custom");
    await page.getByRole("button", {name: "Add prayer"}).click();

    await page.getByPlaceholder("Title").fill("Morning Offering");
    await page.getByPlaceholder("Text of the prayer (use Markdown for formatting)")
      .fill("O Jesus, through the **Immaculate Heart** of Mary,\n\nI offer You my prayers.");
    await page.getByRole("button", {name: "Save"}).click();

    await expect(page).toHaveURL("/category/custom");
    await expect(prayerList(page)).toHaveText(["Morning Offering"]);

    await expect.poll(() => getPreference(page, "customPrayers")).toEqual({
      "custom-0": customPrayer("custom-0", "Morning Offering",
        "O Jesus, through the **Immaculate Heart** of Mary,\n\nI offer You my prayers.")
    });

    await page.reload();
    await expect(prayerList(page)).toHaveText(["Morning Offering"]);
  });

  test("a custom prayer is rendered from Markdown", async ({page}) => {
    await seedStorage(page, {preferences: {customPrayers: {
      "custom-0": customPrayer("custom-0", "Formatted", "First *line*\n\n**Second** line\n\n- one\n- two")
    }}});
    await page.goto("/category/custom");

    await page.getByRole("button", {name: "Formatted"}).click();

    await expect(page).toHaveURL("/prayer/view/custom/custom-0");
    await expect(heading(page)).toHaveText("Formatted");
    await expect(prayerText(page).locator("em")).toHaveText("line");
    await expect(prayerText(page).locator("strong")).toHaveText("Second");
    await expect(prayerText(page).locator("li")).toHaveText(["one", "two"]);
    await expect(page.getByRole("button", {name: "Edit"})).toBeVisible();
  });

  test("editing a prayer updates its title and text", async ({page}) => {
    await seedStorage(page, {preferences: {customPrayers: {
      "custom-0": customPrayer("custom-0", "Old title", "Old text")
    }}});
    await page.goto("/prayer/view/custom/custom-0");

    await page.getByRole("button", {name: "Edit"}).click();

    await expect(page).toHaveURL("/prayer/edit/custom-0");
    await expect(heading(page)).toHaveText("Edit prayer");
    const title = page.getByPlaceholder("Title");
    const text = page.getByPlaceholder("Text of the prayer (use Markdown for formatting)");
    await expect(title).toHaveValue("Old title");
    await expect(text).toHaveValue("Old text");

    await title.fill("New title");
    await text.fill("New **text**");
    await page.getByRole("button", {name: "Save"}).click();

    await expect(page).toHaveURL("/prayer/view/custom/custom-0");
    await expect(heading(page)).toHaveText("New title");
    await expect(prayerText(page).locator("strong")).toHaveText("text");
    await expect.poll(() => getPreference(page, "customPrayers"))
      .toEqual({"custom-0": customPrayer("custom-0", "New title", "New **text**")});
  });

  test("Back after saving an edit returns to the page before the prayer", async ({page}) => {
    await seedStorage(page, {preferences: {customPrayers: {
      "custom-0": customPrayer("custom-0", "Old title", "Text")
    }}});
    await page.goto("/category/custom");
    await page.getByRole("button", {name: "Old title"}).click();
    await page.getByRole("button", {name: "Edit"}).click();
    await page.getByPlaceholder("Title").fill("New title");
    await page.getByRole("button", {name: "Save"}).click();
    await expect(heading(page)).toHaveText("New title");

    await page.goBack();

    await expect(page).toHaveURL("/category/custom");
    await expect(prayerList(page)).toHaveText(["New title"]);
  });

  test("saving an edit opened directly from a URL shows the prayer", async ({page}) => {
    await seedStorage(page, {preferences: {customPrayers: {
      "custom-0": customPrayer("custom-0", "Old title", "Text")
    }}});
    await page.goto("/prayer/edit/custom-0");
    await page.getByPlaceholder("Title").fill("New title");
    await page.getByRole("button", {name: "Save"}).click();

    await expect(page).toHaveURL("/prayer/view/custom/custom-0");
    await expect(heading(page)).toHaveText("New title");
  });

  test("editing opens directly from a URL after a reload", async ({page}) => {
    await seedStorage(page, {preferences: {customPrayers: {
      "custom-0": customPrayer("custom-0", "Stored prayer", "Stored text")
    }}});
    await page.goto("/prayer/edit/custom-0");

    await expect(page.getByPlaceholder("Title")).toHaveValue("Stored prayer");
  });

  test("saving an edit is disabled when a field is emptied", async ({page}) => {
    await seedStorage(page, {preferences: {customPrayers: {
      "custom-0": customPrayer("custom-0", "Title", "Text")
    }}});
    await page.goto("/prayer/edit/custom-0");

    await page.getByPlaceholder("Text of the prayer (use Markdown for formatting)").fill("");

    await expect(page.getByRole("button", {name: "Save"})).toBeDisabled();
  });

  test("deleting a prayer asks for confirmation", async ({page}) => {
    await seedStorage(page, {preferences: {customPrayers: {
      "custom-0": customPrayer("custom-0", "Keep me", "Text")
    }}});
    await page.goto("/prayer/edit/custom-0");

    page.once("dialog", async (dialog) => {
      expect(dialog.type()).toBe("confirm");
      expect(dialog.message()).toBe("Are you sure you want to delete this prayer?");
      await dialog.dismiss();
    });
    await page.getByRole("button", {name: "Delete"}).click();

    await expect(page).toHaveURL("/prayer/edit/custom-0");
    await expect(page.getByPlaceholder("Title")).toHaveValue("Keep me");
  });

  test("deleting a prayer removes it from the bookmarks and lists", async ({page}) => {
    await seedStorage(page, {preferences: {
      customPrayers: {
        "custom-0": customPrayer("custom-0", "Delete me", "Text"),
        "custom-1": customPrayer("custom-1", "Keep me", "Text")
      },
      lists: [
        bookmarksList(["custom/custom-0"]),
        list("list-1", "Meeting", ["custom/custom-0", "en/ourFather", "custom/custom-0"])
      ]
    }});
    await page.goto("/category/custom");
    await page.getByRole("button", {name: "Delete me"}).click();
    await expect(page.getByRole("button", {name: "Unbookmark"})).toBeVisible();
    await page.getByRole("button", {name: "Edit"}).click();

    page.once("dialog", dialog => dialog.accept());
    await page.getByRole("button", {name: "Delete"}).click();

    await expect(page).toHaveURL("/category/custom");
    await expect(prayerList(page)).toHaveText(["Keep me"]);
    await expect.poll(() => getPreference(page, "customPrayers"))
      .toEqual({"custom-1": customPrayer("custom-1", "Keep me", "Text")});
    await expect.poll(() => getListItems(page, "bookmarks")).toEqual([]);
    await expect.poll(() => getListItems(page, "list-1")).toEqual(["en/ourFather"]);
  });

  test("Back after deleting a prayer does not show the deleted prayer", async ({page}) => {
    await seedStorage(page, {preferences: {customPrayers: {
      "custom-0": customPrayer("custom-0", "Delete me", "Text")
    }}});
    await page.goto("/");
    await page.goto("/prayer/view/custom/custom-0");
    await page.getByRole("button", {name: "Edit"}).click();
    page.once("dialog", dialog => dialog.accept());
    await page.getByRole("button", {name: "Delete"}).click();
    await expect(page).toHaveURL("/category/custom");

    await page.goBack();

    await expect(page).toHaveURL("/category/custom");
    await expect(heading(page)).toHaveText("Custom");
  });

  test("custom prayers can be bookmarked", async ({page}) => {
    await seedStorage(page, {preferences: {customPrayers: {
      "custom-0": customPrayer("custom-0", "My bookmark", "Text")
    }}});
    await page.goto("/prayer/view/custom/custom-0");

    await page.getByRole("button", {name: "Bookmark"}).click();
    await expect.poll(() => getListItems(page, "bookmarks")).toEqual(["custom/custom-0"]);

    await page.goto("/category/bookmarks");
    await page.getByRole("button", {name: "My bookmark"}).click();
    await expect(page).toHaveURL("/prayer/view/custom/custom-0");
  });

  test("opening a bookmarked custom prayer by URL shows it as bookmarked", async ({page}) => {
    await seedStorage(page, {preferences: {
      customPrayers: {"custom-0": customPrayer("custom-0", "Bookmarked", "Text")},
      bookmarks: {custom: {"custom-0": true}}
    }});
    await page.goto("/prayer/view/custom/custom-0");

    await expect(page.getByRole("button", {name: "Unbookmark"})).toBeVisible();
  });

  test("bookmarking a custom prayer opened by URL keeps the other bookmarks", async ({page}) => {
    await seedStorage(page, {preferences: {
      customPrayers: {"custom-0": customPrayer("custom-0", "New bookmark", "Text")},
      bookmarks: {en: {ourFather: true}}
    }});
    await page.goto("/prayer/view/custom/custom-0");

    await page.getByRole("button", {name: "Bookmark"}).click();

    await expect.poll(() => getListItems(page, "bookmarks")).toEqual(["en/ourFather", "custom/custom-0"]);
  });

  test("a prayer added after a deletion does not overwrite an existing one", async ({page}) => {
    await seedStorage(page, {preferences: {customPrayers: {
      "custom-1": customPrayer("custom-1", "Existing", "Text")
    }}});
    await page.goto("/category/custom");
    await page.getByRole("button", {name: "Add prayer"}).click();

    await page.getByPlaceholder("Title").fill("Added");
    await page.getByPlaceholder("Text of the prayer (use Markdown for formatting)").fill("New text");
    await page.getByRole("button", {name: "Save"}).click();

    await expect(prayerList(page)).toHaveText(["Added", "Existing"]);
    await expect.poll(() => getPreference(page, "customPrayers")).toEqual({
      "custom-1": customPrayer("custom-1", "Existing", "Text"),
      "custom-2": customPrayer("custom-2", "Added", "New text")
    });
  });

  test("adding a prayer from a directly opened add page keeps the existing prayers", async ({page}) => {
    await seedStorage(page, {preferences: {customPrayers: {
      "custom-0": customPrayer("custom-0", "Existing", "Text")
    }}});
    await page.goto("/prayer/add/");

    await page.getByPlaceholder("Title").fill("Added");
    await page.getByPlaceholder("Text of the prayer (use Markdown for formatting)").fill("New text");
    await page.getByRole("button", {name: "Save"}).click();

    await expect(prayerList(page)).toHaveText(["Added", "Existing"]);
    await expect.poll(() => getPreference(page, "customPrayers")).toEqual({
      "custom-0": customPrayer("custom-0", "Existing", "Text"),
      "custom-1": customPrayer("custom-1", "Added", "New text")
    });
  });

  test("custom prayers are included in \"All\" and its search", async ({page}) => {
    await seedStorage(page, {preferences: {customPrayers: {
      "custom-0": customPrayer("custom-0", "Zzz my own prayer", "Text")
    }}});
    await page.goto("/category/all");

    await expect(prayerList(page).last()).toHaveText("Zzz my own prayer");

    await page.getByPlaceholder("Search…").fill("own prayer");
    await expect(prayerList(page)).toHaveText(["Zzz my own prayer"]);

    await prayerList(page).first().click();
    await expect(page).toHaveURL("/prayer/view/custom/custom-0");
  });

  test("custom prayers saved in the legacy array format are still loaded", async ({page}) => {
    await seedStorage(page, {preferences: {customPrayers: [
      {title: "Legacy one", categories: ["custom"], versions: [{name: "", content: "First"}]},
      {title: "Legacy two", categories: ["custom"], versions: [{name: "", content: "Second"}]}
    ]}});
    await page.goto("/category/custom");

    await expect(prayerList(page)).toHaveText(["Legacy one", "Legacy two"]);

    await page.getByRole("button", {name: "Legacy two"}).click();
    await expect(page).toHaveURL("/prayer/view/custom/custom-1");
    await expect(prayerText(page)).toHaveText("Second");
  });

  test("headings, quotes and code are styled", async ({page}) => {
    const content = [
      "# Morning",
      "> Blessed are the pure in heart.",
      "Pray `Amen` at the end. More at [vatican.va](https://www.vatican.va).",
      "---",
      "```\n" + "a very long line of the block ".repeat(10) + "\n```"
    ].join("\n\n");
    await seedStorage(page, {preferences: {customPrayers: {
      "custom-0": customPrayer("custom-0", "Styled", content)
    }}});
    await page.goto("/prayer/view/custom/custom-0");
    const text = prayerText(page);

    await expect(text.locator("h1")).toHaveText("Morning");
    await expect(text.locator("h1")).toHaveCSS("font-weight", "700");
    await expect(text.locator("h1")).toHaveCSS("font-size", "20px");
    await expect(text.locator("blockquote")).toHaveCSS("border-left-width", "4px");
    await expect(text.locator("blockquote")).toHaveCSS("font-style", "italic");
    await expect(text.locator("p code")).toHaveCSS("font-family", /mono/i);
    await expect(text.locator("p code")).not.toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
    await expect(text.locator("a")).toHaveCSS("text-decoration-line", "underline");
    // The rule has the colour of the divider above the prayer's buttons
    const dividerColor = await page.locator(".border-t").evaluate(el => getComputedStyle(el).borderTopColor);
    await expect(text.locator("hr")).toHaveCSS("border-top-color", dividerColor);
    // A long code line wraps inside its block, so neither the block nor the page scrolls
    expect(await text.locator("pre").evaluate(pre => pre.scrollWidth <= pre.clientWidth)).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth))
      .toBe(true);
  });
});
