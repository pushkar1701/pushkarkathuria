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
    "Senior Frontend Engineer and UI Architect with 14 years building scalable React applications, design systems, and enterprise SaaS. Available for remote and relocation roles.",
  keywords: [
    "Pushkar Kathuria",
    "Senior Frontend Engineer",
    "Staff Frontend Engineer",
    "UI Architect",
    "Frontend Technical Lead",
    "React",
    "TypeScript",
    "Design Systems",
    "Delhi NCR",
    "Remote Frontend Engineer",
  ],
} as const;

export const hero = {
  headline: "Frontend Technical Lead & UI Architect",
  subheadline:
    "14 years building scalable, accessible UI systems across SaaS, enterprise, e-commerce, and media — from design systems to data visualization.",
  availability: "Open to Senior / Staff Frontend & UI Architect roles · Remote or Relocation",
} as const;

export const about = {
  summary:
    "I'm a frontend technical lead who bridges Product, Design, and Engineering to ship performant, accessible products. I specialize in React/TypeScript architecture, custom design systems, and leading teams through complex delivery — without losing craft.",
  superpowers: [
    {
      title: "UI Architecture & Design Systems",
      description: "Custom component libraries adopted across product teams.",
    },
    {
      title: "Product / Design / Engineering Bridge",
      description: "Translating UX flows into scalable, release-ready frontend.",
    },
    {
      title: "Accessibility & Performance",
      description: "WCAG audits, Lighthouse optimization, and quality standards.",
    },
    {
      title: "End-to-End Product Delivery",
      description: "SaaS dashboards, auth flows, data viz, and mobile apps.",
    },
  ],
} as const;

export const projects = [
  {
    slug: "datalogz",
    title: "Datalogz BI Ops SaaS",
    company: "Datalogz",
    metric: "Built 15–20 component design system & own 7 product areas",
    description:
      "Founding engineer on an enterprise BI Ops platform — dashboards, data visualization, auth, real-time WebSocket updates, and graph visualization.",
    tags: ["React", "TypeScript", "Tailwind", "D3.js", "Design Systems"],
    url: "https://www.datalogz.io/",
    featured: true,
    span: "lg" as const,
  },
  {
    slug: "semiconductor-redesign",
    title: "Global Semiconductor Redesign",
    company: "Deloitte India (Offices of the US)",
    metric: "Co-led 20 developers for global migration & pre-sales POC",
    description:
      "Co-led frontend track for a 50+ member program — navigation, Algolia search, PLP/PDP, landing pages, and analytics instrumentation.",
    tags: ["React", "Enterprise", "Technical Leadership"],
    featured: true,
    span: "md" as const,
  },
  {
    slug: "marriott-bonvoy",
    title: "Marriott Bonvoy Website",
    company: "Deloitte India (Offices of the US)",
    metric: "Led 4-person frontend team across 8,800+ hotel sites",
    description:
      "Built reusable AEM-ready UI components with object-oriented JavaScript, Handlebars, and SCSS for a large-scale hospitality platform.",
    tags: ["AEM", "JavaScript", "SCSS", "Component Libraries"],
    featured: true,
    span: "md" as const,
  },
  {
    slug: "charter-ott",
    title: "Charter Web & Samsung OTT",
    company: "Cognizant",
    metric: "4 web & TV apps for live and on-demand streaming",
    description:
      "React and Angular OTT applications with Samsung TV remote navigation, focus handling, and interactive dashboards.",
    tags: ["React", "Angular", "OTT", "Highcharts"],
    featured: false,
    span: "sm" as const,
  },
  {
    slug: "bonafide-losers",
    title: "Bonafide Losers",
    company: "Personal",
    metric: "Shipped 5 iOS apps using Flutter & AI tools",
    description:
      "Independent mobile product studio — end-to-end app design, development, and App Store delivery.",
    tags: ["Flutter", "iOS", "AI-assisted Dev"],
    url: "https://bonafide-losers.vercel.app/apps",
    featured: true,
    span: "sm" as const,
  },
] as const;

