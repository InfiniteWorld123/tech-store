import {
	Button,
	Card,
	Chip,
	Dropdown,
	InputGroup,
	Pagination,
	Table,
	Tabs,
	TextField,
} from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import {
	ChevronDown,
	Grid3X3,
	LayoutList,
	MoreHorizontal,
	Package,
	Plus,
	Search,
	Star,
	TableProperties,
} from "lucide-react";
import { listProductsQueryOptions } from "#/queries/products.queries";
import { Route } from "#/routes/admin/products";
import type {
	AdminProductListItemType,
	GetProductsInputType,
	GetProductsOutputType,
} from "#/server/catalog/products/products.types";
import {
	ProductsEmptyState,
	ProductsErrorState,
	ProductsResultsSkeleton,
} from "./products-states";

type ProductsViewProps = {
	products: AdminProductListItemType[];
};

type ProductsPaginationProps = {
	pagination?: GetProductsOutputType["pagination"];
	onPageChange?: (page: number) => void;
	onPageSizeChange?: (limit: number) => void;
};

const SEARCH_TYPE_OPTIONS = [
	{ id: "name", label: "Name" },
	{ id: "brand", label: "Brand" },
	{ id: "slug", label: "Slug" },
];

const SORT_OPTIONS = [
	{ id: "createdAt-desc", label: "Newest first" },
	{ id: "createdAt-asc", label: "Oldest first" },
	{ id: "name-asc", label: "Name A-Z" },
	{ id: "price-desc", label: "Price high-low" },
	{ id: "price-asc", label: "Price low-high" },
	{ id: "rating-desc", label: "Top rated" },
	{ id: "reviews-desc", label: "Most reviewed" },
];

const PAGE_SIZE_OPTIONS = [
	{ id: "10", label: "10 / page" },
	{ id: "25", label: "25 / page" },
	{ id: "50", label: "50 / page" },
	{ id: "100", label: "100 / page" },
];

type ProductImageSize = "sm" | "md" | "lg";

type SelectOption = {
	id: string;
	label: string;
};

const PRODUCT_IMAGE_CLASSES: Record<ProductImageSize, string> = {
	sm: "size-10 rounded-lg",
	md: "size-12 rounded-xl",
	lg: "size-16 rounded-xl",
};

function formatCurrency(value: number | null) {
	if (value === null) return "—";

	return `€${value.toLocaleString()}`;
}

function formatDate(value: string) {
	return new Intl.DateTimeFormat("en-US", {
		day: "numeric",
		month: "short",
		year: "numeric",
	}).format(new Date(value));
}

function ProductImage({
	name,
	size = "sm",
	src,
}: {
	name: string;
	size?: ProductImageSize;
	src: string | null;
}) {
	const className = `${PRODUCT_IMAGE_CLASSES[size]} shrink-0 border border-border object-cover`;

	if (src) {
		return <img src={src} alt={name} className={className} />;
	}

	return (
		<div
			className={`${PRODUCT_IMAGE_CLASSES[size]} flex shrink-0 items-center justify-center border border-border bg-secondary`}
		>
			<Package size={size === "lg" ? 22 : 16} className="text-muted" />
		</div>
	);
}

function ProductIdentity({
	imageSize = "sm",
	product,
}: {
	imageSize?: ProductImageSize;
	product: AdminProductListItemType;
}) {
	return (
		<div className="flex min-w-0 items-center gap-3">
			<ProductImage name={product.name} size={imageSize} src={product.image} />
			<div className="min-w-0">
				<p className="truncate text-sm font-medium text-foreground">
					{product.name}
				</p>
				<p className="mt-0.5 truncate text-xs text-muted">
					{product.brand} · {product.sku ?? "No SKU"}
				</p>
			</div>
		</div>
	);
}

function PriceCell({
	compareAtPrice,
	price,
}: {
	compareAtPrice: number | null;
	price: number | null;
}) {
	return (
		<div className="flex flex-col">
			<span className="text-sm font-medium text-foreground">
				{formatCurrency(price)}
			</span>
			{compareAtPrice ? (
				<span className="text-xs text-muted line-through">
					{formatCurrency(compareAtPrice)}
				</span>
			) : null}
		</div>
	);
}

function StockCell({ stock }: { stock: number | null }) {
	if (stock === null) return <span className="text-sm text-muted">—</span>;

	const colorClass =
		stock === 0
			? "text-danger font-semibold"
			: stock < 10
				? "text-warning font-semibold"
				: "text-foreground";

	return <span className={`text-sm ${colorClass}`}>{stock}</span>;
}

