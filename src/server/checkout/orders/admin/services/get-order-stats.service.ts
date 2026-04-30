/*
 * Future admin order dashboard stats.
 *
 * This service is intentionally postponed until the core order admin workflow is
 * finished: list orders, view order detail, update order status, update payment
 * status, update shipping status, and archive/restore orders.
 *
 * These stats are possible with the current database because orders, payments,
 * and shipping are already connected by orderId.
 *
 * Useful business metrics to build later:
 *
 * Order metrics:
 * - totalOrders: count all non-archived orders
 * - pendingOrders: orders where order.status = "pending"
 * - processingOrders: orders where order.status = "processing"
 * - completedOrders: orders where order.status = "completed"
 * - cancelledOrders: orders where order.status = "cancelled"
 *
 * Revenue metrics:
 * - totalRevenue: sum order.totalAmount for paid/completed orders
 * - averageOrderValue: average order.totalAmount
 * - revenueToday: sum paid order totals created/placed today
 * - revenueThisWeek: sum paid order totals created/placed this week
 * - revenueThisMonth: sum paid order totals created/placed this month
 *
 * Payment metrics:
 * - paidOrders: payments where payment.status = "paid"
 * - pendingPayments: payments where payment.status = "pending"
 * - failedPayments: payments where payment.status = "failed"
 * - refundedPayments: payments where payment.status = "refunded"
 *
 * Shipping metrics:
 * - readyToShipOrders: paid payments with shipping.status = "pending"
 * - packedShipments: shipping.status = "packed"
 * - shippedShipments: shipping.status = "shipped"
 * - inTransitShipments: shipping.status = "in_transit"
 * - deliveredShipments: shipping.status = "delivered"
 *
 * Time-based order metrics:
 * - ordersToday: orders placed today
 * - ordersThisWeek: orders placed this week
 * - ordersThisMonth: orders placed this month
 *
 * Keep this service focused on simple dashboard totals and counts. Do not put
 * list filtering, order detail logic, payment updates, or shipping updates here.
 * If a metric starts needing complex reporting rules, create a separate reporting
 * service later instead of making this file too large.
 */

export {};
