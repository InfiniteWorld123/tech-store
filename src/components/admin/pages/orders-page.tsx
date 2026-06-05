"use client";

import {
	Button,
	Card,
	Checkbox,
	CheckboxGroup,
	Chip,
	Disclosure,
	Dropdown,
	InputGroup,
	Label,
	Modal,
	NumberField,
	Pagination,
	Switch,
	Table,
	Tabs,
	TextField,
} from "@heroui/react";
import {
	AlertCircle,
	Archive,
	Ban,
	Banknote,
	CalendarClock,
	CheckCircle2,
	ChevronDown,
	Copy,
	FileText,
	Grid3X3,
	LayoutList,
	MoreHorizontal,
	PackageSearch,
	Printer,
	ReceiptText,
	RotateCcw,
	Search,
	ShoppingBag,
	SlidersHorizontal,
	TableProperties,
	UserRound,
} from "lucide-react";
import { type ReactNode, useState } from "react";
import {
	AdminEmptyState,	AdminSectionError,
} from "#/components/admin/sections/admin-page";

type OrderStatus = "pending" | "processing" | "completed" | "cancelled";
type ArchiveVisibility = "active" | "archived" | "all";
type DemoState = "data" | "empty" | "error";
type ChipColor = "accent" | "default" | "danger" | "success" | "warning";

type OrderItemMock = {
	productName: string;
	quantity: number;
	sku: string;
	variantName: string;
};

type OrderMock = {
	id: string;
	addressId: string;
	archivedAt: string | null;
	createdAt: string;
	customer: {
		email: string;
		id: string;
		name: string;
	};
	itemCount: number;
	items: OrderItemMock[];
	notes: string | null;
	orderNumber: string;
	placedAt: string;
	shippingFee: number;
	status: OrderStatus;
	subtotal: number;
	taxAmount: number;
	totalAmount: number;
	updatedAt: string;
	userId: string;
};

type SelectOption = {
	id: string;
	label: string;
};

const ORDER_STATUS_OPTIONS = [
	{ id: "pending", label: "Pending" },
	{ id: "processing", label: "Processing" },
	{ id: "completed", label: "Completed" },
	{ id: "cancelled", label: "Cancelled" },
] satisfies SelectOption[];

const ARCHIVE_VISIBILITY_OPTIONS = [
	{ id: "active", label: "Active" },
	{ id: "archived", label: "Archived" },
	{ id: "all", label: "All" },
] satisfies SelectOption[];

const SEARCH_TYPE_OPTIONS = [
	{ id: "orderNumber", label: "Order #" },
	{ id: "customerName", label: "Customer" },
	{ id: "customerEmail", label: "Email" },
	{ id: "productName", label: "Product" },
	{ id: "sku", label: "SKU" },
] satisfies SelectOption[];

const SORT_OPTIONS = [
	{ id: "placed-desc", label: "Newest first" },
	{ id: "placed-asc", label: "Oldest first" },
	{ id: "total-desc", label: "Total high-low" },
	{ id: "total-asc", label: "Total low-high" },
	{ id: "status-asc", label: "Status A-Z" },
	{ id: "customer-asc", label: "Customer A-Z" },
	{ id: "updated-desc", label: "Recently updated" },
] satisfies SelectOption[];

const PAGE_SIZE_OPTIONS = [
	{ id: "10", label: "10 / page" },
	{ id: "25", label: "25 / page" },
	{ id: "50", label: "50 / page" },
	{ id: "100", label: "100 / page" },
] satisfies SelectOption[];

const DEMO_STATE_OPTIONS = [
	{ id: "data", label: "Data" },
	{ id: "empty", label: "Empty" },
	{ id: "error", label: "Error" },
] satisfies SelectOption[];

const STATUS_META: Record<
	OrderStatus,
	{
		color: ChipColor;
		label: string;
	}
> = {
	pending: { color: "warning", label: "Pending" },
	processing: { color: "accent", label: "Processing" },
	completed: { color: "success", label: "Completed" },
	cancelled: { color: "danger", label: "Cancelled" },
};

const ALLOWED_ORDER_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
	pending: ["processing", "cancelled"],
	processing: ["completed", "cancelled"],
	completed: [],
	cancelled: [],
};

