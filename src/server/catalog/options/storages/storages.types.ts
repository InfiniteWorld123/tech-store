import type z from "zod";
import type {
	createStorageSchema,
	deleteStorageSchema,
	deleteStoragesSchema,
	listStoragesSchema,
	updateStorageSchema,
} from "./storages.schemas";

// helper types
export type Storage = {
	id: string;
	name: string;
	valueGb: number;
	createdAt: string;
	updatedAt: string;
};

// input types
export type CreateStorageInputType = z.infer<typeof createStorageSchema>;

export type DeleteStorageInputType = z.infer<typeof deleteStorageSchema>;

export type DeleteStoragesInputType = z.infer<typeof deleteStoragesSchema>;

export type ListStoragesInputType = z.infer<typeof listStoragesSchema>;

export type UpdateStorageInputType = z.infer<typeof updateStorageSchema>;

// output types
export type CreateStorageOutputType = Storage;

export type DeleteStorageOutputType = Storage;

export type DeleteStoragesOutputType = {
	storages: Storage[];
};

export type ListStoragesOutputType = {
	storages: Storage[];
	query: {
		searching?: ListStoragesInputType["searching"];
	};
};

export type UpdateStorageOutputType = Storage;
