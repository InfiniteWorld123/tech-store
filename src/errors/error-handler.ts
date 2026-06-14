import { APIError } from "better-auth/api";
import { HttpStatusCode } from "#/constants/http.ts";
import { type JsonError, jsonError } from "#/constants/json.ts";
import { isAppError } from "#/errors/app-error";

type BetterFetchErrorShape = Error & {
	status?: number;
	error?: {
		message?: string;
		code?: string;
	};
};

const isJsonError = (error: unknown): error is JsonError => {
	if (!error || typeof error !== "object") {
		return false;
	}

	return (
		"success" in error &&
		"status" in error &&
		"message" in error &&
		(error as JsonError).success === false
	);
};

const toErrorWithJson = (je: JsonError): Error & JsonError =>
	Object.assign(new Error(je.message), je);

export const handleError = (error: unknown): Error & JsonError => {
	if (isJsonError(error)) {
		if (error instanceof Error) return error as Error & JsonError;
		return toErrorWithJson(error);
	}

	if (isAppError(error)) {
		return toErrorWithJson(
			jsonError({
				message: error.message,
				status: error.status,
				code: error.code,
				details: error.details,
			}),
		);
	}

	// 1. Better Auth Server API Errors
	if (error instanceof APIError) {
		return toErrorWithJson(
			jsonError({
				message: error.body?.message || error.message || "Authentication error",
				status: error.status as HttpStatusCode,
				code: error.body?.code || "AUTH_ERROR",
			}),
		);
	}

	// 2. Generic Error instances
	if (error instanceof Error) {
		// Better Fetch client error check (if thrown from authClient)
		if ("status" in error && "error" in error) {
			const fetchError = error as BetterFetchErrorShape;
			return toErrorWithJson(
				jsonError({
					message:
						fetchError.error?.message ||
						fetchError.message ||
						"Client authentication error",
					status:
						(fetchError.status as HttpStatusCode | undefined) ||
						HttpStatusCode.BAD_REQUEST,
					code: fetchError.error?.code || "AUTH_FETCH_ERROR",
				}),
			);
		}

		return toErrorWithJson(
			jsonError({
				message: error.message || "An unexpected error occurred",
				status: HttpStatusCode.INTERNAL_SERVER_ERROR,
				code: "INTERNAL_ERROR",
			}),
		);
	}

	// 3. Fallback
	return toErrorWithJson(
		jsonError({
			message: "An unexpected error occurred",
			status: HttpStatusCode.INTERNAL_SERVER_ERROR,
			code: "UNKNOWN_ERROR",
		}),
	);
};

export const catchAsyncFn = <TArgs extends unknown[], TResult>(
	fn: (...args: TArgs) => Promise<TResult>,
): ((...args: TArgs) => Promise<TResult>) => {
	return async (...args: TArgs) => {
		try {
			return await fn(...args);
		} catch (error) {
			throw handleError(error);
		}
	};
};