const MOCK_ORDERS: OrderMock[] = [
	{
		id: "ord_01jz_berlin_1001",
		userId: "usr_lena_weber",
		addressId: "addr_lena_weber",
		orderNumber: "TS-2026-1001",
		status: "pending",
		subtotal: 1199,
		shippingFee: 0,
		taxAmount: 227.81,
		totalAmount: 1426.81,
		notes: "Customer asked for invoice copy by email.",
		placedAt: "2026-06-02T09:12:00.000Z",
		createdAt: "2026-06-02T09:12:00.000Z",
		updatedAt: "2026-06-02T09:18:00.000Z",
		archivedAt: null,
		customer: {
			id: "usr_lena_weber",
			name: "Lena Weber",
			email: "lena.weber@example.de",
		},
		itemCount: 1,
		items: [
			{
				productName: "iPhone 16 Pro",
				variantName: "Natural Titanium, 256 GB",
				sku: "IP16P-TTN-256",
				quantity: 1,
			},
		],
	},
	{
		id: "ord_01jz_hamburg_1002",
		userId: "usr_matthias_klein",
		addressId: "addr_matthias_klein",
		orderNumber: "TS-2026-1002",
		status: "processing",
		subtotal: 2199,
		shippingFee: 14.9,
		taxAmount: 420.64,
		totalAmount: 2634.54,
		notes: null,
		placedAt: "2026-06-01T15:42:00.000Z",
		createdAt: "2026-06-01T15:42:00.000Z",
		updatedAt: "2026-06-02T08:30:00.000Z",
		archivedAt: null,
		customer: {
			id: "usr_matthias_klein",
			name: "Matthias Klein",
			email: "matthias.klein@example.de",
		},
		itemCount: 2,
		items: [
			{
				productName: "MacBook Pro 14",
				variantName: "Space Black, 512 GB",
				sku: "MBP14-M4-BLK-512",
				quantity: 1,
			},
			{
				productName: "USB-C Travel Hub",
				variantName: "Graphite",
				sku: "USBC-HUB-GRF",
				quantity: 1,
			},
		],
	},
	{
		id: "ord_01jz_munich_1003",
		userId: "usr_sophia_bauer",
		addressId: "addr_sophia_bauer",
		orderNumber: "TS-2026-1003",
		status: "completed",
		subtotal: 899,
		shippingFee: 0,
		taxAmount: 170.81,
		totalAmount: 1069.81,
		notes: "Gift wrap requested.",
		placedAt: "2026-05-31T11:05:00.000Z",
		createdAt: "2026-05-31T11:05:00.000Z",
		updatedAt: "2026-06-01T17:20:00.000Z",
		archivedAt: null,
		customer: {
			id: "usr_sophia_bauer",
			name: "Sophia Bauer",
			email: "sophia.bauer@example.de",
		},
		itemCount: 2,
		items: [
			{
				productName: "Pixelbook Air",
				variantName: "Porcelain, 16 GB RAM",
				sku: "PBA-POR-16",
				quantity: 1,
			},
			{
				productName: "Laptop Sleeve 14",
				variantName: "Slate",
				sku: "SLV14-SLT",
				quantity: 1,
			},
		],
	},
	{
		id: "ord_01jz_cologne_1004",
		userId: "usr_emil_schneider",
		addressId: "addr_emil_schneider",
		orderNumber: "TS-2026-1004",
		status: "pending",
		subtotal: 1299,
		shippingFee: 9.9,
		taxAmount: 248.69,
		totalAmount: 1557.59,
		notes: null,
		placedAt: "2026-05-30T18:16:00.000Z",
		createdAt: "2026-05-30T18:16:00.000Z",
		updatedAt: "2026-05-30T18:16:00.000Z",
		archivedAt: null,
		customer: {
			id: "usr_emil_schneider",
			name: "Emil Schneider",
			email: "emil.schneider@example.de",
		},
		itemCount: 1,
		items: [
			{
				productName: "Galaxy S26 Ultra",
				variantName: "Graphite, 512 GB",
				sku: "GS26U-GRF-512",
				quantity: 1,
			},
		],
	},
	{
		id: "ord_01jz_frankfurt_1005",
		userId: "usr_amina_hoffmann",
		addressId: "addr_amina_hoffmann",
		orderNumber: "TS-2026-1005",
		status: "cancelled",
		subtotal: 349,
		shippingFee: 6.9,
		taxAmount: 67.62,
		totalAmount: 423.52,
		notes: "Customer cancelled before processing.",
		placedAt: "2026-05-29T13:48:00.000Z",
		createdAt: "2026-05-29T13:48:00.000Z",
		updatedAt: "2026-05-29T14:03:00.000Z",
		archivedAt: null,
		customer: {
			id: "usr_amina_hoffmann",
			name: "Amina Hoffmann",
			email: "amina.hoffmann@example.de",
		},
		itemCount: 1,
		items: [
			{
				productName: "Sony WH-1000XM6",
				variantName: "Midnight Blue",
				sku: "SONY-XM6-BLU",
				quantity: 1,
			},
		],
	},
	{
		id: "ord_01jz_stuttgart_1006",
		userId: "usr_noah_fischer",
		addressId: "addr_noah_fischer",
		orderNumber: "TS-2026-1006",
		status: "completed",
		subtotal: 2599,
		shippingFee: 0,
		taxAmount: 493.81,
		totalAmount: 3092.81,
		notes: null,
		placedAt: "2026-05-27T10:22:00.000Z",
		createdAt: "2026-05-27T10:22:00.000Z",
		updatedAt: "2026-05-28T16:01:00.000Z",
		archivedAt: "2026-06-01T10:00:00.000Z",
		customer: {
			id: "usr_noah_fischer",
			name: "Noah Fischer",
			email: "noah.fischer@example.de",
		},
		itemCount: 1,
		items: [
			{
				productName: "MacBook Pro 14",
				variantName: "Silver, 1 TB",
				sku: "MBP14-M4-SLV-1TB",
				quantity: 1,
			},
		],
	},
	{
		id: "ord_01jz_leipzig_1007",
		userId: "usr_mila_wagner",
		addressId: "addr_mila_wagner",
		orderNumber: "TS-2026-1007",
		status: "processing",
		subtotal: 1878,
		shippingFee: 14.9,
		taxAmount: 359.65,
		totalAmount: 2252.55,
		notes: "Business customer, include VAT number on invoice.",
		placedAt: "2026-05-26T16:34:00.000Z",
		createdAt: "2026-05-26T16:34:00.000Z",
		updatedAt: "2026-05-27T08:48:00.000Z",
		archivedAt: null,
		customer: {
			id: "usr_mila_wagner",
			name: "Mila Wagner",
			email: "mila.wagner@example.de",
		},
		itemCount: 3,
		items: [
			{
				productName: "iPhone 16 Pro",
				variantName: "Black Titanium, 512 GB",
				sku: "IP16P-BLK-512",
				quantity: 1,
			},
			{
				productName: "MagSafe Charger",
				variantName: "White",
				sku: "MAG-CHG-WHT",
				quantity: 1,
			},
			{
				productName: "Protective Case",
				variantName: "Clear",
				sku: "CASE-IP16-CLR",
				quantity: 1,
			},
		],
	},
	{
		id: "ord_01jz_dusseldorf_1008",
		userId: "usr_jonas_becker",
		addressId: "addr_jonas_becker",
		orderNumber: "TS-2026-1008",
		status: "completed",
		subtotal: 749,
		shippingFee: 6.9,
		taxAmount: 143.62,
		totalAmount: 899.52,
		notes: null,
		placedAt: "2026-05-24T12:12:00.000Z",
		createdAt: "2026-05-24T12:12:00.000Z",
		updatedAt: "2026-05-25T15:11:00.000Z",
		archivedAt: "2026-05-31T09:30:00.000Z",
		customer: {
			id: "usr_jonas_becker",
			name: "Jonas Becker",
			email: "jonas.becker@example.de",
		},
		itemCount: 2,
		items: [
			{
				productName: "Galaxy Tab Pro",
				variantName: "Graphite, 256 GB",
				sku: "GTAB-PRO-GRF-256",
				quantity: 1,
			},
			{
				productName: "S Pen",
				variantName: "Black",
				sku: "SPEN-BLK",
				quantity: 1,
			},
		],
	},
];

function formatCurrency(value: number) {
	return new Intl.NumberFormat("de-DE", {
		currency: "EUR",
		style: "currency",
	}).format(value);
}

function formatDate(value: string) {
	return new Intl.DateTimeFormat("en-GB", {
		day: "2-digit",
		month: "short",
		year: "numeric",
	}).format(new Date(value));
}

function getAllowedNextStatuses(status: OrderStatus) {
	return ALLOWED_ORDER_STATUS_TRANSITIONS[status];
}

function getOrderItemSummary(order: OrderMock) {
	const [firstItem] = order.items;

	if (!firstItem) {
		return "No items";
	}

	if (order.items.length === 1) {
		return `${firstItem.productName} · ${firstItem.variantName}`;
	}

	return `${firstItem.productName} +${order.items.length - 1} more`;
}

function getCustomerInitials(name: string) {
	return name
		.split(" ")
		.map((part) => part[0])
		.join("")
		.slice(0, 2)
		.toUpperCase();
}

function getVisibleOrders(
	orders: OrderMock[],
	archiveVisibility: ArchiveVisibility,
) {
	switch (archiveVisibility) {
		case "archived":
			return orders.filter((order) => order.archivedAt !== null);
		case "all":
			return orders;
		default:
			return orders.filter((order) => order.archivedAt === null);
	}
}

function OrderStatusChip({ status }: { status: OrderStatus }) {
	const meta = STATUS_META[status];

	return (
		<Chip color={meta.color} size="sm" variant="soft">
			{meta.label}
		</Chip>
	);
}

