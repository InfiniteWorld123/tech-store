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
	Pagination,
	Switch,
	Table,
	Tabs,
	TextField,
} from "@heroui/react";
import {
	CheckCircle2,
	ChevronDown,
	Copy,
	Grid3X3,
	LayoutList,
	Mail,
	MailWarning,
	MapPin,
	MoreHorizontal,
	PackageSearch,
	RotateCcw,
	Search,
	ShieldCheck,
	ShoppingBag,
	SlidersHorizontal,
	Star,
	TableProperties,
	Trash2,
	UserCog,
	Users,
	UserX,
} from "lucide-react";
import { type ReactNode, useState } from "react";
import {
	AdminEmptyState,
	AdminPageHeader,
	AdminSectionError,
} from "#/components/admin/sections/admin-page";

type CustomerRole = "customer" | "admin";
type DemoState = "data" | "empty" | "error";
type ChipColor = "accent" | "danger" | "default" | "success" | "warning";

type CustomerMock = {
	id: string;
	name: string;
	email: string;
	emailVerified: boolean;
	image: string | null;
	role: CustomerRole;
	createdAt: string;
	updatedAt: string;
	orderCount: number;
	totalSpent: number;
	reviewCount: number;
	addressCount: number;
};

type SelectOption = {
	id: string;
	label: string;
};

const ROLE_OPTIONS = [
	{ id: "customer", label: "Customer" },
	{ id: "admin", label: "Admin" },
] satisfies SelectOption[];

const EMAIL_VERIFIED_OPTIONS = [
	{ id: "verified", label: "Verified" },
	{ id: "unverified", label: "Unverified" },
] satisfies SelectOption[];

const SEARCH_TYPE_OPTIONS = [
	{ id: "customerName", label: "Name" },
	{ id: "customerEmail", label: "Email" },
	{ id: "customerId", label: "Customer ID" },
] satisfies SelectOption[];

