import {
	type CategorySlug,
	colorHex,
	type ImageKind,
	type ProductSeed,
	seedCategories,
	seedProducts,
	type Tier,
} from "./catalog.data";

export const DEFAULT_IMAGE_BASE_URL = "https://techstore.yamanwarda.de";
const SEED_RANDOM_STATE = 20_260_928;
const CUSTOMER_COUNT = 60;
const REVIEW_TARGET = 300;
const DAY_MS = 86_400_000;

type Random = () => number;
type Tone = "dark" | "light" | "blue" | "green" | "sand";

export type SeedCategoryRow = {
	slug: CategorySlug;
	name: string;
	icon: string;
	iconColor: string;
	iconBg: string;
};

export type SeedVariantRow = {
	id: string;
	productId: string;
	sku: string;
	price: string;
	compareAtPrice: string | null;
	stockQuantity: number;
	colorName: string | null;
	storageGb: number | null;
	ramGb: number | null;
	screenInches: number | null;
	isDefault: boolean;
	images: string[];
	createdAt: Date;
};

export type SeedProductRow = {
	id: string;
	categorySlug: CategorySlug;
	name: string;
	brand: string;
	slug: string;
	shortDescription: string;
	description: string;
	warrantyInfo: string;
	image: string;
	ratingAvg: string;
	reviewsCount: number;
	isFeatured: boolean;
	isBestseller: boolean;
	createdAt: Date;
};

export type SeedCustomerRow = {
	id: string;
	name: string;
	email: string;
	createdAt: Date;
};

export type SeedReviewRow = {
	id: string;
	userId: string;
	productId: string;
	rating: string;
	title: string;
	comment: string;
	createdAt: Date;
};

export type SeedData = {
	categories: SeedCategoryRow[];
	colors: { name: string; hexCode: string }[];
	storages: { name: string; valueGb: number }[];
	rams: { name: string; valueGb: number }[];
	screenSizes: { name: string; valueInches: number }[];
	products: SeedProductRow[];
	variants: SeedVariantRow[];
	customers: SeedCustomerRow[];
	reviews: SeedReviewRow[];
};

const imagesByKind: Record<
	ImageKind,
	Partial<Record<Tone, string>> & { all: string[] }
> = {
	laptop: {
		dark: "laptop-midnight",
		light: "laptop-silver",
		blue: "laptop-graphite",
		all: ["laptop-silver", "laptop-graphite", "laptop-midnight"],
	},
	phone: {
		dark: "phone-black-front",
		light: "phone-white-front",
		blue: "phone-blue-back",
		green: "phone-green-back",
		all: [
			"phone-black-front",
			"phone-blue-back",
			"phone-white-front",
			"phone-green-back",
		],
	},
	tablet: {
		dark: "tablet-gray",
		light: "tablet-silver",
		all: ["tablet-silver", "tablet-gray"],
	},
	monitor: {
		dark: "monitor-black",
		light: "monitor-white",
		all: ["monitor-black", "monitor-white"],
	},
	headphones: {
		dark: "headphones-black",
		light: "headphones-sand",
		sand: "headphones-sand",
		all: ["headphones-black", "headphones-sand"],
	},
	earbuds: {
		dark: "earbuds-black",
		light: "earbuds-white",
		all: ["earbuds-white", "earbuds-black"],
	},
	speaker: {
		dark: "speaker-black",
		blue: "speaker-blue",
		all: ["speaker-black", "speaker-blue"],
	},
	watch: {
		dark: "watch-midnight",
		light: "watch-silver",
		sand: "watch-silver",
		all: ["watch-midnight", "watch-silver"],
	},
	controller: {
		dark: "controller-black",
		light: "controller-white",
		all: ["controller-white", "controller-black"],
	},
	keyboard: {
		dark: "keyboard-gray",
		light: "keyboard-white",
		all: ["keyboard-gray", "keyboard-white"],
	},
	mouse: {
		dark: "mouse-graphite",
		light: "mouse-white",
		all: ["mouse-graphite", "mouse-white"],
	},
	charger: {
		dark: "charger-black",
		light: "charger-white",
		all: ["charger-white", "charger-black"],
	},
	ssd: { dark: "ssd-black", blue: "ssd-blue", all: ["ssd-black", "ssd-blue"] },
};

