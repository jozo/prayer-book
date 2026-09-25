import {expect} from "@playwright/test";

// @capacitor/preferences stores values in localStorage under this prefix on the web
const PREFERENCES_PREFIX = "CapacitorStorage.";

/**
 * Seed app storage before the first page load. Values are written only once per test,
 * so a later page.reload() keeps whatever the app itself saved.
 *
 * @param {import("@playwright/test").Page} page
 * @param {{preferences?: Object<string, any>, localStorage?: Object<string, string>}} data
 */
export async function seedStorage(page, {preferences = {}, localStorage: raw = {}}) {
  const entries = {...raw};
  for (const [key, value] of Object.entries(preferences)) {
    entries[PREFERENCES_PREFIX + key] = typeof value === "string" ? value : JSON.stringify(value);
  }

  await page.addInitScript((items) => {
    if (sessionStorage.getItem("__e2eSeeded")) {
      return;
    }
    for (const [key, value] of Object.entries(items)) {
      localStorage.setItem(key, value);
    }
    sessionStorage.setItem("__e2eSeeded", "1");
  }, entries);
}

/**
 * Read a value the app saved through @capacitor/preferences. JSON values are parsed.
 *
 * @param {import("@playwright/test").Page} page
 * @param {string} key
 */
export async function getPreference(page, key) {
  const value = await page.evaluate(k => localStorage.getItem(k), PREFERENCES_PREFIX + key);
  if (value === null) {
    return null;
  }
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

export function heading(page) {
  return page.locator("h1");
}

export function menu(page) {
  return page.locator("nav");
}

export async function openMenu(page) {
  // The hamburger button is the only button outside of the navigation. The button itself has no
  // size because its icon is absolutely positioned, so click the icon.
  await page.locator("#app > button svg").click();
  await expect(menu(page)).toBeVisible();
}

export async function navigateViaMenu(page, linkName) {
  await openMenu(page);
  await menu(page).getByRole("link", {name: linkName, exact: true}).click();
  await expect(menu(page)).toBeHidden();
}

/**
 * The list of prayer titles shown on a category page, in display order.
 *
 * @param {import("@playwright/test").Page} page
 */
export function prayerList(page) {
  return page.locator("button.grow");
}

export function prayerText(page) {
  return page.locator(".prayer-text");
}
