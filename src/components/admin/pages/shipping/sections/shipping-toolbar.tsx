"use client";

import { Button } from "@heroui/react";
import { CalendarDays, Package, Plus, Search, Truck, Zap } from "lucide-react";
import type {
	ShippingCarrier,
	ShippingMethod,
	ShippingStatus,
} from "../shipping.types";

type DateRange = { from?: string; to?: string };

type ShippingToolbarProps = {
	search: string;
	onSearchChange: (value: string) => void;
	status: ShippingStatus | undefined;
	onStatusChange: (value: string) => void;
	onPrefetchStatus: (value: string) => void;
	carrier: ShippingCarrier | undefined;
	onCarrierChange: (value: string) => void;
	onPrefetchCarrier: (value: string) => void;
	method: ShippingMethod | undefined;
	onMethodChange: (value: string) => void;
	onPrefetchMethod: (value: string) => void;
	dateRange: DateRange;
	onDateRangeChange: (value: DateRange) => void;
	onPrefetchDateRange: (value: DateRange) => void;
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
	"w-full min-w-0 appearance-none pl-9 pr-8 py-2.5 text-sm rounded-xl border border-border bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40 transition-all cursor-pointer";

export function ShippingToolbar({
	search,
	onSearchChange,
	status,
	onStatusChange,
	onPrefetchStatus,
	carrier,
	onCarrierChange,
	onPrefetchCarrier,
	method,
	onMethodChange,
	onPrefetchMethod,
	dateRange,
	onDateRangeChange,
	onPrefetchDateRange,
	onCreateClick,
}: ShippingToolbarProps) {
	const warmStatuses = () => {
		for (const { value } of statusOptions) {
			onPrefetchStatus(value);
		}
	};
	const warmCarriers = () => {
		for (const { value } of carrierOptions) {
			onPrefetchCarrier(value);
		}
	};
	const warmMethods = () => {
		for (const { value } of methodOptions) {
			onPrefetchMethod(value);
		}
	};

	return (
		<div className="grid w-full min-w-0 grid-cols-1 gap-3 min-[520px]:grid-cols-2 xl:flex xl:flex-wrap xl:items-center">
			{/* Search */}
			<div className="relative min-w-0 min-[520px]:col-span-2 xl:col-span-1 xl:flex-1">
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
			<div className="relative min-w-0">
				<Package
					size={15}
					className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
				/>
				<select
					value={status ?? ""}
					onChange={(e) => onStatusChange(e.target.value)}
					onFocus={warmStatuses}
					onMouseEnter={warmStatuses}
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
			<div className="relative min-w-0">
				<Truck
					size={15}
					className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
				/>
				<select
					value={carrier ?? ""}
					onChange={(e) => onCarrierChange(e.target.value)}
					onFocus={warmCarriers}
					onMouseEnter={warmCarriers}
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
			<div className="relative min-w-0">
				<Zap
					size={15}
					className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
				/>
				<select
					value={method ?? ""}
					onChange={(e) => onMethodChange(e.target.value)}
					onFocus={warmMethods}
					onMouseEnter={warmMethods}
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
			<div className="grid min-w-0 grid-cols-1 gap-2 min-[420px]:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] min-[420px]:items-center min-[520px]:col-span-2 xl:col-span-1">
				<div className="relative min-w-0">
					<CalendarDays
						size={15}
						className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
					/>
					<input
						type="date"
						value={dateRange.from ?? ""}
						onChange={(e) => {
							const nextDateRange = {
								...dateRange,
								from: e.target.value || undefined,
							};
							onPrefetchDateRange(nextDateRange);
							onDateRangeChange(nextDateRange);
						}}
						onFocus={() => onPrefetchDateRange(dateRange)}
						className="w-full min-w-0 appearance-none rounded-xl border border-border bg-surface py-2.5 pl-9 pr-3 text-sm text-foreground transition-all focus:outline-none focus:ring-2 focus:ring-accent/40"
					/>
				</div>
				<span className="hidden justify-self-center text-xs text-muted min-[420px]:block">
					to
				</span>
				<input
					type="date"
					value={dateRange.to ?? ""}
					onChange={(e) => {
						const nextDateRange = {
							...dateRange,
							to: e.target.value || undefined,
						};
						onPrefetchDateRange(nextDateRange);
						onDateRangeChange(nextDateRange);
					}}
					onFocus={() => onPrefetchDateRange(dateRange)}
					className="w-full min-w-0 appearance-none rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-foreground transition-all focus:outline-none focus:ring-2 focus:ring-accent/40"
				/>
			</div>

			{/* New Shipment */}
			<Button
				variant="primary"
				size="sm"
				onPress={onCreateClick}
				className="w-full justify-center whitespace-nowrap min-[520px]:w-auto xl:ml-auto"
			>
				<Plus size={15} />
				New Shipment
			</Button>
		</div>
	);
}
