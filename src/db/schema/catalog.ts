import {
	boolean,
	index,
	integer,
	numeric,
	pgTable,
	text,
	unique,
	uuid,
} from "drizzle-orm/pg-core";
import { timestamps, uuidId } from "./shared";

export const category = pgTable(
	"category",
	{
		id: uuidId(),
		name: text("name").notNull(),
		slug: text("slug").notNull(),
		image: text("image"),
		...timestamps,
	},
	(table) => [unique("category_slug_unique").on(table.slug)],
);

export const color = pgTable("color", {
	id: uuidId(),
	name: text("name").notNull(),
	hexCode: text("hex_code"),
	...timestamps,
});

export const storage = pgTable("storage", {
	id: uuidId(),
	name: text("name").notNull(),
	valueGb: integer("value_gb").notNull(),
	...timestamps,
});

export const ram = pgTable("ram", {
	id: uuidId(),
	name: text("name").notNull(),
	valueGb: integer("value_gb").notNull(),
	...timestamps,
});

export const screenSize = pgTable("screen_size", {
	id: uuidId(),
	name: text("name").notNull(),
	valueInches: numeric("value_inches", { precision: 4, scale: 1 }).notNull(),
	...timestamps,
});

export const product = pgTable(
	"product",
	{
		id: uuidId(),
		categoryId: uuid("category_id")
			.notNull()
			.references(() => category.id, { onDelete: "restrict" }),
		name: text("name").notNull(),
		brand: text("brand").notNull(),
		slug: text("slug").notNull(),
		shortDescription: text("short_description"),
		description: text("description").notNull(),
		warrantyInfo: text("warranty_info"),
		image: text("image"),
		ratingAvg: numeric("rating_avg", { precision: 2, scale: 1 })
			.default("0.0")
			.notNull(),
		reviewsCount: integer("reviews_count").default(0).notNull(),
		isFeatured: boolean("is_featured").default(false).notNull(),
		isBestseller: boolean("is_bestseller").default(false).notNull(),
		isActive: boolean("is_active").default(true).notNull(),
		...timestamps,
	},
	(table) => [
		unique("product_slug_unique").on(table.slug),
		index("product_category_id_idx").on(table.categoryId),
	],
);

export const variant = pgTable(
	"variant",
	{
		id: uuidId(),
		productId: uuid("product_id")
			.notNull()
			.references(() => product.id, { onDelete: "cascade" }),
		sku: text("sku").notNull(),
		price: numeric("price", { precision: 10, scale: 2 }).notNull(),
		compareAtPrice: numeric("compare_at_price", { precision: 10, scale: 2 }),
		stockQuantity: integer("stock_quantity").default(0).notNull(),
		colorId: uuid("color_id").references(() => color.id, {
			onDelete: "set null",
		}),
		storageId: uuid("storage_id").references(() => storage.id, {
			onDelete: "set null",
		}),
		ramId: uuid("ram_id").references(() => ram.id, { onDelete: "set null" }),
		screenSizeId: uuid("screen_size_id").references(() => screenSize.id, {
			onDelete: "set null",
		}),
		isDefault: boolean("is_default").default(false).notNull(),
		...timestamps,
	},
	(table) => [
		unique("variant_sku_unique").on(table.sku),
		index("variant_product_id_idx").on(table.productId),
		index("variant_color_id_idx").on(table.colorId),
		index("variant_storage_id_idx").on(table.storageId),
		index("variant_ram_id_idx").on(table.ramId),
		index("variant_screen_size_id_idx").on(table.screenSizeId),
	],
);

export const variantImage = pgTable(
	"variant_image",
	{
		id: uuidId(),
		variantId: uuid("variant_id")
			.notNull()
			.references(() => variant.id, { onDelete: "cascade" }),
		image: text("image").notNull(),
		sortOrder: integer("sort_order").default(0).notNull(),
		...timestamps,
	},
	(table) => [
		index("variant_image_variant_id_idx").on(table.variantId),
		index("variant_image_sort_order_idx").on(table.sortOrder),
	],
);