function StatusCell({
	isActive,
	isBestseller,
	isFeatured,
	isSale,
}: {
	isActive: boolean;
	isBestseller: boolean;
	isFeatured: boolean;
	isSale: boolean;
}) {
	return (
		<div className="flex flex-wrap gap-1">
			<Chip color={isActive ? "success" : "danger"} size="sm" variant="soft">
				{isActive ? "Active" : "Inactive"}
			</Chip>
			{isFeatured ? (
				<Chip color="accent" size="sm" variant="soft">
					Featured
				</Chip>
			) : null}
			{isBestseller ? (
				<Chip color="warning" size="sm" variant="soft">
					Bestseller
				</Chip>
			) : null}
			{isSale ? (
				<Chip color="danger" size="sm" variant="soft">
					Sale
				</Chip>
			) : null}
		</div>
	);
}

function RatingCell({
	ratingAvg,
	reviewsCount,
}: {
	ratingAvg: number;
	reviewsCount: number;
}) {
	if (reviewsCount === 0) {
		return <span className="text-sm text-muted">No reviews</span>;
	}

	return (
		<div className="flex items-center gap-1">
			<Star size={13} className="fill-warning text-warning" />
			<span className="text-sm text-foreground">{ratingAvg.toFixed(1)}</span>
			<span className="text-xs text-muted">({reviewsCount})</span>
		</div>
	);
}

function ActionsCell() {
	return (
		<Dropdown>
			<Button aria-label="Actions" isIconOnly size="sm" variant="ghost">
				<MoreHorizontal size={16} />
			</Button>
			<Dropdown.Popover className="min-w-32">
				<div className="flex flex-col gap-1 p-1">
					<Button className="justify-start" size="sm" variant="ghost">
						Edit
					</Button>
					<Button
						className="justify-start text-danger"
						size="sm"
						variant="ghost"
					>
						Delete
					</Button>
				</div>
			</Dropdown.Popover>
		</Dropdown>
	);
}

