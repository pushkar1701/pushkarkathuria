# Deployment Guide — pushkarkathuria.com

The site is built and ready to deploy. Vercel CLI requires authentication on your machine.

## Option A: Vercel Dashboard (recommended)

1. Create a GitHub repo and push this project:
   ```bash
   cd /Users/pushkarkathuria/Projects/Personal/pushkarkathuria
   git remote add origin git@github.com:pushkar1701/pushkarkathuria.com.git
   git add -A && git commit -m "Initial portfolio site"
   git push -u origin main
   ```

2. Go to [vercel.com/new](https://vercel.com/new) → Import the repo.

3. Deploy with default Next.js settings (no env vars needed).

4. In Vercel → Project → Settings → Domains, add:
   - `pushkarkathuria.com`
   - `www.pushkarkathuria.com`

5. At your domain registrar, set DNS:
   | Type | Name | Value |
   |------|------|-------|
   | A | `@` | `76.76.21.21` |
   | CNAME | `www` | `cname.vercel-dns.com` |

6. Wait for DNS propagation (up to 48h, usually minutes).

7. Verify:
   - https://pushkarkathuria.com
   - https://pushkarkathuria.com/blog
   - https://pushkarkathuria.com/resume
   - https://pushkarkathuria.com/sitemap.xml

8. Submit sitemap in [Google Search Console](https://search.google.com/search-console).

## Option B: Vercel CLI

```bash
cd /Users/pushkarkathuria/Projects/Personal/pushkarkathuria
vercel login
vercel --prod
vercel domains add pushkarkathuria.com
```

Then configure DNS as in step 5 above.

## Current domain status

`pushkarkathuria.com` currently returns **403 Forbidden** — likely parked or pointed to a host without a site. Updating DNS to Vercel will replace that.

## Post-deploy checklist

- [ ] SSL certificate active (green padlock)
- [ ] www redirects to apex (configured in `vercel.json`)
- [ ] Resume PDF downloads correctly
- [ ] Open Graph preview looks correct (share link on LinkedIn)
- [ ] Google Search Console property verified