function ArchiveChip({ archivedAt }: { archivedAt: string | null }) {
	return (
		<Chip color={archivedAt ? "default" : "success"} size="sm" variant="soft">
			{archivedAt ? "Archived" : "Active"}
		</Chip>
	);
}

function OrderIdentity({ order }: { order: OrderMock }) {
	return (
		<div className="flex min-w-0 flex-col">
			<p className="truncate text-sm font-medium text-foreground">
				{order.orderNumber}
			</p>
			<p className="mt-0.5 truncate text-xs text-muted">
				{getOrderItemSummary(order)}
			</p>
		</div>
	);
}

function CustomerCell({ order }: { order: OrderMock }) {
	return (
		<div className="flex min-w-0 items-center gap-3">
			<div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-xs font-semibold text-accent">
				{getCustomerInitials(order.customer.name)}
			</div>
			<div className="min-w-0">
				<p className="truncate text-sm font-medium text-foreground">
					{order.customer.name}
				</p>
				<p className="mt-0.5 truncate text-xs text-muted">
					{order.customer.email}
				</p>
			</div>
		</div>
	);
}

function OrderMetric({
	children,
	label,
}: {
	children: ReactNode;
	label: string;
}) {
	return (
		<div className="min-w-0">
			<p className="text-[11px] font-medium uppercase text-muted">{label}</p>
			<div className="mt-1 text-sm text-foreground">{children}</div>
		</div>
	);
}

function OrderStatCards({ orders }: { orders: OrderMock[] }) {
	const totalOrders = orders.length;
	const pendingOrders = orders.filter((order) => order.status === "pending");
	const processingOrders = orders.filter(
		(order) => order.status === "processing",
	);
	const completedOrders = orders.filter(
		(order) => order.status === "completed",
	);
	const cancelledOrders = orders.filter(
		(order) => order.status === "cancelled",
	);
	const archivedOrders = orders.filter((order) => order.archivedAt !== null);
	const noteOrders = orders.filter((order) => order.notes !== null);
	const completedRevenue = completedOrders.reduce(
		(total, order) => total + order.totalAmount,
		0,
	);
	const averageOrderValue =
		totalOrders === 0
			? 0
			: orders.reduce((total, order) => total + order.totalAmount, 0) /
				totalOrders;

	const cards = [
		{
			label: "Total Orders",
			value: totalOrders.toLocaleString(),
			Icon: ShoppingBag,
			colorClass: "text-accent",
			bgClass: "bg-accent/10",
		},
		{
			label: "Pending",
			value: pendingOrders.length.toLocaleString(),
			Icon: CalendarClock,
			colorClass: "text-warning",
			bgClass: "bg-warning/10",
		},
		{
			label: "Processing",
			value: processingOrders.length.toLocaleString(),
			Icon: ReceiptText,
			colorClass: "text-accent",
			bgClass: "bg-accent/10",
		},
		{
			label: "Completed",
			value: completedOrders.length.toLocaleString(),
			Icon: CheckCircle2,
			colorClass: "text-success",
			bgClass: "bg-success/10",
		},
		{
			label: "Needs Review",
			value: noteOrders.length.toLocaleString(),
			Icon: FileText,
			colorClass: "text-warning",
			bgClass: "bg-warning/10",
		},
		{
			label: "Archived",
			value: archivedOrders.length.toLocaleString(),
			Icon: Archive,
			colorClass: "text-muted",
			bgClass: "bg-default",
		},
		{
			label: "Cancelled",
			value: cancelledOrders.length.toLocaleString(),
			Icon: Ban,
			colorClass: "text-danger",
			bgClass: "bg-danger/10",
		},
		{
			label: "Revenue",
			value: formatCurrency(completedRevenue),
			Icon: Banknote,
			colorClass: "text-success",
			bgClass: "bg-success/10",
		},
		{
			label: "AOV",
			value: formatCurrency(averageOrderValue),
			Icon: ReceiptText,
			colorClass: "text-accent",
			bgClass: "bg-accent/10",
		},
	];

	return (
		<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-9">
			{cards.map((card) => (
				<Card key={card.label}>
					<Card.Content className="flex items-center gap-3 p-3">
						<div className={`rounded-xl p-2.5 ${card.bgClass}`}>
							<card.Icon size={18} className={card.colorClass} />
						</div>
						<div className="min-w-0">
							<p className="truncate text-lg font-bold text-foreground">
								{card.value}
							</p>
							<p className="mt-0.5 truncate text-xs text-muted">{card.label}</p>
						</div>
					</Card.Content>
				</Card>
			))}
		</div>
	);
}

function MockSelect({
	ariaLabel,
	className,
	onSelect,
	options,
	placeholder,
	selectedKey,
}: {
	ariaLabel: string;
	className?: string;
	onSelect?: (key: string) => void;
	options: SelectOption[];
	placeholder: string;
	selectedKey: string;
}) {
	const selectedOption =
		options.find((option) => option.id === selectedKey)?.label ?? placeholder;

	return (
		<Dropdown>
			<Button
				aria-label={ariaLabel}
				className={`justify-between ${className ?? ""}`}
				size="sm"
				variant="secondary"
			>
				<span className="truncate">{selectedOption}</span>
				<ChevronDown size={13} className="shrink-0 text-muted" />
			</Button>
			<Dropdown.Popover className="min-w-40">
				<div className="flex flex-col gap-1 p-1">
					{options.map((option) => (
						<Button
							key={option.id}
							className="justify-start"
							size="sm"
							variant="ghost"
							onPress={() => onSelect?.(option.id)}
						>
							{option.label}
						</Button>
					))}
				</div>
			</Dropdown.Popover>
		</Dropdown>
	);
}

