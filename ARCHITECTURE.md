# Server Folder Architecture

## Structure

```txt
src/server/
├── auth/
│   ├── auth.schemas.ts
│   ├── auth.types.ts
│   └── ensure-session.middleware.ts
├── analytics/
│   ├── analytics.actions.ts
│   ├── analytics.schemas.ts
│   ├── analytics.types.ts
│   └── services/
├── cart/
│   ├── cart.actions.ts
│   ├── cart.schemas.ts
│   ├── cart.types.ts
│   ├── middlewares/
│   ├── services/
│   └── utils/
├── catalog/
│   ├── categories/
│   ├── options/
│   │   ├── colors/
│   │   ├── rams/
│   │   ├── screens/
│   │   └── storages/
│   ├── products/
│   └── variants/
├── orders/
│   ├── admin/
│   │   ├── admin.actions.ts
│   │   ├── admin.schemas.ts
│   │   ├── admin.types.ts
│   │   └── services/
│   ├── customer/
│   │   ├── customer.actions.ts
│   │   ├── customer.schemas.ts
│   │   ├── customer.types.ts
│   │   └── services/
│   └── shared/
├── addresses/
│   └── README.md
├── payments/
│   └── README.md
├── reviews/
│   └── README.md
└── shipping/
    └── README.md
```

Future-only modules stay as README placeholders until they expose real actions, schemas, types, and services.

## Rules

- Actions: `{domain}.actions.ts`.
- Schemas: `{domain}.schemas.ts`, with exported Zod schemas named `{verb}{Entity}Schema`.
- Types: `{domain}.types.ts`, with direct `z.infer<typeof schema>` input types.
- Services: `{kebab-case-verb}.service.ts`, one exported `const` service function per file.
- Middleware files may use the existing middleware naming style, but keep each middleware focused on one responsibility.
- Reads and list/search actions use `GET`; mutations use `POST`.
- Server action success responses use `JsonOk<T>`: `{ success, status, message, data }`.
- Server action errors use `JsonError`: `{ success, status, message, code?, details? }`.
- Collection responses use `data: { items, query, pagination? }`.
- Detail/create/update responses use named objects like `data: { product }` or `data: { order }`.
- Delete responses return deleted identifiers like `data: { productId }` or `data: { productIds }`.
- Better Auth API routes are pass-through and are not wrapped in the app response envelope.

## Folder Guidance

- Keep top-level folders for distinct business domains: `auth`, `catalog`, `cart`, `orders`, `analytics`, `payments`, `shipping`.
- Use `analytics` for cross-domain metrics instead of putting metrics under a single domain.
- Keep `orders/admin/services` flat; use descriptive service filenames instead of categorization folders.
- Put product categories under `catalog/categories`; reserve `catalog/options` for variant option tables.
- Do not add provider-specific folders such as `stripe/` until multiple providers or provider isolation is actually needed.
- Do not add empty action/schema/type files for future modules; keep a README TODO until real behavior exists.
