// Renders the paper view to ivo-lopes-cv.pdf through Chrome's print engine,
// so the PDF has real, selectable text and clickable links (what ATS tools
// and recruiters need), not a screenshot. Re-run after editing data.js:
//
//   npm install && npm run pdf
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join } from "node:path";
import { chromium } from "playwright";

const root = new URL(".", import.meta.url).pathname;
const types = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml" };
const server = createServer(async (req, res) => {
  const path = join(root, decodeURIComponent(new URL(req.url, "http://x").pathname).replace(/\/$/, "/index.html"));
  try {
    res.writeHead(200, { "Content-Type": types[extname(path)] || "application/octet-stream" });
    res.end(await readFile(path));
  } catch {
    res.writeHead(404).end();
  }
}).listen(0);

const browser = await chromium.launch(process.env.CHROME ? { executablePath: process.env.CHROME } : {});
const page = await browser.newPage();
await page.goto(`http://localhost:${server.address().port}/#cv`, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.pdf({ path: join(root, "ivo-lopes-cv.pdf"), format: "A4", printBackground: true, pageRanges: "1", preferCSSPageSize: true });
await browser.close();
server.close();
console.log("Wrote ivo-lopes-cv.pdf");
