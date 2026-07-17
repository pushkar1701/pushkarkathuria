export const siteConfig = {
  name: "Pushkar Kathuria",
  url: "https://www.pushkarkathuria.com",
  email: "pushkar1701@gmail.com",
  location: "Gurugram / Delhi NCR, India",
  linkedin: "https://www.linkedin.com/in/pushkar-kathuria-1701/",
  github: "https://github.com/pushkar1701",
} as const;

export const seo = {
  title: "Pushkar Kathuria — Frontend Technical Lead & UI Architect",
  description:
    "Frontend Technical Lead / UI Architect with nearly 14 years building scalable, accessible React applications, design systems, and enterprise SaaS. Open to remote and relocation.",
  keywords: [
    "Pushkar Kathuria",
    "Frontend Technical Lead",
    "UI Architect",
    "Senior Frontend Engineer",
    "Staff Frontend Engineer",
    "React",
    "TypeScript",
    "Design Systems",
    "Delhi NCR",
    "Remote Frontend Engineer",
  ],
} as const;

export const hero = {
  headline: "Frontend Technical Lead / UI Architect",
  subheadline:
    "Nearly 14 years building scalable, accessible, high-performance web applications across SaaS, enterprise platforms, e-commerce, analytics, and media.",
  availability:
    "Open to Senior / Staff Frontend & UI Architect roles · Remote & Relocation",
} as const;

export const about = {
  summary:
    "Frontend Technical Lead / UI Architect with nearly 14 years of experience building scalable, accessible, and high-performance web applications. Expert in React, TypeScript, component architecture, design systems, and frontend quality standards — with a track record of leading delivery, mentoring developers, and collaborating across product, design, backend, QA, and analytics.",
  superpowers: [
    {
      title: "Frontend Architecture & Design Systems",
      description:
        "Custom component libraries and UI architecture patterns adopted across product teams.",
    },
    {
      title: "Technical Leadership",
      description:
        "Leading frontend delivery, mentoring developers, code reviews, and cross-functional programs.",
    },
    {
      title: "Accessibility & Performance",
      description:
        "WCAG implementation, Lighthouse audits, and ongoing UI quality standards.",
    },
    {
      title: "Product Delivery at Scale",
      description:
        "SaaS dashboards, CMS platforms, e-commerce, OTT, analytics, and mobile products.",
    },
  ],
} as const;

