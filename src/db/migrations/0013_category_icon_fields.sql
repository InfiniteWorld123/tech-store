ALTER TABLE "category" DROP COLUMN "image";--> statement-breakpoint
ALTER TABLE "category" ADD COLUMN "icon" text;--> statement-breakpoint
ALTER TABLE "category" ADD COLUMN "icon_color" text;--> statement-breakpoint
ALTER TABLE "category" ADD COLUMN "icon_bg" text;
