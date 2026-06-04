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
	NumberField,
	Pagination,
	Switch,
	Table,
	Tabs,
	TextField,
} from "@heroui/react";
import {
	CalendarClock,
	CheckCircle2,
	ChevronDown,
	Copy,
	Grid3X3,
	LayoutList,
	MapPin,
	MoreHorizontal,
	PackageCheck,
	PackageSearch,
	PackageX,
	Printer,
	ReceiptText,
	RotateCcw,
	Route,
	Search,
	SlidersHorizontal,
	TableProperties,
	Truck,
	UserRound,
} from "lucide-react";
import { type ReactNode, useState } from "react";
import {
	AdminEmptyState,
	AdminPageHeader,
	AdminSectionError,
} from "#/components/admin/sections/admin-page";

type ShippingStatus =
	| "pending"
	| "packed"
	| "shipped"
	| "in_transit"
	| "delivered";
type ShippingCarrier = "dhl" | "hermes" | "ups" | "fedex";
type ShippingMethod = "standard" | "express" | "same_day";
type DemoState = "data" | "empty" | "error";
type ChipColor = "accent" | "danger" | "default" | "success" | "warning";

type ShippingMock = {
	id: string;
	carrier: ShippingCarrier;
	createdAt: string;
	customer: {
		email: string;
		id: string;
		name: string;
	};
	deliveredAt: string | null;
	destination: {
		city: string;
		country: string;
		postalCode: string;
	};
	method: ShippingMethod;
	orderId: string;
	orderNumber: string;
	shippedAt: string | null;
	status: ShippingStatus;
	trackingNumber: string | null;
	updatedAt: string;
};

type SelectOption = {
	id: string;
	label: string;
};

const SHIPPING_STATUS_OPTIONS = [
	{ id: "pending", label: "Pending" },
	{ id: "packed", label: "Packed" },
	{ id: "shipped", label: "Shipped" },
	{ id: "in_transit", label: "In Transit" },
	{ id: "delivered", label: "Delivered" },
] satisfies SelectOption[];

const SHIPPING_CARRIER_OPTIONS = [
	{ id: "dhl", label: "DHL" },
	{ id: "hermes", label: "Hermes" },
	{ id: "ups", label: "UPS" },
	{ id: "fedex", label: "FedEx" },
] satisfies SelectOption[];

const SHIPPING_METHOD_OPTIONS = [
	{ id: "standard", label: "Standard" },
	{ id: "express", label: "Express" },
	{ id: "same_day", label: "Same Day" },
] satisfies SelectOption[];

const SEARCH_TYPE_OPTIONS = [
	{ id: "orderNumber", label: "Order #" },
	{ id: "trackingNumber", label: "Tracking" },
	{ id: "customerName", label: "Customer" },
	{ id: "customerEmail", label: "Email" },
	{ id: "city", label: "City" },
] satisfies SelectOption[];

