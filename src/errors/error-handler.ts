import { HttpStatusCode } from "#/constants/http.ts";
import { jsonError, type JsonError } from "#/constants/json.ts";
import { isAppError } from "#/errors/app-error";
import { APIError } from "better-auth/api";

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

export const handleError = (error: unknown): JsonError => {
    if (isJsonError(error)) {
        return error;
    }

    if (isAppError(error)) {
        return jsonError({
            message: error.message,
            status: error.status,
            code: error.code,
            details: error.details,
        });
    }

    // 1. Better Auth Server API Errors
    if (error instanceof APIError) {
        return jsonError({
            message: error.body?.message || error.message || 'Authentication error',
            status: error.status as HttpStatusCode,
            code: error.body?.code || 'AUTH_ERROR'
        });
    }

    // 2. Generic Error instances
    if (error instanceof Error) {
        // Better Fetch client error check (if thrown from authClient)
        if ('status' in error && 'error' in error) {
            const fetchError = error as BetterFetchErrorShape;
            return jsonError({
                message: fetchError.error?.message || fetchError.message || 'Client authentication error',
                status: (fetchError.status as HttpStatusCode | undefined) || HttpStatusCode.BAD_REQUEST,
                code: fetchError.error?.code || 'AUTH_FETCH_ERROR'
            });
        }

        return jsonError({
            message: error.message || 'An unexpected error occurred',
            status: HttpStatusCode.INTERNAL_SERVER_ERROR,
            code: 'INTERNAL_ERROR'
        });
    }

    // 3. Fallback
    return jsonError({
        message: 'An unexpected error occurred',
        status: HttpStatusCode.INTERNAL_SERVER_ERROR,
        code: 'UNKNOWN_ERROR'
    });
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