import {
	Button,
	Card,
	Checkbox,
	CheckboxGroup,
	Label,
	NumberField,
	Switch,
} from "@heroui/react";
import { RotateCcw, SlidersHorizontal } from "lucide-react";
import type { ProductsSearch } from "#/queries/products-search";

const STATUS_OPTIONS = [
	{ value: "all", label: "All" },
	{ value: "active", label: "Active" },
	{ value: "inactive", label: "Inactive" },
];

const CATEGORY_OPTIONS = [
	{ value: "laptops", label: "Laptops" },
	{ value: "smartphones", label: "Smartphones" },
	{ value: "tablets", label: "Tablets" },
	{ value: "audio", label: "Audio" },
	{ value: "accessories", label: "Accessories" },
	{ value: "gaming", label: "Gaming" },
];

type ProductsFilterSidebarProps = {
	className?: string;
	onFilterApply: (formData: FormData) => void;
	onFilterReset: () => void;
	search: ProductsSearch;
};

type FilterGroupProps = {
	title: string;
	children: React.ReactNode;
};

type CheckboxOption = {
	value: string;
	label: string;
};

export function ProductsFilterSidebar({
	className = "",
	onFilterApply,
	onFilterReset,
	search,
}: ProductsFilterSidebarProps) {
	return (
		<Card
			className={`flex min-h-0 flex-col gap-0 overflow-hidden ${className}`}
		>
			<Card.Header className="sticky top-0 z-10 shrink-0 border-b border-border bg-surface p-4">
				<div className="flex items-center gap-2">
					<div className="flex size-8 items-center justify-center rounded-lg bg-accent/10 text-accent">
						<SlidersHorizontal size={16} />
					</div>
					<Card.Title className="text-base">Filters</Card.Title>
				</div>
			</Card.Header>

			<form
				className="flex min-h-0 flex-1 flex-col"
				onReset={(event) => {
					event.preventDefault();
					onFilterReset();
				}}
				onSubmit={(event) => {
					event.preventDefault();
					onFilterApply(new FormData(event.currentTarget));
				}}
			>
				<Card.Content className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4">
					<div className="flex flex-col gap-5">
						<FilterGroup title="Status">
							<StatusRadioGroup value={search.status} />
						</FilterGroup>

						<FilterGroup title="Flags">
							<div className="flex flex-col gap-3">
								<FilterSwitch
									defaultSelected={search.isFeatured === true}
									label="Featured"
									name="isFeatured"
								/>
								<FilterSwitch
									defaultSelected={search.isBestseller === true}
									label="Bestseller"
									name="isBestseller"
								/>
								<FilterSwitch
									defaultSelected={search.isSale === true}
									label="On sale"
									name="isSale"
								/>
								<FilterSwitch
									defaultSelected={search.inStock === true}
									label="In stock"
									name="inStock"
								/>
								<FilterSwitch
									defaultSelected={search.hasReviews === true}
									label="Has reviews"
									name="hasReviews"
								/>
							</div>
						</FilterGroup>

						<FilterGroup title="Categories">
							<CheckboxOptionGroup
								ariaLabel="Product categories"
								defaultValue={search.categoryIds}
								name="categoryIds"
								options={CATEGORY_OPTIONS}
							/>
						</FilterGroup>

						<FilterGroup title="Price">
							<RangeNumberFields
								formatOptions={{ currency: "EUR", style: "currency" }}
								maxLabel="Max"
								maxName="maxPrice"
								maxValue={search.maxPrice}
								minLabel="Min"
								minName="minPrice"
								minValue={search.minPrice}
								step={50}
							/>
						</FilterGroup>

						<FilterGroup title="Rating">
							<RangeNumberFields
								maxLabel="Max"
								maxName="maxRating"
								maxValue={search.maxRating}
								minLabel="Min"
								minName="minRating"
								minValue={search.minRating}
								step={0.1}
							/>
						</FilterGroup>

						<FilterGroup title="Stock">
							<RangeNumberFields
								maxLabel="Max"
								maxName="maxStock"
								maxValue={search.maxStock}
								minLabel="Min"
								minName="minStock"
								minValue={search.minStock}
								step={1}
							/>
						</FilterGroup>
					</div>
				</Card.Content>

				<Card.Footer className="sticky bottom-0 z-10 flex shrink-0 gap-2 border-t border-border bg-surface p-4">
					<Button fullWidth type="submit" variant="primary">
						<SlidersHorizontal size={15} />
						Apply
					</Button>
					<Button fullWidth type="reset" variant="ghost">
						<RotateCcw size={15} />
						Reset
					</Button>
				</Card.Footer>
			</form>
		</Card>
	);
}

