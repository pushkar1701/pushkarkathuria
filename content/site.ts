export const siteConfig = {
  name: "Pushkar Kathuria",
  url: "https://www.pushkarkathuria.com",
  email: "pushkar1701@gmail.com",
  location: "Gurugram / Delhi NCR, India",
  linkedin: "https://www.linkedin.com/in/pushkar-kathuria-1701/",
  github: "https://github.com/pushkar1701",
} as const;

export const seo = {
  title: "Pushkar Kathuria - Frontend Technical Lead & UI Architect",
  description:
    "I build React and TypeScript products people actually enjoy using - design systems, dashboards, and enterprise UIs. Nearly 14 years in. Open to remote and relocation.",
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
    "I spend my days turning messy product ideas into clear, fast interfaces - design systems, dashboards, and the kind of UI that holds up when the team and the product grow.",
  availability: "Looking for Senior / Staff Frontend or UI Architect roles · Remote or relocate",
} as const;

export const about = {
  summary:
    "I've been building web UIs for nearly 14 years - SaaS, e-commerce, hotel sites, streaming apps, analytics tools. What I care about most is the space between product, design, and engineering: making sure the thing we ship is usable, accessible, and not a nightmare to maintain six months later.",
  superpowers: [
    {
      title: "Design systems that stick",
      description:
        "I build component libraries teams actually reuse - not slideware that dies after the first sprint.",
    },
    {
      title: "Leading without the noise",
      description:
        "I help teams ship: architecture chats, code reviews, mentoring, and keeping delivery honest.",
    },
    {
      title: "Accessibility & speed",
      description:
        "WCAG, Lighthouse, and the boring checks that make products feel solid for everyone.",
    },
    {
      title: "From idea to release",
      description:
        "Dashboards, auth, CMS, e-commerce, TV apps, mobile - I've taken features all the way through.",
    },
  ],
} as const;

