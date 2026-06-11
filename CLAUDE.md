# tech-store

E-commerce app: TanStack Start (React 19) + TanStack Query/Form/Router, Drizzle ORM (Neon Postgres), HeroUI v3, Tailwind v4, better-auth, Stripe, Biome.

## Commands

- `bun dev` — dev server on :3000
- `bun run check` — Biome lint + format check (`--write` to fix)
- `npx tsc --noEmit` — type check
- `bun run test` — vitest
- `bun run db:generate` / `db:migrate` / `db:studio` — Drizzle

## Conventions

- **Package manager:** bun (`bun.lock`). Do not add other lockfiles.
- **Import alias:** `#/*` → `src/*` (only alias; no `@/`). Relative imports only within the same domain/folder.
- **File names:** kebab-case everywhere (enforced by Biome `useFilenamingConvention`).
- **Hooks:** page-owned hooks live beside their feature page, e.g. `components/admin/pages/orders/use-orders-page.ts`; shared cross-feature hooks live in `src/hooks/use-<name>.ts`. Export named `useX`.
- **Query options:** `src/queries/<domain>.queries.ts` exporting `xQueryOptions`. No barrel files (import the file directly); the only barrel is `components/emails/index.ts`.
- **Server domains:** `src/server/<domain>/` with `<domain>.actions.ts`, `<domain>.schemas.ts` (zod), `<domain>.types.ts`, and `services/<verb>-<noun>.service.ts`. Domain folder names use the domain's natural form (`cart`, `auth`, `orders`).
- **Components:** organized by feature (`components/admin/pages/<feature>/`, `components/landing/sections/`, …) with kebab-case files suffixed by role: `-page.tsx`, `-section.tsx`, `-card.tsx`, `-modal.tsx`. Shared primitives live in `components/ui/`.
- **Routes:** TanStack file-based routing in `src/routes/`; route files only wire a page component from `components/`. `routeTree.gen.ts` is generated — never edit.
- **Category icons:** categories use `icon` (lucide name) + `iconColor`/`iconBg` hex fields, rendered via `components/ui/icons/category-icon.tsx`. There is no category image column.
- **HeroUI v3:** Button has no `isLoading`/`color` props — use `isPending` and variants (`primary|secondary|tertiary|ghost|outline|danger|danger-soft`); Chip variant `soft` (no `flat`).