function OrdersFilterSidebar({
	archiveVisibility,
	className = "",
	onArchiveVisibilityChange,
	onPreviewChange,
}: {
	archiveVisibility: ArchiveVisibility;
	className?: string;
	onArchiveVisibilityChange: (visibility: ArchiveVisibility) => void;
	onPreviewChange: (message: string) => void;
}) {
	return (
		<Card
			className={`flex min-h-0 flex-col gap-0 overflow-hidden ${className}`}
		>
			<Card.Header className="sticky top-0 z-10 shrink-0 border-b border-border bg-surface p-4">
				<div className="flex items-center gap-2">
					<div className="flex size-8 items-center justify-center rounded-lg bg-accent/10 text-accent">
						<SlidersHorizontal size={16} />
					</div>
					<Card.Title className="text-base">Filters</Card.Title>
				</div>
			</Card.Header>

			<form
				className="flex min-h-0 flex-1 flex-col"
				onReset={(event) => {
					event.preventDefault();
					onArchiveVisibilityChange("active");
					onPreviewChange("Order filters reset");
				}}
				onSubmit={(event) => {
					event.preventDefault();
					onPreviewChange("Order filter preview applied");
				}}
			>
				<Card.Content className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4">
					<div className="flex flex-col gap-5">
						<FilterGroup title="Archive Visibility">
							<ArchiveVisibilityRadioGroup
								value={archiveVisibility}
								onChange={onArchiveVisibilityChange}
							/>
						</FilterGroup>

						<FilterGroup title="Order Status">
							<CheckboxOptionGroup
								ariaLabel="Order statuses"
								name="orderStatuses"
								options={ORDER_STATUS_OPTIONS}
							/>
						</FilterGroup>

						<FilterGroup title="Flags">
							<div className="flex flex-col gap-3">
								<FilterSwitch label="Has notes" name="hasNotes" />
								<FilterSwitch label="Cancelled" name="isCancelled" />
							</div>
						</FilterGroup>

						<FilterGroup title="Subtotal">
							<RangeNumberFields
								formatOptions={{ currency: "EUR", style: "currency" }}
								maxLabel="Max"
								maxName="maxSubtotal"
								minLabel="Min"
								minName="minSubtotal"
								step={50}
							/>
						</FilterGroup>

						<FilterGroup title="Shipping Fee">
							<RangeNumberFields
								formatOptions={{ currency: "EUR", style: "currency" }}
								maxLabel="Max"
								maxName="maxShippingFee"
								minLabel="Min"
								minName="minShippingFee"
								step={5}
							/>
						</FilterGroup>

						<FilterGroup title="Tax Amount">
							<RangeNumberFields
								formatOptions={{ currency: "EUR", style: "currency" }}
								maxLabel="Max"
								maxName="maxTaxAmount"
								minLabel="Min"
								minName="minTaxAmount"
								step={10}
							/>
						</FilterGroup>

						<FilterGroup title="Total Amount">
							<RangeNumberFields
								formatOptions={{ currency: "EUR", style: "currency" }}
								maxLabel="Max"
								maxName="maxTotalAmount"
								minLabel="Min"
								minName="minTotalAmount"
								step={50}
							/>
						</FilterGroup>

						<FilterGroup title="Placed Date">
							<DateRangeFields maxName="placedBefore" minName="placedAfter" />
						</FilterGroup>

						<FilterGroup title="Created Date">
							<DateRangeFields maxName="createdBefore" minName="createdAfter" />
						</FilterGroup>

						<FilterGroup title="Item Count">
							<RangeNumberFields
								maxLabel="Max"
								maxName="maxItemCount"
								minLabel="Min"
								minName="minItemCount"
								step={1}
							/>
						</FilterGroup>
					</div>
				</Card.Content>

				<Card.Footer className="sticky bottom-0 z-10 flex shrink-0 gap-2 border-t border-border bg-surface p-4">
					<Button fullWidth type="submit" variant="primary">
						<SlidersHorizontal size={15} />
						Apply
					</Button>
					<Button fullWidth type="reset" variant="ghost">
						<RotateCcw size={15} />
						Reset
					</Button>
				</Card.Footer>
			</form>
		</Card>
	);
}

function FilterGroup({
	children,
	title,
}: {
	children: ReactNode;
	title: string;
}) {
	return (
		<section className="flex flex-col gap-3 border-t border-border pt-4 first:border-t-0 first:pt-0">
			<h3 className="text-xs font-semibold uppercase text-muted">{title}</h3>
			{children}
		</section>
	);
}

function ArchiveVisibilityRadioGroup({
	onChange,
	value,
}: {
	onChange: (visibility: ArchiveVisibility) => void;
	value: ArchiveVisibility;
}) {
	return (
		<div className="grid grid-cols-3 gap-1 rounded-lg bg-secondary p-1">
			{ARCHIVE_VISIBILITY_OPTIONS.map((option) => (
				<label
					key={option.id}
					className="relative flex cursor-pointer items-center justify-center rounded-md px-2 py-1.5 text-xs font-medium text-muted has-[:checked]:bg-surface has-[:checked]:text-foreground has-[:checked]:shadow-sm"
				>
					<input
						checked={value === option.id}
						className="sr-only"
						name="archiveVisibility"
						type="radio"
						value={option.id}
						onChange={() => onChange(option.id as ArchiveVisibility)}
					/>
					{option.label}
				</label>
			))}
		</div>
	);
}

function CheckboxOptionGroup({
	ariaLabel,
	name,
	options,
}: {
	ariaLabel: string;
	name: string;
	options: SelectOption[];
}) {
	return (
		<CheckboxGroup aria-label={ariaLabel} className="gap-2" variant="secondary">
			{options.map((option) => (
				<Checkbox key={option.id} name={name} value={option.id}>
					<Checkbox.Control>
						<Checkbox.Indicator />
					</Checkbox.Control>
					<Checkbox.Content>
						<Label className="text-sm">{option.label}</Label>
					</Checkbox.Content>
				</Checkbox>
			))}
		</CheckboxGroup>
	);
}

function FilterSwitch({ label, name }: { label: string; name: string }) {
	return (
		<Switch name={name} size="sm" value="true">
			<Switch.Control>
				<Switch.Thumb />
			</Switch.Control>
			<Switch.Content>
				<Label className="text-sm">{label}</Label>
			</Switch.Content>
		</Switch>
	);
}

function RangeNumberFields({
	formatOptions,
	maxLabel,
	maxName,
	minLabel,
	minName,
	step,
}: {
	formatOptions?: Intl.NumberFormatOptions;
	maxLabel: string;
	maxName: string;
	minLabel: string;
	minName: string;
	step: number;
}) {
	return (
		<div className="grid grid-cols-2 gap-2">
			<NumberField
				formatOptions={formatOptions}
				minValue={0}
				name={minName}
				step={step}
				variant="secondary"
			>
				<Label className="text-xs text-muted">{minLabel}</Label>
				<NumberField.Group>
					<NumberField.Input className="w-full min-w-0" />
				</NumberField.Group>
			</NumberField>
			<NumberField
				formatOptions={formatOptions}
				minValue={0}
				name={maxName}
				step={step}
				variant="secondary"
			>
				<Label className="text-xs text-muted">{maxLabel}</Label>
				<NumberField.Group>
					<NumberField.Input className="w-full min-w-0" />
				</NumberField.Group>
			</NumberField>
		</div>
	);
}

function DateRangeFields({
	maxName,
	minName,
}: {
	maxName: string;
	minName: string;
}) {
	return (
		<div className="grid grid-cols-2 gap-2">
			<TextField className="flex flex-col gap-1.5" name={minName}>
				<Label className="text-xs text-muted">After</Label>
				<InputGroup variant="secondary">
					<InputGroup.Input type="date" />
				</InputGroup>
			</TextField>
			<TextField className="flex flex-col gap-1.5" name={maxName}>
				<Label className="text-xs text-muted">Before</Label>
				<InputGroup variant="secondary">
					<InputGroup.Input type="date" />
				</InputGroup>
			</TextField>
		</div>
	);
}

