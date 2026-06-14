import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { env } from "#/constants/env";

export const getSocialAuthProvidersAction = createServerFn({ method: "GET" })
	.inputValidator(z.object({}))
	.handler(async () => ({
		googleEnabled: Boolean(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET),
	}));
