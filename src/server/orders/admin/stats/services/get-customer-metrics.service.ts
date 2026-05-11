import { HttpStatusCode } from "#/constants/http";
import { jsonOk, type JsonOk } from "#/constants/json";
import { db } from "#/db/drizzle";
import { user } from "#/db/schema";
import { handleError } from "#/errors/error-handler";
import type {
    GetCustomerMetricsInputType,
    GetCustomerMetricsOutputType
} from "../stats.types";
import { sql, count } from "drizzle-orm";




export const getCustomerMetrics = async (_data: GetCustomerMetricsInputType)
    : Promise<JsonOk<GetCustomerMetricsOutputType>> => {

    try {

        const [customerStats] = await db
            .select({
                totalCustomers: count(),
                verifiedCustomers: sql<number>`count(*) filter (where ${user.emailVerified} = true)`,
                unverifiedCustomers: sql<number>`count(*) filter (where ${user.emailVerified} = false)`,
                customersWithOrders: sql<number>`
                count(*) filter (where ${user.id} in (select user_id from "order"))
            `,
                customersWithoutOrders: sql<number>`
                count(*) filter (where ${user.id} not in (select user_id from "order"))
            `,
                customersWithSavedAddresses: sql<number>`
                count(*) filter (where ${user.id} in (select user_id from "address"))
            `,
                customersWithReviews: sql<number>`
                count(*) filter (where ${user.id} in (select user_id from "review"))
            `,
            })
            .from(user)

        return jsonOk({
            status: HttpStatusCode.OK,
            message: "Customer metrics successfully fetched",
            data: {
                totalCustomers: customerStats.totalCustomers,
                verifiedCustomers: customerStats.verifiedCustomers,
                unverifiedCustomers: customerStats.unverifiedCustomers,
                customersWithOrders: customerStats.customersWithOrders,
                customersWithoutOrders: customerStats.customersWithoutOrders,
                customersWithSavedAddresses: customerStats.customersWithSavedAddresses,
                customersWithReviews: customerStats.customersWithReviews,
            }
        })
    } catch (error) {
        throw handleError(error)
    }
}