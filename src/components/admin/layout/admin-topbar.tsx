"use client";

import { Avatar, Button, Dropdown } from "@heroui/react";
import { useLocation } from "@tanstack/react-router";
import { Menu } from "lucide-react";

const PAGE_TITLES: Record<string, string> = {
	"/admin": "Dashboard",
	"/admin/orders": "Orders",
	"/admin/products": "Products",
	"/admin/categories": "Categories",
	"/admin/analytics": "Analytics",
	"/admin/customers": "Customers",
	"/admin/payments": "Payments",
	"/admin/shipping": "Shipping",
	"/admin/reviews": "Reviews",
	"/admin/inventory": "Inventory",
	"/admin/settings": "Settings",
};

type Props = {
	onMenuClick: () => void;
};

export function AdminTopbar({ onMenuClick }: Props) {
	const { pathname } = useLocation();
	const pageTitle = PAGE_TITLES[pathname] ?? "Admin";

	return (
		<header className="flex h-16 flex-shrink-0 items-center justify-between rounded-2xl border border-border bg-surface px-4 shadow-sm">
			{/* Left: hamburger (mobile) + page title */}
			<div className="flex items-center gap-3">
				<Button
					type="button"
					onPress={onMenuClick}
					isIconOnly
					variant="ghost"
					className="md:hidden text-muted hover:text-foreground"
					aria-label="Open menu"
				>
					<Menu size={20} />
				</Button>
				<h1 className="font-semibold text-foreground text-base">{pageTitle}</h1>
			</div>

			{/* Right: user dropdown */}
			<Dropdown>
				<Dropdown.Trigger>
					<div className="flex items-center gap-2.5 px-2 py-1.5">
						<Avatar className="w-7 h-7">
							<Avatar.Fallback className="text-xs bg-accent text-accent-foreground">
								AU
							</Avatar.Fallback>
						</Avatar>
						<span className="hidden sm:block text-sm font-medium text-foreground">
							Admin User
						</span>
					</div>
				</Dropdown.Trigger>
				<Dropdown.Popover>
					<Dropdown.Menu>
						<Dropdown.Item>Profile</Dropdown.Item>
						<Dropdown.Item>Settings</Dropdown.Item>
						<Dropdown.Item className="text-danger">Sign out</Dropdown.Item>
					</Dropdown.Menu>
				</Dropdown.Popover>
			</Dropdown>
		</header>
	);
}
