"use client";

import { MapPin, Package, Star } from "lucide-react";
import LinkAnchor from "#/components/ui/buttons/link-anchor";
import { useQueryIntentPrefetch } from "#/hooks/use-query-intent-prefetch";
import { listAddressesQueryOptions } from "#/queries/addresses.queries";
import { listCustomerOrdersQueryOptions } from "#/queries/orders.queries";
import { listMyReviewsQueryOptions } from "#/queries/reviews.queries";

const NAV_ITEMS = [
	{ to: "/account/orders", label: "My Orders", icon: Package, query: "orders" },
	{
		to: "/account/addresses",
		label: "My Addresses",
		icon: MapPin,
		query: "addresses",
	},
	{ to: "/account/reviews", label: "My Reviews", icon: Star, query: "reviews" },
] as const;

export function AccountSidebar() {
	const { prefetch } = useQueryIntentPrefetch();

	const prefetchRoute = (query: (typeof NAV_ITEMS)[number]["query"]) => {
		if (query === "orders") {
			prefetch(
				listCustomerOrdersQueryOptions({
					status: "all",
					page: 1,
					limit: 10,
				}),
			);
		}
		if (query === "addresses") prefetch(listAddressesQueryOptions);
		if (query === "reviews") prefetch(listMyReviewsQueryOptions());
	};

	return (
		<nav className="flex flex-col gap-1">
			{NAV_ITEMS.map(({ to, label, icon: Icon, query }) => (
				<LinkAnchor
					key={to}
					to={to}
					activeProps={{ className: "bg-accent/10 text-accent font-semibold" }}
					className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted hover:text-foreground hover:bg-default transition-colors"
					onFocus={() => prefetchRoute(query)}
					onMouseEnter={() => prefetchRoute(query)}
				>
					<Icon size={16} className="flex-shrink-0" />
					{label}
				</LinkAnchor>
			))}
		</nav>
	);
}