function OrdersToolbar({
	demoState,
	onDemoStateChange,
	onPreviewChange,
}: {
	demoState: DemoState;
	onDemoStateChange: (state: DemoState) => void;
	onPreviewChange: (message: string) => void;
}) {
	const [searchType, setSearchType] = useState("orderNumber");
	const [sort, setSort] = useState("placed-desc");

	return (
		<div className="shrink-0 rounded-2xl border border-border bg-surface p-2 shadow-sm">
			<div className="flex flex-col gap-2 xl:flex-row xl:items-center">
				<div className="flex min-w-0 flex-1 flex-col gap-2 md:flex-row">
					<form
						className="min-w-0 flex-1"
						onSubmit={(event) => {
							event.preventDefault();
							onPreviewChange("Order search preview submitted");
						}}
					>
						<TextField className="min-w-0" name="search">
							<InputGroup fullWidth variant="primary">
								<InputGroup.Prefix>
									<Search size={14} className="text-muted" />
								</InputGroup.Prefix>
								<InputGroup.Input
									aria-label="Search orders"
									placeholder="Search orders"
								/>
							</InputGroup>
						</TextField>
					</form>

					<MockSelect
						ariaLabel="Search type"
						className="w-full md:w-36"
						options={SEARCH_TYPE_OPTIONS}
						placeholder="Search by"
						selectedKey={searchType}
						onSelect={(key) => {
							setSearchType(key);
							onPreviewChange("Order search type preview changed");
						}}
					/>

					<MockSelect
						ariaLabel="Sort orders"
						className="w-full md:w-44"
						options={SORT_OPTIONS}
						placeholder="Sort"
						selectedKey={sort}
						onSelect={(key) => {
							setSort(key);
							onPreviewChange("Order sort preview changed");
						}}
					/>
				</div>

				<div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
					<MockSelect
						ariaLabel="Demo state"
						className="w-full sm:w-28"
						options={DEMO_STATE_OPTIONS}
						placeholder="State"
						selectedKey={demoState}
						onSelect={(key) => onDemoStateChange(key as DemoState)}
					/>

					<Tabs.ListContainer className="w-full min-w-0 sm:w-auto">
						<Tabs.List
							aria-label="Order views"
							className="flex w-full min-w-0 flex-wrap gap-1 *:size-8 *:min-w-8 *:flex-none *:justify-center *:px-0 sm:w-auto"
						>
							<Tabs.Tab id="table" aria-label="Table view">
								<TableProperties size={14} className="shrink-0" />
								<Tabs.Indicator />
							</Tabs.Tab>
							<Tabs.Tab id="list" aria-label="List view">
								<LayoutList size={14} className="shrink-0" />
								<Tabs.Indicator />
							</Tabs.Tab>
							<Tabs.Tab id="cards" aria-label="Cards view">
								<Grid3X3 size={14} className="shrink-0" />
								<Tabs.Indicator />
							</Tabs.Tab>
						</Tabs.List>
					</Tabs.ListContainer>
				</div>
			</div>
		</div>
	);
}

function OrderActions({
	onArchive,
	onChangeStatus,
	onCopyCustomerEmail,
	onCopyOrderNumber,
	onPrint,
	order,
}: {
	onArchive: (order: OrderMock) => void;
	onChangeStatus: (order: OrderMock) => void;
	onCopyCustomerEmail: (order: OrderMock) => void;
	onCopyOrderNumber: (order: OrderMock) => void;
	onPrint: (order: OrderMock) => void;
	order: OrderMock;
}) {
	const canChangeStatus = getAllowedNextStatuses(order.status).length > 0;

	return (
		<Dropdown>
			<Button aria-label="Order actions" isIconOnly size="sm" variant="ghost">
				<MoreHorizontal size={16} />
			</Button>
			<Dropdown.Popover className="min-w-48">
				<div className="flex flex-col gap-1 p-1">
					<Button
						className="justify-start"
						isDisabled={!canChangeStatus}
						size="sm"
						variant="ghost"
						onPress={() => onChangeStatus(order)}
					>
						<ReceiptText size={14} />
						Change status
					</Button>
					<Button
						className="justify-start"
						size="sm"
						variant="ghost"
						onPress={() => onArchive(order)}
					>
						{order.archivedAt ? <RotateCcw size={14} /> : <Archive size={14} />}
						{order.archivedAt ? "Restore order" : "Archive order"}
					</Button>
					<Button
						className="justify-start"
						size="sm"
						variant="ghost"
						onPress={() => onCopyOrderNumber(order)}
					>
						<Copy size={14} />
						Copy order number
					</Button>
					<Button
						className="justify-start"
						size="sm"
						variant="ghost"
						onPress={() => onCopyCustomerEmail(order)}
					>
						<UserRound size={14} />
						Copy customer email
					</Button>
					<Button
						className="justify-start"
						size="sm"
						variant="ghost"
						onPress={() => onPrint(order)}
					>
						<Printer size={14} />
						Print summary
					</Button>
				</div>
			</Dropdown.Popover>
		</Dropdown>
	);
}

function OrderTableView({
	onArchive,
	onChangeStatus,
	onCopyCustomerEmail,
	onCopyOrderNumber,
	onPrint,
	orders,
}: {
	onArchive: (order: OrderMock) => void;
	onChangeStatus: (order: OrderMock) => void;
	onCopyCustomerEmail: (order: OrderMock) => void;
	onCopyOrderNumber: (order: OrderMock) => void;
	onPrint: (order: OrderMock) => void;
	orders: OrderMock[];
}) {
	return (
		<Table>
			<Table.ScrollContainer>
				<Table.Content aria-label="Orders" className="min-w-[1040px]">
					<Table.Header>
						<Table.Column isRowHeader className="w-[260px]">
							Order
						</Table.Column>
						<Table.Column className="w-[260px]">Customer</Table.Column>
						<Table.Column>Items</Table.Column>
						<Table.Column>Total</Table.Column>
						<Table.Column>Status</Table.Column>
						<Table.Column>Placed</Table.Column>
						<Table.Column>Archive</Table.Column>
						<Table.Column className="w-12">Actions</Table.Column>
					</Table.Header>
					<Table.Body>
						{orders.map((order) => (
							<Table.Row key={order.id}>
								<Table.Cell>
									<OrderIdentity order={order} />
								</Table.Cell>
								<Table.Cell>
									<CustomerCell order={order} />
								</Table.Cell>
								<Table.Cell>
									<span className="text-sm font-medium text-foreground">
										{order.itemCount}
									</span>
								</Table.Cell>
								<Table.Cell>
									<span className="text-sm font-medium text-foreground">
										{formatCurrency(order.totalAmount)}
									</span>
								</Table.Cell>
								<Table.Cell>
									<OrderStatusChip status={order.status} />
								</Table.Cell>
								<Table.Cell>
									<span className="text-sm text-muted">
										{formatDate(order.placedAt)}
									</span>
								</Table.Cell>
								<Table.Cell>
									<ArchiveChip archivedAt={order.archivedAt} />
								</Table.Cell>
								<Table.Cell>
									<OrderActions
										onArchive={onArchive}
										onChangeStatus={onChangeStatus}
										onCopyCustomerEmail={onCopyCustomerEmail}
										onCopyOrderNumber={onCopyOrderNumber}
										onPrint={onPrint}
										order={order}
									/>
								</Table.Cell>
							</Table.Row>
						))}
					</Table.Body>
				</Table.Content>
			</Table.ScrollContainer>
		</Table>
	);
}

