import { createServerFn } from "@tanstack/react-start";
import { unauthorizedError } from "#/errors/app-error";
import { ensureSession } from "#/server/auth/ensure-session.middleware";
import { estimateOrderTotalValidationSchema, placeOrderFromCartValidationSchema } from "./customer.schemas";
import { estimateOrderTotal } from "./services/estimate-order-total.service";
import { placeOrderFromCart } from "./services/place-order-from-cart.service";

export const estimateOrderTotalAction = createServerFn({ method: "GET" })
    .middleware([ensureSession])
    .inputValidator(estimateOrderTotalValidationSchema)
    .handler(async ({ data, context }) => {
        if (!context.session) {
            throw unauthorizedError("user is unauthorized");
        }

        return estimateOrderTotal({
            ...data,
            userId: context.session.user.id,
        });
    });

export const placeOrderFromCartAction = createServerFn({ method: "POST" })
    .middleware([ensureSession])
    .inputValidator(placeOrderFromCartValidationSchema)
    .handler(async ({ data, context }) => {
        // if (!context.session) {
        //     throw unauthorizedError("user is unauthorized");
        // }

        return placeOrderFromCart({
            ...data,
            userId: context.session?.user.id as string,
        })
    })