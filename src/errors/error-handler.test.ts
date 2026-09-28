import { afterEach, describe, expect, it, vi } from "vitest";
import { badRequestError } from "./app-error";
import { handleError } from "./error-handler";

describe("handleError", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("logs unexpected errors and hides their message from the client", () => {
		const log = vi.spyOn(console, "error").mockImplementation(() => {});
		const error = new Error("password authentication failed for user 'x'");

		const result = handleError(error);

		expect(result.message).toBe("An unexpected error occurred");
		expect(result.status).toBe(500);
		expect(log).toHaveBeenCalledWith("[unexpected error]", error);
	});

	it("keeps the message of expected application errors", () => {
		const log = vi.spyOn(console, "error").mockImplementation(() => {});

		const result = handleError(badRequestError("Invalid quantity"));

		expect(result.message).toBe("Invalid quantity");
		expect(log).not.toHaveBeenCalled();
	});
});