export const experience = [
  {
    id: "datalogz",
    company: "Datalogz",
    role: "Frontend Engineer",
    dates: "Apr 2024 — Present",
    location: "Gurugram, India · Remote (US / India)",
    context: "Enterprise BI Ops SaaS · React · TypeScript · Design Systems · Data Visualization",
    highlights: [
      "Build and maintain core UI for an enterprise-grade BI Ops platform used to monitor, govern, and optimize analytics environments.",
      "Work directly with design, product, and backend teams to ship scalable, accessible, and performant frontend features.",
      "Lead refactoring initiatives to improve component reusability and reduce technical debt.",
      "Actively involved in UX discussions, accessibility compliance, and monthly UI quality enhancements.",
      "Built a 15–20 component design system adopted across dashboards, auth, alerts, WebSockets, and data visualization.",
    ],
    featured: true,
  },
  {
    id: "deloitte-senior-consultant",
    company: "Deloitte India (Offices of the US)",
    role: "Senior Consultant",
    dates: "Jun 2021 — Apr 2024",
    location: "Hyderabad, India",
    context: "Frontend Technical Leadership · Enterprise Web · CMS · eCommerce · Analytics",
    highlights: [
      "Co-led frontend for a global semiconductor client redesign — 20 developers in a 50+ member program (Analog Devices / Sitecore CMS).",
      "Led UI revamp for 8,800+ Marriott Bonvoy hotel websites with reusable AEM-ready components.",
      "Delivered major UI for semiconductor platform: global navigation, Algolia search, PLP/PDP, landing pages, and analytics.",
      "Senior contributor on New Balance eCommerce (Salesforce Commerce Cloud) for US & Canada.",
      "Built Vue.js application for Spirit AeroSystems to streamline internal operations and data visualization.",
      "Contributed to Charter CTeP Analytics and PC2 internal tools with Highcharts dashboards.",
      "Oversaw sprint planning, code reviews, mentoring, and component ownership across multiple client tracks.",
    ],
    featured: true,
  },
  {
    id: "deloitte-consultant",
    company: "Deloitte India (Offices of the US)",
    role: "Consultant",
    dates: "Apr 2019 — Jun 2021",
    location: "Hyderabad, India",
    context: "Frontend Development · Team Management · Product UI Redesign",
    highlights: [
      "Led frontend delivery across enterprise web, CMS, e-commerce, and internal analytics initiatives.",
      "Collaborated with product and design to implement accessible, performant frontend modules at scale.",
      "Integrated REST APIs and optimized eCommerce page loading while maintaining consistent UI/UX patterns.",
      "Sole developer for a US telecom/media analytics portal using AngularJS, Highcharts, and REST APIs.",
    ],
    featured: false,
  },
  {
    id: "rsystems",
    company: "RSystems",
    role: "Senior Software Engineer",
    dates: "Dec 2018 — Mar 2019",
    location: "Noida Area, India",
    context: "Healthcare SaaS · Angular · SCSS",
    highlights: [
      "Developed UI components for WebPT clinical interfaces with modular Angular and SCSS architecture.",
      "Contributed to sprint reviews, form validation workflows, and design scalability.",
    ],
    featured: false,
  },
  {
    id: "cognizant",
    company: "Cognizant Technology Solutions",
    role: "Associate",
    dates: "May 2016 — Dec 2018",
    location: "Noida Area, India",
    context: "OTT Platforms · React · Angular · Samsung TV · Data Visualization",
    highlights: [
      "Delivered 4 web and Samsung TV OTT applications for Charter and HBO (live and on-demand streaming).",
      "Built interactive dashboards for internal teams to analyze customer network usage and sentiment data.",
      "Implemented Samsung TV remote-control navigation and focus-handling for large-screen UX.",
      "Technologies: Angular 1.3/7, ReactJS, BackboneJS, Highcharts.",
    ],
    featured: false,
  },
  {
    id: "dmi",
    company: "DMI (Digital Management, Inc.)",
    role: "Associate Software Engineer",
    dates: "Jul 2015 — May 2016",
    location: "Noida Area, India · Onsite Mexico",
    context: "Sencha Ext JS · Sencha Touch · Enterprise Mobility",
    highlights: [
      "Developed Cemex Order Management System using Sencha Ext JS and Sencha Touch.",
      "Engaged directly with clients onsite in Mexico for product training and feedback alignment.",
    ],
    featured: false,
  },
  {
    id: "magna-infotech",
    company: "Magna Infotech Ltd.",
    role: "Junior Software Engineer",
    dates: "Oct 2014 — Jul 2015",
    location: "Gurugram, India",
    context: "Deputed at Sapient · IBM Worklight · Hybrid Mobile",
    highlights: [
      "Developed and maintained hybrid mobile applications on IBM Worklight for Sapient's internal GSS team.",
      "Built Transport Management App using IBM Worklight and jQuery.",
    ],
    featured: false,
  },
  {
    id: "basware-consultant",
    company: "Basware",
    role: "Associate Support Consultant",
    dates: "Mar 2014 — Aug 2014",
    location: "Chandigarh Area, India",
    context: "Technical Support · Enterprise Workflow Products",
    highlights: [
      "Handled issues and implemented amendments in the Basware Mobile app (Android) per business needs.",
      "Provided ticket-based service support, diagnosed ad-hoc delivery issues, and improved customer service index.",
    ],
    featured: false,
  },
  {
    id: "basware-trainee",
    company: "Basware",
    role: "Trainee",
    dates: "Sep 2013 — Feb 2014",
    location: "Chandigarh Area, India",
    context: "Technical Support · Mobile Applications",
    highlights: [
      "Supported enterprise email-based products and Basware Mobile app enhancements.",
      "Contributed to service delivery, implementation support, and client servicing workflows.",
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
    "Angular",
    "Tailwind CSS",
    "SCSS",
    "Component Architecture",
    "Design Systems",
    "Accessibility / WCAG",
  ],
  visualization: ["D3.js", "Sigma.js", "Highcharts", "Data Visualization"],
  leadership: [
    "Technical Leadership",
    "Code Reviews",
    "Sprint Planning",
    "Mentoring",
    "Cross-functional Collaboration",
  ],
  tools: [
    "Vite",
    "Jest",
    "React Testing Library",
    "Docker",
    "Git",
    "REST APIs",
    "WebSockets",
    "Lighthouse",
  ],
} as const;

export const recognition = [
  {
    title: "Deloitte Awards",
    detail: "2 Spot Awards and 1 Applause Award for delivery and leadership.",
  },
  {
    title: "Pre-Sales Success",
    detail: "Recognized for solutioning that secured a major global semiconductor client.",
  },
  {
    title: "GATE 2012",
    detail: "Qualified with 89.56 percentile.",
  },
  {
    title: "Bonafide Losers",
    detail: "Built and launched 5 iOS apps using Flutter and AI-assisted development.",
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
