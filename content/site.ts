export const siteConfig = {
  name: "Pushkar Kathuria",
  url: "https://pushkarkathuria.com",
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
    company: "Deloitte USI",
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
    company: "Deloitte USI",
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
    company: "Datalogz",
    role: "Founding Engineer / UI Technical Lead",
    dates: "Apr 2024 — Present",
    location: "Remote · US / India",
    context: "Enterprise BI Ops SaaS · React · TypeScript · Design Systems",
    highlights: [
      "Technical lead in a 15-member product team — architecture, sprint planning, code reviews, mentoring.",
      "Built a 15–20 component design system adopted across the engineering org.",
      "Own frontend across 6–7 product areas: dashboards, reports, auth, alerts, WebSockets, data viz.",
      "Monthly accessibility audits and UI quality enhancements.",
    ],
    featured: true,
  },
  {
    company: "Deloitte USI",
    role: "Senior Consultant",
    dates: "Apr 2019 — Mar 2024",
    location: "Delhi, India",
    context: "Enterprise Web · CMS · eCommerce · Analytics",
    highlights: [
      "Co-led frontend for global semiconductor redesign — 20 devs in a 50+ member program.",
      "Led 5-member team for Marriott Bonvoy AEM component library at scale.",
      "Senior contributor on New Balance eCommerce (Salesforce Commerce Cloud).",
      "Sole developer for Charter analytics portal with Highcharts dashboards.",
    ],
    featured: true,
  },
  {
    company: "RSystems",
    role: "Senior Software Engineer",
    dates: "Dec 2018 — Mar 2019",
    location: "Delhi, India",
    context: "Healthcare SaaS · Angular · SCSS",
    highlights: [
      "Developed UI components for WebPT clinical interfaces with modular Angular architecture.",
    ],
    featured: false,
  },
  {
    company: "Cognizant Technology Solutions",
    role: "Associate",
    dates: "May 2016 — Dec 2018",
    location: "Delhi, India",
    context: "OTT Platforms · React · Angular · Samsung TV",
    highlights: [
      "Delivered 4 web & TV OTT applications for Charter and HBO.",
      "Implemented Samsung TV remote-control navigation and focus handling.",
    ],
    featured: false,
  },
  {
    company: "DMI Innovations",
    role: "Software Engineer",
    dates: "Jul 2015 — May 2016",
    location: "Delhi · Onsite Mexico",
    context: "Sencha Ext JS · Enterprise Mobility",
    highlights: [
      "Built Cemex Order Management System; led onsite client coordination in Mexico.",
    ],
    featured: false,
  },
  {
    company: "Sapient India",
    role: "Software Engineer",
    dates: "Oct 2014 — Jul 2015",
    location: "Delhi, India",
    context: "IBM Worklight · Hybrid Mobile",
    highlights: ["Transport Management App with IBM Worklight and jQuery."],
    featured: false,
  },
  {
    company: "Basware Corporation",
    role: "Associate Support Consultant",
    dates: "Sep 2013 — Aug 2014",
    location: "Delhi, India",
    context: "Enterprise Workflow Products",
    highlights: ["Technical support for enterprise email-based products."],
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
