import { ColorSwatch } from "@heroui/react";
import type { ReactNode } from "react";

// The four product-option types share an identical CRUD shape and differ only in
// their single "value" field. This config captures that per-type variance so one
// generic set of table/toolbar/modal components can serve all of them.
export type OptionType = "colors" | "storages" | "rams" | "screens";

// How the value field is entered and rendered.
//  - hex   → a color string (e.g. "#000000"), nullable
//  - int   → whole number (storage / RAM in GB)
//  - float → decimal number (screen size in inches)
export type OptionValueKind = "hex" | "int" | "float";

// Flattened row shape used across every tab. The per-type server output
// (hexCode / valueGb / valueInches) is mapped onto `value` when the API is wired.
export type OptionRow = {
	id: string;
	name: string;
	value: string | number | null;
	createdAt: string;
	updatedAt: string;
};

export type OptionConfig = {
	key: OptionType;
	/** Singular noun, e.g. "color" — used in buttons and modal titles. */
	singular: string;
	/** Plural noun, e.g. "colors" — used in headings and empty states. */
	plural: string;
	/** Short page-subtitle sentence. */
	description: string;
	valueField: {
		/** Underlying server field name (hexCode | valueGb | valueInches). */
		key: "hexCode" | "valueGb" | "valueInches";
		/** Column header + form label. */
		label: string;
		kind: OptionValueKind;
		/** Optional unit suffix for numeric values (e.g. "GB"). */
		unit?: string;
		placeholder: string;
		/** Minimum allowed numeric value (ignored for hex). */
		min?: number;
		/** Numeric input step (ignored for hex). */
		step?: number;
	};
	/** Renders the value cell in the table. */
	renderValue: (row: OptionRow) => ReactNode;
	/** Searchable fields — mirrors each list*Schema's searchType enum. */
	searchTypes: Array<"name" | OptionConfig["valueField"]["key"]>;
};

function NumericValue({
	value,
	unit,
}: {
	value: OptionRow["value"];
	unit: string;
}) {
	if (value === null || value === "") {
		return <span className="text-muted">—</span>;
	}
	return (
		<span className="font-medium text-foreground">
			{value}
			{unit ? ` ${unit}` : ""}
		</span>
	);
}

function ColorValue({ value }: { value: OptionRow["value"] }) {
	const hex = typeof value === "string" && value.trim() ? value : null;
	if (!hex) {
		return <span className="text-muted">—</span>;
	}
	return (
		<div className="flex items-center gap-2">
			<ColorSwatch.Root
				color={hex}
				size="sm"
				aria-label={hex}
				className="rounded-md ring-1 ring-border"
			/>
			<code className="text-xs font-mono text-muted">{hex}</code>
		</div>
	);
}

export const OPTION_CONFIGS: Record<OptionType, OptionConfig> = {
	colors: {
		key: "colors",
		singular: "color",
		plural: "colors",
		description: "Color options buyers can pick when configuring a product.",
		valueField: {
			key: "hexCode",
			label: "Hex",
			kind: "hex",
			placeholder: "#000000",
		},
		renderValue: (row) => <ColorValue value={row.value} />,
		searchTypes: ["name", "hexCode"],
	},
	storages: {
		key: "storages",
		singular: "storage",
		plural: "storages",
		description: "Storage capacity options, measured in gigabytes.",
		valueField: {
			key: "valueGb",
			label: "Capacity",
			kind: "int",
			unit: "GB",
			placeholder: "256",
			min: 1,
			step: 1,
		},
		renderValue: (row) => <NumericValue value={row.value} unit="GB" />,
		searchTypes: ["name", "valueGb"],
	},
	rams: {
		key: "rams",
		singular: "RAM",
		plural: "RAMs",
		description: "Memory (RAM) options, measured in gigabytes.",
		valueField: {
			key: "valueGb",
			label: "Memory",
			kind: "int",
			unit: "GB",
			placeholder: "8",
			min: 1,
			step: 1,
		},
		renderValue: (row) => <NumericValue value={row.value} unit="GB" />,
		searchTypes: ["name", "valueGb"],
	},
	screens: {
		key: "screens",
		singular: "screen",
		plural: "screens",
		description: "Screen size options, measured in inches.",
		valueField: {
			key: "valueInches",
			label: "Size",
			kind: "float",
			unit: '"',
			placeholder: "6.1",
			min: 0,
			step: 0.1,
		},
		renderValue: (row) => <NumericValue value={row.value} unit={'"'} />,
		searchTypes: ["name", "valueInches"],
	},
};

export const OPTION_TABS: OptionType[] = [
	"colors",
	"storages",
	"rams",
	"screens",
];