const SORT_OPTIONS = [
	{ id: "created-desc", label: "Newest first" },
	{ id: "created-asc", label: "Oldest first" },
	{ id: "status-asc", label: "Status A-Z" },
	{ id: "carrier-asc", label: "Carrier A-Z" },
	{ id: "shipped-desc", label: "Recently shipped" },
	{ id: "delivered-desc", label: "Recently delivered" },
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
	ShippingStatus,
	{
		color: ChipColor;
		label: string;
	}
> = {
	pending: { color: "warning", label: "Pending" },
	packed: { color: "accent", label: "Packed" },
	shipped: { color: "accent", label: "Shipped" },
	in_transit: { color: "accent", label: "In Transit" },
	delivered: { color: "success", label: "Delivered" },
};

const CARRIER_LABELS: Record<ShippingCarrier, string> = {
	dhl: "DHL",
	hermes: "Hermes",
	ups: "UPS",
	fedex: "FedEx",
};

const METHOD_LABELS: Record<ShippingMethod, string> = {
	standard: "Standard",
	express: "Express",
	same_day: "Same Day",
};

const MOCK_SHIPMENTS: ShippingMock[] = [
	{
		id: "ship_01jz_1001_dhl",
		orderId: "ord_01jz_berlin_1001",
		orderNumber: "TS-2026-1001",
		carrier: "dhl",
		method: "standard",
		trackingNumber: null,
		status: "pending",
		shippedAt: null,
		deliveredAt: null,
		createdAt: "2026-06-02T09:12:00.000Z",
		updatedAt: "2026-06-02T09:18:00.000Z",
		customer: {
			id: "usr_lena_weber",
			name: "Lena Weber",
			email: "lena.weber@example.de",
		},
		destination: {
			city: "Berlin",
			postalCode: "10115",
			country: "Germany",
		},
	},
	{
		id: "ship_01jz_1002_ups",
		orderId: "ord_01jz_hamburg_1002",
		orderNumber: "TS-2026-1002",
		carrier: "ups",
		method: "express",
		trackingNumber: "1Z999AA10123456784",
		status: "packed",
		shippedAt: null,
		deliveredAt: null,
		createdAt: "2026-06-01T15:42:00.000Z",
		updatedAt: "2026-06-02T08:30:00.000Z",
		customer: {
			id: "usr_matthias_klein",
			name: "Matthias Klein",
			email: "matthias.klein@example.de",
		},
		destination: {
			city: "Hamburg",
			postalCode: "20095",
			country: "Germany",
		},
	},
	{
		id: "ship_01jz_1003_hermes",
		orderId: "ord_01jz_munich_1003",
		orderNumber: "TS-2026-1003",
		carrier: "hermes",
		method: "standard",
		trackingNumber: "H1012345678901234567",
		status: "delivered",
		shippedAt: "2026-05-31T16:20:00.000Z",
		deliveredAt: "2026-06-01T14:12:00.000Z",
		createdAt: "2026-05-31T11:05:00.000Z",
		updatedAt: "2026-06-01T14:12:00.000Z",
		customer: {
			id: "usr_sophia_bauer",
			name: "Sophia Bauer",
			email: "sophia.bauer@example.de",
		},
		destination: {
			city: "Munich",
			postalCode: "80331",
			country: "Germany",
		},
	},
	{
		id: "ship_01jz_1004_dhl",
		orderId: "ord_01jz_cologne_1004",
		orderNumber: "TS-2026-1004",
		carrier: "dhl",
		method: "same_day",
		trackingNumber: "00340434161094000001",
		status: "in_transit",
		shippedAt: "2026-05-31T08:20:00.000Z",
		deliveredAt: null,
		createdAt: "2026-05-30T18:16:00.000Z",
		updatedAt: "2026-06-01T09:45:00.000Z",
		customer: {
			id: "usr_emil_schneider",
			name: "Emil Schneider",
			email: "emil.schneider@example.de",
		},
		destination: {
			city: "Cologne",
			postalCode: "50667",
			country: "Germany",
		},
	},
	{
		id: "ship_01jz_1005_fedex",
		orderId: "ord_01jz_frankfurt_1005",
		orderNumber: "TS-2026-1005",
		carrier: "fedex",
		method: "standard",
		trackingNumber: null,
		status: "pending",
		shippedAt: null,
		deliveredAt: null,
		createdAt: "2026-05-29T13:48:00.000Z",
		updatedAt: "2026-05-29T14:03:00.000Z",
		customer: {
			id: "usr_amina_hoffmann",
			name: "Amina Hoffmann",
			email: "amina.hoffmann@example.de",
		},
		destination: {
			city: "Frankfurt",
			postalCode: "60311",
			country: "Germany",
		},
	},
	{
		id: "ship_01jz_1006_dhl",
		orderId: "ord_01jz_stuttgart_1006",
		orderNumber: "TS-2026-1006",
		carrier: "dhl",
		method: "express",
		trackingNumber: "00340434161094000006",
		status: "delivered",
		shippedAt: "2026-05-27T14:10:00.000Z",
		deliveredAt: "2026-05-28T11:18:00.000Z",
		createdAt: "2026-05-27T10:22:00.000Z",
		updatedAt: "2026-05-28T11:18:00.000Z",
		customer: {
			id: "usr_noah_fischer",
			name: "Noah Fischer",
			email: "noah.fischer@example.de",
		},
		destination: {
			city: "Stuttgart",
			postalCode: "70173",
			country: "Germany",
		},
	},
	{
		id: "ship_01jz_1007_hermes",
		orderId: "ord_01jz_leipzig_1007",
		orderNumber: "TS-2026-1007",
		carrier: "hermes",
		method: "standard",
		trackingNumber: "H1012345678901234007",
		status: "shipped",
		shippedAt: "2026-05-27T12:45:00.000Z",
		deliveredAt: null,
		createdAt: "2026-05-26T16:34:00.000Z",
		updatedAt: "2026-05-27T12:45:00.000Z",
		customer: {
			id: "usr_mila_wagner",
			name: "Mila Wagner",
			email: "mila.wagner@example.de",
		},
		destination: {
			city: "Leipzig",
			postalCode: "04109",
			country: "Germany",
		},
	},
	{
		id: "ship_01jz_1008_ups",
		orderId: "ord_01jz_dusseldorf_1008",
		orderNumber: "TS-2026-1008",
		carrier: "ups",
		method: "express",
		trackingNumber: "1Z999AA10123456788",
		status: "delivered",
		shippedAt: "2026-05-24T18:12:00.000Z",
		deliveredAt: "2026-05-25T13:44:00.000Z",
		createdAt: "2026-05-24T12:12:00.000Z",
		updatedAt: "2026-05-25T13:44:00.000Z",
		customer: {
			id: "usr_jonas_becker",
			name: "Jonas Becker",
			email: "jonas.becker@example.de",
		},
		destination: {
			city: "Dusseldorf",
			postalCode: "40213",
			country: "Germany",
		},
	},
];

function formatDate(value: string | null) {
	if (!value) return "—";

	return new Intl.DateTimeFormat("en-GB", {
		day: "2-digit",
		month: "short",
		year: "numeric",
	}).format(new Date(value));
}

function getCustomerInitials(name: string) {
	return name
		.split(" ")
		.map((part) => part[0])
		.join("")
		.slice(0, 2)
		.toUpperCase();
}

function getAverageDeliveryDays(shipments: ShippingMock[]) {
	const completedShipments = shipments.filter(
		(shipment) => shipment.shippedAt && shipment.deliveredAt,
	);

	if (completedShipments.length === 0) return 0;

	const totalDays = completedShipments.reduce((total, shipment) => {
		const shippedAt = new Date(shipment.shippedAt ?? "").getTime();
		const deliveredAt = new Date(shipment.deliveredAt ?? "").getTime();

		return total + (deliveredAt - shippedAt) / 86_400_000;
	}, 0);

	return totalDays / completedShipments.length;
}

function ShippingStatusChip({ status }: { status: ShippingStatus }) {
	const meta = STATUS_META[status];

	return (
		<Chip color={meta.color} size="sm" variant="soft">
			{meta.label}
		</Chip>
	);
}

function CarrierChip({ carrier }: { carrier: ShippingCarrier }) {
	return (
		<Chip
			color={carrier === "dhl" ? "accent" : "default"}
			size="sm"
			variant="soft"
		>
			{CARRIER_LABELS[carrier]}
		</Chip>
	);
}

function MethodChip({ method }: { method: ShippingMethod }) {
	return (
		<Chip
			color={method === "express" ? "warning" : "default"}
			size="sm"
			variant="soft"
		>
			{METHOD_LABELS[method]}
		</Chip>
	);
}

function ShippingIdentity({ shipment }: { shipment: ShippingMock }) {
	return (
		<div className="flex min-w-0 flex-col">
			<p className="truncate text-sm font-medium text-foreground">
				{shipment.orderNumber}
			</p>
			<p className="mt-0.5 truncate text-xs text-muted">
				{shipment.trackingNumber ?? "No tracking number"}
			</p>
		</div>
	);
}

function CustomerCell({ shipment }: { shipment: ShippingMock }) {
	return (
		<div className="flex min-w-0 items-center gap-3">
			<div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-xs font-semibold text-accent">
				{getCustomerInitials(shipment.customer.name)}
			</div>
			<div className="min-w-0">
				<p className="truncate text-sm font-medium text-foreground">
					{shipment.customer.name}
				</p>
				<p className="mt-0.5 truncate text-xs text-muted">
					{shipment.customer.email}
				</p>
			</div>
		</div>
	);
}

function DestinationCell({ shipment }: { shipment: ShippingMock }) {
	return (
		<div className="min-w-0">
			<p className="truncate text-sm font-medium text-foreground">
				{shipment.destination.city}
			</p>
			<p className="mt-0.5 truncate text-xs text-muted">
				{shipment.destination.postalCode}, {shipment.destination.country}
			</p>
		</div>
	);
}

function ShippingMetric({
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

function ShippingStatCards({ shipments }: { shipments: ShippingMock[] }) {
	const pendingShipments = shipments.filter(
		(shipment) => shipment.status === "pending",
	);
	const packedShipments = shipments.filter(
		(shipment) => shipment.status === "packed",
	);
	const shippedShipments = shipments.filter(
		(shipment) => shipment.status === "shipped",
	);
	const transitShipments = shipments.filter(
		(shipment) => shipment.status === "in_transit",
	);
	const deliveredShipments = shipments.filter(
		(shipment) => shipment.status === "delivered",
	);
	const missingTracking = shipments.filter(
		(shipment) => shipment.trackingNumber === null,
	);
	const averageDeliveryDays = getAverageDeliveryDays(shipments);

	const cards = [
		{
			label: "Total Shipments",
			value: shipments.length.toLocaleString(),
			Icon: Truck,
			colorClass: "text-accent",
			bgClass: "bg-accent/10",
		},
		{
			label: "Pending",
			value: pendingShipments.length.toLocaleString(),
			Icon: CalendarClock,
			colorClass: "text-warning",
			bgClass: "bg-warning/10",
		},
		{
			label: "Packed",
			value: packedShipments.length.toLocaleString(),
			Icon: PackageCheck,
			colorClass: "text-accent",
			bgClass: "bg-accent/10",
		},
		{
			label: "Shipped",
			value: shippedShipments.length.toLocaleString(),
			Icon: Truck,
			colorClass: "text-accent",
			bgClass: "bg-accent/10",
		},
		{
			label: "In Transit",
			value: transitShipments.length.toLocaleString(),
			Icon: Route,
			colorClass: "text-accent",
			bgClass: "bg-accent/10",
		},
		{
			label: "Delivered",
			value: deliveredShipments.length.toLocaleString(),
			Icon: CheckCircle2,
			colorClass: "text-success",
			bgClass: "bg-success/10",
		},
		{
			label: "Missing Tracking",
			value: missingTracking.length.toLocaleString(),
			Icon: PackageX,
			colorClass: "text-danger",
			bgClass: "bg-danger/10",
		},
		{
			label: "Avg Delivery",
			value: `${averageDeliveryDays.toFixed(1)} days`,
			Icon: MapPin,
			colorClass: "text-accent",
			bgClass: "bg-accent/10",
		},
	];

	return (
		<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-8">
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
			<Dropdown.Popover className="min-w-44">
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

function ShippingFilterSidebar({
	className = "",
	onPreviewChange,
}: {
	className?: string;
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
					onPreviewChange("Shipping filters reset");
				}}
				onSubmit={(event) => {
					event.preventDefault();
					onPreviewChange("Shipping filter preview applied");
				}}
			>
				<Card.Content className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4">
					<div className="flex flex-col gap-5">
						<FilterGroup title="Shipping Status">
							<CheckboxOptionGroup
								ariaLabel="Shipping statuses"
								name="shippingStatuses"
								options={SHIPPING_STATUS_OPTIONS}
							/>
						</FilterGroup>

						<FilterGroup title="Carriers">
							<CheckboxOptionGroup
								ariaLabel="Shipping carriers"
								name="carriers"
								options={SHIPPING_CARRIER_OPTIONS}
							/>
						</FilterGroup>

						<FilterGroup title="Methods">
							<CheckboxOptionGroup
								ariaLabel="Shipping methods"
								name="shippingMethods"
								options={SHIPPING_METHOD_OPTIONS}
							/>
						</FilterGroup>

						<FilterGroup title="Flags">
							<div className="flex flex-col gap-3">
								<FilterSwitch label="Has tracking number" name="hasTracking" />
								<FilterSwitch label="Missing tracking" name="missingTracking" />
								<FilterSwitch label="Delivered" name="isDelivered" />
								<FilterSwitch label="In progress" name="inProgress" />
							</div>
						</FilterGroup>

						<FilterGroup title="Shipped Date">
							<DateRangeFields maxName="shippedBefore" minName="shippedAfter" />
						</FilterGroup>

						<FilterGroup title="Delivered Date">
							<DateRangeFields
								maxName="deliveredBefore"
								minName="deliveredAfter"
							/>
						</FilterGroup>

						<FilterGroup title="Created Date">
							<DateRangeFields maxName="createdBefore" minName="createdAfter" />
						</FilterGroup>

						<FilterGroup title="Delivery Days">
							<RangeNumberFields
								maxLabel="Max"
								maxName="maxDeliveryDays"
								minLabel="Min"
								minName="minDeliveryDays"
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
	maxLabel,
	maxName,
	minLabel,
	minName,
	step,
}: {
	maxLabel: string;
	maxName: string;
	minLabel: string;
	minName: string;
	step: number;
}) {
	return (
		<div className="grid grid-cols-2 gap-2">
			<NumberField minValue={0} name={minName} step={step} variant="secondary">
				<Label className="text-xs text-muted">{minLabel}</Label>
				<NumberField.Group>
					<NumberField.Input className="w-full min-w-0" />
				</NumberField.Group>
			</NumberField>
			<NumberField minValue={0} name={maxName} step={step} variant="secondary">
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

function ShippingToolbar({
	demoState,
	onDemoStateChange,
	onPreviewChange,
}: {
	demoState: DemoState;
	onDemoStateChange: (state: DemoState) => void;
	onPreviewChange: (message: string) => void;
}) {
	const [searchType, setSearchType] = useState("orderNumber");
	const [sort, setSort] = useState("created-desc");

	return (
		<div className="shrink-0 rounded-2xl border border-border bg-surface p-2 shadow-sm">
			<div className="flex flex-col gap-2 xl:flex-row xl:items-center">
				<div className="flex min-w-0 flex-1 flex-col gap-2 md:flex-row">
					<form
						className="min-w-0 flex-1"
						onSubmit={(event) => {
							event.preventDefault();
							onPreviewChange("Shipping search preview submitted");
						}}
					>
						<TextField className="min-w-0" name="search">
							<InputGroup fullWidth variant="primary">
								<InputGroup.Prefix>
									<Search size={14} className="text-muted" />
								</InputGroup.Prefix>
								<InputGroup.Input
									aria-label="Search shipments"
									placeholder="Search shipments"
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
							onPreviewChange("Shipping search type preview changed");
						}}
					/>

					<MockSelect
						ariaLabel="Sort shipments"
						className="w-full md:w-44"
						options={SORT_OPTIONS}
						placeholder="Sort"
						selectedKey={sort}
						onSelect={(key) => {
							setSort(key);
							onPreviewChange("Shipping sort preview changed");
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
							aria-label="Shipping views"
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

function ShippingActions({
	onCopyCustomerEmail,
	onCopyOrderNumber,
	onCopyTrackingNumber,
	onPrint,
	shipment,
}: {
	onCopyCustomerEmail: (shipment: ShippingMock) => void;
	onCopyOrderNumber: (shipment: ShippingMock) => void;
	onCopyTrackingNumber: (shipment: ShippingMock) => void;
	onPrint: (shipment: ShippingMock) => void;
	shipment: ShippingMock;
}) {
	return (
		<Dropdown>
			<Button
				aria-label="Shipping actions"
				isIconOnly
				size="sm"
				variant="ghost"
			>
				<MoreHorizontal size={16} />
			</Button>
			<Dropdown.Popover className="min-w-52">
				<div className="flex flex-col gap-1 p-1">
					<Button
						className="justify-start"
						isDisabled={!shipment.trackingNumber}
						size="sm"
						variant="ghost"
						onPress={() => onCopyTrackingNumber(shipment)}
					>
						<Copy size={14} />
						Copy tracking number
					</Button>
					<Button
						className="justify-start"
						size="sm"
						variant="ghost"
						onPress={() => onCopyOrderNumber(shipment)}
					>
						<ReceiptText size={14} />
						Copy order number
					</Button>
					<Button
						className="justify-start"
						size="sm"
						variant="ghost"
						onPress={() => onCopyCustomerEmail(shipment)}
					>
						<UserRound size={14} />
						Copy customer email
					</Button>
					<Button
						className="justify-start"
						size="sm"
						variant="ghost"
						onPress={() => onPrint(shipment)}
					>
						<Printer size={14} />
						Print summary
					</Button>
				</div>
			</Dropdown.Popover>
		</Dropdown>
	);
}

function ShippingTableView({
	onCopyCustomerEmail,
	onCopyOrderNumber,
	onCopyTrackingNumber,
	onPrint,
	shipments,
}: {
	onCopyCustomerEmail: (shipment: ShippingMock) => void;
	onCopyOrderNumber: (shipment: ShippingMock) => void;
	onCopyTrackingNumber: (shipment: ShippingMock) => void;
	onPrint: (shipment: ShippingMock) => void;
	shipments: ShippingMock[];
}) {
	return (
		<Table>
			<Table.ScrollContainer>
				<Table.Content aria-label="Shipments" className="min-w-[1160px]">
					<Table.Header>
						<Table.Column isRowHeader className="w-[260px]">
							Shipment
						</Table.Column>
						<Table.Column className="w-[260px]">Customer</Table.Column>
						<Table.Column>Destination</Table.Column>
						<Table.Column>Carrier</Table.Column>
						<Table.Column>Method</Table.Column>
						<Table.Column>Status</Table.Column>
						<Table.Column>Shipped</Table.Column>
						<Table.Column>Delivered</Table.Column>
						<Table.Column className="w-12">Actions</Table.Column>
					</Table.Header>
					<Table.Body>
						{shipments.map((shipment) => (
							<Table.Row key={shipment.id}>
								<Table.Cell>
									<ShippingIdentity shipment={shipment} />
								</Table.Cell>
								<Table.Cell>
									<CustomerCell shipment={shipment} />
								</Table.Cell>
								<Table.Cell>
									<DestinationCell shipment={shipment} />
								</Table.Cell>
								<Table.Cell>
									<CarrierChip carrier={shipment.carrier} />
								</Table.Cell>
								<Table.Cell>
									<MethodChip method={shipment.method} />
								</Table.Cell>
								<Table.Cell>
									<ShippingStatusChip status={shipment.status} />
								</Table.Cell>
								<Table.Cell>
									<span className="text-sm text-muted">
										{formatDate(shipment.shippedAt)}
									</span>
								</Table.Cell>
								<Table.Cell>
									<span className="text-sm text-muted">
										{formatDate(shipment.deliveredAt)}
									</span>
								</Table.Cell>
								<Table.Cell>
									<ShippingActions
										onCopyCustomerEmail={onCopyCustomerEmail}
										onCopyOrderNumber={onCopyOrderNumber}
										onCopyTrackingNumber={onCopyTrackingNumber}
										onPrint={onPrint}
										shipment={shipment}
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

function ShippingListView({
	onCopyCustomerEmail,
	onCopyOrderNumber,
	onCopyTrackingNumber,
	onPrint,
	shipments,
}: {
	onCopyCustomerEmail: (shipment: ShippingMock) => void;
	onCopyOrderNumber: (shipment: ShippingMock) => void;
	onCopyTrackingNumber: (shipment: ShippingMock) => void;
	onPrint: (shipment: ShippingMock) => void;
	shipments: ShippingMock[];
}) {
	return (
		<div className="flex flex-col gap-3">
			{shipments.map((shipment) => (
				<Card key={shipment.id}>
					<Card.Content className="p-4">
						<div className="flex flex-col gap-4 xl:flex-row xl:items-center">
							<div className="flex min-w-0 flex-1 items-start justify-between gap-3">
								<div className="min-w-0">
									<ShippingIdentity shipment={shipment} />
									<div className="mt-2 max-w-md">
										<CustomerCell shipment={shipment} />
									</div>
								</div>
								<div className="xl:hidden">
									<ShippingActions
										onCopyCustomerEmail={onCopyCustomerEmail}
										onCopyOrderNumber={onCopyOrderNumber}
										onCopyTrackingNumber={onCopyTrackingNumber}
										onPrint={onPrint}
										shipment={shipment}
									/>
								</div>
							</div>

							<div className="grid min-w-0 grid-cols-2 gap-4 sm:grid-cols-4 xl:w-[600px]">
								<ShippingMetric label="Destination">
									<span>{shipment.destination.city}</span>
								</ShippingMetric>
								<ShippingMetric label="Carrier">
									<CarrierChip carrier={shipment.carrier} />
								</ShippingMetric>
								<ShippingMetric label="Shipped">
									<span>{formatDate(shipment.shippedAt)}</span>
								</ShippingMetric>
								<ShippingMetric label="Delivered">
									<span>{formatDate(shipment.deliveredAt)}</span>
								</ShippingMetric>
							</div>

							<div className="flex min-w-0 items-start justify-between gap-3 xl:w-[260px]">
								<div className="flex flex-wrap gap-1">
									<ShippingStatusChip status={shipment.status} />
									<MethodChip method={shipment.method} />
									{shipment.trackingNumber ? null : (
										<Chip color="danger" size="sm" variant="soft">
											No tracking
										</Chip>
									)}
								</div>
								<div className="hidden xl:block">
									<ShippingActions
										onCopyCustomerEmail={onCopyCustomerEmail}
										onCopyOrderNumber={onCopyOrderNumber}
										onCopyTrackingNumber={onCopyTrackingNumber}
										onPrint={onPrint}
										shipment={shipment}
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

function ShippingCardGrid({
	onCopyCustomerEmail,
	onCopyOrderNumber,
	onCopyTrackingNumber,
	onPrint,
	shipments,
}: {
	onCopyCustomerEmail: (shipment: ShippingMock) => void;
	onCopyOrderNumber: (shipment: ShippingMock) => void;
	onCopyTrackingNumber: (shipment: ShippingMock) => void;
	onPrint: (shipment: ShippingMock) => void;
	shipments: ShippingMock[];
}) {
	return (
		<div className="grid grid-cols-1 gap-4 xl:grid-cols-2 2xl:grid-cols-3">
			{shipments.map((shipment) => (
				<Card key={shipment.id} className="min-h-[286px]">
					<Card.Header className="flex-row items-start justify-between gap-3 p-4">
						<div className="min-w-0">
							<ShippingIdentity shipment={shipment} />
							<p className="mt-2 truncate text-xs text-muted">
								{shipment.customer.name} · {shipment.destination.city}
							</p>
						</div>
						<ShippingActions
							onCopyCustomerEmail={onCopyCustomerEmail}
							onCopyOrderNumber={onCopyOrderNumber}
							onCopyTrackingNumber={onCopyTrackingNumber}
							onPrint={onPrint}
							shipment={shipment}
						/>
					</Card.Header>

					<Card.Content className="flex flex-1 flex-col gap-4 px-4 pb-4 pt-0">
						<div className="flex flex-wrap gap-1">
							<ShippingStatusChip status={shipment.status} />
							<CarrierChip carrier={shipment.carrier} />
							<MethodChip method={shipment.method} />
							{shipment.trackingNumber ? null : (
								<Chip color="danger" size="sm" variant="soft">
									No tracking
								</Chip>
							)}
						</div>

						<div className="grid grid-cols-2 gap-4">
							<ShippingMetric label="Destination">
								<span>{shipment.destination.city}</span>
							</ShippingMetric>
							<ShippingMetric label="Postal Code">
								<span>{shipment.destination.postalCode}</span>
							</ShippingMetric>
							<ShippingMetric label="Shipped">
								<span>{formatDate(shipment.shippedAt)}</span>
							</ShippingMetric>
							<ShippingMetric label="Delivered">
								<span>{formatDate(shipment.deliveredAt)}</span>
							</ShippingMetric>
						</div>
					</Card.Content>

					<Card.Footer className="mt-auto justify-between border-t border-border px-4 py-3">
						<span className="truncate text-xs text-muted">
							{shipment.trackingNumber ?? "Tracking pending"}
						</span>
						<span className="text-xs text-muted">
							Updated {formatDate(shipment.updatedAt)}
						</span>
					</Card.Footer>
				</Card>
			))}
		</div>
	);
}

function ShippingPagination({
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
					of <span className="font-medium text-foreground">{total}</span>{" "}
					shipments
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

function ShippingResults({
	demoState,
	onCopyCustomerEmail,
	onCopyOrderNumber,
	onCopyTrackingNumber,
	onDemoStateChange,
	onPreviewChange,
	onPrint,
	shipments,
}: {
	demoState: DemoState;
	onCopyCustomerEmail: (shipment: ShippingMock) => void;
	onCopyOrderNumber: (shipment: ShippingMock) => void;
	onCopyTrackingNumber: (shipment: ShippingMock) => void;
	onDemoStateChange: (state: DemoState) => void;
	onPreviewChange: (message: string) => void;
	onPrint: (shipment: ShippingMock) => void;
	shipments: ShippingMock[];
}) {
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(10);
	const totalPages = Math.max(Math.ceil(shipments.length / limit), 1);
	const safePage = Math.min(page, totalPages);
	const paginatedShipments = shipments.slice(
		(safePage - 1) * limit,
		safePage * limit,
	);

	return (
		<Tabs
			defaultSelectedKey="table"
			className="flex min-w-0 flex-col gap-3 lg:h-[calc(100vh-8rem)] lg:min-h-[520px] lg:min-h-0"
		>
			<ShippingToolbar
				demoState={demoState}
				onDemoStateChange={onDemoStateChange}
				onPreviewChange={onPreviewChange}
			/>

			{demoState === "error" ? (
				<div className="min-h-0 min-w-0 flex-1 overflow-auto">
					<AdminSectionError
						actionLabel="Show data"
						message="This is a local UI preview of the error state."
						title="Shipments failed to load"
						onAction={() => onDemoStateChange("data")}
					/>
				</div>
			) : demoState === "empty" || shipments.length === 0 ? (
				<div className="min-h-0 min-w-0 flex-1 overflow-auto">
					<AdminEmptyState
						icon={PackageSearch}
						message="No mock shipments match the current preview state."
						title="No shipments found"
					/>
				</div>
			) : (
				<>
					<Tabs.Panel
						id="table"
						className="min-h-0 min-w-0 flex-1 overflow-auto"
					>
						<ShippingTableView
							onCopyCustomerEmail={onCopyCustomerEmail}
							onCopyOrderNumber={onCopyOrderNumber}
							onCopyTrackingNumber={onCopyTrackingNumber}
							onPrint={onPrint}
							shipments={paginatedShipments}
						/>
					</Tabs.Panel>
					<Tabs.Panel
						id="list"
						className="min-h-0 min-w-0 flex-1 overflow-auto"
					>
						<ShippingListView
							onCopyCustomerEmail={onCopyCustomerEmail}
							onCopyOrderNumber={onCopyOrderNumber}
							onCopyTrackingNumber={onCopyTrackingNumber}
							onPrint={onPrint}
							shipments={paginatedShipments}
						/>
					</Tabs.Panel>
					<Tabs.Panel
						id="cards"
						className="min-h-0 min-w-0 flex-1 overflow-auto"
					>
						<ShippingCardGrid
							onCopyCustomerEmail={onCopyCustomerEmail}
							onCopyOrderNumber={onCopyOrderNumber}
							onCopyTrackingNumber={onCopyTrackingNumber}
							onPrint={onPrint}
							shipments={paginatedShipments}
						/>
					</Tabs.Panel>
				</>
			)}

			<ShippingPagination
				limit={limit}
				page={safePage}
				total={shipments.length}
				onPageChange={(nextPage) => {
					setPage(nextPage);
					onPreviewChange("Shipping page preview changed");
				}}
				onPageSizeChange={(nextLimit) => {
					setLimit(nextLimit);
					setPage(1);
					onPreviewChange("Shipping page size preview changed");
				}}
			/>
		</Tabs>
	);
}

export function ShippingPage() {
	const [demoState, setDemoState] = useState<DemoState>("data");
	const [previewMessage, setPreviewMessage] = useState(
		"UI preview uses local mock shipments",
	);

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

	function printShippingSummary(shipment: ShippingMock) {
		setPreviewMessage(`Print summary requested for ${shipment.orderNumber}`);

		if (typeof window !== "undefined") {
			window.print();
		}
	}

	return (
		<div className="flex flex-col gap-6">
			<AdminPageHeader
				title="Shipping"
				description="Track shipment records, carriers, and delivery progress"
			/>

			<ShippingStatCards shipments={MOCK_SHIPMENTS} />

			<Card className="border-accent/20 bg-accent/5 px-4 py-3">
				<Card.Content className="flex flex-col gap-2 p-0 sm:flex-row sm:items-center sm:justify-between">
					<div className="flex min-w-0 items-start gap-3">
						<Truck size={18} className="mt-0.5 shrink-0 text-accent" />
						<div className="min-w-0">
							<p className="text-sm font-medium text-foreground">
								{previewMessage}
							</p>
							<p className="mt-1 text-xs text-muted">
								No shipping APIs are connected on this page.
							</p>
						</div>
					</div>
					<Button
						className="shrink-0"
						size="sm"
						variant="secondary"
						onPress={() =>
							setPreviewMessage("UI preview uses local mock shipments")
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
							<ShippingFilterSidebar onPreviewChange={setPreviewMessage} />
						</Disclosure.Body>
					</Disclosure.Content>
				</Disclosure>
			</div>

			<div className="grid min-w-0 items-start gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
				<aside className="hidden lg:h-[calc(100vh-8rem)] lg:min-h-[520px] lg:block">
					<ShippingFilterSidebar
						className="sticky top-0 h-full"
						onPreviewChange={setPreviewMessage}
					/>
				</aside>
				<ShippingResults
					demoState={demoState}
					onCopyCustomerEmail={(shipment) => {
						void copyToClipboard(shipment.customer.email, "Customer email");
					}}
					onCopyOrderNumber={(shipment) => {
						void copyToClipboard(shipment.orderNumber, "Order number");
					}}
					onCopyTrackingNumber={(shipment) => {
						if (!shipment.trackingNumber) {
							setPreviewMessage("Tracking number is missing");
							return;
						}

						void copyToClipboard(shipment.trackingNumber, "Tracking number");
					}}
					onDemoStateChange={setDemoState}
					onPreviewChange={setPreviewMessage}
					onPrint={printShippingSummary}
					shipments={MOCK_SHIPMENTS}
				/>
			</div>
		</div>
	);
}
