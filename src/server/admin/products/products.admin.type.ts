import type { z } from "zod";
import type {
	createProductValidationSchema,
	deleteProductsValidationSchema,
	deleteProductValidationSchema,
	getProductsValidationSchema,
	getProductValidationSchema,
	updateProductValidationSchema,
} from "./products.admin.validation";

export type GetProductInputType = z.infer<typeof getProductValidationSchema>;
export type GetProductsInputType = z.infer<typeof getProductsValidationSchema>;
export type CreateProductInputType = z.infer<typeof createProductValidationSchema>;
export type UpdateProductInputType = z.infer<typeof updateProductValidationSchema>;
export type DeleteProductInputType = z.infer<typeof deleteProductValidationSchema>;
export type DeleteProductsInputType = z.infer<typeof deleteProductsValidationSchema>;

export type AdminProductListItemType = {
	id: string;
	name: string;
	image: string | null;
	slug: string;
	brand: string;
	sku: string;
	price: number;
	compareAtPrice: number | null;
	stockQuantity: number;
	reviewsCount: number;
	ratingAvg: number;
	isFeatured: boolean;
	isBestseller: boolean;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
};

export type AdminProductVariantType = {
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

export type AdminProductDetailsType = {
	id: string;
	category: {
		id: string;
		name: string;
		slug: string;
		image: string | null;
	};
	name: string;
	brand: string;
	slug: string;
	shortDescription: string | null;
	description: string;
	warrantyInfo: string | null;
	image: string | null;
	ratingAvg: number;
	reviewsCount: number;
	isFeatured: boolean;
	isBestseller: boolean;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
	variants: AdminProductVariantType[];
};

export type GetProductsOutputType = {
	items: AdminProductListItemType[];
	query: {
		searching?: GetProductsInputType["searching"];
		sorting?: GetProductsInputType["sorting"];
		filters?: GetProductsInputType["filters"];
		flags?: GetProductsInputType["flags"];
		ranges?: GetProductsInputType["ranges"];
	};
	pagination: {
		page: GetProductsInputType["pagination"]["page"];
		limit: GetProductsInputType["pagination"]["limit"];
		total: number;
		totalPages: number;
		hasNextPage: boolean;
		hasPreviousPage: boolean;
	};
};

export type GetProductOutputType = {
	product: AdminProductDetailsType | null;
};

export type CreateProductOutputType = {
	product: CreateProductInputType;
};

export type UpdateProductOutputType = {
	product: UpdateProductInputType;
};

export type DeleteProductOutputType = {
	productId: DeleteProductInputType["productId"];
};

export type DeleteProductsOutputType = {
	productIds: DeleteProductsInputType["productIds"];
};
