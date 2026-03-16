# Gather — Real connections. Real places. Real people.

> Built in response to the loneliness epidemic. In a world of endless scrolling and digital noise, Gather helps people find others to do real things with — in person, in their neighborhood, for real.

---

## Why This Exists

The US Surgeon General declared loneliness a public health epidemic in 2023. The health impact is equivalent to smoking 15 cigarettes a day. At the same time, we have more social platforms than ever.

The research is clear: **passive scrolling makes loneliness worse.** What actually works is shared activity, physical proximity, and repeated contact over time.

Gather is built on that research — and deliberately designed against every pattern that makes social media addictive.

- No algorithm. No feed. No likes. No followers.
- Activities, not profiles — hiking, cooking, board games, yoga.
- Small groups (max 8–12) — intimacy over scale.
- Recurring gatherings prioritized — friendship requires ~200 hours of shared time.
- Exact addresses private until you join — shared 24h before the event.

---

## Pages

| Route | Description |
|---|---|
| `/` | Landing page with animated manifesto, stats, testimonials, CTA |
| `/discover` | Filterable activity browser — category, search, size, time filters |
| `/activity/[id]` | Detail page — join flow, host info, spots gauge, safety notes |
| `/create` | 4-step host flow — category, details, community norms, preview |
| `/onboarding` | 5-step wizard — city, interests, group size, frequency, matched results |
| `/manifesto` | Essay on the loneliness epidemic and why Gather exists |
| `/how-it-works` | Step-by-step explainer and FAQ |

---

## Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org) (App Router)
- **Language:** TypeScript
- **Styling:** [Tailwind CSS](https://tailwindcss.com)
- **Icons:** [Lucide React](https://lucide.dev)
- **Fonts:** Fraunces (display) + Inter (body) via Google Fonts

No backend, no database, no auth — the current version uses local mock data in `app/data/activities.ts`. It's designed to be wired up to a real backend (see [Adding a Backend](#adding-a-backend) below).

---

## Local Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Setup

```bash
# Clone the repo
git clone <your-repo-url>
cd claude-connect

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Other Commands

```bash
npm run build    # Production build
npm run start    # Serve the production build locally
npm run lint     # Run ESLint
```

---

## Deployment

### Vercel (recommended — zero config)

1. Push to GitHub (or fork this repo)
2. Go to [vercel.com](https://vercel.com) and click **Add New Project**
3. Import your repository
4. Leave all settings as defaults — Vercel auto-detects Next.js
5. Click **Deploy**

That's it. Vercel handles builds, CDN, and preview deployments on every push.

**Custom domain:** In your Vercel project → Settings → Domains → add your domain.

---

### Netlify

1. Push to GitHub
2. Go to [app.netlify.com](https://app.netlify.com) → **Add new site** → **Import an existing project**
3. Connect your repo
4. Set build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `.next`
5. Click **Deploy site**

---

### Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

---

### Docker (self-hosted)

```dockerfile
FROM node:18-alpine AS base

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000
ENV NODE_ENV=production

CMD ["npm", "start"]
```

```bash
docker build -t gather-app .
docker run -p 3000:3000 gather-app
```

---

### Environment Variables

The current version has no required environment variables. When you add a backend, create a `.env.local` file in the project root:

```env
# Example — none required for the demo version
NEXT_PUBLIC_API_URL=https://your-api.com
DATABASE_URL=postgresql://...
```

`.env.local` is gitignored by default and never committed.

---

## Project Structure

```
claude-connect/
├── app/
│   ├── components/
│   │   ├── Nav.tsx           # Sticky navigation bar
│   │   └── ActivityCard.tsx  # Reusable activity listing card
│   ├── data/
│   │   └── activities.ts     # Mock data — activities, interests, stats
│   ├── activity/
│   │   └── [id]/page.tsx     # Activity detail page
│   ├── create/page.tsx       # Host a gathering — 4-step form
│   ├── discover/page.tsx     # Browse all gatherings
│   ├── how-it-works/page.tsx # Explainer + FAQ
│   ├── manifesto/page.tsx    # Why Gather exists
│   ├── onboarding/page.tsx   # New user interest wizard
│   ├── globals.css           # Global styles + Tailwind base
│   ├── layout.tsx            # Root layout + font loading
│   └── page.tsx              # Home / landing page
├── .gitignore
├── next.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── tsconfig.json
```

---

## Adding a Backend

The app is structured to make wiring up a real backend straightforward. Key integration points:

### Activities / Database

Replace the mock data in `app/data/activities.ts` with API calls. With Next.js App Router, server components can fetch directly:

```typescript
// app/discover/page.tsx — fetch from your API
async function getActivities() {
  const res = await fetch('https://your-api.com/activities', {
    next: { revalidate: 60 } // ISR: revalidate every 60s
  })
  return res.json()
}
```

### Recommended Stack Options

| Layer | Options |
|---|---|
| Database | Supabase (Postgres + Auth + realtime), PlanetScale, Neon |
| Auth | Supabase Auth, Clerk, NextAuth.js |
| ORM | Prisma, Drizzle |
| Email (address confirmations) | Resend, Postmark |
| Maps | Mapbox, Google Maps |
| File storage (host photos) | Cloudflare R2, Supabase Storage |

### Supabase Quick Start

```bash
npm install @supabase/supabase-js
```

```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
```

---

## Design Principles

Every design decision in this app is a deliberate inversion of what makes social media addictive:

| What social media does | What Gather does |
|---|---|
| Infinite scroll | Curated, finite list |
| Engagement optimization | IRL meetup optimization |
| Follower/like counts | No vanity metrics |
| Algorithmic feed | Chronological, local |
| Photo-first profiles | Activity-first listings |
| One-off viral moments | Recurring, repeated contact |
| Broadcast to everyone | Small groups only |
| Always-on, always accessible | Scheduled, time-bound events |

---

## Research Foundation

This app was built on current research into the loneliness epidemic:

- US Surgeon General Advisory on Loneliness (2023) — loneliness = 15 cigarettes/day health impact
- WHO Commission on Social Connection (2025) — 1 in 6 people affected globally
- Oregon State University (2025) — confirmed two-way feedback loop between social media use and loneliness
- Baylor University (2025) — both passive and active social media use independently linked to loneliness
- Dunbar/Oxford research — friendship requires ~200 hours of shared time
- Harvard MCC (2024) — adults 30–44 are the loneliest demographic in America

---

## Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push: `git push origin feature/your-feature`
5. Open a Pull Request

---

## License

MIT — use it, fork it, build on it. If you build something that helps people connect, that's the whole point.
