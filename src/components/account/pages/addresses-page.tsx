"use client";

import { Button, Skeleton } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { MapPin, Plus } from "lucide-react";
import { useState } from "react";
import { listAddressesQueryOptions } from "#/queries/addresses.queries";
import type { AddressType } from "#/server/addresses/addresses.types";
import { AddressCard } from "../sections/address-card";
import { AddressFormModal } from "../sections/address-form-modal";

export function AddressesPage() {
	const { data, isLoading } = useQuery(listAddressesQueryOptions);
	const addresses = data?.data?.items ?? [];

	const [modalOpen, setModalOpen] = useState(false);
	const [editAddress, setEditAddress] = useState<AddressType | null>(null);

	const handleEdit = (addr: AddressType) => {
		setEditAddress(addr);
		setModalOpen(true);
	};

	const handleAdd = () => {
		setEditAddress(null);
		setModalOpen(true);
	};

	return (
		<div>
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-2xl font-bold text-foreground">My Addresses</h1>
				<Button variant="primary" size="sm" onPress={handleAdd}>
					<Plus size={14} />
					Add address
				</Button>
			</div>

			{isLoading ? (
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					{[1, 2].map((i) => (
						<Skeleton key={i} className="h-40 rounded-2xl" />
					))}
				</div>
			) : addresses.length === 0 ? (
				<div className="border border-dashed border-border rounded-2xl p-12 text-center space-y-3">
					<MapPin size={28} className="text-muted mx-auto" />
					<p className="text-foreground font-semibold">No addresses yet</p>
					<p className="text-muted text-sm">
						Add an address to speed up checkout.
					</p>
					<Button variant="primary" size="sm" onPress={handleAdd}>
						Add your first address
					</Button>
				</div>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					{addresses.map((addr) => (
						<AddressCard key={addr.id} address={addr} onEdit={handleEdit} />
					))}
				</div>
			)}

			<AddressFormModal
				isOpen={modalOpen}
				onClose={() => setModalOpen(false)}
				editAddress={editAddress}
			/>
		</div>
	);
}
