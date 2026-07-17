import { seo, siteConfig } from "@/content/site";

export function getPersonJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.name,
    url: siteConfig.url,
    email: siteConfig.email,
    jobTitle: "Frontend Technical Lead & UI Architect",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Gurugram",
      addressRegion: "Delhi NCR",
      addressCountry: "IN",
    },
    sameAs: [siteConfig.linkedin, siteConfig.github],
    knowsAbout: [
      "React",
      "TypeScript",
      "Frontend Architecture",
      "Design Systems",
      "Accessibility",
      "Data Visualization",
    ],
  };
}

export function getProfilePageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    name: seo.title,
    description: seo.description,
    url: siteConfig.url,
    mainEntity: {
      "@type": "Person",
      name: siteConfig.name,
    },
  };
}

export function getDefaultMetadata() {
  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: seo.title,
      template: `%s | ${siteConfig.name}`,
    },
    description: seo.description,
    keywords: [...seo.keywords],
    authors: [{ name: siteConfig.name, url: siteConfig.url }],
    creator: siteConfig.name,
    openGraph: {
      type: "website" as const,
      locale: "en_US",
      url: siteConfig.url,
      siteName: siteConfig.name,
      title: seo.title,
      description: seo.description,
    },
    twitter: {
      card: "summary_large_image" as const,
      title: seo.title,
      description: seo.description,
    },
    alternates: {
      canonical: siteConfig.url,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}
