import { createFileRoute } from "@tanstack/react-router";
import { ResetPasswordPage } from "#/components/auth/pages/reset-password-page";

export const Route = createFileRoute("/_auth/reset-password")({
	validateSearch: (search: Record<string, unknown>) => ({
		token: typeof search.token === "string" ? search.token : undefined,
		error: typeof search.error === "string" ? search.error : undefined,
	}),
	component: ResetPassword,
});

function ResetPassword() {
	const { token, error } = Route.useSearch();
	return <ResetPasswordPage token={token} searchError={error} />;
}
