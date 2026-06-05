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
	ListBox,
	Modal,
	NumberField,
	Pagination,
	Select,
	Switch,
	Table,
	Tabs,
	TextField,
} from "@heroui/react";
import {
	AlertCircle,
	CheckCircle2,
	ChevronDown,
	Grid3X3,
	ImageOff,
	LayoutList,
	MoreHorizontal,
	Package,
	PackageCheck,
	PackagePlus,
	PackageSearch,
	Plus,
	RotateCcw,
	Search,
	SlidersHorizontal,
	TableProperties,
	Trash2,
	TrendingDown,
} from "lucide-react";
import { useState } from "react";
import {
	AdminEmptyState,AdminSectionError,
} from "#/components/admin/sections/admin-page";

type ChipColor = "accent" | "default" | "danger" | "success" | "warning";

type VariantOption = {
	id: string;
	label: string;
};

type VariantProduct = {
	id: string;
	name: string;
	brand: string;
	category: string;
	slug: string;
	image: string | null;
	isActive: boolean;
	isFeatured: boolean;
	isBestseller: boolean;
	ratingAvg: number;
	reviewsCount: number;
};

type VariantMock = {
	id: string;
	sku: string;
	price: number;
	compareAtPrice: number | null;
	stockQuantity: number;
	isDefault: boolean;
	color: {
		id: string;
		name: string;
		hexCode: string | null;
	} | null;
	storage: VariantOption | null;
	ram: VariantOption | null;
	screenSize: VariantOption | null;
	images: string[];
	product: VariantProduct;
	createdAt: string;
	updatedAt: string;
};

type VariantModalMode = "create" | "edit";
type DemoState = "data" | "empty" | "error";

const SEARCH_TYPE_OPTIONS = [
	{ id: "sku", label: "SKU" },
	{ id: "product", label: "Product" },
	{ id: "brand", label: "Brand" },
	{ id: "category", label: "Category" },
];

const SORT_OPTIONS = [
	{ id: "updated-desc", label: "Recently updated" },
	{ id: "created-desc", label: "Newest first" },
	{ id: "sku-asc", label: "SKU A-Z" },
	{ id: "price-desc", label: "Price high-low" },
	{ id: "price-asc", label: "Price low-high" },
	{ id: "stock-asc", label: "Lowest stock" },
];

const PAGE_SIZE_OPTIONS = [
	{ id: "10", label: "10 / page" },
	{ id: "25", label: "25 / page" },
	{ id: "50", label: "50 / page" },
	{ id: "100", label: "100 / page" },
];

const DEMO_STATE_OPTIONS = [
	{ id: "data", label: "Data" },
	{ id: "empty", label: "Empty" },
	{ id: "error", label: "Error" },
];

const PRODUCT_OPTIONS = [
	{ id: "macbook-pro-14", label: "MacBook Pro 14" },
	{ id: "iphone-16-pro", label: "iPhone 16 Pro" },
	{ id: "galaxy-s26-ultra", label: "Galaxy S26 Ultra" },
	{ id: "pixelbook-air", label: "Pixelbook Air" },
	{ id: "sony-wh-1000xm6", label: "Sony WH-1000XM6" },
];

const CATEGORY_OPTIONS = [
	{ id: "laptops", label: "Laptops" },
	{ id: "smartphones", label: "Smartphones" },
	{ id: "tablets", label: "Tablets" },
	{ id: "audio", label: "Audio" },
	{ id: "accessories", label: "Accessories" },
	{ id: "gaming", label: "Gaming" },
];

const BRAND_OPTIONS = [
	{ id: "apple", label: "Apple" },
	{ id: "samsung", label: "Samsung" },
	{ id: "google", label: "Google" },
	{ id: "sony", label: "Sony" },
	{ id: "asus", label: "ASUS" },
];

const COLOR_OPTIONS = [
	{ id: "space-black", label: "Space Black" },
	{ id: "natural-titanium", label: "Natural Titanium" },
	{ id: "graphite", label: "Graphite" },
	{ id: "porcelain", label: "Porcelain" },
	{ id: "midnight-blue", label: "Midnight Blue" },
];

const STORAGE_OPTIONS = [
	{ id: "256gb", label: "256 GB" },
	{ id: "512gb", label: "512 GB" },
	{ id: "1tb", label: "1 TB" },
	{ id: "2tb", label: "2 TB" },
];

const RAM_OPTIONS = [
	{ id: "8gb", label: "8 GB" },
	{ id: "16gb", label: "16 GB" },
	{ id: "24gb", label: "24 GB" },
	{ id: "32gb", label: "32 GB" },
];

const SCREEN_OPTIONS = [
	{ id: "6-3", label: "6.3 inch" },
	{ id: "6-8", label: "6.8 inch" },
	{ id: "14-2", label: "14.2 inch" },
	{ id: "16-0", label: "16 inch" },
];

