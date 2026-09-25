import {test, expect} from "@playwright/test";
import {heading, seedStorage} from "./helpers.js";

test.describe("Language detection", () => {
  test.describe("with a supported device language", () => {
    test.use({locale: "sk-SK"});

    test("uses the device language", async ({page}) => {
      await page.goto("/");

      await expect(heading(page)).toHaveText("Modlitebná knižka");
      await expect(page.getByRole("combobox")).toHaveValue("sk");
    });

    test("a saved language takes precedence over the device language", async ({page}) => {
      await seedStorage(page, {preferences: {language: "pl"}});
      await page.goto("/");

      await expect(page.getByRole("combobox")).toHaveValue("pl");
    });
  });

  test.describe("with an unsupported device language", () => {
    test.use({locale: "de-DE"});

    test("falls back to English", async ({page}) => {
      await page.goto("/");

      await expect(heading(page)).toHaveText("Prayer Book");
      await expect(page.getByRole("combobox")).toHaveValue("en");
    });
  });

  test("an unsupported saved language is ignored", async ({page}) => {
    await seedStorage(page, {preferences: {language: "xx"}});
    await page.goto("/");

    await expect(page.getByRole("combobox")).toHaveValue("en");
  });

  test("prayer lists are shown in the selected language", async ({page}) => {
    await seedStorage(page, {preferences: {language: "sk"}});
    await page.goto("/category/basic");

    await expect(heading(page)).toHaveText("Základné");
    await expect(page.getByRole("button", {name: "Otčenáš"})).toBeVisible();
  });
});
