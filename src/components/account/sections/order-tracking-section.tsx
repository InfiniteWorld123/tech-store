"use client";

import { CheckCircle, Circle, Package, Truck } from "lucide-react";
import type { GetOrderTrackingOutputType } from "#/server/orders/customer/customer.types";

type Props = { tracking: GetOrderTrackingOutputType };

const STEPS: Array<{
	status: string;
	label: string;
	icon: React.ElementType;
}> = [
	{ status: "pending", label: "Order placed", icon: Circle },
	{ status: "packed", label: "Packed", icon: Package },
	{ status: "shipped", label: "Shipped", icon: Truck },
	{ status: "in_transit", label: "In transit", icon: Truck },
	{ status: "delivered", label: "Delivered", icon: CheckCircle },
];

const STATUS_ORDER = [
	"pending",
	"packed",
	"shipped",
	"in_transit",
	"delivered",
];

export function OrderTrackingSection({ tracking }: Props) {
	const currentIndex = STATUS_ORDER.indexOf(tracking.shipping.status);

	return (
		<div className="border border-border rounded-2xl p-5 space-y-4">
			<div className="flex items-center justify-between">
				<h3 className="font-bold text-foreground">Tracking</h3>
				{tracking.shipping.trackingNumber && (
					<span className="text-xs text-muted font-mono">
						{tracking.shipping.carrier.toUpperCase()}{" "}
						{tracking.shipping.trackingNumber}
					</span>
				)}
			</div>

			{/* Timeline */}
			<div className="space-y-3">
				{STEPS.map((step, i) => {
					const isDone = i <= currentIndex;
					const isCurrent = i === currentIndex;
					const Icon = step.icon;
					return (
						<div key={step.status} className="flex items-center gap-3">
							<div
								className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
									isDone
										? isCurrent
											? "bg-accent text-accent-foreground"
											: "bg-accent/20 text-accent"
										: "bg-surface-secondary text-muted"
								}`}
							>
								<Icon size={12} />
							</div>
							<div className="flex-1">
								<p
									className={`text-sm font-medium ${
										isDone ? "text-foreground" : "text-muted"
									}`}
								>
									{step.label}
								</p>
								{isCurrent &&
									step.status === "shipped" &&
									tracking.shipping.shippedAt && (
										<p className="text-xs text-muted">
											{new Date(tracking.shipping.shippedAt).toLocaleDateString(
												"en-DE",
												{ year: "numeric", month: "short", day: "numeric" },
											)}
										</p>
									)}
								{isCurrent &&
									step.status === "delivered" &&
									tracking.shipping.deliveredAt && (
										<p className="text-xs text-muted">
											{new Date(
												tracking.shipping.deliveredAt,
											).toLocaleDateString("en-DE", {
												year: "numeric",
												month: "short",
												day: "numeric",
											})}
										</p>
									)}
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