const toneByColor: Record<string, Tone> = {
	Black: "dark",
	Graphite: "dark",
	Midnight: "dark",
	"Space Gray": "dark",
	Titanium: "dark",
	Red: "dark",
	White: "light",
	Silver: "light",
	Starlight: "light",
	Blue: "blue",
	Purple: "blue",
	Green: "green",
	Sand: "sand",
	Pink: "sand",
};

const reviewAspects: Record<ImageKind, string[]> = {
	laptop: [
		"battery life",
		"keyboard",
		"display",
		"build quality",
		"performance",
		"trackpad",
	],
	phone: [
		"camera",
		"battery life",
		"display",
		"size",
		"performance",
		"charging speed",
	],
	tablet: ["display", "battery life", "speakers", "pen support", "performance"],
	monitor: [
		"colour accuracy",
		"sharpness",
		"stand",
		"refresh rate",
		"brightness",
	],
	headphones: [
		"noise cancelling",
		"comfort",
		"sound quality",
		"battery life",
		"microphone",
	],
	earbuds: ["fit", "noise cancelling", "sound quality", "case", "call quality"],
	speaker: ["bass", "volume", "battery life", "build quality", "connectivity"],
	watch: ["battery life", "display", "fitness tracking", "comfort", "app"],
	controller: ["feel", "performance", "build quality", "battery life", "setup"],
	keyboard: [
		"typing feel",
		"build quality",
		"backlight",
		"battery life",
		"multi-device switching",
	],
	mouse: ["ergonomics", "scroll wheel", "battery life", "tracking", "clicks"],
	charger: [
		"charging speed",
		"size",
		"build quality",
		"compatibility",
		"cable",
	],
	ssd: ["transfer speed", "size", "durability", "compatibility", "price"],
};

const firstNames = [
	"Lena",
	"Jonas",
	"Sophie",
	"Felix",
	"Mia",
	"Lukas",
	"Emma",
	"Paul",
	"Hannah",
	"Leon",
	"Clara",
	"Noah",
	"Marie",
	"Elias",
	"Lea",
	"Ben",
	"Amelie",
	"Finn",
	"Laura",
	"Julian",
	"Sara",
	"Tim",
	"Nina",
	"David",
	"Aylin",
	"Omar",
	"Katarzyna",
	"Mateo",
	"Yuki",
	"Priya",
];
const lastNames = [
	"Müller",
	"Schmidt",
	"Schneider",
	"Fischer",
	"Weber",
	"Meyer",
	"Wagner",
	"Becker",
	"Hoffmann",
	"Schulz",
	"Koch",
	"Richter",
	"Klein",
	"Wolf",
	"Neumann",
	"Schwarz",
	"Zimmermann",
	"Braun",
	"Hartmann",
	"Krüger",
	"Yılmaz",
	"Nowak",
	"Rossi",
	"Tanaka",
	"Sharma",
];

const featuredNames = new Set([
	"MacBook Air 13 (M3)",
	"iPhone 16 Pro",
	"Galaxy S24 Ultra",
	"iPad Air 11 (M2)",
	"WH-1000XM5",
	"Apple Watch Series 10",
	"UltraGear 27GR95QE",
	"MX Master 3S",
	"PlayStation 5 Slim",
	"Steam Deck OLED",
	"Pixel 9 Pro",
	"Zenbook 14 OLED",
	"QuietComfort Ultra Headphones",
	"Galaxy Tab S9 FE",
	"Odyssey OLED G8",
	"Laptop 13",
]);
const bestsellerNames = new Set([
	"iPhone 16",
	"AirPods Pro 2",
	"MacBook Air 13 (M3)",
	"Galaxy S24",
	"PlayStation 5 Slim",
	"DualSense Wireless Controller",
	"iPad (10th generation)",
	"Flip 6",
	"Charge 5",
	"Nano Charger 65W",
	"Samsung T7 Shield Portable SSD",
	"Apple Watch SE",
	"Smart Band 9",
	"Pixel 8a",
	"Galaxy A55 5G",
	"Nintendo Switch – OLED Model",
	"WH-1000XM5",
	"MX Master 3S",
	"Tune 770NC",
	"Galaxy Watch7",
]);

