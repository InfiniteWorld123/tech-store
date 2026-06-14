"use client";

import { CheckCircle } from "lucide-react";

type ShippingMethod = "standard" | "express" | "same_day";

type Props = {
	value: ShippingMethod;
	onChange: (v: ShippingMethod) => void;
	onPrefetch?: (v: ShippingMethod) => void;
};

const OPTIONS: {
	value: ShippingMethod;
	label: string;
	description: string;
	price: number;
}[] = [
	{
		value: "standard",
		label: "Standard delivery",
		description: "3–5 business days",
		price: 0,
	},
	{
		value: "express",
		label: "Express delivery",
		description: "1–2 business days",
		price: 15,
	},
	{
		value: "same_day",
		label: "Same-day delivery",
		description: "Order before 12:00",
		price: 25,
	},
];

export function ShippingMethodPicker({ value, onChange, onPrefetch }: Props) {
	return (
		<div className="space-y-2">
			{OPTIONS.map((opt) => {
				const isSelected = opt.value === value;
				return (
					<button
						key={opt.value}
						type="button"
						onClick={() => onChange(opt.value)}
						onFocus={() => onPrefetch?.(opt.value)}
						onMouseEnter={() => onPrefetch?.(opt.value)}
						className={`w-full text-left rounded-2xl border p-4 transition-all flex items-center justify-between gap-4 ${
							isSelected
								? "border-accent bg-accent/5"
								: "border-border hover:border-accent/50"
						}`}
					>
						<div className="flex items-center gap-3">
							<div
								className={`w-4 h-4 rounded-full border-2 flex-shrink-0 transition-all ${
									isSelected ? "border-accent bg-accent" : "border-border"
								}`}
							/>
							<div>
								<p className="text-sm font-semibold text-foreground">
									{opt.label}
								</p>
								<p className="text-xs text-muted">{opt.description}</p>
							</div>
						</div>
						<div className="flex items-center gap-2">
							<span className="text-sm font-bold text-foreground">
								{opt.price === 0 ? "Free" : `€${opt.price}`}
							</span>
							{isSelected && <CheckCircle size={14} className="text-accent" />}
						</div>
					</button>
				);
			})}
		</div>
	);
}
