import type { OptionRow, OptionType } from "./option-configs";

// Placeholder data so the UI renders before the API is wired. Replace with the
// list*QueryOptions results during the API-connection pass.
const now = "2026-06-01T10:00:00.000Z";

export const MOCK_OPTIONS: Record<OptionType, OptionRow[]> = {
	colors: [
		{
			id: "c1",
			name: "Midnight Black",
			value: "#000000",
			createdAt: now,
			updatedAt: now,
		},
		{
			id: "c2",
			name: "Silver",
			value: "#c0c0c0",
			createdAt: now,
			updatedAt: now,
		},
		{
			id: "c3",
			name: "Gold",
			value: "#d4af37",
			createdAt: now,
			updatedAt: now,
		},
		{
			id: "c4",
			name: "Pacific Blue",
			value: "#1d4ed8",
			createdAt: now,
			updatedAt: now,
		},
		{
			id: "c5",
			name: "Product Red",
			value: "#dc2626",
			createdAt: now,
			updatedAt: now,
		},
	],
	storages: [
		{ id: "s1", name: "128 GB", value: 128, createdAt: now, updatedAt: now },
		{ id: "s2", name: "256 GB", value: 256, createdAt: now, updatedAt: now },
		{ id: "s3", name: "512 GB", value: 512, createdAt: now, updatedAt: now },
		{ id: "s4", name: "1 TB", value: 1024, createdAt: now, updatedAt: now },
	],
	rams: [
		{ id: "r1", name: "8 GB", value: 8, createdAt: now, updatedAt: now },
		{ id: "r2", name: "16 GB", value: 16, createdAt: now, updatedAt: now },
		{ id: "r3", name: "32 GB", value: 32, createdAt: now, updatedAt: now },
	],
	screens: [
		{ id: "sc1", name: '6.1"', value: 6.1, createdAt: now, updatedAt: now },
		{ id: "sc2", name: '6.7"', value: 6.7, createdAt: now, updatedAt: now },
		{ id: "sc3", name: '13.6"', value: 13.6, createdAt: now, updatedAt: now },
	],
};
