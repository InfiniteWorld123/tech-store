import { Star } from "lucide-react";

type StarRatingProps = {
	rating: number;
	size?: number;
};

export function StarRating({ rating, size = 13 }: StarRatingProps) {
	return (
		<div className="flex items-center gap-0.5">
			{[1, 2, 3, 4, 5].map((star) => (
				<Star
					key={star}
					size={size}
					className={star <= rating ? "fill-warning text-warning" : "fill-default text-default"}
				/>
			))}
		</div>
	);
}
