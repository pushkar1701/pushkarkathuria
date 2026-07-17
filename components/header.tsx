"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { navLinks, siteConfig } from "@/content/site";
import { Button } from "@/components/ui/button";
import { LinkButton } from "@/components/link-button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-border/60 bg-background/80 backdrop-blur-xl"
          : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="font-heading text-lg font-bold tracking-tight transition-opacity hover:opacity-80"
        >
          PK<span className="text-brand">.</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
          <Link
            href="/blog"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Blog
          </Link>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <LinkButton href={siteConfig.linkedin} variant="outline" size="sm">
            LinkedIn
          </LinkButton>
          <LinkButton href={`mailto:${siteConfig.email}`} size="sm">
            Email
          </LinkButton>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            className="md:hidden"
            render={
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu />
              </Button>
            }
          />
          <SheetContent side="right" className="w-72">
            <SheetHeader>
              <SheetTitle className="font-heading text-left">
                {siteConfig.name}
              </SheetTitle>
            </SheetHeader>
            <nav className="mt-8 flex flex-col gap-4" aria-label="Mobile">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="text-lg font-medium transition-colors hover:text-brand"
                >
                  {link.label}
                </a>
              ))}
              <Link
                href="/blog"
                onClick={() => setOpen(false)}
                className="text-lg font-medium transition-colors hover:text-brand"
              >
                Blog
              </Link>
              <a
                href={`mailto:${siteConfig.email}`}
                className="text-lg font-medium text-brand"
              >
                Email me
              </a>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