export const projects = [
  {
    slug: "datalogz-bi-ops",
    title: "Enterprise BI Ops SaaS Platform",
    company: "Datalogz",
    metric: "Founding engineer & UI tech lead · 6–7 product areas",
    description:
      "Owned React/TypeScript frontend delivery across dashboards, reports, admin/settings, user management, authentication, alerts, realtime updates, data visualization, graph visualization, and a custom design system.",
    tags: ["React", "TypeScript", "Tailwind", "D3.js", "Sigma.js", "WebSockets"],
    url: "https://www.datalogz.io/",
    featured: true,
    span: "lg" as const,
  },
  {
    slug: "semiconductor-redesign",
    title: "Global Semiconductor Website Redesign & Migration",
    company: "Deloitte USI",
    metric: "Co-led 20 frontend developers in a 50+ member program",
    description:
      "Sitecore redesign/migration spanning frontend, backend, QA, and analytics — global navigation, Algolia search, PLP/PDP, landing pages, carousels, accessibility, and performance.",
    tags: ["Sitecore", "JavaScript", "Handlebars", "Algolia", "Lighthouse"],
    featured: true,
    span: "md" as const,
  },
  {
    slug: "hospitality-platform",
    title: "Global Hospitality Hotel Website Platform",
    company: "Deloitte USI",
    metric: "Led 5-member frontend track for large-scale AEM platform",
    description:
      "Built reusable AEM-ready components with OO JavaScript, Handlebars, and SCSS — header/footer, navigation, hero media, carousels, galleries, dining modules, and room-detail cards.",
    tags: ["AEM", "JavaScript", "Handlebars", "SCSS", "Accessibility"],
    featured: true,
    span: "md" as const,
  },
  {
    slug: "telecom-analytics-portal",
    title: "US Telecom/Media Analytics Portal",
    company: "Deloitte USI",
    metric: "Sole frontend developer for internal analytics platform",
    description:
      "AngularJS/Highcharts analytics portal with dashboards, filters, reports, REST API integrations, reusable components, and export/download workflows for business decision-making.",
    tags: ["AngularJS", "Highcharts", "REST APIs", "Dashboards"],
    featured: false,
    span: "sm" as const,
  },
  {
    slug: "new-balance-ecommerce",
    title: "North American Athletic Retailer eCommerce",
    company: "Deloitte USI",
    metric: "Senior frontend contributor · SFCC US & Canada",
    description:
      "Salesforce Commerce Cloud experience across PLP, PDP, cart, mini cart, search, filtering, sorting, header, footer, and responsive layouts using Vanilla JavaScript, jQuery, and SCSS.",
    tags: ["Salesforce Commerce Cloud", "JavaScript", "jQuery", "SCSS"],
    featured: false,
    span: "sm" as const,
  },
  {
    slug: "ott-streaming",
    title: "Web & Samsung TV OTT Applications",
    company: "Cognizant",
    metric: "React OTT for US telecom/media · web & Samsung TV",
    description:
      "Live TV streaming UI, VOD listings/details, player controls, search, profiles, watchlist/favorites, bookmarking, and Samsung TV remote-control navigation with focus handling.",
    tags: ["React", "OTT", "Samsung TV", "Performance"],
    featured: false,
    span: "sm" as const,
  },
  {
    slug: "bonafide-losers",
    title: "Bonafide Losers — Independent Product Work",
    company: "Personal",
    metric: "5 iOS apps · Flutter · AI-assisted development",
    description:
      "Built and launched ZippySum, OddZap, ColorRush IQ, FlashGrid, and RuleBlink — owning UI/UX, development, release readiness, support pages, and product positioning. Earlier Android work included an app with 50K+ Play Store downloads.",
    tags: ["Flutter", "iOS", "ChatGPT", "Cursor"],
    url: "https://bonafide-losers.vercel.app/apps",
    featured: true,
    span: "sm" as const,
  },
] as const;

