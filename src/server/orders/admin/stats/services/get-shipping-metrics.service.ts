import { HttpStatusCode } from "#/constants/http";
import { jsonOk, type JsonOk } from "#/constants/json";
import { db } from "#/db/drizzle";
import { shipping } from "#/db/schema";
import { handleError } from "#/errors/error-handler";
import type { GetShippingMetricsInputType, GetShippingMetricsOutputType } from "../stats.types";
import { sql, count } from "drizzle-orm";


export const getShippingMetrics = async (
    _data: GetShippingMetricsInputType
): Promise<JsonOk<GetShippingMetricsOutputType>> => {
    try {


        const [shippingStats] = await db
            .select({
                totalShipments: count(),

                standard: sql<number>`count(*) filter (where ${shipping.method} = 'standard')`,
                express: sql<number>`count(*) filter (where ${shipping.method} = 'express')`,
                same_day: sql<number>`count(*) filter (where ${shipping.method} = 'same_day')`,

                pending: sql<number>`count(*) filter (where ${shipping.status} = 'pending')`,
                packed: sql<number>`count(*) filter (where ${shipping.status} = 'packed')`,
                shipped: sql<number>`count(*) filter (where ${shipping.status} = 'shipped')`,
                in_transit: sql<number>`count(*) filter (where ${shipping.status} = 'in_transit')`,
                delivered: sql<number>`count(*) filter (where ${shipping.status} = 'delivered')`,

                dhl: sql<number>`count(*) filter (where ${shipping.carrier} = 'dhl')`,
                hermes: sql<number>`count(*) filter (where ${shipping.carrier} = 'hermes')`,
                ups: sql<number>`count(*) filter (where ${shipping.carrier} = 'ups')`,
                fedex: sql<number>`count(*) filter (where ${shipping.carrier} = 'fedex')`,

                averageDeliveryTime: sql<number>`
                    avg(extract(epoch from (${shipping.deliveredAt} - ${shipping.shippedAt})) / 86400)
                    filter (where ${shipping.deliveredAt} is not null and ${shipping.shippedAt} is not null)
                    `,
            })
            .from(shipping)



        return jsonOk({
            status: HttpStatusCode.OK,
            message: "Shipping metrics order successfully fetched",
            data: {
                totalShipments: shippingStats.totalShipments,
                byStatus: {
                    pending: shippingStats.pending,
                    packed: shippingStats.packed,
                    shipped: shippingStats.shipped,
                    in_transit: shippingStats.in_transit,
                    delivered: shippingStats.delivered,
                },
                byMethod: {
                    standard: shippingStats.standard,
                    express: shippingStats.express,
                    same_day: shippingStats.same_day
                },
                byCarrier: {
                    dhl: shippingStats.dhl,
                    hermes: shippingStats.hermes,
                    ups: shippingStats.ups,
                    fedex: shippingStats.fedex
                },
                averageDeliveryTime: Number(shippingStats.averageDeliveryTime ?? 0)
            }
        })
    } catch (error) {
        throw handleError(error)
    }
}