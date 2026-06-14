import type { z } from "zod";
import type { AdminVariantType } from "../variants/variants.types";
import type {
	createProductSchema,
	deleteProductSchema,
	deleteProductsSchema,
	getProductBySlugSchema,
	getProductSchema,
	getProductsSchema,
	updateProductSchema,
} from "./products.schemas";

export type AdminProductListItemType = {
	id: string;
	name: string;
	image: string | null;
	slug: string;
	brand: string;
	sku: string | null;
	defaultVariantId: string | null;
	price: number | null;
	compareAtPrice: number | null;
	stockQuantity: number | null;
	reviewsCount: number;
	ratingAvg: number;
	isFeatured: boolean;
	isBestseller: boolean;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
};

export type AdminProductDetailsType = {
	id: string;
	category: {
		id: string;
		name: string;
		slug: string;
		icon: string | null;
		iconColor: string | null;
		iconBg: string | null;
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
	variants: AdminVariantType[];
};

// input types
export type GetProductInputType = z.infer<typeof getProductSchema>;
export type GetProductBySlugInputType = z.infer<typeof getProductBySlugSchema>;
export type GetProductsInputType = z.infer<typeof getProductsSchema>;
export type CreateProductInputType = z.infer<typeof createProductSchema>;
export type UpdateProductInputType = z.infer<typeof updateProductSchema>;
export type DeleteProductInputType = z.infer<typeof deleteProductSchema>;
export type DeleteProductsInputType = z.infer<typeof deleteProductsSchema>;

// output types
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

export type AdminProductMutationType = {
	id: string;
	categoryId: string;
	name: string;
	brand: string;
	slug: string;
	shortDescription: string | null;
	description: string;
	warrantyInfo: string | null;
	image: string | null;
	ratingAvg: string;
	reviewsCount: number;
	isFeatured: boolean;
	isBestseller: boolean;
	isActive: boolean;
	createdAt: Date;
	updatedAt: Date;
};

export type CreateProductOutputType = {
	product: AdminProductMutationType;
};

export type UpdateProductOutputType = {
	product: AdminProductMutationType;
};

export type DeleteProductOutputType = {
	productId: DeleteProductInputType["productId"];
};

export type DeleteProductsOutputType = {
	productIds: DeleteProductsInputType["productIds"];
};
