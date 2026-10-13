// Builds the generated files the site serves, from the site itself:
//   ivo-lopes-cv.pdf, ivo-lopes-cv-pt.pdf - the paper view in each language,
//     through Chrome's print engine, so the text stays selectable for ATS
//     tools and the links stay clickable
//   og-image.png - the link preview image (tools/og-card.html, 1200x630)
//
//   npm install && npm run build
//
// GitHub Actions runs this on every push to main (.github/workflows/build.yml),
// so the PDFs can never drift from data.js / data.pt.js.
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join } from "node:path";
import { chromium } from "playwright";

const root = new URL(".", import.meta.url).pathname;
const types = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".png": "image/png" };
const server = createServer(async (req, res) => {
  const path = join(root, decodeURIComponent(new URL(req.url, "http://x").pathname).replace(/\/$/, "/index.html"));
  try {
    res.writeHead(200, { "Content-Type": types[extname(path)] || "application/octet-stream" });
    res.end(await readFile(path));
  } catch {
    res.writeHead(404).end();
  }
}).listen(0);
const base = `http://localhost:${server.address().port}`;

const browser = await chromium.launch(process.env.CHROME ? { executablePath: process.env.CHROME } : {});

for (const [lang, file] of [["en", "ivo-lopes-cv.pdf"], ["pt", "ivo-lopes-cv-pt.pdf"]]) {
  const page = await browser.newPage();
  await page.goto(`${base}/?lang=${lang}#cv`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.pdf({ path: join(root, file), format: "A4", printBackground: true, pageRanges: "1", preferCSSPageSize: true });
  await page.close();
  console.log(`Wrote ${file}`);
}

const og = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await og.goto(`${base}/tools/og-card.html`, { waitUntil: "networkidle" });
await og.evaluate(() => document.fonts.ready);
await og.screenshot({ path: join(root, "og-image.png") });
console.log("Wrote og-image.png");

await browser.close();
server.close();
