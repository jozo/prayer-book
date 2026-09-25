import {test, expect} from "@playwright/test";
import {getPreference, heading, seedStorage} from "./helpers.js";
import packageJson from "../package.json";

const {version} = packageJson;

function themeSelect(page) {
  return page.getByRole("combobox").first();
}

function languageSelect(page) {
  return page.getByRole("combobox").nth(1);
}

test.describe("Settings page", () => {
  test("shows app info and links", async ({page}) => {
    await page.goto("/settings");

    await expect(heading(page)).toHaveText("Settings");
    await expect(page.getByText(version, {exact: true})).toBeVisible();
    await expect(page.getByText("hi@jozo.io")).toBeVisible();
    await expect(page.getByRole("link", {name: "codeberg.org/jozo/prayer-book"}))
      .toHaveAttribute("href", "https://codeberg.org/jozo/prayer-book");
    await expect(page.getByRole("link", {name: "#prayer-book:matrix.org"}))
      .toHaveAttribute("href", "https://matrix.to/#/#prayer-book:matrix.org");
  });

  test.describe("theme", () => {
    const html = page => page.locator("html");

    test("dark theme is applied and remembered", async ({page}) => {
      await page.goto("/settings");

      await themeSelect(page).selectOption("dark");

      await expect(html(page)).toHaveClass(/\bdark\b/);
      expect(await page.evaluate(() => localStorage.getItem("theme"))).toBe("dark");

      await page.reload();
      await expect(html(page)).toHaveClass(/\bdark\b/);
    });

    test("light theme is applied and remembered", async ({page}) => {
      await page.emulateMedia({colorScheme: "dark"});
      await page.goto("/settings");
      await expect(html(page)).toHaveClass(/\bdark\b/);

      await themeSelect(page).selectOption("light");

      await expect(html(page)).not.toHaveClass(/\bdark\b/);
      await page.reload();
      await expect(html(page)).not.toHaveClass(/\bdark\b/);
    });

    test("auto theme follows the system color scheme", async ({page}) => {
      await seedStorage(page, {localStorage: {theme: "light"}});
      await page.emulateMedia({colorScheme: "dark"});
      await page.goto("/settings");
      await expect(html(page)).not.toHaveClass(/\bdark\b/);

      await themeSelect(page).selectOption("auto");

      await expect(html(page)).toHaveClass(/\bdark\b/);
      expect(await page.evaluate(() => localStorage.getItem("theme"))).toBe("auto");
    });

    test("without a saved theme the system color scheme is used", async ({page}) => {
      await page.emulateMedia({colorScheme: "dark"});
      await page.goto("/");
      await expect(html(page)).toHaveClass(/\bdark\b/);

      await page.emulateMedia({colorScheme: "light"});
      await page.reload();
      await expect(html(page)).not.toHaveClass(/\bdark\b/);
    });
  });

  test("changing the language translates the UI and is remembered", async ({page}) => {
    await page.goto("/settings");
    await expect(languageSelect(page)).toHaveValue("en");

    await languageSelect(page).selectOption("es");

    await expect(heading(page)).toHaveText("Ajustes");
    await expect.poll(() => getPreference(page, "language")).toBe("es");

    await page.goto("/category/basic");
    await expect(heading(page)).toHaveText("Básico");
    await expect(page.getByRole("button", {name: "Padre Nuestro"})).toBeVisible();
  });
});
