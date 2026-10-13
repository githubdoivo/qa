# ivolopes.com

Personal CV site: plain HTML/CSS/JS, hosted on GitHub Pages.

- **Edit content in `data.js` only.** It feeds both the web view and the one-page "Paper" view.
- **After editing, regenerate the downloadable PDF:** `npm install` (first time) then `npm run pdf`. It renders the paper view to `ivo-lopes-cv.pdf` with real, selectable text.
- Preview locally: `python3 -m http.server` then open http://localhost:8000
- Shortcuts: `T` theme, `P` web/paper, `R` re-run the test animation.
- `ivolopes.com/#cv` opens straight into the paper view.
- To move to a subdomain later, change `CNAME` (e.g. `cv.ivolopes.com`) and add a matching CNAME record in Cloudflare.
