"use client";

import { ImageOff } from "lucide-react";
import { useState } from "react";

type Props = {
	mainImage: string | null;
	variantImages: string[];
	productName: string;
};

export function ProductImagesGallery({
	mainImage,
	variantImages,
	productName,
}: Props) {
	const images =
		variantImages.length > 0 ? variantImages : mainImage ? [mainImage] : [];
	const [selected, setSelected] = useState(0);

	const current = images[selected] ?? null;

	return (
		<div className="flex flex-col gap-3">
			{/* Main image */}
			<div className="relative aspect-square bg-surface-secondary rounded-2xl overflow-hidden flex items-center justify-center">
				{current ? (
					<img
						src={current}
						alt={productName}
						className="w-full h-full object-cover"
					/>
				) : (
					<div className="flex flex-col items-center gap-2 text-muted">
						<ImageOff size={48} />
						<span className="text-sm">No image</span>
					</div>
				)}
			</div>

			{/* Thumbnails */}
			{images.length > 1 && (
				<div className="flex gap-2 overflow-x-auto pb-1">
					{images.map((img, i) => (
						<button
							key={img}
							type="button"
							onClick={() => setSelected(i)}
							className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
								i === selected
									? "border-accent"
									: "border-border hover:border-muted"
							}`}
						>
							<img
								src={img}
								alt={`${productName} ${i + 1}`}
								className="w-full h-full object-cover"
							/>
						</button>
					))}
				</div>
			)}
		</div>
	);
}
