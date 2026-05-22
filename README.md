# Gradient Lead Hub

A React + TypeScript CRM-style lead management app built with Vite, Tailwind CSS, Supabase Auth, and React Query.

## Features

- Email/password authentication with Supabase
- Protected routes for authenticated users
- Dashboard, leads, add lead, analytics, and settings pages
- Responsive UI with component-based layout
- Client-side routing using HashRouter

## Tech Stack

- React 18
- TypeScript
- Vite 5
- Tailwind CSS
- Supabase JS
- TanStack React Query
- Framer Motion
- Vitest + Playwright

## Prerequisites

- Node.js 18+
- npm 9+
- A Supabase project

## Setup

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables in `.env`:

```env
VITE_SUPABASE_URL="https://YOUR_PROJECT_REF.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="YOUR_SUPABASE_ANON_OR_PUBLISHABLE_KEY"
# Optional:
VITE_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"
VITE_SUPABASE_PROJECT_ID="YOUR_PROJECT_REF"
```

3. Start development server:

```bash
npm run dev
```

## Scripts

- `npm run dev` - Start local development server
- `npm run build` - Build production bundle
- `npm run build:dev` - Build using development mode
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint
- `npm run test` - Run Vitest once
- `npm run test:watch` - Run Vitest in watch mode

## Project Structure

```text
src/
  components/
  contexts/
  hooks/
  lib/
  pages/
  test/
```

## Authentication Notes

- Auth is handled in `src/contexts/AuthContext.tsx`.
- Supabase client is initialized in `src/lib/supabase.ts`.
- Login/sign-up UI is in `src/pages/LoginPage.tsx`.

## Routing Notes

This app uses `HashRouter`, which works well for static hosting (including GitHub Pages) without server-side route rewrites.

## Deployment Note (GitHub Pages)

`vite.config.ts` currently sets:

```ts
base: "/leadcrm2/"
```

If deploying under a different repository name/path, update `base` to match your actual GitHub Pages subpath.

Also make sure `VITE_SUPABASE_URL` and the Supabase anon/publishable key are available during the production build, because GitHub Pages cannot read local `.env` files at runtime.

## Troubleshooting

### Login shows "Failed to fetch"

This usually means your app cannot reach Supabase at all.

Checklist:

1. Verify `VITE_SUPABASE_URL` points to an existing project URL from Supabase Dashboard.
2. Verify anon/publishable key is from the same project.
3. Restart the dev server after editing `.env`.
4. Confirm DNS resolves your project host:

```powershell
Resolve-DnsName YOUR_PROJECT_REF.supabase.co
```

If DNS fails, the project URL is invalid, deleted, or not reachable from your network.

## License

Private project for learning and development use.
