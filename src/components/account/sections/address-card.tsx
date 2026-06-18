"use client";

import { Button, Chip } from "@heroui/react";
import { Edit2, MapPin, Star, Trash2 } from "lucide-react";
import { useDeleteAddress } from "#/mutations/addresses/use-delete-address";
import { useSetDefaultAddress } from "#/mutations/addresses/use-set-default-address";
import type { AddressType } from "#/server/addresses/addresses.types";

type Props = {
	address: AddressType;
	onEdit: (address: AddressType) => void;
};

export function AddressCard({ address, onEdit }: Props) {
	const { mutate: remove, isPending: removing } = useDeleteAddress();
	const { mutate: setDefault, isPending: settingDefault } =
		useSetDefaultAddress();

	return (
		<div
			className={`border rounded-2xl p-5 space-y-3 transition-all ${
				address.isDefault ? "border-accent bg-accent/5" : "border-border"
			}`}
		>
			<div className="flex items-start justify-between gap-2">
				<div className="flex min-w-0 items-center gap-2">
					<MapPin size={14} className="text-muted flex-shrink-0 mt-0.5" />
					<p className="break-words text-sm font-semibold text-foreground">
						{address.fullName}
					</p>
				</div>
				{address.isDefault && (
					<Chip size="sm" color="accent" variant="soft">
						Default
					</Chip>
				)}
			</div>

			<div className="space-y-0.5 break-words pl-5 text-xs text-muted">
				<p>{address.phone}</p>
				<p>{address.street}</p>
				<p>
					{address.postalCode} {address.city}
					{address.state ? `, ${address.state}` : ""}
				</p>
				<p>{address.country}</p>
			</div>

			<div className="flex flex-wrap items-center gap-2 pt-1">
				{!address.isDefault && (
					<Button
						variant="outline"
						size="sm"
						isPending={settingDefault}
						onPress={() => setDefault({ addressId: address.id })}
						className="min-w-fit"
					>
						<Star size={12} />
						Set default
					</Button>
				)}
				<Button
					variant="ghost"
					size="sm"
					onPress={() => onEdit(address)}
					className="min-w-fit"
				>
					<Edit2 size={12} />
					Edit
				</Button>
				<Button
					variant="ghost"
					size="sm"
					isPending={removing}
					onPress={() => remove({ addressId: address.id })}
					className="ml-0 min-w-fit text-danger hover:text-danger sm:ml-auto"
				>
					<Trash2 size={12} />
					Delete
				</Button>
			</div>
		</div>
	);
}
