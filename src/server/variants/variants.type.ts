import type { z } from "zod";
import type {
	createVariantValidationSchema,
	deleteVariantValidationSchema,
	updateVariantValidationSchema,
} from "./variants.validation";

export type CreateVariantInputType = z.infer<
	typeof createVariantValidationSchema
>;
export type UpdateVariantInputType = z.infer<
	typeof updateVariantValidationSchema
>;
export type DeleteVariantInputType = z.infer<
	typeof deleteVariantValidationSchema
>;

export type AdminVariantType = {
	id: string;
	sku: string;
	price: number;
	compareAtPrice: number | null;
	stockQuantity: number;
	isDefault: boolean;
	images: string[];
	color: {
		id: string;
		name: string;
		hexCode: string | null;
	} | null;
	storage: {
		id: string;
		name: string;
		valueGb: number;
	} | null;
	ram: {
		id: string;
		name: string;
		valueGb: number;
	} | null;
	screenSize: {
		id: string;
		name: string;
		valueInches: number;
	} | null;
	createdAt: string;
	updatedAt: string;
};

export type AdminVariantMutationType = {
	id: string;
	productId: string;
	sku: string;
	price: number;
	compareAtPrice: number | null;
	stockQuantity: number;
	colorId: string | null;
	storageId: string | null;
	ramId: string | null;
	screenSizeId: string | null;
	isDefault: boolean;
	images: string[];
	createdAt: string;
	updatedAt: string;
};

export type CreateVariantOutputType = {
	variant: AdminVariantMutationType;
};

export type UpdateVariantOutputType = {
	variant: AdminVariantMutationType;
};

export type DeleteVariantOutputType = {
	variantId: DeleteVariantInputType["variantId"];
	productId: string;
	promotedVariantId: string | null;
};