const MOCK_VARIANTS: VariantMock[] = [
	{
		id: "var_01jz_macbook_black_512",
		sku: "MBP14-M4-BLK-512",
		price: 2199,
		compareAtPrice: 2399,
		stockQuantity: 18,
		isDefault: true,
		color: { id: "space-black", name: "Space Black", hexCode: "#1F2024" },
		storage: { id: "512gb", label: "512 GB" },
		ram: { id: "16gb", label: "16 GB" },
		screenSize: { id: "14-2", label: "14.2 inch" },
		images: [
			"https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=320&q=80",
		],
		product: {
			id: "prod_macbook_pro_14",
			name: "MacBook Pro 14",
			brand: "Apple",
			category: "Laptops",
			slug: "macbook-pro-14",
			image:
				"https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=320&q=80",
			isActive: true,
			isFeatured: true,
			isBestseller: false,
			ratingAvg: 4.8,
			reviewsCount: 184,
		},
		createdAt: "2026-03-11T09:15:00.000Z",
		updatedAt: "2026-05-30T13:24:00.000Z",
	},
	{
		id: "var_01jz_macbook_silver_1tb",
		sku: "MBP14-M4-SLV-1TB",
		price: 2599,
		compareAtPrice: null,
		stockQuantity: 7,
		isDefault: false,
		color: { id: "silver", name: "Silver", hexCode: "#D8D8D2" },
		storage: { id: "1tb", label: "1 TB" },
		ram: { id: "24gb", label: "24 GB" },
		screenSize: { id: "14-2", label: "14.2 inch" },
		images: [],
		product: {
			id: "prod_macbook_pro_14",
			name: "MacBook Pro 14",
			brand: "Apple",
			category: "Laptops",
			slug: "macbook-pro-14",
			image:
				"https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=320&q=80",
			isActive: true,
			isFeatured: true,
			isBestseller: false,
			ratingAvg: 4.8,
			reviewsCount: 184,
		},
		createdAt: "2026-03-11T09:30:00.000Z",
		updatedAt: "2026-05-29T16:48:00.000Z",
	},
	{
		id: "var_01jz_iphone_titanium_256",
		sku: "IP16P-TTN-256",
		price: 1199,
		compareAtPrice: 1299,
		stockQuantity: 34,
		isDefault: true,
		color: {
			id: "natural-titanium",
			name: "Natural Titanium",
			hexCode: "#C2B8AA",
		},
		storage: { id: "256gb", label: "256 GB" },
		ram: { id: "8gb", label: "8 GB" },
		screenSize: { id: "6-3", label: "6.3 inch" },
		images: [
			"https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=320&q=80",
		],
		product: {
			id: "prod_iphone_16_pro",
			name: "iPhone 16 Pro",
			brand: "Apple",
			category: "Smartphones",
			slug: "iphone-16-pro",
			image:
				"https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=320&q=80",
			isActive: true,
			isFeatured: true,
			isBestseller: true,
			ratingAvg: 4.7,
			reviewsCount: 421,
		},
		createdAt: "2026-04-02T11:40:00.000Z",
		updatedAt: "2026-05-31T10:08:00.000Z",
	},
	{
		id: "var_01jz_iphone_black_512",
		sku: "IP16P-BLK-512",
		price: 1399,
		compareAtPrice: null,
		stockQuantity: 0,
		isDefault: false,
		color: { id: "black-titanium", name: "Black Titanium", hexCode: "#33302E" },
		storage: { id: "512gb", label: "512 GB" },
		ram: { id: "8gb", label: "8 GB" },
		screenSize: { id: "6-3", label: "6.3 inch" },
		images: [
			"https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=320&q=80",
		],
		product: {
			id: "prod_iphone_16_pro",
			name: "iPhone 16 Pro",
			brand: "Apple",
			category: "Smartphones",
			slug: "iphone-16-pro",
			image:
				"https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=320&q=80",
			isActive: true,
			isFeatured: true,
			isBestseller: true,
			ratingAvg: 4.7,
			reviewsCount: 421,
		},
		createdAt: "2026-04-02T11:45:00.000Z",
		updatedAt: "2026-05-28T09:16:00.000Z",
	},
	{
		id: "var_01jz_galaxy_graphite_512",
		sku: "GS26U-GRF-512",
		price: 1299,
		compareAtPrice: 1499,
		stockQuantity: 5,
		isDefault: true,
		color: { id: "graphite", name: "Graphite", hexCode: "#4B4B4F" },
		storage: { id: "512gb", label: "512 GB" },
		ram: { id: "16gb", label: "16 GB" },
		screenSize: { id: "6-8", label: "6.8 inch" },
		images: [
			"https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=320&q=80",
		],
		product: {
			id: "prod_galaxy_s26_ultra",
			name: "Galaxy S26 Ultra",
			brand: "Samsung",
			category: "Smartphones",
			slug: "galaxy-s26-ultra",
			image:
				"https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=320&q=80",
			isActive: true,
			isFeatured: false,
			isBestseller: true,
			ratingAvg: 4.5,
			reviewsCount: 278,
		},
		createdAt: "2026-04-18T14:05:00.000Z",
		updatedAt: "2026-05-27T18:22:00.000Z",
	},
	{
		id: "var_01jz_pixelbook_porcelain_256",
		sku: "PBAIR-POR-256",
		price: 999,
		compareAtPrice: null,
		stockQuantity: 12,
		isDefault: true,
		color: { id: "porcelain", name: "Porcelain", hexCode: "#F1ECE4" },
		storage: { id: "256gb", label: "256 GB" },
		ram: { id: "16gb", label: "16 GB" },
		screenSize: { id: "14-2", label: "14.2 inch" },
		images: [
			"https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=320&q=80",
		],
		product: {
			id: "prod_pixelbook_air",
			name: "Pixelbook Air",
			brand: "Google",
			category: "Laptops",
			slug: "pixelbook-air",
			image:
				"https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=320&q=80",
			isActive: false,
			isFeatured: false,
			isBestseller: false,
			ratingAvg: 4.1,
			reviewsCount: 52,
		},
		createdAt: "2026-02-21T12:30:00.000Z",
		updatedAt: "2026-05-19T08:42:00.000Z",
	},
	{
		id: "var_01jz_sony_blue_default",
		sku: "WHXM6-MBL",
		price: 399,
		compareAtPrice: 449,
		stockQuantity: 42,
		isDefault: true,
		color: { id: "midnight-blue", name: "Midnight Blue", hexCode: "#27364A" },
		storage: null,
		ram: null,
		screenSize: null,
		images: [
			"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=320&q=80",
		],
		product: {
			id: "prod_sony_wh_1000xm6",
			name: "Sony WH-1000XM6",
			brand: "Sony",
			category: "Audio",
			slug: "sony-wh-1000xm6",
			image:
				"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=320&q=80",
			isActive: true,
			isFeatured: false,
			isBestseller: true,
			ratingAvg: 4.6,
			reviewsCount: 318,
		},
		createdAt: "2026-05-03T10:10:00.000Z",
		updatedAt: "2026-05-30T12:55:00.000Z",
	},
];

