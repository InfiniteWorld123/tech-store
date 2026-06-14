"use client";

import { CheckCircle, CreditCard } from "lucide-react";

type PaymentMethod = "card" | "paypal" | "bank_transfer" | "cash_on_delivery";

type Props = {
	value: PaymentMethod;
	onChange: (v: PaymentMethod) => void;
};

const OPTIONS: {
	value: PaymentMethod;
	label: string;
	description: string;
	enabled: boolean;
}[] = [
	{
		value: "card",
		label: "Credit / Debit card",
		description: "Visa, Mastercard, Amex via Stripe",
		enabled: true,
	},
	{
		value: "paypal",
		label: "PayPal",
		description: "Coming soon",
		enabled: false,
	},
	{
		value: "bank_transfer",
		label: "Bank transfer",
		description: "Coming soon",
		enabled: false,
	},
	{
		value: "cash_on_delivery",
		label: "Cash on delivery",
		description: "Coming soon",
		enabled: false,
	},
];

export function PaymentMethodPicker({ value, onChange }: Props) {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
			{OPTIONS.map((opt) => {
				const isSelected = opt.value === value;
				return (
					<button
						key={opt.value}
						type="button"
						disabled={!opt.enabled}
						onClick={() => opt.enabled && onChange(opt.value)}
						className={`text-left rounded-2xl border p-4 transition-all flex items-start gap-3 ${
							!opt.enabled
								? "border-border opacity-50 cursor-not-allowed"
								: isSelected
									? "border-accent bg-accent/5"
									: "border-border hover:border-accent/50"
						}`}
					>
						<CreditCard
							size={18}
							className={
								isSelected
									? "text-accent flex-shrink-0"
									: "text-muted flex-shrink-0"
							}
						/>
						<div className="flex-1 min-w-0">
							<p className="text-sm font-semibold text-foreground">
								{opt.label}
							</p>
							<p className="text-xs text-muted truncate">{opt.description}</p>
						</div>
						{isSelected && opt.enabled && (
							<CheckCircle
								size={14}
								className="text-accent flex-shrink-0 mt-0.5"
							/>
						)}
					</button>
				);
			})}
		</div>
	);
}
