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
	CalendarDays,
	ChevronDown,
	Copy,
	Grid3X3,
	LayoutList,
	Mail,
	MessageSquare,
	PackageSearch,
	RotateCcw,
	Search,
	SlidersHorizontal,
	Star,
	TableProperties,
	Trash2,
} from "lucide-react";
import { type ReactNode, useState } from "react";
import {
	AdminEmptyState,
	AdminSectionError,
} from "#/components/admin/sections/admin-page";

type DemoState = "data" | "empty" | "error";

type ReviewMock = {
	id: string;
	userId: string;
	productId: string;
	rating: number;
	title: string;
	comment: string;
	createdAt: string;
	updatedAt: string;
	customer: {
		id: string;
		name: string;
		email: string;
	};
	product: {
		id: string;
		name: string;
	};
};

type SelectOption = {
	id: string;
	label: string;
};

const RATING_OPTIONS = [
	{ id: "5", label: "5 Stars" },
	{ id: "4", label: "4 Stars" },
	{ id: "3", label: "3 Stars" },
	{ id: "2", label: "2 Stars" },
	{ id: "1", label: "1 Star" },
] satisfies SelectOption[];

const SEARCH_TYPE_OPTIONS = [
	{ id: "title", label: "Title" },
	{ id: "comment", label: "Comment" },
	{ id: "customerName", label: "Customer" },
	{ id: "customerEmail", label: "Email" },
	{ id: "productName", label: "Product" },
] satisfies SelectOption[];

