"use client";

import { createFileRoute, Outlet, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AdminSidebar } from "#/components/admin/layout/admin-sidebar";
import { AdminTopbar } from "#/components/admin/layout/admin-topbar";

export const Route = createFileRoute("/admin")({ component: AdminLayout });

function AdminLayout() {
	const [collapsed, setCollapsed] = useState<boolean>(() => {
		if (typeof window === "undefined") return false;
		return localStorage.getItem("admin-sidebar-collapsed") === "true";
	});
	const [mobileOpen, setMobileOpen] = useState(false);
	const { pathname } = useLocation();

	useEffect(() => {
		localStorage.setItem("admin-sidebar-collapsed", String(collapsed));
	}, [collapsed]);

	useEffect(() => {
		if (pathname.length > 0) {
			setMobileOpen(false);
		}
	}, [pathname]);

	return (
		<div className="flex h-screen gap-4 overflow-hidden bg-surface-secondary p-4">
			<AdminSidebar
				collapsed={collapsed}
				onToggleCollapse={() => setCollapsed((c) => !c)}
				mobileOpen={mobileOpen}
				onMobileClose={() => setMobileOpen(false)}
			/>
			<div className="flex min-w-0 flex-1 flex-col gap-4 overflow-hidden">
				<AdminTopbar onMenuClick={() => setMobileOpen(true)} />
				<main className="flex-1 overflow-auto px-2 pb-2 rounded-2xl border border-border bg-surface px-4 shadow-sm">
					<Outlet />
				</main>
			</div>
		</div>
	);
}
