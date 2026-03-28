# CLAUDE.md — Cvoir Studio

## Project identity
- **Company**: Cvoir Studio
- **Services**: Photography / Videography · Web Development
- **Tagline**: "Vision, Captured. Crafted."
- **Tone**: Luxury-editorial, minimal, confident — never loud or cluttered

## Deployment
use existing connection to github,supabase, and vercel.

## Repository layout
```
cvoir-studio/
├── apps/
│   └── web/                  # Next.js 15 site (this repo)
├── packages/
│   └── ui/                   # Shared shared shadcn/ui components
├── sanity/                   # Sanity Studio (CMS)
├── public/                   # Static assets
└── CLAUDE.md
```

## Tech stack (non-negotiable)
| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js 15 App Router | Server components by default |
| Language | TypeScript 5 (strict) | No `any`, no implicit any |
| Styling | Tailwind CSS v4 | CSS variables design system |
| Components | shadcn/ui (New York style) | Extend, don't override |
| Animation | Framer Motion 11 | Page transitions + scroll reveals |
| CMS | Sanity v3 | Hosted, GROQ queries |
| Images | next/image + Cloudinary | All media through Cloudinary |
| Forms | React Hook Form + Zod | Validated on client and server |
| Email | Resend | Contact form delivery |
| Analytics | PostHog | Client-side, privacy-first |
| Testing | Vitest + Playwright | Unit + e2e |

## Code conventions
- **File naming**: `kebab-case` for files/folders, `PascalCase` for components
- **Imports**: absolute paths via `@/` alias, no relative `../../../`
- **Server vs Client**: default to Server Components; add `'use client'` only when
  state, browser APIs, or event handlers are needed
- **Data fetching**: use `fetch` with `next: { revalidate }` or `cache: 'no-store'`
  in Server Components; never fetch in Client Components unless it's user-triggered
- **Error handling**: every async function must have try/catch; use `error.tsx` and
  `not-found.tsx` at every route segment
- **Env vars**: access only through `src/lib/env.ts` (validated with Zod at startup)
- **Commits**: Conventional Commits format (`feat:`, `fix:`, `chore:`, etc.)

## Design system
- **Palette**: Obsidian `#0A0A0A` · Ivory `#F5F0E8` · Brass `#B8922A` · Slate `#6B7280`
- **Fonts**: `Plus Jakarta Sans` (display/headings) · `DM Sans` (body/UI)
- **Navigation**: always translucent (`backdrop-blur-md bg-obsidian/60`), Obsidian/Ivory/Slate palette only
- **Hero**: 70vh height (not full viewport)
- **Motion**: page enter = 600ms ease-out fade+slide; hover = 200ms; no motion
  when `prefers-reduced-motion: reduce`
- **Grid**: 12-column, 80px gutters on desktop, 24px on mobile
- **Breakpoints**: sm 640 · md 768 · lg 1024 · xl 1280 · 2xl 1536

## Accessibility
- WCAG 2.1 AA minimum
- All images: meaningful `alt` text (never empty unless decorative)
- Focus rings: always visible, branded (Brass color)
- Keyboard navigation: full support on nav, modals, galleries

## Performance targets
- Lighthouse score: 95+ on all pages
- LCP < 2.5s · CLS < 0.1 · INP < 200ms
- All images: WebP/AVIF via Cloudinary, `sizes` prop always set
- No layout shift from fonts: use `next/font` with `display: swap`

## Environment variables required
```
# .env.local
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
RESEND_API_KEY=
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

## DO NOT
- Use `pages/` router
- Use `getServerSideProps` or `getStaticProps`
- Import Framer Motion in Server Components
- Hard-code any content that should come from Sanity
- Use `<img>` — always `next/image`
- Commit `.env.local` or secrets
