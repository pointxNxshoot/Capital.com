# Crystals Pilates — Website

A simple, elegant single-page "calling card" website for **Crystals Pilates**, a
boutique Pilates studio. Inspired by modern fitness-studio landing pages, with a
soft crystal/amethyst aesthetic.

## What's here

| File | Purpose |
|------|---------|
| `index.html` | The full page (nav, hero, classes, timetable, pricing, about, testimonials, contact, footer). |
| `styles.css` | All styling — responsive, light theme, animated reveals. |
| `script.js`  | Sticky nav, mobile menu, scroll-reveal, demo booking form. |

No build step, no dependencies (only Google Fonts loaded via CDN).

## View it locally

Just open the file:

```bash
open crystals-pilates/index.html      # macOS
xdg-open crystals-pilates/index.html  # Linux
```

Or serve it (recommended, so fonts/links behave):

```bash
cd crystals-pilates
python3 -m http.server 8080
# then visit http://localhost:8080
```

## Customising

- **Text & sections** — edit `index.html`.
- **Colours** — the palette lives in the `:root { … }` block at the top of `styles.css`
  (`--amethyst`, `--rose`, `--cream`, etc.).
- **Photos** — the hero and about panel currently use CSS gradients as placeholders.
  Drop in real studio photography by setting a `background-image` on `.hero__bg` and
  `.about__media` in `styles.css`.
- **Booking form** — `script.js` currently shows a friendly confirmation message with
  no backend. Wire the `submit` handler to your booking provider (Mindbody, Momence,
  Glofox, a form service, etc.) when ready.

## Deploy

It's fully static, so it works on any host — Netlify, Vercel, GitHub Pages,
Cloudflare Pages, or plain S3. Point the host at the `crystals-pilates/` folder.

### Vercel (from this repo)

The repo root is a separate Next.js app, so Vercel must be pointed at this
folder — otherwise it tries to build the wrong project.

1. On [vercel.com](https://vercel.com) → **Add New… → Project** → import this repo.
2. Under **Root Directory**, click **Edit** and choose `crystals-pilates`.
3. **Framework Preset** → **Other** (leave the Build Command empty, and the
   Output Directory blank). The `vercel.json` here handles the rest.
4. **Deploy.** You'll get a `*.vercel.app` URL; add a custom domain later under
   the project's **Domains** tab.

Every push to the branch redeploys automatically.

