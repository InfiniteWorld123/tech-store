Customer APIs:
    getOrder
    Get one order with items, payment, shipping, and address.
    getOrders
    Get current user orders with pagination, sort, status filter, date filter.
    cancelOrder
    Cancel only when order is still pending or maybe processing, not shipped or delivered.
    getOrderTracking
    Return shipping carrier, method, tracking number, shipping status.
    estimateOrderTotal
    Calculate subtotal, shipping fee, tax amount, total amount before final order creation.
    placeOrderFromCart
    This is the most important missing one. Create the order from cart items.
    reorderOrder
    Copy old order items back into the cart. Very useful for business.

Admin APIs
    getAllOrders
    Full admin list with filters by order number, user, status, payment status, shipping status.
    getOrder
    Admin version with full details.
    updateOrderStatus
    Core fulfillment action.
    updateShippingInfo
    Update carrier, method, trackingNumber, status, shippedAt, deliveredAt.
    updatePaymentStatus
    Update payment row to pending, paid, failed.
    getOrdersByStatus
    Simple and useful for dashboard tabs.
    getOrdersReadyToShip
    Paid orders not yet shipped.
    archiveOrder
    Hide old completed orders from the main admin list.

Operational / Business APIs
    searchOrders
    Search by orderNumber, maybe customer name, maybe SKU.
    getOrderStats
    Revenue, count, average order value, counts by status.
    validateOrderCancellation
    Can be a helper service used inside cancelOrder, not necessarily a public API.
    markOrderShipped
    Small focused service, often cleaner than using only generic updateOrderStatus.
    markOrderDelivered
    Same idea. Very practical in admin panels.