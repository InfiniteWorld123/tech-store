import { createServerFn } from "@tanstack/react-start";
import { ensureAdmin } from "../../auth/ensure-session.middleware";
import {
	createProductSchema,
	deleteProductSchema,
	deleteProductsSchema,
	getProductBySlugSchema,
	getProductSchema,
	getProductsSchema,
	updateProductSchema,
} from "./products.schemas";
import { createProduct } from "./services/create-product.service";
import { deleteProduct } from "./services/delete-product.service";
import { deleteProducts } from "./services/delete-products.service";
import { getProduct } from "./services/get-product.service";
import { getProductBySlug } from "./services/get-product-by-slug.service";
import { getProducts } from "./services/get-products.service";
import { updateProduct } from "./services/update-product.service";

export const getProductAction = createServerFn({ method: "GET" })
	.inputValidator(getProductSchema)
	.handler(async ({ data }) => {
		return getProduct(data);
	});

export const getProductBySlugAction = createServerFn({ method: "GET" })
	.inputValidator(getProductBySlugSchema)
	.handler(async ({ data }) => {
		return getProductBySlug(data);
	});

export const getProductsAction = createServerFn({ method: "GET" })
	.inputValidator(getProductsSchema)
	.handler(async ({ data }) => {
		return getProducts(data);
	});

export const createProductAction = createServerFn({ method: "POST" })
	.middleware([ensureAdmin])
	.inputValidator(createProductSchema)
	.handler(async ({ data }) => {
		return createProduct(data);
	});

export const updateProductAction = createServerFn({ method: "POST" })
	.middleware([ensureAdmin])
	.inputValidator(updateProductSchema)
	.handler(async ({ data }) => {
		return updateProduct(data);
	});

export const deleteProductAction = createServerFn({ method: "POST" })
	.middleware([ensureAdmin])
	.inputValidator(deleteProductSchema)
	.handler(async ({ data }) => {
		return deleteProduct(data);
	});

export const deleteProductsAction = createServerFn({ method: "POST" })
	.middleware([ensureAdmin])
	.inputValidator(deleteProductsSchema)
	.handler(async ({ data }) => {
		return deleteProducts(data);
	});
