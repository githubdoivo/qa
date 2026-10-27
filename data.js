// Single source of truth for the CV in English. Edit this file to update both
// the web view and the one-page paper view; data.pt.js holds the same content
// in Portuguese and must be kept in step with it.
window.CV = {
  lang: "en",
  name: "Ivo Lopes",
  title: "Senior QA Engineer",
  location: "Porto, Portugal",
  coords: "41.15°N 8.61°W",
  timezone: "Europe/Lisbon",
  email: "mail@ivolopes.com",
  links: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/ivolopesilva", text: "linkedin.com/in/ivolopesilva" },
    { label: "GitHub", href: "https://github.com/githubdoivo", text: "github.com/githubdoivo" },
  ],

  tagline: "I break things on purpose, so they don't break in production.",
  summary:
    "QA Engineer with 5+ years of experience testing capital markets and enterprise cloud systems, currently at Euronext Securities. Strengths span BDD automation with Playwright and Cucumber, event-driven validation across Kafka and PostgreSQL pipelines, and load testing to 500-user peak profiles. Delivered 83+ automated specs and 140+ Gherkin scenarios, cutting manual regression effort by ~80%. Brings test strategy ownership and a record of catching critical defects before release to a Senior QA role.",

  // The web page's "about me": human words, no numbers (the Test Results
  // panel carries those). The PDF keeps the ATS-style summary above.
  about:
    "I'm a QA engineer in Porto. At Euronext Securities I test the platforms behind securities and instrument coding: I build the automation, plan the integration testing and act as the quality voice across several squads. Before that, at Deloitte, I tested client systems and moved them safely to the cloud. I like tests people can trust, pipelines that stay green for the right reasons, and helping new joiners get there too.",
  // Shown in the hero test-runner animation.
  checks: [
    ["experience", "5+ years in capital markets & enterprise cloud"],
    ["automation", "83+ specs · 140+ data-driven Gherkin scenarios"],
    ["sit", "ISO 20022 message processing · 300+ scenarios"],
    ["performance", "500-user peak · soak · capacity"],
    ["regression", "manual effort cut by ~80%"],
    ["release", "critical defects caught before production"],
  ],

  metrics: [
    { value: "5+", label: "years in QA" },
    { value: "83+", label: "automated specs" },
    { value: "140+", label: "Gherkin scenarios" },
    { value: "300+", label: "SIT scenarios" },
    { value: "500", label: "user load peak" },
    { value: "~80%", label: "less manual regression" },
  ],

  experience: [
    {
      role: "QA Tester",
      company: "Euronext Securities",
      start: "Oct 2024",
      end: "Present",
      location: "Porto, Portugal",
      blurb: "Sole QA across multiple squads on securities and instrument-coding platforms in capital markets.",
      stack: ["Playwright", "Cucumber", "Rest Assured", "Testcontainers", "Kafka", "PostgreSQL", "Artillery", "Xray", "GitHub Actions", "GitLab CI", "SonarQube", "OpenShift", "Coralogix"],
      bullets: [
        "Engineered test automation and contributed to test planning across three Euronext securities and instrument-coding platforms, using Playwright/TypeScript, Cucumber BDD, Rest Assured, Artillery and Testcontainers (Kafka, PostgreSQL) to cover E2E, API, RBAC, contract, event-driven and performance testing",
        "Shipped all assigned project scope with **zero post-release defects** raised against it, backed by 100% PR-gated GitHub Actions and GitLab CI pipelines with SonarQube quality gates and Jira/Xray requirement-to-test traceability across **15+ user stories**",
        "Delivered **83+ automated specs**, **140+ data-driven Gherkin scenarios** and **14 load/NFR tests** (500-user peak, soak, capacity), cutting manual regression and pre-merge effort by **~80%** and new-scenario authoring time by **~40%**",
        "Planned and executed System Integration Testing (SIT) for ISO 20022 message processing across **300+ test scenarios**, covering routing, XML-to-JSON transformation, rejection codes, acknowledgements, persistence integrity and negative paths (malformed messages, duplicates, dead-letter routing)",
        "Set test strategy and SIT priorities as sole QA across multiple squads, translating user stories into traceable test cases and aligning critical-feature coverage with the wider QA team",
        "Introduced Xray for Jira test traceability, and authored merge-request and defect-reporting templates adopted as team standard",
        "Mentored new joiners through the company buddy programme and authored the Confluence guide now used for QA onboarding",
        "Used AI assistants in VS Code with full project context to speed up test case and step-definition authoring, defect investigation and coverage documentation",
      ],
    },
    {
      role: "Cloud Engineer & Quality Tester",
      company: "Deloitte",
      start: "Jan 2022",
      end: "Oct 2024",
      location: "Porto, Portugal",
      blurb: "Quality and cloud engineering across 5+ client engagements, from sole QA to QA teams of three.",
      stack: ["Playwright", "Selenium", "Jenkins", "SQL", "Jira", "AWS", "Azure", "Oracle Cloud"],
      bullets: [
        "Owned test planning, test case design and execution across **5+ client engagements**, working as sole QA on smaller teams and within QA teams of up to three on larger programmes",
        "Led a client's **full cloud migration programme** from application assessment through migration execution, writing the pre- and post-migration test plans that kept downtime to a minimum",
        "Automated cross-browser and cross-device UI regression tests in Playwright and Selenium, replacing repetitive manual regression cycles",
        "Monitored daily Jenkins test pipelines, triaging failed runs and flaky tests to keep regression results reliable for each release",
        "Performed manual functional, regression and integration testing, and queried application databases in SQL to verify data integrity through migration and release cycles",
        "Logged and tracked defects in Jira from triage through closure and fed UI/UX findings back to development teams to drive usability fixes",
      ],
    },
  ],

  projects: [
    {
      name: "appdoivo",
      href: "https://github.com/githubdoivo/appdoivo",
      demo: "https://demo.appdoivo.com",
      tests: "https://github.com/githubdoivo/appdoivo-e2e",
      story: "writing/flaky-ci.html",
      kind: "Side project · PWA used by ~50 guests at a real event",
      blurb: "A party app built and tested the way I'd want a production system to be: quality gates first, then features.",
      stack: ["Node.js", "Playwright (WebKit)", "node:test", "GitHub Actions", "SQLite", "Fly.io", "Web Push"],
      points: [
        "**263 automated tests**: API/logic, real-browser UI on iPhone SE / 13 / Pro Max viewports, and the public demo's guard rails",
        "Separate **BDD end-to-end suite** (Playwright + Cucumber, TypeScript) runs daily against the live demo, with a published report",
        "Pre-commit hook and **GitHub Actions** run the full suite; nothing merges red",
        "Separate **QA environment** with a resetting database, seeded demo data and QA-only feature flags",
        "Role-based access (owner / admin / guest), hashed and encrypted keys, rate-limited login",
        "Diagnosed a **flaky CI suite** (parallel browsers starving a 2-core runner) and fixed it by measurement",
      ],
    },
  ],

  skills: [
    { group: "Programming Languages", items: ["Java", "SQL", "Gherkin", "YAML"] },
    { group: "Test Automation", items: ["Playwright", "Selenium", "Cucumber", "Rest Assured", "Testcontainers"] },
    { group: "API & Performance Testing", items: ["Postman", "REST APIs", "Artillery"] },
    { group: "Testing Types", items: ["Manual", "Functional", "Regression", "End-to-End (E2E)", "UI", "Cross-Browser", "API", "Integration", "System Integration Testing (SIT)", "Event-Driven", "Contract", "Data-Driven", "RBAC", "Performance/Load (peak, soak, capacity)", "Non-Functional (NFR)"] },
    { group: "Test Design & Management", items: ["Test Plans", "Test Case Design", "Requirements Traceability", "Defect Lifecycle Management", "Jira", "Xray", "Confluence"] },
    { group: "Databases & Messaging", items: ["PostgreSQL", "Kafka"] },
    { group: "CI/CD & Quality Gates", items: ["Git", "GitHub Actions", "GitLab CI", "Jenkins", "SonarQube"] },
    { group: "Containers & Monitoring", items: ["Docker", "OpenShift", "Coralogix"] },
    { group: "Cloud", items: ["AWS", "Azure", "Oracle Cloud"] },
    { group: "Methodologies", items: ["Agile/Scrum", "Behaviour-Driven Development (BDD)", "Test Strategy", "AI-Assisted Testing", "Team Onboarding & Enablement"] },
  ],

  education: [
    { degree: "M.Sc. Mechanical Engineering", school: "University of Minho", location: "Braga, Portugal", year: "2021", note: "Specialization in Automation and Robotics" },
  ],

  languages: [
    { name: "Portuguese", level: "Native" },
    { name: "English", level: "Fluent, C1" },
    { name: "Spanish", level: "Intermediate, B1" },
  ],

  certifications: [
    { name: "ISTQB Advanced Level – Test Automation Engineering (CTAL-TAE)", year: "" },
    { name: "AWS Certified Solutions Architect – Associate", year: "2023" },
    { name: "AWS Cloud Practitioner", year: "2023" },
    { name: "Oracle Cloud Infrastructure Foundations", year: "2023" },
    { name: "Professional Scrum Master I (PSM I)", year: "2022" },
    { name: "ISTQB Certified Tester – Foundation Level (CTFL)", year: "2022" },
    { name: "Microsoft Azure Fundamentals (AZ-900)", year: "2022" },
  ],

  // Interface text (headings, buttons, labels).
  ui: {
    pageTitle: "Ivo Lopes · Senior QA Engineer",
    present: "Present",
    current: "current",
    more: (n) => `+ ${n} more`,
    less: "− show less",
    about: "About", experience: "Experience", projects: "Projects", toolkit: "Toolkit", education: "Education & certifications", contact: "Contact",
    getInTouch: "Get in touch", viewPaper: "View printable CV",
    contactLead: "Looking for someone to own quality end to end? Let's talk.",
    copyEmail: "Copy email", copied: "Copied ✓",
    tryDemo: "Try the live demo ↗", code: "Code on GitHub ↗", tests: "E2E tests (Playwright + Cucumber) ↗", readStory: "Read: fixing a flaky CI suite →",
    liveDemo: "live demo",
    footerChecks: "All checks passed ✓",
    web: "Web", paper: "Paper", page: "2 pages", back: "← Back to website", download: "Download PDF",
    pdfFile: "ivo-lopes-cv.pdf", pdfName: "Ivo Lopes CV.pdf",
    sSummary: "Summary", sExperience: "Experience", sSkills: "Skills", sProject: "Project",
    sEducation: "Education", sLanguages: "Languages", sCertifications: "Certifications",
    running: "● RUNNING", passed: "✓ PASSED", runningTests: (n) => `Running ${n} tests using 3 workers`, passedCount: (n) => `${n} passed`,
    switchLang: "PT", switchLangLabel: "Ver em português",
    // The "Test Runner" desktop (web view).
    myCV: "My CV", printable: "Printable CV", otherLang: "Português", winTitle: "Ivo Lopes - Test Runner",
    menuLabel: "Sections", minimize: "Minimize", maximize: "Maximize", close: "Close", startLabel: "Start menu",
    mFile: "File", mView: "View", mRun: "Run", mHelp: "Help",
    downloadPdf: "Download CV (PDF)", downloadShort: "Download CV", runAll: "Run All", stop: "Stop", about: "About",
    report: "Report", export: "Export", help: "Help", eduShort: "Education",
    testResults: "Test Results", colTest: "Test", colDetails: "Details", colStatus: "Status",
    rowPending: "PENDING", rowRunning: "RUNNING", rowPassed: "PASSED", rowStopped: "STOPPED",
    ready: "Ready", runningStatus: "Running tests…", stoppedStatus: "Stopped. Press Run All to try again.",
    statusPassed: (n, m) => `${n}/${m} tests passed`,
    aboutTitle: "About Test Runner", ok: "OK",
    aboutText: "A CV that runs its own tests. Built by hand in HTML, CSS and JavaScript, and checked on every push by Playwright tests and Lighthouse.",
    storyFile: "flaky-ci.doc", bin: "Recycle Bin", binEmpty: "The Recycle Bin is empty.",
    binText: "Every bug found here was fixed before it reached production.",
    openWeb: "Open as web page", words: (n) => `${n} words`, loading: "Opening…",
    themeLabel: "Toggle dark or light theme",
  },
};