export const projects = [
  {
    slug: "datalogz-bi-ops",
    title: "Datalogz BI Ops",
    company: "Datalogz",
    metric: "Design system and realtime dashboards for an enterprise analytics product",
    description:
      "As a founding engineer on the UI side, I shaped how the product looks and feels - dashboards, reports, auth, alerts, live updates, and graph views - so the team could build faster without reinventing every screen.",
    tags: ["React", "TypeScript", "Tailwind", "D3.js", "Sigma.js", "WebSockets"],
    url: "https://www.datalogz.io/",
    featured: true,
    span: "lg" as const,
  },
  {
    slug: "semiconductor-redesign",
    title: "Semiconductor site redesign",
    company: "Deloitte USI",
    metric: "A global product site rebuild - search, catalog pages, and a cleaner path for customers",
    description:
      "I helped drive the frontend for a Sitecore migration: navigation, Algolia search, listing and detail pages, landing modules, accessibility, and performance - alongside a large program across frontend, backend, QA, and analytics.",
    tags: ["Sitecore", "JavaScript", "Handlebars", "Algolia", "Lighthouse"],
    featured: true,
    span: "md" as const,
  },
  {
    slug: "hospitality-platform",
    title: "Hotel website platform",
    company: "Deloitte USI",
    metric: "Reusable AEM components for hotel sites that need to stay consistent at scale",
    description:
      "I led the frontend work on a shared component set - headers, heroes, galleries, dining modules, room cards - so hotel pages could look cohesive without every site inventing its own UI.",
    tags: ["AEM", "JavaScript", "Handlebars", "SCSS", "Accessibility"],
    featured: true,
    span: "md" as const,
  },
  {
    slug: "telecom-analytics-portal",
    title: "Telecom analytics portal",
    company: "Deloitte USI",
    metric: "Internal dashboards that made reporting less painful for the business",
    description:
      "I was the only frontend person on an AngularJS and Highcharts portal - filters, charts, exports, and the glue that let teams pull reports without waiting on another ticket.",
    tags: ["AngularJS", "Highcharts", "REST APIs", "Dashboards"],
    featured: false,
    span: "sm" as const,
  },
  {
    slug: "new-balance-ecommerce",
    title: "Athletic retail e-commerce",
    company: "Deloitte USI",
    metric: "Shopping flows that had to work on real devices, not just demos",
    description:
      "I worked on a Salesforce Commerce Cloud storefront - listing pages, product detail, cart, search, and filters - keeping the UI consistent across US and Canada experiences.",
    tags: ["Salesforce Commerce Cloud", "JavaScript", "jQuery", "SCSS"],
    featured: false,
    span: "sm" as const,
  },
  {
    slug: "ott-streaming",
    title: "Web & Samsung TV streaming",
    company: "Cognizant",
    metric: "Live TV and on-demand UI that works with a remote, not just a mouse",
    description:
      "I built React screens for streaming - live TV, VOD, player controls, profiles, watchlists - and spent real time getting Samsung TV focus and remote navigation to feel natural.",
    tags: ["React", "OTT", "Samsung TV", "Performance"],
    featured: false,
    span: "sm" as const,
  },
  {
    slug: "bonafide-losers",
    title: "Bonafide Losers",
    company: "Side projects",
    metric: "Five iOS puzzle apps shipped end to end - design through App Store",
    description:
      "ZippySum, OddZap, ColorRush IQ, FlashGrid, and RuleBlink. I did the UI, the builds, the support pages, and the polish. Earlier, one of my Android apps crossed 50K Play Store downloads before I retired it.",
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
    dates: "Apr 2024 - Present",
    location: "Remote / US–India",
    context: "Enterprise BI Ops SaaS · React · TypeScript · Design systems",
    highlights: [
      "I help steer frontend work on a small product team - architecture, planning, reviews, releases, and mentoring.",
      "I built a design system of about 15–20 components (React, TypeScript, Tailwind, SCSS) that the rest of engineering now uses.",
      "I own UI across most of the product: dashboards, reports, settings, users, auth, alerts, live updates, charts, and network graphs.",
      "Day to day I ship with React, Redux, D3, Sigma.js, REST, WebSockets, and a Vite-based toolchain with solid testing habits.",
      "I sit with product and design early so UX ideas turn into something we can actually ship and support.",
      "I keep chipping away at debt - refactors, SonarQube, less duplicate code, components that don't fight you later.",
      "I run regular accessibility checks and small monthly UI improvements so quality doesn't only show up at launch.",
    ],
    featured: true,
  },
  {
    id: "deloitte",
    company: "Deloitte USI",
    role: "Senior Consultant",
    dates: "Apr 2019 - Mar 2024",
    location: "Delhi, India",
    context: "Enterprise web · CMS · e-commerce · analytics",
    highlights: [
      "I led frontend delivery across several client programs - planning, reviews, mentoring, hiring help, and getting releases over the line.",
      "On a semiconductor site rebuild, I co-led the frontend with a large cross-functional group and helped keep navigation, search, catalog pages, and landing modules moving.",
      "That work covered Sitecore components, Handlebars, responsive layouts, Lighthouse-backed accessibility, performance, and fewer UI defects over time.",
      "For a hospitality client, I led a small frontend team building AEM-ready components hotels could reuse - headers, heroes, galleries, dining blocks, room cards.",
      "The goal was consistency: same building blocks, better performance, and AEM developers who didn't have to reinvent every page.",
      "On an athletic retail storefront (Salesforce Commerce Cloud), I worked through listing, detail, cart, search, and filters for US and Canada.",
      "I was the sole frontend developer on a telecom analytics portal - AngularJS, Highcharts, filters, exports - so internal teams could see the data themselves.",
      "I also spent a short stretch on a Vue.js app for an aerospace client: APIs, reusable components, responsive layout, and accessibility fixes.",
    ],
    featured: true,
  },
  {
    id: "rsystems",
    company: "RSystems",
    role: "Senior Software Engineer",
    dates: "Dec 2018 - Mar 2019",
    location: "Delhi, India",
    context: "Healthcare SaaS · Angular · SCSS",
    highlights: [
      "I helped with clinical dashboard UI on a healthcare SaaS product - Angular, SCSS, API wiring, bug fixes, and day-to-day maintenance.",
    ],
    featured: false,
  },
  {
    id: "cognizant",
    company: "Cognizant Technology Solutions",
    role: "Associate",
    dates: "May 2016 - Dec 2018",
    location: "Delhi, India",
    context: "React · Streaming apps · Web & Samsung TV",
    highlights: [
      "I built React streaming experiences for a US media client on web and Samsung TV - live TV, VOD, players, search, profiles, and watchlists.",
      "TV remotes are unforgiving; I spent a lot of time on focus order and navigation so the big-screen UX felt intentional.",
      "I also helped improve performance and keep components consistent across those screens.",
      "For a short stretch I worked on a React marketing preview portal for a premium entertainment brand.",
    ],
    featured: false,
  },
  {
    id: "dmi",
    company: "DMI Innovations India Pvt Ltd",
    role: "Software Engineer",
    dates: "Jul 2015 - May 2016",
    location: "Delhi, India · Onsite Mexico",
    context: "Sencha Ext JS · Sencha Touch · Mobile enterprise apps",
    highlights: [
      "I worked on a Sencha redesign of an order management system for a global building-materials company - web and mobile.",
      "I spent a week onsite in Mexico with the client to learn how the product was used in the real world, not just in tickets.",
    ],
    featured: false,
  },
  {
    id: "sapient",
    company: "Sapient India via Magna Infotech",
    role: "Software Engineer",
    dates: "Oct 2014 - Jul 2015",
    location: "Delhi, India",
    context: "IBM Worklight · jQuery · Hybrid mobile",
    highlights: [
      "I built screens for an internal transport management app on IBM Worklight and jQuery - forms, API calls, bug fixes, and small enhancements.",
    ],
    featured: false,
  },
  {
    id: "basware",
    company: "Basware Corporation",
    role: "Associate Support Consultant",
    dates: "Sep 2013 - Aug 2014",
    location: "Delhi, India",
    context: "Technical support · Enterprise workflow products",
    highlights: [
      "I started out in support - troubleshooting enterprise email and workflow products, closing tickets, and writing things down so the next person didn't have to guess.",
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
    title: "Deloitte awards",
    detail:
      "Two Spot Awards and an Applause Award for delivery and leadership - the kind of recognition that usually means the hard releases actually shipped.",
  },
  {
    title: "Helping win a big engagement",
    detail:
      "Deloitte leadership called out the pre-sales work I did on a semiconductor pitch: POC UI, demos, estimation, and helping the team understand what the client actually needed.",
  },
  {
    title: "GATE 2012",
    detail: "Cleared GATE with an 89.56 percentile.",
  },
  {
    title: "Bonafide Losers",
    detail:
      "Five iOS apps out in the world under my own label. Years earlier, an Android app of mine hit 50K+ downloads on the Play Store before I took it down.",
  },
] as const;

export const education = {
  degree: "B.Tech in Computer Science Engineering",
  school: "Echelon Institute of Technology",
  dates: "2008 - 2012",
  location: "Delhi NCR, India",
} as const;

export const navLinks = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
] as const;
