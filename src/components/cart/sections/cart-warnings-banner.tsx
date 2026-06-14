"use client";

import { AlertTriangle } from "lucide-react";
import type { CartWarningType } from "#/server/cart/cart.types";

type Props = { warnings: CartWarningType[] };

export function CartWarningsBanner({ warnings }: Props) {
	if (warnings.length === 0) return null;

	return (
		<div className="rounded-2xl border border-warning/30 bg-warning/10 px-4 py-3 space-y-1">
			<div className="flex items-center gap-2 text-warning font-semibold text-sm">
				<AlertTriangle size={14} />
				<span>Some items in your cart need attention</span>
			</div>
			<ul className="space-y-0.5">
				{warnings.map((w) => (
					<li
						key={w.cartItemId ?? w.variantId ?? w.message}
						className="text-xs text-warning/90 pl-5"
					>
						{w.message}
					</li>
				))}
			</ul>
		</div>
	);
}
