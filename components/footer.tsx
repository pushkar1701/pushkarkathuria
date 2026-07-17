import Link from "next/link";
import { siteConfig } from "@/content/site";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/60 bg-card/30">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-12">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-heading text-xl font-bold">{siteConfig.name}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Frontend Technical Lead & UI Architect
            </p>
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
            <a
              href={siteConfig.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground transition-colors hover:text-brand"
            >
              LinkedIn
            </a>
            <a
              href={siteConfig.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground transition-colors hover:text-brand"
            >
              GitHub
            </a>
            <Link
              href="/blog"
              className="text-muted-foreground transition-colors hover:text-brand"
            >
              Blog
            </Link>
            <a
              href="/resume"
              className="text-muted-foreground transition-colors hover:text-brand"
            >
              Resume
            </a>
          </div>
        </div>
        <Separator />
        <p className="text-sm text-muted-foreground">
          © {year} {siteConfig.name}. Built with Next.js & TypeScript.
        </p>
      </div>
    </footer>
  );
}
