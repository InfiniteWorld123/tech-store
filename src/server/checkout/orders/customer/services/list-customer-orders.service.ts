import type { CustomerOrderListItemType, ListCustomerOrdersInputType, ListCustomerOrdersOutputType } from "../customer.types";
import { jsonOk, type JsonOk } from "#/constants/json";
import { handleError } from "#/errors/error-handler";
import { HttpStatusCode } from "#/constants/http";
import { and, desc, eq, gte, ilike, inArray, lt, sql, SQL } from "drizzle-orm";
import { order, orderItem, payment, shipping, variant, variantImage } from "#/db/schema";
import { db } from "#/db/drizzle";

export const listCustomerOrders = async (
    data: ListCustomerOrdersInputType
): Promise<JsonOk<ListCustomerOrdersOutputType>> => {
    try {
        const { searchOrderNumber, limit, page, status, userId, year } = data;
        const conditions: SQL[] = []
        const offset = (page - 1) * limit;

        conditions.push(eq(order.userId, userId));

        if (searchOrderNumber) {
            conditions.push(ilike(order.orderNumber, `%${searchOrderNumber}%`));
        }

        if (year) {
            const from = new Date(year, 0, 1);
            const to = new Date(year + 1, 0, 1);

            conditions.push(gte(order.placedAt, from));
            conditions.push(lt(order.placedAt, to));
        }

        switch (status) {
            case "all":
                break;
            case "active":
                conditions.push(inArray(order.status, ["pending", "processing"]));
                break;
            case "completed":
                conditions.push(eq(order.status, "completed"));
                break;
            case "cancelled":
                conditions.push(eq(order.status, "cancelled"));
                break;
        }

        const whereCondition =
            conditions.length > 0 ? and(...conditions) : undefined;

        const [totalResult] = await db
            .select({
                total: sql<number>`count(distinct ${order.id})`.mapWith(Number),
            })
            .from(order)
            .innerJoin(payment, eq(payment.orderId, order.id))
            .innerJoin(shipping, eq(shipping.orderId, order.id))
            .where(whereCondition);

        const orders = await db
            .select({
                id: order.id,
                orderNumber: order.orderNumber,
                status: order.status,
                totalAmount: order.totalAmount,
                placedAt: order.placedAt,

                paymentStatus: payment.status,

                shippingStatus: shipping.status,
                shippingTrackingNumber: shipping.trackingNumber,

                itemCount: sql<number>`(
                    select count(*)
                    from ${orderItem}
                    where ${orderItem.orderId} = ${order.id}
                )`.mapWith(Number),

                // here also please
                firstItemName: sql<string | null>`(
                    select ${orderItem.productName}
                    from ${orderItem}
                    where ${orderItem.orderId} = ${order.id}
                    order by ${orderItem.id}
                    limit 1
                )`,

                firstItemImage: sql<string | null>`(
                    select ${variantImage.image}
                    from ${orderItem}
                    inner join ${variant} on ${variant.id} = ${orderItem.variantId}
                    left join ${variantImage} on ${variantImage.variantId} = ${variant.id}
                    where ${orderItem.orderId} = ${order.id}
                    order by ${variantImage.sortOrder}
                    limit 1
                )`,
            })
            .from(order)
            .innerJoin(payment, eq(payment.orderId, order.id))
            .innerJoin(shipping, eq(shipping.orderId, order.id))
            .where(whereCondition)
            .orderBy(desc(order.placedAt))
            .limit(limit)
            .offset(offset);

        const items: CustomerOrderListItemType[] = orders.map((orderRow) => ({
            id: orderRow.id,
            orderNumber: orderRow.orderNumber,
            status: orderRow.status,
            totalAmount: Number(orderRow.totalAmount),
            placedAt: orderRow.placedAt.toISOString(),
            itemCount: orderRow.itemCount,
            firstItemName: orderRow.firstItemName,
            firstItemImage: orderRow.firstItemImage,
            payment: {
                status: orderRow.paymentStatus,
            },
            shipping: {
                status: orderRow.shippingStatus,
                trackingNumber: orderRow.shippingTrackingNumber,
            },
            canCancel: ["pending", "processing"].includes(orderRow.status),
            canTrack: orderRow.shippingTrackingNumber !== null,
        }));

        const total = totalResult?.total ?? 0;
        const totalPages = Math.ceil(total / limit);

        return jsonOk<ListCustomerOrdersOutputType>({
            status: HttpStatusCode.OK,
            message: "Orders fetched successfully",
            data: {
                items,
                query: {
                    status,
                    year,
                    searchOrderNumber,
                },
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages,
                    hasNextPage: page < totalPages,
                    hasPreviousPage: page > 1,
                },
            },
        });
    } catch (error) {
        throw handleError(error)
    }
}