function FilterGroup({ title, children }: FilterGroupProps) {
	return (
		<section className="flex flex-col gap-3 border-t border-border pt-4 first:border-t-0 first:pt-0">
			<h3 className="text-xs font-semibold uppercase text-muted">{title}</h3>
			{children}
		</section>
	);
}

function CheckboxOptionGroup({
	ariaLabel,
	defaultValue,
	name,
	options,
}: {
	ariaLabel: string;
	defaultValue?: string[];
	name: string;
	options: CheckboxOption[];
}) {
	return (
		<CheckboxGroup
			aria-label={ariaLabel}
			className="gap-2"
			defaultValue={defaultValue}
			variant="secondary"
		>
			{options.map((option) => (
				<Checkbox key={option.value} name={name} value={option.value}>
					<Checkbox.Control>
						<Checkbox.Indicator />
					</Checkbox.Control>
					<Checkbox.Content>
						<Label className="text-sm">{option.label}</Label>
					</Checkbox.Content>
				</Checkbox>
			))}
		</CheckboxGroup>
	);
}

function StatusRadioGroup({ value }: { value: ProductsSearch["status"] }) {
	return (
		<div className="grid grid-cols-3 gap-1 rounded-lg bg-secondary p-1">
			{STATUS_OPTIONS.map((option) => (
				<label
					key={option.value}
					className="relative flex cursor-pointer items-center justify-center rounded-md px-2 py-1.5 text-xs font-medium text-muted has-[:checked]:bg-surface has-[:checked]:text-foreground has-[:checked]:shadow-sm"
				>
					<input
						className="sr-only"
						defaultChecked={value === option.value}
						name="status"
						type="radio"
						value={option.value}
					/>
					{option.label}
				</label>
			))}
		</div>
	);
}

function FilterSwitch({
	defaultSelected,
	label,
	name,
}: {
	defaultSelected?: boolean;
	label: string;
	name: string;
}) {
	return (
		<Switch
			defaultSelected={defaultSelected}
			name={name}
			size="sm"
			value="true"
		>
			<Switch.Control>
				<Switch.Thumb />
			</Switch.Control>
			<Switch.Content>
				<Label className="text-sm">{label}</Label>
			</Switch.Content>
		</Switch>
	);
}

function RangeNumberFields({
	formatOptions,
	maxLabel,
	maxName,
	maxValue,
	minLabel,
	minName,
	minValue,
	step,
}: {
	formatOptions?: Intl.NumberFormatOptions;
	maxLabel: string;
	maxName: string;
	maxValue?: number;
	minLabel: string;
	minName: string;
	minValue?: number;
	step: number;
}) {
	return (
		<div className="grid grid-cols-2 gap-2">
			<NumberField
				defaultValue={minValue}
				formatOptions={formatOptions}
				minValue={0}
				name={minName}
				step={step}
				variant="secondary"
			>
				<Label className="text-xs text-muted">{minLabel}</Label>
				<NumberField.Group>
					<NumberField.Input className="w-full min-w-0" />
				</NumberField.Group>
			</NumberField>
			<NumberField
				defaultValue={maxValue}
				formatOptions={formatOptions}
				minValue={0}
				name={maxName}
				step={step}
				variant="secondary"
			>
				<Label className="text-xs text-muted">{maxLabel}</Label>
				<NumberField.Group>
					<NumberField.Input className="w-full min-w-0" />
				</NumberField.Group>
			</NumberField>
		</div>
	);
}
