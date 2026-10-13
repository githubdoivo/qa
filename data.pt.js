// O CV em português: o mesmo conteúdo de data.js, traduzido. Ao atualizar o
// CV, atualizar os dois ficheiros. Escrito de forma impessoal (sem marcas de
// género) e em português europeu; os cargos oficiais ficam como estão.
window.CV_PT = {
  lang: "pt",
  name: "Ivo Lopes",
  title: "QA Automation Engineer",
  location: "Porto, Portugal",
  coords: "41.15°N 8.61°W",
  timezone: "Europe/Lisbon",
  email: "mail@ivolopes.com",
  links: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/ivolopesilva", text: "linkedin.com/in/ivolopesilva" },
    { label: "GitHub", href: "https://github.com/githubdoivo", text: "github.com/githubdoivo" },
  ],

  tagline: "Parto as coisas de propósito, para não partirem em produção.",
  summary:
    "Mais de 5 anos em QA de sistemas de mercados de capitais e de cloud empresarial, atualmente na Euronext Securities. Automação BDD com Playwright e Cucumber, validação orientada a eventos em Kafka e PostgreSQL, e testes de carga até picos de 500 utilizadores. Mais de 83 specs automatizadas e 140 cenários Gherkin, com ~80% menos esforço de regressão manual. Experiência a definir a estratégia de testes e historial de defeitos críticos detetados antes de produção.",

  // A animação de testes no topo da página.
  checks: [
    ["experiência", "5+ anos em mercados de capitais e cloud empresarial"],
    ["automação", "83+ specs · 140+ cenários Gherkin orientados a dados"],
    ["sit", "processamento de mensagens ISO 20022 · 300+ cenários"],
    ["performance", "pico de 500 utilizadores · soak · capacidade"],
    ["regressão", "esforço manual reduzido em ~80%"],
    ["release", "defeitos críticos detetados antes de produção"],
  ],

  metrics: [
    { value: "5+", label: "anos em QA" },
    { value: "83+", label: "specs automatizadas" },
    { value: "140+", label: "cenários Gherkin" },
    { value: "300+", label: "cenários de SIT" },
    { value: "500", label: "utilizadores em pico de carga" },
    { value: "~80%", label: "menos regressão manual" },
  ],

  experience: [
    {
      role: "QA Tester",
      company: "Euronext Securities",
      start: "10/2024",
      end: "Atual",
      location: "Porto, Portugal",
      blurb: "Responsabilidade exclusiva pelo QA em várias squads, em plataformas de valores mobiliários e de codificação de instrumentos nos mercados de capitais.",
      stack: ["Playwright", "Cucumber", "RestAssured", "Testcontainers", "Kafka", "PostgreSQL", "Artillery", "Xray", "GitHub Actions", "GitLab CI", "SonarQube", "OpenShift", "Coralogix"],
      bullets: [
        "Framework e repositório de automação de testes construídos de raiz (estrutura, convenções e relatórios), e extensão dos módulos de testes de três plataformas de valores mobiliários e codificação de instrumentos",
        "Automação de testes End-to-End (E2E), de API, de contrato, de RBAC e orientados a eventos com Playwright, Cucumber BDD, RestAssured e Testcontainers (Docker), sobre Kafka e PostgreSQL",
        "Entrega de **83+ specs automatizadas**, **140+ cenários Gherkin orientados a dados** e **14 testes de carga/NFR em Artillery** (pico de 500 utilizadores, soak, capacidade), com redução de **~80%** no esforço de regressão manual e pré-merge",
        "Planeamento e execução de System Integration Testing (SIT) para mensagens ISO 20022 em **300+ cenários**: routing, transformação XML para JSON, códigos de rejeição, acknowledgements, integridade da persistência e caminhos negativos (mensagens malformadas, duplicados, dead-letter routing)",
        "**Defeitos críticos detetados em SIT antes de chegarem a produção**, com a causa raiz identificada nas camadas de processamento de mensagens, transformação e persistência através de logs do Coralogix e do OpenShift",
        "Estratégia de testes e prioridades de SIT definidas para várias squads, com user stories traduzidas em casos de teste rastreáveis e a cobertura crítica alinhada com a restante equipa de QA",
        "Introdução do Xray para rastreabilidade de testes no Jira, criação de templates de merge request e de reporte de defeitos adotados como padrão da equipa, e quality gates do SonarQube em cada PR via GitHub Actions e GitLab CI",
        "Acompanhamento de novas pessoas na equipa através do programa de buddies e autoria do guia no Confluence usado hoje no onboarding de QA",
        "Assistentes de IA no VS Code, com o contexto do projeto, para acelerar casos de teste, step definitions, investigação de defeitos e documentação da cobertura",
      ],
    },
    {
      role: "Cloud Engineer & Quality Tester",
      company: "Deloitte",
      start: "01/2022",
      end: "10/2024",
      location: "Porto, Portugal",
      blurb: "Qualidade e engenharia cloud em mais de 5 projetos de clientes, com o QA a cargo exclusivo ou em equipas de QA de três pessoas.",
      stack: ["Playwright", "Selenium", "SQL", "Jira", "AWS", "Azure", "Oracle Cloud"],
      bullets: [
        "Planeamento, desenho e execução de testes em **5+ projetos de clientes**, com o QA a cargo exclusivo em equipas pequenas e integrado em equipas de QA de até três pessoas em programas maiores",
        "Liderança da **migração completa para cloud** de um cliente, da avaliação das aplicações à execução, com planos de testes pré e pós-migração que reduziram o downtime ao mínimo",
        "Automação de testes de regressão de UI cross-browser e cross-device em Playwright e Selenium, em substituição de ciclos repetitivos de regressão manual",
        "Testes manuais funcionais, de regressão e de integração, com consultas SQL para validar a integridade dos dados em migrações e releases",
        "Gestão de defeitos no Jira, da triagem ao fecho, e feedback de UI/UX às equipas de desenvolvimento para melhorar a usabilidade",
      ],
    },
  ],

  projects: [
    {
      name: "appdoivo",
      href: "https://github.com/githubdoivo/appdoivo",
      demo: "https://appdoivo-demo.fly.dev",
      tests: "https://github.com/githubdoivo/appdoivo-e2e",
      story: "writing/flaky-ci.html",
      kind: "Projeto pessoal · PWA usada por ~50 pessoas num evento real",
      blurb: "Uma app de festa construída e testada como um sistema de produção deve ser: primeiro os quality gates, depois as funcionalidades.",
      stack: ["Node.js", "Playwright (WebKit)", "node:test", "GitHub Actions", "SQLite", "Fly.io", "Web Push"],
      points: [
        "**263 testes automatizados**: API/lógica, UI num browser real em ecrãs de iPhone SE / 13 / Pro Max, e as proteções da demo pública",
        "Hook de pre-commit e **GitHub Actions** correm a suite completa; nada entra no main com testes a falhar",
        "**Ambiente de QA** separado, com base de dados que se reinicia, dados de demonstração e feature flags só de QA",
        "Acesso por perfis (owner / admin / pessoa convidada), chaves com hash e encriptadas, login com rate limiting",
        "Diagnóstico de uma **suite de CI instável** (browsers em paralelo a esgotar um runner de 2 cores), resolvida com medições",
      ],
    },
  ],

  skills: [
    { group: "Automação de Testes", items: ["Playwright", "Selenium", "Cucumber", "RestAssured", "Testcontainers"] },
    { group: "Testes de API e Performance", items: ["Postman", "REST APIs", "Artillery"] },
    { group: "Tipos de Teste", items: ["Manual", "Funcional", "Regressão", "End-to-End (E2E)", "UI", "Cross-Browser", "API", "Integração", "System Integration Testing (SIT)", "Orientados a Eventos", "Contrato", "Orientados a Dados", "RBAC", "Performance/Carga (pico, soak, capacidade)", "Não Funcionais (NFR)"] },
    { group: "Desenho e Gestão de Testes", items: ["Planos de Teste", "Desenho de Casos de Teste", "Rastreabilidade de Requisitos", "Bug Tracking", "Ciclo de Vida de Defeitos", "Jira", "Xray", "Confluence"] },
    { group: "Bases de Dados e Mensagens", items: ["PostgreSQL", "Kafka"] },
    { group: "CI/CD e Quality Gates", items: ["Git", "GitHub Actions", "GitLab CI", "SonarQube", "CI/CD"] },
    { group: "Contentores, Plataformas e Monitorização", items: ["Docker", "OpenShift", "Coralogix"] },
    { group: "Cloud", items: ["AWS", "Azure", "Oracle Cloud"] },
    { group: "Metodologias", items: ["Agile/Scrum", "Behaviour-Driven Development (BDD)", "Estratégia de Testes", "Testes Assistidos por IA", "Onboarding e Capacitação de Equipas"] },
  ],

  ui: {
    pageTitle: "Ivo Lopes · QA Automation Engineer",
    present: "Atual",
    current: "atual",
    more: (n) => `+ ${n} mais`,
    less: "− mostrar menos",
    about: "Sobre", experience: "Experiência", projects: "Projetos", toolkit: "Ferramentas", contact: "Contacto",
    getInTouch: "Entrar em contacto", viewPaper: "Ver CV numa página",
    contactLead: "À procura de alguém que garanta a qualidade de ponta a ponta? Vamos falar.",
    copyEmail: "Copiar email", copied: "Copiado ✓",
    tryDemo: "Experimentar a demo ↗", code: "Código no GitHub ↗", tests: "Testes E2E (Playwright + Cucumber) ↗", readStory: "Ler: como resolvi uma suite de CI instável (em inglês) →",
    liveDemo: "demo",
    footerChecks: "Todos os testes passaram ✓",
    web: "Web", paper: "Papel", page: "Página 1 / 1", back: "← Voltar ao site", download: "Descarregar PDF",
    pdfFile: "ivo-lopes-cv-pt.pdf", pdfName: "Ivo Lopes CV (PT).pdf",
    sSummary: "Resumo", sExperience: "Experiência", sSkills: "Competências", sProject: "Projeto",
    running: "● A CORRER", passed: "✓ PASSOU", runningTests: (n) => `A correr ${n} testes com 3 workers`, passedCount: (n) => `${n} passaram`,
    switchLang: "EN", switchLangLabel: "View in English",
    themeLabel: "Alternar tema claro ou escuro",
  },
};
