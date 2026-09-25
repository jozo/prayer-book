import {test, expect} from "@playwright/test";
import {heading, prayerList} from "./helpers.js";

test.describe("Category page", () => {
  test("lists the prayers of a category sorted by title", async ({page}) => {
    await page.goto("/category/rosary");

    await expect(heading(page)).toHaveText("Rosary");
    await expect(prayerList(page)).toHaveText([
      "Fatima Prayer", "Glorious Mysteries", "Joyful Mysteries", "Luminous Mysteries", "Sorrowful Mysteries"
    ]);
  });

  test("a prayer can belong to several categories", async ({page}) => {
    await page.goto("/category/saints");
    await expect(prayerList(page).filter({hasText: "Prayer to St. Michael the Archangel"})).toHaveCount(1);

    await page.goto("/category/basic");
    await expect(prayerList(page).filter({hasText: "Prayer to St. Michael the Archangel"})).toHaveCount(1);
  });

  test("every built-in category has prayers", async ({page}) => {
    for (const category of ["basic", "rosary", "litany", "saints", "other"]) {
      await page.goto(`/category/${category}`);
      await expect(prayerList(page).first()).toBeVisible();
    }
  });

  test("\"All\" lists prayers from every category once", async ({page}) => {
    await page.goto("/category/all");

    await expect(heading(page)).toHaveText("All");
    for (const title of ["Our Father", "Joyful Mysteries", "Litany of Humility", "Memorare to St. Joseph",
      "Prayer Before Meals"]) {
      await expect(prayerList(page).filter({hasText: title})).toHaveCount(1);
    }
    // Belongs to "basic" and "other" but is listed only once
    await expect(prayerList(page).filter({hasText: "Prayer Before Meals"})).toHaveCount(1);

    const titles = await prayerList(page).allTextContents();
    const sorted = [...titles].sort((a, b) => a.localeCompare(b, "en"));
    expect(titles).toEqual(sorted);
  });

  test("clicking a prayer opens it", async ({page}) => {
    await page.goto("/category/basic");

    await page.getByRole("button", {name: "Our Father", exact: true}).click();

    await expect(page).toHaveURL("/prayer/view/en/ourFather");
    await expect(heading(page)).toHaveText("Our Father");
  });

  test.describe("search", () => {
    test("filters prayers by title, ignoring case", async ({page}) => {
      await page.goto("/category/all");

      await page.getByPlaceholder("Search…").fill("MYSTERIES");

      await expect(prayerList(page)).toHaveText([
        "Glorious Mysteries", "Joyful Mysteries", "Luminous Mysteries", "Sorrowful Mysteries"
      ]);
    });

    test("searches only inside the current category", async ({page}) => {
      await page.goto("/category/litany");

      await page.getByPlaceholder("Search…").fill("joseph");

      await expect(prayerList(page)).toHaveText(["Litany to St. Joseph"]);
    });

    test("ignores diacritics", async ({page}) => {
      await page.goto("/");
      await page.getByRole("combobox").selectOption("sk");
      await page.goto("/category/basic");

      await page.getByPlaceholder("Hľadať…").fill("otcenas");

      await expect(prayerList(page)).toHaveText(["Otčenáš"]);
    });

    test("shows a message when nothing matches", async ({page}) => {
      await page.goto("/category/basic");

      await page.getByPlaceholder("Search…").fill("no such prayer");

      await expect(prayerList(page)).toHaveCount(0);
      await expect(page.getByText("Prayers not found…")).toBeVisible();
    });

    test("clearing the search shows all prayers again", async ({page}) => {
      await page.goto("/category/rosary");
      const search = page.getByPlaceholder("Search…");

      await search.fill("fatima");
      await expect(prayerList(page)).toHaveCount(1);

      await search.fill("");
      await expect(prayerList(page)).toHaveCount(5);
    });
  });
});
