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
	AlertCircle,
	Banknote,
	CheckCircle2,
	ChevronDown,
	Copy,
	CreditCard,
	Grid3X3,
	LayoutList,
	MoreHorizontal,
	PackageSearch,
	Printer,
	ReceiptText,
	RefreshCcw,
	RotateCcw,
	Search,
	SlidersHorizontal,
	TableProperties,
	TrendingDown,
	UserRound,
	WalletCards,
} from "lucide-react";
import { type ReactNode, useState } from "react";
import {
	AdminEmptyState,
	AdminPageHeader,
	AdminSectionError,
} from "#/components/admin/sections/admin-page";

type PaymentStatus = "pending" | "paid" | "failed" | "refunded";
type PaymentMethod = "card" | "paypal" | "bank_transfer" | "cash_on_delivery";
type DemoState = "data" | "empty" | "error";
type ChipColor = "accent" | "danger" | "default" | "success" | "warning";

type PaymentMock = {
	id: string;
	amount: number;
	createdAt: string;
	customer: {
		email: string;
		id: string;
		name: string;
	};
	method: PaymentMethod;
	orderId: string;
	orderNumber: string;
	paidAt: string | null;
	status: PaymentStatus;
	stripe: {
		checkoutSessionId: string;
		currency: string;
		paymentIntentId: string | null;
		status: string;
	} | null;
	updatedAt: string;
};

type SelectOption = {
	id: string;
	label: string;
};

const PAYMENT_STATUS_OPTIONS = [
	{ id: "pending", label: "Pending" },
	{ id: "paid", label: "Paid" },
	{ id: "failed", label: "Failed" },
	{ id: "refunded", label: "Refunded" },
] satisfies SelectOption[];

const PAYMENT_METHOD_OPTIONS = [
	{ id: "card", label: "Card" },
	{ id: "paypal", label: "PayPal" },
	{ id: "bank_transfer", label: "Bank Transfer" },
	{ id: "cash_on_delivery", label: "Cash on Delivery" },
] satisfies SelectOption[];

const SEARCH_TYPE_OPTIONS = [
	{ id: "paymentId", label: "Payment ID" },
	{ id: "orderNumber", label: "Order #" },
	{ id: "customerName", label: "Customer" },
	{ id: "customerEmail", label: "Email" },
	{ id: "intent", label: "Intent" },
] satisfies SelectOption[];

