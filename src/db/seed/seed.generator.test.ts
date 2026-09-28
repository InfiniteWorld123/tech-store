import { describe, expect, it } from "vitest";
import { buildSeedData, seedSummary } from "./seed.generator";

const now = new Date("2026-09-28T12:00:00.000Z");

describe("Tech Store seed generator", () => {
	it("creates the approved deterministic catalog", () => {
		expect(seedSummary(buildSeedData(now))).toEqual(
			seedSummary(buildSeedData(now)),
		);
		const summary = seedSummary(buildSeedData(now));
		expect(summary.categories).toBe(8);
		expect(summary.products).toBe(150);
		expect(summary.customers).toBe(60);
		expect(summary.reviews).toBe(300);
		expect(summary.productsOnSale).toBeGreaterThan(15);
	});

	it("keeps slugs, SKUs, and review authors unique", () => {
		const data = buildSeedData(now);
		const slugs = data.products.map((product) => product.slug);
		const skus = data.variants.map((variant) => variant.sku);
		const pairs = data.reviews.map(
			(item) => `${item.userId}:${item.productId}`,
		);
		expect(new Set(slugs).size).toBe(slugs.length);
		expect(new Set(skus).size).toBe(skus.length);
		expect(new Set(pairs).size).toBe(pairs.length);
	});

	it("gives every variant 2 to 4 shared images and one default per product", () => {
		const data = buildSeedData(now);
		for (const variant of data.variants) {
			expect(variant.images.length).toBeGreaterThanOrEqual(2);
			expect(variant.images.length).toBeLessThanOrEqual(4);
			for (const image of variant.images) {
				expect(image).toMatch(/\/images\/products\/[a-z0-9-]+\.webp$/);
			}
		}
		for (const product of data.products) {
			const defaults = data.variants.filter(
				(variant) => variant.productId === product.id && variant.isDefault,
			);
			expect(defaults).toHaveLength(1);
		}
	});

	it("keeps sale prices below list prices and ratings in sync", () => {
		const data = buildSeedData(now);
		for (const variant of data.variants) {
			if (variant.compareAtPrice) {
				expect(Number(variant.price)).toBeLessThan(
					Number(variant.compareAtPrice),
				);
			}
		}
		for (const product of data.products) {
			const ratings = data.reviews
				.filter((item) => item.productId === product.id)
				.map((item) => Number(item.rating));
			expect(product.reviewsCount).toBe(ratings.length);
			if (ratings.length) {
				const average =
					ratings.reduce((sum, value) => sum + value, 0) / ratings.length;
				expect(product.ratingAvg).toBe(average.toFixed(1));
			}
		}
	});
});