const seedUuid = (namespace: number, index: number) =>
	`${namespace.toString(16).padStart(8, "0")}-0000-4000-8000-${index
		.toString()
		.padStart(12, "0")}`;

const createRandom = (state: number): Random => {
	let current = state >>> 0;
	return () => {
		current = (current + 0x6d2b79f5) >>> 0;
		let value = current;
		value = Math.imul(value ^ (value >>> 15), value | 1);
		value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
		return ((value ^ (value >>> 14)) >>> 0) / 4_294_967_296;
	};
};

const between = (random: Random, minimum: number, maximum: number) =>
	minimum + (maximum - minimum) * random();
const integerBetween = (random: Random, minimum: number, maximum: number) =>
	Math.floor(between(random, minimum, maximum + 1));
const pick = <T>(random: Random, values: readonly T[]): T =>
	values[Math.floor(random() * values.length)] as T;

const slugify = (value: string) =>
	value
		.toLowerCase()
		.replace(/\+/g, " plus")
		.replace(/ä/g, "ae")
		.replace(/ö/g, "oe")
		.replace(/ü/g, "ue")
		.replace(/ß/g, "ss")
		.normalize("NFKD")
		.replace(/[̀-ͯ]/g, "")
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");

const escapeHtml = (value: string) =>
	value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export const productDisplayName = (product: ProductSeed) =>
	product.name.startsWith(product.brand)
		? product.name
		: `${product.brand} ${product.name}`;

export const storageName = (valueGb: number) =>
	valueGb >= 1024 ? `${valueGb / 1024} TB` : `${valueGb} GB`;

export const screenName = (valueInches: number) =>
	`${Number.isInteger(valueInches) ? valueInches : valueInches.toFixed(1)}-inch`;

// Rounds to a typical retail price such as 1,199.00, 199.00, or 79.99.
const retailPrice = (value: number) => {
	if (value >= 200) return Math.round(value / 10) * 10 - 1;
	return Number.isInteger(value) ? value : Math.floor(value) + 0.99;
};

const money = (value: number) => value.toFixed(2);

const imageUrl = (baseUrl: string, name: string) =>
	`${baseUrl}/images/products/${name}.webp`;

const variantImages = (
	random: Random,
	product: ProductSeed,
	color: string,
	baseUrl: string,
) => {
	const kindImages = imagesByKind[product.kind];
	const primary = kindImages[toneByColor[color] ?? "dark"] ?? kindImages.all[0];
	const ordered = [
		primary,
		...kindImages.all.filter((image) => image !== primary),
	].filter((image): image is string => Boolean(image));
	const count = Math.min(ordered.length, integerBetween(random, 2, 4));
	return ordered
		.slice(0, Math.max(2, count))
		.map((name) => imageUrl(baseUrl, name));
};

const describeProduct = (product: ProductSeed) => {
	const highlights = product.highlights
		.map((highlight) => `<li>${escapeHtml(highlight)}</li>`)
		.join("");
	return `<p>${escapeHtml(product.summary)}</p><h3>Highlights</h3><ul>${highlights}</ul><p><em>Demo listing: this product, its price, and its stock level are sample data for the Tech Store portfolio project.</em></p>`;
};