export const experience = [
  {
    id: "datalogz",
    company: "Datalogz",
    role: "Founding Engineer / UI Technical Lead",
    dates: "Apr 2024 — Present",
    location: "Remote / US-India",
    context: "Enterprise BI Ops SaaS · React · TypeScript · Design Systems · Data Visualization",
    highlights: [
      "Act as a technical lead within a lean 15-member product team, guiding frontend delivery, architecture discussions, sprint planning, estimation, code reviews, task breakdown, release coordination, and developer mentoring.",
      "Built a custom design system with approximately 15–20 reusable components using React, TypeScript, Tailwind CSS, SCSS, and UI architecture patterns adopted across the product by the engineering team.",
      "Own frontend development across 6–7 major product areas, including dashboards, reports, admin/settings, user management, authentication flows, alerts, realtime WebSocket updates, data visualization, and graph/network visualization.",
      "Develop feature-rich UI experiences with React, TypeScript, Redux, D3.js, Sigma.js, REST APIs, authentication flows, WebSockets, React Testing Library, Vite, ESLint, Prettier, and npm.",
      "Partner with product, design, and backend teams to translate UI/UX flows into scalable, accessible, performant frontend features and release-ready product experiences.",
      "Drive ongoing performance improvements, duplicate-code reduction, and frontend maintainability through refactoring, SonarQube analysis, code-quality reviews, and reusable component patterns.",
      "Conduct recurring accessibility audits and implement monthly UI/accessibility enhancements to improve product usability and frontend quality standards.",
    ],
    featured: true,
  },
  {
    id: "deloitte",
    company: "Deloitte USI",
    role: "Senior Consultant",
    dates: "Apr 2019 — Mar 2024",
    location: "Delhi, India",
    context: "Frontend Technical Leadership · Enterprise Web Platforms · CMS · eCommerce · Analytics",
    highlights: [
      "Led frontend delivery across enterprise web, CMS, e-commerce, analytics, and internal platform initiatives — sprint planning, work allocation, estimation, code reviews, technical design, release coordination, mentoring, hiring support, and performance feedback.",
      "Co-led the frontend track for a global semiconductor client website redesign and migration, coordinating 20 frontend developers within a 50+ member cross-functional program spanning frontend, backend, QA, and analytics.",
      "Owned frontend execution for the semiconductor program across Sitecore templates/components, Vanilla JavaScript, Handlebars, responsive layouts, accessibility implementation/testing using Lighthouse, performance improvements, analytics integration, and frontend defect reduction.",
      "Delivered major UI areas for the semiconductor platform, including global header/navigation, Algolia-powered search, product listing pages, product detail pages, landing pages, carousel modules, responsive layouts, and analytics instrumentation.",
      "Led a 5-member frontend team for a global hospitality client, building reusable AEM-ready UI components using object-oriented JavaScript, Handlebars markup, and SCSS for a large-scale hotel website platform.",
      "Built hospitality UI modules including global header/footer, navigation, hero media sections, reusable carousels, photo galleries, property overview blocks, stylized image/media components, dining carousel modules, and room-detail cards with image carousels.",
      "Improved UI consistency, component reusability, AEM developer efficiency, responsive behavior, accessibility, page-performance quality, and major release delivery for the hospitality platform.",
      "Served as a senior frontend contributor for a North American athletic retailer e-commerce experience using Salesforce Commerce Cloud, Vanilla JavaScript, jQuery, and SCSS across PLP, PDP, cart, mini cart, search, filtering, sorting, header, footer, and responsive layouts.",
      "Worked as the sole developer for a US telecom/media client analytics portal using AngularJS, Highcharts, REST APIs, dashboards, filters, reports, reusable components, and export/download workflows.",
      "Contributed briefly to an aerospace manufacturing client Vue.js application, supporting REST API integrations, reusable Vue components, responsive layouts, performance improvements, and accessibility fixes.",
    ],
    featured: true,
  },
  {
    id: "rsystems",
    company: "RSystems",
    role: "Senior Software Engineer",
    dates: "Dec 2018 — Mar 2019",
    location: "Delhi, India",
    context: "Healthcare SaaS · Angular · SCSS",
    highlights: [
      "Briefly contributed to healthcare SaaS client interfaces using Angular and SCSS, supporting dashboard UI updates, REST API integration, bug fixing, and frontend maintenance.",
    ],
    featured: false,
  },
  {
    id: "cognizant",
    company: "Cognizant Technology Solutions",
    role: "Associate",
    dates: "May 2016 — Dec 2018",
    location: "Delhi, India",
    context: "React · OTT Platforms · Web & Samsung TV Applications",
    highlights: [
      "Worked as an individual contributor in a 3–5 member frontend team on React-based OTT applications for a US telecom/media client across web and Samsung TV platforms.",
      "Built features across live TV streaming UI, video-on-demand listings/details, player controls, search, user profiles, watchlist/favorites, bookmarking, API integrations, reusable React components, performance improvements, production bug fixes, and support.",
      "Implemented Samsung TV remote-control navigation and focus-handling interactions to improve the large-screen OTT user experience.",
      "Improved live/on-demand streaming UX, reusable component consistency, TV navigation behavior, and frontend performance across React-based OTT screens.",
      "Briefly contributed to a React-based marketing preview portal for a premium media and entertainment client.",
    ],
    featured: false,
  },
  {
    id: "dmi",
    company: "DMI Innovations India Pvt Ltd",
    role: "Software Engineer",
    dates: "Jul 2015 — May 2016",
    location: "Delhi, India · Onsite Mexico",
    context: "Sencha Ext JS · Sencha Touch · Enterprise Mobility · Client Exposure",
    highlights: [
      "Contributed as a junior frontend developer to a Sencha-based redesign for a global building materials client order management system across Sencha Ext JS web and Sencha Touch mobile applications.",
      "Traveled onsite to Mexico for a week-long client visit to understand application architecture, product workflows, implementation context, and stakeholder expectations.",
    ],
    featured: false,
  },
  {
    id: "sapient",
    company: "Sapient India via Magna Infotech",
    role: "Software Engineer",
    dates: "Oct 2014 — Jul 2015",
    location: "Delhi, India",
    context: "IBM Worklight · jQuery · Hybrid Mobile Applications",
    highlights: [
      "Worked on an internal transport management application using IBM Worklight and jQuery, contributing to mobile app UI development, hybrid mobile screens, API integration, forms/validation, bug fixing, maintenance, and internal tool enhancements.",
    ],
    featured: false,
  },
  {
    id: "basware",
    company: "Basware Corporation",
    role: "Associate Support Consultant",
    dates: "Sep 2013 — Aug 2014",
    location: "Delhi, India",
    context: "Technical Support · Enterprise Workflow Products",
    highlights: [
      "Provided technical support for enterprise email/workflow products, handling issue troubleshooting, resolution coordination, product workflow understanding, and team documentation.",
    ],
    featured: false,
  },
] as const;

