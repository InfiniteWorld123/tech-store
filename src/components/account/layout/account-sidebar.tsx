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
		<nav className="flex gap-2 overflow-x-auto overscroll-x-contain pb-1 [-ms-overflow-style:none] [scrollbar-width:none] lg:flex-col lg:gap-1 lg:overflow-visible lg:pb-0 [&::-webkit-scrollbar]:hidden">
			{NAV_ITEMS.map(({ to, label, icon: Icon, query }) => (
				<LinkAnchor
					key={to}
					to={to}
					activeProps={{ className: "bg-accent/10 text-accent font-semibold" }}
					className="flex min-h-10 flex-shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-default hover:text-foreground lg:w-full lg:gap-3 lg:py-2.5"
					onFocus={() => prefetchRoute(query)}
					onMouseEnter={() => prefetchRoute(query)}
				>
					<Icon size={16} className="flex-shrink-0" />
					<span className="whitespace-nowrap">{label}</span>
				</LinkAnchor>
			))}
		</nav>
	);
}