function OrderListView({
	onArchive,
	onChangeStatus,
	onCopyCustomerEmail,
	onCopyOrderNumber,
	onPrint,
	orders,
}: {
	onArchive: (order: OrderMock) => void;
	onChangeStatus: (order: OrderMock) => void;
	onCopyCustomerEmail: (order: OrderMock) => void;
	onCopyOrderNumber: (order: OrderMock) => void;
	onPrint: (order: OrderMock) => void;
	orders: OrderMock[];
}) {
	return (
		<div className="flex flex-col gap-3">
			{orders.map((order) => (
				<Card key={order.id}>
					<Card.Content className="p-4">
						<div className="flex flex-col gap-4 xl:flex-row xl:items-center">
							<div className="flex min-w-0 flex-1 items-start justify-between gap-3">
								<div className="min-w-0">
									<OrderIdentity order={order} />
									<div className="mt-2 max-w-md">
										<CustomerCell order={order} />
									</div>
								</div>
								<div className="xl:hidden">
									<OrderActions
										onArchive={onArchive}
										onChangeStatus={onChangeStatus}
										onCopyCustomerEmail={onCopyCustomerEmail}
										onCopyOrderNumber={onCopyOrderNumber}
										onPrint={onPrint}
										order={order}
									/>
								</div>
							</div>

							<div className="grid min-w-0 grid-cols-2 gap-4 sm:grid-cols-4 xl:w-[560px]">
								<OrderMetric label="Items">
									<span>{order.itemCount}</span>
								</OrderMetric>
								<OrderMetric label="Total">
									<span className="font-medium">
										{formatCurrency(order.totalAmount)}
									</span>
								</OrderMetric>
								<OrderMetric label="Placed">
									<span>{formatDate(order.placedAt)}</span>
								</OrderMetric>
								<OrderMetric label="Updated">
									<span>{formatDate(order.updatedAt)}</span>
								</OrderMetric>
							</div>

							<div className="flex min-w-0 items-start justify-between gap-3 xl:w-[300px]">
								<div className="flex flex-wrap gap-1">
									<OrderStatusChip status={order.status} />
									<ArchiveChip archivedAt={order.archivedAt} />
									{order.notes ? (
										<Chip color="warning" size="sm" variant="soft">
											Notes
										</Chip>
									) : null}
								</div>
								<div className="hidden xl:block">
									<OrderActions
										onArchive={onArchive}
										onChangeStatus={onChangeStatus}
										onCopyCustomerEmail={onCopyCustomerEmail}
										onCopyOrderNumber={onCopyOrderNumber}
										onPrint={onPrint}
										order={order}
									/>
								</div>
							</div>
						</div>
					</Card.Content>
				</Card>
			))}
		</div>
	);
}

function OrderCardGrid({
	onArchive,
	onChangeStatus,
	onCopyCustomerEmail,
	onCopyOrderNumber,
	onPrint,
	orders,
}: {
	onArchive: (order: OrderMock) => void;
	onChangeStatus: (order: OrderMock) => void;
	onCopyCustomerEmail: (order: OrderMock) => void;
	onCopyOrderNumber: (order: OrderMock) => void;
	onPrint: (order: OrderMock) => void;
	orders: OrderMock[];
}) {
	return (
		<div className="grid grid-cols-1 gap-4 xl:grid-cols-2 2xl:grid-cols-3">
			{orders.map((order) => (
				<Card key={order.id} className="min-h-[286px]">
					<Card.Header className="flex-row items-start justify-between gap-3 p-4">
						<div className="min-w-0">
							<OrderIdentity order={order} />
							<p className="mt-2 truncate text-xs text-muted">
								{order.customer.name} · {order.customer.email}
							</p>
						</div>
						<OrderActions
							onArchive={onArchive}
							onChangeStatus={onChangeStatus}
							onCopyCustomerEmail={onCopyCustomerEmail}
							onCopyOrderNumber={onCopyOrderNumber}
							onPrint={onPrint}
							order={order}
						/>
					</Card.Header>

					<Card.Content className="flex flex-1 flex-col gap-4 px-4 pb-4 pt-0">
						<div className="flex flex-wrap gap-1">
							<OrderStatusChip status={order.status} />
							<ArchiveChip archivedAt={order.archivedAt} />
							{order.notes ? (
								<Chip color="warning" size="sm" variant="soft">
									Notes
								</Chip>
							) : null}
						</div>

						<div className="grid grid-cols-2 gap-4">
							<OrderMetric label="Items">
								<span>{order.itemCount}</span>
							</OrderMetric>
							<OrderMetric label="Total">
								<span className="font-medium">
									{formatCurrency(order.totalAmount)}
								</span>
							</OrderMetric>
							<OrderMetric label="Subtotal">
								<span>{formatCurrency(order.subtotal)}</span>
							</OrderMetric>
							<OrderMetric label="Tax">
								<span>{formatCurrency(order.taxAmount)}</span>
							</OrderMetric>
						</div>

						{order.notes ? (
							<div className="rounded-lg bg-secondary px-3 py-2">
								<p className="line-clamp-2 text-xs text-muted">{order.notes}</p>
							</div>
						) : null}
					</Card.Content>

					<Card.Footer className="mt-auto justify-between border-t border-border px-4 py-3">
						<span className="truncate text-xs text-muted">
							Placed {formatDate(order.placedAt)}
						</span>
						<span className="text-xs text-muted">
							Updated {formatDate(order.updatedAt)}
						</span>
					</Card.Footer>
				</Card>
			))}
		</div>
	);
}

