import {test, expect} from "@playwright/test";
import {heading} from "./helpers.js";

test.describe("Feedback page", () => {
  test("links to the Votu board, email and Matrix", async ({page}) => {
    await page.goto("/feedback");

    await expect(heading(page)).toHaveText("Feedback & Ideas");
    await expect(page.getByRole("link", {name: "Open Votu"}))
      .toHaveAttribute("href", "https://votu.dev/b/prayer-book/");
    await expect(page.getByRole("link", {name: "hi@jozo.io"}))
      .toHaveAttribute("href", "mailto:hi@jozo.io");
    await expect(page.getByRole("link", {name: "#prayer-book:matrix.org"}))
      .toHaveAttribute("href", "https://matrix.to/#/#prayer-book:matrix.org");
  });
});
