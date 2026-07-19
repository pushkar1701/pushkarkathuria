import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, PenLine } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { LinkButton } from "@/components/link-button";
import { siteConfig } from "@/content/site";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Writing on frontend architecture, design systems, React, and UI craft by Pushkar Kathuria.",
  alternates: {
    canonical: `${siteConfig.url}/blog`,
  },
  openGraph: {
    title: `Blog | ${siteConfig.name}`,
    description:
      "Writing on frontend architecture, design systems, React, and UI craft.",
    url: `${siteConfig.url}/blog`,
  },
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-16 sm:pb-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <LinkButton
            href="/"
            variant="ghost"
            size="sm"
            className="mb-8 -ml-2"
          >
            <ArrowLeft data-icon="inline-start" />
            Back home
          </LinkButton>

          <p className="text-sm font-medium uppercase tracking-[0.2em] text-brand">
            Blog
          </p>
          <h1 className="mt-3 font-heading text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Things I want to write down
          </h1>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg">
            Short notes on React, design systems, accessibility, and how UI work
            actually gets done - when I get around to publishing them.
          </p>

          {posts.length === 0 ? (
            <div className="mt-12 flex flex-col items-center rounded-3xl border border-dashed border-border/80 bg-card/30 px-6 py-12 text-center sm:mt-16 sm:px-8 sm:py-16">
              <PenLine className="size-10 text-brand" />
              <h2 className="mt-4 font-heading text-xl font-semibold">
                Nothing here yet
              </h2>
              <p className="mt-2 max-w-md text-muted-foreground">
                The page is ready. The posts aren&apos;t. Check back later - or
                email me if you want to talk shop before then.
              </p>
              <LinkButton href="/#contact" className="mt-8">
                Say hello
              </LinkButton>
            </div>
          ) : (
            <ul className="mt-12 flex flex-col gap-6">
              {posts.map((post) => (
                <li key={post.slug}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="block rounded-2xl border border-border/80 p-5 transition-colors hover:border-brand/40 sm:p-6"
                  >
                    <time className="text-sm text-muted-foreground">
                      {post.date}
                    </time>
                    <h2 className="mt-2 font-heading text-xl font-semibold">
                      {post.title}
                    </h2>
                    <p className="mt-2 text-muted-foreground">
                      {post.description}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
