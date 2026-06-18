"use client";

import { CheckCircle, Plus } from "lucide-react";
import { useState } from "react";
import type { AddressType } from "#/server/addresses/addresses.types";
import { InlineAddressForm } from "./inline-address-form";

type Props = {
	addresses: AddressType[];
	selectedId: string | null;
	onSelect: (id: string) => void;
	onPrefetchAddress?: (id: string) => void;
};

export function AddressSelector({
	addresses,
	selectedId,
	onSelect,
	onPrefetchAddress,
}: Props) {
	const [showForm, setShowForm] = useState(false);

	return (
		<div className="space-y-3">
			{addresses.map((addr) => {
				const isSelected = addr.id === selectedId;
				return (
					<button
						key={addr.id}
						type="button"
						onClick={() => onSelect(addr.id)}
						onFocus={() => onPrefetchAddress?.(addr.id)}
						onMouseEnter={() => onPrefetchAddress?.(addr.id)}
						className={`w-full text-left rounded-2xl border p-4 transition-all ${
							isSelected
								? "border-accent bg-accent/5"
								: "border-border hover:border-accent/50"
						}`}
					>
						<div className="flex items-start justify-between gap-2">
							<div className="space-y-0.5">
								<div className="flex items-center gap-2">
									<p className="text-sm font-semibold text-foreground">
										{addr.fullName}
									</p>
									{addr.isDefault && (
										<span className="text-xs text-accent font-medium bg-accent/10 px-1.5 py-0.5 rounded-full">
											Default
										</span>
									)}
								</div>
								<p className="text-xs text-muted">{addr.phone}</p>
								<p className="text-xs text-muted">
									{addr.street}, {addr.postalCode} {addr.city}
									{addr.state ? `, ${addr.state}` : ""}, {addr.country}
								</p>
							</div>
							{isSelected && (
								<CheckCircle
									size={16}
									className="text-accent flex-shrink-0 mt-0.5"
								/>
							)}
						</div>
					</button>
				);
			})}

			{showForm ? (
				<div className="border border-border rounded-2xl p-4 space-y-3">
					<p className="text-sm font-semibold text-foreground">New address</p>
					<InlineAddressForm
						onSuccess={(address) => {
							onSelect(address.id);
							setShowForm(false);
						}}
					/>
				</div>
			) : (
				<button
					type="button"
					onClick={() => setShowForm(true)}
					className="w-full flex items-center gap-2 px-4 py-3 rounded-2xl border border-dashed border-border hover:border-accent/50 text-sm text-muted hover:text-foreground transition-all"
				>
					<Plus size={14} />
					Add new address
				</button>
			)}
		</div>
	);
}
