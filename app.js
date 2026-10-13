(function () {
  const cv = window.CV;
  const $ = (s, el = document) => el.querySelector(s);
  const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  // Escape, then turn **bold** into <strong>.
  const rich = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  const plain = (s) => s.replace(/\*\*/g, "");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Web view ---------- */
  $("#hero-eyebrow").textContent = `// ${cv.location}`;
  $("#hero-name").textContent = cv.name;
  $("#hero-role").textContent = cv.title;
  $("#hero-tagline").textContent = cv.tagline;
  $("#summary").innerHTML = rich(cv.summary);
  $("#where").textContent = `${cv.location} · ${cv.coords}`;
  $("#year").textContent = new Date().getFullYear();

  $("#metrics").innerHTML = cv.metrics
    .map((m) => `<div class="metric"><b>${esc(m.value)}</b><span>${esc(m.label)}</span></div>`)
    .join("");

  $("#timeline").innerHTML = cv.experience
    .map((j, i) => {
      const current = j.end === "Present";
      const long = j.bullets.length > 5;
      return `<li class="job reveal">
        <div class="job-meta">
          <div class="when">${esc(j.start)} → ${esc(j.end)}</div>
          <div>${esc(j.location)}</div>
          ${current ? '<span class="badge">● current</span>' : ""}
        </div>
        <div>
          <h3>${esc(j.role)} <span class="company">@ ${esc(j.company)}</span></h3>
          <p class="blurb">${esc(j.blurb)}</p>
          <ul class="bullets${long ? " collapsed" : ""}" id="b${i}">${j.bullets.map((b) => `<li>${rich(b)}</li>`).join("")}</ul>
          ${long ? `<button class="more" aria-controls="b${i}" aria-expanded="false">+ ${j.bullets.length - 4} more</button>` : ""}
          <div class="chips">${j.stack.map((s) => `<span class="chip">${esc(s)}</span>`).join("")}</div>
        </div>
      </li>`;
    })
    .join("");

  document.querySelectorAll(".more").forEach((btn) => {
    const label = btn.textContent;
    btn.addEventListener("click", () => {
      const list = document.getElementById(btn.getAttribute("aria-controls"));
      const open = list.classList.toggle("collapsed") === false;
      btn.setAttribute("aria-expanded", open);
      btn.textContent = open ? "− show less" : label;
    });
  });

  $("#projects-list").innerHTML = cv.projects
    .map((p) => `<article class="project reveal">
        <div class="project-head">
          <h3><a href="${esc(p.href)}" target="_blank" rel="noopener">${esc(p.name)} ↗</a></h3>
          <span class="project-kind mono">${esc(p.kind)}</span>
        </div>
        <div class="project-links">
          <a class="btn primary" href="${esc(p.demo)}" target="_blank" rel="noopener">Try the live demo ↗</a>
          <a class="btn" href="${esc(p.href)}" target="_blank" rel="noopener">Code on GitHub ↗</a>
        </div>
        <p class="blurb">${esc(p.blurb)}</p>
        <ul class="bullets">${p.points.map((b) => `<li>${rich(b)}</li>`).join("")}</ul>
        <div class="chips">${p.stack.map((s) => `<span class="chip">${esc(s)}</span>`).join("")}</div>
      </article>`)
    .join("");

  $("#skills-grid").innerHTML = cv.skills
    .map((g) => `<div class="skill-card reveal${g.items.length > 10 ? " wide" : ""}">
        <h3>${esc(g.group)}</h3>
        <div class="chips" style="margin-top:0">${g.items.map((s) => `<span class="chip">${esc(s)}</span>`).join("")}</div>
      </div>`)
    .join("");

  $("#cta-email").href = `mailto:${cv.email}`;
  $("#contact-links").innerHTML =
    `<a class="btn primary" href="mailto:${esc(cv.email)}">${esc(cv.email)}</a>
     <button class="btn" id="copy-email" type="button">Copy email</button>` +
    cv.links.map((l) => `<a class="btn" href="${esc(l.href)}" target="_blank" rel="noopener">${esc(l.label)} ↗</a>`).join("");

  $("#copy-email").addEventListener("click", async (e) => {
    try {
      await navigator.clipboard.writeText(cv.email);
      e.target.textContent = "Copied ✓";
      e.target.classList.add("copied");
      setTimeout(() => { e.target.textContent = "Copy email"; e.target.classList.remove("copied"); }, 1800);
    } catch (_) {}
  });

  /* ---------- Clock ---------- */
  const clock = $("#clock");
  const tick = () => {
    clock.textContent = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit", minute: "2-digit", timeZone: cv.timezone, timeZoneName: "short",
    }).format(new Date());
  };
  tick();
  setInterval(tick, 30000);

  /* ---------- Terminal test run ---------- */
  const body = $("#term-body");
  const state = $("#term-state");
  let runId = 0;
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  async function run() {
    const id = ++runId;
    const alive = () => id === runId;
    state.textContent = "● RUNNING";
    state.classList.remove("pass");
    const lines = [
      `<span class="c">$</span> npx playwright test <span class="k">ivo-lopes.spec.ts</span>`,
      ``,
      `<span class="c">Running ${cv.checks.length} tests using 3 workers</span>`,
      ``,
    ];
    const render = (cursor) => { body.innerHTML = lines.map((l) => (l.startsWith('<span class="t"') ? l : l + "\n")).join("") + (cursor ? '<span class="cursor"></span>' : ""); };

    if (reduceMotion) {
      cv.checks.forEach(([k, v]) => lines.push(`<span class="t"><span class="ok">✓</span> <span class="k">${esc(k)}</span> › ${esc(v)}</span>`));
      lines.push("", `  <span class="ok b">${cv.checks.length} passed</span> <span class="c">(4.2s)</span>`);
      render(false);
      state.textContent = "✓ PASSED";
      state.classList.add("pass");
      return;
    }

    // Type the command.
    const cmd = lines[0];
    lines.length = 0;
    const raw = "npx playwright test ivo-lopes.spec.ts";
    for (let i = 0; i <= raw.length; i++) {
      if (!alive()) return;
      body.innerHTML = `<span class="c">$</span> ${raw.slice(0, i)}<span class="cursor"></span>`;
      await sleep(28);
    }
    lines.push(cmd, "", `<span class="c">Running ${cv.checks.length} tests using 3 workers</span>`, "");
    render(true);
    await sleep(450);

    for (const [k, v] of cv.checks) {
      if (!alive()) return;
      lines.push(`<span class="t"><span class="c">◌</span> <span class="k">${esc(k)}</span> › ${esc(v)}</span>`);
      render(true);
      await sleep(320 + Math.random() * 280);
      const ms = (0.3 + Math.random() * 1.4).toFixed(1);
      lines[lines.length - 1] = `<span class="t"><span class="ok">✓</span> <span class="k">${esc(k)}</span> › ${esc(v)} <span class="c">(${ms}s)</span></span>`;
      render(true);
    }
    if (!alive()) return;
    await sleep(300);
    lines.push("", `  <span class="ok b">${cv.checks.length} passed</span> <span class="c">(4.2s)</span>`);
    render(true);
    state.textContent = "✓ PASSED";
    state.classList.add("pass");
  }
  $("#term-replay").addEventListener("click", run);
  run();

  /* ---------- Reveal on scroll ---------- */
  if ("IntersectionObserver" in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -8% 0px" });
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
  } else {
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("in"));
  }

  /* ---------- Paper (one-page) view ---------- */
  $("#sheet").innerHTML = `
    <h1>${esc(cv.name)}</h1>
    <div class="s-title">${esc(cv.title)}</div>
    <div class="s-contact">
      <a href="mailto:${esc(cv.email)}">✉ ${esc(cv.email)}</a>
      ${cv.links.map((l) => `<a href="${esc(l.href)}" target="_blank" rel="noopener">↗ ${esc(l.text)}</a>`).join("")}
      <span>⌖ ${esc(cv.location)}</span>
    </div>
    <div class="s-cols">
      <div>
        <section><h2>Summary</h2><p>${esc(plain(cv.summary))}</p></section>
        <section><h2>Experience</h2>
          ${cv.experience.map((j) => `<div class="s-job">
            <div class="s-role">${esc(j.role)}</div>
            <div class="s-company">${esc(j.company)}</div>
            <div class="s-meta">${esc(j.start)} – ${esc(j.end)} · ${esc(j.location)}</div>
            <ul>${j.bullets.map((b) => `<li>${esc(plain(b))}</li>`).join("")}</ul>
          </div>`).join("")}
        </section>
      </div>
      <div>
        <section><h2>Skills</h2>
          ${cv.skills.map((g) => `<div class="s-skill"><h3>${esc(g.group)}</h3><p>${g.items.map(esc).join(", ")}</p></div>`).join("")}
        </section>
        <section><h2>Project</h2>
          ${cv.projects.map((p) => `<div class="s-skill"><h3><a href="${esc(p.href)}" target="_blank" rel="noopener">${esc(p.name)} ↗</a> · <a href="${esc(p.demo)}" target="_blank" rel="noopener">live demo ↗</a></h3>
            <p>${esc(p.points.slice(0, 3).map(plain).join("; "))}.</p></div>`).join("")}
        </section>
      </div>
    </div>`;

  // Scale the A4 sheet down to fit narrow screens.
  const wrap = $("#sheet-wrap");
  const sheet = $("#sheet");
  function fitSheet() {
    sheet.style.transform = "";
    wrap.style.height = "";
    const avail = wrap.clientWidth - 32;
    const w = sheet.offsetWidth;
    const scale = Math.min(1, avail / w);
    if (scale < 1) {
      sheet.style.transform = `scale(${scale})`;
      wrap.style.height = `${sheet.offsetHeight * scale + 96}px`;
    }
  }
  window.addEventListener("resize", () => { if (!$("#paper").hidden) fitSheet(); });

  /* ---------- View switching ---------- */
  function setView(view, push) {
    const paper = view === "paper";
    $("#web").hidden = paper;
    $("#paper").hidden = !paper;
    document.querySelectorAll(".seg [data-view]").forEach((b) => b.setAttribute("aria-selected", b.dataset.view === view));
    if (paper) fitSheet();
    if (push) history.replaceState(null, "", paper ? "#cv" : location.pathname);
    window.scrollTo(0, 0);
  }
  document.querySelectorAll("[data-view]").forEach((b) => b.addEventListener("click", () => setView(b.dataset.view, true)));
  if (location.hash === "#cv") setView("paper", false);

  /* ---------- Theme ---------- */
  const root = document.documentElement;
  const isDark = () =>
    root.dataset.theme ? root.dataset.theme === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
  function toggleTheme() {
    const next = isDark() ? "light" : "dark";
    root.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch (_) {}
  }
  $("#theme-toggle").addEventListener("click", toggleTheme);

  /* ---------- Keyboard shortcuts ---------- */
  document.addEventListener("keydown", (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey || /input|textarea/i.test(e.target.tagName)) return;
    const k = e.key.toLowerCase();
    if (k === "t") toggleTheme();
    else if (k === "p") setView($("#paper").hidden ? "paper" : "web", true);
    else if (k === "r" && $("#paper").hidden) run();
  });
})();