const buildVariants = (
	random: Random,
	product: ProductSeed,
	productId: string,
	productIndex: number,
	createdAt: Date,
	baseUrl: string,
	variantCounter: { value: number },
): SeedVariantRow[] => {
	const tiers: Tier[] = product.tiers ?? [{ add: 0 }];
	const colors = product.colors.slice(0, 3);
	const isOnSale = random() < 0.22;
	const discount = between(random, 0.08, 0.22);
	const brandCode = slugify(product.brand)
		.replace(/-/g, "")
		.slice(0, 4)
		.toUpperCase();

	return colors.flatMap((color, colorIndex) =>
		tiers.map((tier, tierIndex) => {
			variantCounter.value += 1;
			const listPrice = retailPrice(product.price + tier.add);
			const price = isOnSale
				? retailPrice(listPrice * (1 - discount))
				: listPrice;
			const stockRoll = random();
			return {
				id: seedUuid(0x7e5f0003, variantCounter.value),
				productId,
				sku: `TS-${brandCode}-${String(productIndex + 1).padStart(3, "0")}-${colorIndex + 1}${tierIndex + 1}`,
				price: money(price),
				compareAtPrice: isOnSale ? money(listPrice) : null,
				stockQuantity:
					stockRoll < 0.08
						? 0
						: stockRoll < 0.18
							? integerBetween(random, 1, 4)
							: integerBetween(random, 8, 140),
				colorName: color,
				storageGb: tier.storage ?? null,
				ramGb: tier.ram ?? null,
				screenInches: tier.screen ?? null,
				isDefault: colorIndex === 0 && tierIndex === 0,
				images: variantImages(random, product, color, baseUrl),
				createdAt,
			};
		}),
	);
};

const reviewTitles: Record<number, string[]> = {
	5: [
		"Absolutely worth it",
		"Best purchase this year",
		"Exceeded my expectations",
		"Love it",
		"Highly recommended",
	],
	4: [
		"Very good with small caveats",
		"Great value",
		"Solid choice",
		"Happy with it",
		"Almost perfect",
	],
	3: [
		"Decent, but not perfect",
		"Does the job",
		"Mixed feelings",
		"Okay for the price",
	],
	2: ["Somewhat disappointed", "Expected more", "Not quite there"],
	1: ["Not for me", "Returned it"],
};

const reviewComment = (
	random: Random,
	product: ProductSeed,
	rating: number,
) => {
	const aspects = reviewAspects[product.kind];
	const first = pick(random, aspects);
	const second = pick(
		random,
		aspects.filter((aspect) => aspect !== first),
	);
	const weeks = integerBetween(random, 2, 20);
	const name = productDisplayName(product);
	const extras = [
		"Delivery was quick and everything was well packaged.",
		"Setup took only a few minutes.",
		"I compared it with two alternatives before buying and don't regret it.",
		"It replaced an older model and the difference is noticeable.",
		"",
		"",
	];
	const extra = pick(random, extras);
	const body =
		rating === 5
			? `I've been using the ${name} for ${weeks} weeks now. The ${first} is excellent and the ${second} is even better than I expected.`
			: rating === 4
				? `After ${weeks} weeks with the ${name}: the ${first} is great, but the ${second} could be a little better.`
				: rating === 3
					? `The ${first} is fine, but the ${second} didn't convince me. For everyday use it's okay.`
					: rating === 2
						? `I had higher hopes for the ${name}. The ${first} is below what I expected and the ${second} is only average.`
						: `The ${first} didn't work for me at all, so I sent the ${name} back.`;
	return [body, extra].filter(Boolean).join(" ");
};

const pickRating = (random: Random, bias: number) => {
	const roll = random() + bias;
	if (roll > 0.58) return 5;
	if (roll > 0.26) return 4;
	if (roll > 0.12) return 3;
	if (roll > 0.04) return 2;
	return 1;
};