const SORT_OPTIONS = [
	{ id: "created-desc", label: "Newest first" },
	{ id: "created-asc", label: "Oldest first" },
	{ id: "rating-desc", label: "Rating high-low" },
	{ id: "rating-asc", label: "Rating low-high" },
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

const MOCK_REVIEWS: ReviewMock[] = [
	{
		id: "rev_01jz_r001",
		userId: "usr_lena_weber",
		productId: "prod_wireless_keyboard",
		rating: 5,
		title: "Best keyboard I've ever owned",
		comment:
			"Incredibly responsive keys and the battery life is outstanding. Highly recommend to anyone looking for a premium typing experience.",
		createdAt: "2026-06-02T10:14:00.000Z",
		updatedAt: "2026-06-02T10:14:00.000Z",
		customer: { id: "usr_lena_weber", name: "Lena Weber", email: "lena.weber@example.de" },
		product: { id: "prod_wireless_keyboard", name: "Wireless Keyboard" },
	},
	{
		id: "rev_01jz_r002",
		userId: "usr_matthias_klein",
		productId: "prod_4k_monitor",
		rating: 4,
		title: "Great picture quality, minor issues",
		comment:
			"The colors are vibrant and the 4K resolution is stunning. Only drawback is the stand wobbles slightly when typing nearby.",
		createdAt: "2026-06-01T14:22:00.000Z",
		updatedAt: "2026-06-01T14:22:00.000Z",
		customer: { id: "usr_matthias_klein", name: "Matthias Klein", email: "matthias.klein@example.de" },
		product: { id: "prod_4k_monitor", name: "4K Monitor" },
	},
	{
		id: "rev_01jz_r003",
		userId: "usr_sophia_bauer",
		productId: "prod_usb_c_hub",
		rating: 2,
		title: "Disappointed with build quality",
		comment:
			"The hub gets hot very quickly and one of the USB ports stopped working after two weeks. Expected better for the price.",
		createdAt: "2026-05-30T09:05:00.000Z",
		updatedAt: "2026-05-31T11:30:00.000Z",
		customer: { id: "usr_sophia_bauer", name: "Sophia Bauer", email: "sophia.bauer@example.de" },
		product: { id: "prod_usb_c_hub", name: "USB-C Hub" },
	},
	{
		id: "rev_01jz_r004",
		userId: "usr_emil_schneider",
		productId: "prod_noise_cancelling_headphones",
		rating: 5,
		title: "Absolute silence — perfect for work",
		comment:
			"These headphones block out every distraction. Call quality is crystal clear and they're comfortable enough to wear all day.",
		createdAt: "2026-05-28T16:40:00.000Z",
		updatedAt: "2026-05-28T16:40:00.000Z",
		customer: { id: "usr_emil_schneider", name: "Emil Schneider", email: "emil.schneider@example.de" },
		product: { id: "prod_noise_cancelling_headphones", name: "Noise-Cancelling Headphones" },
	},
	{
		id: "rev_01jz_r005",
		userId: "usr_amina_hoffmann",
		productId: "prod_ergonomic_chair",
		rating: 3,
		title: "Decent chair, assembly was tricky",
		comment:
			"Comfortable once assembled, but the instructions were confusing and two screws were missing from the box.",
		createdAt: "2026-05-25T11:18:00.000Z",
		updatedAt: "2026-05-26T08:00:00.000Z",
		customer: { id: "usr_amina_hoffmann", name: "Amina Hoffmann", email: "amina.hoffmann@example.de" },
		product: { id: "prod_ergonomic_chair", name: "Ergonomic Chair" },
	},
	{
		id: "rev_01jz_r006",
		userId: "usr_noah_fischer",
		productId: "prod_mechanical_keyboard",
		rating: 5,
		title: "Satisfying tactile feedback",
		comment:
			"The blue switches feel amazing and the RGB lighting is fully customizable. Build quality feels premium and solid.",
		createdAt: "2026-05-22T13:55:00.000Z",
		updatedAt: "2026-05-22T13:55:00.000Z",
		customer: { id: "usr_noah_fischer", name: "Noah Fischer", email: "noah.fischer@example.de" },
		product: { id: "prod_mechanical_keyboard", name: "Mechanical Keyboard" },
	},
	{
		id: "rev_01jz_r007",
		userId: "usr_mila_wagner",
		productId: "prod_webcam_4k",
		rating: 1,
		title: "Does not work with my setup",
		comment:
			"The webcam failed to be detected on my laptop. Tried multiple drivers, contacted support — still unresolved after a week.",
		createdAt: "2026-05-18T08:30:00.000Z",
		updatedAt: "2026-05-20T10:12:00.000Z",
		customer: { id: "usr_mila_wagner", name: "Mila Wagner", email: "mila.wagner@example.de" },
		product: { id: "prod_webcam_4k", name: "4K Webcam" },
	},
	{
		id: "rev_01jz_r008",
		userId: "usr_jonas_becker",
		productId: "prod_portable_ssd",
		rating: 4,
		title: "Fast and compact",
		comment:
			"Transfer speeds are excellent and the small form factor makes it great for travel. Wish the cable was slightly longer.",
		createdAt: "2026-05-14T17:02:00.000Z",
		updatedAt: "2026-05-14T17:02:00.000Z",
		customer: { id: "usr_jonas_becker", name: "Jonas Becker", email: "jonas.becker@example.de" },
		product: { id: "prod_portable_ssd", name: "Portable SSD" },
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

function RatingStars({ rating }: { rating: number }) {
	const full = Math.round(rating);
	return (
		<div className="flex items-center gap-1">
			<div className="flex items-center">
				{Array.from({ length: 5 }, (_, i) => (
					<Star
						key={i}
						size={13}
						className={i < full ? "text-warning" : "text-muted"}
						fill={i < full ? "currentColor" : "none"}
					/>
				))}
			</div>
			<span className="text-xs text-muted">{rating.toFixed(1)}</span>
		</div>
	);
}

function ReviewMetric({
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

function CustomerCell({ review }: { review: ReviewMock }) {
	return (
		<div className="flex min-w-0 items-center gap-3">
			<div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-xs font-semibold text-accent">
				{getCustomerInitials(review.customer.name)}
			</div>
			<div className="min-w-0">
				<p className="truncate text-sm font-medium text-foreground">
					{review.customer.name}
				</p>
				<p className="mt-0.5 truncate text-xs text-muted">
					{review.customer.email}
				</p>
			</div>
		</div>
	);
}

function ReviewIdentity({ review }: { review: ReviewMock }) {
	return (
		<div className="flex min-w-0 flex-col">
			<p className="truncate text-sm font-medium text-foreground">
				{review.title}
			</p>
			<p className="mt-0.5 truncate text-xs text-muted">{review.comment}</p>
		</div>
	);
}

function ReviewStatCards({ reviews }: { reviews: ReviewMock[] }) {
	const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
	const avgRating = reviews.length === 0 ? 0 : totalRating / reviews.length;
	const count5 = reviews.filter((r) => Math.round(r.rating) === 5).length;
	const count4 = reviews.filter((r) => Math.round(r.rating) === 4).length;
	const count3 = reviews.filter((r) => Math.round(r.rating) === 3).length;
	const count2 = reviews.filter((r) => Math.round(r.rating) === 2).length;
	const count1 = reviews.filter((r) => Math.round(r.rating) === 1).length;
	const thisMonth = reviews.filter((r) => {
		const d = new Date(r.createdAt);
		return d.getFullYear() === 2026 && d.getMonth() === 5;
	}).length;

	const cards = [
		{
			label: "Total Reviews",
			value: reviews.length.toLocaleString(),
			Icon: MessageSquare,
			colorClass: "text-accent",
			bgClass: "bg-accent/10",
		},
		{
			label: "Avg Rating",
			value: `${avgRating.toFixed(1)} / 5`,
			Icon: Star,
			colorClass: "text-warning",
			bgClass: "bg-warning/10",
		},
		{
			label: "5 Stars",
			value: count5.toLocaleString(),
			Icon: Star,
			colorClass: "text-success",
			bgClass: "bg-success/10",
		},
		{
			label: "4 Stars",
			value: count4.toLocaleString(),
			Icon: Star,
			colorClass: "text-accent",
			bgClass: "bg-accent/10",
		},
		{
			label: "3 Stars",
			value: count3.toLocaleString(),
			Icon: Star,
			colorClass: "text-warning",
			bgClass: "bg-warning/10",
		},
		{
			label: "2 Stars",
			value: count2.toLocaleString(),
			Icon: Star,
			colorClass: "text-warning",
			bgClass: "bg-warning/10",
		},
		{
			label: "1 Star",
			value: count1.toLocaleString(),
			Icon: Star,
			colorClass: "text-danger",
			bgClass: "bg-danger/10",
		},
		{
			label: "This Month",
			value: thisMonth.toLocaleString(),
			Icon: CalendarDays,
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

function ReviewsFilterSidebar({
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
					onPreviewChange("Review filters reset");
				}}
				onSubmit={(event) => {
					event.preventDefault();
					onPreviewChange("Review filter preview applied");
				}}
			>
				<Card.Content className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4">
					<div className="flex flex-col gap-5">
						<FilterGroup title="Rating">
							<CheckboxOptionGroup
								ariaLabel="Ratings"
								name="ratings"
								options={RATING_OPTIONS}
							/>
						</FilterGroup>

						<FilterGroup title="Flags">
							<div className="flex flex-col gap-3">
								<FilterSwitch label="Has title" name="hasTitle" />
								<FilterSwitch label="Verified purchase" name="verifiedPurchase" />
							</div>
						</FilterGroup>

						<FilterGroup title="Rating Range">
							<div className="grid grid-cols-2 gap-2">
								<NumberField
									minValue={1}
									maxValue={5}
									name="minRating"
									step={1}
									variant="secondary"
								>
									<Label className="text-xs text-muted">Min</Label>
									<NumberField.Group>
										<NumberField.Input className="w-full min-w-0" />
									</NumberField.Group>
								</NumberField>
								<NumberField
									minValue={1}
									maxValue={5}
									name="maxRating"
									step={1}
									variant="secondary"
								>
									<Label className="text-xs text-muted">Max</Label>
									<NumberField.Group>
										<NumberField.Input className="w-full min-w-0" />
									</NumberField.Group>
								</NumberField>
							</div>
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

function ReviewsToolbar({
	demoState,
	onDemoStateChange,
	onPreviewChange,
}: {
	demoState: DemoState;
	onDemoStateChange: (state: DemoState) => void;
	onPreviewChange: (message: string) => void;
}) {
	const [searchType, setSearchType] = useState("title");
	const [sort, setSort] = useState("created-desc");

	return (
		<div className="shrink-0 rounded-2xl border border-border bg-surface p-2 shadow-sm">
			<div className="flex flex-col gap-2 xl:flex-row xl:items-center">
				<div className="flex min-w-0 flex-1 flex-col gap-2 md:flex-row">
					<form
						className="min-w-0 flex-1"
						onSubmit={(event) => {
							event.preventDefault();
							onPreviewChange("Review search preview submitted");
						}}
					>
						<TextField className="min-w-0" name="search">
							<InputGroup fullWidth variant="primary">
								<InputGroup.Prefix>
									<Search size={14} className="text-muted" />
								</InputGroup.Prefix>
								<InputGroup.Input
									aria-label="Search reviews"
									placeholder="Search reviews"
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
							onPreviewChange("Review search type preview changed");
						}}
					/>

					<MockSelect
						ariaLabel="Sort reviews"
						className="w-full md:w-44"
						options={SORT_OPTIONS}
						placeholder="Sort"
						selectedKey={sort}
						onSelect={(key) => {
							setSort(key);
							onPreviewChange("Review sort preview changed");
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
							aria-label="Review views"
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

function ReviewActions({
	onCopyCustomerEmail,
	onCopyReviewId,
	onDelete,
	review,
}: {
	onCopyCustomerEmail: (review: ReviewMock) => void;
	onCopyReviewId: (review: ReviewMock) => void;
	onDelete: (review: ReviewMock) => void;
	review: ReviewMock;
}) {
	return (
		<Dropdown>
			<Button aria-label="Review actions" isIconOnly size="sm" variant="ghost">
				<span className="text-muted">···</span>
			</Button>
			<Dropdown.Popover className="min-w-48">
				<div className="flex flex-col gap-1 p-1">
					<Button
						className="justify-start"
						size="sm"
						variant="ghost"
						onPress={() => onCopyReviewId(review)}
					>
						<Copy size={14} />
						Copy review ID
					</Button>
					<Button
						className="justify-start"
						size="sm"
						variant="ghost"
						onPress={() => onCopyCustomerEmail(review)}
					>
						<Mail size={14} />
						Copy customer email
					</Button>
					<Button
						className="justify-start text-danger"
						size="sm"
						variant="ghost"
						onPress={() => onDelete(review)}
					>
						<Trash2 size={14} />
						Delete review
					</Button>
				</div>
			</Dropdown.Popover>
		</Dropdown>
	);
}

function ReviewTableView({
	onCopyCustomerEmail,
	onCopyReviewId,
	onDelete,
	reviews,
}: {
	onCopyCustomerEmail: (review: ReviewMock) => void;
	onCopyReviewId: (review: ReviewMock) => void;
	onDelete: (review: ReviewMock) => void;
	reviews: ReviewMock[];
}) {
	return (
		<Table>
			<Table.ScrollContainer>
				<Table.Content aria-label="Reviews" className="min-w-[1080px]">
					<Table.Header>
						<Table.Column isRowHeader className="w-[280px]">
							Review
						</Table.Column>
						<Table.Column className="w-[220px]">Customer</Table.Column>
						<Table.Column>Product</Table.Column>
						<Table.Column>Rating</Table.Column>
						<Table.Column>Created</Table.Column>
						<Table.Column className="w-12">Actions</Table.Column>
					</Table.Header>
					<Table.Body>
						{reviews.map((review) => (
							<Table.Row key={review.id}>
								<Table.Cell>
									<ReviewIdentity review={review} />
								</Table.Cell>
								<Table.Cell>
									<CustomerCell review={review} />
								</Table.Cell>
								<Table.Cell>
									<span className="text-sm text-foreground">
										{review.product.name}
									</span>
								</Table.Cell>
								<Table.Cell>
									<RatingStars rating={review.rating} />
								</Table.Cell>
								<Table.Cell>
									<span className="text-sm text-muted">
										{formatDate(review.createdAt)}
									</span>
								</Table.Cell>
								<Table.Cell>
									<ReviewActions
										onCopyCustomerEmail={onCopyCustomerEmail}
										onCopyReviewId={onCopyReviewId}
										onDelete={onDelete}
										review={review}
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

function ReviewListView({
	onCopyCustomerEmail,
	onCopyReviewId,
	onDelete,
	reviews,
}: {
	onCopyCustomerEmail: (review: ReviewMock) => void;
	onCopyReviewId: (review: ReviewMock) => void;
	onDelete: (review: ReviewMock) => void;
	reviews: ReviewMock[];
}) {
	return (
		<div className="flex flex-col gap-3">
			{reviews.map((review) => (
				<Card key={review.id}>
					<Card.Content className="p-4">
						<div className="flex flex-col gap-4 xl:flex-row xl:items-center">
							<div className="flex min-w-0 flex-1 items-start justify-between gap-3">
								<div className="min-w-0">
									<ReviewIdentity review={review} />
									<div className="mt-2 max-w-md">
										<CustomerCell review={review} />
									</div>
								</div>
								<div className="xl:hidden">
									<ReviewActions
										onCopyCustomerEmail={onCopyCustomerEmail}
										onCopyReviewId={onCopyReviewId}
										onDelete={onDelete}
										review={review}
									/>
								</div>
							</div>

							<div className="grid min-w-0 grid-cols-2 gap-4 sm:grid-cols-4 xl:w-[560px]">
								<ReviewMetric label="Product">
									<span>{review.product.name}</span>
								</ReviewMetric>
								<ReviewMetric label="Rating">
									<RatingStars rating={review.rating} />
								</ReviewMetric>
								<ReviewMetric label="Created">
									<span>{formatDate(review.createdAt)}</span>
								</ReviewMetric>
								<ReviewMetric label="Updated">
									<span>{formatDate(review.updatedAt)}</span>
								</ReviewMetric>
							</div>

							<div className="hidden xl:block">
								<ReviewActions
									onCopyCustomerEmail={onCopyCustomerEmail}
									onCopyReviewId={onCopyReviewId}
									onDelete={onDelete}
									review={review}
								/>
							</div>
						</div>
					</Card.Content>
				</Card>
			))}
		</div>
	);
}

function ReviewCardGrid({
	onCopyCustomerEmail,
	onCopyReviewId,
	onDelete,
	reviews,
}: {
	onCopyCustomerEmail: (review: ReviewMock) => void;
	onCopyReviewId: (review: ReviewMock) => void;
	onDelete: (review: ReviewMock) => void;
	reviews: ReviewMock[];
}) {
	return (
		<div className="grid grid-cols-1 gap-4 xl:grid-cols-2 2xl:grid-cols-3">
			{reviews.map((review) => (
				<Card key={review.id} className="min-h-[286px]">
					<Card.Header className="flex-row items-start justify-between gap-3 p-4">
						<div className="min-w-0">
							<p className="truncate text-sm font-medium text-foreground">
								{review.title}
							</p>
							<p className="mt-0.5 truncate text-xs text-muted">
								{review.customer.name} · {review.customer.email}
							</p>
						</div>
						<ReviewActions
							onCopyCustomerEmail={onCopyCustomerEmail}
							onCopyReviewId={onCopyReviewId}
							onDelete={onDelete}
							review={review}
						/>
					</Card.Header>

					<Card.Content className="flex flex-1 flex-col gap-4 px-4 pb-4 pt-0">
						<div className="flex flex-wrap items-center gap-1">
							<RatingStars rating={review.rating} />
							<Chip color="default" size="sm" variant="soft">
								{review.product.name}
							</Chip>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<ReviewMetric label="Customer">
								<span>{review.customer.name}</span>
							</ReviewMetric>
							<ReviewMetric label="Product">
								<span>{review.product.name}</span>
							</ReviewMetric>
							<ReviewMetric label="Created">
								<span>{formatDate(review.createdAt)}</span>
							</ReviewMetric>
							<ReviewMetric label="Comment">
								<span className="block truncate text-xs text-muted">
									{review.comment}
								</span>
							</ReviewMetric>
						</div>
					</Card.Content>

					<Card.Footer className="mt-auto justify-between border-t border-border px-4 py-3">
						<span className="truncate text-xs text-muted">
							{review.id}
						</span>
						<span className="text-xs text-muted">
							Updated {formatDate(review.updatedAt)}
						</span>
					</Card.Footer>
				</Card>
			))}
		</div>
	);
}

function ReviewsPagination({
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
					reviews
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

function ReviewsResults({
	demoState,
	onCopyCustomerEmail,
	onCopyReviewId,
	onDelete,
	onDemoStateChange,
	onPreviewChange,
	reviews,
}: {
	demoState: DemoState;
	onCopyCustomerEmail: (review: ReviewMock) => void;
	onCopyReviewId: (review: ReviewMock) => void;
	onDelete: (review: ReviewMock) => void;
	onDemoStateChange: (state: DemoState) => void;
	onPreviewChange: (message: string) => void;
	reviews: ReviewMock[];
}) {
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(10);
	const totalPages = Math.max(Math.ceil(reviews.length / limit), 1);
	const safePage = Math.min(page, totalPages);
	const paginatedReviews = reviews.slice(
		(safePage - 1) * limit,
		safePage * limit,
	);

	return (
		<Tabs
			defaultSelectedKey="table"
			className="flex min-w-0 flex-col gap-3 lg:h-[calc(100vh-8rem)] lg:min-h-[520px] lg:min-h-0"
		>
			<ReviewsToolbar
				demoState={demoState}
				onDemoStateChange={onDemoStateChange}
				onPreviewChange={onPreviewChange}
			/>

			{demoState === "error" ? (
				<div className="min-h-0 min-w-0 flex-1 overflow-auto">
					<AdminSectionError
						actionLabel="Show data"
						message="This is a local UI preview of the error state."
						title="Reviews failed to load"
						onAction={() => onDemoStateChange("data")}
					/>
				</div>
			) : demoState === "empty" || reviews.length === 0 ? (
				<div className="min-h-0 min-w-0 flex-1 overflow-auto">
					<AdminEmptyState
						icon={PackageSearch}
						message="No mock reviews match the current preview state."
						title="No reviews found"
					/>
				</div>
			) : (
				<>
					<Tabs.Panel
						id="table"
						className="min-h-0 min-w-0 flex-1 overflow-auto"
					>
						<ReviewTableView
							onCopyCustomerEmail={onCopyCustomerEmail}
							onCopyReviewId={onCopyReviewId}
							onDelete={onDelete}
							reviews={paginatedReviews}
						/>
					</Tabs.Panel>
					<Tabs.Panel
						id="list"
						className="min-h-0 min-w-0 flex-1 overflow-auto"
					>
						<ReviewListView
							onCopyCustomerEmail={onCopyCustomerEmail}
							onCopyReviewId={onCopyReviewId}
							onDelete={onDelete}
							reviews={paginatedReviews}
						/>
					</Tabs.Panel>
					<Tabs.Panel
						id="cards"
						className="min-h-0 min-w-0 flex-1 overflow-auto"
					>
						<ReviewCardGrid
							onCopyCustomerEmail={onCopyCustomerEmail}
							onCopyReviewId={onCopyReviewId}
							onDelete={onDelete}
							reviews={paginatedReviews}
						/>
					</Tabs.Panel>
				</>
			)}

			<ReviewsPagination
				limit={limit}
				page={safePage}
				total={reviews.length}
				onPageChange={(nextPage) => {
					setPage(nextPage);
					onPreviewChange("Review page preview changed");
				}}
				onPageSizeChange={(nextLimit) => {
					setLimit(nextLimit);
					setPage(1);
					onPreviewChange("Review page size preview changed");
				}}
			/>
		</Tabs>
	);
}

function DeleteReviewModal({
	isOpen,
	onClose,
	onConfirm,
	review,
}: {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: (review: ReviewMock) => void;
	review: ReviewMock | null;
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
							<Modal.Heading>Delete Review</Modal.Heading>
						</Modal.Header>

						<Modal.Body>
							<p className="text-sm text-muted">
								Permanently delete this review by{" "}
								{review?.customer.name ?? "this customer"}? This action cannot be
								undone.
							</p>
						</Modal.Body>

						<Modal.Footer className="flex justify-end gap-2">
							<Button variant="ghost" onPress={onClose}>
								Cancel
							</Button>
							<Button
								variant="primary"
								onPress={() => {
									if (review) onConfirm(review);
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

export function ReviewsPage() {
	const [demoState, setDemoState] = useState<DemoState>("data");
	const [previewMessage, setPreviewMessage] = useState(
		"UI preview uses local mock reviews",
	);
	const [deleteReview, setDeleteReview] = useState<ReviewMock | null>(null);
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

	return (
		<div className="flex flex-col gap-6">
			<ReviewStatCards reviews={MOCK_REVIEWS} />

			<Card className="border-accent/20 bg-accent/5 px-4 py-3">
				<Card.Content className="flex flex-col gap-2 p-0 sm:flex-row sm:items-center sm:justify-between">
					<div className="flex min-w-0 items-start gap-3">
						<MessageSquare size={18} className="mt-0.5 shrink-0 text-accent" />
						<div className="min-w-0">
							<p className="text-sm font-medium text-foreground">
								{previewMessage}
							</p>
							<p className="mt-1 text-xs text-muted">
								No review APIs are connected on this page.
							</p>
						</div>
					</div>
					<Button
						className="shrink-0"
						size="sm"
						variant="secondary"
						onPress={() =>
							setPreviewMessage("UI preview uses local mock reviews")
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
							<ReviewsFilterSidebar onPreviewChange={setPreviewMessage} />
						</Disclosure.Body>
					</Disclosure.Content>
				</Disclosure>
			</div>

			<div className="grid min-w-0 items-start gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
				<aside className="hidden lg:h-[calc(100vh-8rem)] lg:min-h-[520px] lg:block">
					<ReviewsFilterSidebar
						className="sticky top-0 h-full"
						onPreviewChange={setPreviewMessage}
					/>
				</aside>
				<ReviewsResults
					demoState={demoState}
					onCopyCustomerEmail={(review) => {
						void copyToClipboard(review.customer.email, "Customer email");
					}}
					onCopyReviewId={(review) => {
						void copyToClipboard(review.id, "Review ID");
					}}
					onDelete={(review) => {
						setDeleteReview(review);
						setIsDeleteModalOpen(true);
					}}
					onDemoStateChange={setDemoState}
					onPreviewChange={setPreviewMessage}
					reviews={MOCK_REVIEWS}
				/>
			</div>

			<DeleteReviewModal
				isOpen={isDeleteModalOpen}
				review={deleteReview}
				onClose={() => setIsDeleteModalOpen(false)}
				onConfirm={(review) => {
					setIsDeleteModalOpen(false);
					setPreviewMessage(`Review by ${review.customer.name} deleted (preview only)`);
				}}
			/>
		</div>
	);
}
