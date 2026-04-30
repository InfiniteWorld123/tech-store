import {
	boolean,
	index,
	numeric,
	pgTable,
	text,
	unique,
	uuid,
} from "drizzle-orm/pg-core";
import { user } from "./auth";
import { product } from "./catalog";
import { timestamps, uuidId } from "./shared";

export const address = pgTable(
	"address",
	{
		id: uuidId(),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		fullName: text("full_name").notNull(),
		phone: text("phone").notNull(),
		street: text("street").notNull(),
		postalCode: text("postal_code").notNull(),
		city: text("city").notNull(),
		state: text("state"),
		country: text("country").notNull(),
		isDefault: boolean("is_default").default(false).notNull(),
		...timestamps,
	},
	(table) => [index("address_user_id_idx").on(table.userId)],
);

export const review = pgTable(
	"review",
	{
		id: uuidId(),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		productId: uuid("product_id")
			.notNull()
			.references(() => product.id, { onDelete: "cascade" }),
		rating: numeric("rating", { precision: 2, scale: 1 }).notNull(),
		title: text("title").notNull(),
		comment: text("comment").notNull(),
		...timestamps,
	},
	(table) => [
		unique("review_user_product_unique").on(table.userId, table.productId),
		index("review_product_id_idx").on(table.productId),
	],
);