export const skills = {
  frontend: [
    "React",
    "TypeScript",
    "JavaScript",
    "Redux",
    "Component Architecture",
    "Custom Design Systems",
    "Responsive UI",
    "Accessibility / WCAG",
    "UI/UX Implementation",
    "Tailwind CSS",
    "SCSS",
  ],
  visualization: ["D3.js", "Sigma.js", "Highcharts", "Handlebars", "Data Visualization"],
  platforms: [
    "AEM",
    "Sitecore",
    "Salesforce Commerce Cloud",
    "Angular",
    "AngularJS",
    "Vue.js",
    "jQuery",
    "Backbone.js",
    "Algolia",
    "Sencha Ext JS",
    "Sencha Touch",
    "IBM Worklight",
  ],
  leadership: [
    "Technical Leadership",
    "Code Reviews",
    "Agile Delivery",
    "Mentoring",
    "Sprint Planning",
    "Cross-functional Collaboration",
  ],
  tools: [
    "Vite",
    "Webpack",
    "npm",
    "Git",
    "Docker",
    "Jest",
    "React Testing Library",
    "SonarQube",
    "Lighthouse",
    "ESLint",
    "Prettier",
    "REST APIs",
    "WebSockets",
    "Authentication Flows",
    "Node.js",
    "GraphQL",
    "CI/CD",
  ],
} as const;

export const recognition = [
  {
    title: "Deloitte Spot & Applause Awards",
    detail:
      "Received 2 Spot Awards and 1 Applause Award at Deloitte USI for project delivery, frontend leadership, and team contribution.",
  },
  {
    title: "Pre-Sales & Solutioning Recognition",
    detail:
      "Recognized by Deloitte senior leadership for supporting pre-sales and solutioning that helped secure a major global semiconductor client — including frontend POC development, client demo support, solution architecture input, estimation, delivery planning, and discovery/requirements understanding.",
  },
  {
    title: "GATE 2012",
    detail: "Qualified GATE 2012 with 89.56 percentile.",
  },
  {
    title: "Bonafide Losers",
    detail:
      "Built and launched 5 iOS apps (ZippySum, OddZap, ColorRush IQ, FlashGrid, RuleBlink) using Flutter and AI-assisted tools. Earlier Android work included an app with 50K+ Play Store downloads.",
  },
] as const;

export const education = {
  degree: "B.Tech in Computer Science Engineering",
  school: "Echelon Institute of Technology",
  dates: "2008 — 2012",
  location: "Delhi NCR, India",
} as const;

export const navLinks = [
  { label: "About", href: "#about" },
  { label: "Work", href: "#work" },
  { label: "Experience", href: "#experience" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
] as const;
