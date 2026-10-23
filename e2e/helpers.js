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

/**
 * A list for the "lists" preference. Items are written as "lang/prayerId".
 *
 * @param {string} id
 * @param {string|null} name
 * @param {string[]} items
 */
export function list(id, name, items = []) {
  return {
    id,
    name,
    items: items.map((item, index) => {
      const [lang, prayerId] = item.split("/");
      return {id: `item-${id}-${index}`, lang, prayerId};
    })
  };
}

export function bookmarksList(items = []) {
  return list("bookmarks", null, items);
}

/**
 * The items of a saved list as "lang/prayerId", in order, or null when there is no such list.
 *
 * @param {import("@playwright/test").Page} page
 * @param {string} listId
 */
export async function getListItems(page, listId) {
  const lists = await getPreference(page, "lists");
  const found = lists?.find(l => l.id === listId);
  return found ? found.items.map(item => `${item.lang}/${item.prayerId}`) : null;
}

export function heading(page) {
  return page.locator("h1");
}

export function menu(page) {
  return page.locator("nav");
}

export async function openMenu(page) {
  // Only top-level pages have the hamburger button, the others have a back button in its place.
  // The button itself has no size because its icon is absolutely positioned, so click the icon.
  await page.locator("#app > button[aria-label='Open menu'] svg").click();
  await expect(menu(page)).toBeVisible();
}

export function backButton(page) {
  return page.locator("#app > button[aria-label='Back']");
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

// Insets of a phone with a status bar and a gesture bar, and of the same phone turned to landscape
// where the camera cutout and the gesture area end up on the sides
export const PORTRAIT_INSETS = {top: 48, right: 0, bottom: 34, left: 0};
export const LANDSCAPE_INSETS = {top: 0, right: 48, bottom: 24, left: 48};

/**
 * Make env(safe-area-inset-*) return the given values, as on an edge-to-edge Android phone.
 * Device descriptors do not include insets, so this uses the Chromium DevTools protocol.
 *
 * @param {import("@playwright/test").Page} page
 * @param {{top: number, right: number, bottom: number, left: number}} insets
 */
export async function emulateSafeArea(page, insets) {
  const session = await page.context().newCDPSession(page);
  await session.send("Emulation.setSafeAreaInsetsOverride", {insets});
}

/**
 * Scroll the page, or the given scrollable element, to its start or its end.
 *
 * @param {import("@playwright/test").Page} page
 * @param {"start"|"end"} position
 * @param {string} [selector]
 */
export async function scrollTo(page, position, selector) {
  await page.evaluate(([pos, sel]) => {
    const element = sel ? document.querySelector(sel) : document.scrollingElement;
    element.scrollTop = pos === "start" ? 0 : element.scrollHeight;
  }, [position, selector]);
}

/**
 * Describe visible content under `root` that reaches into the safe-area insets on the given edges.
 * Returns an empty array when everything is inside the safe area.
 *
 * @param {import("@playwright/test").Page} page
 * @param {{top: number, right: number, bottom: number, left: number}} insets
 * @param {{root?: string, edges: Array<"top"|"right"|"bottom"|"left">}} options
 */
export async function safeAreaViolations(page, insets, {root = "#app", edges}) {
  return page.evaluate(([ins, sel, checkedEdges]) => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const content = "h1, h2, h3, p, li, a, button, input, textarea, select, svg";
    const violations = [];
    for (const element of document.querySelector(sel).querySelectorAll(content)) {
      const rect = element.getBoundingClientRect();
      const hidden = getComputedStyle(element).visibility === "hidden";
      // Skip hidden elements and those scrolled completely out of view
      if (hidden || !rect.width || !rect.height || rect.bottom <= 0 || rect.top >= height) {
        continue;
      }
      const overlap = {
        top: ins.top - rect.top,
        right: rect.right - (width - ins.right),
        bottom: rect.bottom - (height - ins.bottom),
        left: ins.left - rect.left
      };
      for (const edge of checkedEdges) {
        // Allow a fraction of a pixel for rounding
        if (overlap[edge] > 0.5) {
          const label = (element.textContent || element.placeholder || "").trim().slice(0, 30);
          violations.push(`<${element.tagName.toLowerCase()}> "${label}" reaches ${Math.round(overlap[edge])}px into the ${edge} inset`);
        }
      }
    }
    return [...new Set(violations)];
  }, [insets, root, edges]);
}

/**
 * Drag one element onto another with a finger, as on a phone. Playwright's dragTo() uses the mouse,
 * which a touch device does not have, so this sends touch events through the DevTools protocol.
 *
 * @param {import("@playwright/test").Page} page
 * @param {import("@playwright/test").Locator} source
 * @param {import("@playwright/test").Locator} target
 */
export async function touchDrag(page, source, target) {
  const from = await source.boundingBox();
  const to = await target.boundingBox();
  const start = {x: from.x + from.width / 2, y: from.y + from.height / 2};
  const end = {x: to.x + to.width / 2, y: to.y + to.height / 2};
  const session = await page.context().newCDPSession(page);
  const touch = (type, point) => session.send("Input.dispatchTouchEvent", {
    type,
    touchPoints: point ? [{x: point.x, y: point.y}] : []
  });

  await touch("touchStart", start);
  const steps = 10;
  for (let i = 1; i <= steps; i++) {
    await touch("touchMove", {x: start.x + (end.x - start.x) * i / steps, y: start.y + (end.y - start.y) * i / steps});
    await page.waitForTimeout(20);
  }
  await touch("touchEnd");
  await session.detach();
}

/**
 * Recent prayers for the "recentPrayers" preference, the most recent first. Written as "lang/prayerId".
 *
 * @param {string[]} items
 */
export function recentPrayers(items) {
  return items.map((item) => {
    const [lang, prayerId] = item.split("/");
    return {lang, prayerId};
  });
}

export function recentPrayerLinks(page) {
  return page.getByRole("region", {name: "Recent"}).getByRole("link");
}