function formatCurrency(value: number | null) {
	if (value === null) return "-";

	return `€${value.toLocaleString()}`;
}

function formatDate(value: string) {
	return new Intl.DateTimeFormat("en-US", {
		day: "numeric",
		month: "short",
		year: "numeric",
	}).format(new Date(value));
}

function getVariantDisplayName(variant: VariantMock) {
	return [
		variant.color?.name,
		variant.storage?.label,
		variant.ram?.label,
		variant.screenSize?.label,
	]
		.filter(Boolean)
		.join(" / ");
}

function getStockStatus(variant: VariantMock): {
	color: ChipColor;
	label: string;
	textClass: string;
} {
	if (variant.stockQuantity === 0) {
		return {
			color: "danger",
			label: "Out of stock",
			textClass: "font-semibold text-danger",
		};
	}

	if (variant.stockQuantity < 10) {
		return {
			color: "warning",
			label: "Low stock",
			textClass: "font-semibold text-warning",
		};
	}

	return {
		color: "success",
		label: "In stock",
		textClass: "text-foreground",
	};
}

function getDiscountPercent(variant: VariantMock) {
	if (!variant.compareAtPrice) return null;

	return Math.round(
		((variant.compareAtPrice - variant.price) / variant.compareAtPrice) * 100,
	);
}

function VariantImage({
	name,
	size = "sm",
	src,
}: {
	name: string;
	size?: "sm" | "md" | "lg";
	src: string | null;
}) {
	const sizeClass =
		size === "lg"
			? "size-16 rounded-xl"
			: size === "md"
				? "size-12 rounded-xl"
				: "size-10 rounded-lg";

	if (src) {
		return (
			<img
				src={src}
				alt={name}
				className={`${sizeClass} shrink-0 border border-border object-cover`}
			/>
		);
	}

	return (
		<div
			className={`${sizeClass} flex shrink-0 items-center justify-center border border-border bg-secondary`}
		>
			<ImageOff size={size === "lg" ? 22 : 16} className="text-muted" />
		</div>
	);
}

function VariantIdentity({
	imageSize = "sm",
	variant,
}: {
	imageSize?: "sm" | "md" | "lg";
	variant: VariantMock;
}) {
	const displayName = getVariantDisplayName(variant) || "Base configuration";

	return (
		<div className="flex min-w-0 items-center gap-3">
			<VariantImage
				name={variant.product.name}
				size={imageSize}
				src={variant.images[0] ?? variant.product.image}
			/>
			<div className="min-w-0">
				<p className="truncate text-sm font-medium text-foreground">
					{variant.product.name}
				</p>
				<p className="mt-0.5 truncate text-xs text-muted">{displayName}</p>
			</div>
		</div>
	);
}

function PriceCell({ variant }: { variant: VariantMock }) {
	return (
		<div className="flex flex-col">
			<span className="text-sm font-medium text-foreground">
				{formatCurrency(variant.price)}
			</span>
			{variant.compareAtPrice ? (
				<span className="text-xs text-muted line-through">
					{formatCurrency(variant.compareAtPrice)}
				</span>
			) : null}
		</div>
	);
}

function StockCell({ variant }: { variant: VariantMock }) {
	const status = getStockStatus(variant);

	return (
		<div className="flex flex-col gap-1">
			<span className={`text-sm ${status.textClass}`}>
				{variant.stockQuantity}
			</span>
			<Chip color={status.color} size="sm" variant="soft">
				{status.label}
			</Chip>
		</div>
	);
}

function OptionChips({ variant }: { variant: VariantMock }) {
	const options = [
		variant.color?.name,
		variant.storage?.label,
		variant.ram?.label,
		variant.screenSize?.label,
	].filter(Boolean);

	if (options.length === 0) {
		return <span className="text-sm text-muted">No options</span>;
	}

	return (
		<div className="flex flex-wrap gap-1">
			{variant.color ? (
				<Chip size="sm" variant="soft">
					<span
						className="size-2 rounded-full border border-border"
						style={{
							backgroundColor: variant.color.hexCode ?? "transparent",
						}}
					/>
					{variant.color.name}
				</Chip>
			) : null}
			{[variant.storage?.label, variant.ram?.label, variant.screenSize?.label]
				.filter(Boolean)
				.map((option) => (
					<Chip key={option} size="sm" variant="soft">
						{option}
					</Chip>
				))}
		</div>
	);
}

function StatusChips({ variant }: { variant: VariantMock }) {
	const discount = getDiscountPercent(variant);

	return (
		<div className="flex flex-wrap gap-1">
			<Chip
				color={variant.product.isActive ? "success" : "danger"}
				size="sm"
				variant="soft"
			>
				{variant.product.isActive ? "Active" : "Inactive"}
			</Chip>
			{variant.isDefault ? (
				<Chip color="accent" size="sm" variant="soft">
					Default
				</Chip>
			) : null}
			{discount ? (
				<Chip color="danger" size="sm" variant="soft">
					-{discount}%
				</Chip>
			) : null}
			{variant.product.isFeatured ? (
				<Chip color="accent" size="sm" variant="soft">
					Featured
				</Chip>
			) : null}
			{variant.product.isBestseller ? (
				<Chip color="warning" size="sm" variant="soft">
					Bestseller
				</Chip>
			) : null}
		</div>
	);
}

