# AGENTS.md - Minu Kitchen Client

> This file contains essential information for AI coding agents working on the Minu Kitchen frontend project.

## Project Overview

**Minu Kitchen** is a modern restaurant QR ordering system built with Next.js 16. This is the **frontend client** repository, part of a full-stack application that includes a separate Fastify backend.

### Key Features
- QR code-based table ordering for restaurant guests
- Real-time order updates via Socket.io
- Multi-language support (English/Vietnamese)
- Role-based access control (Guest, Employee, Owner)
- Dashboard with analytics and charts
- Dark/light theme support

---

## Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.0.1 | React framework with App Router |
| React | 19.2.0 | UI library |
| TypeScript | ^5.0 | Type safety (strict mode) |
| Tailwind CSS | ^4.0 | Utility-first CSS framework |
| shadcn/ui | latest | Component library (new-york style) |
| next-intl | ^4.6.1 | Internationalization |
| TanStack Query | ^5.90.9 | Server state management |
| Zustand | ^5.0.9 | Client state management |
| Socket.io Client | ^4.8.1 | Real-time communication |
| React Hook Form | ^7.66.0 | Form management |
| Zod | ^4.1.12 | Schema validation |
| Recharts | ^2.15.4 | Data visualization |

---

## Project Structure

```
client/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── [locale]/                 # Internationalized routes (en, vi)
│   │   │   ├── (public)/             # Public pages (landing, menu, login)
│   │   │   │   ├── (auth)/           # Authentication pages
│   │   │   │   ├── @modal/           # Parallel route for modals
│   │   │   │   ├── dishes/           # Public dish listing
│   │   │   │   └── tables/           # Guest table login
│   │   │   ├── guest/                # Guest ordering interface
│   │   │   │   ├── menu/             # Menu ordering
│   │   │   │   └── orders/           # Order tracking
│   │   │   ├── manage/               # Management dashboard (Employee+)
│   │   │   │   ├── dashboard/        # Analytics & charts
│   │   │   │   ├── dishes/           # Dish CRUD
│   │   │   │   ├── orders/           # Order management
│   │   │   │   ├── tables/           # Table management
│   │   │   │   ├── accounts/         # Employee management (Owner only)
│   │   │   │   └── setting/          # Profile settings
│   │   │   ├── layout.tsx            # Root layout with providers
│   │   │   └── not-found.tsx         # 404 page
│   │   ├── api/                      # API route handlers (proxy to backend)
│   │   │   ├── auth/                 # Auth endpoints (login, logout, refresh)
│   │   │   └── guest/auth/           # Guest auth endpoints
│   │   ├── layout.tsx                # Root layout (metadata, fonts)
│   │   ├── globals.css               # Global styles (Tailwind v4)
│   │   └── ...
│   ├── components/                   # React components
│   │   └── ui/                       # shadcn/ui components
│   ├── apiRequests/                  # API client functions
│   ├── queries/                      # TanStack Query hooks
│   ├── schemaValidations/            # Zod schemas for validation
│   ├── lib/                          # Utility functions
│   │   ├── http.ts                   # HTTP client with interceptors
│   │   ├── socket.ts                 # Socket.io configuration
│   │   └── utils.ts                  # General utilities
│   ├── i18n/                         # i18n configuration
│   │   ├── routing.ts                # Locale routing config
│   │   ├── request.ts                # Message loading
│   │   └── navigation.ts             # Navigation helpers
│   ├── types/                        # TypeScript types
│   ├── constants/                    # Constants & enums
│   └── config.ts                     # Environment config validation
├── messages/                         # Translation files
│   ├── en.json                       # English translations
│   └── vi.json                       # Vietnamese translations
├── public/                           # Static assets
├── components.json                   # shadcn/ui config
├── next.config.ts                    # Next.js config (images, headers, i18n)
├── tsconfig.json                     # TypeScript config
└── eslint.config.mjs                 # ESLint config
```

---

## Environment Variables

Create `.env` file from `.env.example`:

```env
# API Configuration
NEXT_PUBLIC_API_ENDPOINT=http://localhost:4000
NEXT_PUBLIC_URL=http://localhost:3000

# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
NEXT_PUBLIC_GOOGLE_AUTHORIZED_REDIRECT_URI=http://localhost:4000/auth/login/google

# Google Analytics (Optional)
NEXT_PUBLIC_GA_ID=
```

**Note**: Environment variables are validated using Zod in `src/config.ts`.

---

## Build and Development Commands

```bash
# Install dependencies
npm install

# Development server (runs on http://localhost:3000)
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Run ESLint
npm run lint
```

---

## Architecture Patterns

### 1. Authentication Flow
- JWT-based authentication with access token (short-lived) and refresh token (long-lived)
- Tokens stored in localStorage (access) and cookies (refresh)
- Automatic token refresh via `RefreshToken` component
- Route protection based on user role (Owner, Employee, Guest)

### 2. API Communication
- Custom HTTP client (`src/lib/http.ts`) with interceptors
- API requests in `src/apiRequests/` organized by domain
- TanStack Query hooks in `src/queries/` for server state
- Route handlers in `src/app/api/` act as proxy to backend

### 3. State Management
- **Server state**: TanStack Query (React Query)
- **Client state**: Zustand (auth, socket connection)
- **Form state**: React Hook Form + Zod validation

