# Minu Kitchen - Restaurant QR Ordering System

## Overview

This is the **frontend client** of a full-stack application that allows customers to scan a QR code at their table to order food, while staff and restaurant owners manage orders in real time.

---

## How It Works

**Main Flow:**

1. **Customer** scans the QR code at the table → receives a temporary Guest token → browses the menu → places an order
2. **Employee / Owner** logs in via email/password or Google OAuth → accesses the management dashboard
3. **Real-time**: When a customer places an order, staff receive an instant notification via Socket.io — no page refresh needed
4. **Token refresh**: Access tokens are short-lived and automatically renewed by the `RefreshToken` component when they expire

**Role-based Access:**

| Role     | Permissions                                              |
|----------|----------------------------------------------------------|
| Guest    | View menu, place orders, track order status              |
| Employee | + Manage orders and tables                               |
| Owner    | + Manage employee accounts, view analytics               |

---

## Technology Stack

**Core:**
- **Next.js 16** (App Router) + **React 19** + **TypeScript** (strict mode)
- **Tailwind CSS v4** + **shadcn/ui** (new-york style)

**State & Data:**
- **TanStack Query v5** — server state (caching, refetching, mutations)
- **Zustand v5** — client state (auth, socket connection)
- **React Hook Form** + **Zod** — form management and validation

**Communication:**
- Custom HTTP client (`src/lib/http.ts`) with interceptors for automatic token refresh
- **Socket.io** for real-time updates
- Route handlers in `src/app/api/` act as a proxy to the Fastify backend

**Internationalization:**
- **next-intl** — 2 languages (EN/VI), route-based (`/en/*`, `/vi/*`)

---

## Common Development Challenges

### 1. Token & Auth Race Condition
- When the access token expires while multiple API calls are in-flight simultaneously, they can all trigger a refresh at the same time.
- **Solution**: Queue pending requests and retry them after the refresh completes — handled inside `src/lib/http.ts`.

### 2. Complex Locale Routing
- The default locale in the routing config is `en`, but the UI default in `src/config.ts` is `vi` — easy to confuse.
- Middleware must correctly handle locale prefixing to avoid redirect loops.

### 3. SSR / Client Hydration Mismatch
- Zustand store and `localStorage` are only available on the client → requires a `mounted` check or `useEffect` to prevent hydration errors.
- Socket.io connections are client-side only.

### 4. Image Optimization Disabled
- `unoptimized: true` is set in `next.config.ts` because the backend runs on localhost. This should be re-enabled before deploying to production.

### 5. TypeScript Strict Mode
- Zod v4 combined with strict TypeScript can produce complex types, especially with nested schemas and `.transform()`.
- A backup of schema files exists at `src/schemaValidations_backup/` as a safety net.

### 6. Real-time + React Query Cache Invalidation
- When a Socket.io event is received, the correct query key must be invalidated to trigger a UI update — using the wrong key means stale data is never refreshed.
