"use client";

import { Button } from "@heroui/react";
import { SlidersHorizontal, X } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useDebouncedValue } from "#/hooks/use-debounced-value";

export type ProductFilterValues = {
	categoryIds?: string[];
	colorIds?: string[];
	storageIds?: string[];
	ramIds?: string[];
	screenSizeIds?: string[];
	minPrice?: number;
	maxPrice?: number;
	inStock?: boolean;
	onSale?: boolean;
	minRating?: number;
};

type NamedOption = {
	id: string;
	name: string;
};

type CategoryOption = NamedOption & {
	totalProducts?: number;
};

type ColorOption = NamedOption & {
	hexCode: string | null;
};

type ProductFilterOptions = {
	categories?: CategoryOption[];
	colors?: ColorOption[];
	storages?: NamedOption[];
	rams?: NamedOption[];
	screens?: NamedOption[];
};

type Props = {
	values: ProductFilterValues;
	options?: ProductFilterOptions;
	showCategories?: boolean;
	onChange: (values: ProductFilterValues) => void;
	onPrefetchChange?: (values: ProductFilterValues) => void;
};

const formatPrice = (value: number | undefined) =>
	value === undefined ? "" : String(value);

const parsePrice = (value: string) => {
	const trimmed = value.trim();
	if (!trimmed) return { value: undefined, isValid: true };

	const parsed = Number(trimmed);
	return {
		value: Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined,
		isValid: Number.isFinite(parsed) && parsed >= 0,
	};
};

const getIds = (values?: string[]) => values ?? [];

const toggleId = (ids: string[] | undefined, id: string) => {
	const current = getIds(ids);
	return current.includes(id)
		? current.filter((item) => item !== id)
		: [...current, id];
};

function OptionSection({
	title,
	options,
	selectedIds,
	onToggle,
	renderPrefix,
}: {
	title: string;
	options?: NamedOption[];
	selectedIds?: string[];
	onToggle: (id: string) => void;
	renderPrefix?: (option: NamedOption) => ReactNode;
}) {
	if (!options || options.length === 0) return null;

	const selected = getIds(selectedIds);

	return (
		<div>
			<p className="text-xs font-semibold text-muted uppercase tracking-widest mb-3">
				{title}
			</p>
			<div className="space-y-2">
				{options.map((option) => (
					<label
						key={option.id}
						className="flex items-center gap-2.5 cursor-pointer group"
					>
						<input
							type="checkbox"
							checked={selected.includes(option.id)}
							onChange={() => onToggle(option.id)}
							className="w-4 h-4 rounded border-border accent-accent cursor-pointer"
						/>
						{renderPrefix?.(option)}
						<span className="text-sm text-foreground group-hover:text-accent transition-colors">
							{option.name}
						</span>
					</label>
				))}
			</div>
		</div>
	);
}

