import {
	Button,
	Card,
	Chip,
	Dropdown,
	InputGroup,
	ListBox,
	Select,
	Table,
	TextField,
} from "@heroui/react";
import { ImageIcon, MoreHorizontal, Plus, Search } from "lucide-react";
import { AdminPageHeader } from "#/components/admin/sections/admin-page";

type AdminCategoryMock = {
	id: string;
	name: string;
	slug: string;
	image: string | null;
	createdAt: string;
	updatedAt: string;
	productCount: number;
};

const CATEGORY_SEARCH_TYPES = [
	{ id: "name", label: "Name" },
	{ id: "id", label: "ID" },
	{ id: "slug", label: "Slug" },
];

const MOCK_CATEGORIES: AdminCategoryMock[] = [
	{
		id: "cat_01j9q9xp_laptops",
		name: "Laptops",
		slug: "laptops",
		image: null,
		createdAt: "2026-01-14T10:20:00.000Z",
		updatedAt: "2026-05-29T08:12:00.000Z",
		productCount: 38,
	},
	{
		id: "cat_01j9q9xp_phones",
		name: "Smartphones",
		slug: "smartphones",
		image: null,
		createdAt: "2026-01-15T09:10:00.000Z",
		updatedAt: "2026-05-26T11:44:00.000Z",
		productCount: 52,
	},
	{
		id: "cat_01j9q9xp_audio",
		name: "Audio",
		slug: "audio",
		image: null,
		createdAt: "2026-02-02T13:32:00.000Z",
		updatedAt: "2026-05-18T15:02:00.000Z",
		productCount: 21,
	},
	{
		id: "cat_01j9q9xp_gaming",
		name: "Gaming",
		slug: "gaming",
		image: null,
		createdAt: "2026-02-18T16:08:00.000Z",
		updatedAt: "2026-05-20T10:36:00.000Z",
		productCount: 17,
	},
	{
		id: "cat_01j9q9xp_accessories",
		name: "Accessories",
		slug: "accessories",
		image: null,
		createdAt: "2026-03-04T08:48:00.000Z",
		updatedAt: "2026-05-22T14:18:00.000Z",
		productCount: 64,
	},
];

function formatDate(value: string) {
	return new Intl.DateTimeFormat("en-US", {
		day: "numeric",
		month: "short",
		year: "numeric",
	}).format(new Date(value));
}

function shortId(value: string) {
	return value.length > 12 ? `${value.slice(0, 12)}...` : value;
}

function CategoryImage({
	image,
	name,
}: {
	image: string | null;
	name: string;
}) {
	if (image) {
		return (
			<img
				src={image}
				alt={name}
				className="size-10 shrink-0 rounded-lg border border-border object-cover"
			/>
		);
	}

	return (
		<div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border bg-secondary">
			<ImageIcon size={16} className="text-muted" />
		</div>
	);
}

function CategoryIdentity({ category }: { category: AdminCategoryMock }) {
	return (
		<div className="flex min-w-0 items-center gap-3">
			<CategoryImage image={category.image} name={category.name} />
			<div className="min-w-0">
				<p className="truncate text-sm font-medium text-foreground">
					{category.name}
				</p>
				<p className="mt-0.5 truncate text-xs text-muted">/{category.slug}</p>
			</div>
		</div>
	);
}

