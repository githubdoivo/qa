# ivolopes.com

Personal CV site: plain HTML/CSS/JS, hosted on GitHub Pages.

- **Edit content in `data.js` only.** It feeds both the web view and the one-page "Paper" view.
- **Two languages:** `data.js` (English) and `data.pt.js` (Portuguese) hold the same content; update both. The site picks the visitor's browser language, and `?lang=pt` / `?lang=en` links straight to either.
- **Generated files** (`ivo-lopes-cv.pdf`, `ivo-lopes-cv-pt.pdf`, `og-image.png`) are rebuilt by GitHub Actions on every push to `main`. To build them locally: `npm install` then `npm run build`.
- **Tests:** `npm test` (Playwright). CI runs them, plus link checks and a Lighthouse audit, on every push.
- Preview locally: `python3 -m http.server` then open http://localhost:8000
- Shortcuts: `T` theme, `P` web/paper, `R` re-run the test animation.
- `ivolopes.com/#cv` opens straight into the paper view.
- To move to a subdomain later, change `CNAME` (e.g. `cv.ivolopes.com`) and add a matching CNAME record in Cloudflare.