export function ProductFilterSidebar({
	values,
	options,
	showCategories,
	onChange,
	onPrefetchChange,
}: Props) {
	const [minInput, setMinInput] = useState(formatPrice(values.minPrice));
	const [maxInput, setMaxInput] = useState(formatPrice(values.maxPrice));
	const debouncedMinInput = useDebouncedValue(minInput);
	const debouncedMaxInput = useDebouncedValue(maxInput);

	const hasActiveFilters =
		getIds(values.categoryIds).length > 0 ||
		getIds(values.colorIds).length > 0 ||
		getIds(values.storageIds).length > 0 ||
		getIds(values.ramIds).length > 0 ||
		getIds(values.screenSizeIds).length > 0 ||
		values.minPrice !== undefined ||
		values.maxPrice !== undefined ||
		values.inStock ||
		values.onSale ||
		values.minRating !== undefined;

	const minPrice = parsePrice(minInput);
	const maxPrice = parsePrice(maxInput);
	const hasInvalidPrice = !minPrice.isValid || !maxPrice.isValid;
	const hasInvalidRange =
		minPrice.value !== undefined &&
		maxPrice.value !== undefined &&
		minPrice.value > maxPrice.value;
	const priceError = hasInvalidPrice
		? "Enter a valid price."
		: hasInvalidRange
			? "Minimum price cannot be greater than maximum price."
			: undefined;

	useEffect(() => {
		setMinInput(formatPrice(values.minPrice));
	}, [values.minPrice]);

	useEffect(() => {
		setMaxInput(formatPrice(values.maxPrice));
	}, [values.maxPrice]);

	useEffect(() => {
		const nextMin = parsePrice(debouncedMinInput);
		const nextMax = parsePrice(debouncedMaxInput);

		if (!nextMin.isValid || !nextMax.isValid) return;
		if (
			nextMin.value !== undefined &&
			nextMax.value !== undefined &&
			nextMin.value > nextMax.value
		) {
			return;
		}
		if (
			nextMin.value === values.minPrice &&
			nextMax.value === values.maxPrice
		) {
			return;
		}

		const nextValues = {
			...values,
			minPrice: nextMin.value,
			maxPrice: nextMax.value,
		};
		onPrefetchChange?.(nextValues);
		onChange(nextValues);
	}, [
		debouncedMaxInput,
		debouncedMinInput,
		onChange,
		onPrefetchChange,
		values,
	]);

	const commitValues = (nextValues: ProductFilterValues) => {
		onPrefetchChange?.(nextValues);
		onChange(nextValues);
	};

	const handleClear = () => {
		const nextValues = {
			categoryIds: [],
			colorIds: [],
			storageIds: [],
			ramIds: [],
			screenSizeIds: [],
			minPrice: undefined,
			maxPrice: undefined,
			inStock: undefined,
			onSale: undefined,
			minRating: undefined,
		};
		setMinInput("");
		setMaxInput("");
		commitValues(nextValues);
	};

	return (
		<aside className="w-full">
			<div className="flex items-center justify-between mb-4">
				<div className="flex items-center gap-2">
					<SlidersHorizontal size={16} className="text-muted" />
					<span className="text-sm font-semibold text-foreground">Filters</span>
				</div>
				{hasActiveFilters && (
					<Button
						size="sm"
						variant="ghost"
						onPress={handleClear}
						className="text-muted h-7 px-2 text-xs"
					>
						<X size={12} className="mr-1" />
						Clear
					</Button>
				)}
			</div>

			<div className="space-y-6">
				{showCategories ? (
					<OptionSection
						title="Category"
						options={options?.categories}
						selectedIds={values.categoryIds}
						onToggle={(id) =>
							commitValues({
								...values,
								categoryIds: toggleId(values.categoryIds, id),
							})
						}
					/>
				) : null}

				<OptionSection
					title="Color"
					options={options?.colors}
					selectedIds={values.colorIds}
					onToggle={(id) =>
						commitValues({ ...values, colorIds: toggleId(values.colorIds, id) })
					}
					renderPrefix={(option) => {
						const color = option as ColorOption;
						return color.hexCode ? (
							<span
								className="w-3.5 h-3.5 rounded-full border border-border flex-shrink-0"
								style={{ backgroundColor: color.hexCode }}
							/>
						) : null;
					}}
				/>

				<OptionSection
					title="Storage"
					options={options?.storages}
					selectedIds={values.storageIds}
					onToggle={(id) =>
						commitValues({
							...values,
							storageIds: toggleId(values.storageIds, id),
						})
					}
				/>

				<OptionSection
					title="RAM"
					options={options?.rams}
					selectedIds={values.ramIds}
					onToggle={(id) =>
						commitValues({ ...values, ramIds: toggleId(values.ramIds, id) })
					}
				/>

				<OptionSection
					title="Screen size"
					options={options?.screens}
					selectedIds={values.screenSizeIds}
					onToggle={(id) =>
						commitValues({
							...values,
							screenSizeIds: toggleId(values.screenSizeIds, id),
						})
					}
				/>

				<div>
					<p className="text-xs font-semibold text-muted uppercase tracking-widest mb-3">
						Price range
					</p>
					<div className="flex items-center gap-2">
						<div className="flex-1">
							<input
								type="number"
								placeholder="Min"
								min={0}
								value={minInput}
								onChange={(e) => setMinInput(e.target.value)}
								onFocus={() => onPrefetchChange?.(values)}
								className="w-full px-3 py-2 text-sm rounded-xl border border-border bg-surface text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent/30"
							/>
						</div>
						<span className="text-muted text-sm">–</span>
						<div className="flex-1">
							<input
								type="number"
								placeholder="Max"
								min={0}
								value={maxInput}
								onChange={(e) => setMaxInput(e.target.value)}
								onFocus={() => onPrefetchChange?.(values)}
								className="w-full px-3 py-2 text-sm rounded-xl border border-border bg-surface text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent/30"
							/>
						</div>
					</div>
					{priceError ? (
						<p className="mt-2 text-xs text-danger">{priceError}</p>
					) : null}
				</div>

				<div>
					<p className="text-xs font-semibold text-muted uppercase tracking-widest mb-3">
						Availability
					</p>
					<label className="flex items-center gap-2.5 cursor-pointer group">
						<input
							type="checkbox"
							checked={values.inStock ?? false}
							onChange={(e) => {
								const nextValues = {
									...values,
									inStock: e.target.checked || undefined,
								};
								commitValues(nextValues);
							}}
							onFocus={() =>
								onPrefetchChange?.({
									...values,
									inStock: values.inStock ? undefined : true,
								})
							}
							className="w-4 h-4 rounded border-border accent-accent cursor-pointer"
						/>
						<span className="text-sm text-foreground group-hover:text-accent transition-colors">
							In stock only
						</span>
					</label>
				</div>

				<div>
					<p className="text-xs font-semibold text-muted uppercase tracking-widest mb-3">
						Deals
					</p>
					<label className="flex items-center gap-2.5 cursor-pointer group">
						<input
							type="checkbox"
							checked={values.onSale ?? false}
							onChange={(e) =>
								commitValues({
									...values,
									onSale: e.target.checked || undefined,
								})
							}
							className="w-4 h-4 rounded border-border accent-accent cursor-pointer"
						/>
						<span className="text-sm text-foreground group-hover:text-accent transition-colors">
							On sale
						</span>
					</label>
				</div>

				<div>
					<p className="text-xs font-semibold text-muted uppercase tracking-widest mb-3">
						Rating
					</p>
					<select
						value={values.minRating ?? ""}
						onChange={(e) =>
							commitValues({
								...values,
								minRating: e.target.value ? Number(e.target.value) : undefined,
							})
						}
						className="w-full px-3 py-2 text-sm rounded-xl border border-border bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-accent/30"
					>
						<option value="">Any rating</option>
						<option value="4">4 stars and up</option>
						<option value="3">3 stars and up</option>
						<option value="2">2 stars and up</option>
						<option value="1">1 star and up</option>
					</select>
				</div>
			</div>
		</aside>
	);
}

export function ProductFilterDrawer({
	isOpen,
	onClose,
	...props
}: Props & {
	isOpen: boolean;
	onClose: () => void;
}) {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 lg:hidden">
			<button
				type="button"
				aria-label="Close filters"
				className="absolute inset-0 bg-black/40"
				onClick={onClose}
			/>
			<div className="absolute right-0 top-0 h-full w-full max-w-sm overflow-y-auto bg-background p-4 shadow-2xl">
				<div className="flex items-center justify-between mb-4">
					<p className="text-sm font-bold text-foreground">Filters</p>
					<Button
						size="sm"
						variant="ghost"
						isIconOnly
						aria-label="Close filters"
						onPress={onClose}
					>
						<X size={16} />
					</Button>
				</div>
				<ProductFilterSidebar {...props} />
			</div>
		</div>
	);
}