export const buildSeedData = (
	now = new Date(),
	baseUrl = DEFAULT_IMAGE_BASE_URL,
): SeedData => {
	const random = createRandom(SEED_RANDOM_STATE);
	const variantCounter = { value: 0 };
	const products: SeedProductRow[] = [];
	const variants: SeedVariantRow[] = [];

	seedProducts.forEach((product, index) => {
		const id = seedUuid(0x7e5f0002, index + 1);
		const createdAt = new Date(
			now.getTime() - between(random, 1, 240) * DAY_MS,
		);
		const productVariants = buildVariants(
			random,
			product,
			id,
			index,
			createdAt,
			baseUrl,
			variantCounter,
		);
		const defaultVariant = productVariants.find((variant) => variant.isDefault);
		products.push({
			id,
			categorySlug: product.category,
			name: productDisplayName(product),
			brand: product.brand,
			slug: slugify(productDisplayName(product)),
			shortDescription: product.summary,
			description: describeProduct(product),
			warrantyInfo: "2-year manufacturer warranty",
			image:
				defaultVariant?.images[0] ??
				imageUrl(baseUrl, imagesByKind[product.kind].all[0] ?? ""),
			ratingAvg: "0.0",
			reviewsCount: 0,
			isFeatured: featuredNames.has(product.name),
			isBestseller: bestsellerNames.has(product.name),
			createdAt,
		});
		variants.push(...productVariants);
	});

	const customers: SeedCustomerRow[] = Array.from(
		{ length: CUSTOMER_COUNT },
		(_, offset) => {
			const firstName = pick(random, firstNames);
			const lastName = pick(random, lastNames);
			return {
				id: `seed-customer-${String(offset + 1).padStart(3, "0")}`,
				name: `${firstName} ${lastName.charAt(0)}.`,
				email: `demo-customer-${String(offset + 1).padStart(3, "0")}@techstore.test`,
				createdAt: new Date(now.getTime() - between(random, 200, 400) * DAY_MS),
			};
		},
	);

	// Popular products collect more reviews.
	const weights = products.map((product) =>
		product.isBestseller ? 5 : product.isFeatured ? 3 : 1,
	);
	const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
	const qualityBias = products.map(() => between(random, -0.08, 0.12));
	const usedPairs = new Set<string>();
	const reviews: SeedReviewRow[] = [];

	while (reviews.length < REVIEW_TARGET) {
		let threshold = random() * totalWeight;
		let productIndex = 0;
		for (; productIndex < weights.length - 1; productIndex += 1) {
			threshold -= weights[productIndex] ?? 0;
			if (threshold < 0) break;
		}
		const product = products[productIndex];
		const source = seedProducts[productIndex];
		const customer = pick(random, customers);
		if (!product || !source) continue;
		const pair = `${customer.id}:${product.id}`;
		if (usedPairs.has(pair)) continue;
		usedPairs.add(pair);

		const rating = pickRating(random, qualityBias[productIndex] ?? 0);
		const reviewedAt = new Date(
			between(random, product.createdAt.getTime(), now.getTime()),
		);
		reviews.push({
			id: seedUuid(0x7e5f0005, reviews.length + 1),
			userId: customer.id,
			productId: product.id,
			rating: rating.toFixed(1),
			title: pick(random, reviewTitles[rating] ?? ["Review"]),
			comment: reviewComment(random, source, rating),
			createdAt: reviewedAt,
		});
	}

	for (const product of products) {
		const productReviews = reviews.filter(
			(review) => review.productId === product.id,
		);
		product.reviewsCount = productReviews.length;
		product.ratingAvg = productReviews.length
			? (
					productReviews.reduce(
						(sum, review) => sum + Number(review.rating),
						0,
					) / productReviews.length
				).toFixed(1)
			: "0.0";
	}

	const used = <T>(values: (T | null)[]) =>
		[...new Set(values.filter((value): value is T => value !== null))].sort();

	return {
		categories: seedCategories,
		colors: used(variants.map((variant) => variant.colorName)).map((name) => ({
			name,
			hexCode: colorHex[name] ?? "#111827",
		})),
		storages: used(variants.map((variant) => variant.storageGb))
			.sort((a, b) => a - b)
			.map((valueGb) => ({ name: storageName(valueGb), valueGb })),
		rams: used(variants.map((variant) => variant.ramGb))
			.sort((a, b) => a - b)
			.map((valueGb) => ({ name: `${valueGb} GB`, valueGb })),
		screenSizes: used(variants.map((variant) => variant.screenInches))
			.sort((a, b) => a - b)
			.map((valueInches) => ({ name: screenName(valueInches), valueInches })),
		products,
		variants,
		customers,
		reviews,
	};
};

export const seedSummary = (data: SeedData) => ({
	categories: data.categories.length,
	products: data.products.length,
	variants: data.variants.length,
	variantImages: data.variants.reduce(
		(sum, variant) => sum + variant.images.length,
		0,
	),
	productsOnSale: new Set(
		data.variants
			.filter((variant) => variant.compareAtPrice)
			.map((variant) => variant.productId),
	).size,
	outOfStockVariants: data.variants.filter(
		(variant) => variant.stockQuantity === 0,
	).length,
	customers: data.customers.length,
	reviews: data.reviews.length,
});
