"use client";

import type { AdminVariantType } from "#/server/catalog/variants/variants.types";

type Props = {
	variants: AdminVariantType[];
	selectedVariantId: string | null;
	onSelect: (variantId: string) => void;
};

type OptionGroup = {
	type: "color" | "storage" | "ram" | "screenSize";
	label: string;
	values: Array<{ id: string; name: string; hexCode?: string | null }>;
};

function getOptionGroups(variants: AdminVariantType[]): OptionGroup[] {
	const groups: OptionGroup[] = [];

	const colors = new Map<
		string,
		{ id: string; name: string; hexCode: string | null }
	>();
	const storages = new Map<string, { id: string; name: string }>();
	const rams = new Map<string, { id: string; name: string }>();
	const screens = new Map<string, { id: string; name: string }>();

	for (const v of variants) {
		if (v.color && !colors.has(v.color.id)) colors.set(v.color.id, v.color);
		if (v.storage && !storages.has(v.storage.id))
			storages.set(v.storage.id, v.storage);
		if (v.ram && !rams.has(v.ram.id)) rams.set(v.ram.id, v.ram);
		if (v.screenSize && !screens.has(v.screenSize.id))
			screens.set(v.screenSize.id, v.screenSize);
	}

	if (colors.size > 0)
		groups.push({
			type: "color",
			label: "Color",
			values: Array.from(colors.values()),
		});
	if (storages.size > 0)
		groups.push({
			type: "storage",
			label: "Storage",
			values: Array.from(storages.values()),
		});
	if (rams.size > 0)
		groups.push({
			type: "ram",
			label: "RAM",
			values: Array.from(rams.values()),
		});
	if (screens.size > 0)
		groups.push({
			type: "screenSize",
			label: "Screen Size",
			values: Array.from(screens.values()),
		});

	return groups;
}

function getSelectedOptions(
	variants: AdminVariantType[],
	selectedId: string | null,
) {
	const v = variants.find((v) => v.id === selectedId);
	return {
		colorId: v?.color?.id ?? null,
		storageId: v?.storage?.id ?? null,
		ramId: v?.ram?.id ?? null,
		screenSizeId: v?.screenSize?.id ?? null,
	};
}

function findBestMatch(
	variants: AdminVariantType[],
	current: ReturnType<typeof getSelectedOptions>,
	type: OptionGroup["type"],
	newId: string,
): AdminVariantType | null {
	const updated = { ...current, [`${type}Id`]: newId };
	// Exact match
	const exact = variants.find(
		(v) =>
			(updated.colorId == null || v.color?.id === updated.colorId) &&
			(updated.storageId == null || v.storage?.id === updated.storageId) &&
			(updated.ramId == null || v.ram?.id === updated.ramId) &&
			(updated.screenSizeId == null ||
				v.screenSize?.id === updated.screenSizeId),
	);
	if (exact) return exact;
	// Partial match: only the changed option must match
	return (
		variants.find((v) => {
			if (type === "color") return v.color?.id === newId;
			if (type === "storage") return v.storage?.id === newId;
			if (type === "ram") return v.ram?.id === newId;
			if (type === "screenSize") return v.screenSize?.id === newId;
			return false;
		}) ?? null
	);
}

export function ProductVariantSelector({
	variants,
	selectedVariantId,
	onSelect,
}: Props) {
	if (variants.length === 0) return null;

	const groups = getOptionGroups(variants);
	if (groups.length === 0) return null;

	const current = getSelectedOptions(variants, selectedVariantId);

	const handleOptionClick = (type: OptionGroup["type"], optionId: string) => {
		const match = findBestMatch(variants, current, type, optionId);
		if (match) onSelect(match.id);
	};

	const isOptionSelected = (type: OptionGroup["type"], optionId: string) => {
		if (type === "color") return current.colorId === optionId;
		if (type === "storage") return current.storageId === optionId;
		if (type === "ram") return current.ramId === optionId;
		if (type === "screenSize") return current.screenSizeId === optionId;
		return false;
	};

	return (
		<div className="space-y-4">
			{groups.map((group) => (
				<div key={group.type}>
					<p className="text-sm font-semibold text-foreground mb-2">
						{group.label}
					</p>
					<div className="flex flex-wrap gap-2">
						{group.values.map((opt) => {
							const selected = isOptionSelected(group.type, opt.id);
							return (
								<button
									key={opt.id}
									type="button"
									onClick={() => handleOptionClick(group.type, opt.id)}
									className={`relative flex items-center gap-2 px-3 py-1.5 rounded-xl border text-sm font-medium transition-all ${
										selected
											? "border-accent bg-accent/10 text-accent"
											: "border-border bg-surface text-foreground hover:border-accent/50"
									}`}
								>
									{group.type === "color" && opt.hexCode && (
										<span
											className="w-3.5 h-3.5 rounded-full border border-border/50 flex-shrink-0"
											style={{ backgroundColor: opt.hexCode }}
										/>
									)}
									{opt.name}
								</button>
							);
						})}
					</div>
				</div>
			))}
		</div>
	);
}
