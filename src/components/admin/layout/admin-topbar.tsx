"use client";

import { Avatar, Button, Dropdown } from "@heroui/react";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { useSignOut } from "#/hooks/use-auth.ts";
import { useSession } from "#/lib/auth-client";

const PAGE_TITLES: Record<string, string> = {
	"/admin": "Dashboard",
	"/admin/orders": "Orders",
	"/admin/products": "Products",
	"/admin/variants": "Variants",
	"/admin/categories": "Categories",
	"/admin/analytics": "Analytics",
	"/admin/payments": "Payments",
	"/admin/shipping": "Shipping",
	"/admin/reviews": "Reviews",
	"/admin/options": "Options",
	"/admin/settings": "Settings",
};

type Props = {
	onMenuClick: () => void;
};

export function AdminTopbar({ onMenuClick }: Props) {
	const { pathname } = useLocation();
	const pageTitle = PAGE_TITLES[pathname] ?? "Admin";

	const { data: session } = useSession();
	const userName = session?.user.name ?? "Admin";
	const avatarImage = session?.user.image ?? "";
	const userInitials = userName
		.split(" ")
		.map((n) => n[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);

	const { submitSignOut } = useSignOut();
	const navigate = useNavigate();

	const handleSignOut = async () => {
		const didSignOut = await submitSignOut();
		if (didSignOut) navigate({ to: "/" });
	};

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
								{avatarImage ? (
									<Avatar.Image src={avatarImage} alt={userName} />
								) : (
									userInitials
								)}
							</Avatar.Fallback>
						</Avatar>
						<span className="hidden sm:block text-sm font-medium text-foreground">
							{userName}
						</span>
					</div>
				</Dropdown.Trigger>
				<Dropdown.Popover>
					<Dropdown.Menu>
						<Dropdown.Item onAction={() => navigate({ to: "/admin/settings" })}>
							Settings
						</Dropdown.Item>
						<Dropdown.Item className="text-danger" onClick={handleSignOut}>
							Sign out
						</Dropdown.Item>
					</Dropdown.Menu>
				</Dropdown.Popover>
			</Dropdown>
		</header>
	);
}
