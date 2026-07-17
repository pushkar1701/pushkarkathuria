# pushkarkathuria.com

Personal portfolio site for Pushkar Kathuria — Frontend Technical Lead & UI Architect.

Built with Next.js 16, TypeScript, Tailwind CSS v4, shadcn/ui, and Framer Motion.

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm start
```

## Routes

| Route | Description |
|-------|-------------|
| `/` | Portfolio home page |
| `/blog` | Blog shell (ready for future MDX posts) |
| `/resume` | Resume PDF download |
| `/sitemap.xml` | SEO sitemap |
| `/robots.txt` | Crawler rules |

## Content

Edit [`content/site.ts`](content/site.ts) to update copy, projects, experience, and skills.

Future blog posts: add MDX files to `content/blog/` and extend `lib/blog.ts`.

## Deploy to Vercel

1. Push this repo to GitHub:
   ```bash
   gh repo create pushkarkathuria.com --public --source=. --remote=origin --push
   ```

2. Import the repo at [vercel.com/new](https://vercel.com/new).

3. Add custom domain `pushkarkathuria.com` in Vercel → Project → Settings → Domains.

4. At your domain registrar, set DNS per Vercel:
   - `A` record: `@` → `76.76.21.21`
   - `CNAME` record: `www` → `cname.vercel-dns.com`

5. After DNS propagates, verify SSL and test all routes.

6. Submit `https://pushkarkathuria.com/sitemap.xml` in [Google Search Console](https://search.google.com/search-console).

## SEO

- JSON-LD Person + ProfilePage schema
- Open Graph image at `/opengraph-image`
- Canonical URLs and meta keywords for frontend engineering roles
