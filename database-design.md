# Database Design

This file is the simplified database plan for the portfolio tech store.

It focuses on the store tables, not the full auth internals. The project already has Better Auth tables such as `user`, `session`, `account`, and `verification`. For the business side of the app, the tables below are the clean version to follow.

## Relationship Summary

### `user`
- one user has many addresses
- one user has one active cart
- one user has many orders
- one user has many reviews
// For this portfolio project, "one user has one active cart" is a good and simple choice.

### `address`
- each address belongs to one user
- one address can be used by many orders

### `category`
- one category has many products

### `product`
- each product belongs to one category
- one product has many variants
- one product has many reviews

### `variant`
- each variant belongs to one product
- each variant can belong to one color
- each variant can belong to one storage option
- each variant can belong to one RAM option
- each variant can belong to one screen size option
- one variant can appear in many cart items
- one variant can appear in many order items

### `color`
- one color can be used by many variants

### `storage`
- one storage value can be used by many variants

### `ram`
- one RAM value can be used by many variants

### `screen_size`
- one screen size value can be used by many variants

### `cart`
- each cart can belong to one user
- one cart has many cart items
- `user_id` can be nullable if you want guest carts with `session_id`

### `cart_item`
- each cart item belongs to one cart
- each cart item belongs to one variant

### `order`
- each order belongs to one user
- each order belongs to one address
- one order has many order items
- one order has one payment in the simplified portfolio version
- one order has one shipping record in the simplified portfolio version

### `order_item`
- each order item belongs to one order
- each order item belongs to one variant

### `payment`
- each payment belongs to one order

### `shipping`
- each shipping record belongs to one order
- recommended rule: one shipping record per order

### `review`
- each review belongs to one user
- each review belongs to one product
- recommended rule: one user can review one product only once

## Simplified Tables

### `user`
Use the auth-managed `user` table that already exists in the project.

Recommended core fields:
- `id`
- `name`
- `email`
- `email_verified`
- `image`
- `created_at`
- `updated_at`

### `address`
- `id`
- `user_id`
- `full_name`
- `phone`
- `street`
- `postal_code`
- `city`
- `state`
- `country`
- `is_default`
- `created_at`
- `updated_at`

### `category`
- `id`
- `name`
- `slug`
- `image`
- `created_at`
- `updated_at`

### `product`
- `id`
- `category_id`
- `name`
- `brand`
- `slug`
- `short_description`
- `description`
- `warranty_info`
- `image`
- `rating_avg`
- `reviews_count`
- `is_featured`
- `is_active`
- `created_at`
- `updated_at`

Notes:
- `is_bestseller` is optional for the portfolio version
- if you keep it, use it only for UI badges, not as a core business field
// Yes, adding `is_bestseller` is fine for a portfolio project if you want a "Best Seller" badge in the UI.

### `variant`
- `id`
- `product_id`
- `sku`
- `price`
- `compare_at_price`
- `stock_quantity`
- `color_id`
- `storage_id`
- `ram_id`
- `screen_size_id`
- `is_default`
- `image`
- `created_at`
- `updated_at`

Notes:
- `is_in_stock` is not required because it can be derived from `stock_quantity`
- `barcode`, `cost_price`, and `low_stock_threshold` are not needed for now
// Yes, deriving simple values like `is_in_stock` from `stock_quantity` is a better approach here.
// The main benefit is avoiding duplicate data and inconsistencies, not optimization.
// Store derived data only when recalculating it is expensive or when you truly need faster reads.

### `color`
- `id`
- `name`
- `hex_code`
- `created_at`
- `updated_at`

### `storage`
- `id`
- `name`
- `value_gb`
- `created_at`
- `updated_at`

### `ram`
- `id`
- `name`
- `value_gb`
- `created_at`
- `updated_at`

### `screen_size`
- `id`
- `name`
- `value_inches`
- `created_at`
- `updated_at`

### `cart`
- `id`
- `user_id`
- `session_id`
- `created_at`
- `updated_at`

### `cart_item`
- `id`
- `cart_id`
- `variant_id`
- `quantity`
- `price_at_time`
- `created_at`
- `updated_at`

### `order`
- `id`
- `user_id`
- `address_id`
- `order_number`
- `status`
- `subtotal`
- `shipping_fee`
- `tax_amount`
- `total_amount`
- `notes`
- `placed_at`
- `created_at`
- `updated_at`

Notes:
- do not keep `payment_method` and `payment_status` here if you use a separate `payment` table
- `status` here means order progress such as `pending`, `processing`, `shipped`, or `delivered`
- keep pricing fields such as `subtotal`, `shipping_fee`, `tax_amount`, and `total_amount` on `order`
- keep the destination address on `order`; shipping-specific tracking data should go into `shipping`

### `order_item`
- `id`
- `order_id`
- `variant_id`
- `product_name`
- `variant_name`
- `sku`
- `quantity`
- `unit_price`
- `total_price`

Notes:
- keep `product_name`, `variant_name`, and `sku` here as a snapshot of what was purchased

### `payment`
- `id`
- `order_id`
- `method`
- `amount`
- `status`
- `paid_at`
- `created_at`
- `updated_at`

Notes:
- `status` here means payment progress such as `pending`, `paid`, or `failed`
- `provider`, `currency`, and `transaction_id` can be added later if needed

### `shipping`
- `id`
- `order_id`
- `carrier`
- `method`
- `tracking_number`
- `status`
- `shipped_at`
- `delivered_at`
- `created_at`
- `updated_at`

Notes:
- `carrier` means the shipping company, such as `DHL` or `Hermes`
- `method` means the shipping type, such as `standard` or `express`
- `status` here means shipping progress such as `pending`, `packed`, `shipped`, `in_transit`, or `delivered`
- this table is for shipping logistics, so do not move pricing fields here

### `review`
- `id`
- `user_id`
- `product_id`
- `rating`
- `title`
- `comment`
- `created_at`
- `updated_at`

## Recommended Foreign Keys

- `address.user_id -> user.id`
- `product.category_id -> category.id`
- `variant.product_id -> product.id`
- `variant.color_id -> color.id`
- `variant.storage_id -> storage.id`
- `variant.ram_id -> ram.id`
- `variant.screen_size_id -> screen_size.id`
- `cart.user_id -> user.id`
- `cart_item.cart_id -> cart.id`
- `cart_item.variant_id -> variant.id`
- `order.user_id -> user.id`
- `order.address_id -> address.id`
- `order_item.order_id -> order.id`
- `order_item.variant_id -> variant.id`
- `payment.order_id -> order.id`
- `shipping.order_id -> order.id`
- `review.user_id -> user.id`
- `review.product_id -> product.id`

## Recommended Unique Rules

- `category.slug`
- `product.slug`
- `variant.sku`
- `order.order_number`
- `shipping.order_id`
- `review (user_id, product_id)`

## Final Simplification Rules

- product options should come through `variant`, not directly from `product`
- stock should be tracked on `variant`
- payment details should live in `payment`, not in `order`
- shipping details should live in `shipping`, not in `order`
- review should belong to `product`, not to `variant`, to keep the portfolio version simple

// DHL and Hermes are shipping carriers, not suppliers.
// A supplier would be a company that provides the products, such as Apple, Samsung, or a distributor.
// For now, do not add a supplier table. If you want more realism later, add a small shipping or shipment table instead.
// Do not make everything enums.
// Good enum candidates: `order.status`, `payment.status`, and maybe `payment.method`.
// Better as tables: `color`, `storage`, `ram`, `screen_size`, and `category`.
// `payment.provider` can be text for now, or an enum later if you only support a small fixed list.