const SORT_OPTIONS = [
	{ id: "created-desc", label: "Newest first" },
	{ id: "created-asc", label: "Oldest first" },
	{ id: "name-asc", label: "Name A-Z" },
	{ id: "name-desc", label: "Name Z-A" },
	{ id: "orders-desc", label: "Most orders" },
	{ id: "spent-desc", label: "Most spent" },
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

const ROLE_META: Record<CustomerRole, { color: ChipColor; label: string }> = {
	customer: { color: "default", label: "Customer" },
	admin: { color: "accent", label: "Admin" },
};

const EMAIL_VERIFIED_META: Record<string, { color: ChipColor; label: string }> =
	{
		true: { color: "success", label: "Verified" },
		false: { color: "warning", label: "Unverified" },
	};

const MOCK_CUSTOMERS: CustomerMock[] = [
	{
		id: "usr_lena_weber",
		name: "Lena Weber",
		email: "lena.weber@example.de",
		emailVerified: true,
		image: null,
		role: "customer",
		createdAt: "2026-01-14T10:23:00.000Z",
		updatedAt: "2026-06-02T09:12:00.000Z",
		orderCount: 5,
		totalSpent: 2034.45,
		reviewCount: 3,
		addressCount: 2,
	},
	{
		id: "usr_matthias_klein",
		name: "Matthias Klein",
		email: "matthias.klein@example.de",
		emailVerified: true,
		image: null,
		role: "admin",
		createdAt: "2025-11-03T08:15:00.000Z",
		updatedAt: "2026-06-01T15:45:00.000Z",
		orderCount: 12,
		totalSpent: 5421.9,
		reviewCount: 8,
		addressCount: 1,
	},
	{
		id: "usr_sophia_bauer",
		name: "Sophia Bauer",
		email: "sophia.bauer@example.de",
		emailVerified: true,
		image: null,
		role: "customer",
		createdAt: "2026-02-20T14:08:00.000Z",
		updatedAt: "2026-05-31T11:05:00.000Z",
		orderCount: 2,
		totalSpent: 889.99,
		reviewCount: 1,
		addressCount: 3,
	},
	{
		id: "usr_emil_schneider",
		name: "Emil Schneider",
		email: "emil.schneider@example.de",
		emailVerified: false,
		image: null,
		role: "customer",
		createdAt: "2026-05-28T19:44:00.000Z",
		updatedAt: "2026-05-28T19:44:00.000Z",
		orderCount: 0,
		totalSpent: 0,
		reviewCount: 0,
		addressCount: 0,
	},
	{
		id: "usr_amina_hoffmann",
		name: "Amina Hoffmann",
		email: "amina.hoffmann@example.de",
		emailVerified: true,
		image: null,
		role: "customer",
		createdAt: "2026-03-07T11:32:00.000Z",
		updatedAt: "2026-05-29T13:49:00.000Z",
		orderCount: 8,
		totalSpent: 3120.0,
		reviewCount: 4,
		addressCount: 2,
	},
	{
		id: "usr_noah_fischer",
		name: "Noah Fischer",
		email: "noah.fischer@example.de",
		emailVerified: false,
		image: null,
		role: "customer",
		createdAt: "2026-04-15T09:00:00.000Z",
		updatedAt: "2026-05-27T10:24:00.000Z",
		orderCount: 1,
		totalSpent: 340.0,
		reviewCount: 0,
		addressCount: 1,
	},
	{
		id: "usr_mila_wagner",
		name: "Mila Wagner",
		email: "mila.wagner@example.de",
		emailVerified: true,
		image: null,
		role: "admin",
		createdAt: "2025-09-22T07:30:00.000Z",
		updatedAt: "2026-05-26T16:34:00.000Z",
		orderCount: 15,
		totalSpent: 6780.35,
		reviewCount: 10,
		addressCount: 2,
	},
	{
		id: "usr_jonas_becker",
		name: "Jonas Becker",
		email: "jonas.becker@example.de",
		emailVerified: false,
		image: null,
		role: "customer",
		createdAt: "2026-05-12T16:55:00.000Z",
		updatedAt: "2026-05-24T12:15:00.000Z",
		orderCount: 3,
		totalSpent: 1240.2,
		reviewCount: 2,
		addressCount: 0,
	},
];

function formatDate(value: string) {
	return new Intl.DateTimeFormat("en-GB", {
		day: "2-digit",
		month: "short",
		year: "numeric",
	}).format(new Date(value));
}

function formatCurrency(value: number) {
	return new Intl.NumberFormat("de-DE", {
		currency: "EUR",
		style: "currency",
	}).format(value);
}

function getCustomerInitials(name: string) {
	return name
		.split(" ")
		.map((part) => part[0])
		.join("")
		.slice(0, 2)
		.toUpperCase();
}

function CustomerRoleChip({ role }: { role: CustomerRole }) {
	const meta = ROLE_META[role];

	return (
		<Chip color={meta.color} size="sm" variant="soft">
			{meta.label}
		</Chip>
	);
}

function EmailVerifiedChip({ verified }: { verified: boolean }) {
	const meta = EMAIL_VERIFIED_META[String(verified)];

	return (
		<Chip color={meta.color} size="sm" variant="soft">
			{meta.label}
		</Chip>
	);
}

function CustomerStatCards({ customers }: { customers: CustomerMock[] }) {
	const verifiedCustomers = customers.filter((c) => c.emailVerified);
	const unverifiedCustomers = customers.filter((c) => !c.emailVerified);
	const adminCustomers = customers.filter((c) => c.role === "admin");
	const customersWithOrders = customers.filter((c) => c.orderCount > 0);
	const customersWithoutOrders = customers.filter((c) => c.orderCount === 0);
	const customersWithReviews = customers.filter((c) => c.reviewCount > 0);
	const customersWithAddresses = customers.filter((c) => c.addressCount > 0);

	const cards = [
		{
			label: "Total Customers",
			value: customers.length.toLocaleString(),
			Icon: Users,
			colorClass: "text-accent",
			bgClass: "bg-accent/10",
		},
		{
			label: "Verified",
			value: verifiedCustomers.length.toLocaleString(),
			Icon: CheckCircle2,
			colorClass: "text-success",
			bgClass: "bg-success/10",
		},
		{
			label: "Unverified",
			value: unverifiedCustomers.length.toLocaleString(),
			Icon: MailWarning,
			colorClass: "text-warning",
			bgClass: "bg-warning/10",
		},
		{
			label: "Admins",
			value: adminCustomers.length.toLocaleString(),
			Icon: ShieldCheck,
			colorClass: "text-accent",
			bgClass: "bg-accent/10",
		},
		{
			label: "With Orders",
			value: customersWithOrders.length.toLocaleString(),
			Icon: ShoppingBag,
			colorClass: "text-success",
			bgClass: "bg-success/10",
		},
		{
			label: "Without Orders",
			value: customersWithoutOrders.length.toLocaleString(),
			Icon: UserX,
			colorClass: "text-muted",
			bgClass: "bg-default",
		},
		{
			label: "With Reviews",
			value: customersWithReviews.length.toLocaleString(),
			Icon: Star,
			colorClass: "text-accent",
			bgClass: "bg-accent/10",
		},
		{
			label: "With Addresses",
			value: customersWithAddresses.length.toLocaleString(),
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

function CustomersFilterSidebar({
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
					onPreviewChange("Customer filters reset");
				}}
				onSubmit={(event) => {
					event.preventDefault();
					onPreviewChange("Customer filter preview applied");
				}}
			>
				<Card.Content className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4">
					<div className="flex flex-col gap-5">
						<FilterGroup title="Role">
							<CheckboxOptionGroup
								ariaLabel="Customer roles"
								name="roles"
								options={ROLE_OPTIONS}
							/>
						</FilterGroup>

						<FilterGroup title="Email Verified">
							<CheckboxOptionGroup
								ariaLabel="Email verification status"
								name="emailVerified"
								options={EMAIL_VERIFIED_OPTIONS}
							/>
						</FilterGroup>

						<FilterGroup title="Flags">
							<div className="flex flex-col gap-3">
								<FilterSwitch label="Has orders" name="hasOrders" />
								<FilterSwitch label="Has reviews" name="hasReviews" />
								<FilterSwitch label="Has addresses" name="hasAddresses" />
							</div>
						</FilterGroup>

						<FilterGroup title="Joined Date">
							<DateRangeFields maxName="joinedBefore" minName="joinedAfter" />
						</FilterGroup>

						<FilterGroup title="Updated Date">
							<DateRangeFields
								maxName="updatedBefore"
								minName="updatedAfter"
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

function CustomerMetric({
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

function CustomerIdentityCell({ customer }: { customer: CustomerMock }) {
	return (
		<div className="flex min-w-0 items-center gap-3">
			<div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-xs font-semibold text-accent">
				{getCustomerInitials(customer.name)}
			</div>
			<div className="min-w-0">
				<p className="truncate text-sm font-medium text-foreground">
					{customer.name}
				</p>
				<p className="mt-0.5 truncate text-xs text-muted">{customer.email}</p>
			</div>
		</div>
	);
}

function DeleteCustomerModal({
	customer,
	isOpen,
	onClose,
	onConfirm,
}: {
	customer: CustomerMock | null;
	isOpen: boolean;
	onClose: () => void;
	onConfirm: (customer: CustomerMock) => void;
}) {
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
							<Modal.Icon className="bg-danger/10 text-danger">
								<Trash2 size={20} />
							</Modal.Icon>
							<Modal.Heading>Delete Customer</Modal.Heading>
						</Modal.Header>

						<Modal.Body>
							<p className="text-sm text-muted">
								Permanently delete{" "}
								<span className="font-medium text-foreground">
									{customer?.name ?? "this customer"}
								</span>
								? This action cannot be undone.
							</p>
						</Modal.Body>

						<Modal.Footer className="flex justify-end gap-2">
							<Button variant="ghost" onPress={onClose}>
								Cancel
							</Button>
							<Button
								variant="primary"
								onPress={() => {
									if (customer) onConfirm(customer);
								}}
							>
								Delete
							</Button>
						</Modal.Footer>
					</Modal.Dialog>
				</Modal.Container>
			</Modal.Backdrop>
		</Modal>
	);
}

function CustomerActions({
	customer,
	onCopyEmail,
	onCopyId,
	onDelete,
	onRoleChange,
}: {
	customer: CustomerMock;
	onCopyEmail: (customer: CustomerMock) => void;
	onCopyId: (customer: CustomerMock) => void;
	onDelete: (customer: CustomerMock) => void;
	onRoleChange: (customer: CustomerMock) => void;
}) {
	return (
		<Dropdown>
			<Button
				aria-label="Customer actions"
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
						size="sm"
						variant="ghost"
						onPress={() => onCopyId(customer)}
					>
						<Copy size={14} />
						Copy customer ID
					</Button>
					<Button
						className="justify-start"
						size="sm"
						variant="ghost"
						onPress={() => onCopyEmail(customer)}
					>
						<Mail size={14} />
						Copy email
					</Button>
					<Button
						className="justify-start"
						size="sm"
						variant="ghost"
						onPress={() => onRoleChange(customer)}
					>
						<UserCog size={14} />
						Change role
					</Button>
					<Button
						className="justify-start text-danger"
						size="sm"
						variant="ghost"
						onPress={() => onDelete(customer)}
					>
						<Trash2 size={14} />
						Delete customer
					</Button>
				</div>
			</Dropdown.Popover>
		</Dropdown>
	);
}

function CustomerTableView({
	customers,
	onCopyEmail,
	onCopyId,
	onDelete,
	onRoleChange,
}: {
	customers: CustomerMock[];
	onCopyEmail: (customer: CustomerMock) => void;
	onCopyId: (customer: CustomerMock) => void;
	onDelete: (customer: CustomerMock) => void;
	onRoleChange: (customer: CustomerMock) => void;
}) {
	return (
		<Table>
			<Table.ScrollContainer>
				<Table.Content aria-label="Customers" className="min-w-[1040px]">
					<Table.Header>
						<Table.Column isRowHeader className="w-[260px]">
							Customer
						</Table.Column>
						<Table.Column>Email Verified</Table.Column>
						<Table.Column>Role</Table.Column>
						<Table.Column>Orders</Table.Column>
						<Table.Column>Total Spent</Table.Column>
						<Table.Column>Joined</Table.Column>
						<Table.Column className="w-12">Actions</Table.Column>
					</Table.Header>
					<Table.Body>
						{customers.map((customer) => (
							<Table.Row key={customer.id}>
								<Table.Cell>
									<CustomerIdentityCell customer={customer} />
								</Table.Cell>
								<Table.Cell>
									<EmailVerifiedChip verified={customer.emailVerified} />
								</Table.Cell>
								<Table.Cell>
									<CustomerRoleChip role={customer.role} />
								</Table.Cell>
								<Table.Cell>
									<span className="text-sm text-foreground">
										{customer.orderCount}
									</span>
								</Table.Cell>
								<Table.Cell>
									<span className="text-sm font-medium text-foreground">
										{formatCurrency(customer.totalSpent)}
									</span>
								</Table.Cell>
								<Table.Cell>
									<span className="text-sm text-muted">
										{formatDate(customer.createdAt)}
									</span>
								</Table.Cell>
								<Table.Cell>
									<CustomerActions
										customer={customer}
										onCopyEmail={onCopyEmail}
										onCopyId={onCopyId}
										onDelete={onDelete}
										onRoleChange={onRoleChange}
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

function CustomerListView({
	customers,
	onCopyEmail,
	onCopyId,
	onDelete,
	onRoleChange,
}: {
	customers: CustomerMock[];
	onCopyEmail: (customer: CustomerMock) => void;
	onCopyId: (customer: CustomerMock) => void;
	onDelete: (customer: CustomerMock) => void;
	onRoleChange: (customer: CustomerMock) => void;
}) {
	return (
		<div className="flex flex-col gap-3">
			{customers.map((customer) => (
				<Card key={customer.id}>
					<Card.Content className="p-4">
						<div className="flex flex-col gap-4 xl:flex-row xl:items-center">
							<div className="flex min-w-0 flex-1 items-start justify-between gap-3">
								<div className="min-w-0">
									<CustomerIdentityCell customer={customer} />
								</div>
								<div className="xl:hidden">
									<CustomerActions
										customer={customer}
										onCopyEmail={onCopyEmail}
										onCopyId={onCopyId}
										onDelete={onDelete}
										onRoleChange={onRoleChange}
									/>
								</div>
							</div>

							<div className="grid min-w-0 grid-cols-2 gap-4 sm:grid-cols-4 xl:w-[560px]">
								<CustomerMetric label="Role">
									<CustomerRoleChip role={customer.role} />
								</CustomerMetric>
								<CustomerMetric label="Email">
									<EmailVerifiedChip verified={customer.emailVerified} />
								</CustomerMetric>
								<CustomerMetric label="Orders">
									<span>{customer.orderCount}</span>
								</CustomerMetric>
								<CustomerMetric label="Total Spent">
									<span className="font-medium">
										{formatCurrency(customer.totalSpent)}
									</span>
								</CustomerMetric>
							</div>

							<div className="flex min-w-0 items-start justify-between gap-3 xl:w-[200px]">
								<div className="min-w-0">
									<p className="text-[11px] font-medium uppercase text-muted">
										Joined
									</p>
									<p className="mt-1 text-sm text-foreground">
										{formatDate(customer.createdAt)}
									</p>
								</div>
								<div className="hidden xl:block">
									<CustomerActions
										customer={customer}
										onCopyEmail={onCopyEmail}
										onCopyId={onCopyId}
										onDelete={onDelete}
										onRoleChange={onRoleChange}
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

function CustomerCardGrid({
	customers,
	onCopyEmail,
	onCopyId,
	onDelete,
	onRoleChange,
}: {
	customers: CustomerMock[];
	onCopyEmail: (customer: CustomerMock) => void;
	onCopyId: (customer: CustomerMock) => void;
	onDelete: (customer: CustomerMock) => void;
	onRoleChange: (customer: CustomerMock) => void;
}) {
	return (
		<div className="grid grid-cols-1 gap-4 xl:grid-cols-2 2xl:grid-cols-3">
			{customers.map((customer) => (
				<Card key={customer.id} className="min-h-[286px]">
					<Card.Header className="flex-row items-start justify-between gap-3 p-4">
						<div className="min-w-0">
							<CustomerIdentityCell customer={customer} />
						</div>
						<CustomerActions
							customer={customer}
							onCopyEmail={onCopyEmail}
							onCopyId={onCopyId}
							onDelete={onDelete}
							onRoleChange={onRoleChange}
						/>
					</Card.Header>

					<Card.Content className="flex flex-1 flex-col gap-4 px-4 pb-4 pt-0">
						<div className="flex flex-wrap gap-1">
							<CustomerRoleChip role={customer.role} />
							<EmailVerifiedChip verified={customer.emailVerified} />
						</div>

						<div className="grid grid-cols-2 gap-4">
							<CustomerMetric label="Orders">
								<span>{customer.orderCount}</span>
							</CustomerMetric>
							<CustomerMetric label="Total Spent">
								<span className="font-medium">
									{formatCurrency(customer.totalSpent)}
								</span>
							</CustomerMetric>
							<CustomerMetric label="Reviews">
								<span>{customer.reviewCount}</span>
							</CustomerMetric>
							<CustomerMetric label="Addresses">
								<span>{customer.addressCount}</span>
							</CustomerMetric>
						</div>
					</Card.Content>

					<Card.Footer className="mt-auto justify-between border-t border-border px-4 py-3">
						<span className="truncate text-xs text-muted">{customer.id}</span>
						<span className="shrink-0 text-xs text-muted">
							Joined {formatDate(customer.createdAt)}
						</span>
					</Card.Footer>
				</Card>
			))}
		</div>
	);
}

function CustomersToolbar({
	demoState,
	onDemoStateChange,
	onPreviewChange,
}: {
	demoState: DemoState;
	onDemoStateChange: (state: DemoState) => void;
	onPreviewChange: (message: string) => void;
}) {
	const [searchType, setSearchType] = useState("customerName");
	const [sort, setSort] = useState("created-desc");

	return (
		<div className="shrink-0 rounded-2xl border border-border bg-surface p-2 shadow-sm">
			<div className="flex flex-col gap-2 xl:flex-row xl:items-center">
				<div className="flex min-w-0 flex-1 flex-col gap-2 md:flex-row">
					<form
						className="min-w-0 flex-1"
						onSubmit={(event) => {
							event.preventDefault();
							onPreviewChange("Customer search preview submitted");
						}}
					>
						<TextField className="min-w-0" name="search">
							<InputGroup fullWidth variant="primary">
								<InputGroup.Prefix>
									<Search size={14} className="text-muted" />
								</InputGroup.Prefix>
								<InputGroup.Input
									aria-label="Search customers"
									placeholder="Search customers"
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
							onPreviewChange("Customer search type preview changed");
						}}
					/>

					<MockSelect
						ariaLabel="Sort customers"
						className="w-full md:w-44"
						options={SORT_OPTIONS}
						placeholder="Sort"
						selectedKey={sort}
						onSelect={(key) => {
							setSort(key);
							onPreviewChange("Customer sort preview changed");
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
							aria-label="Customer views"
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

function CustomersPagination({
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
					customers
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

function CustomersResults({
	customers,
	demoState,
	onCopyEmail,
	onCopyId,
	onDelete,
	onDemoStateChange,
	onPreviewChange,
	onRoleChange,
}: {
	customers: CustomerMock[];
	demoState: DemoState;
	onCopyEmail: (customer: CustomerMock) => void;
	onCopyId: (customer: CustomerMock) => void;
	onDelete: (customer: CustomerMock) => void;
	onDemoStateChange: (state: DemoState) => void;
	onPreviewChange: (message: string) => void;
	onRoleChange: (customer: CustomerMock) => void;
}) {
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(10);
	const totalPages = Math.max(Math.ceil(customers.length / limit), 1);
	const safePage = Math.min(page, totalPages);
	const paginatedCustomers = customers.slice(
		(safePage - 1) * limit,
		safePage * limit,
	);

	return (
		<Tabs
			defaultSelectedKey="table"
			className="flex min-w-0 flex-col gap-3 lg:h-[calc(100vh-8rem)] lg:min-h-[520px] lg:min-h-0"
		>
			<CustomersToolbar
				demoState={demoState}
				onDemoStateChange={onDemoStateChange}
				onPreviewChange={onPreviewChange}
			/>

			{demoState === "error" ? (
				<div className="min-h-0 min-w-0 flex-1 overflow-auto">
					<AdminSectionError
						actionLabel="Show data"
						message="This is a local UI preview of the error state."
						title="Customers failed to load"
						onAction={() => onDemoStateChange("data")}
					/>
				</div>
			) : demoState === "empty" || customers.length === 0 ? (
				<div className="min-h-0 min-w-0 flex-1 overflow-auto">
					<AdminEmptyState
						icon={PackageSearch}
						message="No mock customers match the current preview state."
						title="No customers found"
					/>
				</div>
			) : (
				<>
					<Tabs.Panel
						id="table"
						className="min-h-0 min-w-0 flex-1 overflow-auto"
					>
						<CustomerTableView
							customers={paginatedCustomers}
							onCopyEmail={onCopyEmail}
							onCopyId={onCopyId}
							onDelete={onDelete}
							onRoleChange={onRoleChange}
						/>
					</Tabs.Panel>
					<Tabs.Panel
						id="list"
						className="min-h-0 min-w-0 flex-1 overflow-auto"
					>
						<CustomerListView
							customers={paginatedCustomers}
							onCopyEmail={onCopyEmail}
							onCopyId={onCopyId}
							onDelete={onDelete}
							onRoleChange={onRoleChange}
						/>
					</Tabs.Panel>
					<Tabs.Panel
						id="cards"
						className="min-h-0 min-w-0 flex-1 overflow-auto"
					>
						<CustomerCardGrid
							customers={paginatedCustomers}
							onCopyEmail={onCopyEmail}
							onCopyId={onCopyId}
							onDelete={onDelete}
							onRoleChange={onRoleChange}
						/>
					</Tabs.Panel>
				</>
			)}

			<CustomersPagination
				limit={limit}
				page={safePage}
				total={customers.length}
				onPageChange={(nextPage) => {
					setPage(nextPage);
					onPreviewChange("Customer page preview changed");
				}}
				onPageSizeChange={(nextLimit) => {
					setLimit(nextLimit);
					setPage(1);
					onPreviewChange("Customer page size preview changed");
				}}
			/>
		</Tabs>
	);
}

export function CustomersPage() {
	const [demoState, setDemoState] = useState<DemoState>("data");
	const [previewMessage, setPreviewMessage] = useState(
		"UI preview uses local mock customers",
	);
	const [deleteCustomer, setDeleteCustomer] = useState<CustomerMock | null>(
		null,
	);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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

	function openDeleteModal(customer: CustomerMock) {
		setDeleteCustomer(customer);
		setIsDeleteModalOpen(true);
	}

	function closeDeleteModal() {
		setIsDeleteModalOpen(false);
		setDeleteCustomer(null);
	}

	function handleDeleteConfirm(customer: CustomerMock) {
		setPreviewMessage(`Delete requested for ${customer.name}`);
		closeDeleteModal();
	}

	function handleRoleChange(customer: CustomerMock) {
		const nextRole = customer.role === "customer" ? "admin" : "customer";
		setPreviewMessage(`Role change requested: ${customer.name} → ${nextRole}`);
	}

	return (
		<div className="flex flex-col gap-6">
			<AdminPageHeader
				title="Customers"
				description="Manage registered customers, roles, and account status"
			/>

			<CustomerStatCards customers={MOCK_CUSTOMERS} />

			<Card className="border-accent/20 bg-accent/5 px-4 py-3">
				<Card.Content className="flex flex-col gap-2 p-0 sm:flex-row sm:items-center sm:justify-between">
					<div className="flex min-w-0 items-start gap-3">
						<Users size={18} className="mt-0.5 shrink-0 text-accent" />
						<div className="min-w-0">
							<p className="text-sm font-medium text-foreground">
								{previewMessage}
							</p>
							<p className="mt-1 text-xs text-muted">
								No customer APIs are connected on this page.
							</p>
						</div>
					</div>
					<Button
						className="shrink-0"
						size="sm"
						variant="secondary"
						onPress={() =>
							setPreviewMessage("UI preview uses local mock customers")
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
							<CustomersFilterSidebar onPreviewChange={setPreviewMessage} />
						</Disclosure.Body>
					</Disclosure.Content>
				</Disclosure>
			</div>

			<div className="grid min-w-0 items-start gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
				<aside className="hidden lg:h-[calc(100vh-8rem)] lg:min-h-[520px] lg:block">
					<CustomersFilterSidebar
						className="sticky top-0 h-full"
						onPreviewChange={setPreviewMessage}
					/>
				</aside>
				<CustomersResults
					customers={MOCK_CUSTOMERS}
					demoState={demoState}
					onCopyEmail={(customer) => {
						void copyToClipboard(customer.email, "Customer email");
					}}
					onCopyId={(customer) => {
						void copyToClipboard(customer.id, "Customer ID");
					}}
					onDelete={openDeleteModal}
					onDemoStateChange={setDemoState}
					onPreviewChange={setPreviewMessage}
					onRoleChange={handleRoleChange}
				/>
			</div>

			<DeleteCustomerModal
				customer={deleteCustomer}
				isOpen={isDeleteModalOpen}
				onClose={closeDeleteModal}
				onConfirm={handleDeleteConfirm}
			/>
		</div>
	);
}