### 4. Internationalization (i18n)
- Two locales: `en` (default) and `vi`
- Route-based localization: `/en/*`, `/vi/*`
- Translations in `messages/*.json`
- Use `next-intl` hooks: `useTranslations()`, `getTranslations()`

### 5. Real-time Communication
- Socket.io for live order updates
- Socket instance managed in Zustand store
- Auth tokens sent via socket auth headers

---

## Code Style Guidelines

### File Naming
- Components: PascalCase (e.g., `DishTable.tsx`)
- Utilities/Hooks: camelCase (e.g., `useAuth.tsx`)
- API requests: camelCase with domain suffix (e.g., `dish.ts`)
- Schemas: camelCase with `.schema.ts` suffix

### Component Structure
```tsx
// Imports grouped by: React/Next, Third-party, Internal, Types
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { DishResType } from '@/schemaValidations/dish.schema'

// Type definitions
interface Props {
  dish: DishResType
}

// Component
export function DishCard({ dish }: Props) {
  const t = useTranslations('ManageDishes')
  
  return (
    <div className="rounded-lg border p-4">
      {/* JSX */}
    </div>
  )
}
```

### Import Conventions
- Use `@/` alias for internal imports
- Group imports: React/Next → Third-party → Internal → Types
- Prefer named exports for utilities
- Default exports for page components

### Comments
- Code comments in Vietnamese (following existing pattern)
- Use `//` for inline comments
- Use JSDoc for complex functions

---

## Key Constants and Enums

Located in `src/constants/type.ts`:

```typescript
// User Roles
Role.Owner      // Restaurant owner
Role.Employee   // Staff member
Role.Guest      // Table guest

// Dish Status
DishStatus.Available
DishStatus.Unavailable
DishStatus.Hidden

// Table Status
TableStatus.Available
TableStatus.Hidden
TableStatus.Reserved

// Order Status (lifecycle)
OrderStatus.Pending     // Waiting for processing
OrderStatus.Processing  // Being prepared
OrderStatus.Rejected    // Order rejected
OrderStatus.Delivered   // Served to customer
OrderStatus.Paid        // Payment completed
```

---

## Testing

Currently, the project uses linting as the primary quality check:

```bash
npm run lint    # Run ESLint
```

**ESLint Configuration**:
- Extends Next.js core-web-vitals and typescript configs
- Includes TanStack Query recommended rules
- Allows `any` type (rule disabled)

---

## Security Considerations

### Authentication
- JWT tokens with automatic refresh
- Role-based route protection in middleware
- Guest tokens for table-specific access

### HTTP Headers (Production)
Configured in `next.config.ts`:
- `Strict-Transport-Security` (HSTS)
- `X-Frame-Options: SAMEORIGIN`
- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection`
- `Referrer-Policy`
- `Permissions-Policy`

### Image Domains
Whitelisted in `next.config.ts`:
- `localhost:4000` (backend uploads)
- `placehold.com` (placeholders)
- `images.unsplash.com` (sample images)

---

## Backend Integration

This client connects to a separate Fastify backend:

- **API Base URL**: `NEXT_PUBLIC_API_ENDPOINT` (default: http://localhost:4000)
- **Authentication**: JWT Bearer tokens in Authorization header
- **Real-time**: Socket.io at same endpoint
- **CORS**: Must be configured on backend

### Key Backend Endpoints
- `POST /auth/login` - Email/password login
- `POST /auth/login/google` - Google OAuth
- `POST /auth/refresh-token` - Token refresh
- `GET /dishes` - List dishes
- `GET/POST/PATCH /orders` - Order CRUD
- `GET/POST/PATCH /tables` - Table management

---

## Deployment

### Vercel (Recommended for Frontend)
1. Connect GitHub repository to Vercel
2. Set environment variables in dashboard
3. Deploy

### Environment Requirements
- Node.js >= 18.x
- Build output: `.next/` directory

---

## Common Issues

### Image Optimization
Images are currently **unoptimized** (`unoptimized: true` in next.config.ts) for compatibility with localhost backend. Enable for production.

### Locale Routing
- Default locale: `en` (configured in `src/i18n/routing.ts`)
- UI default locale: `vi` (configured in `src/config.ts`)
- Middleware handles locale prefixing

### Token Expiration
- Access tokens expire after short duration
- Automatic refresh handled by `RefreshToken` component
- On 401 error, user is redirected to login

---

## Adding New Features

### 1. New API Endpoint
1. Add schema validation in `src/schemaValidations/`
2. Add API request function in `src/apiRequests/`
3. Add TanStack Query hook in `src/queries/`

### 2. New Page
1. Create route in `src/app/[locale]/(public)|guest|manage/`
2. Add translations to `messages/en.json` and `messages/vi.json`
3. Use `getTranslations()` for metadata

### 3. New Component
1. Add to `src/components/` or appropriate subfolder
2. Use existing shadcn/ui components when possible
3. Add to `components.json` if it's a new shadcn component

### 4. New Translation Key
1. Add to both `messages/en.json` and `messages/vi.json`
2. Use `useTranslations('Namespace')` or `getTranslations()`
3. Follow existing naming convention (PascalCase namespaces)

---

## Resources

- **shadcn/ui**: https://ui.shadcn.com/
- **next-intl**: https://next-intl-docs.vercel.app/
- **TanStack Query**: https://tanstack.com/query/latest
- **Zustand**: https://docs.pmnd.rs/zustand
- **Next.js**: https://nextjs.org/docs
