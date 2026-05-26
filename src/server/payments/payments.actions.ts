import { createServerFn } from "@tanstack/react-start";
import { ensureSession } from "#/server/auth/ensure-session.middleware";
import { updatePaymentStatusSchema } from "./payments.schemas";
import { updatePaymentStatus } from "./services/update-payment-status.service";

export const updatePaymentStatusAction = createServerFn({ method: "POST" })
	.middleware([ensureSession])
	.inputValidator(updatePaymentStatusSchema)
	.handler(async ({ data }) => {
		return updatePaymentStatus(data);
	});
