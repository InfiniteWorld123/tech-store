import { describe, expect, it } from "vitest";
import {
	isReusableCheckoutSession,
	toStripeAmount,
} from "./stripe-checkout-helpers";

describe("toStripeAmount", () => {
	it("converts euros or dollars to cents", () => {
		expect(toStripeAmount("10.00")).toBe(1000);
		expect(toStripeAmount("19.99")).toBe(1999);
	});
});

describe("isReusableCheckoutSession", () => {
	it("reuses only open checkout sessions with a URL", () => {
		expect(
			isReusableCheckoutSession({
				checkoutUrl: "https://checkout.stripe.com/test",
				status: "open",
			}),
		).toBe(true);
	});

	it("does not reuse expired or missing checkout URLs", () => {
		expect(
			isReusableCheckoutSession({
				checkoutUrl: "https://checkout.stripe.com/test",
				status: "expired",
			}),
		).toBe(false);
		expect(
			isReusableCheckoutSession({ checkoutUrl: null, status: "open" }),
		).toBe(false);
	});
});
