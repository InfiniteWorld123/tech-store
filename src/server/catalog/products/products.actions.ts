import { createServerFn } from "@tanstack/react-start";
import { ensureSession } from "../../auth/ensure-session.middleware";
import {
	createProductValidationSchema,
	deleteProductsValidationSchema,
	deleteProductValidationSchema,
	getProductsValidationSchema,
	getProductValidationSchema,
	updateProductValidationSchema,
} from "./products.schemas";
import { createProduct } from "./services/create-product.service";
import { deleteProduct } from "./services/delete-product.service";
import { deleteProducts } from "./services/delete-products.service";
import { getProduct } from "./services/get-product.service";
import { getProducts } from "./services/get-products.service";
import { updateProduct } from "./services/update-product.service";

export const getProductAction = createServerFn({ method: "GET" })
	.middleware([ensureSession])
	.inputValidator(getProductValidationSchema)
	.handler(async ({ data }) => {
		return getProduct(data);
	});

export const getProductsAction = createServerFn({ method: "GET" })
	.middleware([ensureSession])
	.inputValidator(getProductsValidationSchema)
	.handler(async ({ data }) => {
		return getProducts(data);
	});

export const createProductAction = createServerFn({ method: "POST" })
	.middleware([ensureSession])
	.inputValidator(createProductValidationSchema)
	.handler(async ({ data }) => {
		return createProduct(data);
	});

export const updateProductAction = createServerFn({ method: "POST" })
	.middleware([ensureSession])
	.inputValidator(updateProductValidationSchema)
	.handler(async ({ data }) => {
		return updateProduct(data);
	});

export const deleteProductAction = createServerFn({ method: "POST" })
	.middleware([ensureSession])
	.inputValidator(deleteProductValidationSchema)
	.handler(async ({ data }) => {
		return deleteProduct(data);
	});

export const deleteProductsAction = createServerFn({ method: "POST" })
	.middleware([ensureSession])
	.inputValidator(deleteProductsValidationSchema)
	.handler(async ({ data }) => {
		return deleteProducts(data);
	});
