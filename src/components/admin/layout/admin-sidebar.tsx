"use client";

import { Button } from "@heroui/react";
import { useLocation } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import {
	BarChart2,
	Boxes,
	ChevronLeft,
	ChevronRight,
	CreditCard,
	Layers,
	LayoutDashboard,
	Package,
	Settings,
	ShoppingBag,
	Star,
	Truck,
	X,
	Zap,
} from "lucide-react";
import LinkAnchor from "#/components/ui/buttons/link-anchor";

type NavItem = {
	label: string;
	icon: LucideIcon;
	href: string;
};

type NavGroup = {
	label: string;
	items: NavItem[];
};

const NAV_GROUPS: NavGroup[] = [
	{
		label: "Overview",
		items: [
			{ label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
			{ label: "Analytics", icon: BarChart2, href: "/admin/analytics" },
		],
	},
	{
		label: "Catalog",
		items: [
			{ label: "Products", icon: Package, href: "/admin/products" },
			{ label: "Variants", icon: Package, href: "/admin/variants" },
			{ label: "Categories", icon: Layers, href: "/admin/categories" },
			{ label: "Options", icon: Boxes, href: "/admin/options" },
		],
	},
	{
		label: "Operations",
		items: [
			{ label: "Orders", icon: ShoppingBag, href: "/admin/orders" },
			{ label: "Payments", icon: CreditCard, href: "/admin/payments" },
			{ label: "Shipping", icon: Truck, href: "/admin/shipping" },
		],
	},
	{
		label: "Community",
		items: [{ label: "Reviews", icon: Star, href: "/admin/reviews" }],
	},
	{
		label: "System",
		items: [{ label: "Settings", icon: Settings, href: "/admin/settings" }],
	},
];

type Props = {
	collapsed: boolean;
	onToggleCollapse: () => void;
	mobileOpen: boolean;
	onMobileClose: () => void;
};

export function AdminSidebar({
	collapsed,
	onToggleCollapse,
	mobileOpen,
	onMobileClose,
}: Props) {
	return (
		<>
			{/* Desktop sidebar */}
			<aside
				className={`
					hidden md:flex flex-col flex-shrink-0
					overflow-hidden rounded-2xl border border-border bg-surface shadow-sm
					transition-all duration-200 ease-in-out
					${collapsed ? "w-16" : "w-64"}
				`}
			>
				<SidebarContent
					collapsed={collapsed}
					onToggleCollapse={onToggleCollapse}
				/>
			</aside>

			{/* Mobile overlay */}
			{mobileOpen && (
				<>
					<Button
						className="fixed inset-0 z-40 bg-foreground/40 md:hidden"
						variant="ghost"
						aria-label="Close menu"
						onPress={onMobileClose}
					/>
					<aside className="fixed inset-y-4 left-4 z-50 flex w-64 flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-xl md:hidden">
						<div className="flex items-center justify-between px-4 py-4 border-b border-border">
							<LinkAnchor
								to="/admin"
								className="flex items-center gap-2"
								onClick={onMobileClose}
							>
								<div className="w-7 h-7 rounded-md bg-accent flex items-center justify-center flex-shrink-0">
									<Zap size={14} className="text-accent-foreground" />
								</div>
								<span className="font-bold text-base">
									tech<span className="text-accent">store</span>
								</span>
							</LinkAnchor>
							<Button
								type="button"
								onPress={onMobileClose}
								isIconOnly
								size="sm"
								variant="ghost"
								className="text-muted hover:text-foreground"
								aria-label="Close menu"
							>
								<X size={18} />
							</Button>
						</div>
						<MobileNav onClose={onMobileClose} />
					</aside>
				</>
			)}
		</>
	);
}

function SidebarContent({
	collapsed,
	onToggleCollapse,
}: {
	collapsed: boolean;
	onToggleCollapse: () => void;
}) {
	const { pathname } = useLocation();

	return (
		<>
			{/* Logo */}
			<LinkAnchor
				to="/admin"
				className={
					collapsed
						? "mx-auto mt-4 mb-3 flex size-11 items-center justify-center rounded-xl bg-accent text-accent-foreground no-underline"
						: "flex items-center gap-2.5 border-b border-border px-4 py-5 no-underline"
				}
			>
				<div
					className={
						collapsed
							? "flex items-center justify-center"
							: "flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md bg-accent"
					}
				>
					<Zap size={collapsed ? 20 : 14} className="text-accent-foreground" />
				</div>
				{!collapsed && (
					<span className="font-bold text-base">
						tech<span className="text-accent">store</span>
					</span>
				)}
			</LinkAnchor>
			{collapsed ? <div className="mx-auto mb-3 h-px w-10 bg-border" /> : null}

			{/* Nav */}
			<nav
				className={
					collapsed
						? "flex flex-1 flex-col items-center overflow-y-auto py-2"
						: "flex-1 overflow-y-auto px-2 py-3"
				}
			>
				{NAV_GROUPS.map((group) => (
					<div key={group.label} className={collapsed ? "mb-2 w-full" : "mb-1"}>
						{!collapsed && (
							<p className="px-2 pb-1 pt-3 text-[10px] font-semibold uppercase tracking-widest text-muted select-none">
								{group.label}
							</p>
						)}
						{collapsed && group.label !== "Overview" ? (
							<div className="mx-auto my-3 h-px w-10 bg-border/80" />
						) : null}
						{group.items.map((item) => {
							const isActive = pathname === item.href;
							return (
								<LinkAnchor
									preload="intent"
									key={item.href}
									to={item.href}
									aria-label={collapsed ? item.label : undefined}
									className={`
										flex items-center rounded-xl text-sm transition-colors
										${collapsed ? "mx-auto mb-2 size-11 justify-center p-0" : "mb-0.5 gap-3 px-2 py-2"}
										${isActive ? "bg-accent/10 text-accent font-medium" : "text-muted hover:text-foreground hover:bg-default"}
									`}
								>
									<item.icon
										size={collapsed ? 21 : 18}
										className="flex-shrink-0"
									/>
									{!collapsed && <span>{item.label}</span>}
								</LinkAnchor>
							);
						})}
					</div>
				))}
			</nav>

			{/* Toggle button */}
			<div
				className={
					collapsed
						? "mt-auto flex justify-center border-t border-border p-2"
						: "mt-auto border-t border-border p-2"
				}
			>
				<Button
					type="button"
					onPress={onToggleCollapse}
					variant="ghost"
					isIconOnly={collapsed}
					className={`
						flex items-center gap-2 rounded-xl text-sm text-muted
						hover:text-foreground hover:bg-default transition-colors
						${collapsed ? "size-11 justify-center p-0" : "w-full px-2 py-2"}
					`}
					aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
				>
					{collapsed ? (
						<ChevronRight size={16} />
					) : (
						<>
							<ChevronLeft size={16} />
							<span>Collapse</span>
						</>
					)}
				</Button>
			</div>
		</>
	);
}

function MobileNav({ onClose }: { onClose: () => void }) {
	const { pathname } = useLocation();

	return (
		<nav className="flex-1 overflow-y-auto py-3 px-2">
			{NAV_GROUPS.map((group) => (
				<div key={group.label} className="mb-1">
					<p className="px-2 pb-1 pt-3 text-[10px] font-semibold uppercase tracking-widest text-muted select-none">
						{group.label}
					</p>
					{group.items.map((item) => {
						const isActive = pathname === item.href;
						return (
							<LinkAnchor
								key={item.href}
								to={item.href}
								onClick={onClose}
								className={`
									flex items-center gap-3 px-2 py-2 rounded-lg text-sm transition-colors mb-0.5
									${isActive ? "bg-accent/10 text-accent font-medium" : "text-muted hover:text-foreground hover:bg-default"}
								`}
							>
								<item.icon size={18} className="flex-shrink-0" />
								<span>{item.label}</span>
							</LinkAnchor>
						);
					})}
				</div>
			))}
		</nav>
	);
}