function CategoryActions() {
	return (
		<Dropdown>
			<Button
				aria-label="Category actions"
				isIconOnly
				size="sm"
				variant="ghost"
			>
				<MoreHorizontal size={16} />
			</Button>
			<Dropdown.Popover className="min-w-36">
				<div className="flex flex-col gap-1 p-1">
					<Button className="justify-start" size="sm" variant="ghost">
						Edit
					</Button>
					<Button className="justify-start" size="sm" variant="ghost">
						Duplicate
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

function CategoriesToolbar() {
	return (
		<Card className="p-3">
			<Card.Content className="flex flex-col gap-3 p-0 xl:flex-row xl:items-center xl:justify-between">
				<div className="flex min-w-0 flex-1 flex-col gap-2 md:flex-row">
					<TextField className="min-w-0 flex-1" name="search">
						<InputGroup fullWidth variant="primary">
							<InputGroup.Prefix>
								<Search size={14} className="text-muted" />
							</InputGroup.Prefix>
							<InputGroup.Input
								aria-label="Search categories"
								placeholder="Search categories"
							/>
						</InputGroup>
					</TextField>

					<Select
						className="w-full md:w-36"
						defaultSelectedKey="name"
						placeholder="Search by"
					>
						<Select.Trigger>
							<Select.Value />
							<Select.Indicator />
						</Select.Trigger>
						<Select.Popover>
							<ListBox>
								{CATEGORY_SEARCH_TYPES.map((option) => (
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
				</div>

				<div className="flex flex-wrap items-center gap-2">
					<Button size="sm" variant="primary">
						<Plus size={16} />
						Add Category
					</Button>
				</div>
			</Card.Content>
		</Card>
	);
}

function CategoriesTable() {
	return (
		<Card className="overflow-hidden">
			<Card.Content className="p-0">
				<Table>
					<Table.ScrollContainer>
						<Table.Content aria-label="Categories" className="min-w-[860px]">
							<Table.Header>
								<Table.Column isRowHeader className="w-[280px]">
									Category
								</Table.Column>
								<Table.Column>ID</Table.Column>
								<Table.Column>Products</Table.Column>
								<Table.Column>Created</Table.Column>
								<Table.Column>Updated</Table.Column>
								<Table.Column className="w-12">Actions</Table.Column>
							</Table.Header>
							<Table.Body>
								{MOCK_CATEGORIES.map((category) => (
									<Table.Row key={category.id}>
										<Table.Cell>
											<CategoryIdentity category={category} />
										</Table.Cell>
										<Table.Cell>
											<code className="rounded bg-secondary px-1.5 py-1 text-xs text-muted">
												{shortId(category.id)}
											</code>
										</Table.Cell>
										<Table.Cell>
											<Chip size="sm" variant="soft">
												{category.productCount} products
											</Chip>
										</Table.Cell>
										<Table.Cell>
											<span className="text-sm text-muted">
												{formatDate(category.createdAt)}
											</span>
										</Table.Cell>
										<Table.Cell>
											<span className="text-sm text-muted">
												{formatDate(category.updatedAt)}
											</span>
										</Table.Cell>
										<Table.Cell>
											<CategoryActions />
										</Table.Cell>
									</Table.Row>
								))}
							</Table.Body>
						</Table.Content>
					</Table.ScrollContainer>
				</Table>
			</Card.Content>
		</Card>
	);
}

function CategoryStats() {
	return (
		<div className="grid gap-3 sm:grid-cols-3">
			<Card className="p-4">
				<Card.Content className="p-0">
					<p className="text-xs font-medium uppercase text-muted">Categories</p>
					<p className="mt-2 text-2xl font-semibold text-foreground">
						{MOCK_CATEGORIES.length}
					</p>
				</Card.Content>
			</Card>
			<Card className="p-4">
				<Card.Content className="p-0">
					<p className="text-xs font-medium uppercase text-muted">Products</p>
					<p className="mt-2 text-2xl font-semibold text-foreground">194</p>
				</Card.Content>
			</Card>
			<Card className="p-4">
				<Card.Content className="p-0">
					<p className="text-xs font-medium uppercase text-muted">
						Without image
					</p>
					<p className="mt-2 text-2xl font-semibold text-foreground">5</p>
				</Card.Content>
			</Card>
		</div>
	);
}

export function CategoriesPage() {
	return (
		<div className="flex flex-col gap-6">
			<AdminPageHeader
				title="Categories"
				description="Manage product category structure"
			/>

			<CategoryStats />

			<div className="flex min-w-0 flex-col gap-3">
				<CategoriesToolbar />
				<CategoriesTable />
			</div>
		</div>
	);
}
