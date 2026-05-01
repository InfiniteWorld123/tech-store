Core Cart Functions

getCart
Returns the current customer cart with product + variant details, images, stock info, item totals, subtotal, and warnings.
Business reason: the cart page needs more than rows from cart_item; it needs to show whether each item is still purchasable.

addToCart
Input: variantId, quantity.
Business rules:

Customer adds a variant, not just a product.
If the variant already exists in cart, increase quantity.
Check stockQuantity.
Store priceAtTime from the variant’s current price.
Do not allow inactive/unavailable products.
updateCartItemQuantity
Input: cartItemId or variantId, quantity.
Business rules:

Quantity cannot be less than 1.
Quantity cannot exceed stock.
If quantity becomes 0, use remove instead.
Recalculate item totals.
removeCartItem
Removes one item from cart.
Business reason: normal cart behavior.

clearCart
Removes all items.
Business reason: useful after order placement, or if customer wants to reset.

Important Business Functions

validateCart
This is very important.
It checks:

Product still exists.
Product is still active.
Variant still exists.
Variant has enough stock.
Current price changed from priceAtTime.
Cart is empty or not.
Business reason: carts become stale. Someone may add an item today and checkout next week.

getCartSummary or calculateCartTotals
Returns:
itemsCount
subtotal
maybe hasOutOfStockItems
maybe hasPriceChanges
Business reason: navbar cart badge, mini-cart, checkout preview.

mergeCart
For guest cart to logged-in user cart.
Your DB supports this because cart has both userId and sessionId.

Business reason:

User adds items before login.
User logs in.
Guest cart should merge into their account cart.
This is not urgent for first version, but it is very real e-commerce behavior.

What I would not put in cart yet

Do not add coupons, discounts, tax, shipping, payment, or order status inside cart right now. Your database does not have coupon/discount tables, and shipping/tax belong closer to checkout/order estimation.

Your first cart folder could be:

src/server/checkout/cart/
  cart.actions.ts
  cart.schemas.ts
  cart.types.ts
  services/
    get-cart.service.ts
    add-to-cart.service.ts
    update-cart-item-quantity.service.ts
    remove-cart-item.service.ts
    clear-cart.service.ts
    validate-cart.service.ts
    merge-cart.service.ts
If you want the smartest starting point: build only these first:

getCart
addToCart
updateCartItemQuantity
removeCartItem
clearCart
validateCart
That