import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFile } from "node:fs/promises";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

// Reads a PDF the way an applicant tracking system (ATS) does: page by page,
// as plain text lines in reading order.
async function pdfLines(file) {
  const data = new Uint8Array(await readFile(new URL(`../${file}`, import.meta.url)));
  const pdf = await getDocument({ data, useSystemFonts: false, isEvalSupported: false }).promise;
  const pages = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const { items } = await (await pdf.getPage(i)).getTextContent();
    let line = "";
    const lines = [];
    for (const it of items) {
      line += it.str;
      if (it.hasEOL) { lines.push(line.trim()); line = ""; }
    }
    if (line.trim()) lines.push(line.trim());
    pages.push(lines.filter(Boolean));
  }
  return { pages };
}

const LANGS = [
  { lang: "en", about: "About", pdf: "ivo-lopes-cv.pdf", summary: "Summary", headings: ["SUMMARY", "EXPERIENCE", "SKILLS", "CERTIFICATIONS", "EDUCATION", "LANGUAGES"] },
  { lang: "pt", about: "Sobre", pdf: "ivo-lopes-cv-pt.pdf", summary: "Resumo", headings: ["RESUMO", "EXPERIÊNCIA", "COMPETÊNCIAS", "CERTIFICAÇÕES", "FORMAÇÃO", "LÍNGUAS"] },
];

function collectErrors(page) {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  return errors;
}

for (const { lang, about, pdf, summary, headings } of LANGS) {
  test.describe(`${lang.toUpperCase()} version`, () => {
    test("renders every section with no errors", async ({ page }) => {
      const errors = collectErrors(page);
      await page.goto(`/?lang=${lang}`);
      await expect(page.locator("html")).toHaveAttribute("lang", lang);
      await expect(page.locator("#hero-name")).toHaveText("Ivo Lopes");
      await expect(page.locator("#about h2")).toContainText(about);
      await expect(page.locator(".job")).toHaveCount(2);
      await expect(page.locator(".project")).toHaveCount(1);
      await expect(page.locator("#skills-grid .skill-card")).toHaveCount(10);
      await expect(page.locator("#edu-grid .skill-card")).toHaveCount(3);
      await expect(page.locator("#term-state")).toHaveClass(/pass/, { timeout: 15_000 });
      expect(errors).toEqual([]);
    });

    test("the paper view fits on two A4 pages", async ({ page }) => {
      await page.goto(`/?lang=${lang}#cv`);
      await expect(page.locator("#paper")).toBeVisible();
      await expect(page.locator("#sheet h2").first()).toHaveText(summary);
      await page.evaluate(() => document.fonts.ready);
      await expect(page.locator("#sheet")).toHaveAttribute("data-fitted", /\d/);
      await expect(page.locator(".sheet")).toHaveCount(2);
      const size = parseFloat(await page.locator("#sheet").getAttribute("data-fitted"));
      for (const p of await page.locator(".sheet").all()) {
        const { scroll, client } = await p.evaluate((s) => ({ scroll: s.scrollHeight, client: s.clientHeight }));
        expect(scroll, "a page runs past the bottom even at the smallest text size").toBeLessThanOrEqual(client);
      }
      // Shrinking to fit is a safety net, not a licence to keep adding text.
      expect(size, "the text had to shrink to its minimum to fit - time to trim the CV").toBeGreaterThan(8);
    });

    test("the download button serves this language's PDF", async ({ page, request }) => {
      await page.goto(`/?lang=${lang}#cv`);
      await expect(page.locator("#pdf-download")).toHaveAttribute("href", pdf);
      const res = await request.get(`/${pdf}`);
      expect(res.status()).toBe(200);
      expect((await res.body()).subarray(0, 5).toString()).toBe("%PDF-");
    });

    test("the PDF reads cleanly for an applicant tracking system (ATS)", async () => {
      const { pages } = await pdfLines(pdf);
      expect(pages, "the CV should be two pages").toHaveLength(2);
      const lines = pages.flat();
      const text = lines.join("\n");
      // Name, title and contact come first, as real text.
      expect(lines[0]).toBe("Ivo Lopes");
      expect(lines[1]).toBe("Senior QA Engineer");
      expect(lines[2]).toContain("mail@ivolopes.com");
      expect(lines[2]).toContain("linkedin.com/in/ivolopesilva");
      // Standard section names, each on its own line, never letter-spaced ("S U M M A R Y").
      for (const h of headings) expect(lines, `missing heading ${h}`).toContain(h);
      expect(text).not.toMatch(/\b(?:[A-ZÀ-Ý] ){4,}[A-ZÀ-Ý]\b/);
      // Reading order: summary, then the current job, then the earlier one.
      const at = (s) => text.indexOf(s);
      expect(at(headings[0])).toBeLessThan(at("Euronext Securities"));
      expect(at("Euronext Securities")).toBeLessThan(at("Deloitte"));
      // Keywords recruiters search for survive extraction intact.
      for (const k of ["Playwright", "Cucumber", "Rest Assured", "Kafka", "PostgreSQL", "Jenkins", "SonarQube", "ISTQB", "Coralogix", "Jira", "Xray"]) expect(text, `keyword ${k}`).toContain(k);
      // No phone number on the public CV.
      expect(text).not.toMatch(/\+351|910 ?844/);
    });

    test("the PDF embeds real text fonts, not Type3 drawings", async () => {
      const raw = (await readFile(new URL(`../${pdf}`, import.meta.url))).toString("latin1");
      expect(raw, "Type3 fonts carry no text map; some ATS parsers cannot read them").not.toContain("/Type3");
      expect(raw).toContain("/ToUnicode");
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