function VariantActions({
	onDelete,
	onEdit,
	variant,
}: {
	onDelete: (variant: VariantMock) => void;
	onEdit: (variant: VariantMock) => void;
	variant: VariantMock;
}) {
	return (
		<Dropdown>
			<Button aria-label="Variant actions" isIconOnly size="sm" variant="ghost">
				<MoreHorizontal size={16} />
			</Button>
			<Dropdown.Popover className="min-w-36">
				<div className="flex flex-col gap-1 p-1">
					<Button
						className="justify-start"
						size="sm"
						variant="ghost"
						onPress={() => onEdit(variant)}
					>
						Edit
					</Button>
					<Button
						className="justify-start"
						size="sm"
						variant="ghost"
						onPress={() => onEdit(variant)}
					>
						Duplicate
					</Button>
					<Button
						className="justify-start text-danger"
						size="sm"
						variant="ghost"
						onPress={() => onDelete(variant)}
					>
						Delete
					</Button>
				</div>
			</Dropdown.Popover>
		</Dropdown>
	);
}

function VariantMetric({
	children,
	label,
}: {
	children: React.ReactNode;
	label: string;
}) {
	return (
		<div className="min-w-0">
			<p className="text-[11px] font-medium uppercase text-muted">{label}</p>
			<div className="mt-1 text-sm text-foreground">{children}</div>
		</div>
	);
}

