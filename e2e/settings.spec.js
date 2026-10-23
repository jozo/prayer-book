import {test, expect} from "@playwright/test";
import {getPreference, heading, prayerText, seedStorage} from "./helpers.js";
import packageJson from "../package.json";

const {version} = packageJson;

function themeOption(page, name) {
  return page.getByRole("radiogroup", {name: "Theme"}).getByRole("radio", {name});
}

function languageSelect(page) {
  return page.getByRole("combobox");
}

test.describe("Settings page", () => {
  test("shows the app name and version", async ({page}) => {
    await page.goto("/settings");

    await expect(heading(page)).toHaveText("Settings");
    await expect(page.getByText(version, {exact: true})).toBeVisible();
  });

  test.describe("theme", () => {
    const html = page => page.locator("html");

    test("dark theme is applied and remembered", async ({page}) => {
      await page.goto("/settings");

      await themeOption(page, "Dark").click();

      await expect(html(page)).toHaveClass(/\bdark\b/);
      await expect(themeOption(page, "Dark")).toBeChecked();
      expect(await page.evaluate(() => localStorage.getItem("theme"))).toBe("dark");

      await page.reload();
      await expect(html(page)).toHaveClass(/\bdark\b/);
      await expect(themeOption(page, "Dark")).toBeChecked();
      await expect(themeOption(page, "Auto")).not.toBeChecked();
    });

    test("light theme is applied and remembered", async ({page}) => {
      await page.emulateMedia({colorScheme: "dark"});
      await page.goto("/settings");
      await expect(html(page)).toHaveClass(/\bdark\b/);

      await themeOption(page, "Light").click();

      await expect(html(page)).not.toHaveClass(/\bdark\b/);
      await page.reload();
      await expect(html(page)).not.toHaveClass(/\bdark\b/);
    });

    test("auto theme follows the system color scheme", async ({page}) => {
      await seedStorage(page, {localStorage: {theme: "light"}});
      await page.emulateMedia({colorScheme: "dark"});
      await page.goto("/settings");
      await expect(html(page)).not.toHaveClass(/\bdark\b/);

      await themeOption(page, "Auto").click();

      await expect(html(page)).toHaveClass(/\bdark\b/);
      expect(await page.evaluate(() => localStorage.getItem("theme"))).toBe("auto");

      await page.reload();
      await expect(html(page)).toHaveClass(/\bdark\b/);
      await expect(themeOption(page, "Auto")).toBeChecked();

      await page.emulateMedia({colorScheme: "light"});
      await page.reload();
      await expect(html(page)).not.toHaveClass(/\bdark\b/);
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

  test.describe("prayer text size", () => {
    const fontSize = locator => locator.evaluate(element => parseFloat(getComputedStyle(element).fontSize));
    const smaller = page => page.getByRole("button", {name: "Smaller prayer text"});
    const larger = page => page.getByRole("button", {name: "Larger prayer text"});
    const preview = page => page.getByRole("figure");

    test("larger text is applied to prayers and remembered", async ({page}) => {
      await page.goto("/settings");
      await expect(page.getByText("100 %")).toBeVisible();
      await expect(preview(page)).toBeHidden();

      await larger(page).click();
      await expect(preview(page)).toBeVisible();
      await expect(preview(page)).toContainText("Preview");
      await larger(page).click();

      await expect(page.getByText("130 %")).toBeVisible();
      await expect.poll(() => getPreference(page, "prayerFontScale")).toBe(1.3);

      await page.goto("/prayer/view/en/hailMary");
      expect(await fontSize(prayerText(page).first())).toBeCloseTo(16 * 1.3);
      expect(await fontSize(page.getByRole("heading", {level: 3}).first())).toBeCloseTo(24 * 1.3);

      await page.reload();
      expect(await fontSize(prayerText(page).first())).toBeCloseTo(16 * 1.3);
    });

    test("buttons are disabled at the smallest and largest size", async ({page}) => {
      await seedStorage(page, {preferences: {prayerFontScale: "2"}});
      await page.goto("/settings");

      await expect(page.getByText("200 %")).toBeVisible();
      await expect(larger(page)).toBeDisabled();

      for (let i = 0; i < 6; i++) {
        await smaller(page).click();
      }
      await expect(page.getByText("85 %")).toBeVisible();
      await expect(smaller(page)).toBeDisabled();
      await expect(larger(page)).toBeEnabled();
    });

    test("an invalid saved size falls back to the default", async ({page}) => {
      await seedStorage(page, {preferences: {prayerFontScale: "7"}});
      await page.goto("/prayer/view/en/ourFather");

      expect(await fontSize(prayerText(page))).toBeCloseTo(16);
    });
  });
});

test.describe("Changelog page", () => {
  test("opens from settings and lists releases newest first", async ({page}) => {
    await page.goto("/settings");
    await page.getByRole("link", {name: "What's new"}).click();

    await expect(heading(page)).toHaveText("What's new");
    const releases = page.getByRole("heading", {level: 2});
    await expect(releases.first()).toContainText(version);
    await expect(releases.last()).toContainText("0.0.1");
    await expect(page.getByText("Unreleased")).toHaveCount(0);
    await expect(page.getByText("Initial version")).toBeVisible();

    await page.getByRole("button", {name: "Back"}).click();
    await expect(heading(page)).toHaveText("Settings");
  });

  test("only the title is translated", async ({page}) => {
    await seedStorage(page, {preferences: {language: "sk"}});
    await page.goto("/changelog");

    await expect(heading(page)).toHaveText("Čo je nové");
    await expect(page.getByRole("heading", {name: "Added"}).first()).toBeVisible();
    await expect(page.getByText("2023-09-07")).toBeVisible();
  });
});
