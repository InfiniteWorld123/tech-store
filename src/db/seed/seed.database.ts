import { and, eq, exists, inArray, not, notExists, or } from "drizzle-orm";
import type { BatchItem } from "drizzle-orm/batch";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import {
	cartItem,
	category,
	color,
	orderItem,
	product,
	ram,
	review,
	screenSize,
	storage,
	user,
	variant,
	variantImage,
} from "#/db/schema";
import type { SeedData } from "./seed.generator";

// biome-ignore lint/suspicious/noExplicitAny: works with any drizzle neon-http schema
type SeedDatabase = NeonHttpDatabase<any>;

const CHUNK_SIZE = 400;

const chunk = <T>(rows: T[]) =>
	Array.from({ length: Math.ceil(rows.length / CHUNK_SIZE) }, (_, index) =>
		rows.slice(index * CHUNK_SIZE, (index + 1) * CHUNK_SIZE),
	);

const upsertOptions = async (db: SeedDatabase, data: SeedData) => {
	await db.batch([
		db.insert(category).values(data.categories).onConflictDoNothing(),
		db.insert(color).values(data.colors).onConflictDoNothing(),
		db.insert(storage).values(data.storages).onConflictDoNothing(),
		db.insert(ram).values(data.rams).onConflictDoNothing(),
		db
			.insert(screenSize)
			.values(
				data.screenSizes.map((item) => ({
					name: item.name,
					valueInches: item.valueInches.toFixed(1),
				})),
			)
			.onConflictDoNothing(),
	]);

	const [categories, colors, storages, rams, screenSizes] = await db.batch([
		db.select({ id: category.id, slug: category.slug }).from(category),
		db
			.select({ id: color.id, name: color.name, hexCode: color.hexCode })
			.from(color),
		db.select({ id: storage.id, valueGb: storage.valueGb }).from(storage),
		db.select({ id: ram.id, valueGb: ram.valueGb }).from(ram),
		db
			.select({ id: screenSize.id, valueInches: screenSize.valueInches })
			.from(screenSize),
	]);

	return {
		categoryIds: new Map(categories.map((row) => [row.slug, row.id])),
		colorIds: new Map(
			data.colors.map((item) => [
				item.name,
				colors.find(
					(row) => row.name === item.name || row.hexCode === item.hexCode,
				)?.id,
			]),
		),
		storageIds: new Map(storages.map((row) => [row.valueGb, row.id])),
		ramIds: new Map(rams.map((row) => [row.valueGb, row.id])),
		screenSizeIds: new Map(
			screenSizes.map((row) => [Number(row.valueInches), row.id]),
		),
	};
};

const required = <K, V>(
	map: Map<K, V | undefined>,
	key: K,
	label: string,
): V => {
	const value = map.get(key);
	if (value === undefined)
		throw new Error(`Missing ${label} for ${String(key)}`);
	return value;
};

/**
 * Removes catalog rows that do not belong to the seed. Products referenced by
 * orders or carts cannot be deleted without breaking those records, so they
 * are only hidden (isActive = false).
 */
const removeLegacyCatalog = async (db: SeedDatabase, data: SeedData) => {
	const seedProductIds = data.products.map((item) => item.id);
	const referenced = await db
		.selectDistinct({ productId: variant.productId })
		.from(variant)
		.where(
			and(
				not(inArray(variant.productId, seedProductIds)),
				or(
					exists(
						db
							.select()
							.from(orderItem)
							.where(eq(orderItem.variantId, variant.id)),
					),
					exists(
						db
							.select()
							.from(cartItem)
							.where(eq(cartItem.variantId, variant.id)),
					),
				),
			),
		);
	const keptIds = referenced.map((row) => row.productId);
	const keep = [...seedProductIds, ...keptIds];

	const [hidden, deleted] = await db.batch([
		db
			.update(product)
			.set({ isActive: false })
			.where(inArray(product.id, keptIds))
			.returning({ id: product.id }),
		db
			.delete(product)
			.where(not(inArray(product.id, keep)))
			.returning({ id: product.id }),
	]);
	return {
		hiddenLegacyProducts: hidden.length,
		deletedLegacyProducts: deleted.length,
	};
};

const removeUnusedTaxonomy = async (db: SeedDatabase) => {
	const [categories] = await db.batch([
		db
			.delete(category)
			.where(
				notExists(
					db.select().from(product).where(eq(product.categoryId, category.id)),
				),
			)
			.returning({ id: category.id }),
		db
			.delete(color)
			.where(
				notExists(
					db.select().from(variant).where(eq(variant.colorId, color.id)),
				),
			),
		db
			.delete(storage)
			.where(
				notExists(
					db.select().from(variant).where(eq(variant.storageId, storage.id)),
				),
			),
		db
			.delete(ram)
			.where(
				notExists(db.select().from(variant).where(eq(variant.ramId, ram.id))),
			),
		db
			.delete(screenSize)
			.where(
				notExists(
					db
						.select()
						.from(variant)
						.where(eq(variant.screenSizeId, screenSize.id)),
				),
			),
	]);
	return { deletedEmptyCategories: categories.length };
};

