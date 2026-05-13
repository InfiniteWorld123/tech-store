ALTER TABLE "category" ADD CONSTRAINT "category_name_unique" UNIQUE("name");--> statement-breakpoint
ALTER TABLE "color" ADD CONSTRAINT "color_name_unique" UNIQUE("name");--> statement-breakpoint
ALTER TABLE "color" ADD CONSTRAINT "color_hex_code_unique" UNIQUE("hex_code");