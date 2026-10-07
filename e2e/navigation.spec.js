import {test, expect} from "@playwright/test";
import {heading, menu, navigateViaMenu, openMenu} from "./helpers.js";

test.describe("Navigation menu", () => {
  test("is hidden until the hamburger button is clicked", async ({page}) => {
    await page.goto("/");

    await expect(menu(page)).toBeHidden();
    await openMenu(page);

    for (const name of ["Prayer Book", "Basic", "Rosary", "Litany", "Saints", "Others", "Custom", "Bookmarks", "Lists",
      "Settings", "Suggestions for improvement"]) {
      await expect(menu(page).getByRole("link", {name, exact: true})).toBeVisible();
    }
  });

  test("closes with the hamburger button inside the menu", async ({page}) => {
    await page.goto("/");
    await openMenu(page);

    await menu(page).getByRole("button").click();

    await expect(menu(page)).toBeHidden();
  });

  test("closes when clicking outside of it", async ({page}) => {
    await page.goto("/");
    await openMenu(page);

    // The empty area to the right of the menu panel
    const viewport = page.viewportSize();
    await page.mouse.click(viewport.width - 10, viewport.height / 2);

    await expect(menu(page)).toBeHidden();
  });

  const destinations = [
    {link: "Basic", url: "/category/basic", title: "Basic"},
    {link: "Rosary", url: "/category/rosary", title: "Rosary"},
    {link: "Litany", url: "/category/litany", title: "Litany"},
    {link: "Saints", url: "/category/saints", title: "Saints"},
    {link: "Others", url: "/category/other", title: "Others"},
    {link: "Custom", url: "/category/custom", title: "Custom"},
    {link: "Bookmarks", url: "/list/bookmarks", title: "Bookmarks"},
    {link: "Lists", url: "/lists", title: "Lists"},
    {link: "Settings", url: "/settings", title: "Settings"}
  ];

  for (const {link, url, title} of destinations) {
    test(`"${link}" opens ${url}`, async ({page}) => {
      await page.goto("/");

      await navigateViaMenu(page, link);

      await expect(page).toHaveURL(url);
      await expect(heading(page)).toHaveText(title);
    });
  }

  test("the app title link returns to the home page", async ({page}) => {
    await page.goto("/settings");

    await navigateViaMenu(page, "Prayer Book");

    await expect(page).toHaveURL("/");
    await expect(page.getByRole("combobox")).toBeVisible();
  });

  test("suggestions link opens an email to the author", async ({page}) => {
    await page.goto("/");
    await openMenu(page);

    await expect(menu(page).getByRole("link", {name: "Suggestions for improvement"}))
      .toHaveAttribute("href", "mailto:hi@jozo.io");
  });

  test("page scrolling is locked while the menu is open", async ({page}) => {
    await page.goto("/");

    await openMenu(page);
    await expect(page.locator("body")).toHaveCSS("overflow", "hidden");

    await menu(page).getByRole("button").click();
    await expect(page.locator("body")).toHaveCSS("overflow", "auto");
  });
});