/** Replaces the seed catalog, customers, and reviews in one transaction. */
export const writeSeed = async (
	db: SeedDatabase,
	data: SeedData,
	options: { replaceCatalog?: boolean } = {},
) => {
	const legacy = options.replaceCatalog
		? await removeLegacyCatalog(db, data)
		: null;
	const ids = await upsertOptions(db, data);

	const productRows = data.products.map((item) => ({
		id: item.id,
		categoryId: required(ids.categoryIds, item.categorySlug, "category"),
		name: item.name,
		brand: item.brand,
		slug: item.slug,
		shortDescription: item.shortDescription,
		description: item.description,
		warrantyInfo: item.warrantyInfo,
		image: item.image,
		ratingAvg: item.ratingAvg,
		reviewsCount: item.reviewsCount,
		isFeatured: item.isFeatured,
		isBestseller: item.isBestseller,
		isActive: true,
		createdAt: item.createdAt,
		updatedAt: item.createdAt,
	}));
	const variantRows = data.variants.map((item) => ({
		id: item.id,
		productId: item.productId,
		sku: item.sku,
		price: item.price,
		compareAtPrice: item.compareAtPrice,
		stockQuantity: item.stockQuantity,
		colorId: item.colorName
			? required(ids.colorIds, item.colorName, "color")
			: null,
		storageId: item.storageGb
			? required(ids.storageIds, item.storageGb, "storage")
			: null,
		ramId: item.ramGb ? required(ids.ramIds, item.ramGb, "RAM") : null,
		screenSizeId: item.screenInches
			? required(ids.screenSizeIds, item.screenInches, "screen size")
			: null,
		isDefault: item.isDefault,
		createdAt: item.createdAt,
		updatedAt: item.createdAt,
	}));
	const imageRows = data.variants.flatMap((item) =>
		item.images.map((image, sortOrder) => ({
			variantId: item.id,
			image,
			sortOrder,
		})),
	);
	const customerRows = data.customers.map((item) => ({
		id: item.id,
		name: item.name,
		email: item.email,
		emailVerified: true,
		role: "customer" as const,
		createdAt: item.createdAt,
		updatedAt: item.createdAt,
	}));
	const reviewRows = data.reviews.map((item) => ({
		...item,
		updatedAt: item.createdAt,
	}));

	const statements: BatchItem<"pg">[] = [
		// Products cascade to variants, variant images, and reviews.
		db.delete(product).where(
			inArray(
				product.id,
				data.products.map((item) => item.id),
			),
		),
		db.delete(user).where(
			inArray(
				user.id,
				data.customers.map((item) => item.id),
			),
		),
		...chunk(productRows).map((rows) => db.insert(product).values(rows)),
		...chunk(variantRows).map((rows) => db.insert(variant).values(rows)),
		...chunk(imageRows).map((rows) => db.insert(variantImage).values(rows)),
		...chunk(customerRows).map((rows) => db.insert(user).values(rows)),
		...chunk(reviewRows).map((rows) => db.insert(review).values(rows)),
	];
	await db.batch(statements as [BatchItem<"pg">, ...BatchItem<"pg">[]]);

	const [products, variants, images, customers, reviews] = await db.batch([
		db
			.select({ id: product.id })
			.from(product)
			.where(
				inArray(
					product.id,
					data.products.map((item) => item.id),
				),
			),
		db
			.select({ id: variant.id })
			.from(variant)
			.where(
				inArray(
					variant.id,
					data.variants.map((item) => item.id),
				),
			),
		db
			.select({ id: variantImage.id })
			.from(variantImage)
			.where(
				inArray(
					variantImage.variantId,
					data.variants.map((item) => item.id),
				),
			),
		db
			.select({ id: user.id })
			.from(user)
			.where(
				inArray(
					user.id,
					data.customers.map((item) => item.id),
				),
			),
		db
			.select({ id: review.id })
			.from(review)
			.where(
				inArray(
					review.id,
					data.reviews.map((item) => item.id),
				),
			),
	]);

	const taxonomy = options.replaceCatalog
		? await removeUnusedTaxonomy(db)
		: null;

	return {
		...legacy,
		...taxonomy,
		products: products.length,
		variants: variants.length,
		variantImages: images.length,
		customers: customers.length,
		reviews: reviews.length,
	};
};
