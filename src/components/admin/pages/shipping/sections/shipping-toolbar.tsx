"use client";

import { Button } from "@heroui/react";
import { CalendarDays, Package, Plus, Search, Truck, Zap } from "lucide-react";
import type {
	ShippingCarrierType,
	ShippingMethodType,
	ShippingStatusType,
} from "#/server/shipping/shipping.types";

type DateRange = { from?: string; to?: string };

type ShippingToolbarProps = {
	search: string;
	onSearchChange: (value: string) => void;
	status: ShippingStatusType | undefined;
	onStatusChange: (value: string) => void;
	carrier: ShippingCarrierType | undefined;
	onCarrierChange: (value: string) => void;
	method: ShippingMethodType | undefined;
	onMethodChange: (value: string) => void;
	dateRange: DateRange;
	onDateRangeChange: (value: DateRange) => void;
	onCreateClick: () => void;
};

const statusOptions = [
	{ value: "", label: "All statuses" },
	{ value: "pending", label: "Pending" },
	{ value: "packed", label: "Packed" },
	{ value: "shipped", label: "Shipped" },
	{ value: "in_transit", label: "In Transit" },
	{ value: "delivered", label: "Delivered" },
];

const carrierOptions = [
	{ value: "", label: "All carriers" },
	{ value: "dhl", label: "DHL" },
	{ value: "hermes", label: "Hermes" },
	{ value: "ups", label: "UPS" },
	{ value: "fedex", label: "FedEx" },
];

const methodOptions = [
	{ value: "", label: "All methods" },
	{ value: "standard", label: "Standard" },
	{ value: "express", label: "Express" },
	{ value: "same_day", label: "Same Day" },
];

const selectClass =
	"appearance-none pl-9 pr-8 py-2.5 text-sm rounded-xl border border-border bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40 transition-all cursor-pointer";

export function ShippingToolbar({
	search,
	onSearchChange,
	status,
	onStatusChange,
	carrier,
	onCarrierChange,
	method,
	onMethodChange,
	dateRange,
	onDateRangeChange,
	onCreateClick,
}: ShippingToolbarProps) {
	return (
		<div className="flex flex-wrap items-center gap-3">
			{/* Search */}
			<div className="relative flex-1 min-w-48">
				<Search
					size={15}
					className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
				/>
				<input
					type="text"
					value={search}
					onChange={(e) => onSearchChange(e.target.value)}
					placeholder="Search by order number..."
					className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-border bg-surface text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/40 transition-all"
				/>
			</div>

			{/* Status */}
			<div className="relative">
				<Package
					size={15}
					className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
				/>
				<select
					value={status ?? ""}
					onChange={(e) => onStatusChange(e.target.value)}
					className={selectClass}
				>
					{statusOptions.map(({ value, label }) => (
						<option key={value} value={value}>
							{label}
						</option>
					))}
				</select>
			</div>

			{/* Carrier */}
			<div className="relative">
				<Truck
					size={15}
					className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
				/>
				<select
					value={carrier ?? ""}
					onChange={(e) => onCarrierChange(e.target.value)}
					className={selectClass}
				>
					{carrierOptions.map(({ value, label }) => (
						<option key={value} value={value}>
							{label}
						</option>
					))}
				</select>
			</div>

			{/* Method */}
			<div className="relative">
				<Zap
					size={15}
					className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
				/>
				<select
					value={method ?? ""}
					onChange={(e) => onMethodChange(e.target.value)}
					className={selectClass}
				>
					{methodOptions.map(({ value, label }) => (
						<option key={value} value={value}>
							{label}
						</option>
					))}
				</select>
			</div>

			{/* Date range */}
			<div className="flex items-center gap-2">
				<div className="relative">
					<CalendarDays
						size={15}
						className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
					/>
					<input
						type="date"
						value={dateRange.from ?? ""}
						onChange={(e) =>
							onDateRangeChange({
								...dateRange,
								from: e.target.value || undefined,
							})
						}
						className="appearance-none pl-9 pr-3 py-2.5 text-sm rounded-xl border border-border bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40 transition-all cursor-pointer"
					/>
				</div>
				<span className="text-xs text-muted">to</span>
				<input
					type="date"
					value={dateRange.to ?? ""}
					onChange={(e) =>
						onDateRangeChange({ ...dateRange, to: e.target.value || undefined })
					}
					className="appearance-none px-3 py-2.5 text-sm rounded-xl border border-border bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40 transition-all cursor-pointer"
				/>
			</div>

			{/* New Shipment */}
			<Button
				variant="primary"
				size="sm"
				onPress={onCreateClick}
				className="whitespace-nowrap ml-auto"
			>
				<Plus size={15} />
				New Shipment
			</Button>
		</div>
	);
}
