CREATE TABLE "variant_image" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"variant_id" uuid NOT NULL,
	"image" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "variant_image" ADD CONSTRAINT "variant_image_variant_id_variant_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."variant"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "variant_image_variant_id_idx" ON "variant_image" USING btree ("variant_id");--> statement-breakpoint
CREATE INDEX "variant_image_sort_order_idx" ON "variant_image" USING btree ("sort_order");--> statement-breakpoint
ALTER TABLE "variant" DROP COLUMN "image";