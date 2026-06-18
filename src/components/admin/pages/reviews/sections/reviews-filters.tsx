import { Search, Star } from "lucide-react";

type ReviewsFiltersProps = {
	search: string | undefined;
	rating: number | undefined;
	onSearchChange: (value: string) => void;
	onRatingChange: (value: number | undefined) => void;
	onPrefetchRating: (value: number | undefined) => void;
};

const ratingOptions = [
	{ value: undefined, label: "All ratings" },
	{ value: 5, label: "5 stars" },
	{ value: 4, label: "4 stars" },
	{ value: 3, label: "3 stars" },
	{ value: 2, label: "2 stars" },
	{ value: 1, label: "1 star" },
];

export function ReviewsFilters({
	search,
	onSearchChange,
	rating,
	onRatingChange,
	onPrefetchRating,
}: ReviewsFiltersProps) {
	return (
		<div className="grid w-full min-w-0 grid-cols-1 gap-3 min-[520px]:grid-cols-[minmax(0,1fr)_auto] min-[520px]:items-center">
			{/* Search by title */}
			<div className="relative min-w-0">
				<Search
					size={15}
					className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
				/>
				<input
					type="text"
					value={search}
					onChange={(e) => onSearchChange(e.target.value)}
					placeholder="Search reviews by title..."
					className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-border bg-surface text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/40 transition-all"
				/>
			</div>

			{/* Rating filter */}
			<div className="relative min-w-0">
				<Star
					size={15}
					className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
				/>
				<select
					value={rating ?? ""}
					onChange={(e) =>
						onRatingChange(
							e.target.value === "" ? undefined : Number(e.target.value),
						)
					}
					className="w-full min-w-0 appearance-none rounded-xl border border-border bg-surface py-2.5 pl-9 pr-8 text-sm text-foreground transition-all focus:outline-none focus:ring-2 focus:ring-accent/40"
					onMouseEnter={() => {
						// prefetch all 5 ratings + "all ratings" on hover
						[undefined, 1, 2, 3, 4, 5].forEach(onPrefetchRating);
					}}
					onFocus={() => {
						[undefined, 1, 2, 3, 4, 5].forEach(onPrefetchRating);
					}}
				>
					{ratingOptions.map(({ value, label }) => (
						<option key={label} value={value ?? ""}>
							{label}
						</option>
					))}
				</select>
			</div>
		</div>
	);
}
