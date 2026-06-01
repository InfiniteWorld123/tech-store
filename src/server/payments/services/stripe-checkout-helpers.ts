type ExistingStripeCheckoutSession = {
	checkoutUrl: string | null;
	status: string | null;
};

export const toStripeAmount = (amount: string): number => {
	return Math.round(Number(amount) * 100);
};

export const isReusableCheckoutSession = (
	session: ExistingStripeCheckoutSession | null | undefined,
): session is ExistingStripeCheckoutSession & { checkoutUrl: string } => {
	// Stripe Checkout URLs stop working after the session expires.
	return Boolean(session?.checkoutUrl && session.status === "open");
};