function VariantStatCards() {
	const totalVariants = MOCK_VARIANTS.length;
	const inStock = MOCK_VARIANTS.filter((variant) => variant.stockQuantity > 0);
	const lowStock = MOCK_VARIANTS.filter(
		(variant) => variant.stockQuantity > 0 && variant.stockQuantity < 10,
	);
	const outOfStock = MOCK_VARIANTS.filter(
		(variant) => variant.stockQuantity === 0,
	);

	const cards = [
		{
			label: "Total Variants",
			value: totalVariants,
			Icon: Package,
			colorClass: "text-accent",
			bgClass: "bg-accent/10",
		},
		{
			label: "In Stock",
			value: inStock.length,
			Icon: CheckCircle2,
			colorClass: "text-success",
			bgClass: "bg-success/10",
		},
		{
			label: "Out of Stock",
			value: outOfStock.length,
			Icon: AlertCircle,
			colorClass: "text-danger",
			bgClass: "bg-danger/10",
		},
		{
			label: "Low Stock",
			value: lowStock.length,
			Icon: TrendingDown,
			colorClass: "text-warning",
			bgClass: "bg-warning/10",
		},
	];

	return (
		<div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
			{cards.map((card) => (
				<Card key={card.label}>
					<Card.Content className="flex items-center gap-4 p-4">
						<div className={`rounded-xl p-2.5 ${card.bgClass}`}>
							<card.Icon size={20} className={card.colorClass} />
						</div>
						<div className="min-w-0">
							<p className="text-2xl font-bold text-foreground">{card.value}</p>
							<p className="mt-0.5 text-xs text-muted">{card.label}</p>
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
	selectedKey,
	onSelect,
	options,
	placeholder,
}: {
	ariaLabel: string;
	className?: string;
	selectedKey: string;
	onSelect?: (key: string) => void;
	options: VariantOption[];
	placeholder: string;
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

function VariantsFilterSidebar({
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
					onPreviewChange("Filter preview reset");
				}}
				onSubmit={(event) => {
					event.preventDefault();
					onPreviewChange("Filter preview applied");
				}}
			>
				<Card.Content className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4">
					<div className="flex flex-col gap-5">
						<FilterGroup title="Product Status">
							<StatusRadioGroup />
						</FilterGroup>

						<FilterGroup title="Variant State">
							<div className="flex flex-col gap-3">
								<FilterSwitch label="Default variant" name="isDefault" />
								<FilterSwitch label="In stock" name="inStock" />
								<FilterSwitch label="Out of stock" name="outOfStock" />
								<FilterSwitch label="Low stock" name="lowStock" />
								<FilterSwitch label="On sale" name="onSale" />
								<FilterSwitch label="Has images" name="hasImages" />
								<FilterSwitch label="Missing option" name="missingOption" />
							</div>
						</FilterGroup>

						<FilterGroup title="Product Flags">
							<div className="flex flex-col gap-3">
								<FilterSwitch label="Featured" name="isFeatured" />
								<FilterSwitch label="Bestseller" name="isBestseller" />
								<FilterSwitch label="Has reviews" name="hasReviews" />
							</div>
						</FilterGroup>

						<FilterGroup title="Categories">
							<CheckboxOptionGroup
								ariaLabel="Variant categories"
								name="categoryIds"
								options={CATEGORY_OPTIONS}
							/>
						</FilterGroup>

						<FilterGroup title="Brands">
							<CheckboxOptionGroup
								ariaLabel="Variant brands"
								name="brandIds"
								options={BRAND_OPTIONS}
							/>
						</FilterGroup>

						<FilterGroup title="Colors">
							<CheckboxOptionGroup
								ariaLabel="Variant colors"
								name="colorIds"
								options={COLOR_OPTIONS}
							/>
						</FilterGroup>

						<FilterGroup title="Storage">
							<CheckboxOptionGroup
								ariaLabel="Variant storage"
								name="storageIds"
								options={STORAGE_OPTIONS}
							/>
						</FilterGroup>

						<FilterGroup title="RAM">
							<CheckboxOptionGroup
								ariaLabel="Variant RAM"
								name="ramIds"
								options={RAM_OPTIONS}
							/>
						</FilterGroup>

						<FilterGroup title="Screen">
							<CheckboxOptionGroup
								ariaLabel="Variant screens"
								name="screenIds"
								options={SCREEN_OPTIONS}
							/>
						</FilterGroup>

						<FilterGroup title="Price">
							<RangeNumberFields
								formatOptions={{ currency: "EUR", style: "currency" }}
								maxLabel="Max"
								maxName="maxPrice"
								minLabel="Min"
								minName="minPrice"
								step={50}
							/>
						</FilterGroup>

						<FilterGroup title="Compare Price">
							<RangeNumberFields
								formatOptions={{ currency: "EUR", style: "currency" }}
								maxLabel="Max"
								maxName="maxCompareAtPrice"
								minLabel="Min"
								minName="minCompareAtPrice"
								step={50}
							/>
						</FilterGroup>

						<FilterGroup title="Stock">
							<RangeNumberFields
								maxLabel="Max"
								maxName="maxStock"
								minLabel="Min"
								minName="minStock"
								step={1}
							/>
						</FilterGroup>

						<FilterGroup title="Rating">
							<RangeNumberFields
								maxLabel="Max"
								maxName="maxRating"
								minLabel="Min"
								minName="minRating"
								step={0.1}
							/>
						</FilterGroup>

						<FilterGroup title="Created">
							<DateRangeFields maxName="createdBefore" minName="createdAfter" />
						</FilterGroup>

						<FilterGroup title="Updated">
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
	children: React.ReactNode;
	title: string;
}) {
	return (
		<section className="flex flex-col gap-3 border-t border-border pt-4 first:border-t-0 first:pt-0">
			<h3 className="text-xs font-semibold uppercase text-muted">{title}</h3>
			{children}
		</section>
	);
}

function StatusRadioGroup() {
	const options = [
		{ id: "all", label: "All" },
		{ id: "active", label: "Active" },
		{ id: "inactive", label: "Inactive" },
	];

	return (
		<div className="grid grid-cols-3 gap-1 rounded-lg bg-secondary p-1">
			{options.map((option) => (
				<label
					key={option.id}
					className="relative flex cursor-pointer items-center justify-center rounded-md px-2 py-1.5 text-xs font-medium text-muted has-[:checked]:bg-surface has-[:checked]:text-foreground has-[:checked]:shadow-sm"
				>
					<input
						className="sr-only"
						defaultChecked={option.id === "all"}
						name="status"
						type="radio"
						value={option.id}
					/>
					{option.label}
				</label>
			))}
		</div>
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

function CheckboxOptionGroup({
	ariaLabel,
	name,
	options,
}: {
	ariaLabel: string;
	name: string;
	options: VariantOption[];
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

function VariantsToolbar({
	demoState,
	onAdd,
	onDemoStateChange,
	onPreviewChange,
}: {
	demoState: DemoState;
	onAdd: () => void;
	onDemoStateChange: (state: DemoState) => void;
	onPreviewChange: (message: string) => void;
}) {
	const [searchType, setSearchType] = useState("sku");
	const [sort, setSort] = useState("updated-desc");

	return (
		<div className="shrink-0 rounded-2xl border border-border bg-surface p-2 shadow-sm">
			<div className="flex flex-col gap-2 xl:flex-row xl:items-center">
				<div className="flex min-w-0 flex-1 flex-col gap-2 md:flex-row">
					<form
						className="min-w-0 flex-1"
						onSubmit={(event) => {
							event.preventDefault();
							onPreviewChange("Search preview submitted");
						}}
					>
						<TextField className="min-w-0" name="search">
							<InputGroup fullWidth variant="primary">
								<InputGroup.Prefix>
									<Search size={14} className="text-muted" />
								</InputGroup.Prefix>
								<InputGroup.Input
									aria-label="Search variants"
									placeholder="Search variants"
								/>
							</InputGroup>
						</TextField>
					</form>

					<MockSelect
						ariaLabel="Search type"
						className="w-full md:w-32"
						options={SEARCH_TYPE_OPTIONS}
						placeholder="Search by"
						selectedKey={searchType}
						onSelect={(key) => {
							setSearchType(key);
							onPreviewChange("Search type preview changed");
						}}
					/>

					<MockSelect
						ariaLabel="Sort variants"
						className="w-full md:w-44"
						options={SORT_OPTIONS}
						placeholder="Sort"
						selectedKey={sort}
						onSelect={(key) => {
							setSort(key);
							onPreviewChange("Sort preview changed");
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
							aria-label="Variant views"
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

					<Button
						className="shrink-0"
						size="sm"
						variant="primary"
						onPress={onAdd}
					>
						<Plus size={16} />
						Add Variant
					</Button>
				</div>
			</div>
		</div>
	);
}

function VariantsResults({
	demoState,
	onAdd,
	onDelete,
	onDemoStateChange,
	onEdit,
	onPreviewChange,
}: {
	demoState: DemoState;
	onAdd: () => void;
	onDelete: (variant: VariantMock) => void;
	onDemoStateChange: (state: DemoState) => void;
	onEdit: (variant: VariantMock) => void;
	onPreviewChange: (message: string) => void;
}) {
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(10);

	return (
		<Tabs
			defaultSelectedKey="table"
			className="flex min-w-0 flex-col gap-3 lg:h-[calc(100vh-8rem)] lg:min-h-[520px] lg:min-h-0"
		>
			<VariantsToolbar
				demoState={demoState}
				onAdd={onAdd}
				onDemoStateChange={onDemoStateChange}
				onPreviewChange={onPreviewChange}
			/>

			{demoState === "error" ? (
				<div className="min-h-0 min-w-0 flex-1 overflow-auto">
					<AdminSectionError
						title="Variants failed to load"
						message="This is a local UI preview of the error state."
						actionLabel="Show data"
						onAction={() => onDemoStateChange("data")}
					/>
				</div>
			) : demoState === "empty" ? (
				<div className="min-h-0 min-w-0 flex-1 overflow-auto">
					<AdminEmptyState
						icon={PackageSearch}
						title="No variants found"
						message="No mock variants match the current preview state."
					/>
				</div>
			) : (
				<>
					<Tabs.Panel
						id="table"
						className="min-h-0 min-w-0 flex-1 overflow-auto"
					>
						<VariantTableView
							onDelete={onDelete}
							onEdit={onEdit}
							variants={MOCK_VARIANTS}
						/>
					</Tabs.Panel>
					<Tabs.Panel
						id="list"
						className="min-h-0 min-w-0 flex-1 overflow-auto"
					>
						<VariantListView
							onDelete={onDelete}
							onEdit={onEdit}
							variants={MOCK_VARIANTS}
						/>
					</Tabs.Panel>
					<Tabs.Panel
						id="cards"
						className="min-h-0 min-w-0 flex-1 overflow-auto"
					>
						<VariantCardGrid
							onDelete={onDelete}
							onEdit={onEdit}
							variants={MOCK_VARIANTS}
						/>
					</Tabs.Panel>
				</>
			)}

			<VariantsPagination
				limit={limit}
				page={page}
				total={MOCK_VARIANTS.length}
				onPageChange={(nextPage) => {
					setPage(nextPage);
					onPreviewChange("Page preview changed");
				}}
				onPageSizeChange={(nextLimit) => {
					setLimit(nextLimit);
					setPage(1);
					onPreviewChange("Page size preview changed");
				}}
			/>
		</Tabs>
	);
}

function VariantTableView({
	onDelete,
	onEdit,
	variants,
}: {
	onDelete: (variant: VariantMock) => void;
	onEdit: (variant: VariantMock) => void;
	variants: VariantMock[];
}) {
	return (
		<Table>
			<Table.ScrollContainer>
				<Table.Content aria-label="Variants" className="min-w-[1120px]">
					<Table.Header>
						<Table.Column isRowHeader className="w-[300px]">
							Variant
						</Table.Column>
						<Table.Column>SKU</Table.Column>
						<Table.Column>Options</Table.Column>
						<Table.Column>Price</Table.Column>
						<Table.Column>Stock</Table.Column>
						<Table.Column className="min-w-[180px]">Status</Table.Column>
						<Table.Column>Updated</Table.Column>
						<Table.Column className="w-12">Actions</Table.Column>
					</Table.Header>
					<Table.Body>
						{variants.map((variant) => (
							<Table.Row key={variant.id}>
								<Table.Cell>
									<VariantIdentity variant={variant} />
								</Table.Cell>
								<Table.Cell>
									<code className="rounded bg-secondary px-1.5 py-1 text-xs text-muted">
										{variant.sku}
									</code>
								</Table.Cell>
								<Table.Cell>
									<OptionChips variant={variant} />
								</Table.Cell>
								<Table.Cell>
									<PriceCell variant={variant} />
								</Table.Cell>
								<Table.Cell>
									<StockCell variant={variant} />
								</Table.Cell>
								<Table.Cell>
									<StatusChips variant={variant} />
								</Table.Cell>
								<Table.Cell>
									<span className="text-sm text-muted">
										{formatDate(variant.updatedAt)}
									</span>
								</Table.Cell>
								<Table.Cell>
									<VariantActions
										onDelete={onDelete}
										onEdit={onEdit}
										variant={variant}
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

function VariantListView({
	onDelete,
	onEdit,
	variants,
}: {
	onDelete: (variant: VariantMock) => void;
	onEdit: (variant: VariantMock) => void;
	variants: VariantMock[];
}) {
	return (
		<div className="flex flex-col gap-3">
			{variants.map((variant) => (
				<Card key={variant.id}>
					<Card.Content className="p-4">
						<div className="flex flex-col gap-4 xl:flex-row xl:items-center">
							<div className="flex min-w-0 flex-1 items-start justify-between gap-3">
								<VariantIdentity imageSize="md" variant={variant} />
								<div className="xl:hidden">
									<VariantActions
										onDelete={onDelete}
										onEdit={onEdit}
										variant={variant}
									/>
								</div>
							</div>

							<div className="grid min-w-0 grid-cols-2 gap-4 sm:grid-cols-4 xl:w-[560px]">
								<VariantMetric label="SKU">
									<code className="block truncate rounded bg-secondary px-1.5 py-1 text-xs text-muted">
										{variant.sku}
									</code>
								</VariantMetric>
								<VariantMetric label="Price">
									<PriceCell variant={variant} />
								</VariantMetric>
								<VariantMetric label="Stock">
									<StockCell variant={variant} />
								</VariantMetric>
								<VariantMetric label="Updated">
									<span>{formatDate(variant.updatedAt)}</span>
								</VariantMetric>
							</div>

							<div className="flex min-w-0 items-start justify-between gap-3 xl:w-[260px]">
								<StatusChips variant={variant} />
								<div className="hidden xl:block">
									<VariantActions
										onDelete={onDelete}
										onEdit={onEdit}
										variant={variant}
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

function VariantCardGrid({
	onDelete,
	onEdit,
	variants,
}: {
	onDelete: (variant: VariantMock) => void;
	onEdit: (variant: VariantMock) => void;
	variants: VariantMock[];
}) {
	return (
		<div className="grid grid-cols-1 gap-4 xl:grid-cols-2 2xl:grid-cols-3">
			{variants.map((variant) => (
				<Card key={variant.id} className="min-h-[286px]">
					<Card.Header className="flex-row items-start justify-between gap-3 p-4">
						<VariantIdentity imageSize="lg" variant={variant} />
						<VariantActions
							onDelete={onDelete}
							onEdit={onEdit}
							variant={variant}
						/>
					</Card.Header>

					<Card.Content className="flex flex-1 flex-col gap-4 px-4 pb-4 pt-0">
						<StatusChips variant={variant} />
						<OptionChips variant={variant} />

						<div className="grid grid-cols-2 gap-4">
							<VariantMetric label="SKU">
								<code className="block truncate rounded bg-secondary px-1.5 py-1 text-xs text-muted">
									{variant.sku}
								</code>
							</VariantMetric>
							<VariantMetric label="Price">
								<PriceCell variant={variant} />
							</VariantMetric>
							<VariantMetric label="Stock">
								<StockCell variant={variant} />
							</VariantMetric>
							<VariantMetric label="Category">
								<span className="block truncate text-xs text-muted">
									{variant.product.category}
								</span>
							</VariantMetric>
						</div>
					</Card.Content>

					<Card.Footer className="mt-auto justify-between border-t border-border px-4 py-3">
						<span className="truncate text-xs text-muted">
							/{variant.product.slug}
						</span>
						<span className="text-xs text-muted">
							{formatDate(variant.updatedAt)}
						</span>
					</Card.Footer>
				</Card>
			))}
		</div>
	);
}

function VariantsPagination({
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
					variants
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

function VariantFormModal({
	isOpen,
	mode,
	onClose,
	variant,
}: {
	isOpen: boolean;
	mode: VariantModalMode;
	onClose: () => void;
	variant: VariantMock | null;
}) {
	const isEditing = mode === "edit";

	return (
		<Modal
			isOpen={isOpen}
			onOpenChange={(open) => {
				if (!open) onClose();
			}}
		>
			<Modal.Backdrop>
				<Modal.Container>
					<Modal.Dialog className="sm:max-w-[720px]">
						<Modal.CloseTrigger />
						<Modal.Header>
							<Modal.Icon className="bg-accent/10 text-accent">
								<PackagePlus size={20} />
							</Modal.Icon>
							<Modal.Heading>
								{isEditing ? "Edit Variant" : "Add Variant"}
							</Modal.Heading>
						</Modal.Header>

						<Modal.Body className="flex max-h-[70vh] flex-col gap-4 overflow-y-auto">
							<Select
								className="flex flex-col gap-1.5"
								defaultSelectedKey={
									variant?.product.id ?? PRODUCT_OPTIONS[0]?.id
								}
								placeholder="Select product"
							>
								<Label className="text-sm font-medium">
									Product <span className="text-danger">*</span>
								</Label>
								<Select.Trigger>
									<Select.Value />
									<Select.Indicator />
								</Select.Trigger>
								<Select.Popover>
									<ListBox>
										{PRODUCT_OPTIONS.map((product) => (
											<ListBox.Item
												key={product.id}
												id={product.id}
												textValue={product.label}
											>
												{product.label}
												<ListBox.ItemIndicator />
											</ListBox.Item>
										))}
									</ListBox>
								</Select.Popover>
							</Select>

							<div className="grid gap-4 md:grid-cols-2">
								<TextField className="flex flex-col gap-1.5">
									<Label className="text-sm font-medium">
										SKU <span className="text-danger">*</span>
									</Label>
									<InputGroup variant="primary">
										<InputGroup.Input
											defaultValue={variant?.sku ?? ""}
											placeholder="MBP14-M4-BLK-512"
										/>
									</InputGroup>
								</TextField>

								<NumberField
									className="flex flex-col gap-1.5"
									defaultValue={variant?.stockQuantity ?? 0}
									minValue={0}
									variant="primary"
								>
									<Label className="text-sm font-medium">Stock</Label>
									<NumberField.Group>
										<NumberField.Input className="w-full min-w-0" />
									</NumberField.Group>
								</NumberField>
							</div>

							<div className="grid gap-4 md:grid-cols-2">
								<NumberField
									className="flex flex-col gap-1.5"
									defaultValue={variant?.price ?? 0}
									formatOptions={{ currency: "EUR", style: "currency" }}
									minValue={0}
									step={50}
									variant="primary"
								>
									<Label className="text-sm font-medium">
										Price <span className="text-danger">*</span>
									</Label>
									<NumberField.Group>
										<NumberField.Input className="w-full min-w-0" />
									</NumberField.Group>
								</NumberField>

								<NumberField
									className="flex flex-col gap-1.5"
									defaultValue={variant?.compareAtPrice ?? undefined}
									formatOptions={{ currency: "EUR", style: "currency" }}
									minValue={0}
									step={50}
									variant="primary"
								>
									<Label className="text-sm font-medium">
										Compare-at price
									</Label>
									<NumberField.Group>
										<NumberField.Input className="w-full min-w-0" />
									</NumberField.Group>
								</NumberField>
							</div>

							<div className="grid gap-4 md:grid-cols-2">
								<FormSelect
									defaultSelectedKey={variant?.color?.id}
									label="Color"
									options={COLOR_OPTIONS}
									placeholder="Select color"
								/>
								<FormSelect
									defaultSelectedKey={variant?.storage?.id}
									label="Storage"
									options={STORAGE_OPTIONS}
									placeholder="Select storage"
								/>
								<FormSelect
									defaultSelectedKey={variant?.ram?.id}
									label="RAM"
									options={RAM_OPTIONS}
									placeholder="Select RAM"
								/>
								<FormSelect
									defaultSelectedKey={variant?.screenSize?.id}
									label="Screen"
									options={SCREEN_OPTIONS}
									placeholder="Select screen"
								/>
							</div>

							<TextField className="flex flex-col gap-1.5">
								<Label className="text-sm font-medium">Image URLs</Label>
								<InputGroup variant="primary">
									<InputGroup.TextArea
										defaultValue={variant?.images.join("\n") ?? ""}
										placeholder="https://..."
										rows={4}
									/>
								</InputGroup>
							</TextField>

							<div className="flex flex-wrap gap-6 rounded-xl border border-border bg-secondary/50 p-3">
								<Switch defaultSelected={variant?.isDefault ?? false} size="sm">
									<Switch.Control>
										<Switch.Thumb />
									</Switch.Control>
									<Switch.Content>
										<Label className="text-sm">Default variant</Label>
									</Switch.Content>
								</Switch>
							</div>
						</Modal.Body>

						<Modal.Footer className="flex justify-end gap-2">
							<Button variant="ghost" onPress={onClose}>
								Cancel
							</Button>
							<Button variant="primary" onPress={onClose}>
								{isEditing ? "Save Preview" : "Create Preview"}
							</Button>
						</Modal.Footer>
					</Modal.Dialog>
				</Modal.Container>
			</Modal.Backdrop>
		</Modal>
	);
}

function FormSelect({
	defaultSelectedKey,
	label,
	options,
	placeholder,
}: {
	defaultSelectedKey?: string;
	label: string;
	options: VariantOption[];
	placeholder: string;
}) {
	return (
		<Select
			className="flex flex-col gap-1.5"
			defaultSelectedKey={defaultSelectedKey}
			placeholder={placeholder}
		>
			<Label className="text-sm font-medium">{label}</Label>
			<Select.Trigger>
				<Select.Value />
				<Select.Indicator />
			</Select.Trigger>
			<Select.Popover>
				<ListBox>
					{options.map((option) => (
						<ListBox.Item
							key={option.id}
							id={option.id}
							textValue={option.label}
						>
							{option.label}
							<ListBox.ItemIndicator />
						</ListBox.Item>
					))}
				</ListBox>
			</Select.Popover>
		</Select>
	);
}

function VariantDeleteModal({
	isOpen,
	onClose,
	variant,
}: {
	isOpen: boolean;
	onClose: () => void;
	variant: VariantMock | null;
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
							<Modal.Heading>Delete Variant</Modal.Heading>
						</Modal.Header>

						<Modal.Body>
							<p className="text-sm text-muted">
								Are you sure you want to delete{" "}
								<span className="font-medium text-foreground">
									{variant?.sku ?? "this variant"}
								</span>
								?
							</p>
						</Modal.Body>

						<Modal.Footer className="flex justify-end gap-2">
							<Button variant="ghost" onPress={onClose}>
								Cancel
							</Button>
							<Button variant="danger" onPress={onClose}>
								Delete Preview
							</Button>
						</Modal.Footer>
					</Modal.Dialog>
				</Modal.Container>
			</Modal.Backdrop>
		</Modal>
	);
}

export function VariantsPage() {
	const [demoState, setDemoState] = useState<DemoState>("data");
	const [previewMessage, setPreviewMessage] = useState(
		"UI preview uses local mock data",
	);
	const [formModal, setFormModal] = useState<{
		mode: VariantModalMode;
		variant: VariantMock | null;
	} | null>(null);
	const [deleteVariant, setDeleteVariant] = useState<VariantMock | null>(null);

	return (
		<div className="flex flex-col gap-6">
			<VariantStatCards />

			<Card className="border-accent/20 bg-accent/5 px-4 py-3">
				<Card.Content className="flex flex-col gap-2 p-0 sm:flex-row sm:items-center sm:justify-between">
					<div className="flex min-w-0 items-start gap-3">
						<PackageCheck size={18} className="mt-0.5 shrink-0 text-accent" />
						<div className="min-w-0">
							<p className="text-sm font-medium text-foreground">
								{previewMessage}
							</p>
							<p className="mt-1 text-xs text-muted">
								Buttons and controls only update local UI state.
							</p>
						</div>
					</div>
					<Button
						className="shrink-0"
						size="sm"
						variant="secondary"
						onPress={() => setPreviewMessage("UI preview uses local mock data")}
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
							<VariantsFilterSidebar onPreviewChange={setPreviewMessage} />
						</Disclosure.Body>
					</Disclosure.Content>
				</Disclosure>
			</div>

			<div className="grid min-w-0 items-start gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
				<aside className="hidden lg:h-[calc(100vh-8rem)] lg:min-h-[520px] lg:block">
					<VariantsFilterSidebar
						className="sticky top-0 h-full"
						onPreviewChange={setPreviewMessage}
					/>
				</aside>
				<VariantsResults
					demoState={demoState}
					onAdd={() => setFormModal({ mode: "create", variant: null })}
					onDelete={setDeleteVariant}
					onDemoStateChange={setDemoState}
					onEdit={(variant) => setFormModal({ mode: "edit", variant })}
					onPreviewChange={setPreviewMessage}
				/>
			</div>

			<VariantFormModal
				isOpen={formModal !== null}
				mode={formModal?.mode ?? "create"}
				variant={formModal?.variant ?? null}
				onClose={() => setFormModal(null)}
			/>

			<VariantDeleteModal
				isOpen={deleteVariant !== null}
				variant={deleteVariant}
				onClose={() => setDeleteVariant(null)}
			/>
		</div>
	);
}
