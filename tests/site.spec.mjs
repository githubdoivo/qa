import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const LANGS = [
  { lang: "en", about: "About", pdf: "ivo-lopes-cv.pdf", summary: "Summary" },
  { lang: "pt", about: "Sobre", pdf: "ivo-lopes-cv-pt.pdf", summary: "Resumo" },
];

function collectErrors(page) {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  return errors;
}

for (const { lang, about, pdf, summary } of LANGS) {
  test.describe(`${lang.toUpperCase()} version`, () => {
    test("renders every section with no errors", async ({ page }) => {
      const errors = collectErrors(page);
      await page.goto(`/?lang=${lang}`);
      await expect(page.locator("html")).toHaveAttribute("lang", lang);
      await expect(page.locator("#hero-name")).toHaveText("Ivo Lopes");
      await expect(page.locator("#about h2")).toContainText(about);
      await expect(page.locator(".job")).toHaveCount(2);
      await expect(page.locator(".project")).toHaveCount(1);
      await expect(page.locator(".skill-card")).toHaveCount(9);
      await expect(page.locator("#term-state")).toHaveClass(/pass/, { timeout: 15_000 });
      expect(errors).toEqual([]);
    });

    test("the paper view fits exactly one A4 page", async ({ page }) => {
      await page.goto(`/?lang=${lang}#cv`);
      await expect(page.locator("#paper")).toBeVisible();
      await expect(page.locator("#sheet h2").first()).toHaveText(summary);
      await page.evaluate(() => document.fonts.ready);
      const { scroll, client } = await page.locator("#sheet").evaluate((s) => ({ scroll: s.scrollHeight, client: s.clientHeight }));
      expect(scroll, "the CV runs past the bottom of the page").toBeLessThanOrEqual(client);
    });

    test("the download button serves this language's PDF", async ({ page, request }) => {
      await page.goto(`/?lang=${lang}#cv`);
      await expect(page.locator("#pdf-download")).toHaveAttribute("href", pdf);
      const res = await request.get(`/${pdf}`);
      expect(res.status()).toBe(200);
      expect((await res.body()).subarray(0, 5).toString()).toBe("%PDF-");
    });

    test("has no serious accessibility problems", async ({ page }) => {
      await page.goto(`/?lang=${lang}`);
      await expect(page.locator("#term-state")).toHaveClass(/pass/, { timeout: 15_000 });
      // The animation leaves elements mid-fade for a moment; scan the settled page.
      await page.evaluate(() => document.querySelectorAll(".reveal").forEach((el) => el.classList.add("in")));
      await page.waitForTimeout(800);
      const { violations } = await new AxeBuilder({ page }).analyze();
      const serious = violations.filter((v) => ["serious", "critical"].includes(v.impact));
      expect(serious.map((v) => `${v.id}: ${v.help}`)).toEqual([]);
    });
  });
}

test("switching language and back keeps the visitor's choice", async ({ page }) => {
  await page.goto("/?lang=en");
  await page.locator("#lang-toggle").click();
  await expect(page.locator("html")).toHaveAttribute("lang", "pt");
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", "pt");
  await page.locator("#lang-toggle").click();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
});

test("the theme toggle switches and is remembered", async ({ page }) => {
  await page.goto("/");
  const before = await page.locator("html").getAttribute("data-theme");
  await page.locator("#theme-toggle").click();
  const after = await page.locator("html").getAttribute("data-theme");
  expect(after).not.toBe(before);
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", after);
});

test("nothing scrolls sideways on a phone", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 780 });
  for (const path of ["/?lang=en", "/?lang=pt", "/writing/flaky-ci.html"]) {
    await page.goto(path);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, `${path} is wider than the screen`).toBeLessThanOrEqual(0);
  }
});

test("the preview image, security.txt and the write-up are served", async ({ request }) => {
  const og = await request.get("/og-image.png");
  expect(og.status()).toBe(200);
  const sec = await request.get("/.well-known/security.txt");
  expect(await sec.text()).toContain("Contact: mailto:mail@ivolopes.com");
  expect((await request.get("/writing/flaky-ci.html")).status()).toBe(200);
});

test("every link on the site still works", async ({ page, request }) => {
  test.slow();
  const hrefs = new Set();
  for (const path of ["/?lang=en", "/?lang=pt", "/writing/flaky-ci.html"]) {
    await page.goto(path);
    for (const href of await page.locator("a[href]").evaluateAll((as) => as.map((a) => a.href))) hrefs.add(href.split("#")[0]);
  }
  const broken = [];
  for (const href of hrefs) {
    if (!href.startsWith("http")) continue; // mailto:
    // LinkedIn answers automated requests with a 999 even when the page exists.
    if (href.includes("linkedin.com")) continue;
    const res = await request.get(href, { timeout: 30_000, maxRedirects: 5 }).catch((e) => ({ status: () => e.message }));
    // 429 is the host rate-limiting the checker, not a broken link.
    if (typeof res.status() !== "number" || (res.status() >= 400 && res.status() !== 429)) broken.push(`${href} -> ${res.status()}`);
  }
  expect(broken).toEqual([]);
});
