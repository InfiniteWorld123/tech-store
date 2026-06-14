"use client";

import { Outlet } from "@tanstack/react-router";
import { Footer } from "#/components/layout/footer";
import { Header } from "#/components/layout/header";
import { AccountSidebar } from "./account-sidebar";

export function AccountLayout() {
	return (
		<div className="min-h-screen flex flex-col">
			<Header />

			<main className="flex-1 pt-24 pb-20">
				<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex gap-8">
						{/* Sidebar */}
						<aside className="hidden lg:block w-52 flex-shrink-0">
							<div className="sticky top-24">
								<p className="text-xs font-semibold text-muted uppercase tracking-widest px-3 mb-3">
									Account
								</p>
								<AccountSidebar />
							</div>
						</aside>

						{/* Mobile tabs */}
						<div className="lg:hidden w-full mb-6">
							<AccountSidebar />
						</div>

						{/* Content */}
						<div className="flex-1 min-w-0">
							<Outlet />
						</div>
					</div>
				</div>
			</main>

			<Footer />
		</div>
	);
}
