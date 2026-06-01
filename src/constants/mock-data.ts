export type MockProduct = {
	id: string;
	name: string;
	brand: string;
	slug: string;
	image: string | null;
	price: string;
	compareAtPrice: string | null;
	ratingAvg: string;
	reviewsCount: number;
};

export type MockCategory = {
	id: string;
	name: string;
	slug: string;
	image: string | null;
};

export const MOCK_CATEGORIES: MockCategory[] = [
	{ id: "1", name: "Laptops", slug: "laptops", image: null },
	{ id: "2", name: "Smartphones", slug: "smartphones", image: null },
	{ id: "3", name: "Tablets", slug: "tablets", image: null },
	{ id: "4", name: "Audio", slug: "audio", image: null },
	{ id: "5", name: "Accessories", slug: "accessories", image: null },
	{ id: "6", name: "Gaming", slug: "gaming", image: null },
];

export const MOCK_FEATURED_PRODUCTS: MockProduct[] = [
	{
		id: "f1",
		name: 'MacBook Pro 14"',
		brand: "Apple",
		slug: "macbook-pro-14",
		image: null,
		price: "1999.00",
		compareAtPrice: "2199.00",
		ratingAvg: "4.8",
		reviewsCount: 342,
	},
	{
		id: "f2",
		name: "Samsung Galaxy S24 Ultra",
		brand: "Samsung",
		slug: "galaxy-s24-ultra",
		image: null,
		price: "1199.00",
		compareAtPrice: null,
		ratingAvg: "4.7",
		reviewsCount: 518,
	},
	{
		id: "f3",
		name: "Sony WH-1000XM5",
		brand: "Sony",
		slug: "sony-wh-1000xm5",
		image: null,
		price: "349.00",
		compareAtPrice: "399.00",
		ratingAvg: "4.9",
		reviewsCount: 1204,
	},
	{
		id: "f4",
		name: 'iPad Pro 12.9"',
		brand: "Apple",
		slug: "ipad-pro-12-9",
		image: null,
		price: "1099.00",
		compareAtPrice: "1199.00",
		ratingAvg: "4.6",
		reviewsCount: 287,
	},
];

export const MOCK_BESTSELLER_PRODUCTS: MockProduct[] = [
	{
		id: "b1",
		name: "iPhone 15 Pro",
		brand: "Apple",
		slug: "iphone-15-pro",
		image: null,
		price: "999.00",
		compareAtPrice: null,
		ratingAvg: "4.8",
		reviewsCount: 2341,
	},
	{
		id: "b2",
		name: "Dell XPS 15",
		brand: "Dell",
		slug: "dell-xps-15",
		image: null,
		price: "1799.00",
		compareAtPrice: "1999.00",
		ratingAvg: "4.5",
		reviewsCount: 762,
	},
	{
		id: "b3",
		name: "AirPods Pro (2nd Gen)",
		brand: "Apple",
		slug: "airpods-pro-2",
		image: null,
		price: "249.00",
		compareAtPrice: "279.00",
		ratingAvg: "4.7",
		reviewsCount: 3102,
	},
	{
		id: "b4",
		name: "ASUS ROG Strix G16",
		brand: "ASUS",
		slug: "asus-rog-strix-g16",
		image: null,
		price: "2499.00",
		compareAtPrice: null,
		ratingAvg: "4.6",
		reviewsCount: 431,
	},
];
