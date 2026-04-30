ALTER TABLE "order" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
UPDATE "order"
SET "status" = CASE
	WHEN "status" = 'delivered' THEN 'completed'
	WHEN "status" = 'shipped' THEN 'processing'
	ELSE "status"
END;--> statement-breakpoint
DROP TYPE "public"."order_status";--> statement-breakpoint
CREATE TYPE "public"."order_status" AS ENUM('pending', 'processing', 'completed', 'cancelled');--> statement-breakpoint
ALTER TABLE "order" ALTER COLUMN "status" SET DATA TYPE "public"."order_status" USING "status"::"public"."order_status";
