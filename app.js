(function () {
  // Language: ?lang= in the link, then the visitor's last choice, then the
  // browser's own language. Switching reloads with ?lang=, so a link can
  // also point straight at either version.
  const params = new URLSearchParams(location.search);
  let saved = null;
  try { saved = localStorage.getItem("lang"); } catch (_) {}
  const wanted = params.get("lang") || saved || ((navigator.language || "").toLowerCase().startsWith("pt") ? "pt" : "en");
  const cv = wanted === "pt" && window.CV_PT ? window.CV_PT : window.CV;
  const ui = cv.ui;
  if (params.get("lang")) { try { localStorage.setItem("lang", cv.lang); } catch (_) {} }
  document.documentElement.lang = cv.lang;
  document.title = ui.pageTitle;
  const $ = (s, el = document) => el.querySelector(s);
  const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  // Escape, then turn **bold** into <strong>.
  const rich = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  const plain = (s) => s.replace(/\*\*/g, "");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Interface text ---------- */
  document.querySelectorAll("[data-ui]").forEach((el) => { el.textContent = ui[el.dataset.ui]; });
  document.querySelectorAll("[data-ui-label]").forEach((el) => {
    el.setAttribute("aria-label", ui[el.dataset.uiLabel]);
    el.setAttribute("title", ui[el.dataset.uiLabel]);
  });
  document.querySelectorAll("[data-lang]").forEach((b) => b.addEventListener("click", () => {
    const next = cv.lang === "pt" ? "en" : "pt";
    try { localStorage.setItem("lang", next); } catch (_) {}
    location.href = `${location.pathname}?lang=${next}${location.hash}`;
  }));
  $("#lang-toggle").setAttribute("aria-label", ui.switchLangLabel);
  $("#lang-toggle").title = ui.switchLangLabel;
  document.querySelectorAll(".pdf-link").forEach((a) => { a.href = ui.pdfFile; a.setAttribute("download", ui.pdfName); });
  const pdf = $("#pdf-download");
  pdf.href = ui.pdfFile;
  pdf.setAttribute("download", ui.pdfName);
  document.querySelectorAll('a[href^="mailto:"]').forEach((a) => (a.href = `mailto:${cv.email}`));

  /* ---------- Window content ---------- */
  $("#hero-name").textContent = cv.name;
  $("#hero-role").textContent = cv.title;
  $("#hero-where").textContent = cv.location;
  $("#hero-tagline").textContent = cv.tagline;
  $("#summary").innerHTML = rich(cv.about);
  $("#year").textContent = new Date().getFullYear();

  const SHOWN = 4;
  $("#timeline").innerHTML = cv.experience
    .map((j, i) => {
      const long = j.bullets.length > SHOWN + 1;
      return `<article class="job">
        <div class="job-head">
          <h3><span class="company">${esc(j.company)}</span><span class="role">${esc(j.role)}</span></h3>
          <span class="when">${esc(j.start)} – ${esc(j.end)}</span>
        </div>
        <p class="muted">${esc(j.blurb)}</p>
        <ul class="bullets${long ? " collapsed" : ""}" id="b${i}">${j.bullets.map((b) => `<li>${rich(b)}</li>`).join("")}</ul>
        ${long ? `<button class="more" type="button" aria-controls="b${i}" aria-expanded="false">${esc(ui.more(j.bullets.length - SHOWN))}</button>` : ""}
      </article>`;
    })
    .join("");
  document.querySelectorAll(".more").forEach((btn) => {
    const label = btn.textContent;
    btn.addEventListener("click", () => {
      const list = document.getElementById(btn.getAttribute("aria-controls"));
      const open = list.classList.toggle("collapsed") === false;
      btn.setAttribute("aria-expanded", open);
      btn.textContent = open ? ui.less : label;
    });
  });

  $("#projects-list").innerHTML = cv.projects
    .map((p) => `<article class="project">
        <div class="job-head">
          <h3><a class="company" href="${esc(p.href)}" target="_blank" rel="noopener">${esc(p.name)}</a></h3>
          <span class="when">${esc(p.kind)}</span>
        </div>
        <p class="muted">${esc(p.blurb)}</p>
        <ul class="bullets">${p.points.map((b) => `<li>${rich(b)}</li>`).join("")}</ul>
        <div class="tags">${p.stack.map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div>
        <div class="btn-row">
          <a class="btn" href="${esc(p.demo)}" target="_blank" rel="noopener"><img src="os/icons/globe.png" alt="">${esc(ui.tryDemo)}</a>
          <a class="btn" href="${esc(p.tests)}" target="_blank" rel="noopener"><img src="os/icons/doc-checklist.png" alt="">${esc(ui.tests)}</a>
          <a class="btn" href="${esc(p.href)}" target="_blank" rel="noopener"><img src="os/icons/code.png" alt="">${esc(ui.code)}</a>
        </div>
        <p class="story"><img src="os/icons/doc-edit.png" alt=""><a href="${esc(p.story)}" data-doc>${esc(ui.readStory)}</a></p>
      </article>`)
    .join("");

  $("#skills-grid").innerHTML = `<tbody>${cv.skills
    .map((g) => `<tr class="skill-row"><th scope="row">${esc(g.group)}</th><td>${g.items.map(esc).join(", ")}</td></tr>`)
    .join("")}</tbody>`;

  $("#edu-grid").innerHTML =
    `<div class="edu-col">
      <h3>${esc(ui.sEducation)}</h3>
      ${cv.education.map((e) => `<div class="edu-item"><img src="os/icons/star.png" alt=""><div><strong>${esc(e.degree)}</strong><br>${esc(e.school)}, ${esc(e.location)} · ${esc(e.year)}<br><span class="muted">${esc(e.note)}</span></div></div>`).join("")}
      <h3>${esc(ui.sLanguages)}</h3>
      <table class="listview compact"><tbody>${cv.languages.map((l) => `<tr><td>${esc(l.name)}</td><td class="muted">${esc(l.level)}</td></tr>`).join("")}</tbody></table>
    </div>
    <div class="edu-col">
      <h3>${esc(ui.sCertifications)}</h3>
      <table class="listview compact"><tbody>${cv.certifications.map((c) => `<tr><td><img src="os/icons/ok.png" alt="" class="row-icon">${esc(c.name)}</td><td class="muted num">${esc(c.year)}</td></tr>`).join("")}</tbody></table>
    </div>`;

  $("#contact-links").innerHTML =
    `<a class="btn" href="mailto:${esc(cv.email)}"><img src="os/icons/mail.png" alt="">${esc(cv.email)}</a>
     <button class="btn" id="copy-email" type="button">${esc(ui.copyEmail)}</button>` +
    cv.links.map((l) => `<a class="btn" href="${esc(l.href)}" target="_blank" rel="noopener"><img src="os/icons/${l.label === "GitHub" ? "code" : "team"}.png" alt="">${esc(l.label)}</a>`).join("");
  $("#copy-email").addEventListener("click", async (e) => {
    const b = e.currentTarget;
    try {
      await navigator.clipboard.writeText(cv.email);
      b.textContent = ui.copied;
      setTimeout(() => { b.textContent = ui.copyEmail; }, 1800);
    } catch (_) {}
  });

  /* ---------- Clock (Porto time, like a taskbar clock) ---------- */
  const clock = $("#clock");
  const tick = () => {
    clock.textContent = new Intl.DateTimeFormat(cv.lang === "pt" ? "pt-PT" : "en-GB", { hour: "2-digit", minute: "2-digit", timeZone: cv.timezone }).format(new Date());
  };
  tick();
  setInterval(tick, 15000);

  /* ---------- The test run ---------- */
  const rows = $("#tests-body");
  rows.innerHTML = cv.checks
    .map(([k, v]) => `<tr><td><span class="check"></span>${esc(k)}</td><td>${esc(v)}</td><td class="status">${esc(ui.rowPending)}</td></tr>`)
    .join("");
  const bar = $("#bar");
  const progress = bar.parentElement;
  const pct = $("#pct");
  const sbState = $("#sb-state");
  const sbCount = $("#sb-count");
  const sbTime = $("#sb-time");
  const led = $("#led");
  const total = cv.checks.length;
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  let runId = 0;
  let timer = 0;

  function setProgress(done) {
    const p = Math.round((done / total) * 100);
    bar.style.width = `${p}%`;
    pct.textContent = `${p}%`;
    progress.setAttribute("aria-valuenow", p);
    sbCount.textContent = ui.statusPassed(done, total);
  }
  function setRow(tr, state) {
    tr.className = state;
    tr.querySelector(".status").textContent = ui[{ pending: "rowPending", running: "rowRunning", passed: "rowPassed", stopped: "rowStopped" }[state]];
  }
  function finish(stopped) {
    clearInterval(timer);
    document.body.classList.remove("busy");
    $("#win").classList.toggle("passed", !stopped);
    led.className = `led ${stopped ? "stopped" : "pass"}`;
    sbState.textContent = stopped ? ui.stoppedStatus : ui.ready;
  }

  async function run() {
    const id = ++runId;
    const alive = () => id === runId;
    const trs = [...rows.children];
    trs.forEach((tr) => setRow(tr, "pending"));
    $("#win").classList.remove("passed");
    setProgress(0);
    led.className = "led running";
    document.body.classList.add("busy");
    sbState.textContent = ui.runningStatus;
    const t0 = Date.now();
    clearInterval(timer);
    const showTime = () => {
      const s = Math.floor((Date.now() - t0) / 1000);
      sbTime.textContent = `00:${String(s).padStart(2, "0")}`;
    };
    showTime();
    timer = setInterval(showTime, 250);
    if (reduceMotion) {
      trs.forEach((tr) => setRow(tr, "passed"));
      setProgress(total);
      return finish(false);
    }
    await sleep(400);
    for (let i = 0; i < trs.length; i++) {
      if (!alive()) return;
      setRow(trs[i], "running");
      await sleep(350 + Math.random() * 350);
      if (!alive()) return;
      setRow(trs[i], "passed");
      setProgress(i + 1);
    }
    if (alive()) finish(false);
  }
  function stop() {
    if (!$("#win").classList.contains("passed") && led.classList.contains("running")) {
      runId++;
      [...rows.children].forEach((tr) => { if (!tr.classList.contains("passed")) setRow(tr, "stopped"); });
      finish(true);
    }
  }
  document.querySelectorAll("[data-run]").forEach((b) => b.addEventListener("click", run));
  document.querySelectorAll("[data-stop]").forEach((b) => b.addEventListener("click", stop));
  run();

  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeDialogs(); });

  /* ---------- Window buttons, taskbar and side menu ---------- */
  const win = $("#win");
  const task = $("#task");
  function setMinimized(min) {
    win.classList.toggle("minimized", min);
    task.setAttribute("aria-pressed", String(!min));
    if (!min) $("#content").focus({ preventScroll: true });
  }
  $("#tb-min").addEventListener("click", () => setMinimized(true));
  $("#tb-close").addEventListener("click", () => setMinimized(true));
  $("#tb-max").addEventListener("click", () => win.classList.toggle("maximized"));
  win.querySelector(".titlebar").addEventListener("dblclick", (e) => { if (!e.target.closest("button")) win.classList.toggle("maximized"); });
  task.addEventListener("click", () => setMinimized(!win.classList.contains("minimized")));
  document.querySelectorAll('a[href="#win"]').forEach((a) => a.addEventListener("click", (e) => { e.preventDefault(); setMinimized(false); }));
  $("#tb-menu").addEventListener("click", () => {
    const open = !win.classList.contains("side-open");
    win.classList.toggle("side-open", open);
    $("#tb-menu").setAttribute("aria-expanded", String(open));
  });
  // Section links open the panel they point at (panels can be collapsed).
  document.querySelectorAll('.side a[href^="#"]').forEach((a) => a.addEventListener("click", () => {
    const target = document.querySelector(a.getAttribute("href"));
    if (target && target.tagName === "DETAILS") target.open = true;
    win.classList.remove("side-open");
    $("#tb-menu").setAttribute("aria-expanded", "false");
  }));
  // On a phone the window is one long column: start with the long panels folded.
  if (window.matchMedia("(max-width: 760px)").matches) ["#projects", "#skills", "#education"].forEach((s) => ($(s).open = false));

  /* ---------- Desktop: stacking, dragging, the document window, selection box ---------- */
  // Any mouse or trackpad counts, even on touchscreen laptops that report touch as their main pointer.
  const desktopMode = () => window.matchMedia("(min-width: 761px) and (any-pointer: fine)").matches;
  let topZ = 6;
  const raise = (w) => { w.style.zIndex = String(++topZ); };
  document.querySelectorAll("#web .window:not(.dialog)").forEach((w) => w.addEventListener("pointerdown", () => raise(w)));

  // Drag a window by its title bar, like the real thing.
  function draggable(w) {
    const bar = w.querySelector(".titlebar");
    bar.addEventListener("pointerdown", (e) => {
      if (!desktopMode() || e.button !== 0 || e.target.closest("button") || w.classList.contains("maximized")) return;
      const r = w.getBoundingClientRect();
      Object.assign(w.style, { position: "fixed", left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px`, height: `${r.height}px`, margin: "0" });
      const dx = e.clientX - r.left, dy = e.clientY - r.top;
      bar.setPointerCapture(e.pointerId);
      const move = (ev) => {
        const x = Math.min(Math.max(ev.clientX - dx, -r.width + 80), innerWidth - 80);
        const y = Math.min(Math.max(ev.clientY - dy, 0), innerHeight - 80);
        w.style.left = `${x}px`; w.style.top = `${y}px`;
      };
      const up = () => { bar.removeEventListener("pointermove", move); bar.removeEventListener("pointerup", up); };
      bar.addEventListener("pointermove", move);
      bar.addEventListener("pointerup", up);
    });
  }
  draggable(win);

  // The flaky-CI write-up opens as a document on the desktop.
  const doc = $("#doc-win");
  const taskDoc = $("#task-doc");
  draggable(doc);
  let docLoaded = false;
  async function loadDoc() {
    if (docLoaded) return;
    $("#doc-status").textContent = ui.loading;
    const html = await (await fetch("writing/flaky-ci.html")).text();
    const article = new DOMParser().parseFromString(html, "text/html").querySelector("main.article");
    article.querySelectorAll(".eyebrow, .article-links, .footer").forEach((n) => n.remove());
    article.querySelectorAll("a[href]").forEach((a) => { a.target = "_blank"; a.rel = "noopener"; });
    $("#doc-page").replaceChildren(...article.childNodes);
    const words = $("#doc-page").textContent.trim().split(/\s+/).length;
    $("#doc-status").textContent = ui.words(words);
    docLoaded = true;
  }
  function openDoc() {
    doc.hidden = false;
    doc.classList.remove("minimized");
    taskDoc.hidden = false;
    taskDoc.setAttribute("aria-pressed", "true");
    raise(doc);
    doc.querySelector(".doc-scroll").focus({ preventScroll: true });
    loadDoc().catch(() => { location.href = "writing/flaky-ci.html"; });
  }
  document.querySelectorAll("a[data-doc]").forEach((a) => a.addEventListener("click", (e) => {
    if (!desktopMode()) return; // on a phone, just open the page
    e.preventDefault();
    closeDialogs();
    openDoc();
  }));
  doc.querySelector("[data-doc-close]").addEventListener("click", () => { doc.hidden = true; taskDoc.hidden = true; });
  doc.querySelector("[data-doc-min]").addEventListener("click", () => { doc.classList.add("minimized"); taskDoc.setAttribute("aria-pressed", "false"); });
  doc.querySelector("[data-doc-max]").addEventListener("click", () => doc.classList.toggle("maximized"));
  taskDoc.addEventListener("click", () => {
    const min = !doc.classList.contains("minimized");
    doc.classList.toggle("minimized", min);
    taskDoc.setAttribute("aria-pressed", String(!min));
    if (!min) raise(doc);
  });

  // Drag on the empty desktop to draw a selection box; icons inside it light up.
  const desk = $("#web");
  const icons = [...document.querySelectorAll(".desk-icon")];
  let lasso = null;
  desk.addEventListener("pointerdown", (e) => {
    if (e.pointerType === "touch" || e.button !== 0 || !desktopMode()) return;
    if (e.target !== desk && !e.target.classList.contains("desk-icons")) {
      if (!e.target.closest(".desk-icon")) icons.forEach((i) => i.classList.remove("selected"));
      return;
    }
    e.preventDefault();
    icons.forEach((i) => i.classList.remove("selected"));
    const x0 = e.clientX, y0 = e.clientY;
    lasso = document.createElement("div");
    lasso.className = "lasso";
    document.body.append(lasso);
    desk.setPointerCapture(e.pointerId);
    const move = (ev) => {
      const l = Math.min(x0, ev.clientX), t = Math.min(y0, ev.clientY);
      const r = Math.max(x0, ev.clientX), b = Math.max(y0, ev.clientY);
      Object.assign(lasso.style, { left: `${l}px`, top: `${t}px`, width: `${r - l}px`, height: `${b - t}px` });
      icons.forEach((i) => {
        const ir = i.getBoundingClientRect();
        i.classList.toggle("selected", ir.left < r && ir.right > l && ir.top < b && ir.bottom > t);
      });
    };
    const up = () => { lasso?.remove(); lasso = null; desk.removeEventListener("pointermove", move); desk.removeEventListener("pointerup", up); };
    desk.addEventListener("pointermove", move);
    desk.addEventListener("pointerup", up);
  });
  icons.forEach((i) => i.addEventListener("click", () => { icons.forEach((o) => o.classList.toggle("selected", o === i)); }));

  /* ---------- Dialogs: About and the Recycle Bin ---------- */
  let lastFocus = null;
  function openDialog(d) { lastFocus = document.activeElement; d.hidden = false; d.querySelector(".dialog-actions .btn").focus(); }
  function closeDialogs() {
    document.querySelectorAll(".dialog-backdrop:not([hidden])").forEach((d) => { d.hidden = true; lastFocus?.focus(); });
  }
  document.querySelectorAll("[data-about]").forEach((b) => b.addEventListener("click", () => openDialog($("#about-dialog"))));
  $("#desk-bin").addEventListener("click", () => openDialog($("#bin-dialog")));
  document.querySelectorAll(".dialog-backdrop").forEach((d) => {
    d.querySelectorAll("[data-close]").forEach((b) => b.addEventListener("click", closeDialogs));
    d.addEventListener("click", (e) => { if (e.target === d) closeDialogs(); });
  });

  /* ---------- Paper (printable, two-page) view ---------- */
  // Drawn icons rather than symbol characters, so the PDF looks the same
  // whatever fonts the machine building it has.
  const svg = (d) => `<svg class="s-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
  const ICON = {
    mail: svg('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>'),
    link: svg('<path d="M7 17 17 7"/><path d="M8 7h9v9"/>'),
    pin: svg('<path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>'),
  };
  // Two A4 pages, written in the order an ATS (applicant tracking system)
  // reads them: name and contact first, then the main column, then the side
  // column. Plain section names, real text, no letter-spaced headings.
  const job = (j) => `<div class="s-job">
            <div class="s-role">${esc(j.role)} · <span class="s-company">${esc(j.company)}</span></div>
            <div class="s-meta">${esc(j.start)} – ${esc(j.end)} · ${esc(j.location)}</div>
            <ul>${j.bullets.map((b) => `<li>${esc(plain(b))}</li>`).join("")}</ul>
          </div>`;
  const [firstJob, ...laterJobs] = cv.experience;
  $("#sheet").innerHTML = `
    <h1>${esc(cv.name)}</h1>
    <div class="s-title">${esc(cv.title)}</div>
    <div class="s-contact">
      <a href="mailto:${esc(cv.email)}">${ICON.mail}${esc(cv.email)}</a>
      ${cv.links.map((l) => `<a href="${esc(l.href)}" target="_blank" rel="noopener">${ICON.link}${esc(l.text)}</a>`).join("")}
      <span>${ICON.pin}${esc(cv.location)}</span>
    </div>
    <div class="s-cols">
      <div>
        <section><h2>${esc(ui.sSummary)}</h2><p>${esc(plain(cv.summary))}</p></section>
        <section><h2>${esc(ui.sExperience)}</h2>${job(firstJob)}</section>
      </div>
      <div>
        <section><h2>${esc(ui.sSkills)}</h2>
          ${cv.skills.map((g) => `<div class="s-skill"><h3>${esc(g.group)}</h3><p>${g.items.map(esc).join(", ")}</p></div>`).join("")}
        </section>
      </div>
    </div>`;
  $("#sheet2").innerHTML = `
    <div class="s-cols s-cols-top">
      <div>
        <section><h2>${esc(ui.sExperience)}</h2>${laterJobs.map(job).join("")}</section>
        <section><h2>${esc(ui.sCertifications)}</h2>
          <ul class="s-certs">${cv.certifications.map((c) => `<li><span>${esc(c.name)}</span>${c.year ? `<span class="s-year">${esc(c.year)}</span>` : ""}</li>`).join("")}</ul>
        </section>
        <section><h2>${esc(ui.sProject)}</h2>
          ${cv.projects.map((p) => `<div class="s-skill"><h3><a href="${esc(p.href)}" target="_blank" rel="noopener">${esc(p.name)}</a> · <a href="${esc(p.demo)}" target="_blank" rel="noopener">${esc(p.demo.replace(/^https:\/\//, ""))}</a></h3>
            <p>${esc(plain(p.kind))}. ${esc(p.points.slice(0, 3).map(plain).join("; "))}.</p></div>`).join("")}
        </section>
      </div>
      <div>
        <section><h2>${esc(ui.sEducation)}</h2>
          ${cv.education.map((e) => `<div class="s-skill"><h3>${esc(e.degree)}</h3><p>${esc(e.school)}, ${esc(e.location)} · ${esc(e.year)}</p><p class="s-note">${esc(e.note)}</p></div>`).join("")}
        </section>
        <section><h2>${esc(ui.sLanguages)}</h2>
          <ul class="s-langs">${cv.languages.map((l) => `<li><span>${esc(l.name)}</span><span>${esc(l.level)}</span></li>`).join("")}</ul>
        </section>
      </div>
    </div>`;

  // Keep each page inside its A4 sheet wherever it renders. Text comes out
  // wider on some systems (Linux, where the PDF is built), so if a page runs
  // past the bottom, step the size down on both pages until they fit - never
  // below a size that stays comfortable to read.
  const wrap = $("#sheet-wrap");
  const sheet = $("#sheet");
  const pages = [...document.querySelectorAll(".sheet")];
  const BASE_PT = 9;
  const MIN_PT = 8;
  function fitText() {
    if ($("#paper").hidden) return;
    let size = BASE_PT;
    const set = () => pages.forEach((p) => (p.style.fontSize = `${size}pt`));
    const overflows = () => pages.some((p) => p.scrollHeight > p.clientHeight);
    set();
    while (overflows() && size > MIN_PT) {
      size = Math.round((size - 0.1) * 10) / 10;
      set();
    }
    sheet.dataset.fitted = String(size);
  }
  if (document.fonts) document.fonts.ready.then(() => { fitText(); fitSheet(); });

  // Scale the A4 sheets down to fit narrow screens.
  function fitSheet() {
    pages.forEach((p) => (p.style.transform = ""));
    wrap.style.height = "";
    const avail = wrap.clientWidth - 32;
    const scale = Math.min(1, avail / sheet.offsetWidth);
    if (scale < 1) {
      pages.forEach((p) => (p.style.transform = `scale(${scale})`));
      const gap = 24;
      pages.forEach((p, i) => (p.style.marginTop = i ? `${-p.offsetHeight * (1 - scale) + gap}px` : ""));
      wrap.style.height = `${pages.length * (sheet.offsetHeight * scale + gap) + 96}px`;
    } else pages.forEach((p) => (p.style.marginTop = ""));
  }
  window.addEventListener("resize", () => { if (!$("#paper").hidden) fitSheet(); });

  /* ---------- View switching ---------- */
  function setView(view, push) {
    const paper = view === "paper";
    $("#web").hidden = paper;
    $("#paper").hidden = !paper;
    if (paper) { fitText(); fitSheet(); }
    if (push) history.replaceState(null, "", paper ? "#cv" : location.pathname);
    window.scrollTo(0, 0);
  }
  document.querySelectorAll("[data-view]").forEach((b) => b.addEventListener("click", () => setView(b.dataset.view, true)));
  if (location.hash === "#cv") setView("paper", false);

  /* ---------- Keyboard shortcuts ---------- */
  document.addEventListener("keydown", (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey || /input|textarea/i.test(e.target.tagName)) return;
    const k = e.key.toLowerCase();
    if (k === "p") setView($("#paper").hidden ? "paper" : "web", true);
    else if (k === "r" && $("#paper").hidden) run();
  });
})();
