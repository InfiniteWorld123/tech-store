import { createServerFn } from "@tanstack/react-start";
import { unauthorizedError } from "#/errors/app-error";
import { ensureSession } from "#/server/auth/ensure-session.middleware";
import { estimateOrderTotalValidationSchema } from "./customer.schemas";
import { estimateOrderTotal } from "./services/estimate-order-total.service";

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