const SORT_OPTIONS = [
	{ id: "created-desc", label: "Newest first" },
	{ id: "created-asc", label: "Oldest first" },
	{ id: "amount-desc", label: "Amount high-low" },
	{ id: "amount-asc", label: "Amount low-high" },
	{ id: "status-asc", label: "Status A-Z" },
	{ id: "method-asc", label: "Method A-Z" },
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
	PaymentStatus,
	{
		color: ChipColor;
		label: string;
	}
> = {
	pending: { color: "warning", label: "Pending" },
	paid: { color: "success", label: "Paid" },
	failed: { color: "danger", label: "Failed" },
	refunded: { color: "default", label: "Refunded" },
};

const METHOD_LABELS: Record<PaymentMethod, string> = {
	card: "Card",
	paypal: "PayPal",
	bank_transfer: "Bank Transfer",
	cash_on_delivery: "Cash on Delivery",
};

const MOCK_PAYMENTS: PaymentMock[] = [
	{
		id: "pay_01jz_1001_card",
		orderId: "ord_01jz_berlin_1001",
		orderNumber: "TS-2026-1001",
		method: "card",
		amount: 1426.81,
		status: "pending",
		paidAt: null,
		createdAt: "2026-06-02T09:12:00.000Z",
		updatedAt: "2026-06-02T09:18:00.000Z",
		customer: {
			id: "usr_lena_weber",
			name: "Lena Weber",
			email: "lena.weber@example.de",
		},
		stripe: {
			checkoutSessionId: "cs_test_lena_1001",
			paymentIntentId: "pi_lena_1001",
			currency: "eur",
			status: "open",
		},
	},
	{
		id: "pay_01jz_1002_card",
		orderId: "ord_01jz_hamburg_1002",
		orderNumber: "TS-2026-1002",
		method: "card",
		amount: 2634.54,
		status: "paid",
		paidAt: "2026-06-01T15:45:00.000Z",
		createdAt: "2026-06-01T15:42:00.000Z",
		updatedAt: "2026-06-01T15:45:00.000Z",
		customer: {
			id: "usr_matthias_klein",
			name: "Matthias Klein",
			email: "matthias.klein@example.de",
		},
		stripe: {
			checkoutSessionId: "cs_test_matthias_1002",
			paymentIntentId: "pi_matthias_1002",
			currency: "eur",
			status: "succeeded",
		},
	},
	{
		id: "pay_01jz_1003_paypal",
		orderId: "ord_01jz_munich_1003",
		orderNumber: "TS-2026-1003",
		method: "paypal",
		amount: 1069.81,
		status: "paid",
		paidAt: "2026-05-31T11:08:00.000Z",
		createdAt: "2026-05-31T11:05:00.000Z",
		updatedAt: "2026-05-31T11:08:00.000Z",
		customer: {
			id: "usr_sophia_bauer",
			name: "Sophia Bauer",
			email: "sophia.bauer@example.de",
		},
		stripe: null,
	},
	{
		id: "pay_01jz_1004_transfer",
		orderId: "ord_01jz_cologne_1004",
		orderNumber: "TS-2026-1004",
		method: "bank_transfer",
		amount: 1557.59,
		status: "pending",
		paidAt: null,
		createdAt: "2026-05-30T18:16:00.000Z",
		updatedAt: "2026-05-30T18:16:00.000Z",
		customer: {
			id: "usr_emil_schneider",
			name: "Emil Schneider",
			email: "emil.schneider@example.de",
		},
		stripe: null,
	},
	{
		id: "pay_01jz_1005_card",
		orderId: "ord_01jz_frankfurt_1005",
		orderNumber: "TS-2026-1005",
		method: "card",
		amount: 423.52,
		status: "refunded",
		paidAt: "2026-05-29T13:49:00.000Z",
		createdAt: "2026-05-29T13:48:00.000Z",
		updatedAt: "2026-05-29T14:03:00.000Z",
		customer: {
			id: "usr_amina_hoffmann",
			name: "Amina Hoffmann",
			email: "amina.hoffmann@example.de",
		},
		stripe: {
			checkoutSessionId: "cs_test_amina_1005",
			paymentIntentId: "pi_amina_1005",
			currency: "eur",
			status: "refunded",
		},
	},
	{
		id: "pay_01jz_1006_card",
		orderId: "ord_01jz_stuttgart_1006",
		orderNumber: "TS-2026-1006",
		method: "card",
		amount: 3092.81,
		status: "paid",
		paidAt: "2026-05-27T10:24:00.000Z",
		createdAt: "2026-05-27T10:22:00.000Z",
		updatedAt: "2026-05-27T10:24:00.000Z",
		customer: {
			id: "usr_noah_fischer",
			name: "Noah Fischer",
			email: "noah.fischer@example.de",
		},
		stripe: {
			checkoutSessionId: "cs_test_noah_1006",
			paymentIntentId: "pi_noah_1006",
			currency: "eur",
			status: "succeeded",
		},
	},
	{
		id: "pay_01jz_1007_cod",
		orderId: "ord_01jz_leipzig_1007",
		orderNumber: "TS-2026-1007",
		method: "cash_on_delivery",
		amount: 2252.55,
		status: "pending",
		paidAt: null,
		createdAt: "2026-05-26T16:34:00.000Z",
		updatedAt: "2026-05-27T08:48:00.000Z",
		customer: {
			id: "usr_mila_wagner",
			name: "Mila Wagner",
			email: "mila.wagner@example.de",
		},
		stripe: null,
	},
	{
		id: "pay_01jz_1008_card",
		orderId: "ord_01jz_dusseldorf_1008",
		orderNumber: "TS-2026-1008",
		method: "card",
		amount: 899.52,
		status: "failed",
		paidAt: null,
		createdAt: "2026-05-24T12:12:00.000Z",
		updatedAt: "2026-05-24T12:15:00.000Z",
		customer: {
			id: "usr_jonas_becker",
			name: "Jonas Becker",
			email: "jonas.becker@example.de",
		},
		stripe: {
			checkoutSessionId: "cs_test_jonas_1008",
			paymentIntentId: "pi_jonas_1008",
			currency: "eur",
			status: "requires_payment_method",
		},
	},
];

function formatCurrency(value: number) {
	return new Intl.NumberFormat("de-DE", {
		currency: "EUR",
		style: "currency",
	}).format(value);
}

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

function PaymentStatusChip({ status }: { status: PaymentStatus }) {
	const meta = STATUS_META[status];

	return (
		<Chip color={meta.color} size="sm" variant="soft">
			{meta.label}
		</Chip>
	);
}

function PaymentMethodChip({ method }: { method: PaymentMethod }) {
	return (
		<Chip
			color={method === "card" ? "accent" : "default"}
			size="sm"
			variant="soft"
		>
			{METHOD_LABELS[method]}
		</Chip>
	);
}

function PaymentIdentity({ payment }: { payment: PaymentMock }) {
	return (
		<div className="flex min-w-0 flex-col">
			<p className="truncate text-sm font-medium text-foreground">
				{payment.id}
			</p>
			<p className="mt-0.5 truncate text-xs text-muted">
				{payment.orderNumber}
			</p>
		</div>
	);
}

function CustomerCell({ payment }: { payment: PaymentMock }) {
	return (
		<div className="flex min-w-0 items-center gap-3">
			<div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-xs font-semibold text-accent">
				{getCustomerInitials(payment.customer.name)}
			</div>
			<div className="min-w-0">
				<p className="truncate text-sm font-medium text-foreground">
					{payment.customer.name}
				</p>
				<p className="mt-0.5 truncate text-xs text-muted">
					{payment.customer.email}
				</p>
			</div>
		</div>
	);
}

function PaymentMetric({
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

function PaymentStatCards({ payments }: { payments: PaymentMock[] }) {
	const paidPayments = payments.filter((payment) => payment.status === "paid");
	const pendingPayments = payments.filter(
		(payment) => payment.status === "pending",
	);
	const failedPayments = payments.filter(
		(payment) => payment.status === "failed",
	);
	const refundedPayments = payments.filter(
		(payment) => payment.status === "refunded",
	);
	const collectedAmount = paidPayments.reduce(
		(total, payment) => total + payment.amount,
		0,
	);
	const refundedAmount = refundedPayments.reduce(
		(total, payment) => total + payment.amount,
		0,
	);
	const averageAmount =
		payments.length === 0
			? 0
			: payments.reduce((total, payment) => total + payment.amount, 0) /
				payments.length;

	const cards = [
		{
			label: "Total Payments",
			value: payments.length.toLocaleString(),
			Icon: CreditCard,
			colorClass: "text-accent",
			bgClass: "bg-accent/10",
		},
		{
			label: "Paid",
			value: paidPayments.length.toLocaleString(),
			Icon: CheckCircle2,
			colorClass: "text-success",
			bgClass: "bg-success/10",
		},
		{
			label: "Pending",
			value: pendingPayments.length.toLocaleString(),
			Icon: RefreshCcw,
			colorClass: "text-warning",
			bgClass: "bg-warning/10",
		},
		{
			label: "Failed",
			value: failedPayments.length.toLocaleString(),
			Icon: AlertCircle,
			colorClass: "text-danger",
			bgClass: "bg-danger/10",
		},
		{
			label: "Refunded",
			value: refundedPayments.length.toLocaleString(),
			Icon: RotateCcw,
			colorClass: "text-muted",
			bgClass: "bg-default",
		},
		{
			label: "Collected",
			value: formatCurrency(collectedAmount),
			Icon: Banknote,
			colorClass: "text-success",
			bgClass: "bg-success/10",
		},
		{
			label: "Refunded Amount",
			value: formatCurrency(refundedAmount),
			Icon: TrendingDown,
			colorClass: "text-danger",
			bgClass: "bg-danger/10",
		},
		{
			label: "Average Payment",
			value: formatCurrency(averageAmount),
			Icon: WalletCards,
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

function PaymentsFilterSidebar({
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
					onPreviewChange("Payment filters reset");
				}}
				onSubmit={(event) => {
					event.preventDefault();
					onPreviewChange("Payment filter preview applied");
				}}
			>
				<Card.Content className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4">
					<div className="flex flex-col gap-5">
						<FilterGroup title="Payment Status">
							<CheckboxOptionGroup
								ariaLabel="Payment statuses"
								name="paymentStatuses"
								options={PAYMENT_STATUS_OPTIONS}
							/>
						</FilterGroup>

						<FilterGroup title="Payment Method">
							<CheckboxOptionGroup
								ariaLabel="Payment methods"
								name="paymentMethods"
								options={PAYMENT_METHOD_OPTIONS}
							/>
						</FilterGroup>

						<FilterGroup title="Flags">
							<div className="flex flex-col gap-3">
								<FilterSwitch label="Has Stripe record" name="hasStripe" />
								<FilterSwitch label="Paid date present" name="hasPaidAt" />
								<FilterSwitch label="Needs attention" name="needsAttention" />
							</div>
						</FilterGroup>

						<FilterGroup title="Amount">
							<RangeNumberFields
								formatOptions={{ currency: "EUR", style: "currency" }}
								maxLabel="Max"
								maxName="maxAmount"
								minLabel="Min"
								minName="minAmount"
								step={50}
							/>
						</FilterGroup>

						<FilterGroup title="Paid Date">
							<DateRangeFields maxName="paidBefore" minName="paidAfter" />
						</FilterGroup>

						<FilterGroup title="Created Date">
							<DateRangeFields maxName="createdBefore" minName="createdAfter" />
						</FilterGroup>

						<FilterGroup title="Updated Date">
							<DateRangeFields maxName="updatedBefore" minName="updatedAfter" />
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

function PaymentsToolbar({
	demoState,
	onDemoStateChange,
	onPreviewChange,
}: {
	demoState: DemoState;
	onDemoStateChange: (state: DemoState) => void;
	onPreviewChange: (message: string) => void;
}) {
	const [searchType, setSearchType] = useState("paymentId");
	const [sort, setSort] = useState("created-desc");

	return (
		<div className="shrink-0 rounded-2xl border border-border bg-surface p-2 shadow-sm">
			<div className="flex flex-col gap-2 xl:flex-row xl:items-center">
				<div className="flex min-w-0 flex-1 flex-col gap-2 md:flex-row">
					<form
						className="min-w-0 flex-1"
						onSubmit={(event) => {
							event.preventDefault();
							onPreviewChange("Payment search preview submitted");
						}}
					>
						<TextField className="min-w-0" name="search">
							<InputGroup fullWidth variant="primary">
								<InputGroup.Prefix>
									<Search size={14} className="text-muted" />
								</InputGroup.Prefix>
								<InputGroup.Input
									aria-label="Search payments"
									placeholder="Search payments"
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
							onPreviewChange("Payment search type preview changed");
						}}
					/>

					<MockSelect
						ariaLabel="Sort payments"
						className="w-full md:w-44"
						options={SORT_OPTIONS}
						placeholder="Sort"
						selectedKey={sort}
						onSelect={(key) => {
							setSort(key);
							onPreviewChange("Payment sort preview changed");
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
							aria-label="Payment views"
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

function PaymentActions({
	onCopyCustomerEmail,
	onCopyOrderNumber,
	onCopyPaymentId,
	onPrint,
	payment,
}: {
	onCopyCustomerEmail: (payment: PaymentMock) => void;
	onCopyOrderNumber: (payment: PaymentMock) => void;
	onCopyPaymentId: (payment: PaymentMock) => void;
	onPrint: (payment: PaymentMock) => void;
	payment: PaymentMock;
}) {
	return (
		<Dropdown>
			<Button aria-label="Payment actions" isIconOnly size="sm" variant="ghost">
				<MoreHorizontal size={16} />
			</Button>
			<Dropdown.Popover className="min-w-48">
				<div className="flex flex-col gap-1 p-1">
					<Button
						className="justify-start"
						size="sm"
						variant="ghost"
						onPress={() => onCopyPaymentId(payment)}
					>
						<Copy size={14} />
						Copy payment id
					</Button>
					<Button
						className="justify-start"
						size="sm"
						variant="ghost"
						onPress={() => onCopyOrderNumber(payment)}
					>
						<ReceiptText size={14} />
						Copy order number
					</Button>
					<Button
						className="justify-start"
						size="sm"
						variant="ghost"
						onPress={() => onCopyCustomerEmail(payment)}
					>
						<UserRound size={14} />
						Copy customer email
					</Button>
					<Button
						className="justify-start"
						size="sm"
						variant="ghost"
						onPress={() => onPrint(payment)}
					>
						<Printer size={14} />
						Print summary
					</Button>
				</div>
			</Dropdown.Popover>
		</Dropdown>
	);
}

function PaymentTableView({
	onCopyCustomerEmail,
	onCopyOrderNumber,
	onCopyPaymentId,
	onPrint,
	payments,
}: {
	onCopyCustomerEmail: (payment: PaymentMock) => void;
	onCopyOrderNumber: (payment: PaymentMock) => void;
	onCopyPaymentId: (payment: PaymentMock) => void;
	onPrint: (payment: PaymentMock) => void;
	payments: PaymentMock[];
}) {
	return (
		<Table>
			<Table.ScrollContainer>
				<Table.Content aria-label="Payments" className="min-w-[1080px]">
					<Table.Header>
						<Table.Column isRowHeader className="w-[260px]">
							Payment
						</Table.Column>
						<Table.Column className="w-[260px]">Customer</Table.Column>
						<Table.Column>Amount</Table.Column>
						<Table.Column>Method</Table.Column>
						<Table.Column>Status</Table.Column>
						<Table.Column>Paid</Table.Column>
						<Table.Column>Created</Table.Column>
						<Table.Column className="w-12">Actions</Table.Column>
					</Table.Header>
					<Table.Body>
						{payments.map((payment) => (
							<Table.Row key={payment.id}>
								<Table.Cell>
									<PaymentIdentity payment={payment} />
								</Table.Cell>
								<Table.Cell>
									<CustomerCell payment={payment} />
								</Table.Cell>
								<Table.Cell>
									<span className="text-sm font-medium text-foreground">
										{formatCurrency(payment.amount)}
									</span>
								</Table.Cell>
								<Table.Cell>
									<PaymentMethodChip method={payment.method} />
								</Table.Cell>
								<Table.Cell>
									<PaymentStatusChip status={payment.status} />
								</Table.Cell>
								<Table.Cell>
									<span className="text-sm text-muted">
										{formatDate(payment.paidAt)}
									</span>
								</Table.Cell>
								<Table.Cell>
									<span className="text-sm text-muted">
										{formatDate(payment.createdAt)}
									</span>
								</Table.Cell>
								<Table.Cell>
									<PaymentActions
										onCopyCustomerEmail={onCopyCustomerEmail}
										onCopyOrderNumber={onCopyOrderNumber}
										onCopyPaymentId={onCopyPaymentId}
										onPrint={onPrint}
										payment={payment}
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

function PaymentListView({
	onCopyCustomerEmail,
	onCopyOrderNumber,
	onCopyPaymentId,
	onPrint,
	payments,
}: {
	onCopyCustomerEmail: (payment: PaymentMock) => void;
	onCopyOrderNumber: (payment: PaymentMock) => void;
	onCopyPaymentId: (payment: PaymentMock) => void;
	onPrint: (payment: PaymentMock) => void;
	payments: PaymentMock[];
}) {
	return (
		<div className="flex flex-col gap-3">
			{payments.map((payment) => (
				<Card key={payment.id}>
					<Card.Content className="p-4">
						<div className="flex flex-col gap-4 xl:flex-row xl:items-center">
							<div className="flex min-w-0 flex-1 items-start justify-between gap-3">
								<div className="min-w-0">
									<PaymentIdentity payment={payment} />
									<div className="mt-2 max-w-md">
										<CustomerCell payment={payment} />
									</div>
								</div>
								<div className="xl:hidden">
									<PaymentActions
										onCopyCustomerEmail={onCopyCustomerEmail}
										onCopyOrderNumber={onCopyOrderNumber}
										onCopyPaymentId={onCopyPaymentId}
										onPrint={onPrint}
										payment={payment}
									/>
								</div>
							</div>

							<div className="grid min-w-0 grid-cols-2 gap-4 sm:grid-cols-4 xl:w-[560px]">
								<PaymentMetric label="Amount">
									<span className="font-medium">
										{formatCurrency(payment.amount)}
									</span>
								</PaymentMetric>
								<PaymentMetric label="Method">
									<PaymentMethodChip method={payment.method} />
								</PaymentMetric>
								<PaymentMetric label="Paid">
									<span>{formatDate(payment.paidAt)}</span>
								</PaymentMetric>
								<PaymentMetric label="Updated">
									<span>{formatDate(payment.updatedAt)}</span>
								</PaymentMetric>
							</div>

							<div className="flex min-w-0 items-start justify-between gap-3 xl:w-[240px]">
								<div className="flex flex-wrap gap-1">
									<PaymentStatusChip status={payment.status} />
									{payment.stripe ? (
										<Chip color="accent" size="sm" variant="soft">
											Stripe
										</Chip>
									) : null}
								</div>
								<div className="hidden xl:block">
									<PaymentActions
										onCopyCustomerEmail={onCopyCustomerEmail}
										onCopyOrderNumber={onCopyOrderNumber}
										onCopyPaymentId={onCopyPaymentId}
										onPrint={onPrint}
										payment={payment}
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

function PaymentCardGrid({
	onCopyCustomerEmail,
	onCopyOrderNumber,
	onCopyPaymentId,
	onPrint,
	payments,
}: {
	onCopyCustomerEmail: (payment: PaymentMock) => void;
	onCopyOrderNumber: (payment: PaymentMock) => void;
	onCopyPaymentId: (payment: PaymentMock) => void;
	onPrint: (payment: PaymentMock) => void;
	payments: PaymentMock[];
}) {
	return (
		<div className="grid grid-cols-1 gap-4 xl:grid-cols-2 2xl:grid-cols-3">
			{payments.map((payment) => (
				<Card key={payment.id} className="min-h-[286px]">
					<Card.Header className="flex-row items-start justify-between gap-3 p-4">
						<div className="min-w-0">
							<PaymentIdentity payment={payment} />
							<p className="mt-2 truncate text-xs text-muted">
								{payment.customer.name} · {payment.customer.email}
							</p>
						</div>
						<PaymentActions
							onCopyCustomerEmail={onCopyCustomerEmail}
							onCopyOrderNumber={onCopyOrderNumber}
							onCopyPaymentId={onCopyPaymentId}
							onPrint={onPrint}
							payment={payment}
						/>
					</Card.Header>

					<Card.Content className="flex flex-1 flex-col gap-4 px-4 pb-4 pt-0">
						<div className="flex flex-wrap gap-1">
							<PaymentStatusChip status={payment.status} />
							<PaymentMethodChip method={payment.method} />
							{payment.stripe ? (
								<Chip color="accent" size="sm" variant="soft">
									Stripe
								</Chip>
							) : null}
						</div>

						<div className="grid grid-cols-2 gap-4">
							<PaymentMetric label="Amount">
								<span className="font-medium">
									{formatCurrency(payment.amount)}
								</span>
							</PaymentMetric>
							<PaymentMetric label="Paid">
								<span>{formatDate(payment.paidAt)}</span>
							</PaymentMetric>
							<PaymentMetric label="Created">
								<span>{formatDate(payment.createdAt)}</span>
							</PaymentMetric>
							<PaymentMetric label="Intent">
								<span className="block truncate text-xs text-muted">
									{payment.stripe?.paymentIntentId ?? "—"}
								</span>
							</PaymentMetric>
						</div>
					</Card.Content>

					<Card.Footer className="mt-auto justify-between border-t border-border px-4 py-3">
						<span className="truncate text-xs text-muted">
							{payment.orderNumber}
						</span>
						<span className="text-xs text-muted">
							Updated {formatDate(payment.updatedAt)}
						</span>
					</Card.Footer>
				</Card>
			))}
		</div>
	);
}

function PaymentsPagination({
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
					payments
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

function PaymentsResults({
	demoState,
	onCopyCustomerEmail,
	onCopyOrderNumber,
	onCopyPaymentId,
	onDemoStateChange,
	onPreviewChange,
	onPrint,
	payments,
}: {
	demoState: DemoState;
	onCopyCustomerEmail: (payment: PaymentMock) => void;
	onCopyOrderNumber: (payment: PaymentMock) => void;
	onCopyPaymentId: (payment: PaymentMock) => void;
	onDemoStateChange: (state: DemoState) => void;
	onPreviewChange: (message: string) => void;
	onPrint: (payment: PaymentMock) => void;
	payments: PaymentMock[];
}) {
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(10);
	const totalPages = Math.max(Math.ceil(payments.length / limit), 1);
	const safePage = Math.min(page, totalPages);
	const paginatedPayments = payments.slice(
		(safePage - 1) * limit,
		safePage * limit,
	);

	return (
		<Tabs
			defaultSelectedKey="table"
			className="flex min-w-0 flex-col gap-3 lg:h-[calc(100vh-8rem)] lg:min-h-[520px] lg:min-h-0"
		>
			<PaymentsToolbar
				demoState={demoState}
				onDemoStateChange={onDemoStateChange}
				onPreviewChange={onPreviewChange}
			/>

			{demoState === "error" ? (
				<div className="min-h-0 min-w-0 flex-1 overflow-auto">
					<AdminSectionError
						actionLabel="Show data"
						message="This is a local UI preview of the error state."
						title="Payments failed to load"
						onAction={() => onDemoStateChange("data")}
					/>
				</div>
			) : demoState === "empty" || payments.length === 0 ? (
				<div className="min-h-0 min-w-0 flex-1 overflow-auto">
					<AdminEmptyState
						icon={PackageSearch}
						message="No mock payments match the current preview state."
						title="No payments found"
					/>
				</div>
			) : (
				<>
					<Tabs.Panel
						id="table"
						className="min-h-0 min-w-0 flex-1 overflow-auto"
					>
						<PaymentTableView
							onCopyCustomerEmail={onCopyCustomerEmail}
							onCopyOrderNumber={onCopyOrderNumber}
							onCopyPaymentId={onCopyPaymentId}
							onPrint={onPrint}
							payments={paginatedPayments}
						/>
					</Tabs.Panel>
					<Tabs.Panel
						id="list"
						className="min-h-0 min-w-0 flex-1 overflow-auto"
					>
						<PaymentListView
							onCopyCustomerEmail={onCopyCustomerEmail}
							onCopyOrderNumber={onCopyOrderNumber}
							onCopyPaymentId={onCopyPaymentId}
							onPrint={onPrint}
							payments={paginatedPayments}
						/>
					</Tabs.Panel>
					<Tabs.Panel
						id="cards"
						className="min-h-0 min-w-0 flex-1 overflow-auto"
					>
						<PaymentCardGrid
							onCopyCustomerEmail={onCopyCustomerEmail}
							onCopyOrderNumber={onCopyOrderNumber}
							onCopyPaymentId={onCopyPaymentId}
							onPrint={onPrint}
							payments={paginatedPayments}
						/>
					</Tabs.Panel>
				</>
			)}

			<PaymentsPagination
				limit={limit}
				page={safePage}
				total={payments.length}
				onPageChange={(nextPage) => {
					setPage(nextPage);
					onPreviewChange("Payment page preview changed");
				}}
				onPageSizeChange={(nextLimit) => {
					setLimit(nextLimit);
					setPage(1);
					onPreviewChange("Payment page size preview changed");
				}}
			/>
		</Tabs>
	);
}

export function PaymentsPage() {
	const [demoState, setDemoState] = useState<DemoState>("data");
	const [previewMessage, setPreviewMessage] = useState(
		"UI preview uses local mock payments",
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

	function printPaymentSummary(payment: PaymentMock) {
		setPreviewMessage(`Print summary requested for ${payment.id}`);

		if (typeof window !== "undefined") {
			window.print();
		}
	}

	return (
		<div className="flex flex-col gap-6">
			<AdminPageHeader
				title="Payments"
				description="Track payment records, methods, and collection status"
			/>

			<PaymentStatCards payments={MOCK_PAYMENTS} />

			<Card className="border-accent/20 bg-accent/5 px-4 py-3">
				<Card.Content className="flex flex-col gap-2 p-0 sm:flex-row sm:items-center sm:justify-between">
					<div className="flex min-w-0 items-start gap-3">
						<CreditCard size={18} className="mt-0.5 shrink-0 text-accent" />
						<div className="min-w-0">
							<p className="text-sm font-medium text-foreground">
								{previewMessage}
							</p>
							<p className="mt-1 text-xs text-muted">
								No payment APIs are connected on this page.
							</p>
						</div>
					</div>
					<Button
						className="shrink-0"
						size="sm"
						variant="secondary"
						onPress={() =>
							setPreviewMessage("UI preview uses local mock payments")
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
							<PaymentsFilterSidebar onPreviewChange={setPreviewMessage} />
						</Disclosure.Body>
					</Disclosure.Content>
				</Disclosure>
			</div>

			<div className="grid min-w-0 items-start gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
				<aside className="hidden lg:h-[calc(100vh-8rem)] lg:min-h-[520px] lg:block">
					<PaymentsFilterSidebar
						className="sticky top-0 h-full"
						onPreviewChange={setPreviewMessage}
					/>
				</aside>
				<PaymentsResults
					demoState={demoState}
					onCopyCustomerEmail={(payment) => {
						void copyToClipboard(payment.customer.email, "Customer email");
					}}
					onCopyOrderNumber={(payment) => {
						void copyToClipboard(payment.orderNumber, "Order number");
					}}
					onCopyPaymentId={(payment) => {
						void copyToClipboard(payment.id, "Payment id");
					}}
					onDemoStateChange={setDemoState}
					onPreviewChange={setPreviewMessage}
					onPrint={printPaymentSummary}
					payments={MOCK_PAYMENTS}
				/>
			</div>
		</div>
	);
}