function MockSelect({
	ariaLabel,
	className,
	defaultSelectedKey,
	onSelect,
	options,
	placeholder,
}: {
	ariaLabel: string;
	className?: string;
	defaultSelectedKey: string;
	onSelect?: (key: string) => void;
	options: SelectOption[];
	placeholder: string;
}) {
	const selectedOption =
		options.find((option) => option.id === defaultSelectedKey)?.label ??
		placeholder;

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

function ProductMetric({
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

export function ProductsResults({
	className = "",
	queryInput,
}: {
	className?: string;
	queryInput: GetProductsInputType;
}) {
	const { data, isError, isLoading, refetch } = useQuery(
		listProductsQueryOptions({ data: queryInput }),
	);

	const search = Route.useSearch();
	const navigate = Route.useNavigate();

	const products = data?.data.items ?? [];
	const pagination = data?.data.pagination;
	const hasProducts = products.length > 0;

	if (isLoading) {
		return <ProductsResultsSkeleton className={className} />;
	}

	if (isError) {
		return (
			<div className={`flex min-w-0 flex-col lg:min-h-0 ${className}`}>
				<ProductsErrorState onRetry={() => void refetch()} />
			</div>
		);
	}

	return (
		<Tabs
			defaultSelectedKey="table"
			className={`flex min-w-0 flex-col gap-3 lg:min-h-0 ${className}`}
		>
			<div className="shrink-0 rounded-2xl border border-border bg-surface p-2 shadow-sm">
				<div className="flex flex-col gap-2 xl:flex-row xl:items-center">
					<div className="flex min-w-0 flex-1 flex-col gap-2 md:flex-row">
						<form
							className="min-w-0 flex-1"
							onSubmit={(event) => {
								event.preventDefault();

								const formData = new FormData(event.currentTarget);
								const searchValue = String(formData.get("search") ?? "").trim();

								navigate({
									search: (prev) => ({
										...prev,
										search: searchValue || undefined,
										page: 1,
									}),
								});
							}}
						>
							<TextField
								className="min-w-0"
								defaultValue={search.search ?? ""}
								name="search"
							>
								<InputGroup fullWidth variant="primary">
									<InputGroup.Prefix>
										<Search size={14} className="text-muted" />
									</InputGroup.Prefix>
									<InputGroup.Input
										aria-label="Search products"
										placeholder="Search products"
									/>
								</InputGroup>
							</TextField>
						</form>

						<MockSelect
							ariaLabel="Search type"
							className="w-full md:w-32"
							defaultSelectedKey={search.searchType}
							options={SEARCH_TYPE_OPTIONS}
							placeholder="Search by"
							onSelect={(searchType) =>
								navigate({
									search: (prev) => ({
										...prev,
										searchType: searchType as typeof prev.searchType,
										page: 1,
									}),
								})
							}
						/>

						<MockSelect
							ariaLabel="Sort products"
							className="w-full md:w-40"
							defaultSelectedKey={search.sort}
							options={SORT_OPTIONS}
							placeholder="Sort"
							onSelect={(sort) =>
								navigate({
									search: (prev) => ({
										...prev,
										sort: sort as typeof prev.sort,
										page: 1,
									}),
								})
							}
						/>
					</div>

					<div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
						<Tabs.ListContainer className="w-full min-w-0 sm:w-auto">
							<Tabs.List
								aria-label="Product views"
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

						<Button className="shrink-0" size="sm" variant="primary">
							<Plus size={16} />
							Add Product
						</Button>
					</div>
				</div>
			</div>

			{hasProducts ? (
				<>
					<Tabs.Panel
						id="table"
						className="min-h-0 min-w-0 flex-1 overflow-auto"
					>
						<ProductTableView products={products} />
					</Tabs.Panel>
					<Tabs.Panel
						id="list"
						className="min-h-0 min-w-0 flex-1 overflow-auto"
					>
						<ProductListView products={products} />
					</Tabs.Panel>
					<Tabs.Panel
						id="cards"
						className="min-h-0 min-w-0 flex-1 overflow-auto"
					>
						<ProductCardGrid products={products} />
					</Tabs.Panel>
				</>
			) : (
				<div className="min-h-0 min-w-0 flex-1 overflow-auto">
					<ProductsEmptyState />
				</div>
			)}

			<ProductsPagination
				pagination={pagination}
				onPageChange={(page) =>
					navigate({
						search: (prev) => ({
							...prev,
							page,
						}),
					})
				}
				onPageSizeChange={(limit) =>
					navigate({
						search: (prev) => ({
							...prev,
							limit,
							page: 1,
						}),
					})
				}
			/>
		</Tabs>
	);
}

export function ProductTableView({ products }: ProductsViewProps) {
	return (
		<Table>
			<Table.ScrollContainer>
				<Table.Content aria-label="Products" className="min-w-[900px]">
					<Table.Header>
						<Table.Column isRowHeader className="w-[320px]">
							Product
						</Table.Column>
						<Table.Column>Price</Table.Column>
						<Table.Column>Stock</Table.Column>
						<Table.Column className="min-w-[190px]">Status</Table.Column>
						<Table.Column>Rating</Table.Column>
						<Table.Column className="w-12">Actions</Table.Column>
					</Table.Header>
					<Table.Body>
						{products.map((product) => (
							<Table.Row key={product.id}>
								<Table.Cell>
									<ProductIdentity product={product} />
								</Table.Cell>
								<Table.Cell>
									<PriceCell
										compareAtPrice={product.compareAtPrice}
										price={product.price}
									/>
								</Table.Cell>
								<Table.Cell>
									<StockCell stock={product.stockQuantity} />
								</Table.Cell>
								<Table.Cell>
									<StatusCell
										isActive={product.isActive}
										isBestseller={product.isBestseller}
										isFeatured={product.isFeatured}
										isSale={product.compareAtPrice !== null}
									/>
								</Table.Cell>
								<Table.Cell>
									<RatingCell
										ratingAvg={product.ratingAvg}
										reviewsCount={product.reviewsCount}
									/>
								</Table.Cell>
								<Table.Cell>
									<ActionsCell />
								</Table.Cell>
							</Table.Row>
						))}
					</Table.Body>
				</Table.Content>
			</Table.ScrollContainer>
		</Table>
	);
}

export function ProductListView({ products }: ProductsViewProps) {
	return (
		<div className="flex flex-col gap-3">
			{products.map((product) => (
				<Card key={product.id}>
					<Card.Content className="p-4">
						<div className="flex flex-col gap-4 xl:flex-row xl:items-center">
							<div className="flex min-w-0 flex-1 items-start justify-between gap-3">
								<ProductIdentity imageSize="md" product={product} />
								<div className="xl:hidden">
									<ActionsCell />
								</div>
							</div>

							<div className="grid min-w-0 grid-cols-2 gap-4 sm:grid-cols-4 xl:w-[520px]">
								<ProductMetric label="Price">
									<PriceCell
										compareAtPrice={product.compareAtPrice}
										price={product.price}
									/>
								</ProductMetric>
								<ProductMetric label="Stock">
									<StockCell stock={product.stockQuantity} />
								</ProductMetric>
								<ProductMetric label="Rating">
									<RatingCell
										ratingAvg={product.ratingAvg}
										reviewsCount={product.reviewsCount}
									/>
								</ProductMetric>
								<ProductMetric label="Updated">
									<span>{formatDate(product.updatedAt)}</span>
								</ProductMetric>
							</div>

							<div className="flex min-w-0 items-start justify-between gap-3 xl:w-[220px]">
								<StatusCell
									isActive={product.isActive}
									isBestseller={product.isBestseller}
									isFeatured={product.isFeatured}
									isSale={product.compareAtPrice !== null}
								/>
								<div className="hidden xl:block">
									<ActionsCell />
								</div>
							</div>
						</div>
					</Card.Content>
				</Card>
			))}
		</div>
	);
}

export function ProductCardGrid({ products }: ProductsViewProps) {
	return (
		<div className="grid grid-cols-1 gap-4 xl:grid-cols-2 2xl:grid-cols-3">
			{products.map((product) => (
				<Card key={product.id} className="min-h-[260px]">
					<Card.Header className="flex-row items-start justify-between gap-3 p-4">
						<ProductIdentity imageSize="lg" product={product} />
						<ActionsCell />
					</Card.Header>

					<Card.Content className="flex flex-1 flex-col gap-4 px-4 pb-4 pt-0">
						<StatusCell
							isActive={product.isActive}
							isBestseller={product.isBestseller}
							isFeatured={product.isFeatured}
							isSale={product.compareAtPrice !== null}
						/>

						<div className="grid grid-cols-2 gap-4">
							<ProductMetric label="Price">
								<PriceCell
									compareAtPrice={product.compareAtPrice}
									price={product.price}
								/>
							</ProductMetric>
							<ProductMetric label="Stock">
								<StockCell stock={product.stockQuantity} />
							</ProductMetric>
							<ProductMetric label="Rating">
								<RatingCell
									ratingAvg={product.ratingAvg}
									reviewsCount={product.reviewsCount}
								/>
							</ProductMetric>
							<ProductMetric label="Slug">
								<span className="block truncate text-xs text-muted">
									{product.slug}
								</span>
							</ProductMetric>
						</div>
					</Card.Content>

					<Card.Footer className="mt-auto justify-between border-t border-border px-4 py-3">
						<span className="text-xs text-muted">
							SKU: {product.sku ?? "Unassigned"}
						</span>
						<span className="text-xs text-muted">
							{formatDate(product.updatedAt)}
						</span>
					</Card.Footer>
				</Card>
			))}
		</div>
	);
}

function ProductsPagination({
	onPageChange,
	onPageSizeChange,
	pagination,
}: ProductsPaginationProps) {
	const page = pagination?.page ?? 1;
	const limit = pagination?.limit ?? 10;
	const total = pagination?.total ?? 0;
	const totalPages = Math.max(pagination?.totalPages ?? 1, 1);
	const startItem = total === 0 ? 0 : (page - 1) * limit + 1;
	const endItem = Math.min(page * limit, total);
	const hasPreviousPage = pagination?.hasPreviousPage ?? false;
	const hasNextPage = pagination?.hasNextPage ?? false;

	return (
		<div className="flex shrink-0 flex-col gap-3 rounded-2xl border border-border bg-surface px-3 py-3 shadow-sm lg:flex-row lg:items-center lg:justify-between">
			<div className="flex flex-col gap-2 sm:flex-row sm:items-center">
				<p className="text-sm text-muted">
					Showing{" "}
					<span className="font-medium text-foreground">
						{startItem}-{endItem}
					</span>{" "}
					of <span className="font-medium text-foreground">{total}</span>{" "}
					products
				</p>
				<MockSelect
					ariaLabel="Rows per page"
					className="w-full sm:w-32"
					defaultSelectedKey={String(limit)}
					options={PAGE_SIZE_OPTIONS}
					placeholder="Rows"
					onSelect={(value) => onPageSizeChange?.(Number(value))}
				/>
			</div>

			<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between lg:justify-end">
				<span className="text-sm text-muted">
					Page {page} of {totalPages}
				</span>
				<Pagination size="sm">
					<Pagination.Content className="flex-wrap justify-start sm:justify-end">
						<Pagination.Item>
							<Pagination.Previous
								isDisabled={!hasPreviousPage}
								onPress={() => onPageChange?.(page - 1)}
							>
								<Pagination.PreviousIcon />
								<span className="hidden sm:inline">Previous</span>
							</Pagination.Previous>
						</Pagination.Item>
						<Pagination.Item>
							<Pagination.Link isActive>{page}</Pagination.Link>
						</Pagination.Item>
						<Pagination.Item>
							<Pagination.Next
								isDisabled={!hasNextPage}
								onPress={() => onPageChange?.(page + 1)}
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
