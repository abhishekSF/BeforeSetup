import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("homepage to a decision keeps the semantic comparison readable", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: /Start with a decision/ }).click();
  await page.locator('.decision-list a[href="/versus/flow-vs-apex-trigger"]').click();
  await expect(page.getByRole("table")).toBeVisible();
  await expect(page.getByRole("columnheader", { name: "Your situation" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Rule of thumb" })).toBeVisible();
});
test("atlas search, filtering and topic resources work without WebGL", async ({ page }) => {
  await page.addInitScript(() => { HTMLCanvasElement.prototype.getContext = () => null; });
  await page.goto("/");
  await page.getByRole("link", { name: /Explore the atlas/ }).click();
  const atlas = page.locator("#atlas");
  await atlas.getByRole("button", { name: "Automation" }).click();
  await expect(atlas.getByRole("button", { name: "Automation" })).toHaveAttribute("aria-pressed", "true");
  await atlas.getByLabel("Search the atlas").fill("Flow");
  await atlas.locator('.atlas-topic-list a[href="/topics/flow"]').click();
  await expect(page.getByRole("heading", { name: "The mental model" })).toBeVisible();
  const resource = page.locator('#resources a').first();
  await expect(resource).toHaveAttribute("href", /^https:\/\//);
  await expect(resource).toHaveAttribute("rel", "noopener noreferrer");
});
test("topic browser and path preserve the reading journey", async ({ page }) => {
  await page.goto("/topics");
  await page.getByLabel("Search topics").fill("zzzz");
  await expect(page.getByText("No topics match that search")).toBeVisible();
  await page.getByRole("button", { name: "Clear search" }).click();
  await page.getByRole("button", { name: "Security & Sharing" }).click();
  await expect(page.getByRole("heading", { name: "Flow", exact: true })).toHaveCount(0);
  await page.goto("/start");
  await page.locator('a[href="/start/admin"]').click();
  await page.locator('main a[href="/topics/objects-and-fields"]').click();
  await expect(page.getByRole("heading", { name: "Objects & Fields", exact: true })).toBeVisible();
});
test("keyboard command search traps focus and returns it on Escape", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Control+k");
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByLabel("Search the field guide").fill("apex");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.getByRole("button", { name: /Search/ })).toBeFocused();
});
test("reduced motion keeps atlas keyboard links usable", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/map");
  const flow = page.locator('a[href="/topics/flow"]').filter({ visible: true }).first();
  await flow.focus();
  await expect(flow).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/topics\/flow$/);
});
for (const route of ["/", "/topics", "/map", "/start/admin", "/topics/apex", "/versus/flow-vs-apex-trigger"]) {
  test(`WCAG AA and responsive overflow: ${route}`, async ({ page }) => {
    await page.goto(route);
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
    expect(results.violations).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  });
}
