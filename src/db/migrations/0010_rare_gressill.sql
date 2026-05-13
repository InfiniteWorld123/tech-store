ALTER TABLE "ram" ADD CONSTRAINT "ram_name_unique" UNIQUE("name");--> statement-breakpoint
ALTER TABLE "ram" ADD CONSTRAINT "ram_value_gb_unique" UNIQUE("value_gb");--> statement-breakpoint
ALTER TABLE "screen_size" ADD CONSTRAINT "screen_size_name_unique" UNIQUE("name");--> statement-breakpoint
ALTER TABLE "screen_size" ADD CONSTRAINT "screen_size_value_inches_unique" UNIQUE("value_inches");--> statement-breakpoint
ALTER TABLE "storage" ADD CONSTRAINT "storage_name_unique" UNIQUE("name");--> statement-breakpoint
ALTER TABLE "storage" ADD CONSTRAINT "storage_value_gb_unique" UNIQUE("value_gb");