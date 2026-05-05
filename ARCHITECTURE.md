# Server Folder Architecture

## Structure

```
src/server/
├── auth/
│   ├── auth.actions.ts
│   ├── auth.schemas.ts              # rename from auth.validation.ts
│   ├── auth.types.ts                # rename from auth.type.ts (plural)
│   └── ensure-session.middleware.ts
│
├── catalog/
│   ├── products/
│   │   ├── products.actions.ts
│   │   ├── products.schemas.ts
│   │   ├── products.types.ts
│   │   └── services/
│   │       ├── create-product.service.ts
│   │       ├── delete-product.service.ts
│   │       ├── delete-products.service.ts
│   │       ├── get-product.service.ts
│   │       ├── get-products.service.ts
│   │       └── update-product.service.ts
│   ├── variants/
│   │   ├── variants.actions.ts
│   │   ├── variants.schemas.ts
│   │   ├── variants.types.ts
│   │   └── services/
│   │       ├── create-variant.service.ts
│   │       ├── delete-variant.service.ts
│   │       └── update-variant.service.ts
│   ├── categories/                   # build when needed, delete .gitkeep folders
│   ├── options/                      # build when needed
│   └── images/                       # build when needed
│
├── cart/
│   ├── cart.actions.ts
│   ├── cart.schemas.ts
│   ├── cart.types.ts
│   ├── middlewares/
│   │   ├── resolveCartOwnerMiddleware.ts
│   │   └── resolveMergeCartOwnerMiddleware.ts
│   ├── utils/
│   │   └── get-or-create-guest-cart-session-id.ts
│   └── services/
│       ├── add-to-cart.service.ts
│       ├── clear-cart.service.ts
│       ├── get-cart.service.ts
│       ├── merge-cart.service.ts
│       ├── remove-cart-item.service.ts
│       ├── update-cart-item-quantity.service.ts
│       └── validate-cart.service.ts
│
├── orders/
│   ├── customer/
│   │   ├── customer.actions.ts
│   │   ├── customer.schemas.ts
│   │   ├── customer.types.ts
│   │   └── services/
│   │       ├── cancel-order.service.ts
│   │       ├── estimate-order-total.service.ts
│   │       ├── get-customer-order-detail.service.ts
│   │       ├── get-order-tracking.service.ts
│   │       ├── list-customer-orders.service.ts
│   │       ├── place-order-from-cart.service.ts
│   │       └── reorder-order.service.ts
│   ├── admin/
│   │   ├── admin.actions.ts          # merge operational + stats into one
│   │   ├── admin.schemas.ts
│   │   ├── admin.types.ts
│   │   └── services/                 # flat — no operational/ or stats/ subfolders
│   │       ├── get-order-detail.service.ts
│   │       ├── get-order-stats.service.ts
│   │       ├── list-orders.service.ts
│   │       ├── toggle-archive-order.service.ts
│   │       ├── update-order-payment-status.service.ts
│   │       ├── update-order-shipping-status.service.ts
│   │       ├── update-order-status.service.ts
│   │       ├── get-order-metrics.service.ts
│   │       ├── get-payment-metrics.service.ts
│   │       ├── get-revenue-metrics.service.ts
│   │       └── get-shipping-metrics.service.ts
│   ├── fulfillment/
│   │   ├── fulfillment.actions.ts
│   │   ├── fulfillment.schemas.ts
│   │   ├── fulfillment.types.ts
│   │   └── services/
│   │       ├── mark-order-delivered.service.ts
│   │       └── mark-order-shipped.service.ts
│   └── shared/
│       ├── order-pricing-rules.ts
│       └── order-cancellation-rules.ts
│
├── payments/                         # future — add when integrating Stripe
│   ├── payments.actions.ts
│   ├── payments.schemas.ts
│   ├── payments.types.ts
│   ├── webhooks/                     # Stripe webhook handlers
│   └── services/                     # Stripe logic lives here directly, no stripe/ subfolder
│
├── shipping/                         # future — add when needed
│   ├── shipping.actions.ts
│   ├── shipping.schemas.ts
│   ├── shipping.types.ts
│   └── services/
│
└── customers/
    ├── addresses/                    # build when needed
    └── reviews/                      # build when needed
```

## Rules

### Naming conventions (strict)
- Actions: `{domain}.actions.ts` (always plural)
- Schemas: `{domain}.schemas.ts` (always plural, never "validation")
- Types: `{domain}.types.ts` (always plural, never singular "type")
- Services: `{kebab-case-verb}.service.ts` (one function per file)
- Middlewares: `{camelCase}.middleware.ts` or `{camelCase}Middleware.ts` (pick one, be consistent)

### Folder depth
- Maximum 4 levels: `domain/role/services/file.ts`
- If a subfolder only categorizes (like `operational/`), flatten it — use file naming instead
- Never create a wrapper folder with only one child (like `checkout/` containing only `cart/`)

### When to create a new top-level domain folder
- It represents a distinct business domain (auth, catalog, orders, payments, shipping)
- It has its own actions, schemas, types, and services
- It will grow independently from other domains

### When NOT to create folders
- Don't create empty placeholder folders with .gitkeep
- Don't create provider-specific subfolders (e.g., `stripe/`) unless you actively support multiple providers
- Don't create subfolders to categorize fewer than 5 files — use file naming instead

### Service files
- One exported function per service file
- File name matches the function: `create-product.service.ts` exports `createProduct`
- Services contain business logic; actions are thin wrappers (middleware + validation + call service)

### Shared code
- Cross-role shared logic within a domain goes in `{domain}/shared/`
- Cross-domain shared logic goes in `src/server/shared/` (create when needed)
