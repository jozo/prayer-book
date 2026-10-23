import {test, expect} from "@playwright/test";
import {getPreference, heading, prayerText, recentPrayerLinks, recentPrayers, seedStorage} from "./helpers.js";

function customPrayer(id, title, content) {
  return {id, title, categories: ["custom"], versions: [{name: "", content}], lang: "custom"};
}

test.describe("Recent prayers", () => {
  test("the home page shows no recent prayers at first", async ({page}) => {
    await page.goto("/");

    await expect(heading(page)).toHaveText("Prayer Book");
    await expect(page.getByRole("region", {name: "Recent"})).toHaveCount(0);
  });

  test("opened prayers are shown on the home page, the most recent first", async ({page}) => {
    for (const prayerId of ["ourFather", "hailMary", "angelus"]) {
      await page.goto(`/prayer/view/en/${prayerId}`);
      await expect(prayerText(page).first()).toBeVisible();
    }
    await page.goto("/");

    await expect(recentPrayerLinks(page)).toHaveText(["Angelus", "Hail Mary", "Our Father"]);
    await expect.poll(() => getPreference(page, "recentPrayers"))
      .toEqual(recentPrayers(["en/angelus", "en/hailMary", "en/ourFather"]));
  });

  test("long titles take at most three rows on a narrow phone", async ({page}) => {
    await page.setViewportSize({width: 320, height: 640});
    await seedStorage(page, {preferences: {recentPrayers: recentPrayers([
      "en/litanyMostPreciousBloodOurLordJesusChrist", "en/litanySacredHeartJesus", "en/litanyImmaculateHeartMary",
      "en/litanyOurLadySevenSorrows", "en/litanyMostBlessedSacrament"
    ])}});
    await page.goto("/");
    await expect(recentPrayerLinks(page)).toHaveCount(5);

    const tops = await recentPrayerLinks(page).evaluateAll(links => links.map(link => link.getBoundingClientRect().top));
    expect(new Set(tops).size).toBe(3);
  });

  test("tapping a recent prayer opens it", async ({page}) => {
    await seedStorage(page, {preferences: {recentPrayers: recentPrayers(["en/hailMary", "en/ourFather"])}});
    await page.goto("/");

    await recentPrayerLinks(page).filter({hasText: "Our Father"}).click();

    await expect(page).toHaveURL("/prayer/view/en/ourFather");
    await expect(heading(page)).toHaveText("Our Father");
  });

  test("opening a recent prayer again moves it to the front", async ({page}) => {
    await seedStorage(page, {preferences: {recentPrayers: recentPrayers(["en/angelus", "en/hailMary", "en/ourFather"])}});
    await page.goto("/");

    await recentPrayerLinks(page).filter({hasText: "Our Father"}).click();
    await expect(heading(page)).toHaveText("Our Father");
    await page.goBack();

    await expect(recentPrayerLinks(page)).toHaveText(["Our Father", "Angelus", "Hail Mary"]);
  });

  test("only the five most recent prayers are kept", async ({page}) => {
    await seedStorage(page, {preferences: {recentPrayers: recentPrayers([
      "en/angelus", "en/hailMary", "en/ourFather", "en/gloryBe", "en/apostlesCreed"
    ])}});
    await page.goto("/prayer/view/en/memorare");
    await expect(heading(page)).toHaveText("Memorare");
    await page.goto("/");

    await expect(recentPrayerLinks(page)).toHaveText(["Memorare", "Angelus", "Hail Mary", "Our Father", "Glory Be"]);
  });

  test("switching the translation updates the prayer instead of adding it again", async ({page}) => {
    await page.goto("/prayer/view/en/ourFather");
    await page.getByRole("button", {name: /^Translations:/}).click();
    await page.getByRole("dialog", {name: "Translations"}).getByRole("button", {name: /^Latin/}).click();
    await expect(heading(page)).toHaveText("Pater Noster");
    await page.goto("/");

    // Prayers in another language than the app's are marked with the language code
    await expect(recentPrayerLinks(page)).toHaveCount(1);
    await expect(recentPrayerLinks(page).locator("span")).toHaveText(["Pater Noster", "la"]);
    await expect.poll(() => getPreference(page, "recentPrayers")).toEqual(recentPrayers(["la/ourFather"]));
  });

  test("prayers that no longer exist are not shown", async ({page}) => {
    await seedStorage(page, {preferences: {recentPrayers: recentPrayers(["en/removedPrayer", "custom/custom-9", "en/angelus"])}});
    await page.goto("/");

    await expect(recentPrayerLinks(page)).toHaveText(["Angelus"]);
  });

  test("deleting a custom prayer removes it from the recent prayers", async ({page}) => {
    await seedStorage(page, {preferences: {
      customPrayers: {"custom-0": customPrayer("custom-0", "Delete me", "Text")},
      recentPrayers: recentPrayers(["en/angelus"])
    }});
    await page.goto("/prayer/view/custom/custom-0");
    await page.getByRole("button", {name: "Edit"}).click();
    page.once("dialog", dialog => dialog.accept());
    await page.getByRole("button", {name: "Delete"}).click();
    await expect(page).toHaveURL("/category/custom");

    await expect.poll(() => getPreference(page, "recentPrayers")).toEqual(recentPrayers(["en/angelus"]));
  });

  test("the recent prayers can be cleared in the settings", async ({page}) => {
    await seedStorage(page, {preferences: {recentPrayers: recentPrayers(["en/angelus"])}});
    await page.goto("/settings");

    await page.getByRole("button", {name: "Clear recent prayers"}).click();

    await expect(page.getByText("Recent prayers were cleared.")).toBeVisible();
    await expect(page.getByRole("button", {name: "Clear recent prayers"})).toBeDisabled();
    await expect.poll(() => getPreference(page, "recentPrayers")).toEqual([]);
    await page.goto("/");
    await expect(page.getByRole("region", {name: "Recent"})).toHaveCount(0);
  });
});