function OrdersPagination({
	limit,
	onPageChange,
	onPageSizeChange,
	page,
	total,
}: {
	limit: number;
	onPageChange: (page: number) => void;
	onPageSizeChange: (limit: number) => void;
	page: number;
	total: number;
}) {
	const totalPages = Math.max(Math.ceil(total / limit), 1);
	const safePage = Math.min(page, totalPages);
	const startItem = total === 0 ? 0 : (safePage - 1) * limit + 1;
	const endItem = Math.min(safePage * limit, total);

	return (
		<div className="flex shrink-0 flex-col gap-3 rounded-2xl border border-border bg-surface px-3 py-3 shadow-sm lg:flex-row lg:items-center lg:justify-between">
			<div className="flex flex-col gap-2 sm:flex-row sm:items-center">
				<p className="text-sm text-muted">
					Showing{" "}
					<span className="font-medium text-foreground">
						{startItem}-{endItem}
					</span>{" "}
					of <span className="font-medium text-foreground">{total}</span> orders
				</p>
				<MockSelect
					ariaLabel="Rows per page"
					className="w-full sm:w-32"
					options={PAGE_SIZE_OPTIONS}
					placeholder="Rows"
					selectedKey={String(limit)}
					onSelect={(value) => onPageSizeChange(Number(value))}
				/>
			</div>

			<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between lg:justify-end">
				<span className="text-sm text-muted">
					Page {safePage} of {totalPages}
				</span>
				<Pagination size="sm">
					<Pagination.Content className="flex-wrap justify-start sm:justify-end">
						<Pagination.Item>
							<Pagination.Previous
								isDisabled={safePage <= 1}
								onPress={() => onPageChange(safePage - 1)}
							>
								<Pagination.PreviousIcon />
								<span className="hidden sm:inline">Previous</span>
							</Pagination.Previous>
						</Pagination.Item>
						<Pagination.Item>
							<Pagination.Link isActive>{safePage}</Pagination.Link>
						</Pagination.Item>
						<Pagination.Item>
							<Pagination.Next
								isDisabled={safePage >= totalPages}
								onPress={() => onPageChange(safePage + 1)}
							>
								<span className="hidden sm:inline">Next</span>
								<Pagination.NextIcon />
							</Pagination.Next>
						</Pagination.Item>
					</Pagination.Content>
				</Pagination>
			</div>
		</div>
	);
}

function OrdersResults({
	demoState,
	onArchive,
	onChangeStatus,
	onCopyCustomerEmail,
	onCopyOrderNumber,
	onDemoStateChange,
	onPreviewChange,
	onPrint,
	orders,
}: {
	demoState: DemoState;
	onArchive: (order: OrderMock) => void;
	onChangeStatus: (order: OrderMock) => void;
	onCopyCustomerEmail: (order: OrderMock) => void;
	onCopyOrderNumber: (order: OrderMock) => void;
	onDemoStateChange: (state: DemoState) => void;
	onPreviewChange: (message: string) => void;
	onPrint: (order: OrderMock) => void;
	orders: OrderMock[];
}) {
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(10);
	const totalPages = Math.max(Math.ceil(orders.length / limit), 1);
	const safePage = Math.min(page, totalPages);
	const paginatedOrders = orders.slice(
		(safePage - 1) * limit,
		safePage * limit,
	);

	return (
		<Tabs
			defaultSelectedKey="table"
			className="flex min-w-0 flex-col gap-3 lg:h-[calc(100vh-8rem)] lg:min-h-[520px] lg:min-h-0"
		>
			<OrdersToolbar
				demoState={demoState}
				onDemoStateChange={onDemoStateChange}
				onPreviewChange={onPreviewChange}
			/>

			{demoState === "error" ? (
				<div className="min-h-0 min-w-0 flex-1 overflow-auto">
					<AdminSectionError
						actionLabel="Show data"
						message="This is a local UI preview of the error state."
						title="Orders failed to load"
						onAction={() => onDemoStateChange("data")}
					/>
				</div>
			) : demoState === "empty" || orders.length === 0 ? (
				<div className="min-h-0 min-w-0 flex-1 overflow-auto">
					<AdminEmptyState
						icon={PackageSearch}
						message="No mock orders match the current preview state."
						title="No orders found"
					/>
				</div>
			) : (
				<>
					<Tabs.Panel
						id="table"
						className="min-h-0 min-w-0 flex-1 overflow-auto"
					>
						<OrderTableView
							onArchive={onArchive}
							onChangeStatus={onChangeStatus}
							onCopyCustomerEmail={onCopyCustomerEmail}
							onCopyOrderNumber={onCopyOrderNumber}
							onPrint={onPrint}
							orders={paginatedOrders}
						/>
					</Tabs.Panel>
					<Tabs.Panel
						id="list"
						className="min-h-0 min-w-0 flex-1 overflow-auto"
					>
						<OrderListView
							onArchive={onArchive}
							onChangeStatus={onChangeStatus}
							onCopyCustomerEmail={onCopyCustomerEmail}
							onCopyOrderNumber={onCopyOrderNumber}
							onPrint={onPrint}
							orders={paginatedOrders}
						/>
					</Tabs.Panel>
					<Tabs.Panel
						id="cards"
						className="min-h-0 min-w-0 flex-1 overflow-auto"
					>
						<OrderCardGrid
							onArchive={onArchive}
							onChangeStatus={onChangeStatus}
							onCopyCustomerEmail={onCopyCustomerEmail}
							onCopyOrderNumber={onCopyOrderNumber}
							onPrint={onPrint}
							orders={paginatedOrders}
						/>
					</Tabs.Panel>
				</>
			)}

			<OrdersPagination
				limit={limit}
				page={safePage}
				total={orders.length}
				onPageChange={(nextPage) => {
					setPage(nextPage);
					onPreviewChange("Order page preview changed");
				}}
				onPageSizeChange={(nextLimit) => {
					setLimit(nextLimit);
					setPage(1);
					onPreviewChange("Order page size preview changed");
				}}
			/>
		</Tabs>
	);
}

function OrderStatusModal({
	isOpen,
	onClose,
	onConfirm,
	order,
}: {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: (order: OrderMock, status: OrderStatus) => void;
	order: OrderMock | null;
}) {
	const allowedStatuses = order ? getAllowedNextStatuses(order.status) : [];

	return (
		<Modal
			isOpen={isOpen}
			onOpenChange={(open) => {
				if (!open) onClose();
			}}
		>
			<Modal.Backdrop>
				<Modal.Container>
					<Modal.Dialog className="sm:max-w-[460px]">
						<Modal.CloseTrigger />
						<Modal.Header>
							<Modal.Icon className="bg-accent/10 text-accent">
								<ReceiptText size={20} />
							</Modal.Icon>
							<Modal.Heading>Change Order Status</Modal.Heading>
						</Modal.Header>

						<Modal.Body className="flex flex-col gap-4">
							{order ? (
								<>
									<div className="rounded-lg bg-secondary p-3">
										<p className="text-sm font-medium text-foreground">
											{order.orderNumber}
										</p>
										<div className="mt-2 flex flex-wrap items-center gap-2">
											<span className="text-xs text-muted">Current status</span>
											<OrderStatusChip status={order.status} />
										</div>
									</div>

									{allowedStatuses.length > 0 ? (
										<div className="flex flex-col gap-2">
											{allowedStatuses.map((status) => (
												<Button
													key={status}
													className="justify-between"
													variant="secondary"
													onPress={() => onConfirm(order, status)}
												>
													<span>Mark as {STATUS_META[status].label}</span>
													<OrderStatusChip status={status} />
												</Button>
											))}
										</div>
									) : (
										<div className="flex items-start gap-3 rounded-lg bg-secondary p-3">
											<AlertCircle
												size={18}
												className="mt-0.5 shrink-0 text-muted"
											/>
											<p className="text-sm text-muted">
												This order has no valid next status in the current order
												workflow.
											</p>
										</div>
									)}
								</>
							) : null}
						</Modal.Body>

						<Modal.Footer className="flex justify-end">
							<Button variant="ghost" onPress={onClose}>
								Close
							</Button>
						</Modal.Footer>
					</Modal.Dialog>
				</Modal.Container>
			</Modal.Backdrop>
		</Modal>
	);
}

