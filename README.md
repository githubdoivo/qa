# qa.ivolopes.com

[![CI](https://github.com/githubdoivo/qa.ivolopes.com/actions/workflows/ci.yml/badge.svg)](https://github.com/githubdoivo/qa.ivolopes.com/actions/workflows/ci.yml)

Personal CV site: plain HTML/CSS/JS, hosted on GitHub Pages. The look is a
classic Windows "Test Runner" app on an early-2000s desktop (`os.css`, icons in
`os/`), with one fixed light look (no dark mode). The write-up in `writing/`
uses `styles.css`.

- **Edit content in `data.js` only.** It feeds both the web view and the two-page "Paper" view (and so the PDFs). Keep `data.pt.js` in step.
- **The PDFs must stay ATS-readable.** The paper view uses static copies of the fonts in `fonts/` (variable web fonts end up as unreadable Type3 fonts in the PDF), plain section names, and name/contact first. `tests/site.spec.mjs` reads the built PDFs like an ATS and fails if any of that breaks.
- **Two languages:** `data.js` (English) and `data.pt.js` (Portuguese) hold the same content; update both. The site picks the visitor's browser language, and `?lang=pt` / `?lang=en` links straight to either.
- **Generated files** (`ivo-lopes-cv.pdf`, `ivo-lopes-cv-pt.pdf`, `og-image.png`) are rebuilt by GitHub Actions on every push to `main`. To build them locally: `npm install` then `npm run build`.
- **Tests:** `npm test` (Playwright). CI runs them, plus link checks and a Lighthouse audit, on every push.
- Preview locally: `python3 -m http.server` then open http://localhost:8000
- Shortcuts: `P` web/paper, `R` re-run the test animation.
- **UX rules:** EN labels in Title Case, PT in sentence case (impersonal); on touch screens every button is 44px or taller (tested). No phone number anywhere (tested, in the site and the PDFs).
- `qa.ivolopes.com/#cv` opens straight into the paper view.
- Served at `qa.ivolopes.com` (`CNAME`, plus a CNAME record in Cloudflare). It deliberately links to no other area of ivolopes.com; the hub at ivolopes.com links to it.
- **After changing CSS or JS,** bump the `?v=` stamp on the `<link>`/`<script>` tags in `index.html`, so browsers fetch the new files straight away (GitHub Pages lets them keep old ones for 10 minutes).
