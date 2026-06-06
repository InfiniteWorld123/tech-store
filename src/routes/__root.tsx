import { Toast } from "@heroui/react";
import type { QueryClient } from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	HeadContent,
	Scripts,
	useRouter,
} from "@tanstack/react-router";
import appCss from "../styles.css?url";

interface MyRouterContext {
	queryClient: QueryClient;
}

function RootErrorComponent({ error }: { error: Error }) {
	const router = useRouter();

	return (
		<html lang="en" className="light" data-theme="light">
			<head>
				<HeadContent />
			</head>
			<body className="bg-background text-foreground">
				<div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
					<p className="text-4xl">⚠️</p>
					<h1 className="text-xl font-semibold">Something went wrong</h1>
					<p className="max-w-md text-sm text-muted">
						{error.message || "An unexpected error occurred."}
					</p>
					<button
						type="button"
						onClick={() => router.invalidate()}
						className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
					>
						Try again
					</button>
				</div>
				<Scripts />
			</body>
		</html>
	);
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "TanStack Start Starter",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
		],
	}),
	errorComponent: RootErrorComponent,
	shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" className="light" data-theme="light">
			<head>
				<HeadContent />
			</head>
			<body className="bg-background text-foreground">
				<Toast.Provider />
				{children}
				<Scripts />
			</body>
		</html>
	);
}