function ArchiveOrderModal({
	isOpen,
	onClose,
	onConfirm,
	order,
}: {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: (order: OrderMock) => void;
	order: OrderMock | null;
}) {
	const isArchived = Boolean(order?.archivedAt);

	return (
		<Modal
			isOpen={isOpen}
			onOpenChange={(open) => {
				if (!open) onClose();
			}}
		>
			<Modal.Backdrop>
				<Modal.Container>
					<Modal.Dialog className="sm:max-w-[420px]">
						<Modal.CloseTrigger />
						<Modal.Header>
							<Modal.Icon className="bg-accent/10 text-accent">
								{isArchived ? <RotateCcw size={20} /> : <Archive size={20} />}
							</Modal.Icon>
							<Modal.Heading>
								{isArchived ? "Restore Order" : "Archive Order"}
							</Modal.Heading>
						</Modal.Header>

						<Modal.Body>
							<p className="text-sm text-muted">
								{isArchived
									? `Restore ${order?.orderNumber ?? "this order"} to the active order list.`
									: `Archive ${order?.orderNumber ?? "this order"} from the active order list.`}
							</p>
						</Modal.Body>

						<Modal.Footer className="flex justify-end gap-2">
							<Button variant="ghost" onPress={onClose}>
								Cancel
							</Button>
							<Button
								variant={isArchived ? "primary" : "secondary"}
								onPress={() => {
									if (order) onConfirm(order);
								}}
							>
								{isArchived ? "Restore" : "Archive"}
							</Button>
						</Modal.Footer>
					</Modal.Dialog>
				</Modal.Container>
			</Modal.Backdrop>
		</Modal>
	);
}

export function OrdersPage() {
	const [orders, setOrders] = useState<OrderMock[]>(MOCK_ORDERS);
	const [archiveVisibility, setArchiveVisibility] =
		useState<ArchiveVisibility>("active");
	const [demoState, setDemoState] = useState<DemoState>("data");
	const [previewMessage, setPreviewMessage] = useState(
		"UI preview uses local mock orders",
	);
	const [statusOrder, setStatusOrder] = useState<OrderMock | null>(null);
	const [archiveOrder, setArchiveOrder] = useState<OrderMock | null>(null);
	const visibleOrders = getVisibleOrders(orders, archiveVisibility);

	async function copyToClipboard(value: string, label: string) {
		try {
			if (!navigator.clipboard) {
				throw new Error("Clipboard API unavailable");
			}

			await navigator.clipboard.writeText(value);
			setPreviewMessage(`${label} copied to clipboard`);
		} catch {
			setPreviewMessage(`${label} could not be copied`);
		}
	}

	function updateOrderStatus(order: OrderMock, status: OrderStatus) {
		setOrders((currentOrders) =>
			currentOrders.map((currentOrder) =>
				currentOrder.id === order.id
					? {
							...currentOrder,
							status,
							updatedAt: new Date().toISOString(),
						}
					: currentOrder,
			),
		);
		setPreviewMessage(
			`${order.orderNumber} marked as ${STATUS_META[status].label}`,
		);
		setStatusOrder(null);
	}

	function toggleArchive(order: OrderMock) {
		const nextArchivedAt = order.archivedAt ? null : new Date().toISOString();

		setOrders((currentOrders) =>
			currentOrders.map((currentOrder) =>
				currentOrder.id === order.id
					? {
							...currentOrder,
							archivedAt: nextArchivedAt,
							updatedAt: new Date().toISOString(),
						}
					: currentOrder,
			),
		);
		setPreviewMessage(
			nextArchivedAt
				? `${order.orderNumber} archived locally`
				: `${order.orderNumber} restored locally`,
		);
		setArchiveOrder(null);
	}

	function printOrderSummary(order: OrderMock) {
		setPreviewMessage(`Print summary requested for ${order.orderNumber}`);

		if (typeof window !== "undefined") {
			window.print();
		}
	}

	return (
		<div className="flex flex-col gap-6">
			<OrderStatCards orders={orders} />

			<Card className="border-accent/20 bg-accent/5 px-4 py-3">
				<Card.Content className="flex flex-col gap-2 p-0 sm:flex-row sm:items-center sm:justify-between">
					<div className="flex min-w-0 items-start gap-3">
						<ShoppingBag size={18} className="mt-0.5 shrink-0 text-accent" />
						<div className="min-w-0">
							<p className="text-sm font-medium text-foreground">
								{previewMessage}
							</p>
							<p className="mt-1 text-xs text-muted">
								No order APIs are connected on this page.
							</p>
						</div>
					</div>
					<Button
						className="shrink-0"
						size="sm"
						variant="secondary"
						onPress={() =>
							setPreviewMessage("UI preview uses local mock orders")
						}
					>
						Reset message
					</Button>
				</Card.Content>
			</Card>

			<div className="lg:hidden">
				<Disclosure>
					<Disclosure.Heading>
						<Button fullWidth slot="trigger" variant="secondary">
							<SlidersHorizontal size={16} />
							Filters
							<Disclosure.Indicator />
						</Button>
					</Disclosure.Heading>
					<Disclosure.Content>
						<Disclosure.Body className="pt-3">
							<OrdersFilterSidebar
								archiveVisibility={archiveVisibility}
								onArchiveVisibilityChange={setArchiveVisibility}
								onPreviewChange={setPreviewMessage}
							/>
						</Disclosure.Body>
					</Disclosure.Content>
				</Disclosure>
			</div>

			<div className="grid min-w-0 items-start gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
				<aside className="hidden lg:h-[calc(100vh-8rem)] lg:min-h-[520px] lg:block">
					<OrdersFilterSidebar
						archiveVisibility={archiveVisibility}
						className="sticky top-0 h-full"
						onArchiveVisibilityChange={setArchiveVisibility}
						onPreviewChange={setPreviewMessage}
					/>
				</aside>
				<OrdersResults
					demoState={demoState}
					onArchive={setArchiveOrder}
					onChangeStatus={setStatusOrder}
					onCopyCustomerEmail={(order) => {
						void copyToClipboard(order.customer.email, "Customer email");
					}}
					onCopyOrderNumber={(order) => {
						void copyToClipboard(order.orderNumber, "Order number");
					}}
					onDemoStateChange={setDemoState}
					onPreviewChange={setPreviewMessage}
					onPrint={printOrderSummary}
					orders={visibleOrders}
				/>
			</div>

			<OrderStatusModal
				isOpen={statusOrder !== null}
				order={statusOrder}
				onClose={() => setStatusOrder(null)}
				onConfirm={updateOrderStatus}
			/>

			<ArchiveOrderModal
				isOpen={archiveOrder !== null}
				order={archiveOrder}
				onClose={() => setArchiveOrder(null)}
				onConfirm={toggleArchive}
			/>
		</div>
	);
}
