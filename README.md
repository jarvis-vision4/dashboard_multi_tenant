# Novanox SaaS — Frontend

Multi-tenant SaaS dashboard built with [Next.js 15](https://nextjs.org/).

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS 3 |
| Forms | react-hook-form + zod |
| State | Zustand (persisted) |
| Data Fetching | SWR |
| HTTP Client | Axios |

## Getting Started

```bash
cp .env.example .env.local
npm install
npm run dev
```

Runs on `http://localhost:3001`.

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:3000` | Backend API base URL |
| `NEXT_PUBLIC_APP_NAME` | `Novanox SaaS` | App display name |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3001` | Public app URL |

## Project Structure

```
src/
├── app/               # Next.js App Router pages
│   ├── auth/          # Login / Register
│   ├── dashboard/     # Main dashboard
│   ├── jobs/          # Background jobs
│   ├── settings/      # User settings
│   ├── subscriptions/ # Subscription management
│   ├── tenants/       # Tenant CRUD
│   ├── users/         # User management
│   └── webhooks/      # Webhook endpoints
├── components/
│   ├── forms/         # Form components
│   ├── layout/        # Header, Sidebar, AuthLayout, AppLayout
│   └── ui/            # Reusable UI primitives
├── hooks/             # SWR data hooks (useTenants, useUsers, etc.)
├── lib/               # API client, utilities
├── store/             # Zustand stores
└── types/             # TypeScript types & enums
```

## Key Features

- **Multi-tenant** — every API call sends `x-tenant-id` header (from URL `?tenantId=` query param)
- **JWT auth** — access + refresh token flow with automatic silent refresh
- **Role-based UI** — SUPER_ADMIN, TENANT_ADMIN, MEMBER, VIEWER
- **SWR caching** — automatic revalidation & optimistic updates

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server on port 3001 |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run type-check` | Run TypeScript check |
| `npm test` | Run Jest tests |

## API

The app proxies `/api/*` requests to the backend via Next.js rewrites (configured in `next.config.js`). The backend API documentation is available at `/api/docs` when the backend is running.
