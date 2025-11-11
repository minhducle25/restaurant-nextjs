## Quick orientation for AI coding agents

This file contains concise, actionable knowledge to help an AI agent be productive in this Next.js TypeScript app.

- Project root (for work in this workspace) is the `client/` folder.
- Main source: `src/` with the App Router at `src/app/` (pages are built with the `app` directory).

Key files and conventions
- `package.json` — scripts: `dev` (next dev), `build` (next build), `start` (next start), `lint` (eslint).
- `tsconfig.json` — `@/*` path alias points to `./src/*`. Prefer imports like `@/components/ui/button` or `@/lib/utils`.
- `next.config.ts` — standard Next config (minimal here). Avoid changing routing conventions in `src/app`.
- `public/` — static assets (images, SVGs used by `next/image`).

Architecture & patterns (big picture)
- This repo is a front-end Next.js app (React) using the App Router. There are no server backends here — expect UI-level changes only.
- UI components are under `src/components/` and shared utilities under `src/lib/`.
- Styling: Tailwind CSS + utility helpers. The `cn` helper in `src/lib/utils.ts` combines `clsx` and `tailwind-merge` — use it when composing className strings.
- Component patterns: `class-variance-authority` (cva) is used for variant-based component styling (see `src/components/ui/button.tsx`). Components often accept `variant`, `size`, and `asChild` props and delegate classes via `buttonVariants`.

Concrete examples to follow
- Importing a component using path alias:
  - `import { Button } from "@/components/ui/button"`
- A button composes helper utilities:
  - `cn(buttonVariants({ variant, size, className }))` (see `src/components/ui/button.tsx`)
- Prefer `Slot` (`@radix-ui/react-slot`) for `asChild` patterns when components should render different wrappers.

Build / run / debug commands (how developers run this project)
- Install deps: run your package manager of choice in `client/` (e.g., `npm install`).
- Local dev: `npm run dev` — starts Next.js dev server on port 3000 by default.
- Production build: `npm run build` then `npm run start`.
- Lint: `npm run lint` (uses `eslint`).

Project-specific constraints & conventions
- TypeScript: `strict: true` is enabled. Keep types strict and export types where they represent public component props.
- File layout: prefer colocating small components in `src/components/*` and pages in `src/app/*` following Next's App Router conventions.
- Keep imports using the `@/` alias. Avoid deep relative imports like `../../../`.
- Styling: use Tailwind utility classes; rely on `cn` + `twMerge` to prevent class duplication and manage conditional classes.

Dependencies and integration points
- Key runtime deps: `next@16`, `react@19`, `react-dom@19`, `tailwindcss@4`.
- UI libs: `@radix-ui/react-slot`, `class-variance-authority`, `lucide-react`, `clsx`, `tailwind-merge`.
- Validation: `zod` is present if/when you need runtime schema checks.

What NOT to change without verification
- Major Next.js routing/layout patterns in `src/app/` (changing them can break rendering and data fetching).
- The `@/*` path alias — updating tsconfig paths or build tooling requires coordinated changes to build and IDE settings.

Where to add tests & small PRs
- There are no test runners configured in `package.json`. If adding tests, include a test script and config (Jest / Vitest) and keep changes small.

If you update or refactor a component, check these files for examples:
- `src/components/ui/button.tsx` — shows cva, `asChild`, `cn` usage.
- `src/lib/utils.ts` — `cn` helper.
- `src/app/page.tsx` — top-level app page that demonstrates component imports and `next/image` usage.

If anything here is unclear or you want more examples (API routes, back-end integration, CI configs), tell me which area to expand and I'll update this file.
