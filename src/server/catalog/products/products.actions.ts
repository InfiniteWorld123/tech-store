import { createServerFn } from "@tanstack/react-start";
import { ensureSession } from "../../auth/ensure-session.middleware";
import {
	createProductSchema,
	deleteProductSchema,
	deleteProductsSchema,
	getProductSchema,
	getProductsSchema,
	updateProductSchema,
} from "./products.schemas";
import { createProduct } from "./services/create-product.service";
import { deleteProduct } from "./services/delete-product.service";
import { deleteProducts } from "./services/delete-products.service";
import { getProduct } from "./services/get-product.service";
import { getProducts } from "./services/get-products.service";
import { updateProduct } from "./services/update-product.service";

export const getProductAction = createServerFn({ method: "GET" })
	.middleware([ensureSession])
	.inputValidator(getProductSchema)
	.handler(async ({ data }) => {
		return getProduct(data);
	});

export const getProductsAction = createServerFn({ method: "GET" })
	.middleware([ensureSession])
	.inputValidator(getProductsSchema)
	.handler(async ({ data }) => {
		return getProducts(data);
	});

export const createProductAction = createServerFn({ method: "POST" })
	.middleware([ensureSession])
	.inputValidator(createProductSchema)
	.handler(async ({ data }) => {
		return createProduct(data);
	});

export const updateProductAction = createServerFn({ method: "POST" })
	.middleware([ensureSession])
	.inputValidator(updateProductSchema)
	.handler(async ({ data }) => {
		return updateProduct(data);
	});

export const deleteProductAction = createServerFn({ method: "POST" })
	.middleware([ensureSession])
	.inputValidator(deleteProductSchema)
	.handler(async ({ data }) => {
		return deleteProduct(data);
	});

export const deleteProductsAction = createServerFn({ method: "POST" })
	.middleware([ensureSession])
	.inputValidator(deleteProductsSchema)
	.handler(async ({ data }) => {
		return deleteProducts(data);
	});
